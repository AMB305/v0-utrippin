-- Add budget column to ai_trips table
ALTER TABLE public.ai_trips ADD COLUMN budget NUMERIC;

-- Add default budget values for existing trips
UPDATE public.ai_trips SET budget = 2000 WHERE budget IS NULL;

-- Make budget not null with default
ALTER TABLE public.ai_trips ALTER COLUMN budget SET DEFAULT 2000;
ALTER TABLE public.ai_trips ALTER COLUMN budget SET NOT NULL;