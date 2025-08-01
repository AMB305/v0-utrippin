import { useState, useEffect } from 'react';
import { getMelaninStories } from '../data/melanin-stories';

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

      // Simulate API delay for realism
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const data = getMelaninStories();

      setStories(data.stories);
      setFreshStories(data.freshStories);
      setOlderStories(data.olderStories);
      setLastUpdated(data.lastUpdated);
      setSources(data.sources);
      setTotalFound(data.totalFound);
      setFreshCount(data.freshCount);
      setOlderCount(data.olderCount);
      setRssources(data.rss_sources);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error fetching stories:", err);
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