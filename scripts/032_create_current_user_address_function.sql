-- Create function to extract current user's wallet address from JWT
CREATE OR REPLACE FUNCTION current_user_address() RETURNS TEXT AS $$
  SELECT auth.jwt()->>'wallet_address'
$$ LANGUAGE SQL STABLE;

-- Alternative if wallet_address is in metadata
CREATE OR REPLACE FUNCTION current_user_address() RETURNS TEXT AS $$
  SELECT (auth.jwt()->>'user_metadata')::jsonb->>'wallet_address'
$$ LANGUAGE SQL STABLE;
