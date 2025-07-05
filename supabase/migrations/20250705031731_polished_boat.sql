/*
  # Travel Buddy Schema

  1. New Tables
    - `profiles` - User profiles for travel buddy matching
    - `travel_swipes` - Records of user swipes (like/pass)
    - `travel_matches` - Matches between users who liked each other
  
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
  
  3. Functions
    - `record_swipe` - Records a swipe and creates a match if mutual
    - `get_potential_travel_buddies` - Gets users who haven't been swiped on
    - `get_user_matches` - Gets all matches for a user
*/

-- === Drop existing objects if they exist ===
DROP TABLE IF EXISTS travel_matches CASCADE;
DROP TABLE IF EXISTS travel_swipes CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- === Create Tables ===

-- Create profiles table
CREATE TABLE profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text NOT NULL UNIQUE,
  avatar_url text,
  bio text,
  created_at timestamp with time zone DEFAULT now()
);

-- Create travel_swipes table
CREATE TABLE travel_swipes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  swiper_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  swiped_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  liked boolean NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(swiper_id, swiped_id)
);

-- Create travel_matches table
CREATE TABLE travel_matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user1_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  user2_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(user1_id, user2_id)
);

-- === Create Indexes ===
CREATE INDEX travel_swipes_swiper_idx ON travel_swipes(swiper_id);
CREATE INDEX travel_swipes_swiped_idx ON travel_swipes(swiped_id);
CREATE INDEX travel_swipes_liked_idx ON travel_swipes(liked) WHERE liked = true;
CREATE INDEX travel_matches_user1_idx ON travel_matches(user1_id);
CREATE INDEX travel_matches_user2_idx ON travel_matches(user2_id);

-- === Enable Row Level Security ===
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE travel_swipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE travel_matches ENABLE ROW LEVEL SECURITY;

-- === Create Security Policies ===

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone" 
ON profiles FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" 
ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
ON profiles FOR UPDATE USING (auth.uid() = id);

-- Travel swipes policies
CREATE POLICY "Users can view their own swipes" 
ON travel_swipes FOR SELECT USING (auth.uid() = swiper_id OR auth.uid() = swiped_id);

CREATE POLICY "Users can create their own swipes" 
ON travel_swipes FOR INSERT WITH CHECK (auth.uid() = swiper_id);

CREATE POLICY "Users can update their own swipes" 
ON travel_swipes FOR UPDATE USING (auth.uid() = swiper_id);

-- Travel matches policies
CREATE POLICY "Users can view their own matches" 
ON travel_matches FOR SELECT USING (auth.uid() = user1_id OR auth.uid() = user2_id);

-- === Create Functions ===

CREATE OR REPLACE FUNCTION record_swipe(swiper_user_id uuid, swiped_user_id uuid, is_liked boolean)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  -- Insert the swipe (or update if exists)
  INSERT INTO travel_swipes (swiper_id, swiped_id, liked)
  VALUES (swiper_user_id, swiped_user_id, is_liked)
  ON CONFLICT (swiper_id, swiped_id) 
  DO UPDATE SET liked = is_liked, created_at = now();

  -- If it's a like, check for mutual match
  IF is_liked THEN
    -- Check if the other user has also liked this user
    IF EXISTS (
      SELECT 1 FROM travel_swipes
      WHERE swiper_id = swiped_user_id 
      AND swiped_id = swiper_user_id 
      AND liked = true
    ) THEN
      -- Create match (ensure user1_id < user2_id for consistency)
      INSERT INTO travel_matches (user1_id, user2_id)
      VALUES (
        LEAST(swiper_user_id, swiped_user_id),
        GREATEST(swiper_user_id, swiped_user_id)
      )
      ON CONFLICT (user1_id, user2_id) DO NOTHING;
    END IF;
  ELSE
    -- If it's a pass, remove any existing match
    DELETE FROM travel_matches 
    WHERE (user1_id = LEAST(swiper_user_id, swiped_user_id) 
           AND user2_id = GREATEST(swiper_user_id, swiped_user_id));
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION get_potential_travel_buddies(user_id uuid)
RETURNS TABLE(id uuid, username text, avatar_url text, bio text)
LANGUAGE sql SECURITY DEFINER AS $$
  SELECT p.id, p.username, p.avatar_url, p.bio
  FROM profiles p
  WHERE p.id != user_id
    AND p.id NOT IN (
      SELECT swiped_id FROM travel_swipes WHERE swiper_id = user_id
    )
  ORDER BY p.created_at DESC
  LIMIT 50;
$$;

