-- Create cached_images table for storing image search results
CREATE TABLE IF NOT EXISTS public.cached_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  search_query TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general',
  image_id TEXT UNIQUE NOT NULL,
  image_url TEXT NOT NULL,
  thumbnail_url TEXT NOT NULL,
  alt_text TEXT,
  original_source TEXT NOT NULL,
  width INTEGER,
  height INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_cached_images_query ON public.cached_images(search_query);
CREATE INDEX IF NOT EXISTS idx_cached_images_category ON public.cached_images(category);
CREATE INDEX IF NOT EXISTS idx_cached_images_created_at ON public.cached_images(created_at);
CREATE INDEX IF NOT EXISTS idx_cached_images_source ON public.cached_images(original_source);

-- Enable RLS
ALTER TABLE public.cached_images ENABLE ROW LEVEL SECURITY;

-- Create policies for cached images
CREATE POLICY "Cached images are publicly readable" 
ON public.cached_images 
FOR SELECT 
USING (true);

CREATE POLICY "Service role can manage cached images" 
ON public.cached_images 
FOR ALL 
USING (true);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_cached_images_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_cached_images_updated_at
  BEFORE UPDATE ON public.cached_images
  FOR EACH ROW
  EXECUTE FUNCTION update_cached_images_updated_at();

-- Create function to clean old cached images (older than 30 days)
CREATE OR REPLACE FUNCTION clean_old_cached_images()
RETURNS void AS $$
BEGIN
  DELETE FROM public.cached_images 
  WHERE created_at < now() - interval '30 days';
END;
$$ LANGUAGE plpgsql;
