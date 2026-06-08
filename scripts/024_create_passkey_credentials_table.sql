-- Create passkey_credentials table for WebAuthn authentication
-- This stores user passkey/credential data for biometric/PIN authentication

CREATE TABLE IF NOT EXISTS passkey_credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  credential_id TEXT NOT NULL UNIQUE,
  public_key TEXT NOT NULL,
  counter BIGINT NOT NULL DEFAULT 0,
  device_type TEXT,
  backed_up BOOLEAN DEFAULT false,
  transports TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_used_at TIMESTAMPTZ,
  
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES user_profiles(id) ON DELETE CASCADE
);

-- Create index for fast lookups
CREATE INDEX IF NOT EXISTS idx_passkey_user_id ON passkey_credentials(user_id);
CREATE INDEX IF NOT EXISTS idx_passkey_credential_id ON passkey_credentials(credential_id);

-- Add comment
COMMENT ON TABLE passkey_credentials IS 'Stores WebAuthn passkey credentials for biometric/PIN authentication';
