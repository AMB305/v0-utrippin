/*
  # Fix travel buddy notifications table and policies

  1. New Tables
    - No new tables created, fixes existing `travel_buddy_notifications` table

  2. Security
    - Adds proper policy existence checks before creating policies
    - Enables RLS on the notifications table
    - Creates policies for users to view and update their own notifications

  3. Functions
    - Creates or replaces functions for notification management
    - Adds trigger for automatic notification creation on matches
*/

-- Create notifications table if it doesn't exist
CREATE TABLE IF NOT EXISTS travel_buddy_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  sender_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('match', 'message', 'buddy_request')),
  content text,
  is_read boolean DEFAULT false,
  match_id uuid REFERENCES travel_matches(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON travel_buddy_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON travel_buddy_notifications(user_id, is_read) WHERE (is_read = false);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON travel_buddy_notifications(created_at);

-- Enable Row Level Security
ALTER TABLE travel_buddy_notifications ENABLE ROW LEVEL SECURITY;

-- Create security policies with existence checks
DO $$
BEGIN
  -- Check if the view policy exists before creating it
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'travel_buddy_notifications' 
    AND policyname = 'Users can view their own notifications'
  ) THEN
    CREATE POLICY "Users can view their own notifications" 
    ON travel_buddy_notifications FOR SELECT 
    USING (auth.uid() = user_id);
  END IF;

  -- Check if the update policy exists before creating it
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'travel_buddy_notifications' 
    AND policyname = 'Users can update their own notifications'
  ) THEN
    CREATE POLICY "Users can update their own notifications" 
    ON travel_buddy_notifications FOR UPDATE 
    USING (auth.uid() = user_id);
  END IF;
END $$;

-- Handle existing trigger and function dependencies properly
DO $$
BEGIN
  -- Drop trigger first if it exists
  IF EXISTS (
    SELECT 1 FROM information_schema.triggers 
    WHERE trigger_name = 'create_notifications_on_match' 
    AND event_object_table = 'travel_matches'
  ) THEN
    DROP TRIGGER IF EXISTS create_notifications_on_match ON travel_matches;
  END IF;
  
  -- Now drop function if it exists
  IF EXISTS (
    SELECT 1 FROM pg_proc p
    JOIN pg_namespace n ON p.pronamespace = n.oid
    WHERE n.nspname = 'public'
    AND p.proname = 'create_match_notifications'
  ) THEN
    DROP FUNCTION IF EXISTS create_match_notifications();
  END IF;
END $$;

-- Function to create match notifications
CREATE OR REPLACE FUNCTION create_match_notifications()
RETURNS TRIGGER AS $$
BEGIN
  -- Create notification for user1
  INSERT INTO travel_buddy_notifications (user_id, sender_id, type, content, match_id)
  VALUES (
    NEW.user1_id, 
    NEW.user2_id, 
    'match', 
    'You have a new travel buddy match!',
    NEW.id
  );
  
  -- Create notification for user2
  INSERT INTO travel_buddy_notifications (user_id, sender_id, type, content, match_id)
  VALUES (
    NEW.user2_id, 
    NEW.user1_id, 
    'match', 
    'You have a new travel buddy match!',
    NEW.id
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically create notifications on new matches
CREATE TRIGGER create_notifications_on_match
AFTER INSERT ON travel_matches
FOR EACH ROW
EXECUTE FUNCTION create_match_notifications();

-- Drop existing functions if they exist to avoid conflicts
DO $$
BEGIN
  -- Drop mark_notifications_as_read if it exists
  IF EXISTS (
    SELECT 1 FROM pg_proc p
    JOIN pg_namespace n ON p.pronamespace = n.oid
    WHERE n.nspname = 'public'
    AND p.proname = 'mark_notifications_as_read'
  ) THEN
    DROP FUNCTION IF EXISTS mark_notifications_as_read(uuid[]);
  END IF;

  -- Drop get_unread_notification_count if it exists
  IF EXISTS (
    SELECT 1 FROM pg_proc p
    JOIN pg_namespace n ON p.pronamespace = n.oid
    WHERE n.nspname = 'public'
    AND p.proname = 'get_unread_notification_count'
  ) THEN
    DROP FUNCTION IF EXISTS get_unread_notification_count(uuid);
  END IF;

  -- Drop get_recent_notifications if it exists
  IF EXISTS (
    SELECT 1 FROM pg_proc p
    JOIN pg_namespace n ON p.pronamespace = n.oid
    WHERE n.nspname = 'public'
    AND p.proname = 'get_recent_notifications'
  ) THEN
    DROP FUNCTION IF EXISTS get_recent_notifications(uuid, integer);
  END IF;
END $$;

-- Function to mark notifications as read
CREATE OR REPLACE FUNCTION mark_notifications_as_read(notification_ids uuid[])
RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  UPDATE travel_buddy_notifications
  SET is_read = true
  WHERE id = ANY(notification_ids)
    AND user_id = auth.uid();
END;
$$;

-- Function to get unread notification count
CREATE OR REPLACE FUNCTION get_unread_notification_count(user_id uuid)
RETURNS integer LANGUAGE sql SECURITY DEFINER AS $$
  SELECT COUNT(*)::integer
  FROM travel_buddy_notifications
  WHERE user_id = $1
    AND is_read = false;
$$;

-- Function to get recent notifications
CREATE OR REPLACE FUNCTION get_recent_notifications(user_id uuid, limit_count integer DEFAULT 10)
RETURNS TABLE(
  id uuid,
  sender_username text,
  sender_avatar text,
  notification_type text,
  content text,
  is_read boolean,
  match_id uuid,
  created_at timestamp with time zone
) LANGUAGE sql SECURITY DEFINER AS $$
  SELECT 
    n.id,
    p.username as sender_username,
    p.avatar_url as sender_avatar,
    n.type as notification_type,
    n.content,
    n.is_read,
    n.match_id,
    n.created_at
  FROM travel_buddy_notifications n
  LEFT JOIN profiles p ON n.sender_id = p.id
  WHERE n.user_id = $1
  ORDER BY n.created_at DESC
  LIMIT $2;
$$;