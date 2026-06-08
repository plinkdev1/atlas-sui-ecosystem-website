-- Create cookie_consents table for persistent consent tracking
-- Used by all non-authenticated users to track cookie acceptance

CREATE TABLE IF NOT EXISTS cookie_consents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_identifier UUID NOT NULL UNIQUE,
  analytics_accepted BOOLEAN NOT NULL DEFAULT false,
  marketing_accepted BOOLEAN NOT NULL DEFAULT false,
  essential_accepted BOOLEAN NOT NULL DEFAULT true,
  consent_given BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (now() + INTERVAL '90 days')
);

-- Create index on user_identifier for fast lookups
CREATE INDEX IF NOT EXISTS idx_cookie_consents_user_id ON cookie_consents(user_identifier);
CREATE INDEX IF NOT EXISTS idx_cookie_consents_expires ON cookie_consents(expires_at);

-- Enable RLS but allow public reads for consent checks
ALTER TABLE cookie_consents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert on cookie_consents" ON cookie_consents
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update on cookie_consents" ON cookie_consents
  FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Allow public read on cookie_consents" ON cookie_consents
  FOR SELECT USING (true);
