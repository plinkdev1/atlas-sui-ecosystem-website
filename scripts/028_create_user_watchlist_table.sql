-- Create user_watchlist table for tracking user's watched assets
CREATE TABLE IF NOT EXISTS user_watchlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  asset_id TEXT NOT NULL,
  asset_type TEXT NOT NULL CHECK (asset_type IN ('token', 'nft', 'pool')),
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure unique watchlist items per user
  UNIQUE(user_id, asset_id, asset_type)
);

-- Enable RLS
ALTER TABLE user_watchlist ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own watchlist" ON user_watchlist;
DROP POLICY IF EXISTS "Users can create own watchlist items" ON user_watchlist;
DROP POLICY IF EXISTS "Users can update own watchlist items" ON user_watchlist;
DROP POLICY IF EXISTS "Users can delete own watchlist items" ON user_watchlist;

-- RLS Policies
CREATE POLICY "Users can view own watchlist"
  ON user_watchlist
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can create own watchlist items"
  ON user_watchlist
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own watchlist items"
  ON user_watchlist
  FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete own watchlist items"
  ON user_watchlist
  FOR DELETE
  USING (user_id = auth.uid());

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_watchlist_user_id ON user_watchlist(user_id);
CREATE INDEX IF NOT EXISTS idx_user_watchlist_asset_id ON user_watchlist(asset_id);
CREATE INDEX IF NOT EXISTS idx_user_watchlist_added_at ON user_watchlist(added_at DESC);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_user_watchlist_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER user_watchlist_updated_at
  BEFORE UPDATE ON user_watchlist
  FOR EACH ROW
  EXECUTE FUNCTION update_user_watchlist_updated_at();
