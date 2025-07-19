import React, { useState, useEffect } from 'react';
import { ImageService } from '@/utils/ImageService';

interface VecteezyImageProps {
  destination: string;
  description?: string;
  tags?: string[];
  fallbackImage?: string;
  className?: string;
  alt?: string;
  onClick?: (e?: React.MouseEvent) => void;
}

export const VecteezyImage = ({
  destination,
  description,
  tags = [],
  fallbackImage,
  className = '',
  alt,
  onClick
}: VecteezyImageProps) => {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDestinationImage = async () => {
      setIsLoading(true);

      try {
        // Create a more specific search query combining destination, description, and tags
        const searchTerms = [
          destination,
          description,
          ...tags
        ].filter(Boolean).join(' ');

        console.log('Fetching image for:', searchTerms);

        // Use the new unified image search service
        const imageUrl = await ImageService.getImage(searchTerms, 'travel');
        setImageUrl(imageUrl);

      } catch (error) {
        console.error('Error loading destination image:', error);
        // Use fallback image on error
        const defaultFallback = fallbackImage || `data:image/svg+xml,%3Csvg width='800' height='600' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3ClinearGradient id='grad' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%236366F1;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%237C3AED;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23grad)' /%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='48' fill='white' text-anchor='middle' dy='.3em'%3E🏖️%3C/text%3E%3C/svg%3E`;
        setImageUrl(defaultFallback);
      } finally {
        setIsLoading(false);
      }
    };

    if (destination) {
      fetchDestinationImage();
    }
  }, [destination, description, tags, fallbackImage]);

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
        // If image fails to load, use a colorful gradient fallback
        const target = e.target as HTMLImageElement;
        const fallbackUrl = `data:image/svg+xml,%3Csvg width='800' height='600' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3ClinearGradient id='grad' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23F97316;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%23DC2626;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23grad)' /%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='48' fill='white' text-anchor='middle' dy='.3em'%3E✈️%3C/text%3E%3C/svg%3E`;
        if (target.src !== fallbackUrl) {
          target.src = fallbackUrl;
        }
      }}
      title="Beautiful travel photography"
    />
  );
};