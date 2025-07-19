import { useState, useEffect, useCallback } from 'react';

interface CacheItem {
  url: string;
  timestamp: number;
  expiresAt: number;
}

const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours
const CACHE_VERSION = '2.0'; // Increased version for better caching

class ImageCacheManager {
  private cache = new Map<string, CacheItem>();
  private storageKey = `serpapi_image_cache_v${CACHE_VERSION}`;

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const data = JSON.parse(stored);
        Object.entries(data).forEach(([key, value]) => {
          this.cache.set(key, value as CacheItem);
        });
        this.cleanExpired();
      }
    } catch (error) {
      console.warn('Failed to load image cache:', error);
    }
  }

  private saveToStorage() {
    try {
      const data = Object.fromEntries(this.cache);
      localStorage.setItem(this.storageKey, JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to save image cache:', error);
    }
  }

  private cleanExpired() {
    const now = Date.now();
    for (const [key, value] of this.cache.entries()) {
      if (value.expiresAt < now) {
        this.cache.delete(key);
      }
    }
    this.saveToStorage();
  }

  get(key: string): string | null {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (item.expiresAt < Date.now()) {
      this.cache.delete(key);
      this.saveToStorage();
      return null;
    }
    
    return item.url;
  }

  set(key: string, url: string) {
    const item: CacheItem = {
      url,
      timestamp: Date.now(),
      expiresAt: Date.now() + CACHE_DURATION
    };
    this.cache.set(key, item);
    this.saveToStorage();
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }
}

const cacheManager = new ImageCacheManager();

export const useImageCache = () => {
  const getCachedImage = useCallback((key: string) => {
    return cacheManager.get(key);
  }, []);

  const setCachedImage = useCallback((key: string, url: string) => {
    cacheManager.set(key, url);
  }, []);

  const hasCachedImage = useCallback((key: string) => {
    return cacheManager.has(key);
  }, []);

  return { getCachedImage, setCachedImage, hasCachedImage };
};