-- Create risk_disclaimers table for persistent disclaimer acceptance tracking
-- Tracks which users have acknowledged the risk disclaimer

CREATE TABLE IF NOT EXISTS risk_disclaimers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_identifier UUID NOT NULL UNIQUE,
  accepted BOOLEAN NOT NULL DEFAULT false,
  accepted_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (now() + INTERVAL '365 days')
);

-- Create index on user_identifier for fast lookups
CREATE INDEX IF NOT EXISTS idx_risk_disclaimers_user_id ON risk_disclaimers(user_identifier);
CREATE INDEX IF NOT EXISTS idx_risk_disclaimers_expires ON risk_disclaimers(expires_at);

-- Enable RLS but allow public access
ALTER TABLE risk_disclaimers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert on risk_disclaimers" ON risk_disclaimers
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update on risk_disclaimers" ON risk_disclaimers
  FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Allow public read on risk_disclaimers" ON risk_disclaimers
  FOR SELECT USING (true);
