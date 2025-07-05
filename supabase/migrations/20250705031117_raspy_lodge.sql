/*
  # Travel Buddy System

  1. New Tables
    - `profiles` - User profiles for travel buddy system
    - `travel_swipes` - Records swipe actions between users
    - `travel_matches` - Stores mutual matches between users
  
  2. Functions
    - `record_swipe` - Records a swipe and creates a match if mutual
    - `get_potential_travel_buddies` - Finds potential travel buddies
    - `get_user_matches` - Gets a user's matches
  
  3. Security
    - Enable RLS on all tables
    - Add appropriate policies for secure access
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

CREATE INDEX ON travel_swipes (swiper_id, swiped_id);
CREATE INDEX ON travel_matches (user1_id, user2_id);

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
('frank', 'https://randomuser.me/api/portraits/men/6.jpg', 'Business traveler who loves local spots');

INSERT INTO travel_swipes (swiper_id, swiped_id, liked) VALUES
((SELECT id FROM profiles WHERE username='alice'), (SELECT id FROM profiles WHERE username='bob'), true),
((SELECT id FROM profiles WHERE username='bob'), (SELECT id FROM profiles WHERE username='alice'), true),
((SELECT id FROM profiles WHERE username='carol'), (SELECT id FROM profiles WHERE username='dave'), true),
((SELECT id FROM profiles WHERE username='dave'), (SELECT id FROM profiles WHERE username='carol'), true);

INSERT INTO travel_matches (user1_id, user2_id) VALUES
((SELECT id FROM profiles WHERE username='alice'), (SELECT id FROM profiles WHERE username='bob')),
((SELECT id FROM profiles WHERE username='carol'), (SELECT id FROM profiles WHERE username='dave'));

-- === Functions ===
CREATE OR REPLACE FUNCTION record_swipe(swiper uuid, swiped uuid, liked boolean)
RETURNS void LANGUAGE plpgsql AS $$
BEGIN
  INSERT INTO travel_swipes (swiper_id, swiped_id, liked)
  VALUES (swiper, swiped, liked);

  IF liked THEN
    IF EXISTS (
      SELECT 1 FROM travel_swipes
      WHERE swiper_id = swiped AND swiped_id = swiper AND liked = true
    ) THEN
      INSERT INTO travel_matches (user1_id, user2_id)
      VALUES (swiper, swiped);
    END IF;
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION get_potential_travel_buddies(current_user uuid)
RETURNS TABLE(id uuid, username text, avatar_url text, bio text)
LANGUAGE sql AS $$
  SELECT p.id, p.username, p.avatar_url, p.bio
  FROM profiles p
  WHERE p.id != current_user
    AND p.id NOT IN (
      SELECT swiped_id FROM travel_swipes WHERE swiper_id = current_user
    )
$$;

CREATE OR REPLACE FUNCTION get_user_matches(current_user uuid)
RETURNS TABLE(id uuid, username text, avatar_url text, bio text)
LANGUAGE sql AS $$
  SELECT DISTINCT p.id, p.username, p.avatar_url, p.bio
  FROM profiles p
  JOIN travel_matches m ON 
    (m.user1_id = current_user AND m.user2_id = p.id) 
    OR (m.user2_id = current_user AND m.user1_id = p.id)
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