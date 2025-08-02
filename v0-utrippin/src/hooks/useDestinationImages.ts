import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useDestinationImages = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDestinationImage = useCallback(async (destination: string): Promise<string | null> => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: supabaseError } = await supabase.functions.invoke('destination-images', {
        body: { query: destination }
      });

      if (supabaseError) {
        console.error('Supabase function error:', supabaseError);
        throw new Error(supabaseError.message);
      }

      return data?.imageUrl || null;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch image';
      setError(errorMessage);
      console.error('Error fetching destination image:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { fetchDestinationImage, loading, error };
};
