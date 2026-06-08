-- Create user profiles table for wallet linking
create table if not exists public.user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  wallet_address text unique,
  wallet_name text,
  theme text default 'dark',
  network text default 'mainnet',
  preferred_explorer text,
  analytics_opt_out boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.user_profiles enable row level security;

-- Users can only read/update their own profile
create policy "users_select_own_profile"
  on public.user_profiles for select
  using (auth.uid() = id);

create policy "users_insert_own_profile"
  on public.user_profiles for insert
  with check (auth.uid() = id);

create policy "users_update_own_profile"
  on public.user_profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Create index for wallet lookups
create index if not exists user_profiles_wallet_idx on public.user_profiles(wallet_address);
