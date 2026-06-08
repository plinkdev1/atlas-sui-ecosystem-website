-- Create provider_usage table for tracking analytics per entitlement
CREATE TABLE IF NOT EXISTS public.provider_usage (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  entitlement_id uuid REFERENCES public.entitlements(id) ON DELETE CASCADE NOT NULL,
  requests_count integer DEFAULT 0,
  bandwidth_gb decimal(10, 2) DEFAULT 0,
  uptime_percent decimal(5, 2) DEFAULT 100.00,
  period_date date NOT NULL,
  response_time_avg_ms integer DEFAULT 0,
  error_rate_percent decimal(5, 2) DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(entitlement_id, period_date)
);

-- Enable Row Level Security
ALTER TABLE public.provider_usage ENABLE ROW LEVEL SECURITY;

-- Fix type mismatch: cast auth.uid() to text for comparison with entitlements.user_id (text)
-- Policy: Users can view their own provider usage
CREATE POLICY "Users can view own provider usage"
  ON public.provider_usage FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.entitlements
      WHERE entitlements.id = provider_usage.entitlement_id
      AND entitlements.user_id = auth.uid()::text
    )
  );

-- Create indexes for faster queries and analytics
CREATE INDEX IF NOT EXISTS idx_provider_usage_entitlement_id ON public.provider_usage(entitlement_id);
CREATE INDEX IF NOT EXISTS idx_provider_usage_period_date ON public.provider_usage(period_date DESC);
