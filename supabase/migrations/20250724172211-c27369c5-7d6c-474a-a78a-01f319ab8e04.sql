-- Update RLS policy to allow inserts for the current setup
-- This allows inserts when either the user is authenticated OR when using the demo user IDs
DROP POLICY IF EXISTS "Users can send messages" ON travel_chat;

CREATE POLICY "Users can send messages" 
ON travel_chat 
FOR INSERT 
WITH CHECK (
  -- Allow if authenticated user matches sender_id
  (auth.uid() = sender_id) OR 
  -- Allow demo/system users (temporary until auth is implemented)
  (sender_id IN (
    '00000000-0000-0000-0000-000000000001'::uuid,
    '00000000-0000-0000-0000-000000000002'::uuid
  ))
);