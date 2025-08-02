-- Add missing columns to ai_trips table
ALTER TABLE public.ai_trips 
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS approximate_budget NUMERIC,
ADD COLUMN IF NOT EXISTS ai_summary TEXT,
ADD COLUMN IF NOT EXISTS event_dates TEXT,
ADD COLUMN IF NOT EXISTS camref_links TEXT,
ADD COLUMN IF NOT EXISTS destination TEXT;

-- RLS policies for user_roles
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

-- Admin policies for ai_trips
DROP POLICY IF EXISTS "Admins can manage ai_trips" ON public.ai_trips;
CREATE POLICY "Admins can manage ai_trips"
ON public.ai_trips
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Authenticated users can insert trips" ON public.ai_trips;
CREATE POLICY "Authenticated users can insert trips"
ON public.ai_trips
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);
