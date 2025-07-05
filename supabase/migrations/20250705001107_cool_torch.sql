/*
  # Travel Buddy Swipe System

  1. New Tables
    - `travel_swipes` - Track user swipes (like/pass)
    - `travel_buddy_matches` - Store mutual matches
  
  2. Features
    - Tinder-style swipe functionality
    - Automatic match detection on mutual likes
    - Sample data for testing
    - Useful views for displaying matches
  
  3. Security
    - RLS policies for user privacy
    - Users can only see their own swipes and matches
*/

-- ==============================================
-- TABLE: travel_swipes (Tinder-style swipes)
-- ==============================================
CREATE TABLE IF NOT EXISTS travel_swipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  swiper_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  swiped_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  liked BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(swiper_user_id, swiped_user_id)
);

ALTER TABLE travel_swipes ENABLE ROW LEVEL SECURITY;

-- ==============================================
-- TABLE: travel_buddy_matches (Mutual matches)
-- ==============================================
CREATE TABLE IF NOT EXISTS travel_buddy_matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user1_id UUID REFERENCES users(id) ON DELETE CASCADE,
  user2_id UUID REFERENCES users(id) ON DELETE CASCADE,
  matched_on TIMESTAMPTZ DEFAULT now(),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'blocked', 'unmatched')),
  last_message_at TIMESTAMPTZ,
  UNIQUE(user1_id, user2_id)
);

ALTER TABLE travel_buddy_matches ENABLE ROW LEVEL SECURITY;

-- ==============================================
-- INDEXES FOR PERFORMANCE
-- ==============================================
CREATE INDEX IF NOT EXISTS idx_travel_swipes_swiper ON travel_swipes(swiper_user_id);
CREATE INDEX IF NOT EXISTS idx_travel_swipes_swiped ON travel_swipes(swiped_user_id);
CREATE INDEX IF NOT EXISTS idx_travel_swipes_liked ON travel_swipes(liked) WHERE liked = true;
CREATE INDEX IF NOT EXISTS idx_travel_buddy_matches_user1 ON travel_buddy_matches(user1_id);
CREATE INDEX IF NOT EXISTS idx_travel_buddy_matches_user2 ON travel_buddy_matches(user2_id);
CREATE INDEX IF NOT EXISTS idx_travel_buddy_matches_status ON travel_buddy_matches(status);

-- ==============================================
-- ROW LEVEL SECURITY POLICIES
-- ==============================================

-- Travel swipes policies
CREATE POLICY "Users can view own swipes" ON travel_swipes
  FOR SELECT TO authenticated
  USING (
    swiper_user_id = (SELECT id FROM users WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())) OR
    swiped_user_id = (SELECT id FROM users WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid()))
  );

CREATE POLICY "Users can create own swipes" ON travel_swipes
  FOR INSERT TO authenticated
  WITH CHECK (swiper_user_id = (SELECT id FROM users WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())));

CREATE POLICY "Users can update own swipes" ON travel_swipes
  FOR UPDATE TO authenticated
  USING (swiper_user_id = (SELECT id FROM users WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())));

-- Travel buddy matches policies
CREATE POLICY "Users can view own matches" ON travel_buddy_matches
  FOR SELECT TO authenticated
  USING (
    user1_id = (SELECT id FROM users WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())) OR
    user2_id = (SELECT id FROM users WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid()))
  );

CREATE POLICY "Users can update own matches" ON travel_buddy_matches
  FOR UPDATE TO authenticated
  USING (
    user1_id = (SELECT id FROM users WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())) OR
    user2_id = (SELECT id FROM users WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid()))
  );

-- ==============================================
-- FUNCTION: Auto-create matches on mutual likes
-- ==============================================
CREATE OR REPLACE FUNCTION create_travel_buddy_match()
RETURNS TRIGGER AS $$
BEGIN
  -- Only proceed if this is a like
  IF NEW.liked = true THEN
    -- Check if the other user also liked this user
    IF EXISTS (
      SELECT 1 FROM travel_swipes 
      WHERE swiper_user_id = NEW.swiped_user_id 
        AND swiped_user_id = NEW.swiper_user_id 
        AND liked = true
    ) THEN
      -- Create a match (ensure user1_id < user2_id for consistency)
      INSERT INTO travel_buddy_matches (user1_id, user2_id)
      VALUES (
        LEAST(NEW.swiper_user_id, NEW.swiped_user_id),
        GREATEST(NEW.swiper_user_id, NEW.swiped_user_id)
      )
      ON CONFLICT (user1_id, user2_id) DO NOTHING;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic match creation
CREATE TRIGGER create_match_on_mutual_like
  AFTER INSERT OR UPDATE ON travel_swipes
  FOR EACH ROW
  EXECUTE FUNCTION create_travel_buddy_match();

