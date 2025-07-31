-- Create travel_guides table for caching generated itineraries
CREATE TABLE public.travel_guides (
  id text PRIMARY KEY,
  markdown text NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.travel_guides ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (since these are general travel guides)
CREATE POLICY "Travel guides are publicly readable" 
ON public.travel_guides 
FOR SELECT 
USING (true);

-- Service role can manage all travel guides
CREATE POLICY "Service role can manage travel guides" 
ON public.travel_guides 
FOR ALL 
USING (true);