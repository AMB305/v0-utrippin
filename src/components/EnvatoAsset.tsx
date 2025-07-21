import React, { useState, useEffect } from 'react';

interface EnvatoAssetProps {
  query: string;
  category?: string;
  type?: 'image' | 'video';
  className?: string;
  alt?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  controls?: boolean;
  onClick?: (e?: React.MouseEvent) => void;
}

export const EnvatoAsset = ({
  query,
  category = 'general',
  type = 'image',
  className = '',
  alt,
  autoPlay = true,
  loop = true,
  muted = true,
  controls = false,
  onClick
}: EnvatoAssetProps) => {
  const [assetUrl, setAssetUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // For now, use fallback URLs based on query
    const getFallbackAsset = () => {
      if (type === 'video') {
        return '/videos/hero-nyc.mp4';
      } else {
        // Use different fallback images based on the query
        if (query.toLowerCase().includes('santorini')) {
          return 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800&h=600&fit=crop';
        } else if (query.toLowerCase().includes('safari') || query.toLowerCase().includes('africa')) {
          return 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800&h=600&fit=crop';
        } else if (query.toLowerCase().includes('alaska')) {
          return 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&h=600&fit=crop';
        } else if (query.toLowerCase().includes('new york') || query.toLowerCase().includes('nyc')) {
          return 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&h=600&fit=crop';
        } else if (query.toLowerCase().includes('bali')) {
          return 'https://images.unsplash.com/photo-1555400864-8377f58c77d4?w=800&h=600&fit=crop';
        } else {
          return 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=800&h=600&fit=crop';
        }
      }
    };

    setAssetUrl(getFallbackAsset());
    setIsLoading(false);
  }, [query, type]);

  if (isLoading) {
    return (
      <div className={`bg-gray-200 animate-pulse flex items-center justify-center ${className}`}>
        <div className="text-gray-500 text-sm">
          Loading {type === 'video' ? 'video' : 'image'}...
        </div>
      </div>
    );
  }

  if (type === 'video') {
    return (
      <video
        className={`object-cover transition-opacity duration-300 ${className} ${onClick ? 'cursor-pointer hover:opacity-90' : ''}`}
        src={assetUrl}
        autoPlay={autoPlay}
        loop={loop}
        muted={muted}
        controls={controls}
        playsInline
        onClick={onClick}
        onError={(e) => {
          console.error('Video failed to load, using fallback');
          const target = e.currentTarget;
          if (target.src !== '/videos/hero-nyc.mp4') {
            target.src = '/videos/hero-nyc.mp4';
          }
        }}
      >
        <source src={assetUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    );
  }

  return (
    <img
      src={assetUrl}
      alt={alt || `${query} - Premium ${category} imagery`}
      className={`object-cover transition-opacity duration-300 ${className} ${onClick ? 'cursor-pointer hover:opacity-90' : ''}`}
      onClick={onClick}
      onError={(e) => {
        const target = e.target as HTMLImageElement;
        const fallbackUrl = 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=800';
        if (target.src !== fallbackUrl) {
          target.src = fallbackUrl;
        }
      }}
      loading="lazy"
      title="Premium content via Envato Elements"
    />
  );
}; 