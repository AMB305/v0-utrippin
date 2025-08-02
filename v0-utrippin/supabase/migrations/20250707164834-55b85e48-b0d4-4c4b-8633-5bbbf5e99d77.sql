-- Drop the existing travel_style check constraint
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_travel_style_check;

-- Add new check constraint that allows the travel styles used in the frontend
ALTER TABLE users ADD CONSTRAINT users_travel_style_check 
CHECK (travel_style IN ('Adventure', 'Cultural', 'Relaxation', 'Food & Drink', 'Nightlife', 'Nature', 'Photography', 'Business', 'Backpacking', 'Luxury'));
