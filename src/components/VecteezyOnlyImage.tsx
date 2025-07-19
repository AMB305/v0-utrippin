import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface VecteezyOnlyImageProps {
  destination: string;
  description?: string;
  tags?: string[];
  fallbackImage?: string;
  className?: string;
  alt?: string;
  onClick?: (e?: React.MouseEvent) => void;
}

// Vecteezy-only fallback travel images (with camref tracking)
const vecteezyFallbackPhotos: Record<string, string> = {
  "travel": "https://static.vecteezy.com/system/resources/previews/005/879/539/non_2x/cloud-computing-modern-flat-concept-for-web-banner-design-man-and-woman-work-with-data-storage-in-cloud-service-analyse-and-sort-information-illustration-with-isolated-people-scene-free-vector.jpg?camref=utrippin123",
  "destination": "https://static.vecteezy.com/system/resources/previews/004/141/669/non_2x/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg?camref=utrippin123",
  "landmark": "https://static.vecteezy.com/system/resources/previews/006/735/723/non_2x/travel-concept-illustration-free-vector.jpg?camref=utrippin123",
  "default": "https://static.vecteezy.com/system/resources/previews/005/337/799/non_2x/icon-image-not-found-free-vector.jpg?camref=utrippin123"
};

export const VecteezyOnlyImage = ({
  destination,
  description,
  tags = [],
  fallbackImage,
  className = '',
  alt,
  onClick
}: VecteezyOnlyImageProps) => {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchImage = async () => {
      setIsLoading(true);

      // Create cache key
      const cacheKey = `vecteezy_only_${destination.toLowerCase().replace(/\s+/g, '_')}`;
      const cached = localStorage.getItem(cacheKey);

      // Check cache first (24-hour expiry)
      if (cached) {
        try {
          const { url, timestamp } = JSON.parse(cached);
          if (Date.now() - timestamp < 24 * 60 * 60 * 1000) {
            setImageUrl(url);
            setIsLoading(false);
            return;
          }
        } catch (e) {
          localStorage.removeItem(cacheKey);
        }
      }

      try {
        // Create search query - combine destination with description and tags
        const searchTerms = [
          destination,
          description,
          ...tags
        ].filter(Boolean).join(' ');

        const { data, error } = await supabase.functions.invoke('vecteezy-images', {
          body: { query: searchTerms }
        });

        if (!error && data?.bestImage?.url) {
          setImageUrl(data.bestImage.url);
          
          // Cache the result
          localStorage.setItem(cacheKey, JSON.stringify({
            url: data.bestImage.url,
            timestamp: Date.now()
          }));
        } else {
          // Fallback to Vecteezy travel images only
          const vecteezyUrl = vecteezyFallbackPhotos[destination.toLowerCase()] || 
                             vecteezyFallbackPhotos["destination"];
          setImageUrl(vecteezyUrl);
        }
      } catch (error) {
        console.error('Error fetching Vecteezy image:', error);
        
        // Use Vecteezy fallback only
        const vecteezyUrl = vecteezyFallbackPhotos[destination.toLowerCase()] || 
                           vecteezyFallbackPhotos["default"];
        setImageUrl(vecteezyUrl);
      }

      setIsLoading(false);
    };

    if (destination) {
      fetchImage();
    }
  }, [destination, tags, description, fallbackImage]);

  if (isLoading) {
    return (
      <div className={`bg-muted animate-pulse flex items-center justify-center ${className}`}>
        <div className="text-muted-foreground text-sm">Loading...</div>
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt={alt || `Beautiful view of ${destination}`}
      className={`object-cover transition-opacity duration-300 ${className} ${onClick ? 'cursor-pointer hover:opacity-90' : ''}`}
      onClick={onClick}
      onError={(e) => {
        // If image fails to load, try Vecteezy generic fallback only
        const target = e.target as HTMLImageElement;
        const fallbackUrl = vecteezyFallbackPhotos["default"];
        if (target.src !== fallbackUrl) {
          target.src = fallbackUrl;
        }
      }}
      loading="lazy"
      title="Photo via Vecteezy"
    />
  );
};