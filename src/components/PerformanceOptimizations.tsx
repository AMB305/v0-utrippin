import React, { lazy, Suspense, useEffect, useState, useCallback } from 'react';
import { SearchLoadingSpinner } from '@/components/LoadingStates';

// Image optimization with lazy loading and fallbacks
interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  fallbackSrc?: string;
  loading?: 'lazy' | 'eager';
}

export const OptimizedImage = ({
  src,
  alt,
  className = "",
  width,
  height,
  fallbackSrc = "/placeholder.svg",
  loading = "lazy"
}: OptimizedImageProps) => {
  const [imageSrc, setImageSrc] = useState(src);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => setIsLoaded(true);
  const handleError = () => {
    setHasError(true);
    setImageSrc(fallbackSrc);
  };

  return (
    <div className={`relative ${className}`}>
      <img
        src={imageSrc}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        onLoad={handleLoad}
        onError={handleError}
        className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'} ${className}`}
      />
      {!isLoaded && (
        <div className="absolute inset-0 bg-muted animate-pulse rounded" />
      )}
    </div>
  );
};

// Intersection Observer Hook for lazy loading
export const useIntersectionObserver = (
  elementRef: React.RefObject<Element>,
  options: IntersectionObserverInit = {}
) => {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsIntersecting(entry.isIntersecting),
      options
    );

    observer.observe(element);
    return () => observer.unobserve(element);
  }, [elementRef, options]);

  return isIntersecting;
};

// Lazy loading wrapper for heavy components
export const LazyWrapper = ({ 
  children, 
  fallback = <SearchLoadingSpinner />, 
  threshold = 0.1 
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  threshold?: number;
}) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const isVisible = useIntersectionObserver(ref, { threshold });
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShouldRender(true);
    }
  }, [isVisible]);

  return (
    <div ref={ref}>
      {shouldRender ? children : fallback}
    </div>
  );
};

// Debounced search hook
export const useDebouncedSearch = (
  searchFunction: (query: string) => void,
  delay: number = 300
) => {
  const [searchTerm, setSearchTerm] = useState('');

  const debouncedSearch = useCallback(
    (query: string) => {
      const timeoutId = setTimeout(() => {
        if (query.trim()) {
          searchFunction(query);
        }
      }, delay);

      return () => clearTimeout(timeoutId);
    },
    [searchFunction, delay]
  );

  useEffect(() => {
    const cleanup = debouncedSearch(searchTerm);
    return cleanup;
  }, [searchTerm, debouncedSearch]);

  return { searchTerm, setSearchTerm };
};

// Virtual scrolling for large lists
export const VirtualList = ({ 
  items, 
  itemHeight, 
  containerHeight, 
  renderItem 
}: {
  items: any[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: any, index: number) => React.ReactNode;
}) => {
  const [scrollTop, setScrollTop] = useState(0);
  
  const visibleStart = Math.floor(scrollTop / itemHeight);
  const visibleEnd = Math.min(
    visibleStart + Math.ceil(containerHeight / itemHeight) + 1,
    items.length
  );

  const totalHeight = items.length * itemHeight;
  const offsetY = visibleStart * itemHeight;

  return (
    <div
      style={{ height: containerHeight, overflow: 'auto' }}
      onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {items.slice(visibleStart, visibleEnd).map((item, index) =>
            renderItem(item, visibleStart + index)
          )}
        </div>
      </div>
    </div>
  );
};

// Progressive loading component
export const ProgressiveLoader = ({ 
  children, 
  priority = 'low',
  timeout = 5000 
}: {
  children: React.ReactNode;
  priority?: 'high' | 'medium' | 'low';
  timeout?: number;
}) => {
  const [shouldLoad, setShouldLoad] = useState(priority === 'high');

  useEffect(() => {
    if (priority === 'high') return;

    const loadTimeout = setTimeout(() => {
      setShouldLoad(true);
    }, priority === 'medium' ? 1000 : 2000);

    const forceLoadTimeout = setTimeout(() => {
      setShouldLoad(true);
    }, timeout);

    return () => {
      clearTimeout(loadTimeout);
      clearTimeout(forceLoadTimeout);
    };
  }, [priority, timeout]);

  return shouldLoad ? <>{children}</> : <SearchLoadingSpinner />;
};
