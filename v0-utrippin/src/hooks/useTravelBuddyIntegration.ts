import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface TravelBuddyIntegration {
  joinEvent: (eventId: string, lookingForBuddies?: boolean) => Promise<void>;
  createTripAlert: (tripData: any, lookingForBuddies?: boolean) => Promise<any>;
  followUser: (userId: string) => Promise<'followed' | 'unfollowed'>;
  shareTrip: (tripId: string, platform: string) => Promise<string>;
  getEventAttendees: (eventId: string) => Promise<any[]>;
  getFollowerCount: (userId: string) => Promise<number>;
  getFollowingCount: (userId: string) => Promise<number>;
  isFollowing: (userId: string) => Promise<boolean>;
  loading: boolean;
}

export function useTravelBuddyIntegration(): TravelBuddyIntegration {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const joinEvent = async (eventId: string, lookingForBuddies: boolean = false) => {
    if (!user) throw new Error('User must be logged in');
    
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('travel-buddy-integration', {
        body: {
          action: 'join_event',
          data: {
            userId: user.id,
            eventId,
            lookingForBuddies
          }
        }
      });

      if (error) throw error;
      return data;
    } finally {
      setLoading(false);
    }
  };

  const createTripAlert = async (tripData: any, lookingForBuddies: boolean = false) => {
    if (!user) throw new Error('User must be logged in');
    
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('travel-buddy-integration', {
        body: {
          action: 'create_trip_alert',
          data: {
            userId: user.id,
            tripData,
            lookingForBuddies
          }
        }
      });

      if (error) throw error;
      return data;
    } finally {
      setLoading(false);
    }
  };

  const followUser = async (userId: string) => {
    if (!user) throw new Error('User must be logged in');
    
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('travel-buddy-integration', {
        body: {
          action: 'follow_user',
          data: {
            followerId: user.id,
            followingId: userId
          }
        }
      });

      if (error) throw error;
      return data.action;
    } finally {
      setLoading(false);
    }
  };

  const shareTrip = async (tripId: string, platform: string) => {
    if (!user) throw new Error('User must be logged in');
    
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('travel-buddy-integration', {
        body: {
          action: 'share_trip',
          data: {
            tripId,
            platform,
            userId: user.id
          }
        }
      });

      if (error) throw error;
      return data.shareUrl;
    } finally {
      setLoading(false);
    }
  };

  const getEventAttendees = async (eventId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('travel-buddy-integration', {
        body: {
          action: 'get_event_attendees',
          data: { eventId }
        }
      });

      if (error) throw error;
      return data.attendees;
    } finally {
      setLoading(false);
    }
  };

  const getFollowerCount = async (userId: string): Promise<number> => {
    try {
      const { data, error } = await supabase.rpc('get_follower_count', { user_uuid: userId });
      if (error) throw error;
      return data || 0;
    } catch (error) {
      console.error('Error getting follower count:', error);
      return 0;
    }
  };

  const getFollowingCount = async (userId: string): Promise<number> => {
    try {
      const { data, error } = await supabase.rpc('get_following_count', { user_uuid: userId });
      if (error) throw error;
      return data || 0;
    } catch (error) {
      console.error('Error getting following count:', error);
      return 0;
    }
  };

  const isFollowing = async (userId: string): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const { data, error } = await supabase
        .from('user_follows')
        .select('id')
        .eq('follower_id', user.id)
        .eq('following_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return !!data;
    } catch (error) {
      console.error('Error checking follow status:', error);
      return false;
    }
  };

  return {
    joinEvent,
    createTripAlert,
    followUser,
    shareTrip,
    getEventAttendees,
    getFollowerCount,
    getFollowingCount,
    isFollowing,
    loading
  };
}
