-- Create stories table for RSS ingestion
CREATE TABLE public.stories (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  link TEXT UNIQUE NOT NULL,
  image TEXT,
  excerpt TEXT,
  source TEXT,
  published_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Stories are publicly readable" 
ON public.stories 
FOR SELECT 
USING (true);

-- Create policy for service role to manage stories
CREATE POLICY "Service role can manage stories" 
ON public.stories 
FOR ALL 
USING (true);

-- Create index for performance
CREATE INDEX idx_stories_published_at ON public.stories(published_at DESC);