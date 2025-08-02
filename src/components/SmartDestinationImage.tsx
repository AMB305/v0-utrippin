import React, { useState, useEffect } from 'react';
import { ImageService } from '@/utils/ImageService';

interface SmartDestinationImageProps {
  destination: string;
  description?: string;
  tags?: string[];
  category?: 'places' | 'travel' | 'event' | 'people';
  fallbackImage?: string;
  className?: string;
  alt?: string;
  onClick?: (e?: React.MouseEvent) => void;
}

export const SmartDestinationImage = ({
  destination,
  description,
  tags = [],
  category = 'travel',
  fallbackImage,
  className = '',
  alt,
  onClick
}: SmartDestinationImageProps) => {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchImage = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Create search query from all available terms
        const searchTerms = [
          destination,
          description,
          ...tags
        ].filter(Boolean).join(' ');

        console.log('Fetching image for:', searchTerms);

        // Use the new unified image search service
        const imageUrl = await ImageService.getImage(searchTerms, category);
        setImageUrl(imageUrl);

      } catch (err) {
        console.error('Error fetching image:', err);
        setError(err instanceof Error ? err.message : 'Failed to load image');
        
        // Generate category-appropriate fallback
        const getFallbackEmoji = () => {
          switch (category) {
            case 'places': return '🏛️';
            case 'travel': return '✈️';
            case 'event': return '🎉';
            case 'people': return '👥';
            default: return '🌍';
          }
        };

        const defaultFallback = fallbackImage || 
          `data:image/svg+xml,%3Csvg width='800' height='600' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3ClinearGradient id='grad' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%233B82F6;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%232563EB;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23grad)' /%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='48' fill='white' text-anchor='middle' dy='.3em'%3E${getFallbackEmoji()}%3C/text%3E%3C/svg%3E`;
        
        setImageUrl(defaultFallback);
      } finally {
        setIsLoading(false);
      }
    };

    if (destination) {
      fetchImage();
    }
  }, [destination, description, tags, category, fallbackImage]);

  if (isLoading) {
    return (
      <div className={`bg-muted animate-pulse flex items-center justify-center ${className}`}>
        <div className="text-muted-foreground text-sm">Loading image...</div>
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt={alt || `${description || 'Beautiful view'} of ${destination}`}
      className={`object-cover transition-opacity duration-300 ${className} ${onClick ? 'cursor-pointer hover:opacity-90' : ''}`}
      onClick={onClick}
      onError={(e) => {
        const target = e.target as HTMLImageElement;
        const errorFallback = `data:image/svg+xml,%3Csvg width='800' height='600' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3ClinearGradient id='grad' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23F97316;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%23DC2626;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23grad)' /%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='48' fill='white' text-anchor='middle' dy='.3em'%3E🖼️%3C/text%3E%3C/svg%3E`;
        if (target.src !== errorFallback) {
          target.src = errorFallback;
        }
      }}
      title={`${destination} - ${description || 'Travel photography'}`}
    />
  );
};