-- ==============================================
-- FUNCTION: Get potential matches for a user
-- ==============================================
CREATE OR REPLACE FUNCTION get_potential_travel_buddies(current_user_id UUID, limit_count INT DEFAULT 20)
RETURNS TABLE (
  user_id UUID,
  user_email TEXT,
  user_age INT,
  user_bio TEXT,
  user_location TEXT,
  user_photo TEXT,
  preferred_destinations TEXT[],
  travel_style TEXT,
  interests TEXT[],
  compatibility_score DECIMAL(3,2)
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    u.id as user_id,
    u.email as user_email,
    u.age as user_age,
    u.bio as user_bio,
    u.location as user_location,
    u.profile_photo_url as user_photo,
    u.preferred_destinations,
    u.travel_style,
    u.interests,
    calculate_match_score(current_user_id, u.id) as compatibility_score
  FROM users u
  WHERE u.id != current_user_id
    AND u.public_profile = true
    AND NOT EXISTS (
      -- Exclude users already swiped on
      SELECT 1 FROM travel_swipes s 
      WHERE s.swiper_user_id = current_user_id 
        AND s.swiped_user_id = u.id
    )
  ORDER BY compatibility_score DESC, RANDOM()
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- ==============================================
-- VIEW: Easy way to see travel buddy pairings
-- ==============================================
CREATE OR REPLACE VIEW travel_buddy_pairings AS
SELECT
  m.id as match_id,
  u1.email as user1_email,
  u1.profile_photo_url as user1_photo,
  u1.location as user1_location,
  u1.age as user1_age,
  u2.email as user2_email,
  u2.profile_photo_url as user2_photo,
  u2.location as user2_location,
  u2.age as user2_age,
  m.matched_on,
  m.status,
  m.last_message_at,
  -- Calculate days since match
  EXTRACT(DAY FROM (now() - m.matched_on))::INT as days_since_match
FROM travel_buddy_matches m
JOIN users u1 ON m.user1_id = u1.id
JOIN users u2 ON m.user2_id = u2.id
WHERE m.status = 'active'
ORDER BY m.matched_on DESC;

-- ==============================================
-- VIEW: User swipe statistics
-- ==============================================
CREATE OR REPLACE VIEW user_swipe_stats AS
SELECT
  u.email as user_email,
  COUNT(s.id) as total_swipes,
  COUNT(CASE WHEN s.liked = true THEN 1 END) as likes_given,
  COUNT(CASE WHEN s.liked = false THEN 1 END) as passes_given,
  ROUND(
    COUNT(CASE WHEN s.liked = true THEN 1 END)::DECIMAL / 
    NULLIF(COUNT(s.id), 0) * 100, 1
  ) as like_percentage,
  COUNT(m.id) as total_matches
FROM users u
LEFT JOIN travel_swipes s ON u.id = s.swiper_user_id
LEFT JOIN travel_buddy_matches m ON (u.id = m.user1_id OR u.id = m.user2_id)
GROUP BY u.id, u.email
ORDER BY total_matches DESC, total_swipes DESC;

-- ==============================================
-- SAMPLE DATA FOR TESTING
-- ==============================================

-- First, ensure we have some sample users
DO $$
BEGIN
  -- Add more sample users if they don't exist
  IF NOT EXISTS (SELECT 1 FROM users WHERE email = 'alex.smith@example.com') THEN
    INSERT INTO users (email, age, bio, location, preferred_destinations, travel_style, interests, languages_spoken, public_profile) VALUES
    ('alex.smith@example.com', 28, 'Digital nomad and photographer. Love capturing street life and local cultures.', 'San Francisco, CA', ARRAY['Japan', 'Thailand', 'Vietnam'], 'mid-range', ARRAY['photography', 'food', 'culture'], ARRAY['English', 'Spanish'], true),
    ('maria.lopez@example.com', 34, 'Yoga instructor and adventure seeker. Always looking for spiritual experiences and hiking trails.', 'Barcelona, Spain', ARRAY['Peru', 'Nepal', 'India'], 'budget', ARRAY['yoga', 'hiking', 'wellness'], ARRAY['Spanish', 'English'], true),
    ('jake.miller@example.com', 29, 'History buff who loves ancient architecture and museums. Prefer luxury travel.', 'London, UK', ARRAY['Italy', 'Greece', 'Egypt'], 'luxury', ARRAY['history', 'architecture', 'museums'], ARRAY['English', 'French'], true),
    ('sophie.chen@example.com', 26, 'Solo backpacker always up for spontaneous adventures and meeting locals.', 'Montreal, Canada', ARRAY['Southeast Asia', 'South America'], 'backpacker', ARRAY['backpacking', 'nightlife', 'local culture'], ARRAY['French', 'English', 'Mandarin'], true),
    ('david.kim@example.com', 31, 'Tech entrepreneur who travels for business but loves exploring local food scenes.', 'Seoul, South Korea', ARRAY['Japan', 'Singapore', 'Hong Kong'], 'luxury', ARRAY['technology', 'food', 'business'], ARRAY['Korean', 'English'], true),
    ('emma.wilson@example.com', 27, 'Marine biologist passionate about ocean conservation and diving.', 'Sydney, Australia', ARRAY['Maldives', 'Philippines', 'Indonesia'], 'mid-range', ARRAY['diving', 'marine life', 'conservation'], ARRAY['English'], true);
  END IF;
END $$;

-- Add sample swipes to create some matches
DO $$
DECLARE
  alex_id UUID;
  maria_id UUID;
  jake_id UUID;
  sophie_id UUID;
  david_id UUID;
  emma_id UUID;
BEGIN
  -- Get user IDs
  SELECT id INTO alex_id FROM users WHERE email = 'alex.smith@example.com';
  SELECT id INTO maria_id FROM users WHERE email = 'maria.lopez@example.com';
  SELECT id INTO jake_id FROM users WHERE email = 'jake.miller@example.com';
  SELECT id INTO sophie_id FROM users WHERE email = 'sophie.chen@example.com';
  SELECT id INTO david_id FROM users WHERE email = 'david.kim@example.com';
  SELECT id INTO emma_id FROM users WHERE email = 'emma.wilson@example.com';

  -- Only insert if we have the users and no swipes exist yet
  IF alex_id IS NOT NULL AND maria_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM travel_swipes LIMIT 1) THEN
    -- Create mutual likes (will create matches)
    INSERT INTO travel_swipes (swiper_user_id, swiped_user_id, liked) VALUES
    -- Alex and Maria mutual like
    (alex_id, maria_id, true),
    (maria_id, alex_id, true),
    
    -- Sophie and David mutual like  
    (sophie_id, david_id, true),
    (david_id, sophie_id, true),
    
    -- Emma and Jake mutual like
    (emma_id, jake_id, true),
    (jake_id, emma_id, true),
    
    -- Some one-sided likes (no matches)
    (alex_id, sophie_id, true),
    (sophie_id, alex_id, false),
    
    (maria_id, david_id, true),
    (david_id, maria_id, false),
    
    -- Some passes
    (alex_id, jake_id, false),
    (jake_id, alex_id, false),
    
    (maria_id, emma_id, false),
    (emma_id, maria_id, false);
  END IF;
