import { useState, useEffect } from 'react';

interface VideoConfig {
  heroVideos: string[];
  mobileHeroVideos: string[];
}

const BASE_VIDEO_URL = 'https://d4ia3yy0dqgwb.cloudfront.net/';

// Fallback videos in case JSON fails to load
const FALLBACK_VIDEOS = [
  "famous-white-houses-in-fira-santorini-island-gree-2023-11-27-05-01-35-utc.mp4",
  "herd-of-elephants-approaching-a-waterhole-bank-in-2025-04-25-17-59-46-utc.mp4",
  "beautiful-northern-lights.mp4",
  "cute-lion-cub-on-african.mp4"
];

export const useVideoConfig = (type: 'desktop' | 'mobile' = 'desktop') => {
  const [videos, setVideos] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideoConfig = async () => {
      try {
        setLoading(true);
        const response = await fetch('/videos.json');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch video config: ${response.status}`);
        }
        
        const config: VideoConfig = await response.json();
        
        // Select the appropriate video array based on type
        const videoFilenames = type === 'mobile' ? config.mobileHeroVideos : config.heroVideos;
        
        // Construct full URLs
        const fullUrls = videoFilenames.map(filename => `${BASE_VIDEO_URL}${filename}`);
        
        setVideos(fullUrls);
        setError(null);
        
        console.log(`✅ Loaded ${fullUrls.length} ${type} hero videos from configuration:`);
        fullUrls.forEach((url, index) => {
          console.log(`   ${index + 1}. ${url}`);
        });
      } catch (err) {
        console.error('❌ Failed to load video configuration:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        
        // Use fallback videos
        const fallbackUrls = FALLBACK_VIDEOS.map(filename => `${BASE_VIDEO_URL}${filename}`);
        setVideos(fallbackUrls);
        
        console.log(`🔄 Using ${fallbackUrls.length} fallback ${type} videos`);
      } finally {
        setLoading(false);
      }
    };

    fetchVideoConfig();
  }, [type]);

  return { videos, loading, error };
};
