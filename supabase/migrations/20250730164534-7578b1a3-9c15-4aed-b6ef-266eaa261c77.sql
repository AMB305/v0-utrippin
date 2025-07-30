-- Create messages table for Keila Bot
CREATE TABLE public.messages (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  user_id text NOT NULL,
  sender text NOT NULL,
  text text NOT NULL,
  timestamp timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT messages_pkey PRIMARY KEY (id)
);

-- Enable RLS on messages table
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Create cached_itineraries table for Keila Bot
CREATE TABLE public.cached_itineraries (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  prompt text NOT NULL UNIQUE,
  response text NOT NULL,
  timestamp timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT cached_itineraries_pkey PRIMARY KEY (id)
);

-- Enable RLS on cached_itineraries table
ALTER TABLE public.cached_itineraries ENABLE ROW LEVEL SECURITY;

-- RLS Policies for messages table
CREATE POLICY "Allow users to read messages" 
ON public.messages 
FOR SELECT 
USING (true);

CREATE POLICY "Allow users to insert messages" 
ON public.messages 
FOR INSERT 
WITH CHECK (true);

-- RLS Policies for cached_itineraries table
CREATE POLICY "Allow public read access to cached itineraries" 
ON public.cached_itineraries 
FOR SELECT 
USING (true);

CREATE POLICY "Allow inserts to cached itineraries" 
ON public.cached_itineraries 
FOR INSERT 
WITH CHECK (true);