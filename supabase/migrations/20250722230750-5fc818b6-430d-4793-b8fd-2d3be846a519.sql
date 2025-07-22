-- Create the saved_trips table to store user trip boards
CREATE TABLE IF NOT EXISTS public.saved_trips (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  trip_name TEXT NOT NULL,
  destination TEXT,
  trip_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_favorite BOOLEAN DEFAULT false,
  image_url TEXT,
  summary TEXT
);

-- Enable RLS
ALTER TABLE public.saved_trips ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own saved trips" 
ON public.saved_trips 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own saved trips" 
ON public.saved_trips 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own saved trips" 
ON public.saved_trips 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own saved trips" 
ON public.saved_trips 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_saved_trips_updated_at
BEFORE UPDATE ON public.saved_trips
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();