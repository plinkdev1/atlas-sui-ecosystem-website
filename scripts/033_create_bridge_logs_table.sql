-- Create bridge_logs table for tracking cross-chain bridge transactions
CREATE TABLE IF NOT EXISTS bridge_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  wallet_address TEXT NOT NULL,
  source_chain TEXT NOT NULL DEFAULT 'sui',
  dest_chain TEXT NOT NULL,
  token TEXT NOT NULL DEFAULT 'SUI',
  amount NUMERIC NOT NULL,
  provider TEXT NOT NULL,
  source_tx_hash TEXT,
  dest_tx_hash TEXT,
  fee_amount NUMERIC DEFAULT 0,
  fee_token TEXT DEFAULT 'SUI',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirming', 'completed', 'failed', 'refunded')),
  estimated_time_minutes INTEGER,
  actual_time_minutes INTEGER,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_bridge_logs_wallet ON bridge_logs(wallet_address);
CREATE INDEX IF NOT EXISTS idx_bridge_logs_status ON bridge_logs(status);
CREATE INDEX IF NOT EXISTS idx_bridge_logs_created ON bridge_logs(created_at DESC);

-- Enable RLS
ALTER TABLE bridge_logs ENABLE ROW LEVEL SECURITY;

-- RLS policy: users can read their own bridge logs
CREATE POLICY "Users can view own bridge logs" ON bridge_logs
  FOR SELECT USING (true);

-- RLS policy: authenticated users can insert bridge logs
CREATE POLICY "Users can insert bridge logs" ON bridge_logs
  FOR INSERT WITH CHECK (true);

-- RLS policy: users can update their own bridge logs
CREATE POLICY "Users can update own bridge logs" ON bridge_logs
  FOR UPDATE USING (true);
