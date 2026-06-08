-- Convert from CREATE TABLE to ALTER TABLE since entitlements table already exists
-- This script safely adds missing columns and policies to the existing entitlements table

-- Add missing columns if they don't exist
ALTER TABLE public.entitlements
ADD COLUMN IF NOT EXISTS amount_paid decimal(20, 8),
ADD COLUMN IF NOT EXISTS coin_type text DEFAULT 'SUI',
ADD COLUMN IF NOT EXISTS payment_method text,
ADD COLUMN IF NOT EXISTS auto_renew boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS created_at timestamp with time zone DEFAULT now(),
ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT now();

-- Ensure RLS is enabled
ALTER TABLE public.entitlements ENABLE ROW LEVEL SECURITY;

-- Only create policies that don't already exist
-- Policy: Users can insert their own entitlements
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'entitlements' AND policyname = 'Users can insert own entitlements'
  ) THEN
    CREATE POLICY "Users can insert own entitlements"
      ON public.entitlements FOR INSERT
      WITH CHECK (user_id = auth.uid()::text);
  END IF;
END
$$;

-- Policy: Users can update their own entitlements
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'entitlements' AND policyname = 'Users can update own entitlements'
  ) THEN
    CREATE POLICY "Users can update own entitlements"
      ON public.entitlements FOR UPDATE
      USING (user_id = auth.uid()::text)
      WITH CHECK (user_id = auth.uid()::text);
  END IF;
END
$$;

-- Policy: Users can delete their own entitlements
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'entitlements' AND policyname = 'Users can delete own entitlements'
  ) THEN
    CREATE POLICY "Users can delete own entitlements"
      ON public.entitlements FOR DELETE
      USING (user_id = auth.uid()::text);
  END IF;
END
$$;

-- Policy: Admins can view all entitlements
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'entitlements' AND policyname = 'Admins can view all entitlements'
  ) THEN
    CREATE POLICY "Admins can view all entitlements"
      ON public.entitlements FOR SELECT
      USING (
        EXISTS (
          SELECT 1 FROM public.user_profiles
          WHERE user_profiles.id = auth.uid()
          AND user_profiles.is_admin = true
        )
      );
  END IF;
END
$$;

-- Policy: Admins can update all entitlements
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'entitlements' AND policyname = 'Admins can update all entitlements'
  ) THEN
    CREATE POLICY "Admins can update all entitlements"
      ON public.entitlements FOR UPDATE
      USING (
        EXISTS (
          SELECT 1 FROM public.user_profiles
          WHERE user_profiles.id = auth.uid()
          AND user_profiles.is_admin = true
        )
      );
  END IF;
END
$$;

-- Policy: Admins can delete all entitlements
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'entitlements' AND policyname = 'Admins can delete all entitlements'
  ) THEN
    CREATE POLICY "Admins can delete all entitlements"
      ON public.entitlements FOR DELETE
      USING (
        EXISTS (
          SELECT 1 FROM public.user_profiles
          WHERE user_profiles.id = auth.uid()
          AND user_profiles.is_admin = true
        )
      );
  END IF;
END
$$;

-- Removed invalid ADD CONSTRAINT IF NOT EXISTS syntax (PostgreSQL doesn't support this)
-- Create indexes for faster queries if they don't exist
CREATE INDEX IF NOT EXISTS idx_entitlements_user_id ON public.entitlements(user_id);
CREATE INDEX IF NOT EXISTS idx_entitlements_provider_id ON public.entitlements(provider_id);
CREATE INDEX IF NOT EXISTS idx_entitlements_status ON public.entitlements(status);
CREATE INDEX IF NOT EXISTS idx_entitlements_expires_at ON public.entitlements(expires_at);
CREATE INDEX IF NOT EXISTS idx_entitlements_purchase_date ON public.entitlements(purchased_at DESC);
