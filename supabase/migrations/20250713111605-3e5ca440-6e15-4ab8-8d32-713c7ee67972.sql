-- Add enhanced URL columns to ai_trips table
ALTER TABLE public.ai_trips 
ADD COLUMN enhanced_flights_url text,
ADD COLUMN enhanced_hotels_url text;