-- Enable Row Level Security on authentication tables
-- This ensures users can only access their own auth credentials

-- Enable RLS on passkey_credentials
ALTER TABLE passkey_credentials ENABLE ROW LEVEL SECURITY;

-- Enable RLS on zklogin_sessions
ALTER TABLE zklogin_sessions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own passkey credentials" ON passkey_credentials;
DROP POLICY IF EXISTS "Users can create own passkey credentials" ON passkey_credentials;
DROP POLICY IF EXISTS "Users can update own passkey credentials" ON passkey_credentials;
DROP POLICY IF EXISTS "Users can delete own passkey credentials" ON passkey_credentials;
DROP POLICY IF EXISTS "Users can view own zklogin sessions" ON zklogin_sessions;
DROP POLICY IF EXISTS "Users can create own zklogin sessions" ON zklogin_sessions;
DROP POLICY IF EXISTS "Users can update own zklogin sessions" ON zklogin_sessions;
DROP POLICY IF EXISTS "Users can delete own zklogin sessions" ON zklogin_sessions;

-- Policies for passkey_credentials
-- Users can only read their own passkey credentials
CREATE POLICY "Users can view own passkey credentials"
  ON passkey_credentials
  FOR SELECT
  USING (user_id = auth.uid());

-- Users can insert their own passkey credentials
CREATE POLICY "Users can create own passkey credentials"
  ON passkey_credentials
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Users can update their own passkey credentials
CREATE POLICY "Users can update own passkey credentials"
  ON passkey_credentials
  FOR UPDATE
  USING (user_id = auth.uid());

-- Users can delete their own passkey credentials
CREATE POLICY "Users can delete own passkey credentials"
  ON passkey_credentials
  FOR DELETE
  USING (user_id = auth.uid());

-- Policies for zklogin_sessions
-- Users can only read their own zklogin sessions
CREATE POLICY "Users can view own zklogin sessions"
  ON zklogin_sessions
  FOR SELECT
  USING (user_id = auth.uid());

-- Users can insert their own zklogin sessions
CREATE POLICY "Users can create own zklogin sessions"
  ON zklogin_sessions
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Users can update their own zklogin sessions
CREATE POLICY "Users can update own zklogin sessions"
  ON zklogin_sessions
  FOR UPDATE
  USING (user_id = auth.uid());

-- Users can delete their own zklogin sessions
CREATE POLICY "Users can delete own zklogin sessions"
  ON zklogin_sessions
  FOR DELETE
  USING (user_id = auth.uid());
