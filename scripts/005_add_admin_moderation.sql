-- Removed duplicate "status" column (already in 004), only add missing moderation fields
-- Add admin flag to user_profiles table
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS is_admin boolean DEFAULT false;

-- Add moderation fields to providers table (status already exists in 004)
ALTER TABLE public.providers ADD COLUMN IF NOT EXISTS featured boolean DEFAULT false;
ALTER TABLE public.providers ADD COLUMN IF NOT EXISTS moderation_notes text;

-- Create index for moderation queries
CREATE INDEX IF NOT EXISTS idx_providers_status_featured ON public.providers(status, featured);

-- Drop existing RLS policies if they conflict
DROP POLICY IF EXISTS "Admins can view all providers" ON public.providers;
DROP POLICY IF EXISTS "Admins can moderate providers" ON public.providers;

-- Update RLS policies to allow admins to moderate all providers
-- Policy for admins to view all providers
CREATE POLICY "Admins can view all providers"
  ON public.providers FOR SELECT
  USING (
    auth.uid() = user_id OR
    (SELECT is_admin FROM public.user_profiles WHERE id = auth.uid()) = true
  );

-- Policy for admins to update provider moderation fields
CREATE POLICY "Admins can moderate providers"
  ON public.providers FOR UPDATE
  USING ((SELECT is_admin FROM public.user_profiles WHERE id = auth.uid()) = true)
  WITH CHECK ((SELECT is_admin FROM public.user_profiles WHERE id = auth.uid()) = true);
