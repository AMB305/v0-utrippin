import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type User = Database['public']['Tables']['users']['Row'];
type Profile = Database['public']['Tables']['profiles']['Row'];

export interface UserProfile extends User {
  profile?: Profile;
}

class UserService {
  async getCurrentUser(): Promise<UserProfile | null> {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;
      if (!user) return null;

      // Use maybeSingle() to avoid errors when user doesn't exist
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select(`
          *,
          profile:profiles(*)
        `)
        .eq('id', user.id)  // Use user.id instead of email for better consistency
        .maybeSingle();

      if (userError) {
        console.error('Error fetching user data:', userError);
        return null;
      }

      // If user doesn't exist, they will be created by the trigger
      // Just return the basic user info
      if (!userData) {
        // Wait a moment for the trigger to create the user, then try again
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const { data: retryData } = await supabase
          .from('users')
          .select(`
            *,
            profile:profiles(*)
          `)
          .eq('id', user.id)
          .maybeSingle();
          
        if (!retryData) {
          // Return minimal user data if still not found
          return {
            id: user.id,
            email: user.email!,
            public_profile: true,
            created_at: new Date().toISOString(),
            age: null,
            verified: false,
            agoda_affiliate_id: null,
            stripe_customer_id: null,
            subscription_status: null,
            bio: null,
            location: null,
            preferred_destinations: null,
            travel_style: null,
            interests: null,
            languages_spoken: null,
            profile_photo_url: null,
            booking_affiliate_id: null,
            expedia_affiliate_id: null,
            hotels_affiliate_id: null,
            kayak_affiliate_id: null,
            priceline_affiliate_id: null
          };
        }
        
        return {
          ...retryData,
          profile: Array.isArray(retryData.profile) ? retryData.profile[0] : retryData.profile
        };
      }

      return {
        ...userData,
        profile: Array.isArray(userData.profile) ? userData.profile[0] : userData.profile
      };
    } catch (error) {
      console.error('Error fetching current user:', error);
      return null;
    }
  }

  async updateUserProfile(userId: string, updates: Partial<User>): Promise<User | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating user profile:', error);
      return null;
    }
  }

  async createProfile(userId: string, profileData: Omit<Profile, 'id' | 'created_at'>): Promise<Profile | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          ...profileData
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating profile:', error);
      return null;
    }
  }

  async getUserById(userId: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select(`
          *,
          profile:profiles(*)
        `)
        .eq('id', userId)
        .single();

      if (error) throw error;

      return {
        ...data,
        profile: Array.isArray(data.profile) ? data.profile[0] : data.profile
      };
    } catch (error) {
      console.error('Error fetching user by ID:', error);
      return null;
    }
  }

  async searchUsers(query: string, limit: number = 10): Promise<User[]> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('public_profile', true)
        .or(`email.ilike.%${query}%,location.ilike.%${query}%`)
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error searching users:', error);
      return [];
    }
  }

  async getPublicUsers(limit: number = 50, offset: number = 0): Promise<User[]> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('public_profile', true)
        .range(offset, offset + limit - 1)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching public users:', error);
      return [];
    }
  }
}

export const userService = new UserService();