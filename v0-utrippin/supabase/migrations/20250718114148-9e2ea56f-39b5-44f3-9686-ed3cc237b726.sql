-- Create search_history table for authenticated users
CREATE TABLE public.search_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  search_type TEXT NOT NULL, -- 'hotels', 'flights', 'cars', 'packages', 'cruises'
  destination TEXT NOT NULL,
  check_in_date DATE,
  check_out_date DATE,
  pickup_date TIMESTAMP WITH TIME ZONE,
  dropoff_date TIMESTAMP WITH TIME ZONE,
  guests INTEGER,
  rooms INTEGER,
  travelers INTEGER,
  search_data JSONB, -- Store additional search parameters
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.search_history ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own search history" 
ON public.search_history 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own search history" 
ON public.search_history 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own search history" 
ON public.search_history 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own search history" 
ON public.search_history 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_search_history_updated_at
BEFORE UPDATE ON public.search_history
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster queries
CREATE INDEX idx_search_history_user_created ON public.search_history(user_id, created_at DESC);
CREATE INDEX idx_search_history_type ON public.search_history(search_type);
CREATE INDEX idx_search_history_destination ON public.search_history(destination);
