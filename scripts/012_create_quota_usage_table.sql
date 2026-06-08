-- Create quota_usage table for monthly quota tracking
CREATE TABLE IF NOT EXISTS public.quota_usage (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  api_key_id uuid REFERENCES public.api_keys(id) ON DELETE CASCADE NOT NULL,
  month date NOT NULL,
  requests_used integer DEFAULT 0,
  requests_limit integer NOT NULL,
  status text DEFAULT 'active' CHECK (status IN ('active', 'warning', 'limited')),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(api_key_id, month)
);

-- Enable Row Level Security
ALTER TABLE public.quota_usage ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own quota usage
CREATE POLICY "Users can view own quota usage"
  ON public.quota_usage FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.api_keys
      WHERE api_keys.id = quota_usage.api_key_id
      AND api_keys.user_id = auth.uid()
    )
  );

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_quota_usage_api_key_id ON public.quota_usage(api_key_id);
CREATE INDEX IF NOT EXISTS idx_quota_usage_month ON public.quota_usage(month DESC);
