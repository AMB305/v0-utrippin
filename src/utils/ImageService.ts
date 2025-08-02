import { supabase } from '@/integrations/supabase/client';

export interface ImageResult {
  id: string;
  url: string;
  thumbnail: string;
  alt: string;
  source: string;
  width?: number;
  height?: number;
}

export interface ImageSearchResponse {
  images: ImageResult[];
  source: string;
  total: number;
  cached?: number;
  fresh?: number;
  error?: string;
  message?: string;
}

export class ImageService {
  private static cache = new Map<string, ImageSearchResponse>();
  private static cacheExpiry = new Map<string, number>();
  private static readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  /**
   * Search for images with automatic fallback and caching
   */
  static async searchImages(
    query: string, 
    category: string = 'general', 
    limit: number = 20
  ): Promise<ImageSearchResponse> {
    const cacheKey = `${query}-${category}-${limit}`;
    
    // Check local cache first
    if (this.cache.has(cacheKey)) {
      const expiry = this.cacheExpiry.get(cacheKey) || 0;
      if (Date.now() < expiry) {
        console.log(`📄 Returning cached images for: ${query}`);
        return this.cache.get(cacheKey)!;
      }
    }

    try {
      console.log(`🔍 Searching images for: "${query}" (category: ${category})`);
      
      const { data, error } = await supabase.functions.invoke('unified-image-search', {
        body: { query, category, limit }
      });

      if (error) {
        console.error('Image search error:', error);
        throw error;
      }

      const response: ImageSearchResponse = data;
      
      // Cache the response
      this.cache.set(cacheKey, response);
      this.cacheExpiry.set(cacheKey, Date.now() + this.CACHE_DURATION);
      
      console.log(`✅ Found ${response.images.length} images from ${response.source} source`);
      
      if (response.cached && response.fresh) {
        console.log(`📊 Cache stats: ${response.cached} cached, ${response.fresh} fresh`);
      }

      return response;
      
    } catch (error) {
      console.error('Failed to search images:', error);
      
      // Return placeholder images as fallback
      return {
        images: this.getPlaceholderImages(query, limit),
        source: 'placeholder',
        total: Math.min(limit, 3),
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Get placeholder images when all else fails
   */
  private static getPlaceholderImages(query: string, limit: number): ImageResult[] {
    const placeholders = [
      {
        id: 'placeholder-1',
        url: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=800&h=600&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=300&h=200&fit=crop',
        alt: `${query} - Professional workspace`,
        source: 'placeholder',
        width: 800,
        height: 600
      },
      {
        id: 'placeholder-2',
        url: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&h=600&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=300&h=200&fit=crop',
        alt: `${query} - Technology workspace`,
        source: 'placeholder',
        width: 800,
        height: 600
      },
      {
        id: 'placeholder-3',
        url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=600&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=300&h=200&fit=crop',
        alt: `${query} - Modern technology`,
        source: 'placeholder',
        width: 800,
        height: 600
      },
      {
        id: 'placeholder-4',
        url: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=300&h=200&fit=crop',
        alt: `${query} - Programming`,
        source: 'placeholder',
        width: 800,
        height: 600
      },
      {
        id: 'placeholder-5',
        url: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=600&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=300&h=200&fit=crop',
        alt: `${query} - MacBook workspace`,
        source: 'placeholder',
        width: 800,
        height: 600
      }
    ];

    return placeholders.slice(0, Math.min(limit, placeholders.length));
  }

  /**
   * Get a single image URL for simple use cases
   */
  static async getImage(
    query: string, 
    category: string = 'general'
  ): Promise<string> {
    try {
      const response = await this.searchImages(query, category, 1);
      if (response.images.length > 0) {
        return response.images[0].url;
      }
      
      // Return placeholder if no images found
      const placeholders = this.getPlaceholderImages(query, 1);
      return placeholders[0]?.url || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop';
    } catch (error) {
      console.error('Error getting single image:', error);
      return 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop';
    }
  }

  /**
   * Clear local cache
   */
  static clearCache(): void {
    this.cache.clear();
    this.cacheExpiry.clear();
    console.log('🗑️ Image cache cleared');
  }

  /**
   * Get cache statistics
   */
  static getCacheStats() {
    const now = Date.now();
    const validEntries = Array.from(this.cacheExpiry.entries())
      .filter(([_, expiry]) => now < expiry);
    
    return {
      totalEntries: this.cache.size,
      validEntries: validEntries.length,
      expiredEntries: this.cache.size - validEntries.length
    };
  }

  /**
   * Search for destination-specific images
   */
  static async searchDestinationImages(
    destination: string, 
    limit: number = 12
  ): Promise<ImageSearchResponse> {
    const enhancedQuery = `${destination} travel destination scenic view`;
    return this.searchImages(enhancedQuery, 'travel', limit);
  }

  /**
   * Search for event-specific images
   */
  static async searchEventImages(
    eventName: string, 
    location: string = '', 
    limit: number = 8
  ): Promise<ImageSearchResponse> {
    const enhancedQuery = `${eventName} ${location} event celebration gathering`.trim();
    return this.searchImages(enhancedQuery, 'event', limit);
  }

  /**
   * Search for food-related images
   */
  static async searchFoodImages(
    cuisine: string, 
    limit: number = 15
  ): Promise<ImageSearchResponse> {
    const enhancedQuery = `${cuisine} food cuisine restaurant delicious`;
    return this.searchImages(enhancedQuery, 'food', limit);
  }
}
