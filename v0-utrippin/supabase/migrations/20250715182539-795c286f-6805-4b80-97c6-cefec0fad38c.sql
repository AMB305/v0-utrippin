-- Clean up existing empty usernames and add constraints to prevent future issues

-- Update any existing profiles with empty usernames to have a default username
UPDATE profiles 
SET username = 'User' || SUBSTRING(id::text, 1, 8)
WHERE username = '' OR username IS NULL;

-- Add a check constraint to prevent empty usernames in the future
ALTER TABLE profiles 
ADD CONSTRAINT profiles_username_not_empty 
CHECK (username IS NOT NULL AND LENGTH(TRIM(username)) > 0);
