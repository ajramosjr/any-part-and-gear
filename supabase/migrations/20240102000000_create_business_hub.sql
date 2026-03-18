-- ============================================================
-- A.P.G Business Hub
-- ============================================================

-- businesses table
create table if not exists public.businesses (
  id           uuid primary key default gen_random_uuid(),
  owner_id     uuid references auth.users(id) on delete set null,
  name         text not null,
  description  text,
  address      text,
  city         text,
  state        text,
  phone        text,
  website      text,
  photo_url    text,
  specialties  text[]  not null default '{}',
  verified     boolean not null default false,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

alter table public.businesses enable row level security;

-- anyone can read businesses
create policy "businesses_select_all"
  on public.businesses for select
  using (true);

-- authenticated users can insert
create policy "businesses_insert_auth"
  on public.businesses for insert
  with check (auth.uid() = owner_id);

-- only owner can update their business
create policy "businesses_update_owner"
  on public.businesses for update
  using (auth.uid() = owner_id);

-- only owner can delete their business
create policy "businesses_delete_owner"
  on public.businesses for delete
  using (auth.uid() = owner_id);

-- keep updated_at fresh
-- Note: depends on public.handle_updated_at() defined in 20240101000000_create_profiles.sql
create trigger on_businesses_updated
  before update on public.businesses
  for each row execute procedure public.handle_updated_at();

-- ============================================================
-- business_reviews table
-- ============================================================

create table if not exists public.business_reviews (
  id           uuid primary key default gen_random_uuid(),
  business_id  uuid not null references public.businesses(id) on delete cascade,
  user_id      uuid not null references auth.users(id) on delete cascade,
  rating       smallint not null check (rating >= 1 and rating <= 5),
  comment      text,
  created_at   timestamptz not null default now(),
  -- one review per user per business
  unique (business_id, user_id)
);

alter table public.business_reviews enable row level security;

-- anyone can read reviews
create policy "business_reviews_select_all"
  on public.business_reviews for select
  using (true);

-- authenticated users can insert their own review
create policy "business_reviews_insert_auth"
  on public.business_reviews for insert
  with check (auth.uid() = user_id);

-- users can update their own review
create policy "business_reviews_update_own"
  on public.business_reviews for update
  using (auth.uid() = user_id);

-- users can delete their own review
create policy "business_reviews_delete_own"
  on public.business_reviews for delete
  using (auth.uid() = user_id);
