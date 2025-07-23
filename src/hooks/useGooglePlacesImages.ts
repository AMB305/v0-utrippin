import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface PlacePhoto {
  photo_reference: string;
  width: number;
  height: number;
}

interface PlaceDetails {
  place_id: string;
  name: string;
  photos?: PlacePhoto[];
  formatted_address?: string;
  rating?: number;
  price_level?: number;
}

export const useGooglePlacesImages = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getPlaceImageUrl = useCallback(async (placeName: string, location?: string): Promise<string | null> => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: supabaseError } = await supabase.functions.invoke('get-place-image', {
        body: { 
          placeName, 
          location: location || placeName 
        }
      });

      if (supabaseError) {
        console.error('Supabase function error:', supabaseError);
        throw new Error(supabaseError.message);
      }

      return data?.imageUrl || null;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch place image';
      setError(errorMessage);
      console.error('Error fetching place image:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getMultiplePlaceImages = useCallback(async (places: Array<{name: string, location?: string}>): Promise<Record<string, string | null>> => {
    setLoading(true);
    setError(null);

    try {
      const results: Record<string, string | null> = {};
      
      // Process places in batches to avoid rate limits
      const batchSize = 3;
      for (let i = 0; i < places.length; i += batchSize) {
        const batch = places.slice(i, i + batchSize);
        
        const batchPromises = batch.map(async (place) => {
          const imageUrl = await getPlaceImageUrl(place.name, place.location);
          return { name: place.name, imageUrl };
        });

        const batchResults = await Promise.all(batchPromises);
        batchResults.forEach(result => {
          results[result.name] = result.imageUrl;
        });

        // Small delay between batches
        if (i + batchSize < places.length) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }

      return results;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch place images';
      setError(errorMessage);
      console.error('Error fetching multiple place images:', err);
      return {};
    } finally {
      setLoading(false);
    }
  }, [getPlaceImageUrl]);

  return { 
    getPlaceImageUrl, 
    getMultiplePlaceImages,
    loading, 
    error 
  };
};