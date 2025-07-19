import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface EnhancedTrip {
  destination: string;
  name: string;
  type: string;
  summary: string;
  detailedDescription?: string;
  highlights?: string[];
  imageUrl?: string;
  budget: number;
  flightsLink: string;
  hotelsLink: string;
  carsLink: string;
}

interface EnhancedTripsResponse {
  trips: EnhancedTrip[];
  provider: string;
  query: string;
  budget: number;
}

export const useEnhancedOpenAITrips = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateTrips = useCallback(async (query: string, budget: number = 3000): Promise<EnhancedTrip[]> => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: supabaseError } = await supabase.functions.invoke('openai-trips-enhanced', {
        body: { query, budget }
      });

      if (supabaseError) {
        console.error('Supabase function error:', supabaseError);
        throw new Error(supabaseError.message);
      }

      if (data?.error) {
        console.error('Function returned error:', data.error);
        
        // If both providers failed, return fallback trips
        if (data.error.includes('Failed to generate trips with both providers')) {
          console.log('Both providers failed, returning fallback trips');
          return generateFallbackTrips(query, budget);
        }
        
        throw new Error(data.error);
      }

      const response = data as EnhancedTripsResponse;
      console.log(`Generated ${response.trips?.length || 0} trips using ${response.provider}`);
      
      return response.trips || [];
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate trips';
      setError(errorMessage);
      console.error('Error generating enhanced trips:', err);
      
      // Return fallback trips as last resort
      return generateFallbackTrips(query, budget);
    } finally {
      setLoading(false);
    }
  }, []);

  const generateFallbackTrips = (query: string, budget: number): EnhancedTrip[] => {
    // Extract destination from query if possible
    const destination = extractDestination(query) || 'Popular Destination';
    
    return [
      {
        destination: destination,
        name: `Budget ${destination} Adventure`,
        type: 'budget',
        summary: `Explore ${destination} on a budget with carefully selected accommodations and activities.`,
        budget: budget,
        flightsLink: `https://utrippin.com/flights?destination=${encodeURIComponent(destination)}`,
        hotelsLink: `https://utrippin.com/hotels?destination=${encodeURIComponent(destination)}`,
        carsLink: `https://utrippin.com/cars?location=${encodeURIComponent(destination)}`
      },
      {
        destination: destination,
        name: `${destination} City Break`,
        type: 'city',
        summary: `Discover the highlights of ${destination} with this city-focused itinerary.`,
        budget: budget,
        flightsLink: `https://utrippin.com/flights?destination=${encodeURIComponent(destination)}`,
        hotelsLink: `https://utrippin.com/hotels?destination=${encodeURIComponent(destination)}`,
        carsLink: `https://utrippin.com/cars?location=${encodeURIComponent(destination)}`
      }
    ];
  };

  const extractDestination = (query: string): string | null => {
    const lowerQuery = query.toLowerCase();
    
    // Common patterns for destination extraction
    const patterns = [
      /(?:go to|visit|travel to|trip to)\s+([a-zA-Z\s]+?)(?:\s+on|\s+in|\s+for|\s+and|$)/,
      /([a-zA-Z\s]+?)(?:\s+on|\s+in)\s+(?:july|august|september|october|november|december|january|february|march|april|may|june)/,
      /([a-zA-Z\s]+?)(?:\s+trip|\s+vacation|\s+holiday)/
    ];
    
    for (const pattern of patterns) {
      const match = lowerQuery.match(pattern);
      if (match && match[1]) {
        return match[1].trim().split(' ').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
      }
    }
    
    return null;
  };

  return { generateTrips, loading, error };
};