/*
  # Complete Travel Database Schema

  1. New Tables
    - `users` - User profiles with travel preferences
    - `trips` - Planned trips with AI-generated itineraries
    - `matches` - Travel buddy matching system
    - `itineraries` - Detailed day-by-day travel plans
    - `travel_preferences` - User travel style and interests
    - `buddy_requests` - Travel companion connection requests

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Add policies for public profile viewing and buddy matching

  3. Features
    - AI itinerary storage in JSONB format
    - Travel buddy matching based on destinations and dates
    - User preferences for personalized recommendations
    - Trip sharing and collaboration features
*/

-- ==============================================
-- USERS TABLE (Enhanced user profiles)
-- ==============================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  age INT,
  profile_photo_url TEXT,
  bio TEXT,
  location TEXT,
  preferred_destinations TEXT[],
  travel_style TEXT CHECK (travel_style IN ('budget', 'mid-range', 'luxury', 'backpacker', 'business')),
  interests TEXT[],
  languages_spoken TEXT[],
  verified BOOLEAN DEFAULT false,
  public_profile BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- ==============================================
-- TRAVEL PREFERENCES TABLE
-- ==============================================
CREATE TABLE IF NOT EXISTS travel_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  accommodation_type TEXT[] DEFAULT ARRAY['hotel', 'hostel', 'airbnb'],
  budget_range_min INT DEFAULT 50,
  budget_range_max INT DEFAULT 500,
  preferred_activities TEXT[] DEFAULT ARRAY['sightseeing', 'food', 'culture'],
  travel_pace TEXT DEFAULT 'moderate' CHECK (travel_pace IN ('slow', 'moderate', 'fast')),
  group_size_preference TEXT DEFAULT 'small' CHECK (group_size_preference IN ('solo', 'small', 'large', 'any')),
  dietary_restrictions TEXT[],
  accessibility_needs TEXT[],
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE travel_preferences ENABLE ROW LEVEL SECURITY;

-- ==============================================
-- TRIPS TABLE (Enhanced with AI data)
-- ==============================================
CREATE TABLE IF NOT EXISTS trips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  destination TEXT NOT NULL,
  country TEXT,
  start_date DATE,
  end_date DATE,
  duration_days INT,
  budget DECIMAL(10,2),
  currency TEXT DEFAULT 'USD',
  trip_type TEXT CHECK (trip_type IN ('solo', 'couple', 'family', 'friends', 'business')),
  status TEXT DEFAULT 'planning' CHECK (status IN ('planning', 'booked', 'ongoing', 'completed', 'cancelled')),
  itinerary_json JSONB, -- AI-generated structured itinerary
  ai_generated BOOLEAN DEFAULT false,
  ai_prompt TEXT, -- Original user prompt that generated the itinerary
  public BOOLEAN DEFAULT false,
  looking_for_buddies BOOLEAN DEFAULT false,
  max_buddies INT DEFAULT 4,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE trips ENABLE ROW LEVEL SECURITY;

-- ==============================================
-- ITINERARIES TABLE (Normalized daily plans)
-- ==============================================
CREATE TABLE IF NOT EXISTS itineraries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID REFERENCES trips(id) ON DELETE CASCADE,
  day_number INT NOT NULL,
  date DATE,
  morning_activity TEXT,
  morning_description TEXT,
  morning_cost DECIMAL(8,2),
  morning_duration TEXT,
  afternoon_activity TEXT,
  afternoon_description TEXT,
  afternoon_cost DECIMAL(8,2),
  afternoon_duration TEXT,
  evening_activity TEXT,
  evening_description TEXT,
  evening_cost DECIMAL(8,2),
  evening_duration TEXT,
  daily_total_cost DECIMAL(8,2),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(trip_id, day_number)
);

ALTER TABLE itineraries ENABLE ROW LEVEL SECURITY;

