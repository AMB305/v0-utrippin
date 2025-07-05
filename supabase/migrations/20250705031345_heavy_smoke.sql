/*
  # Travel Buddy System Migration

  1. New Tables
    - `profiles` - User profiles for travel buddy matching
    - `travel_swipes` - Records user swipes (like/pass)
    - `travel_matches` - Stores mutual matches between users

  2. Functions
    - `record_swipe` - Records a swipe and creates matches
    - `get_potential_travel_buddies` - Gets unswipped profiles
    - `get_user_matches` - Gets matched users

  3. Security
    - Enable RLS on all tables
    - Add policies for proper access control
*/

-- === Travel Buddy Schema ===

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text NOT NULL,
  avatar_url text,
  bio text,
  created_at timestamp with time zone DEFAULT now()
);

-- Add unique constraint if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'profiles_username_key' 
    AND table_name = 'profiles'
  ) THEN
    ALTER TABLE profiles ADD CONSTRAINT profiles_username_key UNIQUE (username);
  END IF;
END $$;

-- Create travel_swipes table
CREATE TABLE IF NOT EXISTS travel_swipes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  swiper_id uuid,
  swiped_id uuid,
  liked boolean NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- Add foreign key constraints if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'travel_swipes_swiper_id_fkey' 
    AND table_name = 'travel_swipes'
  ) THEN
    ALTER TABLE travel_swipes ADD CONSTRAINT travel_swipes_swiper_id_fkey 
    FOREIGN KEY (swiper_id) REFERENCES profiles(id);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'travel_swipes_swiped_id_fkey' 
    AND table_name = 'travel_swipes'
  ) THEN
    ALTER TABLE travel_swipes ADD CONSTRAINT travel_swipes_swiped_id_fkey 
    FOREIGN KEY (swiped_id) REFERENCES profiles(id);
  END IF;
END $$;

-- Create travel_matches table
CREATE TABLE IF NOT EXISTS travel_matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user1_id uuid,
  user2_id uuid,
  created_at timestamp with time zone DEFAULT now()
);

-- Add foreign key constraints for travel_matches
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'travel_matches_user1_id_fkey' 
    AND table_name = 'travel_matches'
  ) THEN
    ALTER TABLE travel_matches ADD CONSTRAINT travel_matches_user1_id_fkey 
    FOREIGN KEY (user1_id) REFERENCES profiles(id);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'travel_matches_user2_id_fkey' 
    AND table_name = 'travel_matches'
  ) THEN
    ALTER TABLE travel_matches ADD CONSTRAINT travel_matches_user2_id_fkey 
    FOREIGN KEY (user2_id) REFERENCES profiles(id);
  END IF;
END $$;

-- Create indexes for better performance
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE indexname = 'travel_swipes_swiper_swiped_idx'
  ) THEN
    CREATE INDEX travel_swipes_swiper_swiped_idx ON travel_swipes (swiper_id, swiped_id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE indexname = 'travel_matches_users_idx'
  ) THEN
    CREATE INDEX travel_matches_users_idx ON travel_matches (user1_id, user2_id);
  END IF;
END $$;

-- Add unique constraint to prevent duplicate swipes
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'travel_swipes_unique_swipe' 
    AND table_name = 'travel_swipes'
  ) THEN
    ALTER TABLE travel_swipes ADD CONSTRAINT travel_swipes_unique_swipe 
    UNIQUE (swiper_id, swiped_id);
  END IF;
END $$;

-- Add unique constraint to prevent duplicate matches
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'travel_matches_unique_match' 
    AND table_name = 'travel_matches'
  ) THEN
    ALTER TABLE travel_matches ADD CONSTRAINT travel_matches_unique_match 
    UNIQUE (user1_id, user2_id);
  END IF;
END $$;

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE travel_swipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE travel_matches ENABLE ROW LEVEL SECURITY;

-- === Seed Data ===
INSERT INTO profiles (username, avatar_url, bio) VALUES
('alice', 'https://randomuser.me/api/portraits/women/1.jpg', 'Adventure lover exploring Europe'),
('bob', 'https://randomuser.me/api/portraits/men/2.jpg', 'Remote worker hopping cities'),
('carol', 'https://randomuser.me/api/portraits/women/3.jpg', 'Digital nomad and foodie'),
('dave', 'https://randomuser.me/api/portraits/men/4.jpg', 'Backpacker through Asia'),
('eve', 'https://randomuser.me/api/portraits/women/5.jpg', 'Seeker of hidden gems'),
('frank', 'https://randomuser.me/api/portraits/men/6.jpg', 'Business traveler who loves local spots')
ON CONFLICT (username) DO NOTHING;

