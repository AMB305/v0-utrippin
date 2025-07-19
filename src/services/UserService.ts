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

      const { data: userData, error: userError } = await supabase
        .from('users')
        .select(`
          *,
          profile:profiles(*)
        `)
        .eq('email', user.email)
        .single();

      if (userError) {
        // User doesn't exist in our users table yet, create them
        const { data: newUser, error: createError } = await supabase
          .from('users')
          .insert({
            id: user.id,
            email: user.email!,
            public_profile: true
          })
          .select()
          .single();

        if (createError) throw createError;
        return newUser;
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