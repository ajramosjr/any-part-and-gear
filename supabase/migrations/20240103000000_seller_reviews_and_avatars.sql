-- ============================================================
-- Seller reviews table (user-to-user ratings)
-- ============================================================

create table if not exists public.seller_reviews (
  id           uuid primary key default gen_random_uuid(),
  seller_id    uuid not null references auth.users(id) on delete cascade,
  reviewer_id  uuid not null references auth.users(id) on delete cascade,
  rating       smallint not null check (rating >= 1 and rating <= 5),
  comment      text,
  created_at   timestamptz not null default now(),
  -- one review per reviewer per seller
  unique (seller_id, reviewer_id)
);

alter table public.seller_reviews enable row level security;

-- anyone can read seller reviews
create policy "seller_reviews_select_all"
  on public.seller_reviews for select
  using (true);

-- authenticated users can insert their own review
create policy "seller_reviews_insert_auth"
  on public.seller_reviews for insert
  with check (auth.uid() = reviewer_id);

-- reviewers can update their own review
create policy "seller_reviews_update_own"
  on public.seller_reviews for update
  using (auth.uid() = reviewer_id);

-- reviewers can delete their own review
create policy "seller_reviews_delete_own"
  on public.seller_reviews for delete
  using (auth.uid() = reviewer_id);

-- ============================================================
-- Avatars storage bucket (public)
-- ============================================================

insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- Allow authenticated users to upload avatars to their own folder
create policy "avatars_insert_auth"
  on storage.objects for insert
  with check (
    bucket_id = 'avatars'
    and auth.uid() is not null
  );

-- Allow owners to update/replace their own avatar
create policy "avatars_update_own"
  on storage.objects for update
  using (
    bucket_id = 'avatars'
    and owner = auth.uid()
  );

-- Anyone can read avatars (public bucket)
create policy "avatars_select_all"
  on storage.objects for select
  using (bucket_id = 'avatars');
