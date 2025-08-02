-- Create API usage tracking tables
CREATE TABLE IF NOT EXISTS public.api_usage_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider TEXT NOT NULL, -- 'google', 'here', 'mapbox'
  endpoint TEXT NOT NULL, -- specific API endpoint used
  usage_count INTEGER NOT NULL DEFAULT 1,
  cost_per_call DECIMAL(10,6) DEFAULT 0,
  total_cost DECIMAL(10,2) DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  month_year TEXT NOT NULL DEFAULT to_char(now(), 'YYYY-MM')
);

-- Create monthly API limits configuration table
CREATE TABLE IF NOT EXISTS public.monthly_api_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider TEXT NOT NULL,
  endpoint TEXT NOT NULL,
  monthly_limit INTEGER NOT NULL,
  cost_per_call DECIMAL(10,6) DEFAULT 0,
  reset_day INTEGER DEFAULT 1, -- day of month when limit resets
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(provider, endpoint)
);

-- Create usage alerts table
CREATE TABLE IF NOT EXISTS public.usage_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider TEXT NOT NULL,
  endpoint TEXT NOT NULL,
  threshold_percentage INTEGER NOT NULL DEFAULT 80,
  alert_email TEXT NOT NULL DEFAULT 'admin@utrippin.com',
  last_alert_sent TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(provider, endpoint)
);

-- Insert initial API limits configuration
INSERT INTO public.monthly_api_limits (provider, endpoint, monthly_limit, cost_per_call) VALUES
  ('here', 'autocomplete', 30000, 0.0),
  ('mapbox', 'search-box', 50000, 0.0),
  ('mapbox', 'geocoding', 100000, 0.0),
  ('google', 'places', 1000, 0.017), -- $17 per 1000 requests
  ('google', 'credit', 200, 1.0) -- $200 monthly credit
ON CONFLICT (provider, endpoint) DO NOTHING;

-- Insert initial alert configurations
INSERT INTO public.usage_alerts (provider, endpoint, threshold_percentage) VALUES
  ('here', 'autocomplete', 80),
  ('mapbox', 'search-box', 80),
  ('mapbox', 'geocoding', 80),
  ('google', 'places', 80),
  ('google', 'credit', 80)
ON CONFLICT (provider, endpoint) DO NOTHING;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_api_usage_provider_month ON public.api_usage_tracking(provider, month_year);
CREATE INDEX IF NOT EXISTS idx_api_usage_endpoint_month ON public.api_usage_tracking(endpoint, month_year);
CREATE INDEX IF NOT EXISTS idx_api_usage_created_at ON public.api_usage_tracking(created_at);

-- Enable RLS
ALTER TABLE public.api_usage_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.monthly_api_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_alerts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for admin access only
CREATE POLICY "Admin can manage API usage tracking" ON public.api_usage_tracking
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admin can manage API limits" ON public.monthly_api_limits
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admin can manage usage alerts" ON public.usage_alerts
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Service role can manage all for background tasks
CREATE POLICY "Service role can manage API usage tracking" ON public.api_usage_tracking
  FOR ALL USING (true);

CREATE POLICY "Service role can manage API limits" ON public.monthly_api_limits
  FOR ALL USING (true);

CREATE POLICY "Service role can manage usage alerts" ON public.usage_alerts
  FOR ALL USING (true);

-- Create function to get current month usage summary
CREATE OR REPLACE FUNCTION public.get_monthly_usage_summary()
RETURNS TABLE(
  provider TEXT,
  endpoint TEXT,
  current_usage BIGINT,
  monthly_limit INTEGER,
  usage_percentage DECIMAL,
  remaining_calls INTEGER,
  total_cost DECIMAL
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    l.provider,
    l.endpoint,
    COALESCE(u.usage_count, 0) as current_usage,
    l.monthly_limit,
    ROUND(
      CASE 
        WHEN l.monthly_limit > 0 THEN (COALESCE(u.usage_count, 0)::DECIMAL / l.monthly_limit::DECIMAL) * 100
        ELSE 0
      END, 2
    ) as usage_percentage,
    GREATEST(0, l.monthly_limit - COALESCE(u.usage_count, 0)) as remaining_calls,
    COALESCE(u.total_cost, 0) as total_cost
  FROM public.monthly_api_limits l
  LEFT JOIN (
    SELECT 
      provider,
      endpoint,
      SUM(usage_count) as usage_count,
      SUM(total_cost) as total_cost
    FROM public.api_usage_tracking
    WHERE month_year = to_char(now(), 'YYYY-MM')
    GROUP BY provider, endpoint
  ) u ON l.provider = u.provider AND l.endpoint = u.endpoint
  WHERE l.is_active = true
  ORDER BY l.provider, l.endpoint;
END;
$$;

-- Create function to track API usage
CREATE OR REPLACE FUNCTION public.track_api_call(
  p_provider TEXT,
  p_endpoint TEXT,
  p_usage_count INTEGER DEFAULT 1,
  p_metadata JSONB DEFAULT '{}'
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_cost_per_call DECIMAL(10,6);
  v_total_cost DECIMAL(10,2);
  v_month_year TEXT;
BEGIN
  -- Get current month-year
  v_month_year := to_char(now(), 'YYYY-MM');
  
  -- Get cost per call from limits table
  SELECT cost_per_call INTO v_cost_per_call
  FROM public.monthly_api_limits
  WHERE provider = p_provider AND endpoint = p_endpoint;
  
  -- Calculate total cost
  v_total_cost := COALESCE(v_cost_per_call, 0) * p_usage_count;
  
  -- Insert or update usage tracking
  INSERT INTO public.api_usage_tracking (
    provider,
    endpoint,
    usage_count,
    cost_per_call,
    total_cost,
    metadata,
    month_year
  ) VALUES (
    p_provider,
    p_endpoint,
    p_usage_count,
    v_cost_per_call,
    v_total_cost,
    p_metadata,
    v_month_year
  );
END;
$$;
