-- Create user behavior tracking tables for real-time recommendations
CREATE TABLE public.user_behavior_tracking (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id TEXT NOT NULL,
  event_type TEXT NOT NULL, -- 'search', 'view', 'click', 'save', 'share'
  event_data JSONB NOT NULL, -- stores search terms, destination info, etc.
  page_url TEXT,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ip_address TEXT,
  user_agent TEXT
);

-- Create recommendation cache table
CREATE TABLE public.user_recommendations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  recommendation_type TEXT NOT NULL, -- 'destination', 'activity', 'budget', 'duration'
  recommendation_data JSONB NOT NULL,
  confidence_score DECIMAL(3,2) NOT NULL DEFAULT 0.0,
  generated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '24 hours'),
  is_active BOOLEAN NOT NULL DEFAULT true
);

-- Create indexes for performance
CREATE INDEX idx_user_behavior_user_timestamp ON public.user_behavior_tracking(user_id, timestamp DESC);
CREATE INDEX idx_user_behavior_session ON public.user_behavior_tracking(session_id, timestamp DESC);
CREATE INDEX idx_user_behavior_event_type ON public.user_behavior_tracking(event_type);
CREATE INDEX idx_user_recommendations_user_active ON public.user_recommendations(user_id, is_active, expires_at);
CREATE INDEX idx_user_recommendations_type ON public.user_recommendations(recommendation_type);

-- Enable RLS
ALTER TABLE public.user_behavior_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_recommendations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_behavior_tracking
CREATE POLICY "Users can view their own behavior data" 
ON public.user_behavior_tracking 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own behavior data" 
ON public.user_behavior_tracking 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- RLS Policies for user_recommendations
CREATE POLICY "Users can view their own recommendations" 
ON public.user_recommendations 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "System can manage all recommendations" 
ON public.user_recommendations 
FOR ALL 
USING (true);

-- Function to clean up expired recommendations
CREATE OR REPLACE FUNCTION public.cleanup_expired_recommendations()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  DELETE FROM public.user_recommendations 
  WHERE expires_at < now() OR is_active = false;
END;
$$;

-- Function to track user behavior
CREATE OR REPLACE FUNCTION public.track_user_behavior(
  p_user_id UUID,
  p_session_id TEXT,
  p_event_type TEXT,
  p_event_data JSONB,
  p_page_url TEXT DEFAULT NULL,
  p_ip_address TEXT DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_behavior_id UUID;
BEGIN
  INSERT INTO public.user_behavior_tracking (
    user_id,
    session_id,
    event_type,
    event_data,
    page_url,
    ip_address,
    user_agent
  ) VALUES (
    p_user_id,
    p_session_id,
    p_event_type,
    p_event_data,
    p_page_url,
    p_ip_address,
    p_user_agent
  ) RETURNING id INTO v_behavior_id;
  
  RETURN v_behavior_id;
END;
$$;

-- Function to get user behavior patterns
CREATE OR REPLACE FUNCTION public.get_user_behavior_patterns(
  p_user_id UUID,
  p_days_back INTEGER DEFAULT 30
)
RETURNS TABLE(
  search_patterns JSONB,
  destination_interests JSONB,
  activity_preferences JSONB,
  budget_range JSONB,
  trip_duration_preference JSONB
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  WITH behavior_data AS (
    SELECT event_type, event_data
    FROM public.user_behavior_tracking
    WHERE user_id = p_user_id
      AND timestamp >= now() - (p_days_back || ' days')::interval
  ),
  search_analysis AS (
    SELECT jsonb_agg(
      jsonb_build_object(
        'query', event_data->>'query',
        'destination', event_data->>'destination',
        'count', 1
      )
    ) as searches
    FROM behavior_data
    WHERE event_type = 'search'
  ),
  destination_analysis AS (
    SELECT jsonb_agg(
      jsonb_build_object(
        'destination', event_data->>'destination',
        'country', event_data->>'country',
        'interest_level', 
        CASE event_type
          WHEN 'view' THEN 1
          WHEN 'save' THEN 3
          WHEN 'share' THEN 2
          ELSE 1
        END
      )
    ) as destinations
    FROM behavior_data
    WHERE event_type IN ('view', 'save', 'share')
      AND event_data->>'destination' IS NOT NULL
  )
  SELECT 
    COALESCE((SELECT searches FROM search_analysis), '[]'::jsonb),
    COALESCE((SELECT destinations FROM destination_analysis), '[]'::jsonb),
    '[]'::jsonb, -- activity_preferences placeholder
    '{"min": 0, "max": 5000}'::jsonb, -- budget_range placeholder
    '{"preferred_days": 7}'::jsonb -- trip_duration_preference placeholder
  ;
END;
$$;