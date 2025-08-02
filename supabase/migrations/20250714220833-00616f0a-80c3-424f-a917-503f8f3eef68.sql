-- Create trip recommendations table
CREATE TABLE public.trip_recommendations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  destination TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  recommendation_type TEXT NOT NULL DEFAULT 'ai_generated',
  confidence_score DECIMAL(3,2) DEFAULT 0.0,
  based_on_preferences JSONB,
  estimated_budget DECIMAL(10,2),
  best_time_to_visit TEXT,
  duration_days INTEGER,
  activities TEXT[],
  accommodation_type TEXT,
  transport_suggestions TEXT[],
  local_insights TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (now() + INTERVAL '30 days'),
  is_viewed BOOLEAN DEFAULT false,
  is_saved BOOLEAN DEFAULT false
);

-- Enable RLS
ALTER TABLE public.trip_recommendations ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own recommendations" 
ON public.trip_recommendations 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own recommendations" 
ON public.trip_recommendations 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Service role can manage recommendations
CREATE POLICY "Service role can manage recommendations" 
ON public.trip_recommendations 
FOR ALL 
USING (true);

-- Create user activity tracking table for better recommendations
CREATE TABLE public.user_activity_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  activity_type TEXT NOT NULL,
  activity_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_activity_log ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own activity" 
ON public.user_activity_log 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage activity logs" 
ON public.user_activity_log 
FOR ALL 
USING (true);

-- Create function to generate personalized recommendations
CREATE OR REPLACE FUNCTION public.generate_trip_recommendations(target_user_id UUID)
RETURNS TABLE(
  destination TEXT,
  title TEXT,
  description TEXT,
  confidence_score DECIMAL,
  estimated_budget DECIMAL,
  duration_days INTEGER,
  activities TEXT[],
  recommendation_reason TEXT
)
LANGUAGE plpgsql
AS $$
DECLARE
  user_preferences RECORD;
  user_activity RECORD;
BEGIN
  -- Get user preferences and travel style
  SELECT 
    travel_style, 
    interests, 
    preferred_destinations,
    COALESCE(tp.budget_range_min, 100) as min_budget,
    COALESCE(tp.budget_range_max, 1000) as max_budget,
    COALESCE(tp.preferred_activities, ARRAY[]::TEXT[]) as pref_activities
  INTO user_preferences
  FROM users u
  LEFT JOIN travel_preferences tp ON u.id = tp.user_id
  WHERE u.id = target_user_id;

  -- Generate recommendations based on user data
  RETURN QUERY
  WITH destination_scores AS (
    SELECT 
      d.name as dest_name,
      d.country,
      d.average_cost_per_day,
      -- Score based on budget compatibility
      CASE 
        WHEN d.average_cost_per_day BETWEEN user_preferences.min_budget AND user_preferences.max_budget 
        THEN 0.3
        WHEN d.average_cost_per_day < user_preferences.max_budget * 1.2 
        THEN 0.2
        ELSE 0.1
      END as budget_score,
      -- Score based on previous interest
      CASE 
        WHEN d.name = ANY(user_preferences.preferred_destinations) 
        THEN 0.4
        ELSE 0.0
      END as interest_score,
      -- Random exploration factor
      RANDOM() * 0.3 as exploration_score
    FROM destinations d
    WHERE d.featured = true
    LIMIT 50
  ),
  scored_destinations AS (
    SELECT 
      dest_name,
      country,
      average_cost_per_day,
      (budget_score + interest_score + exploration_score) as total_score
    FROM destination_scores
    ORDER BY total_score DESC
    LIMIT 10
  )
  SELECT 
    sd.dest_name::TEXT,
    ('Discover ' || sd.dest_name || ', ' || sd.country)::TEXT as rec_title,
    ('Based on your travel style (' || user_preferences.travel_style || ') and interests, ' || 
     sd.dest_name || ' offers amazing experiences perfect for you.')::TEXT as rec_description,
    sd.total_score::DECIMAL(3,2),
    (sd.average_cost_per_day * 7)::DECIMAL(10,2) as budget_estimate,
    7 as duration_estimate,
    CASE user_preferences.travel_style
      WHEN 'adventure' THEN ARRAY['hiking', 'outdoor activities', 'adventure sports']
      WHEN 'cultural' THEN ARRAY['museums', 'historical sites', 'local culture']
      WHEN 'relaxation' THEN ARRAY['beaches', 'spas', 'peaceful retreats']
      WHEN 'food' THEN ARRAY['local cuisine', 'food tours', 'cooking classes']
      ELSE ARRAY['sightseeing', 'local experiences', 'exploration']
    END as suggested_activities,
    ('Perfect match for your ' || user_preferences.travel_style || ' travel style')::TEXT as reason
  FROM scored_destinations sd;
END;
$$;

-- Create indexes for performance
CREATE INDEX idx_trip_recommendations_user_id ON public.trip_recommendations(user_id);
CREATE INDEX idx_trip_recommendations_created_at ON public.trip_recommendations(created_at);
CREATE INDEX idx_user_activity_log_user_id ON public.user_activity_log(user_id);
CREATE INDEX idx_user_activity_log_created_at ON public.user_activity_log(created_at);
