-- Create travel stories table for social sharing
CREATE TABLE public.travel_stories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  image_url TEXT,
  location TEXT,
  latitude NUMERIC,
  longitude NUMERIC,
  destination_id UUID REFERENCES destinations(id),
  trip_id UUID REFERENCES trips(id),
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  is_public BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.travel_stories ENABLE ROW LEVEL SECURITY;

-- Create policies for travel stories
CREATE POLICY "Public stories are viewable by everyone" 
ON public.travel_stories 
FOR SELECT 
USING (is_public = true OR user_id = auth.uid());

CREATE POLICY "Users can create their own stories" 
ON public.travel_stories 
FOR INSERT 
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own stories" 
ON public.travel_stories 
FOR UPDATE 
USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own stories" 
ON public.travel_stories 
FOR DELETE 
USING (user_id = auth.uid());

-- Create story likes table
CREATE TABLE public.story_likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  story_id UUID NOT NULL REFERENCES travel_stories(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(story_id, user_id)
);

-- Enable RLS
ALTER TABLE public.story_likes ENABLE ROW LEVEL SECURITY;

-- Create policies for story likes
CREATE POLICY "Users can view all story likes" 
ON public.story_likes 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create their own likes" 
ON public.story_likes 
FOR INSERT 
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete their own likes" 
ON public.story_likes 
FOR DELETE 
USING (user_id = auth.uid());

-- Create story comments table
CREATE TABLE public.story_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  story_id UUID NOT NULL REFERENCES travel_stories(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  parent_comment_id UUID REFERENCES story_comments(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.story_comments ENABLE ROW LEVEL SECURITY;

-- Create policies for story comments
CREATE POLICY "Public story comments are viewable by everyone" 
ON public.story_comments 
FOR SELECT 
USING (story_id IN (SELECT id FROM travel_stories WHERE is_public = true OR user_id = auth.uid()));

CREATE POLICY "Users can create comments" 
ON public.story_comments 
FOR INSERT 
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own comments" 
ON public.story_comments 
FOR UPDATE 
USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own comments" 
ON public.story_comments 
FOR DELETE 
USING (user_id = auth.uid());

-- Create messages table for enhanced chat
CREATE TABLE public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  match_id UUID NOT NULL REFERENCES travel_buddy_matches(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'location', 'itinerary')),
  metadata JSONB,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Create policies for messages
CREATE POLICY "Users can view messages in their matches" 
ON public.messages 
FOR SELECT 
USING (match_id IN (
  SELECT id FROM travel_buddy_matches 
  WHERE user1_id = auth.uid() OR user2_id = auth.uid()
));

CREATE POLICY "Users can send messages in their matches" 
ON public.messages 
FOR INSERT 
WITH CHECK (
  sender_id = auth.uid() AND 
  match_id IN (
    SELECT id FROM travel_buddy_matches 
    WHERE user1_id = auth.uid() OR user2_id = auth.uid()
  )
);

-- Create local experts table
CREATE TABLE public.local_experts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  destination_id UUID NOT NULL REFERENCES destinations(id),
  expertise_areas TEXT[] NOT NULL,
  description TEXT NOT NULL,
  hourly_rate NUMERIC,
  languages TEXT[],
  verified BOOLEAN DEFAULT false,
  rating NUMERIC(3,2) DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  availability JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.local_experts ENABLE ROW LEVEL SECURITY;

-- Create policies for local experts
CREATE POLICY "Local experts are publicly viewable" 
ON public.local_experts 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create their own expert profile" 
ON public.local_experts 
FOR INSERT 
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own expert profile" 
ON public.local_experts 
FOR UPDATE 
USING (user_id = auth.uid());

-- Create shared wishlists table for group planning
CREATE TABLE public.shared_wishlists (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.shared_wishlists ENABLE ROW LEVEL SECURITY;

-- Create policies for shared wishlists
CREATE POLICY "Trip participants can view wishlists" 
ON public.shared_wishlists 
FOR SELECT 
USING (trip_id IN (
  SELECT id FROM trips 
  WHERE user_id = auth.uid() OR id IN (
    SELECT trip_id FROM trip_participants WHERE user_id = auth.uid()
  )
));

CREATE POLICY "Trip participants can create wishlists" 
ON public.shared_wishlists 
FOR INSERT 
WITH CHECK (
  created_by = auth.uid() AND 
  trip_id IN (
    SELECT id FROM trips 
    WHERE user_id = auth.uid() OR id IN (
      SELECT trip_id FROM trip_participants WHERE user_id = auth.uid()
    )
  )
);

-- Create wishlist items table
CREATE TABLE public.wishlist_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  wishlist_id UUID NOT NULL REFERENCES shared_wishlists(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  url TEXT,
  image_url TEXT,
  price NUMERIC,
  currency TEXT DEFAULT 'USD',
  location TEXT,
  added_by UUID NOT NULL REFERENCES auth.users(id),
  votes_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.wishlist_items ENABLE ROW LEVEL SECURITY;

-- Create policies for wishlist items
CREATE POLICY "Trip participants can view wishlist items" 
ON public.wishlist_items 
FOR SELECT 
USING (wishlist_id IN (
  SELECT id FROM shared_wishlists 
  WHERE trip_id IN (
    SELECT id FROM trips 
    WHERE user_id = auth.uid() OR id IN (
      SELECT trip_id FROM trip_participants WHERE user_id = auth.uid()
    )
  )
));

CREATE POLICY "Trip participants can add wishlist items" 
ON public.wishlist_items 
FOR INSERT 
WITH CHECK (
  added_by = auth.uid() AND 
  wishlist_id IN (
    SELECT id FROM shared_wishlists 
    WHERE trip_id IN (
      SELECT id FROM trips 
      WHERE user_id = auth.uid() OR id IN (
        SELECT trip_id FROM trip_participants WHERE user_id = auth.uid()
      )
    )
  )
);

-- Create triggers for updating counters
CREATE OR REPLACE FUNCTION update_story_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE travel_stories 
    SET likes_count = likes_count + 1 
    WHERE id = NEW.story_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE travel_stories 
    SET likes_count = likes_count - 1 
    WHERE id = OLD.story_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER story_likes_count_trigger
  AFTER INSERT OR DELETE ON story_likes
  FOR EACH ROW EXECUTE FUNCTION update_story_likes_count();

CREATE OR REPLACE FUNCTION update_story_comments_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE travel_stories 
    SET comments_count = comments_count + 1 
    WHERE id = NEW.story_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE travel_stories 
    SET comments_count = comments_count - 1 
    WHERE id = OLD.story_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER story_comments_count_trigger
  AFTER INSERT OR DELETE ON story_comments
  FOR EACH ROW EXECUTE FUNCTION update_story_comments_count();

-- Add indexes for performance
CREATE INDEX idx_travel_stories_user_id ON travel_stories(user_id);
CREATE INDEX idx_travel_stories_destination_id ON travel_stories(destination_id);
CREATE INDEX idx_travel_stories_created_at ON travel_stories(created_at DESC);
CREATE INDEX idx_story_likes_story_id ON story_likes(story_id);
CREATE INDEX idx_story_comments_story_id ON story_comments(story_id);
CREATE INDEX idx_messages_match_id ON messages(match_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);
CREATE INDEX idx_local_experts_destination_id ON local_experts(destination_id);