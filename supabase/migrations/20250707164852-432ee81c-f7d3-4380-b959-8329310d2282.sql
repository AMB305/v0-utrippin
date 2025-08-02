-- Drop the existing travel_style check constraint first
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_travel_style_check;

-- Update existing data to match new travel style values
UPDATE users SET travel_style = 'Backpacking' WHERE travel_style = 'backpacker';
UPDATE users SET travel_style = 'Luxury' WHERE travel_style = 'luxury';
UPDATE users SET travel_style = 'Adventure' WHERE travel_style = 'mid-range';
UPDATE users SET travel_style = 'Cultural' WHERE travel_style = 'budget';

-- Add new check constraint that allows the travel styles used in the frontend
ALTER TABLE users ADD CONSTRAINT users_travel_style_check 
CHECK (travel_style IN ('Adventure', 'Cultural', 'Relaxation', 'Food & Drink', 'Nightlife', 'Nature', 'Photography', 'Business', 'Backpacking', 'Luxury'));
