-- Create transactions table for recording on-chain transactions
CREATE TABLE IF NOT EXISTS public.transactions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  tx_hash text UNIQUE NOT NULL,
  tx_type text NOT NULL CHECK (tx_type IN ('burn', 'hide', 'purchase', 'stake', 'swap', 'claim')),
  object_address text,
  object_type text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'success', 'failed')),
  error_message text,
  gas_used integer,
  network text DEFAULT 'testnet' CHECK (network IN ('testnet', 'devnet', 'mainnet')),
  created_at timestamp with time zone DEFAULT now(),
  confirmed_at timestamp with time zone
);

-- Enable Row Level Security
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own transactions
CREATE POLICY "Users can view own transactions"
  ON public.transactions FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own transactions
CREATE POLICY "Users can create transactions"
  ON public.transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_tx_hash ON public.transactions(tx_hash);
CREATE INDEX IF NOT EXISTS idx_transactions_tx_type ON public.transactions(tx_type);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON public.transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON public.transactions(created_at DESC);
