-- Create user_data table for storing user preferences (hidden items, votes, etc)
create table if not exists public.user_data (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  data_type text not null,
  asset_id text,
  asset_type text,
  value jsonb,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  unique(user_id, data_type, asset_id)
);

-- Enable RLS
alter table public.user_data enable row level security;

-- Users can only read/write their own data
create policy "users_select_own_data"
  on public.user_data for select
  using (auth.uid() = user_id);

create policy "users_insert_own_data"
  on public.user_data for insert
  with check (auth.uid() = user_id);

create policy "users_update_own_data"
  on public.user_data for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "users_delete_own_data"
  on public.user_data for delete
  using (auth.uid() = user_id);

-- Create indexes
create index if not exists user_data_user_idx on public.user_data(user_id);
create index if not exists user_data_type_idx on public.user_data(user_id, data_type);
create index if not exists user_data_asset_idx on public.user_data(user_id, asset_id);
