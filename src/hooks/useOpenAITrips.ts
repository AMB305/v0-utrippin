import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface OpenAITrip {
  destination: string;
  name: string;
  type: string;
  summary: string;
  budget: number;
  flightsLink: string;
  hotelsLink: string;
  carsLink: string;
}

export const useOpenAITrips = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateTrips = useCallback(async (prompt: string): Promise<OpenAITrip[]> => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: supabaseError } = await supabase.functions.invoke('openai-trips', {
        body: { prompt }
      });

      if (supabaseError) {
        throw new Error(supabaseError.message);
      }

      // Check if the response contains an error from the edge function
      if (data?.error) {
        throw new Error(data.error);
      }

      return data?.trips || [];
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate trips';
      setError(errorMessage);
      console.error('Error generating trips:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return { generateTrips, loading, error };
};
