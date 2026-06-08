-- Create provider_listings table for detailed provider information
CREATE TABLE IF NOT EXISTS public.provider_listings (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  provider_id uuid REFERENCES public.providers(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  description text,
  category text CHECK (category IN ('RPC', 'Indexing', 'Validator', 'Gateway', 'Service')),
  pricing_tier text CHECK (pricing_tier IN ('Free', 'Freemium', 'Premium', 'Custom')),
  website_url text,
  logo_url text,
  features jsonb DEFAULT '[]'::jsonb,
  verified_at timestamp with time zone,
  rejected_at timestamp with time zone,
  rejection_reason text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'featured')),
  featured boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.provider_listings ENABLE ROW LEVEL SECURITY;

-- Policy: Providers can view their own listings
CREATE POLICY "Providers can view own listings"
  ON public.provider_listings FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.providers
      WHERE providers.id = provider_listings.provider_id
      AND providers.user_id = auth.uid()
    )
  );

-- Policy: Providers can create listings
CREATE POLICY "Providers can create listings"
  ON public.provider_listings FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.providers
      WHERE providers.id = provider_listings.provider_id
      AND providers.user_id = auth.uid()
    )
  );

-- Policy: Providers can update their own listings
CREATE POLICY "Providers can update own listings"
  ON public.provider_listings FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.providers
      WHERE providers.id = provider_listings.provider_id
      AND providers.user_id = auth.uid()
    )
  );

-- Policy: Admins can view all listings
CREATE POLICY "Admins can view all listings"
  ON public.provider_listings FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.is_admin = true
    )
  );

-- Policy: Admins can update any listing
CREATE POLICY "Admins can update any listing"
  ON public.provider_listings FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.is_admin = true
    )
  );

-- Public can view approved listings
CREATE POLICY "Public can view approved listings"
  ON public.provider_listings FOR SELECT
  USING (status = 'approved' OR status = 'featured');

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_provider_listings_provider_id ON public.provider_listings(provider_id);
CREATE INDEX IF NOT EXISTS idx_provider_listings_status ON public.provider_listings(status);
CREATE INDEX IF NOT EXISTS idx_provider_listings_category ON public.provider_listings(category);
CREATE INDEX IF NOT EXISTS idx_provider_listings_created_at ON public.provider_listings(created_at DESC);
