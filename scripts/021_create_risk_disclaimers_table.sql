-- Create risk_disclaimers table for mandatory risk acceptance
CREATE TABLE IF NOT EXISTS public.risk_disclaimers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_identifier text NOT NULL, -- wallet address or session ID
  version text DEFAULT '1.0',
  accepted boolean DEFAULT false,
  ip_address inet,
  user_agent text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_identifier)
);

-- Enable RLS
ALTER TABLE public.risk_disclaimers ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX idx_risk_disclaimers_user ON risk_disclaimers(user_identifier);
CREATE INDEX idx_risk_disclaimers_accepted ON risk_disclaimers(accepted);

-- RLS Policies
CREATE POLICY "Public can insert risk disclaimers" ON risk_disclaimers
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view own disclaimer" ON risk_disclaimers
  FOR SELECT USING (user_identifier = auth.uid()::text OR user_identifier IS NOT NULL);

CREATE POLICY "Users can update own disclaimer" ON risk_disclaimers
  FOR UPDATE USING (user_identifier = auth.uid()::text OR user_identifier IS NOT NULL);

CREATE POLICY "Admins can view all disclaimers" ON risk_disclaimers
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Function to update timestamp
CREATE OR REPLACE FUNCTION update_risk_disclaimers_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger
CREATE TRIGGER risk_disclaimers_updated_at_trigger
BEFORE UPDATE ON risk_disclaimers
FOR EACH ROW
EXECUTE FUNCTION update_risk_disclaimers_updated_at();
