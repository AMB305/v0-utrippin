import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface PlaceDetails {
  imageUrl: string | null;
  websiteUrl: string | null;
  googleMapsUrl: string | null;
  place_id: string;
  name: string;
  rating?: number;
  formatted_address?: string;
  price_level?: number;
}

export const useGooglePlacesDetails = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getPlaceDetails = useCallback(async (placeName: string, location?: string): Promise<PlaceDetails | null> => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: supabaseError } = await supabase.functions.invoke('get-place-details', {
        body: { 
          placeName, 
          location: location || placeName 
        }
      });

      if (supabaseError) {
        console.error('Supabase function error:', supabaseError);
        throw new Error(supabaseError.message);
      }

      return data as PlaceDetails;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch place details';
      setError(errorMessage);
      console.error('Error fetching place details:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getMultiplePlaceDetails = useCallback(async (places: Array<{name: string, location?: string}>): Promise<Record<string, PlaceDetails | null>> => {
    setLoading(true);
    setError(null);

    try {
      const results: Record<string, PlaceDetails | null> = {};
      
      // Process places in batches to avoid rate limits
      const batchSize = 3;
      for (let i = 0; i < places.length; i += batchSize) {
        const batch = places.slice(i, i + batchSize);
        
        const batchPromises = batch.map(async (place) => {
          const details = await getPlaceDetails(place.name, place.location);
          return { name: place.name, details };
        });

        const batchResults = await Promise.all(batchPromises);
        batchResults.forEach(result => {
          results[result.name] = result.details;
        });

        // Small delay between batches
        if (i + batchSize < places.length) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }

      return results;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch place details';
      setError(errorMessage);
      console.error('Error fetching multiple place details:', err);
      return {};
    } finally {
      setLoading(false);
    }
  }, [getPlaceDetails]);

  return { 
    getPlaceDetails, 
    getMultiplePlaceDetails,
    loading, 
    error 
  };
};