-- Insert swipes and matches data
DO $$
DECLARE
  alice_id uuid;
  bob_id uuid;
  carol_id uuid;
  dave_id uuid;
BEGIN
  -- Get user IDs
  SELECT id INTO alice_id FROM profiles WHERE username = 'alice';
  SELECT id INTO bob_id FROM profiles WHERE username = 'bob';
  SELECT id INTO carol_id FROM profiles WHERE username = 'carol';
  SELECT id INTO dave_id FROM profiles WHERE username = 'dave';

  -- Insert swipes (only if IDs exist)
  IF alice_id IS NOT NULL AND bob_id IS NOT NULL THEN
    INSERT INTO travel_swipes (swiper_id, swiped_id, liked) VALUES
    (alice_id, bob_id, true),
    (bob_id, alice_id, true)
    ON CONFLICT (swiper_id, swiped_id) DO NOTHING;
  END IF;

  IF carol_id IS NOT NULL AND dave_id IS NOT NULL THEN
    INSERT INTO travel_swipes (swiper_id, swiped_id, liked) VALUES
    (carol_id, dave_id, true),
    (dave_id, carol_id, true)
    ON CONFLICT (swiper_id, swiped_id) DO NOTHING;
  END IF;

  -- Insert matches (only if IDs exist)
  IF alice_id IS NOT NULL AND bob_id IS NOT NULL THEN
    INSERT INTO travel_matches (user1_id, user2_id) VALUES
    (alice_id, bob_id)
    ON CONFLICT (user1_id, user2_id) DO NOTHING;
  END IF;

  IF carol_id IS NOT NULL AND dave_id IS NOT NULL THEN
    INSERT INTO travel_matches (user1_id, user2_id) VALUES
    (carol_id, dave_id)
    ON CONFLICT (user1_id, user2_id) DO NOTHING;
  END IF;
END $$;

-- === Functions ===
CREATE OR REPLACE FUNCTION record_swipe(swiper_user_id uuid, swiped_user_id uuid, is_liked boolean)
RETURNS void LANGUAGE plpgsql AS $$
BEGIN
  -- Insert the swipe
  INSERT INTO travel_swipes (swiper_id, swiped_id, liked)
  VALUES (swiper_user_id, swiped_user_id, is_liked)
  ON CONFLICT (swiper_id, swiped_id) DO UPDATE SET liked = is_liked;

  -- If it's a like, check for mutual match
  IF is_liked THEN
    IF EXISTS (
      SELECT 1 FROM travel_swipes
      WHERE swiper_id = swiped_user_id 
      AND swiped_id = swiper_user_id 
      AND liked = true
    ) THEN
      -- Create match (avoid duplicates)
      INSERT INTO travel_matches (user1_id, user2_id)
      VALUES (swiper_user_id, swiped_user_id)
      ON CONFLICT (user1_id, user2_id) DO NOTHING;
    END IF;
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION get_potential_travel_buddies(user_id uuid)
RETURNS TABLE(id uuid, username text, avatar_url text, bio text)
LANGUAGE sql AS $$
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
RETURNS TABLE(id uuid, username text, avatar_url text, bio text)
LANGUAGE sql AS $$
  SELECT DISTINCT p.id, p.username, p.avatar_url, p.bio
  FROM profiles p
  JOIN travel_matches m ON 
    (m.user1_id = user_id AND m.user2_id = p.id) 
    OR (m.user2_id = user_id AND m.user1_id = p.id)
  ORDER BY p.username;
$$;

-- === Security Policies ===

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view their own swipes" ON travel_swipes;
DROP POLICY IF EXISTS "Users can create their own swipes" ON travel_swipes;
DROP POLICY IF EXISTS "Users can view their own matches" ON travel_matches;

-- Create new policies
CREATE POLICY "Public profiles are viewable by everyone" 
ON profiles FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" 
ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view their own swipes" 
ON travel_swipes FOR SELECT USING (auth.uid() = swiper_id OR auth.uid() = swiped_id);

CREATE POLICY "Users can create their own swipes" 
ON travel_swipes FOR INSERT WITH CHECK (auth.uid() = swiper_id);

CREATE POLICY "Users can view their own matches" 
ON travel_matches FOR SELECT USING (auth.uid() = user1_id OR auth.uid() = user2_id);