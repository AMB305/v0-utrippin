-- Create destinations table with rich content
CREATE TABLE public.destinations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  country TEXT NOT NULL,
  region TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  description TEXT,
  overview TEXT,
  history TEXT,
  culture_overview TEXT,
  best_time_to_visit TEXT,
  average_cost_per_day INTEGER,
  currency TEXT DEFAULT 'USD',
  hero_image_url TEXT,
  featured BOOLEAN DEFAULT false,
  meta_title TEXT,
  meta_description TEXT,
  keywords TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create destination activities table
CREATE TABLE public.destination_activities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  destination_id UUID NOT NULL REFERENCES public.destinations(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL, -- adventure, culture, food, nightlife, nature, shopping, etc.
  duration TEXT, -- "2-3 hours", "Half day", "Full day"
  cost_range TEXT, -- "Free", "$", "$$", "$$$"
  image_url TEXT,
  location TEXT,
  tips TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create destination attractions table
CREATE TABLE public.destination_attractions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  destination_id UUID NOT NULL REFERENCES public.destinations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  type TEXT, -- museum, landmark, beach, park, etc.
  address TEXT,
  website_url TEXT,
  image_url TEXT,
  rating DECIMAL(2,1), -- 4.5 out of 5
  price_range TEXT,
  opening_hours TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create destination tips table
CREATE TABLE public.destination_tips (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  destination_id UUID NOT NULL REFERENCES public.destinations(id) ON DELETE CASCADE,
  category TEXT NOT NULL, -- transport, food, culture, safety, money, etc.
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create destination images table
CREATE TABLE public.destination_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  destination_id UUID NOT NULL REFERENCES public.destinations(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  caption TEXT,
  alt_text TEXT,
  category TEXT, -- hero, gallery, activity, attraction
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.destination_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.destination_attractions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.destination_tips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.destination_images ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (destinations are public content)
CREATE POLICY "Destinations are publicly readable" 
ON public.destinations FOR SELECT 
USING (true);

CREATE POLICY "Destination activities are publicly readable" 
ON public.destination_activities FOR SELECT 
USING (true);

CREATE POLICY "Destination attractions are publicly readable" 
ON public.destination_attractions FOR SELECT 
USING (true);

CREATE POLICY "Destination tips are publicly readable" 
ON public.destination_tips FOR SELECT 
USING (true);

CREATE POLICY "Destination images are publicly readable" 
ON public.destination_images FOR SELECT 
USING (true);

-- Admin policies (for content management - service role only)
CREATE POLICY "Service role can manage destinations" 
ON public.destinations FOR ALL 
USING (true);

CREATE POLICY "Service role can manage destination activities" 
ON public.destination_activities FOR ALL 
USING (true);

CREATE POLICY "Service role can manage destination attractions" 
ON public.destination_attractions FOR ALL 
USING (true);

CREATE POLICY "Service role can manage destination tips" 
ON public.destination_tips FOR ALL 
USING (true);

CREATE POLICY "Service role can manage destination images" 
ON public.destination_images FOR ALL 
USING (true);

-- Create indexes for performance
CREATE INDEX idx_destinations_slug ON public.destinations(slug);
CREATE INDEX idx_destinations_country ON public.destinations(country);
CREATE INDEX idx_destinations_featured ON public.destinations(featured);
CREATE INDEX idx_destination_activities_destination_id ON public.destination_activities(destination_id);
CREATE INDEX idx_destination_activities_category ON public.destination_activities(category);
CREATE INDEX idx_destination_attractions_destination_id ON public.destination_attractions(destination_id);
CREATE INDEX idx_destination_tips_destination_id ON public.destination_tips(destination_id);
CREATE INDEX idx_destination_images_destination_id ON public.destination_images(destination_id);

-- Create trigger for updating timestamps
CREATE TRIGGER update_destinations_updated_at
BEFORE UPDATE ON public.destinations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample data for the current recommended destinations
INSERT INTO public.destinations (name, slug, country, region, description, overview, featured, hero_image_url) VALUES
('Saint Croix', 'saint-croix-virgin-islands', 'United States Virgin Islands', 'Caribbean', 'Discover the largest of the U.S. Virgin Islands, where pristine beaches meet rich Danish colonial history.', 'Saint Croix offers the perfect blend of relaxation and adventure with its stunning beaches, historic Christiansted, world-class diving, and vibrant local culture.', true, '/src/assets/beaches-islands.jpg'),
('Las Vegas', 'las-vegas-nevada', 'United States', 'Nevada', 'The entertainment capital of the world, where spectacular shows, world-class dining, and endless excitement await.', 'Las Vegas is a dazzling desert oasis of entertainment, featuring iconic casinos, breathtaking shows, gourmet restaurants, and experiences you won''t find anywhere else.', true, '/src/assets/arts-culture.jpg'),
('Lake Placid', 'lake-placid-new-york', 'United States', 'New York', 'A pristine Adirondack mountain town famous for its Olympic heritage and year-round outdoor adventures.', 'Nestled in the heart of the Adirondacks, Lake Placid offers world-class skiing, hiking, and the charm of a historic Olympic village surrounded by stunning natural beauty.', true, '/src/assets/adventure.jpg'),
('Orlando', 'orlando-florida', 'United States', 'Florida', 'The theme park capital of the world, where magical experiences and family fun create memories that last a lifetime.', 'Orlando is synonymous with magic and wonder, home to world-famous theme parks, family-friendly attractions, and experiences that delight visitors of all ages.', true, '/src/assets/family-friendly.jpg'),
('San Juan', 'san-juan-puerto-rico', 'Puerto Rico', 'Caribbean', 'A vibrant Caribbean capital where Spanish colonial charm meets modern sophistication and tropical beauty.', 'San Juan enchants with its cobblestone streets, historic forts, colorful buildings, pristine beaches, and rich cultural heritage spanning over 500 years.', true, '/src/assets/romantic.jpg'),
('Fort Lauderdale', 'fort-lauderdale-florida', 'United States', 'Florida', 'The "Venice of America" known for its beautiful beaches, boating canals, and vibrant nightlife scene.', 'Fort Lauderdale combines stunning beaches with sophisticated dining, world-class shopping, and a thriving arts scene, perfect for both relaxation and adventure.', true, '/src/assets/solo-travel.jpg');