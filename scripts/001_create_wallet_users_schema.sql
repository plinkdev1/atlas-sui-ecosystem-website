-- Create wallet users table for persistent wallet-user linking
create table if not exists public.wallet_users (
  id uuid primary key default gen_random_uuid(),
  wallet_address text not null unique,
  created_at timestamp with time zone default now(),
  last_connected_at timestamp with time zone default now(),
  metadata jsonb
);

-- Enable RLS for security
alter table public.wallet_users enable row level security;

-- Allow anyone to read their own wallet record (by address match)
create policy "wallet_users_select_own"
  on public.wallet_users for select
  using (true);

-- Allow inserts for new wallet records
create policy "wallet_users_insert"
  on public.wallet_users for insert
  with check (true);

-- Allow updates to last_connected_at
create policy "wallet_users_update_own"
  on public.wallet_users for update
  using (true)
  with check (true);

-- Create wallet_sessions table for tracking auth sessions
create table if not exists public.wallet_sessions (
  id uuid primary key default gen_random_uuid(),
  wallet_address text not null references public.wallet_users(wallet_address) on delete cascade,
  session_token text not null unique,
  message_to_sign text not null,
  signature text,
  verified_at timestamp with time zone,
  expires_at timestamp with time zone not null default (now() + interval '7 days'),
  created_at timestamp with time zone default now()
);

-- Enable RLS for sessions
alter table public.wallet_sessions enable row level security;

create policy "wallet_sessions_select_own"
  on public.wallet_sessions for select
  using (true);

create policy "wallet_sessions_insert"
  on public.wallet_sessions for insert
  with check (true);

create policy "wallet_sessions_update_own"
  on public.wallet_sessions for update
  using (true)
  with check (true);

-- Create index for faster lookups
create index if not exists wallet_users_address_idx on public.wallet_users(wallet_address);
create index if not exists wallet_sessions_token_idx on public.wallet_sessions(session_token);
create index if not exists wallet_sessions_wallet_idx on public.wallet_sessions(wallet_address);
