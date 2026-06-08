-- Create user_delegations table to track staking positions and delegation history
CREATE TABLE IF NOT EXISTS public.user_delegations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address TEXT NOT NULL,
  validator_address TEXT NOT NULL,
  delegation_amount BIGINT NOT NULL,
  rewards_pending BIGINT NOT NULL DEFAULT 0,
  rewards_total BIGINT NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'unstaking', 'undelegated')),
  delegated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  last_reward_claim TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE(wallet_address, validator_address)
);

-- Create indexes for performance
CREATE INDEX idx_user_delegations_wallet ON public.user_delegations(wallet_address);
CREATE INDEX idx_user_delegations_validator ON public.user_delegations(validator_address);
CREATE INDEX idx_user_delegations_status ON public.user_delegations(status);

-- Enable RLS
ALTER TABLE public.user_delegations ENABLE ROW LEVEL SECURITY;

-- RLS policy: Users can view their own delegations
CREATE POLICY "Users can view own delegations" ON public.user_delegations
  FOR SELECT
  USING (wallet_address = current_user_address());

-- RLS policy: Users can update their own delegations
CREATE POLICY "Users can update own delegations" ON public.user_delegations
  FOR UPDATE
  USING (wallet_address = current_user_address());

-- RLS policy: Users can insert their own delegations
CREATE POLICY "Users can insert own delegations" ON public.user_delegations
  FOR INSERT
  WITH CHECK (wallet_address = current_user_address());
