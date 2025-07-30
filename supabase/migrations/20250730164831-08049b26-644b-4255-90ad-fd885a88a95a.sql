-- Drop the existing messages table that has the wrong schema for Keila Bot
DROP TABLE IF EXISTS public.messages CASCADE;

-- Create the correct messages table for Keila Bot
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

-- RLS Policies for messages table
CREATE POLICY "Allow users to read messages" 
ON public.messages 
FOR SELECT 
USING (true);

CREATE POLICY "Allow users to insert messages" 
ON public.messages 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow users to update messages" 
ON public.messages 
FOR UPDATE 
USING (true);

CREATE POLICY "Allow users to delete messages" 
ON public.messages 
FOR DELETE 
USING (true);