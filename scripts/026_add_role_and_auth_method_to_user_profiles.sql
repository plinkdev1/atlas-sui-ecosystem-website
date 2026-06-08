-- Add role and auth_method columns to user_profiles
alter table public.user_profiles 
  add column if not exists role text default 'user' check (role in ('user', 'admin', 'partner')),
  add column if not exists auth_method text check (auth_method in ('email', 'wallet', 'zklogin', 'passkey'));

-- Convert existing is_admin boolean to role
update public.user_profiles 
set role = case 
  when is_admin = true then 'admin'
  else 'user'
end
where role is null;

-- Create index for role-based queries
create index if not exists user_profiles_role_idx on public.user_profiles(role);

-- Add RLS policies for role-based access
create policy "admins_can_view_all_profiles"
  on public.user_profiles for select
  using (
    exists (
      select 1 from public.user_profiles up
      where up.id = auth.uid() and up.role = 'admin'
    )
  );

-- Update RLS for partner role
create policy "partners_can_view_own_profile"
  on public.user_profiles for select
  using (
    role = 'partner' and auth.uid() = id
  );

comment on column public.user_profiles.role is 'User role: user (default), admin, or partner';
comment on column public.user_profiles.auth_method is 'Authentication method: email, wallet, zklogin, or passkey';
