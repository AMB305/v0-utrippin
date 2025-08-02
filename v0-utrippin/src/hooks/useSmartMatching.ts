import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface MatchFilters {
  destination?: string;
  maxAgeDiff?: number;
  minScore?: number;
  limit?: number;
}

export interface CompatibilityFactor {
  type: string;
  score: number;
  description: string;
}

export interface TravelBuddyMatch {
  buddy_user_id: string;
  buddy_email: string;
  buddy_age: number;
  buddy_location: string;
  buddy_photo: string;
  buddy_bio: string;
  buddy_travel_style: string;
  buddy_languages: string[];
  match_score: number;
  score_breakdown: any;
  common_interests: string[];
  common_destinations: string[];
  matchQuality: 'Excellent' | 'Good' | 'Fair' | 'Low';
  compatibilityFactors: CompatibilityFactor[];
  matchPercentage: number;
  topCommonInterests: string[];
  topCommonDestinations: string[];
}

export interface MatchingResponse {
  matches: TravelBuddyMatch[];
  totalCount: number;
  averageScore: number;
  filters: {
    applied: MatchFilters;
    resultsCount: number;
    scoreRange: { min: number; max: number } | null;
  };
}

export const useSmartMatching = () => {
  const [loading, setLoading] = useState(false);
  const [matches, setMatches] = useState<TravelBuddyMatch[]>([]);
  const [matchingStats, setMatchingStats] = useState<Omit<MatchingResponse, 'matches'> | null>(null);
  const { toast } = useToast();

  const findMatches = useCallback(async (userId: string, filters?: MatchFilters) => {
    if (!userId) {
      toast({
        title: "Error",
        description: "User ID is required for matching",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('smart-matching', {
        body: {
          userId,
          filters: {
            destination: filters?.destination,
            maxAgeDiff: filters?.maxAgeDiff || 15,
            minScore: filters?.minScore || 0.3,
            limit: filters?.limit || 20,
          }
        }
      });

      if (error) {
        throw error;
      }

      const response = data as MatchingResponse;
      setMatches(response.matches);
      setMatchingStats({
        totalCount: response.totalCount,
        averageScore: response.averageScore,
        filters: response.filters
      });

      if (response.totalCount === 0) {
        toast({
          title: "No matches found",
          description: "Try adjusting your filters or completing your profile for better matches.",
        });
      }

    } catch (error: any) {
      console.error('Smart matching error:', error);
      toast({
        title: "Matching failed",
        description: error.message || "Failed to find travel buddy matches",
        variant: "destructive",
      });
      setMatches([]);
      setMatchingStats(null);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const getMatchByScore = useCallback((minScore: number) => {
    return matches.filter(match => match.match_score >= minScore);
  }, [matches]);

  const getMatchesByQuality = useCallback((quality: TravelBuddyMatch['matchQuality']) => {
    return matches.filter(match => match.matchQuality === quality);
  }, [matches]);

  const getTopCompatibilityFactors = useCallback((match: TravelBuddyMatch, limit = 3) => {
    return match.compatibilityFactors.slice(0, limit);
  }, []);

  const clearMatches = useCallback(() => {
    setMatches([]);
    setMatchingStats(null);
  }, []);

  return {
    loading,
    matches,
    matchingStats,
    findMatches,
    getMatchByScore,
    getMatchesByQuality,
    getTopCompatibilityFactors,
    clearMatches,
  };
};
