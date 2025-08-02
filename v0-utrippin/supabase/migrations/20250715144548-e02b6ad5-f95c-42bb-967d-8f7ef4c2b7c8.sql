-- Remove the restrictive check constraint on travel_style
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_travel_style_check;

-- Add a more flexible check constraint that allows reasonable length strings
ALTER TABLE users ADD CONSTRAINT users_travel_style_check CHECK (
  travel_style IS NULL OR 
  (length(travel_style) >= 2 AND length(travel_style) <= 100)
);
