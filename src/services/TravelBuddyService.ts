import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type User = Database['public']['Tables']['users']['Row'];
type TravelBuddyMatch = Database['public']['Tables']['travel_buddy_matches']['Row'];

export interface TravelBuddyProfile {
  id: string;
  email: string;
  age: number | null;
  bio: string | null;
  location: string | null;
  profile_photo_url: string | null;
  preferred_destinations: string[] | null;
  travel_style: string | null;
  interests: string[] | null;
  languages_spoken: string[] | null;
  public_profile: boolean | null;
  verified: boolean | null;
  stripe_customer_id: string | null;
  subscription_status: string | null;
  created_at: string;
  compatibility_score?: number;
  mutual_destinations?: string[];
  distance?: number;
}

export interface BrowseFilters {
  location?: string;
  destinations?: string[];
  travelStyle?: string[];
  ageRange?: [number, number];
  interests?: string[];
  budget?: [number, number];
  availableDates?: [string, string];
  groupSize?: string;
}

class TravelBuddyService {
  async getPotentialBuddies(
    currentUserId?: string,
    filters: BrowseFilters = {},
    limit: number = 20,
    offset: number = 0
  ): Promise<TravelBuddyProfile[]> {
    try {
      if (currentUserId) {
        // Authenticated user - get personalized matches
        const { data, error } = await supabase.rpc('get_potential_travel_buddies', {
          current_user_id: currentUserId,
          limit_count: limit
        });
        
        if (error) throw error;
        return (data || []).map(item => ({
          id: item.user_id,
          email: item.user_email,
          age: item.user_age,
          bio: item.user_bio,
          location: item.user_location,
          profile_photo_url: item.user_photo,
          preferred_destinations: item.preferred_destinations,
          travel_style: item.travel_style,
          interests: item.interests,
          languages_spoken: null,
          public_profile: true,
          verified: false,
          stripe_customer_id: null,
          subscription_status: null,
          created_at: new Date().toISOString(),
          compatibility_score: item.compatibility_score
        }));
      } else {
        // Guest browsing - get public profiles with basic filtering
        let query = supabase
          .from('users')
          .select('*')
          .eq('public_profile', true)
          .range(offset, offset + limit - 1);

        // Apply filters
        if (filters.location) {
          query = query.ilike('location', `%${filters.location}%`);
        }
        if (filters.ageRange) {
          query = query.gte('age', filters.ageRange[0]).lte('age', filters.ageRange[1]);
        }
        if (filters.travelStyle) {
          query = query.in('travel_style', filters.travelStyle);
        }

        const { data, error } = await query;
        if (error) throw error;
        return data || [];
      }
    } catch (error) {
      console.error('Error fetching travel buddies:', error);
      return [];
    }
  }

  async recordSwipe(swiperId: string, swipedId: string, liked: boolean) {
    try {
      const { data, error } = await supabase.rpc('record_swipe', {
        swiper_user_id: swiperId,
        swiped_user_id: swipedId,
        is_liked: liked
      });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error recording swipe:', error);
      throw error;
    }
  }

  async getUserMatches(userId: string): Promise<any[]> {
    try {
      const { data, error } = await supabase.rpc('get_user_matches', {
        user_id: userId
      });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching matches:', error);
      return [];
    }
  }

  async saveToWishlist(userId: string | null, buddyId: string, type: 'traveler' | 'trip' | 'group' | 'local' | 'story') {
    if (!userId) {
      // Guest mode - save to localStorage
      const wishlist = JSON.parse(localStorage.getItem('travel_wishlist') || '[]');
      const item = { id: buddyId, type, savedAt: new Date().toISOString() };
      
      if (!wishlist.find((w: any) => w.id === buddyId)) {
        wishlist.push(item);
        localStorage.setItem('travel_wishlist', JSON.stringify(wishlist));
      }
      return item;
    } else {
      // Authenticated mode - save to database
      // Implementation would go here when we add wishlist table
      console.log('Saving to user wishlist:', { userId, buddyId, type });
    }
  }

  getGuestWishlist() {
    return JSON.parse(localStorage.getItem('travel_wishlist') || '[]');
  }

  async searchByLocation(query: string, limit: number = 10) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('location')
        .eq('public_profile', true)
        .ilike('location', `%${query}%`)
        .limit(limit);
      
      if (error) throw error;
      return [...new Set(data?.map(u => u.location).filter(Boolean))];
    } catch (error) {
      console.error('Error searching locations:', error);
      return [];
    }
  }
}

export const travelBuddyService = new TravelBuddyService();
