-- Create cached_itineraries table for Keila Bot (if it doesn't exist)
CREATE TABLE IF NOT EXISTS public.cached_itineraries (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  prompt text NOT NULL UNIQUE,
  response text NOT NULL,
  timestamp timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT cached_itineraries_pkey PRIMARY KEY (id)
);

-- Enable RLS on cached_itineraries table
ALTER TABLE public.cached_itineraries ENABLE ROW LEVEL SECURITY;

-- Add missing columns to messages table if they don't exist
DO $$ 
BEGIN
  -- Add user_id column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'messages' AND column_name = 'user_id') THEN
    ALTER TABLE public.messages ADD COLUMN user_id text NOT NULL DEFAULT '';
  END IF;
  
  -- Add sender column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'messages' AND column_name = 'sender') THEN
    ALTER TABLE public.messages ADD COLUMN sender text NOT NULL DEFAULT '';
  END IF;
END $$;

-- RLS Policies for messages table
DROP POLICY IF EXISTS "Allow users to read messages" ON public.messages;
CREATE POLICY "Allow users to read messages" 
ON public.messages 
FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Allow users to insert messages" ON public.messages;
CREATE POLICY "Allow users to insert messages" 
ON public.messages 
FOR INSERT 
WITH CHECK (true);

-- RLS Policies for cached_itineraries table
DROP POLICY IF EXISTS "Allow public read access to cached itineraries" ON public.cached_itineraries;
CREATE POLICY "Allow public read access to cached itineraries" 
ON public.cached_itineraries 
FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Allow inserts to cached itineraries" ON public.cached_itineraries;
CREATE POLICY "Allow inserts to cached itineraries" 
ON public.cached_itineraries 
FOR INSERT 
WITH CHECK (true);
