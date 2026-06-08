-- Create revenue_records table for tracking financial records
CREATE TABLE IF NOT EXISTS public.revenue_records (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  entitlement_id uuid REFERENCES public.entitlements(id) ON DELETE SET NULL,
  transaction_hash text UNIQUE,
  amount_usd decimal(20, 2),
  amount_sui decimal(20, 8),
  revenue_share_atlas decimal(20, 2),
  revenue_share_provider decimal(20, 2),
  period_month date NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'recorded', 'paid')),
  paid_date timestamp with time zone,
  payout_address text,
  notes text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.revenue_records ENABLE ROW LEVEL SECURITY;

-- Policy: Only admins can view revenue records
CREATE POLICY "Admins can view revenue records"
  ON public.revenue_records FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.is_admin = true
    )
  );

-- Policy: Only admins can update revenue records
CREATE POLICY "Admins can update revenue records"
  ON public.revenue_records FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.is_admin = true
    )
  );

-- Create indexes for faster queries and analytics
CREATE INDEX IF NOT EXISTS idx_revenue_records_entitlement_id ON public.revenue_records(entitlement_id);
CREATE INDEX IF NOT EXISTS idx_revenue_records_period_month ON public.revenue_records(period_month DESC);
CREATE INDEX IF NOT EXISTS idx_revenue_records_status ON public.revenue_records(status);
CREATE INDEX IF NOT EXISTS idx_revenue_records_created_at ON public.revenue_records(created_at DESC);
