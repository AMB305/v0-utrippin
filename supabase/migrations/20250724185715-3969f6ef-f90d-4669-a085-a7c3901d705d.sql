-- Update travel_chat RLS policies to use authenticated users instead of mock users
DROP POLICY IF EXISTS "Allow mock users to view messages" ON public.travel_chat;
DROP POLICY IF EXISTS "Allow mock users to insert messages" ON public.travel_chat;
DROP POLICY IF EXISTS "Allow mock users to update messages" ON public.travel_chat;
DROP POLICY IF EXISTS "Allow mock users to delete messages" ON public.travel_chat;

-- Create new policies for authenticated users only
CREATE POLICY "Authenticated users can view their own messages" 
ON public.travel_chat 
FOR SELECT 
USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Authenticated users can send messages" 
ON public.travel_chat 
FOR INSERT 
WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Authenticated users can update their own messages" 
ON public.travel_chat 
FOR UPDATE 
USING (auth.uid() = sender_id);

CREATE POLICY "Authenticated users can delete their own messages" 
ON public.travel_chat 
FOR DELETE 
USING (auth.uid() = sender_id);
