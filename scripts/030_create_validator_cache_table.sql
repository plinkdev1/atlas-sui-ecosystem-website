-- Create validator_cache table for caching Sui validator data with 1-hour TTL
CREATE TABLE validator_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  validator_address TEXT UNIQUE NOT NULL,
  name TEXT,
  apr NUMERIC,
  commission_rate NUMERIC,
  total_stake TEXT,
  delegators INTEGER,
  uptime_percent NUMERIC,
  epoch INTEGER,
  network TEXT DEFAULT 'mainnet',
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX idx_validator_address ON validator_cache(validator_address);
CREATE INDEX idx_network ON validator_cache(network);

-- Enable RLS
ALTER TABLE validator_cache ENABLE ROW LEVEL SECURITY;

-- Public read access for validator cache (no auth required for discovery)
CREATE POLICY "Public read validator cache"
  ON validator_cache
  FOR SELECT
  USING (true);

-- Only server can insert/update validator cache
CREATE POLICY "Server only write validator cache"
  ON validator_cache
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Server only update validator cache"
  ON validator_cache
  FOR UPDATE
  USING (true);
