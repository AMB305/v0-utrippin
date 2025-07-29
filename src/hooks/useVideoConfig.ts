import { useState, useEffect } from 'react';

interface VideoConfig {
  heroVideos: string[];
  mobileHeroVideos: string[];
}

const BASE_VIDEO_URL = 'https://utrippin.s3.us-east-2.amazonaws.com/';

// Fallback videos in case JSON fails to load
const FALLBACK_VIDEOS = [
  "santorini-houses.mp4",
  "elephants-waterhole.mp4",
  "times-square-night.mp4",
  "tropical-rainforest-sea.mp4"
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