CREATE OR REPLACE FUNCTION get_user_matches(user_id uuid)
RETURNS TABLE(id uuid, username text, avatar_url text, bio text, matched_at timestamp with time zone)
LANGUAGE sql SECURITY DEFINER AS $$
  SELECT 
    p.id, 
    p.username, 
    p.avatar_url, 
    p.bio,
    m.created_at as matched_at
  FROM profiles p
  JOIN travel_matches m ON 
    (m.user1_id = user_id AND m.user2_id = p.id) 
    OR (m.user2_id = user_id AND m.user1_id = p.id)
  ORDER BY m.created_at DESC;
$$;

-- === Seed Data ===
INSERT INTO profiles (username, avatar_url, bio) VALUES
('alice', 'https://randomuser.me/api/portraits/women/1.jpg', 'Adventure lover exploring Europe 🌍'),
('bob', 'https://randomuser.me/api/portraits/men/2.jpg', 'Remote worker hopping cities 💻'),
('carol', 'https://randomuser.me/api/portraits/women/3.jpg', 'Digital nomad and foodie 🍜'),
('dave', 'https://randomuser.me/api/portraits/men/4.jpg', 'Backpacker through Asia 🎒'),
('eve', 'https://randomuser.me/api/portraits/women/5.jpg', 'Seeker of hidden gems 💎'),
('frank', 'https://randomuser.me/api/portraits/men/6.jpg', 'Business traveler who loves local spots 🏢'),
('grace', 'https://randomuser.me/api/portraits/women/7.jpg', 'Solo female traveler and photographer 📸'),
('henry', 'https://randomuser.me/api/portraits/men/8.jpg', 'Adventure sports enthusiast 🏔️'),
('iris', 'https://randomuser.me/api/portraits/women/9.jpg', 'Cultural explorer and language learner 📚'),
('jack', 'https://randomuser.me/api/portraits/men/10.jpg', 'Sustainable travel advocate 🌱')
ON CONFLICT (username) DO NOTHING;

-- Create some sample swipes and matches
DO $$
DECLARE
  alice_id uuid;
  bob_id uuid;
  carol_id uuid;
  dave_id uuid;
  eve_id uuid;
  frank_id uuid;
BEGIN
  -- Get user IDs
  SELECT id INTO alice_id FROM profiles WHERE username = 'alice';
  SELECT id INTO bob_id FROM profiles WHERE username = 'bob';
  SELECT id INTO carol_id FROM profiles WHERE username = 'carol';
  SELECT id INTO dave_id FROM profiles WHERE username = 'dave';
  SELECT id INTO eve_id FROM profiles WHERE username = 'eve';
  SELECT id INTO frank_id FROM profiles WHERE username = 'frank';

  -- Create mutual likes (will create matches)
  IF alice_id IS NOT NULL AND bob_id IS NOT NULL THEN
    INSERT INTO travel_swipes (swiper_id, swiped_id, liked) VALUES
    (alice_id, bob_id, true),
    (bob_id, alice_id, true)
    ON CONFLICT (swiper_id, swiped_id) DO NOTHING;
    
    INSERT INTO travel_matches (user1_id, user2_id) VALUES
    (LEAST(alice_id, bob_id), GREATEST(alice_id, bob_id))
    ON CONFLICT (user1_id, user2_id) DO NOTHING;
  END IF;

  IF carol_id IS NOT NULL AND dave_id IS NOT NULL THEN
    INSERT INTO travel_swipes (swiper_id, swiped_id, liked) VALUES
    (carol_id, dave_id, true),
    (dave_id, carol_id, true)
    ON CONFLICT (swiper_id, swiped_id) DO NOTHING;
    
    INSERT INTO travel_matches (user1_id, user2_id) VALUES
    (LEAST(carol_id, dave_id), GREATEST(carol_id, dave_id))
    ON CONFLICT (user1_id, user2_id) DO NOTHING;
  END IF;

  -- Create some one-way likes (no matches yet)
  IF eve_id IS NOT NULL AND frank_id IS NOT NULL THEN
    INSERT INTO travel_swipes (swiper_id, swiped_id, liked) VALUES
    (eve_id, frank_id, true)
    ON CONFLICT (swiper_id, swiped_id) DO NOTHING;
  END IF;

  -- Create some passes
  IF alice_id IS NOT NULL AND carol_id IS NOT NULL THEN
    INSERT INTO travel_swipes (swiper_id, swiped_id, liked) VALUES
    (alice_id, carol_id, false)
    ON CONFLICT (swiper_id, swiped_id) DO NOTHING;
  END IF;
END $$;