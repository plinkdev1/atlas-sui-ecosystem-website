-- Create usage_logs table for tracking API usage
CREATE TABLE IF NOT EXISTS public.usage_logs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  api_key_id uuid REFERENCES public.api_keys(id) ON DELETE CASCADE NOT NULL,
  endpoint text NOT NULL,
  method text CHECK (method IN ('GET', 'POST', 'PUT', 'DELETE', 'PATCH')),
  status_code integer,
  response_time_ms integer,
  ip_address inet,
  user_agent text,
  request_size_bytes integer,
  response_size_bytes integer,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.usage_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own usage logs
CREATE POLICY "Users can view own usage logs"
  ON public.usage_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.api_keys
      WHERE api_keys.id = usage_logs.api_key_id
      AND api_keys.user_id = auth.uid()
    )
  );

-- Create indexes for faster queries and analytics
CREATE INDEX IF NOT EXISTS idx_usage_logs_api_key_id ON public.usage_logs(api_key_id);
CREATE INDEX IF NOT EXISTS idx_usage_logs_created_at ON public.usage_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_usage_logs_endpoint ON public.usage_logs(endpoint);
CREATE INDEX IF NOT EXISTS idx_usage_logs_status_code ON public.usage_logs(status_code);
