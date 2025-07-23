-- Create table to track agent interactions and responses
CREATE TABLE IF NOT EXISTS public.agent_interactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  trip_id UUID NOT NULL REFERENCES public.saved_trips(id) ON DELETE CASCADE,
  agent_email TEXT NOT NULL,
  interaction_type TEXT NOT NULL, -- 'email_sent', 'link_clicked', 'response_received'
  interaction_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  user_agent TEXT,
  ip_address INET
);

-- Enable RLS
ALTER TABLE public.agent_interactions ENABLE ROW LEVEL SECURITY;

-- Create policies for agent interactions
CREATE POLICY "Users can view interactions for their trips" 
ON public.agent_interactions 
FOR SELECT 
USING (trip_id IN (
  SELECT id FROM public.saved_trips WHERE user_id = auth.uid()
));

CREATE POLICY "Service role can manage all interactions" 
ON public.agent_interactions 
FOR ALL 
USING (true);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_agent_interactions_trip_id ON public.agent_interactions(trip_id);
CREATE INDEX IF NOT EXISTS idx_agent_interactions_agent_email ON public.agent_interactions(agent_email);

-- Add columns to saved_trips for multiple agent support
ALTER TABLE public.saved_trips 
ADD COLUMN IF NOT EXISTS agent_emails TEXT[], -- Array of agent emails
ADD COLUMN IF NOT EXISTS follow_up_sent_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS agent_template_type TEXT DEFAULT 'standard';

-- Create table for follow-up automation
CREATE TABLE IF NOT EXISTS public.agent_follow_ups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  trip_id UUID NOT NULL REFERENCES public.saved_trips(id) ON DELETE CASCADE,
  agent_email TEXT NOT NULL,
  follow_up_type TEXT NOT NULL, -- 'reminder', 'final_notice'
  scheduled_for TIMESTAMP WITH TIME ZONE NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for follow-ups
ALTER TABLE public.agent_follow_ups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view follow-ups for their trips" 
ON public.agent_follow_ups 
FOR SELECT 
USING (trip_id IN (
  SELECT id FROM public.saved_trips WHERE user_id = auth.uid()
));

CREATE POLICY "Service role can manage all follow-ups" 
ON public.agent_follow_ups 
FOR ALL 
USING (true);