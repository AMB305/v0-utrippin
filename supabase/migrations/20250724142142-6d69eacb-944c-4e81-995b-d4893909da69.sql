-- Create travel_chat table for travel buddy messaging
CREATE TABLE public.travel_chat (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID NOT NULL,
  receiver_id UUID NOT NULL,
  message TEXT NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  pinned BOOLEAN DEFAULT false,
  reactions JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.travel_chat ENABLE ROW LEVEL SECURITY;

-- Create policies for chat access
CREATE POLICY "Users can view their own chats" 
ON public.travel_chat 
FOR SELECT 
USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can send messages" 
ON public.travel_chat 
FOR INSERT 
WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update their own messages" 
ON public.travel_chat 
FOR UPDATE 
USING (auth.uid() = sender_id);

-- Add indexes for performance
CREATE INDEX idx_travel_chat_sender_receiver ON public.travel_chat(sender_id, receiver_id);
CREATE INDEX idx_travel_chat_sent_at ON public.travel_chat(sent_at);

-- Enable realtime for travel_chat table
ALTER PUBLICATION supabase_realtime ADD TABLE public.travel_chat;