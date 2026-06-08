-- Create entitlements table for tracking purchased provider tiers
CREATE TABLE IF NOT EXISTS public.entitlements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  provider_id TEXT NOT NULL,
  tier TEXT NOT NULL,
  transaction_digest TEXT NOT NULL UNIQUE,
  purchased_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() + INTERVAL '1 year',
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'expired', 'revoked')),
  
  UNIQUE(user_id, provider_id, tier)
);

-- Enable RLS
ALTER TABLE public.entitlements ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own entitlements
CREATE POLICY "Users can view own entitlements" ON public.entitlements
  FOR SELECT
  USING (auth.uid()::text = user_id);

-- Policy: Users can create entitlements (via API after payment verification)
CREATE POLICY "API can create entitlements" ON public.entitlements
  FOR INSERT
  WITH CHECK (true);

-- Create index for faster queries
CREATE INDEX idx_entitlements_user_id ON public.entitlements(user_id);
CREATE INDEX idx_entitlements_provider_id ON public.entitlements(provider_id);
