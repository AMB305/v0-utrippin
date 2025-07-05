/*
  # Travel Buddy Notifications System

  1. New Tables
    - `travel_buddy_notifications`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to profiles)
      - `sender_id` (uuid, foreign key to profiles)
      - `type` (text, check constraint for valid types)
      - `content` (text, notification message)
      - `is_read` (boolean, default false)
      - `match_id` (uuid, foreign key to travel_matches)
      - `created_at` (timestamp with time zone)

  2. Security
    - Enable RLS on `travel_buddy_notifications` table
    - Add policies for users to view and update their own notifications

  3. Functions
    - `create_match_notifications()` - Trigger function for new matches
    - `mark_notifications_as_read()` - Mark notifications as read
    - `get_unread_notification_count()` - Get count of unread notifications
    - `get_recent_notifications()` - Get recent notifications with sender info

  4. Triggers
    - Auto-create notifications when travel matches are created
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

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own notifications" ON travel_buddy_notifications;
DROP POLICY IF EXISTS "Users can update their own notifications" ON travel_buddy_notifications;

-- Create security policies
CREATE POLICY "Users can view their own notifications" 
ON travel_buddy_notifications FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" 
ON travel_buddy_notifications FOR UPDATE 
USING (auth.uid() = user_id);

-- Drop existing trigger and function if they exist
DROP TRIGGER IF EXISTS create_notifications_on_match ON travel_matches;
DROP FUNCTION IF EXISTS create_match_notifications();

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

-- Create trigger
CREATE TRIGGER create_notifications_on_match
AFTER INSERT ON travel_matches
FOR EACH ROW
EXECUTE FUNCTION create_match_notifications();

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