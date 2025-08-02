-- Create subscriptions table for premium features
CREATE TABLE public.subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_subscription_id TEXT UNIQUE,
  stripe_customer_id TEXT,
  status TEXT NOT NULL DEFAULT 'inactive',
  plan_type TEXT NOT NULL DEFAULT 'free', -- free, premium, pro
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancel_at_period_end BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create premium features table
CREATE TABLE public.premium_features (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  feature_name TEXT NOT NULL UNIQUE,
  description TEXT,
  plan_type TEXT NOT NULL, -- premium, pro
  feature_limit INTEGER, -- NULL means unlimited
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user feature usage tracking
CREATE TABLE public.user_feature_usage (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  feature_name TEXT NOT NULL,
  usage_count INTEGER DEFAULT 0,
  last_used TIMESTAMP WITH TIME ZONE DEFAULT now(),
  reset_date TIMESTAMP WITH TIME ZONE DEFAULT (date_trunc('month', now()) + interval '1 month'),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, feature_name)
);

-- Enable RLS
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.premium_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_feature_usage ENABLE ROW LEVEL SECURITY;

-- RLS Policies for subscriptions
CREATE POLICY "Users can view own subscription"
  ON public.subscriptions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own subscription"
  ON public.subscriptions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage subscriptions"
  ON public.subscriptions FOR ALL
  USING (true);

-- RLS Policies for premium features
CREATE POLICY "Premium features are publicly readable"
  ON public.premium_features FOR SELECT
  USING (true);

CREATE POLICY "Service role can manage premium features"
  ON public.premium_features FOR ALL
  USING (true);

-- RLS Policies for user feature usage
CREATE POLICY "Users can view own feature usage"
  ON public.user_feature_usage FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own feature usage"
  ON public.user_feature_usage FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage feature usage"
  ON public.user_feature_usage FOR ALL
  USING (true);

-- Insert default premium features
INSERT INTO public.premium_features (feature_name, description, plan_type, feature_limit) VALUES
('unlimited_swipes', 'Unlimited daily swipes on travel buddies', 'premium', NULL),
('advanced_filters', 'Access to advanced search filters', 'premium', NULL),
('priority_matching', 'Priority placement in match queue', 'premium', NULL),
('read_receipts', 'See when messages are read', 'premium', NULL),
('travel_insights', 'Advanced analytics on your travel preferences', 'premium', NULL),
('premium_support', '24/7 priority customer support', 'premium', NULL),
('group_planning', 'Create and manage group trips', 'pro', NULL),
('api_access', 'Access to booking API for custom integrations', 'pro', NULL),
('white_label', 'White-label solution for travel agencies', 'pro', NULL);

-- Create function to check premium access
CREATE OR REPLACE FUNCTION public.has_premium_access(user_id UUID, feature_name TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_plan TEXT;
  feature_plan TEXT;
BEGIN
  -- Get user's current plan
  SELECT plan_type INTO user_plan
  FROM subscriptions
  WHERE subscriptions.user_id = has_premium_access.user_id
    AND status = 'active'
    AND current_period_end > now()
  ORDER BY created_at DESC
  LIMIT 1;
  
  -- Default to free if no active subscription
  IF user_plan IS NULL THEN
    user_plan := 'free';
  END IF;
  
  -- Get required plan for feature
  SELECT plan_type INTO feature_plan
  FROM premium_features
  WHERE premium_features.feature_name = has_premium_access.feature_name;
  
  -- If feature doesn't exist, deny access
  IF feature_plan IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- Check access levels: pro > premium > free
  CASE user_plan
    WHEN 'pro' THEN RETURN TRUE;
    WHEN 'premium' THEN RETURN feature_plan IN ('premium');
    ELSE RETURN FALSE;
  END CASE;
END;
$$;

-- Create function to track feature usage
CREATE OR REPLACE FUNCTION public.track_feature_usage(user_id UUID, feature_name TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_usage INTEGER;
  feature_limit INTEGER;
  user_plan TEXT;
BEGIN
  -- Get user's current plan
  SELECT plan_type INTO user_plan
  FROM subscriptions
  WHERE subscriptions.user_id = track_feature_usage.user_id
    AND status = 'active'
    AND current_period_end > now()
  ORDER BY created_at DESC
  LIMIT 1;
  
  -- Default to free if no active subscription
  IF user_plan IS NULL THEN
    user_plan := 'free';
  END IF;
  
  -- Premium users have unlimited access to most features
  IF user_plan IN ('premium', 'pro') THEN
    -- Still track usage for analytics
    INSERT INTO user_feature_usage (user_id, feature_name, usage_count, last_used)
    VALUES (track_feature_usage.user_id, track_feature_usage.feature_name, 1, now())
    ON CONFLICT (user_id, feature_name) 
    DO UPDATE SET 
      usage_count = user_feature_usage.usage_count + 1,
      last_used = now();
    RETURN TRUE;
  END IF;
  
  -- For free users, check limits
  -- Get current usage
  SELECT usage_count INTO current_usage
  FROM user_feature_usage
  WHERE user_feature_usage.user_id = track_feature_usage.user_id
    AND user_feature_usage.feature_name = track_feature_usage.feature_name
    AND reset_date > now();
  
  -- Set free tier limits
  feature_limit := CASE track_feature_usage.feature_name
    WHEN 'daily_swipes' THEN 10
    WHEN 'monthly_matches' THEN 5
    WHEN 'message_threads' THEN 3
    ELSE 0
  END;
  
  -- Check if user has exceeded limit
  IF current_usage >= feature_limit THEN
    RETURN FALSE;
  END IF;
  
  -- Track usage
  INSERT INTO user_feature_usage (user_id, feature_name, usage_count, last_used)
  VALUES (track_feature_usage.user_id, track_feature_usage.feature_name, 1, now())
  ON CONFLICT (user_id, feature_name) 
  DO UPDATE SET 
    usage_count = user_feature_usage.usage_count + 1,
    last_used = now();
    
  RETURN TRUE;
END;
$$;

-- Create trigger to update subscriptions updated_at
CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
