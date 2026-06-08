-- Create cookie_consents table for GDPR compliance
CREATE TABLE IF NOT EXISTS public.cookie_consents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_identifier text NOT NULL, -- wallet address or session ID
  analytics_accepted boolean DEFAULT false,
  marketing_accepted boolean DEFAULT false,
  essential_accepted boolean DEFAULT true, -- always true
  consent_version text DEFAULT '1.0',
  ip_address inet,
  user_agent text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  expires_at timestamp with time zone DEFAULT (now() + interval '20 days'),
  UNIQUE(user_identifier)
);

-- Enable RLS
ALTER TABLE public.cookie_consents ENABLE ROW LEVEL SECURITY;

-- Create indexes for performance
CREATE INDEX idx_cookie_consents_user ON cookie_consents(user_identifier);
CREATE INDEX idx_cookie_consents_expires ON cookie_consents(expires_at);

-- RLS Policies
CREATE POLICY "Public can insert cookie consents" ON cookie_consents
  FOR INSERT WITH CHECK (true);

-- replaced current_user_id() with auth.uid()::text to use native Supabase function
CREATE POLICY "Users can view own cookie consent" ON cookie_consents
  FOR SELECT USING (user_identifier = auth.uid()::text OR user_identifier IS NOT NULL);

CREATE POLICY "Users can update own cookie consent" ON cookie_consents
  FOR UPDATE USING (user_identifier = auth.uid()::text OR user_identifier IS NOT NULL);

CREATE POLICY "Admins can view all cookie consents" ON cookie_consents
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_cookie_consents_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update timestamp
CREATE TRIGGER cookie_consents_updated_at_trigger
BEFORE UPDATE ON cookie_consents
FOR EACH ROW
EXECUTE FUNCTION update_cookie_consents_updated_at();
