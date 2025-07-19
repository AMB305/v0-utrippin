-- First, let's check if we need to add any missing columns to ai_trips table
-- Add missing columns if they don't exist
DO $$ 
BEGIN
    -- Add description column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'ai_trips' AND column_name = 'description') THEN
        ALTER TABLE public.ai_trips ADD COLUMN description TEXT;
    END IF;
    
    -- Add approximate_budget column if it doesn't exist (we already have budget)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'ai_trips' AND column_name = 'approximate_budget') THEN
        ALTER TABLE public.ai_trips ADD COLUMN approximate_budget NUMERIC;
    END IF;
    
    -- Add ai_summary column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'ai_trips' AND column_name = 'ai_summary') THEN
        ALTER TABLE public.ai_trips ADD COLUMN ai_summary TEXT;
    END IF;
    
    -- Add event_dates column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'ai_trips' AND column_name = 'event_dates') THEN
        ALTER TABLE public.ai_trips ADD COLUMN event_dates TEXT;
    END IF;
    
    -- Add camref_links column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'ai_trips' AND column_name = 'camref_links') THEN
        ALTER TABLE public.ai_trips ADD COLUMN camref_links TEXT;
    END IF;
    
    -- Add destination column if it doesn't exist (we might have 'name' instead)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'ai_trips' AND column_name = 'destination') THEN
        ALTER TABLE public.ai_trips ADD COLUMN destination TEXT;
    END IF;
END $$;

-- Create user roles system for admin access
CREATE TYPE IF NOT EXISTS public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Create user_roles table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create function to check user roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS policies for user_roles
CREATE POLICY IF NOT EXISTS "Users can view their own roles"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

-- Admin can manage trips
CREATE POLICY IF NOT EXISTS "Admins can manage ai_trips"
ON public.ai_trips
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Allow authenticated users to insert trips (we'll add admin check in the app)
CREATE POLICY IF NOT EXISTS "Authenticated users can insert trips"
ON public.ai_trips
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);