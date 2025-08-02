-- Create event_attendees table for tracking who's going to events
CREATE TABLE public.event_attendees (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_id TEXT NOT NULL,
  looking_for_buddies BOOLEAN DEFAULT false,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create user_follows table for social following
CREATE TABLE public.user_follows (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  follower_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(follower_id, following_id)
);

-- Create trip_shares table for tracking social sharing
CREATE TABLE public.trip_shares (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  shared_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE public.event_attendees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_shares ENABLE ROW LEVEL SECURITY;

-- RLS policies for event_attendees
CREATE POLICY "Users can view event attendees" 
ON public.event_attendees 
FOR SELECT 
USING (true);

CREATE POLICY "Users can manage their own event attendance" 
ON public.event_attendees 
FOR ALL
USING (auth.uid() = user_id);

-- RLS policies for user_follows
CREATE POLICY "Users can view follows" 
ON public.user_follows 
FOR SELECT 
USING (true);

CREATE POLICY "Users can manage their own follows" 
ON public.user_follows 
FOR ALL
USING (auth.uid() = follower_id);

-- RLS policies for trip_shares
CREATE POLICY "Users can view trip shares" 
ON public.trip_shares 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create their own trip shares" 
ON public.trip_shares 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Add follower count function
CREATE OR REPLACE FUNCTION get_follower_count(user_uuid UUID)
RETURNS INTEGER
LANGUAGE sql
STABLE
AS $$
  SELECT COUNT(*)::INTEGER
  FROM user_follows
  WHERE following_id = user_uuid;
$$;

-- Add following count function  
CREATE OR REPLACE FUNCTION get_following_count(user_uuid UUID)
RETURNS INTEGER
LANGUAGE sql
STABLE
AS $$
  SELECT COUNT(*)::INTEGER
  FROM user_follows
  WHERE follower_id = user_uuid;
$$;

-- Update travel_buddy_notifications to include event_id
ALTER TABLE public.travel_buddy_notifications 
ADD COLUMN event_id TEXT,
ADD COLUMN trip_id UUID REFERENCES trips(id) ON DELETE CASCADE;
