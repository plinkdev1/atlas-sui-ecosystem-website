-- Create explorer_cache table for caching blockchain query results
-- This improves performance by caching expensive blockchain queries for 5 minutes

CREATE TABLE IF NOT EXISTS explorer_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  query_type TEXT NOT NULL, -- 'block', 'tx', 'wallet', 'search', 'assets', 'stats'
  query_value TEXT NOT NULL, -- The actual query value (block height, tx digest, wallet address, etc.)
  data JSONB NOT NULL, -- The cached response data
  network TEXT NOT NULL DEFAULT 'mainnet', -- Network: mainnet, testnet, devnet
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT NOW() + INTERVAL '5 minutes',
  CONSTRAINT valid_query_type CHECK (query_type IN ('block', 'tx', 'wallet', 'search', 'assets', 'stats'))
);

-- Create indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_explorer_cache_query ON explorer_cache(query_type, query_value, network);
CREATE INDEX IF NOT EXISTS idx_explorer_cache_expires ON explorer_cache(expires_at);

-- Create a function to clean up expired cache entries
CREATE OR REPLACE FUNCTION clean_expired_explorer_cache()
RETURNS void AS $$
BEGIN
  DELETE FROM explorer_cache WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Comments for documentation
COMMENT ON TABLE explorer_cache IS 'Caches blockchain explorer query results to improve performance and reduce API calls';
COMMENT ON COLUMN explorer_cache.query_type IS 'Type of query: block, tx, wallet, search, assets, or stats';
COMMENT ON COLUMN explorer_cache.query_value IS 'The query parameter value (block height, transaction digest, wallet address, etc.)';
COMMENT ON COLUMN explorer_cache.data IS 'Cached JSON response data from the blockchain or indexer';
COMMENT ON COLUMN explorer_cache.network IS 'Network the query was executed on (mainnet, testnet, devnet)';
COMMENT ON COLUMN explorer_cache.expires_at IS 'Expiration timestamp - cache entries are valid for 5 minutes by default';
