import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Story {
  id: number | string;
  title: string;
  link: string;
  image: string | null;
  excerpt: string | null;
  source: string | null;
  published_at: string;
  created_at: string;
  publishedAt?: string;
  rawPublishDate?: string;
  category?: string;
  verified?: boolean;
  rssSource?: boolean;
  attribution?: string;
  featured?: boolean;
  freshnessScore?: number;
  relevanceScore?: number;
  isFresh?: boolean;
  contentAge?: "fresh" | "older";
}

interface StoriesResponse {
  stories: Story[];
  freshStories: Story[];
  olderStories: Story[];
  lastUpdated: string;
  sources?: string[];
  totalFound?: number;
  freshCount?: number;
  olderCount?: number;
  rss_sources?: number;
  contentTypes?: string[];
  legal_notice?: string;
}

export function useFreshStories() {
  const [stories, setStories] = useState<Story[]>([]);
  const [freshStories, setFreshStories] = useState<Story[]>([]);
  const [olderStories, setOlderStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [sources, setSources] = useState<string[]>([]);
  const [totalFound, setTotalFound] = useState<number>(0);
  const [freshCount, setFreshCount] = useState<number>(0);
  const [olderCount, setOlderCount] = useState<number>(0);
  const [rss_sources, setRssources] = useState<number>(0);

  const fetchStories = async () => {
    try {
      setLoading(true);
      setError(null);

      // Try to get from API first, fallback to Supabase
      try {
        const response = await fetch("/api/melanin-stories", {
          cache: "no-store",
        });

        if (response.ok) {
          const data: StoriesResponse = await response.json();
          setStories(data.stories);
          setFreshStories(data.freshStories || []);
          setOlderStories(data.olderStories || []);
          setLastUpdated(data.lastUpdated);
          setSources(data.sources || []);
          setTotalFound(data.totalFound || 0);
          setFreshCount(data.freshCount || 0);
          setOlderCount(data.olderCount || 0);
          setRssources(data.rss_sources || 0);
          return;
        }
      } catch (apiError) {
        console.log('API not available, falling back to Supabase');
      }

      // Fallback to Supabase
      const { data, error: fetchError } = await supabase
        .from('stories')
        .select('*')
        .order('published_at', { ascending: false })
        .limit(30);

      if (fetchError) {
        console.error('Failed to load stories:', fetchError);
        setError('Failed to load travel stories');
      } else {
        const supabaseStories = data || [];
        setStories(supabaseStories);
        setFreshStories(supabaseStories.slice(0, 10));
        setOlderStories(supabaseStories.slice(10));
        setFreshCount(Math.min(10, supabaseStories.length));
        setOlderCount(Math.max(0, supabaseStories.length - 10));
      }
    } catch (err) {
      console.error('Error fetching stories:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStories();

    // Auto-refresh every 15 minutes for fresh content
    const interval = setInterval(fetchStories, 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const refreshStories = () => {
    fetchStories();
  };

  return {
    stories,
    freshStories,
    olderStories,
    loading,
    error,
    refreshStories,
    lastUpdated,
    sources,
    totalFound,
    freshCount,
    olderCount,
    rss_sources,
  };
}