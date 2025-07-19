import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type Trip = Database['public']['Tables']['trips']['Row'];
type TripParticipant = Database['public']['Tables']['trip_participants']['Row'];

export interface PublicTrip extends Trip {
  organizer?: {
    email: string;
    location?: string;
    profile_photo_url?: string;
    age?: number;
  };
  participants_count?: number;
  spots_available?: number;
  compatibility_score?: number;
}

export interface TripFilters {
  destination?: string;
  country?: string;
  startDate?: string;
  endDate?: string;
  budget?: [number, number];
  tripType?: string[];
  lookingForBuddies?: boolean;
  maxBuddies?: number;
}

export interface TripApplication {
  id: string;
  trip_id: string;
  applicant_id: string;
  message: string;
  status: 'pending' | 'approved' | 'rejected';
  applied_at: string;
}

class TripService {
  async getPublicTrips(
    filters: TripFilters = {},
    limit: number = 20,
    offset: number = 0
  ): Promise<PublicTrip[]> {
    try {
      let query = supabase
        .from('trips')
        .select(`
          *,
          organizer:users!trips_user_id_fkey(email, location, profile_photo_url, age),
          participants:trip_participants(count)
        `)
        .eq('public', true)
        .eq('looking_for_buddies', true)
        .eq('status', 'planning')
        .range(offset, offset + limit - 1);

      // Apply filters
      if (filters.destination) {
        query = query.ilike('destination', `%${filters.destination}%`);
      }
      if (filters.country) {
        query = query.eq('country', filters.country);
      }
      if (filters.startDate) {
        query = query.gte('start_date', filters.startDate);
      }
      if (filters.endDate) {
        query = query.lte('end_date', filters.endDate);
      }
      if (filters.budget) {
        query = query.gte('budget', filters.budget[0]).lte('budget', filters.budget[1]);
      }
      if (filters.tripType && filters.tripType.length > 0) {
        query = query.in('trip_type', filters.tripType);
      }

      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;

      // Process the data to add computed fields
      return (data || []).map(trip => ({
        ...trip,
        organizer: Array.isArray(trip.organizer) ? trip.organizer[0] : trip.organizer,
        participants_count: Array.isArray(trip.participants) ? trip.participants.length : 0,
        spots_available: (trip.max_buddies || 4) - (Array.isArray(trip.participants) ? trip.participants.length : 0)
      }));
    } catch (error) {
      console.error('Error fetching public trips:', error);
      return [];
    }
  }

  async getTripById(tripId: string): Promise<PublicTrip | null> {
    try {
      const { data, error } = await supabase
        .from('trips')
        .select(`
          *,
          organizer:users!trips_user_id_fkey(email, location, profile_photo_url, age),
          participants:trip_participants(*)
        `)
        .eq('id', tripId)
        .single();
      
      if (error) throw error;

      return {
        ...data,
        organizer: Array.isArray(data.organizer) ? data.organizer[0] : data.organizer,
        participants_count: Array.isArray(data.participants) ? data.participants.length : 0,
        spots_available: (data.max_buddies || 4) - (Array.isArray(data.participants) ? data.participants.length : 0)
      };
    } catch (error) {
      console.error('Error fetching trip:', error);
      return null;
    }
  }

  async createTrip(tripData: Partial<Trip>, userId: string): Promise<Trip | null> {
    try {
      const { data, error } = await supabase
        .from('trips')
        .insert({
          title: tripData.title || 'New Trip',
          destination: tripData.destination || 'TBD',
          ...tripData,
          user_id: userId,
          public: true,
          looking_for_buddies: true,
          status: 'planning'
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating trip:', error);
      return null;
    }
  }

  async applyToTrip(tripId: string, applicantId: string, message: string) {
    try {
      // For now, we'll use the buddy_requests table as a temporary solution
      const { data, error } = await supabase
        .from('buddy_requests')
        .insert({
          trip_id: tripId,
          from_user_id: applicantId,
          to_user_id: null, // Will be filled by trigger
          message,
          status: 'pending'
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error applying to trip:', error);
      throw error;
    }
  }

  async getUserTrips(userId: string): Promise<Trip[]> {
    try {
      const { data, error } = await supabase
        .from('trips')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching user trips:', error);
      return [];
    }
  }

  async searchDestinations(query: string, limit: number = 10): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('trips')
        .select('destination')
        .eq('public', true)
        .ilike('destination', `%${query}%`)
        .limit(limit);
      
      if (error) throw error;
      return [...new Set(data?.map(t => t.destination).filter(Boolean))];
    } catch (error) {
      console.error('Error searching destinations:', error);
      return [];
    }
  }

  async getPopularDestinations(limit: number = 10): Promise<Array<{destination: string, count: number}>> {
    try {
      const { data, error } = await supabase
        .from('trips')
        .select('destination')
        .eq('public', true)
        .eq('looking_for_buddies', true);
      
      if (error) throw error;

      // Count destinations
      const destinationCounts: Record<string, number> = {};
      data?.forEach(trip => {
        if (trip.destination) {
          destinationCounts[trip.destination] = (destinationCounts[trip.destination] || 0) + 1;
        }
      });

      return Object.entries(destinationCounts)
        .map(([destination, count]) => ({ destination, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, limit);
    } catch (error) {
      console.error('Error fetching popular destinations:', error);
      return [];
    }
  }
}

export const tripService = new TripService();