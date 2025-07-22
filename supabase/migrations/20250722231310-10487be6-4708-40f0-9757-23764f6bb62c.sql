-- Add sharing columns to saved_trips table
ALTER TABLE public.saved_trips 
ADD COLUMN IF NOT EXISTS share_id UUID DEFAULT gen_random_uuid() UNIQUE,
ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT false;

-- Create index for faster public trip lookups
CREATE INDEX IF NOT EXISTS idx_saved_trips_share_id ON public.saved_trips(share_id) WHERE is_public = true;

-- Create policy for public trip access
CREATE POLICY "Public trips are viewable by anyone" 
ON public.saved_trips 
FOR SELECT 
USING (is_public = true);