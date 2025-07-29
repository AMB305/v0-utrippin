-- Fix the duplicate user creation issue with an upsert approach
-- Create a secure function to handle user creation/updates
CREATE OR REPLACE FUNCTION public.handle_auth_user_upsert()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, email, public_profile, created_at)
  VALUES (new.id, new.email, true, now())
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    public_profile = COALESCE(users.public_profile, true);
  RETURN new;
END;
$$;

-- Drop the existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create the new trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_auth_user_upsert();

-- Fix search_path security for existing functions
ALTER FUNCTION public.has_role(uuid, text) SET search_path = public;
ALTER FUNCTION public.get_follower_count(uuid) SET search_path = public;
ALTER FUNCTION public.get_following_count(uuid) SET search_path = public;
ALTER FUNCTION public.calculate_match_score(uuid, uuid) SET search_path = public;
ALTER FUNCTION public.find_travel_buddies(uuid) SET search_path = public;
ALTER FUNCTION public.update_updated_at_column() SET search_path = public;
ALTER FUNCTION public.calculate_trip_duration() SET search_path = public;
ALTER FUNCTION public.create_travel_buddy_match() SET search_path = public;
ALTER FUNCTION public.get_potential_travel_buddies(uuid, integer) SET search_path = public;
ALTER FUNCTION public.record_swipe(text, uuid, boolean) SET search_path = public;
ALTER FUNCTION public.get_user_matches(text) SET search_path = public;

-- Add proper RLS policies for user_roles table if it exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_roles') THEN
    -- Enable RLS on user_roles if not already enabled
    ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
    
    -- Create secure policies for user_roles
    DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
    CREATE POLICY "Users can view their own roles" ON public.user_roles
      FOR SELECT USING (user_id = auth.uid());
      
    DROP POLICY IF EXISTS "Service role can manage roles" ON public.user_roles;
    CREATE POLICY "Service role can manage roles" ON public.user_roles
      FOR ALL USING (true);
  END IF;
END
$$;