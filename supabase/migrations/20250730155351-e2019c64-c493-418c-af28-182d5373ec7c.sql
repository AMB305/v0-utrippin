-- Create a test user for Keila bot testing
-- This will create a user that can be used for testing authentication

-- Insert test user directly into auth.users table
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  role
) VALUES (
  '00000000-0000-0000-0000-000000000001'::uuid,
  'test@keilabot.com',
  crypt('Test123!', gen_salt('bf')), -- Password: Test123!
  now(),
  now(),
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{}',
  false,
  'authenticated'
)
ON CONFLICT (email) DO NOTHING;