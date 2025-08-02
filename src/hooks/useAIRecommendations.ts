import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export interface TripRecommendation {
  id: string;
  destination: string;
  title: string;
  description: string;
  confidence_score: number;
  estimated_budget: number;
  duration_days: number;
  activities: string[];
  is_viewed: boolean;
  is_saved: boolean;
  created_at: string;
  based_on_preferences?: any;
}

export const useAIRecommendations = () => {
  const [recommendations, setRecommendations] = useState<TripRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const generateRecommendations = async () => {
    if (!user) {
      toast.error('Please sign in to get personalized recommendations');
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-trip-recommendations', {
        body: { action: 'generate' }
      });

      if (error) throw error;

      if (data.success) {
        setRecommendations(data.recommendations);
        toast.success(`Generated ${data.recommendations.length} personalized recommendations!`);
      }
    } catch (error) {
      console.error('Error generating recommendations:', error);
      toast.error('Failed to generate recommendations. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserRecommendations = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('trip_recommendations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRecommendations(data || []);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      toast.error('Failed to load recommendations');
    } finally {
      setIsLoading(false);
    }
  };

  const markAsViewed = async (recommendationId: string) => {
    try {
      const { error } = await supabase.functions.invoke('ai-trip-recommendations', {
        body: { action: 'mark_viewed', recommendationId }
      });

      if (!error) {
        setRecommendations(prev => 
          prev.map(rec => 
            rec.id === recommendationId 
              ? { ...rec, is_viewed: true }
              : rec
          )
        );
      }
    } catch (error) {
      console.error('Error marking recommendation as viewed:', error);
    }
  };

  const saveRecommendation = async (recommendationId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('ai-trip-recommendations', {
        body: { action: 'save', recommendationId }
      });

      if (error) throw error;

      if (data.success) {
        setRecommendations(prev => 
          prev.map(rec => 
            rec.id === recommendationId 
              ? { ...rec, is_saved: true }
              : rec
          )
        );
        toast.success('Recommendation saved!');
      }
    } catch (error) {
      console.error('Error saving recommendation:', error);
      toast.error('Failed to save recommendation');
    }
  };

  return {
    recommendations,
    isLoading,
    generateRecommendations,
    fetchUserRecommendations,
    markAsViewed,
    saveRecommendation
  };
};
