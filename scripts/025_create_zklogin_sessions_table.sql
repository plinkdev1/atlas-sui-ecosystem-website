-- Create zklogin_sessions table for ZKLogin ephemeral wallet sessions
-- This tracks ZKLogin authentication sessions with ephemeral addresses

CREATE TABLE IF NOT EXISTS zklogin_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  ephemeral_address TEXT NOT NULL UNIQUE,
  jwt_token TEXT,
  salt TEXT NOT NULL,
  max_epoch BIGINT NOT NULL,
  randomness TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_used_at TIMESTAMPTZ,
  
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES user_profiles(id) ON DELETE SET NULL
);

-- Create indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_zklogin_user_id ON zklogin_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_zklogin_ephemeral_address ON zklogin_sessions(ephemeral_address);
CREATE INDEX IF NOT EXISTS idx_zklogin_expires_at ON zklogin_sessions(expires_at);

-- Add comment
COMMENT ON TABLE zklogin_sessions IS 'Stores ZKLogin ephemeral wallet sessions for zero-knowledge authentication';
