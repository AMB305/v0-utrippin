-- Add columns to track agent sharing functionality
ALTER TABLE public.saved_trips 
ADD COLUMN IF NOT EXISTS shared_with_agent_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS agent_email TEXT,
ADD COLUMN IF NOT EXISTS agent_message TEXT;

-- Create index for faster agent sharing queries
CREATE INDEX IF NOT EXISTS idx_saved_trips_shared_with_agent ON public.saved_trips(shared_with_agent_at) WHERE shared_with_agent_at IS NOT NULL;
