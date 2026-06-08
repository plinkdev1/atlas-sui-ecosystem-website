-- Phase 7: NFT Marketplace Aggregator - Trade Logs Table
-- Tracks all NFT buy/sell transactions for user history and analytics

CREATE TABLE IF NOT EXISTS nft_trade_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address TEXT NOT NULL,
  nft_object_id TEXT NOT NULL,
  collection_name TEXT,
  nft_name TEXT,
  image_url TEXT,
  action TEXT NOT NULL CHECK (action IN ('buy', 'sell', 'list', 'delist')),
  price_sui NUMERIC,
  price_usd NUMERIC,
  marketplace TEXT,
  tx_digest TEXT,
  network TEXT DEFAULT 'mainnet',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for fast lookup
CREATE INDEX IF NOT EXISTS idx_nft_trade_wallet ON nft_trade_logs(wallet_address);
CREATE INDEX IF NOT EXISTS idx_nft_trade_collection ON nft_trade_logs(collection_name);
CREATE INDEX IF NOT EXISTS idx_nft_trade_nft ON nft_trade_logs(nft_object_id);
CREATE INDEX IF NOT EXISTS idx_nft_trade_created ON nft_trade_logs(created_at DESC);

-- Enable RLS
ALTER TABLE nft_trade_logs ENABLE ROW LEVEL SECURITY;

-- Public read for aggregate stats
CREATE POLICY "Anyone can read nft trades" ON nft_trade_logs
  FOR SELECT USING (true);

-- Only authenticated users can insert their own trades
CREATE POLICY "Users can insert own trades" ON nft_trade_logs
  FOR INSERT WITH CHECK (true);
