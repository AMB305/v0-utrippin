-- Enhance RLS policies to use direct auth.uid() checks for better performance and security

-- Update users table policies
DROP POLICY IF EXISTS "Users can read own data" ON public.users;
DROP POLICY IF EXISTS "Users can update own data" ON public.users;
DROP POLICY IF EXISTS "Users can insert own data" ON public.users;

CREATE POLICY "Users can read own data" ON public.users
FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON public.users
FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own data" ON public.users
FOR INSERT WITH CHECK (auth.uid() = id);

-- Update trips table policies
DROP POLICY IF EXISTS "Users can manage own trips" ON public.trips;
DROP POLICY IF EXISTS "Users can view public trips" ON public.trips;

CREATE POLICY "Users can manage own trips" ON public.trips
FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Users can view public trips" ON public.trips
FOR SELECT USING (public = true OR user_id = auth.uid());

-- Update travel_preferences table policies
DROP POLICY IF EXISTS "Users can manage own preferences" ON public.travel_preferences;

CREATE POLICY "Users can manage own preferences" ON public.travel_preferences
FOR ALL USING (user_id = auth.uid());

-- Update buddy_requests table policies for better security
DROP POLICY IF EXISTS "Users can view buddy requests" ON public.buddy_requests;
DROP POLICY IF EXISTS "Users can send buddy requests" ON public.buddy_requests;
DROP POLICY IF EXISTS "Users can respond to buddy requests" ON public.buddy_requests;

CREATE POLICY "Users can view buddy requests" ON public.buddy_requests
FOR SELECT USING (from_user_id = auth.uid() OR to_user_id = auth.uid());

CREATE POLICY "Users can send buddy requests" ON public.buddy_requests
FOR INSERT WITH CHECK (from_user_id = auth.uid());

CREATE POLICY "Users can respond to buddy requests" ON public.buddy_requests
FOR UPDATE USING (to_user_id = auth.uid());

-- Update matches table policies
DROP POLICY IF EXISTS "Users can view own matches" ON public.matches;
DROP POLICY IF EXISTS "Users can create matches" ON public.matches;
DROP POLICY IF EXISTS "Users can update own matches" ON public.matches;

CREATE POLICY "Users can view own matches" ON public.matches
FOR SELECT USING (user_id_1 = auth.uid() OR user_id_2 = auth.uid());

CREATE POLICY "Users can create matches" ON public.matches
FOR INSERT WITH CHECK (user_id_1 = auth.uid() OR user_id_2 = auth.uid());

CREATE POLICY "Users can update own matches" ON public.matches
FOR UPDATE USING (user_id_1 = auth.uid() OR user_id_2 = auth.uid());

-- Update travel_buddy_matches table policies
DROP POLICY IF EXISTS "Users can view own matches" ON public.travel_buddy_matches;
DROP POLICY IF EXISTS "Users can update own matches" ON public.travel_buddy_matches;

CREATE POLICY "Users can view own matches" ON public.travel_buddy_matches
FOR SELECT USING (user1_id = auth.uid() OR user2_id = auth.uid());

CREATE POLICY "Users can update own matches" ON public.travel_buddy_matches
FOR UPDATE USING (user1_id = auth.uid() OR user2_id = auth.uid());

-- Update itineraries table policies
DROP POLICY IF EXISTS "Users can manage own itineraries" ON public.itineraries;

CREATE POLICY "Users can manage own itineraries" ON public.itineraries
FOR ALL USING (
  trip_id IN (
    SELECT id FROM public.trips WHERE user_id = auth.uid()
  )
);

-- Update saved_itineraries table policies
DROP POLICY IF EXISTS "Users can manage saved itineraries" ON public.saved_itineraries;

CREATE POLICY "Users can manage saved itineraries" ON public.saved_itineraries
FOR ALL USING (user_id = auth.uid());

-- Update trip_participants table policies
DROP POLICY IF EXISTS "Users can view trip participants" ON public.trip_participants;

CREATE POLICY "Users can view trip participants" ON public.trip_participants
FOR SELECT USING (
  user_id = auth.uid() OR 
  trip_id IN (
    SELECT id FROM public.trips WHERE user_id = auth.uid()
  )
);

-- Add constraints for data validation
ALTER TABLE public.users 
ADD CONSTRAINT users_age_check CHECK (age IS NULL OR (age >= 18 AND age <= 120)),
ADD CONSTRAINT users_email_not_empty CHECK (email != ''),
ADD CONSTRAINT users_bio_length CHECK (char_length(bio) <= 500);

ALTER TABLE public.trips
ADD CONSTRAINT trips_title_not_empty CHECK (title != ''),
ADD CONSTRAINT trips_destination_not_empty CHECK (destination != ''),
ADD CONSTRAINT trips_budget_positive CHECK (budget IS NULL OR budget >= 0),
ADD CONSTRAINT trips_max_buddies_range CHECK (max_buddies IS NULL OR (max_buddies >= 1 AND max_buddies <= 10)),
ADD CONSTRAINT trips_dates_logical CHECK (
  start_date IS NULL OR end_date IS NULL OR end_date >= start_date
);

ALTER TABLE public.bookings
ADD CONSTRAINT bookings_total_price_positive CHECK (total_price >= 0),
ADD CONSTRAINT bookings_valid_type CHECK (type IN ('flight', 'hotel', 'car', 'package'));

-- Add indexes for better performance on auth.uid() queries
CREATE INDEX IF NOT EXISTS idx_users_id ON public.users(id);
CREATE INDEX IF NOT EXISTS idx_trips_user_id ON public.trips(user_id);
CREATE INDEX IF NOT EXISTS idx_travel_preferences_user_id ON public.travel_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_buddy_requests_from_user ON public.buddy_requests(from_user_id);
CREATE INDEX IF NOT EXISTS idx_buddy_requests_to_user ON public.buddy_requests(to_user_id);
CREATE INDEX IF NOT EXISTS idx_matches_user1 ON public.matches(user_id_1);
CREATE INDEX IF NOT EXISTS idx_matches_user2 ON public.matches(user_id_2);
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON public.bookings(user_id);
