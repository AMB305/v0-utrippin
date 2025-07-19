import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Story {
  id: number;
  title: string;
  link: string;
  image: string | null;
  excerpt: string | null;
  source: string | null;
  published_at: string;
  created_at: string;
}

export function useFreshStories() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const { data, error: fetchError } = await supabase
          .from('stories')
          .select('*')
          .order('published_at', { ascending: false })
          .limit(30);

        if (fetchError) {
          console.error('Failed to load stories:', fetchError);
          setError('Failed to load travel stories');
        } else {
          setStories(data || []);
        }
      } catch (err) {
        console.error('Error fetching stories:', err);
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, []);

  const refreshStories = async () => {
    // Call the edge function to fetch fresh stories
    try {
      const { error } = await supabase.functions.invoke('fetch-stories');
      if (error) {
        console.error('Error refreshing stories:', error);
      } else {
        // Refresh the local stories after fetching new ones
        const { data } = await supabase
          .from('stories')
          .select('*')
          .order('published_at', { ascending: false })
          .limit(30);
        
        if (data) {
          setStories(data);
        }
      }
    } catch (err) {
      console.error('Error in refreshStories:', err);
    }
  };

  return { stories, loading, error, refreshStories };
}