-- ==============================================
-- MATCHES TABLE (Travel buddy connections)
-- ==============================================
CREATE TABLE IF NOT EXISTS matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id_1 UUID REFERENCES trips(id) ON DELETE CASCADE,
  trip_id_2 UUID REFERENCES trips(id) ON DELETE CASCADE,
  user_id_1 UUID REFERENCES users(id) ON DELETE CASCADE,
  user_id_2 UUID REFERENCES users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'expired')),
  match_score DECIMAL(3,2), -- AI-calculated compatibility score (0.00-1.00)
  common_interests TEXT[],
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ DEFAULT (now() + INTERVAL '30 days'),
  UNIQUE(trip_id_1, trip_id_2)
);

ALTER TABLE matches ENABLE ROW LEVEL SECURITY;

-- ==============================================
-- BUDDY REQUESTS TABLE (Direct connection requests)
-- ==============================================
CREATE TABLE IF NOT EXISTS buddy_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  to_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  trip_id UUID REFERENCES trips(id) ON DELETE CASCADE,
  message TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(from_user_id, to_user_id, trip_id)
);

ALTER TABLE buddy_requests ENABLE ROW LEVEL SECURITY;

-- ==============================================
-- TRIP PARTICIPANTS TABLE (Group travel management)
-- ==============================================
CREATE TABLE IF NOT EXISTS trip_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID REFERENCES trips(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'participant' CHECK (role IN ('owner', 'co-organizer', 'participant')),
  joined_at TIMESTAMPTZ DEFAULT now(),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'left', 'removed')),
  UNIQUE(trip_id, user_id)
);

ALTER TABLE trip_participants ENABLE ROW LEVEL SECURITY;

-- ==============================================
-- SAVED ITINERARIES TABLE (Bookmarked trips)
-- ==============================================
CREATE TABLE IF NOT EXISTS saved_itineraries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  trip_id UUID REFERENCES trips(id) ON DELETE CASCADE,
  saved_at TIMESTAMPTZ DEFAULT now(),
  notes TEXT,
  UNIQUE(user_id, trip_id)
);

ALTER TABLE saved_itineraries ENABLE ROW LEVEL SECURITY;

