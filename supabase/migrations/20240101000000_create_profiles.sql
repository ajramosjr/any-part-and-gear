-- Create the profiles table linked to auth.users
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  username    text unique,
  full_name   text,
  avatar_url  text,
  website     text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Enable Row Level Security
alter table public.profiles enable row level security;

-- RLS: anyone can read profiles
create policy "Public profiles are viewable by everyone"
  on public.profiles for select
  using (true);

-- RLS: users can insert their own profile
create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (id = auth.uid());

-- RLS: users can update their own profile
create policy "Users can update their own profile"
  on public.profiles for update
  using (id = auth.uid());

-- Function: keep updated_at current on row update
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
security definer
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Trigger: auto-update updated_at
create trigger on_profiles_updated
  before update on public.profiles
  for each row execute procedure public.handle_updated_at();

-- Function: auto-create a profile row when a new auth user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

-- Trigger: fire handle_new_user after each new auth.users insert
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
