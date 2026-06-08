-- Fixed column references to use correct user_profiles schema
-- Create feedback table for collecting user feedback
create table if not exists public.feedback (
  id uuid default gen_random_uuid() primary key,
  rating integer not null check (rating >= 1 and rating <= 5),
  message text not null,
  email text,
  user_id uuid references auth.users(id) on delete set null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.feedback enable row level security;

-- RLS Policies
-- Anyone can insert feedback (anonymous or authenticated)
create policy "Allow anyone to insert feedback" on public.feedback
  for insert with check (true);

-- Users can view their own feedback
create policy "Users can view their own feedback" on public.feedback
  for select using (auth.uid() = user_id or user_id is null);

-- Fixed reference to use user_profiles.id instead of user_profiles.user_id
-- Only admins can delete feedback (via is_admin flag in user_profiles)
create policy "Only admins can delete feedback" on public.feedback
  for delete using (
    exists (
      select 1 from public.user_profiles
      where user_profiles.id = (select id from auth.users where id = auth.uid())
      and user_profiles.is_admin = true
    )
  );

-- Create index for faster queries
create index if not exists idx_feedback_user_id on public.feedback(user_id);
create index if not exists idx_feedback_created_at on public.feedback(created_at desc);
