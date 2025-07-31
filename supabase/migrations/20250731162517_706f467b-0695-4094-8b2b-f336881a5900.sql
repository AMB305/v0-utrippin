-- Create missing tables for destination data
CREATE TABLE IF NOT EXISTS public.destination_weather (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  destination_id UUID NOT NULL,
  month TEXT NOT NULL,
  temperature TEXT NOT NULL,
  aqi INTEGER NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.destination_transport (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  destination_id UUID NOT NULL,
  mode TEXT NOT NULL,
  details TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.destination_visit_info (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  destination_id UUID NOT NULL,
  best_time TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.destination_photos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  destination_id UUID NOT NULL,
  url TEXT NOT NULL,
  caption TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.destination_weather ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.destination_transport ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.destination_visit_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.destination_photos ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Destination weather is publicly readable" 
ON public.destination_weather 
FOR SELECT 
USING (true);

CREATE POLICY "Destination transport is publicly readable" 
ON public.destination_transport 
FOR SELECT 
USING (true);

CREATE POLICY "Destination visit info is publicly readable" 
ON public.destination_visit_info 
FOR SELECT 
USING (true);

CREATE POLICY "Destination photos are publicly readable" 
ON public.destination_photos 
FOR SELECT 
USING (true);

-- Service role can manage all destination data
CREATE POLICY "Service role can manage destination weather" 
ON public.destination_weather 
FOR ALL 
USING (true);

CREATE POLICY "Service role can manage destination transport" 
ON public.destination_transport 
FOR ALL 
USING (true);

CREATE POLICY "Service role can manage destination visit info" 
ON public.destination_visit_info 
FOR ALL 
USING (true);

CREATE POLICY "Service role can manage destination photos" 
ON public.destination_photos 
FOR ALL 
USING (true);

-- Insert Vatican City destination data
INSERT INTO public.destinations (name, slug, description, country, category, featured, hero_image_url, average_cost_per_day)
VALUES (
  'Vatican City',
  'vatican-city',
  'Vatican City is the spiritual and administrative center of the Roman Catholic Church, home to the Pope and a treasure trove of art and history. As the world''s smallest independent nation, it is essentially a walled enclave within Rome.',
  'Vatican City',
  'Cultural',
  true,
  'https://placehold.co/1200x500/10B981/FFFFFF?text=Vatican+City',
  150
);

-- Get the destination ID for Vatican City
DO $$
DECLARE
    vatican_id UUID;
BEGIN
    SELECT id INTO vatican_id FROM public.destinations WHERE slug = 'vatican-city';
    
    -- Insert activities
    INSERT INTO public.destination_activities (destination_id, title, description, category) VALUES
    (vatican_id, 'St. Peter''s Basilica Tour', 'Marvel at the grandeur of one of the largest churches in the world, admire Michelangelo''s Pietà, and climb the dome for a panoramic view of Rome and Vatican City.', 'Sightseeing'),
    (vatican_id, 'Sistine Chapel Visit', 'Visit the Vatican Museums to see the Sistine Chapel''s famous ceiling frescoes by Michelangelo and the vast collections of art, sculptures, and tapestries gathered by the popes over centuries.', 'Culture'),
    (vatican_id, 'Vatican Necropolis Tour', 'Explore beneath the Basilica to see the Scavi (excavations) where St. Peter''s tomb lies (advance reservations required for this fascinating archaeological tour).', 'Historical'),
    (vatican_id, 'St. Peter''s Square Experience', 'Spend time in the famous piazza, designed by Bernini, and if possible attend a Papal Audience on Wednesday or the Sunday Angelus to see Pope Francis and receive a blessing.', 'Spiritual'),
    (vatican_id, 'Vatican Gardens Tour', 'If time permits, take a guided tour of the beautifully manicured Vatican Gardens for a peaceful break amid fountains, sculptures, and greenery (tours must be booked in advance).', 'Nature');

    -- Insert attractions
    INSERT INTO public.destination_attractions (destination_id, name, description, type, rating) VALUES
    (vatican_id, 'St. Peter''s Basilica', 'One of the largest churches in the world with Michelangelo''s Pietà', 'Religious Site', 4.8),
    (vatican_id, 'Sistine Chapel', 'Famous for Michelangelo''s ceiling frescoes', 'Art Museum', 4.9),
    (vatican_id, 'Vatican Museums', 'Vast collections of art, sculptures, and tapestries', 'Museum', 4.7),
    (vatican_id, 'St. Peter''s Square', 'Famous piazza designed by Bernini', 'Landmark', 4.6);

    -- Insert tips
    INSERT INTO public.destination_tips (destination_id, category, title, content) VALUES
    (vatican_id, 'Dress Code', 'Modest Attire Required', 'Wear modest attire covering shoulders and knees. Security will deny entry otherwise.'),
    (vatican_id, 'Planning', 'Book in Advance', 'Arrive early. Book skip-the-line museum tickets online.'),
    (vatican_id, 'Security', 'Screening Process', 'Airport-style screening. Avoid sharp items and large bags.'),
    (vatican_id, 'Photography', 'Photo Guidelines', 'Allowed in most areas except Sistine Chapel. No flash.'),
    (vatican_id, 'Etiquette', 'Respectful Behavior', 'Respect the religious setting. Keep voices low and phones silent.');

    -- Insert weather data
    INSERT INTO public.destination_weather (destination_id, month, temperature, aqi, notes) VALUES
    (vatican_id, 'Jan', '3–12°C', 41, 'Cool and damp, light rain.'),
    (vatican_id, 'Feb', '5–13°C', 43, 'Mild with occasional rain.'),
    (vatican_id, 'Mar', '8–16°C', 44, 'Early spring, breezy and dry.'),
    (vatican_id, 'Apr', '10–19°C', 39, 'Ideal sightseeing, spring bloom.'),
    (vatican_id, 'May', '14–24°C', 33, 'Sunny and dry.'),
    (vatican_id, 'Jun', '18–27°C', 30, 'Warm and dry.'),
    (vatican_id, 'Jul', '20–32°C', 50, 'Hot, moderate AQI due to heat.'),
    (vatican_id, 'Aug', '21–35°C', 60, 'Very hot, occasional poor AQI.'),
    (vatican_id, 'Sep', '18–27°C', 35, 'Warm easing to mild.'),
    (vatican_id, 'Oct', '14–21°C', 28, 'Mild autumn, light showers.'),
    (vatican_id, 'Nov', '10–16°C', 33, 'Cooler with some rain.'),
    (vatican_id, 'Dec', '6–12°C', 40, 'Chilly and overcast.');

    -- Insert transport options
    INSERT INTO public.destination_transport (destination_id, mode, details) VALUES
    (vatican_id, 'By Air', 'Fly into Rome''s airports (Leonardo da Vinci–Fiumicino or Ciampino). Vatican City is ~30 km from the airport.'),
    (vatican_id, 'By Train/Metro', 'Take Rome''s Metro Line A to Ottaviano-S. Pietro station. Local trains stop at Stazione S. Pietro.'),
    (vatican_id, 'By Bus/On Foot', 'City buses (#40, #64) stop nearby. Walkable from central Rome neighborhoods (20–30 mins).');

    -- Insert visit info
    INSERT INTO public.destination_visit_info (destination_id, best_time, notes) VALUES
    (vatican_id, 'April through June and September through October', 'Comfortable temperatures (15–25°C) with fewer crowds than summer. Arrive early on weekdays to avoid lines. Winter is low season except Christmas/Easter.');

    -- Insert photos
    INSERT INTO public.destination_photos (destination_id, url, caption) VALUES
    (vatican_id, '/images/vatican1.jpg', 'St. Peter''s Basilica at sunrise.'),
    (vatican_id, '/images/vatican2.jpg', 'Sistine Chapel frescoes.'),
    (vatican_id, '/images/vatican3.jpg', 'View from Vatican Gardens.');
END $$;