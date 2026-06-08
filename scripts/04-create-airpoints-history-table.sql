-- Create airpoints_history table for audit trail and transaction logging
-- Tracks all Airpoints earning and redemption events across the ecosystem
CREATE TABLE IF NOT EXISTS airpoints_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  wallet_address TEXT NOT NULL,
  amount BIGINT NOT NULL,
  type TEXT NOT NULL CHECK (type IN (
    'earn_subscription',
    'earn_cleanup',
    'earn_explainer',
    'earn_directory',
    'redeem_discount',
    'redeem_feature',
    'convert_token'
  )),
  description TEXT,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_airpoints_history_user_id ON airpoints_history(user_id);
CREATE INDEX IF NOT EXISTS idx_airpoints_history_wallet ON airpoints_history(wallet_address);
CREATE INDEX IF NOT EXISTS idx_airpoints_history_type ON airpoints_history(type);
CREATE INDEX IF NOT EXISTS idx_airpoints_history_timestamp ON airpoints_history(timestamp);
CREATE INDEX IF NOT EXISTS idx_airpoints_history_user_timestamp ON airpoints_history(user_id, timestamp DESC);

-- Enable RLS
ALTER TABLE airpoints_history ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can read their own history
CREATE POLICY "Users can read their own airpoints history" ON airpoints_history
  FOR SELECT USING (auth.uid() = user_id);

-- RLS Policy: Service role can insert and read all (for server operations)
CREATE POLICY "Service role can manage airpoints history" ON airpoints_history
  FOR ALL USING (auth.role() = 'service_role');

-- Function to log balance changes to history
CREATE OR REPLACE FUNCTION log_airpoints_change()
RETURNS TRIGGER AS $$
BEGIN
  -- This function can be called from triggers or stored procedures
  -- when balance changes occur
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
