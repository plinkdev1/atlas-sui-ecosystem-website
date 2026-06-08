-- Create providers table for storing provider listings
CREATE TABLE IF NOT EXISTS public.providers (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  description text NOT NULL,
  pricing text,
  features text[] DEFAULT '{}',
  website text,
  logo text,
  category text,
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.providers ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own providers
CREATE POLICY "Users can view own providers"
  ON public.providers FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own providers
CREATE POLICY "Users can create providers"
  ON public.providers FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own providers
CREATE POLICY "Users can update own providers"
  ON public.providers FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy: Users can delete their own providers
CREATE POLICY "Users can delete own providers"
  ON public.providers FOR DELETE
  USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX idx_providers_user_id ON public.providers(user_id);
CREATE INDEX idx_providers_status ON public.providers(status);
