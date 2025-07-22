import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Recommendation {
  category_name: string;
  places: Array<{
    name: string;
    description: string;
    type: 'hotel' | 'restaurant' | 'activity' | 'destination';
  }>;
}

export interface TravelResponse {
  title: string;
  summary: string;
  recommendations: Recommendation[];
  follow_up_questions: string[];
}

export interface ExpediaHotelData {
  name: string;
  bookingUrl: string;
  imageUrl?: string;
  rating?: number;
  price?: string;
  description?: string;
}

export const useExpediaIntegration = () => {
  const [loadingHotels, setLoadingHotels] = useState<Set<string>>(new Set());

  const parseAIResponse = (response: string): TravelResponse | null => {
    try {
      // Clean the response and try to parse JSON
      const cleanResponse = response.trim().replace(/^```json\s*/, '').replace(/\s*```$/, '');
      return JSON.parse(cleanResponse);
    } catch (error) {
      console.error('Failed to parse AI response as JSON:', error);
      return null;
    }
  };

  const fetchExpediaHotelData = async (hotelName: string, destination?: string): Promise<ExpediaHotelData | null> => {
    setLoadingHotels(prev => new Set(prev).add(hotelName));
    
    try {
      const { data, error } = await supabase.functions.invoke('expedia-hotel-lookup', {
        body: {
          hotelName,
          destination
        }
      });

      if (error) {
        console.error('Expedia lookup error:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Failed to fetch Expedia hotel data:', error);
      return null;
    } finally {
      setLoadingHotels(prev => {
        const updated = new Set(prev);
        updated.delete(hotelName);
        return updated;
      });
    }
  };

  const enhanceRecommendationsWithBookingData = async (
    travelResponse: TravelResponse
  ): Promise<TravelResponse & { enrichedHotels: Record<string, ExpediaHotelData> }> => {
    const enrichedHotels: Record<string, ExpediaHotelData> = {};

    for (const recommendation of travelResponse.recommendations) {
      for (const place of recommendation.places) {
        if (place.type === 'hotel') {
          const hotelData = await fetchExpediaHotelData(place.name);
          if (hotelData) {
            enrichedHotels[place.name] = hotelData;
          }
        }
      }
    }

    return {
      ...travelResponse,
      enrichedHotels
    };
  };

  const isHotelLoading = (hotelName: string): boolean => {
    return loadingHotels.has(hotelName);
  };

  return {
    parseAIResponse,
    fetchExpediaHotelData,
    enhanceRecommendationsWithBookingData,
    isHotelLoading,
    loadingHotels: Array.from(loadingHotels)
  };
};