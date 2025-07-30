import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Destination {
  id: string;
  name: string;
  description?: string;
  category?: string;
  price?: number;
  per?: string;
  img?: string;
  country?: string;
  slug?: string;
}

export const useDestinations = () => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDestinations = async (category?: string, searchQuery?: string) => {
    setLoading(true);
    setError(null);
    
    try {
      let query = supabase.from('destinations').select('*');
      
      if (category && category !== 'All') {
        query = query.eq('category', category);
      }
      
      if (searchQuery) {
        query = query.or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,country.ilike.%${searchQuery}%`);
      }
      
      const { data, error: queryError } = await query;
      
      if (queryError) throw queryError;
      
      setDestinations(data || []);
    } catch (err) {
      console.error('Error fetching destinations:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch destinations');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllDestinations = async () => {
    await fetchDestinations();
  };

  return {
    destinations,
    loading,
    error,
    fetchDestinations,
    fetchAllDestinations
  };
};