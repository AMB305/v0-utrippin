import { createClient } from '@supabase/supabase-js';
import { useState, useEffect } from 'react';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Custom hook for Supabase operations
export function useSupabase() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return { user, loading, supabase };
}

// Travel-specific database operations
export const travelDb = {
  // User operations
  async createUserProfile(userData) {
    const { data, error } = await supabase
      .from('users')
      .insert([{
        auth_user_id: userData.auth_user_id,
        name: userData.name,
        email: userData.email,
        age: userData.age,
        bio: userData.bio,
        location: userData.location,
        preferred_destinations: userData.preferred_destinations,
        travel_style: userData.travel_style,
        interests: userData.interests,
        languages_spoken: userData.languages_spoken
      }])
      .select()
      .single();
    
    return { data, error };
  },

  async getUserProfile(authUserId) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('auth_user_id', authUserId)
      .single();
    
    return { data, error };
  },

  async updateUserProfile(userId, updates) {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    
    return { data, error };
  },

  // Trip operations
  async saveTrip(tripData) {
    const { data, error } = await supabase
      .from('trips')
      .insert([{
        user_id: tripData.user_id,
        title: tripData.title,
        destination: tripData.destination,
        country: tripData.country,
        start_date: tripData.start_date,
        end_date: tripData.end_date,
        budget: tripData.budget,
        currency: tripData.currency,
        trip_type: tripData.trip_type,
        itinerary_json: tripData.itinerary_json,
        ai_generated: tripData.ai_generated,
        ai_prompt: tripData.ai_prompt,
        public: tripData.public,
        looking_for_buddies: tripData.looking_for_buddies
      }])
      .select()
      .single();
    
    return { data, error };
  },

  async getUserTrips(userId) {
    const { data, error } = await supabase
      .from('trips')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    return { data, error };
  },

  async getPublicTrips(limit = 20) {
    const { data, error } = await supabase
      .from('trips')
      .select(`
        *,
        users (
          name,
          profile_photo_url,
          location
        )
      `)
      .eq('public', true)
      .eq('status', 'planning')
      .order('created_at', { ascending: false })
      .limit(limit);
    
    return { data, error };
  },

  async updateTrip(tripId, updates) {
    const { data, error } = await supabase
      .from('trips')
      .update(updates)
      .eq('id', tripId)
      .select()
      .single();
    
    return { data, error };
  },

  // Itinerary operations
  async saveItinerary(itineraryData) {
    const { data, error } = await supabase
      .from('itineraries')
      .insert(itineraryData)
      .select();
    
    return { data, error };
  },

  async getItinerary(tripId) {
    const { data, error } = await supabase
      .from('itineraries')
      .select('*')
      .eq('trip_id', tripId)
      .order('day_number', { ascending: true });
    
    return { data, error };
  },

  // Travel buddy operations
  async findTravelBuddies(tripId) {
    const { data, error } = await supabase
      .rpc('find_travel_buddies', { user_trip_id: tripId });
    
    return { data, error };
  },

  async sendBuddyRequest(requestData) {
    const { data, error } = await supabase
      .from('buddy_requests')
      .insert([{
        from_user_id: requestData.from_user_id,
        to_user_id: requestData.to_user_id,
        trip_id: requestData.trip_id,
        message: requestData.message
      }])
      .select()
      .single();
    
    return { data, error };
  },

  async getBuddyRequests(userId) {
    const { data, error } = await supabase
      .from('buddy_requests')
      .select(`
        *,
        from_user:users!buddy_requests_from_user_id_fkey (
          name,
          profile_photo_url,
          location
        ),
        trip:trips (
          title,
          destination,
          start_date,
          end_date
        )
      `)
      .eq('to_user_id', userId)
      .eq('status', 'pending')
      .order('created_at', { ascending: false });
    
    return { data, error };
  },

  async respondToBuddyRequest(requestId, status) {
    const { data, error } = await supabase
      .from('buddy_requests')
      .update({ status })
      .eq('id', requestId)
      .select()
      .single();
    
    return { data, error };
  },

  // Match operations
  async createMatch(matchData) {
    const { data, error } = await supabase
      .from('matches')
      .insert([{
        trip_id_1: matchData.trip_id_1,
        trip_id_2: matchData.trip_id_2,
        user_id_1: matchData.user_id_1,
        user_id_2: matchData.user_id_2,
        match_score: matchData.match_score,
        common_interests: matchData.common_interests,
        message: matchData.message
      }])
      .select()
      .single();
    
    return { data, error };
  },

  async getUserMatches(userId) {
    const { data, error } = await supabase
      .from('matches')
      .select(`
        *,
        trip_1:trips!matches_trip_id_1_fkey (
          title,
          destination,
          start_date,
          end_date
        ),
        trip_2:trips!matches_trip_id_2_fkey (
          title,
          destination,
          start_date,
          end_date
        ),
        user_1:users!matches_user_id_1_fkey (
          name,
          profile_photo_url,
          location
        ),
        user_2:users!matches_user_id_2_fkey (
          name,
          profile_photo_url,
          location
        )
      `)
      .or(`user_id_1.eq.${userId},user_id_2.eq.${userId}`)
      .order('created_at', { ascending: false });
    
    return { data, error };
  },

  // Saved itineraries
  async saveItineraryBookmark(userId, tripId, notes = '') {
    const { data, error } = await supabase
      .from('saved_itineraries')
      .insert([{
        user_id: userId,
        trip_id: tripId,
        notes
      }])
      .select()
      .single();
    
    return { data, error };
  },

  async getSavedItineraries(userId) {
    const { data, error } = await supabase
      .from('saved_itineraries')
      .select(`
        *,
        trip:trips (
          *,
          user:users (
            name,
            profile_photo_url
          )
        )
      `)
      .eq('user_id', userId)
      .order('saved_at', { ascending: false });
    
    return { data, error };
  },

  // Search operations
  async searchTrips(query, filters = {}) {
    let queryBuilder = supabase
      .from('trips')
      .select(`
        *,
        users (
          name,
          profile_photo_url,
          location
        )
      `)
      .eq('public', true);

    if (query) {
      queryBuilder = queryBuilder.or(
        `destination.ilike.%${query}%,title.ilike.%${query}%,country.ilike.%${query}%`
      );
    }

    if (filters.destination) {
      queryBuilder = queryBuilder.ilike('destination', `%${filters.destination}%`);
    }

    if (filters.start_date) {
      queryBuilder = queryBuilder.gte('start_date', filters.start_date);
    }

    if (filters.end_date) {
      queryBuilder = queryBuilder.lte('end_date', filters.end_date);
    }

    if (filters.budget_min) {
      queryBuilder = queryBuilder.gte('budget', filters.budget_min);
    }

    if (filters.budget_max) {
      queryBuilder = queryBuilder.lte('budget', filters.budget_max);
    }

    if (filters.trip_type) {
      queryBuilder = queryBuilder.eq('trip_type', filters.trip_type);
    }

    if (filters.looking_for_buddies) {
      queryBuilder = queryBuilder.eq('looking_for_buddies', true);
    }

    const { data, error } = await queryBuilder
      .order('created_at', { ascending: false })
      .limit(filters.limit || 20);
    
    return { data, error };
  }
};