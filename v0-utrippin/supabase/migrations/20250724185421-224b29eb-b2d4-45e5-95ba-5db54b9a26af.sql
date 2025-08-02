-- Fix RLS policies for travel_chat table to allow mock users to chat

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own messages" ON public.travel_chat;
DROP POLICY IF EXISTS "Users can insert their own messages" ON public.travel_chat;
DROP POLICY IF EXISTS "Users can update their own messages" ON public.travel_chat;
DROP POLICY IF EXISTS "Users can delete their own messages" ON public.travel_chat;

-- Create new policies that allow mock users to chat
CREATE POLICY "Allow mock users to view messages" 
ON public.travel_chat 
FOR SELECT 
USING (
  -- Allow viewing messages if user is sender or receiver
  sender_id IN ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002') 
  OR receiver_id IN ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002')
  -- Or if authenticated user is sender or receiver  
  OR auth.uid() = sender_id 
  OR auth.uid() = receiver_id
);

CREATE POLICY "Allow mock users to insert messages" 
ON public.travel_chat 
FOR INSERT 
WITH CHECK (
  -- Allow mock users to send messages
  sender_id IN ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002')
  -- Or if authenticated user is the sender
  OR auth.uid() = sender_id
);

CREATE POLICY "Allow mock users to update messages" 
ON public.travel_chat 
FOR UPDATE 
USING (
  -- Allow mock users to update their own messages
  sender_id IN ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002')
  -- Or if authenticated user is the sender
  OR auth.uid() = sender_id
);

CREATE POLICY "Allow mock users to delete messages" 
ON public.travel_chat 
FOR DELETE 
USING (
  -- Allow mock users to delete their own messages
  sender_id IN ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002')
  -- Or if authenticated user is the sender
  OR auth.uid() = sender_id
);
