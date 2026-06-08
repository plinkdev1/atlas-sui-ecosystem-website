-- Create airpoints_balance table for unified Airpoints system
-- Shared across Flipper, Atlas Protocol, and future Treezures Labs apps
CREATE TABLE IF NOT EXISTS airpoints_balance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  wallet_address TEXT NOT NULL UNIQUE,
  balance BIGINT NOT NULL DEFAULT 0,
  tier TEXT NOT NULL DEFAULT 'free' CHECK (tier IN ('free', 'pro', 'pro+')),
  last_earned TIMESTAMPTZ,
  last_updated TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_airpoints_balance_user_id ON airpoints_balance(user_id);
CREATE INDEX IF NOT EXISTS idx_airpoints_balance_wallet ON airpoints_balance(wallet_address);
CREATE INDEX IF NOT EXISTS idx_airpoints_balance_tier ON airpoints_balance(tier);

-- Enable RLS
ALTER TABLE airpoints_balance ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can read their own airpoints balance
CREATE POLICY "Users can read their own airpoints balance" ON airpoints_balance
  FOR SELECT USING (auth.uid() = user_id);

-- RLS Policy: Users can update their own balance (for testing/mock)
CREATE POLICY "Users can update their own airpoints balance" ON airpoints_balance
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policy: Service role can do anything (for API routes and server operations)
CREATE POLICY "Service role can manage airpoints balance" ON airpoints_balance
  FOR ALL USING (auth.role() = 'service_role');

-- Function to update last_updated timestamp
CREATE OR REPLACE FUNCTION update_airpoints_balance_last_updated()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_updated = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update last_updated
DROP TRIGGER IF EXISTS update_airpoints_balance_last_updated_trigger ON airpoints_balance;
CREATE TRIGGER update_airpoints_balance_last_updated_trigger
  BEFORE UPDATE ON airpoints_balance
  FOR EACH ROW
  EXECUTE FUNCTION update_airpoints_balance_last_updated();
