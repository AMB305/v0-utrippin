/*
  # Travel Buddy System Migration

  1. New Tables
    - `profiles` - User profiles for travel buddy matching
    - `travel_swipes` - Records of user swipes (like/pass)
    - `travel_matches` - Mutual matches between users

  2. Functions
    - `record_swipe` - Records a swipe and creates matches
    - `get_potential_travel_buddies` - Gets unswipped profiles
    - `get_user_matches` - Gets matched users

  3. Security
    - Enable RLS on all tables
    - Add policies for secure access
*/

-- === Travel Buddy schema ===
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text NOT NULL UNIQUE,
  avatar_url text,
  bio text,
  created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS travel_swipes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  swiper_id uuid REFERENCES profiles(id),
  swiped_id uuid REFERENCES profiles(id),
  liked boolean NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS travel_matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user1_id uuid REFERENCES profiles(id),
  user2_id uuid REFERENCES profiles(id),
  created_at timestamp with time zone DEFAULT now()
);

-- Create indexes for better performance
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'travel_swipes_swiper_swiped_idx') THEN
    CREATE INDEX travel_swipes_swiper_swiped_idx ON travel_swipes (swiper_id, swiped_id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'travel_matches_users_idx') THEN
    CREATE INDEX travel_matches_users_idx ON travel_matches (user1_id, user2_id);
  END IF;
END $$;

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE travel_swipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE travel_matches ENABLE ROW LEVEL SECURITY;

-- === Seed data ===
INSERT INTO profiles (username, avatar_url, bio) VALUES
('alice', 'https://randomuser.me/api/portraits/women/1.jpg', 'Adventure lover exploring Europe'),
('bob', 'https://randomuser.me/api/portraits/men/2.jpg', 'Remote worker hopping cities'),
('carol', 'https://randomuser.me/api/portraits/women/3.jpg', 'Digital nomad and foodie'),
('dave', 'https://randomuser.me/api/portraits/men/4.jpg', 'Backpacker through Asia'),
('eve', 'https://randomuser.me/api/portraits/women/5.jpg', 'Seeker of hidden gems'),
('frank', 'https://randomuser.me/api/portraits/men/6.jpg', 'Business traveler who loves local spots')
ON CONFLICT (username) DO NOTHING;

-- Insert swipes data
DO $$
DECLARE
  alice_id uuid;
  bob_id uuid;
  carol_id uuid;
  dave_id uuid;
BEGIN
  SELECT id INTO alice_id FROM profiles WHERE username = 'alice';
  SELECT id INTO bob_id FROM profiles WHERE username = 'bob';
  SELECT id INTO carol_id FROM profiles WHERE username = 'carol';
  SELECT id INTO dave_id FROM profiles WHERE username = 'dave';

  INSERT INTO travel_swipes (swiper_id, swiped_id, liked) VALUES
  (alice_id, bob_id, true),
  (bob_id, alice_id, true),
  (carol_id, dave_id, true),
  (dave_id, carol_id, true)
  ON CONFLICT DO NOTHING;

  INSERT INTO travel_matches (user1_id, user2_id) VALUES
  (alice_id, bob_id),
  (carol_id, dave_id)
  ON CONFLICT DO NOTHING;
END $$;

-- === Functions ===
CREATE OR REPLACE FUNCTION record_swipe(swiper_user_id uuid, swiped_user_id uuid, is_liked boolean)
RETURNS void LANGUAGE plpgsql AS $$
BEGIN
  INSERT INTO travel_swipes (swiper_id, swiped_id, liked)
  VALUES (swiper_user_id, swiped_user_id, is_liked);

  IF is_liked THEN
    IF EXISTS (
      SELECT 1 FROM travel_swipes
      WHERE swiper_id = swiped_user_id AND swiped_id = swiper_user_id AND liked = true
    ) THEN
      INSERT INTO travel_matches (user1_id, user2_id)
      VALUES (swiper_user_id, swiped_user_id);
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
$$;

CREATE OR REPLACE FUNCTION get_user_matches(user_id uuid)
RETURNS TABLE(id uuid, username text, avatar_url text, bio text)
LANGUAGE sql AS $$
  SELECT DISTINCT p.id, p.username, p.avatar_url, p.bio
  FROM profiles p
  JOIN travel_matches m ON 
    (m.user1_id = user_id AND m.user2_id = p.id) 
    OR (m.user2_id = user_id AND m.user1_id = p.id)
$$;

-- === Security Policies ===
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