-- Create subscription_history table for audit trail and analytics
CREATE TABLE IF NOT EXISTS subscription_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN ('created', 'renewed', 'canceled', 'upgraded', 'downgraded')),
  tier TEXT NOT NULL CHECK (tier IN ('free', 'pro', 'pro+')),
  previous_tier TEXT CHECK (previous_tier IN ('free', 'pro', 'pro+', NULL)),
  duration_days INTEGER,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_subscription_history_user_id ON subscription_history(user_id);
CREATE INDEX IF NOT EXISTS idx_subscription_history_event_type ON subscription_history(event_type);
CREATE INDEX IF NOT EXISTS idx_subscription_history_timestamp ON subscription_history(timestamp);

-- Enable RLS
ALTER TABLE subscription_history ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can read their own history
CREATE POLICY "Users can read their own subscription history" ON subscription_history
  FOR SELECT USING (auth.uid() = user_id);

-- RLS Policy: Service role can do anything
CREATE POLICY "Service role can manage subscription history" ON subscription_history
  FOR ALL USING (auth.role() = 'service_role');
