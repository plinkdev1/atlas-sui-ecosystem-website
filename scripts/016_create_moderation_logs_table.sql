-- Create moderation_logs table for admin actions
CREATE TABLE IF NOT EXISTS public.moderation_logs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  provider_id uuid REFERENCES public.providers(id) ON DELETE SET NULL,
  listing_id uuid REFERENCES public.provider_listings(id) ON DELETE SET NULL,
  action text NOT NULL CHECK (action IN ('approve', 'reject', 'feature', 'unfeature', 'remove', 'suspend')),
  reason text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.moderation_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Only admins can view moderation logs
CREATE POLICY "Admins can view moderation logs"
  ON public.moderation_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.is_admin = true
    )
  );

-- Policy: Only admins can insert moderation logs
CREATE POLICY "Admins can create moderation logs"
  ON public.moderation_logs FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.is_admin = true
    )
  );

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_moderation_logs_admin_id ON public.moderation_logs(admin_id);
CREATE INDEX IF NOT EXISTS idx_moderation_logs_provider_id ON public.moderation_logs(provider_id);
CREATE INDEX IF NOT EXISTS idx_moderation_logs_action ON public.moderation_logs(action);
CREATE INDEX IF NOT EXISTS idx_moderation_logs_created_at ON public.moderation_logs(created_at DESC);