END $$;

-- ==============================================
-- UTILITY FUNCTIONS FOR FRONTEND
-- ==============================================

-- Function to record a swipe
CREATE OR REPLACE FUNCTION record_swipe(
  current_user_email TEXT,
  target_user_id UUID,
  is_like BOOLEAN
)
RETURNS JSON AS $$
DECLARE
  current_user_id UUID;
  is_match BOOLEAN := false;
  result JSON;
BEGIN
  -- Get current user ID
  SELECT id INTO current_user_id 
  FROM users 
  WHERE email = current_user_email;
  
  IF current_user_id IS NULL THEN
    RETURN json_build_object('error', 'User not found');
  END IF;
  
  -- Insert the swipe
  INSERT INTO travel_swipes (swiper_user_id, swiped_user_id, liked)
  VALUES (current_user_id, target_user_id, is_like)
  ON CONFLICT (swiper_user_id, swiped_user_id) 
  DO UPDATE SET liked = EXCLUDED.liked;
  
  -- Check if it's a match (only if this was a like)
  IF is_like THEN
    SELECT EXISTS (
      SELECT 1 FROM travel_buddy_matches 
      WHERE (user1_id = current_user_id AND user2_id = target_user_id)
         OR (user1_id = target_user_id AND user2_id = current_user_id)
    ) INTO is_match;
  END IF;
  
  -- Return result
  result := json_build_object(
    'success', true,
    'is_match', is_match,
    'swipe_type', CASE WHEN is_like THEN 'like' ELSE 'pass' END
  );
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's matches
CREATE OR REPLACE FUNCTION get_user_matches(user_email TEXT)
RETURNS TABLE (
  match_id UUID,
  matched_user_email TEXT,
  matched_user_photo TEXT,
  matched_user_location TEXT,
  matched_user_age INT,
  matched_on TIMESTAMPTZ,
  days_since_match INT
) AS $$
DECLARE
  current_user_id UUID;
BEGIN
  -- Get current user ID
  SELECT id INTO current_user_id 
  FROM users 
  WHERE email = user_email;
  
  IF current_user_id IS NULL THEN
    RETURN;
  END IF;
  
  RETURN QUERY
  SELECT 
    m.id as match_id,
    CASE 
      WHEN m.user1_id = current_user_id THEN u2.email
      ELSE u1.email
    END as matched_user_email,
    CASE 
      WHEN m.user1_id = current_user_id THEN u2.profile_photo_url
      ELSE u1.profile_photo_url
    END as matched_user_photo,
    CASE 
      WHEN m.user1_id = current_user_id THEN u2.location
      ELSE u1.location
    END as matched_user_location,
    CASE 
      WHEN m.user1_id = current_user_id THEN u2.age
      ELSE u1.age
    END as matched_user_age,
    m.matched_on,
    EXTRACT(DAY FROM (now() - m.matched_on))::INT as days_since_match
  FROM travel_buddy_matches m
  JOIN users u1 ON m.user1_id = u1.id
  JOIN users u2 ON m.user2_id = u2.id
  WHERE (m.user1_id = current_user_id OR m.user2_id = current_user_id)
    AND m.status = 'active'
  ORDER BY m.matched_on DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;