-- ==============================================
-- INDEXES FOR PERFORMANCE
-- ==============================================
CREATE INDEX IF NOT EXISTS idx_users_auth_user_id ON users(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_users_location ON users(location);
CREATE INDEX IF NOT EXISTS idx_trips_user_id ON trips(user_id);
CREATE INDEX IF NOT EXISTS idx_trips_destination ON trips(destination);
CREATE INDEX IF NOT EXISTS idx_trips_dates ON trips(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_trips_looking_for_buddies ON trips(looking_for_buddies) WHERE looking_for_buddies = true;
CREATE INDEX IF NOT EXISTS idx_itineraries_trip_id ON itineraries(trip_id);
CREATE INDEX IF NOT EXISTS idx_matches_users ON matches(user_id_1, user_id_2);
CREATE INDEX IF NOT EXISTS idx_matches_status ON matches(status);
CREATE INDEX IF NOT EXISTS idx_buddy_requests_users ON buddy_requests(from_user_id, to_user_id);

-- ==============================================
-- ROW LEVEL SECURITY POLICIES
-- ==============================================

-- Users can read their own profile and public profiles
CREATE POLICY "Users can read own profile" ON users
  FOR SELECT TO authenticated
  USING (auth.uid() = auth_user_id);

CREATE POLICY "Users can read public profiles" ON users
  FOR SELECT TO authenticated
  USING (public_profile = true);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE TO authenticated
  USING (auth.uid() = auth_user_id);

CREATE POLICY "Users can insert own profile" ON users
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = auth_user_id);

-- Travel preferences - users can manage their own
CREATE POLICY "Users can manage own preferences" ON travel_preferences
  FOR ALL TO authenticated
  USING (user_id IN (SELECT id FROM users WHERE auth_user_id = auth.uid()));

-- Trips - users can manage their own trips and view public trips
CREATE POLICY "Users can manage own trips" ON trips
  FOR ALL TO authenticated
  USING (user_id IN (SELECT id FROM users WHERE auth_user_id = auth.uid()));

CREATE POLICY "Users can view public trips" ON trips
  FOR SELECT TO authenticated
  USING (public = true);

-- Itineraries - users can manage itineraries for their trips
CREATE POLICY "Users can manage own itineraries" ON itineraries
  FOR ALL TO authenticated
  USING (trip_id IN (
    SELECT id FROM trips WHERE user_id IN (
      SELECT id FROM users WHERE auth_user_id = auth.uid()
    )
  ));

-- Matches - users can view matches involving their trips
CREATE POLICY "Users can view own matches" ON matches
  FOR SELECT TO authenticated
  USING (
    user_id_1 IN (SELECT id FROM users WHERE auth_user_id = auth.uid()) OR
    user_id_2 IN (SELECT id FROM users WHERE auth_user_id = auth.uid())
  );

CREATE POLICY "Users can create matches" ON matches
  FOR INSERT TO authenticated
  WITH CHECK (
    user_id_1 IN (SELECT id FROM users WHERE auth_user_id = auth.uid()) OR
    user_id_2 IN (SELECT id FROM users WHERE auth_user_id = auth.uid())
  );

CREATE POLICY "Users can update own matches" ON matches
  FOR UPDATE TO authenticated
  USING (
    user_id_1 IN (SELECT id FROM users WHERE auth_user_id = auth.uid()) OR
    user_id_2 IN (SELECT id FROM users WHERE auth_user_id = auth.uid())
  );

-- Buddy requests - users can manage requests they send/receive
CREATE POLICY "Users can view buddy requests" ON buddy_requests
  FOR SELECT TO authenticated
  USING (
    from_user_id IN (SELECT id FROM users WHERE auth_user_id = auth.uid()) OR
    to_user_id IN (SELECT id FROM users WHERE auth_user_id = auth.uid())
  );

CREATE POLICY "Users can send buddy requests" ON buddy_requests
  FOR INSERT TO authenticated
  WITH CHECK (from_user_id IN (SELECT id FROM users WHERE auth_user_id = auth.uid()));

CREATE POLICY "Users can respond to buddy requests" ON buddy_requests
  FOR UPDATE TO authenticated
  USING (to_user_id IN (SELECT id FROM users WHERE auth_user_id = auth.uid()));

-- Trip participants - users can view participants of trips they're part of
CREATE POLICY "Users can view trip participants" ON trip_participants
  FOR SELECT TO authenticated
  USING (
    trip_id IN (
      SELECT trip_id FROM trip_participants 
      WHERE user_id IN (SELECT id FROM users WHERE auth_user_id = auth.uid())
    )
  );

-- Saved itineraries - users can manage their own saved trips
CREATE POLICY "Users can manage saved itineraries" ON saved_itineraries
  FOR ALL TO authenticated
  USING (user_id IN (SELECT id FROM users WHERE auth_user_id = auth.uid()));

-- ==============================================
-- FUNCTIONS FOR BUSINESS LOGIC
-- ==============================================

-- Function to calculate match score between two users
CREATE OR REPLACE FUNCTION calculate_match_score(user1_id UUID, user2_id UUID)
RETURNS DECIMAL(3,2) AS $$
DECLARE
  score DECIMAL(3,2) := 0.0;
  common_destinations INT := 0;
  common_interests INT := 0;
  age_diff INT := 0;
BEGIN
  -- Calculate common destinations (30% weight)
  SELECT COUNT(*)
  INTO common_destinations
  FROM (
    SELECT UNNEST(preferred_destinations) as dest FROM users WHERE id = user1_id
    INTERSECT
    SELECT UNNEST(preferred_destinations) as dest FROM users WHERE id = user2_id
  ) common_dest;
  
  score := score + (common_destinations * 0.3);
  
  -- Calculate common interests (40% weight)
  SELECT COUNT(*)
  INTO common_interests
  FROM (
    SELECT UNNEST(interests) as interest FROM users WHERE id = user1_id
    INTERSECT
    SELECT UNNEST(interests) as interest FROM users WHERE id = user2_id
  ) common_int;
  
  score := score + (common_interests * 0.4);
  
  -- Age compatibility (30% weight)
  SELECT ABS(u1.age - u2.age)
  INTO age_diff
  FROM users u1, users u2
  WHERE u1.id = user1_id AND u2.id = user2_id;
  
  -- Closer ages get higher scores
  IF age_diff <= 5 THEN
    score := score + 0.3;
  ELSIF age_diff <= 10 THEN
    score := score + 0.2;
  ELSIF age_diff <= 15 THEN
    score := score + 0.1;
  END IF;
  
  -- Cap score at 1.0
  IF score > 1.0 THEN
    score := 1.0;
  END IF;
  
  RETURN score;
END;
$$ LANGUAGE plpgsql;

-- Function to find potential travel buddies
CREATE OR REPLACE FUNCTION find_travel_buddies(user_trip_id UUID)
RETURNS TABLE (
  buddy_user_id UUID,
  buddy_trip_id UUID,
  buddy_name TEXT,
  buddy_destination TEXT,
  match_score DECIMAL(3,2),
  common_dates INT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    u.id as buddy_user_id,
    t.id as buddy_trip_id,
    u.name as buddy_name,
    t.destination as buddy_destination,
    calculate_match_score(
      (SELECT user_id FROM trips WHERE id = user_trip_id),
      u.id
    ) as match_score,
    CASE 
      WHEN t.start_date <= ut.end_date AND t.end_date >= ut.start_date 
      THEN (LEAST(t.end_date, ut.end_date) - GREATEST(t.start_date, ut.start_date))::INT + 1
      ELSE 0
    END as common_dates
  FROM trips t
  JOIN users u ON t.user_id = u.id
  JOIN trips ut ON ut.id = user_trip_id
  WHERE t.id != user_trip_id
    AND t.looking_for_buddies = true
    AND t.status = 'planning'
    AND u.public_profile = true
    AND (
      t.destination ILIKE '%' || ut.destination || '%' OR
      ut.destination ILIKE '%' || t.destination || '%'
    )
    AND (
      t.start_date <= ut.end_date AND t.end_date >= ut.start_date
    )
  ORDER BY match_score DESC, common_dates DESC
  LIMIT 20;
END;
$$ LANGUAGE plpgsql;

-- ==============================================
-- TRIGGERS FOR AUTOMATIC UPDATES
-- ==============================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_trips_updated_at BEFORE UPDATE ON trips
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_itineraries_updated_at BEFORE UPDATE ON itineraries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_matches_updated_at BEFORE UPDATE ON matches
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-calculate trip duration
CREATE OR REPLACE FUNCTION calculate_trip_duration()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.start_date IS NOT NULL AND NEW.end_date IS NOT NULL THEN
    NEW.duration_days := (NEW.end_date - NEW.start_date) + 1;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER calculate_trip_duration_trigger BEFORE INSERT OR UPDATE ON trips
  FOR EACH ROW EXECUTE FUNCTION calculate_trip_duration();

-- ==============================================
-- SAMPLE DATA FOR TESTING
-- ==============================================

-- Insert sample users (only if not exists)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM users LIMIT 1) THEN
    INSERT INTO users (name, email, age, bio, location, preferred_destinations, travel_style, interests, languages_spoken, public_profile) VALUES
    ('Alex Chen', 'alex@example.com', 28, 'Digital nomad who loves exploring Asia and trying local street food.', 'San Francisco, CA', ARRAY['Japan', 'Thailand', 'Vietnam'], 'mid-range', ARRAY['food', 'culture', 'photography'], ARRAY['English', 'Mandarin'], true),
    ('Maria Rodriguez', 'maria@example.com', 34, 'Adventure seeker and yoga instructor. Always looking for new hiking trails and spiritual experiences.', 'Barcelona, Spain', ARRAY['Peru', 'Nepal', 'India'], 'budget', ARRAY['adventure', 'wellness', 'nature'], ARRAY['Spanish', 'English'], true),
    ('James Wilson', 'james@example.com', 29, 'History buff and architecture enthusiast. Love exploring ancient cities and museums.', 'London, UK', ARRAY['Italy', 'Greece', 'Egypt'], 'luxury', ARRAY['history', 'architecture', 'museums'], ARRAY['English', 'French'], true),
    ('Sophie Martin', 'sophie@example.com', 26, 'Backpacker and solo traveler. Always up for spontaneous adventures and meeting new people.', 'Montreal, Canada', ARRAY['Southeast Asia', 'South America', 'Eastern Europe'], 'backpacker', ARRAY['backpacking', 'nightlife', 'local culture'], ARRAY['French', 'English'], true);
  END IF;
END $$;