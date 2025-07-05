/*
  # Fix Notification Functions

  1. Function Fixes
    - Properly drop and recreate the `mark_notifications_as_read` function
    - Fix parameter type conflicts
    - Ensure proper error handling
  
  2. Security
    - Maintain all security policies
    - Preserve SECURITY DEFINER settings
*/

-- First, properly drop existing functions with explicit parameter types
DO $$
BEGIN
  -- Drop mark_notifications_as_read if it exists with uuid[] parameter
  IF EXISTS (
    SELECT 1 FROM pg_proc p
    JOIN pg_namespace n ON p.pronamespace = n.oid
    WHERE n.nspname = 'public'
    AND p.proname = 'mark_notifications_as_read'
  ) THEN
    DROP FUNCTION IF EXISTS mark_notifications_as_read(uuid[]);
  END IF;

  -- Drop get_unread_notification_count if it exists with uuid parameter
  IF EXISTS (
    SELECT 1 FROM pg_proc p
    JOIN pg_namespace n ON p.pronamespace = n.oid
    WHERE n.nspname = 'public'
    AND p.proname = 'get_unread_notification_count'
  ) THEN
    DROP FUNCTION IF EXISTS get_unread_notification_count(uuid);
  END IF;

  -- Drop get_recent_notifications if it exists with uuid, integer parameters
  IF EXISTS (
    SELECT 1 FROM pg_proc p
    JOIN pg_namespace n ON p.pronamespace = n.oid
    WHERE n.nspname = 'public'
    AND p.proname = 'get_recent_notifications'
  ) THEN
    DROP FUNCTION IF EXISTS get_recent_notifications(uuid, integer);
  END IF;
END $$;

-- Recreate the functions with proper error handling

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