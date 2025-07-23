import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface Recommendation {
  id: string;
  recommendation_type: string;
  recommendation_data: {
    title: string;
    description: string;
    reasoning: string;
    confidence: number;
    metadata: Record<string, any>;
  };
  confidence_score: number;
  generated_at: string;
  expires_at: string;
}

interface UseRecommendationsOptions {
  type?: 'destination' | 'activity' | 'budget' | 'duration';
}

export const useRecommendations = (options: UseRecommendationsOptions = {}) => {
  const { user } = useAuth();
  const { type = 'destination' } = options;
  
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchRecommendations = async (forceRefresh = false) => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      console.log(`Fetching ${type} recommendations for user:`, user.id);
      
      const { data, error: functionError } = await supabase.functions.invoke('ai-trip-recommendations', {
        body: {
          user_id: user.id,
          recommendation_type: type,
          force_refresh: forceRefresh
        }
      });

      if (functionError) {
        throw new Error(functionError.message);
      }

      if (data?.recommendations) {
        setRecommendations(data.recommendations);
        setLastUpdated(new Date());
        console.log(`Loaded ${data.recommendations.length} recommendations from ${data.source}`);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch recommendations';
      console.error('Error fetching recommendations:', err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const refreshRecommendations = () => {
    fetchRecommendations(true);
  };

  // Subscribe to real-time updates for recommendations
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('user-recommendations')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'user_recommendations',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('New recommendation received:', payload);
          if (payload.new.recommendation_type === type) {
            setRecommendations(prev => [payload.new as Recommendation, ...prev.slice(0, 4)]);
            setLastUpdated(new Date());
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, type]);

  // Initial fetch
  useEffect(() => {
    if (user) {
      fetchRecommendations();
    }
  }, [user, type]);

  // Removed auto-refresh to control costs

  // Check for expired recommendations and clean them up
  useEffect(() => {
    const cleanupExpired = () => {
      const now = new Date();
      setRecommendations(prev => 
        prev.filter(rec => new Date(rec.expires_at) > now)
      );
    };

    const interval = setInterval(cleanupExpired, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  const getRecommendationsByConfidence = (minConfidence = 0.5) => {
    return recommendations
      .filter(rec => rec.confidence_score >= minConfidence)
      .sort((a, b) => b.confidence_score - a.confidence_score);
  };

  const getTopRecommendations = (count = 3) => {
    return recommendations
      .sort((a, b) => b.confidence_score - a.confidence_score)
      .slice(0, count);
  };

  return {
    recommendations,
    loading,
    error,
    lastUpdated,
    fetchRecommendations,
    refreshRecommendations,
    getRecommendationsByConfidence,
    getTopRecommendations
  };
};