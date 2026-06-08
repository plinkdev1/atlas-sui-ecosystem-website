-- Create ads_slots table for footer banner ad rotation
create table if not exists public.ads_slots (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  tagline text not null default '',
  image_url text not null,
  link_url text not null default '',
  cta_text text not null default 'Learn More',
  active boolean default true,
  position integer default 0,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
  -- Removed invalid CHECK constraint with subquery - max 5 active ads enforced in API instead
);

-- Enable RLS
alter table public.ads_slots enable row level security;

-- RLS Policies
create policy "Anyone can view active ads" on public.ads_slots
  for select using (active = true);

-- Updated to use user_profiles.is_admin instead of non-existent user_roles table
create policy "Admins can view all ads" on public.ads_slots
  for select using (
    exists (
      select 1 from public.user_profiles
      where id = auth.uid()
      and is_admin = true
    )
  );

create policy "Only admins can insert ads" on public.ads_slots
  for insert with check (
    exists (
      select 1 from public.user_profiles
      where id = auth.uid()
      and is_admin = true
    )
  );

create policy "Only admins can update ads" on public.ads_slots
  for update using (
    exists (
      select 1 from public.user_profiles
      where id = auth.uid()
      and is_admin = true
    )
  );

create policy "Only admins can delete ads" on public.ads_slots
  for delete using (
    exists (
      select 1 from public.user_profiles
      where id = auth.uid()
      and is_admin = true
    )
  );

-- Indexes for performance
create index ads_slots_active_idx on public.ads_slots(active);
create index ads_slots_position_idx on public.ads_slots(position);
create index ads_slots_created_at_idx on public.ads_slots(created_at desc);

-- Insert initial seed data (3 default ads)
insert into public.ads_slots (title, tagline, image_url, link_url, cta_text, active, position)
values
  ('Partner with Atlas', 'Collaborate to advance Sui infrastructure', '/images/atlassymbolwhitepurple.png', '/contact/partnership', 'Learn More', true, 0),
  ('Discover Sui Tools', 'Explore the complete ecosystem', '/images/atlassymbolwhitepurple.png', '/contact/partnership', 'Explore', true, 1),
  ('Join the Community', 'Be part of Sui''s future', '/images/atlassymbolwhitepurple.png', '/contact/partnership', 'Join Now', true, 2)
on conflict do nothing;
