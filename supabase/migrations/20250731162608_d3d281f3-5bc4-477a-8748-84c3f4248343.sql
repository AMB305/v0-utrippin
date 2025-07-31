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