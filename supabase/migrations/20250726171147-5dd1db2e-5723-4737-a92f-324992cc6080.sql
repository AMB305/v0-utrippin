-- Insert a test user for demo purposes
-- Note: This creates a user in the auth schema for testing
INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    confirmation_sent_at,
    confirmation_token,
    recovery_sent_at,
    recovery_token,
    email_change_token_new,
    email_change,
    email_change_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    created_at,
    updated_at,
    phone,
    phone_confirmed_at,
    phone_change,
    phone_change_token,
    phone_change_sent_at,
    email_change_token_current,
    email_change_confirm_status,
    banned_until,
    reauthentication_token,
    reauthentication_sent_at,
    is_sso_user,
    deleted_at
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    'authenticated',
    'authenticated',
    'demo@example.com',
    '$2a$10$LZ.gsQTx/Z8Qk4wYfQX8muqKk.jcE.6KJ./L.1y.Q2y8B1Z8pL2hS', -- password: 'demo123'
    NOW(),
    NOW(),
    '',
    NOW(),
    '',
    '',
    '',
    NOW(),
    NOW(),
    '{"provider": "email", "providers": ["email"]}',
    '{"name": "Demo User"}',
    FALSE,
    NOW(),
    NOW(),
    NULL,
    NULL,
    '',
    '',
    NOW(),
    '',
    0,
    NULL,
    '',
    NOW(),
    FALSE,
    NULL
)
ON CONFLICT (id) DO NOTHING;

-- Also create a profile entry if the table exists
INSERT INTO public.profiles (id, username, display_name)
VALUES (
    'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    'demouser',
    'Demo User'
)
ON CONFLICT (id) DO NOTHING;