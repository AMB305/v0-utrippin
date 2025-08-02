import { useState, useCallback, useMemo } from 'react';

// Curated fallback images for different categories
const fallbackImages = {
  themepark: [
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop&crop=center&q=80",
    "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&h=400&fit=crop&crop=center&q=80",
    "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop&crop=center&q=80"
  ],
  nature: [
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop&crop=center&q=80",
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=400&fit=crop&crop=center&q=80",
    "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=600&h=400&fit=crop&crop=center&q=80"
  ],
  city: [
    "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600&h=400&fit=crop&crop=center&q=80",
    "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600&h=400&fit=crop&crop=center&q=80",
    "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=600&h=400&fit=crop&crop=center&q=80"
  ],
  adventure: [
    "https://images.unsplash.com/photo-1551632811-561732d1e306?w=600&h=400&fit=crop&crop=center&q=80",
    "https://images.unsplash.com/photo-1476209446441-5ad72f223207?w=600&h=400&fit=crop&crop=center&q=80",
    "https://images.unsplash.com/photo-1464822759844-d150baef493e?w=600&h=400&fit=crop&crop=center&q=80"
  ]
};

const detectCategory = (destination: string, description?: string): keyof typeof fallbackImages => {
  const text = `${destination} ${description || ''}`.toLowerCase();
  
  if (text.includes('disney') || text.includes('universal') || text.includes('theme') || text.includes('park')) {
    return 'themepark';
  }
  if (text.includes('hiking') || text.includes('rafting') || text.includes('climb') || text.includes('adventure')) {
    return 'adventure';
  }
  if (text.includes('national park') || text.includes('mountain') || text.includes('forest') || text.includes('canyon')) {
    return 'nature';
  }
  return 'city';
};

export const useSmartFallback = (destination: string, description?: string, fallbackImage?: string) => {
  const [imageLoadAttempts, setImageLoadAttempts] = useState(0);
  
  const category = useMemo(() => detectCategory(destination, description), [destination, description]);
  
  const getSmartFallback = useCallback(() => {
    // Use provided fallback first
    if (fallbackImage && imageLoadAttempts === 0) {
      return fallbackImage;
    }
    
    // Use category-based fallbacks with rotation
    const categoryImages = fallbackImages[category];
    const index = imageLoadAttempts % categoryImages.length;
    return categoryImages[index];
  }, [fallbackImage, category, imageLoadAttempts]);

  const nextFallback = useCallback(() => {
    setImageLoadAttempts(prev => prev + 1);
    return getSmartFallback();
  }, [getSmartFallback]);

  const resetFallback = useCallback(() => {
    setImageLoadAttempts(0);
  }, []);

  return {
    smartFallback: getSmartFallback(),
    nextFallback,
    resetFallback,
    hasMoreFallbacks: imageLoadAttempts < 3
  };
};
