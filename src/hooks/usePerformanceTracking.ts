import { useEffect, useState } from "react";

interface PerformanceMetrics {
  lcp?: number;
  fid?: number;
  cls?: number;
  ttfb?: number;
}

interface UsePerformanceTrackingOptions {
  pageName: string;
  trackCoreWebVitals?: boolean;
}

export const usePerformanceTracking = ({ 
  pageName, 
  trackCoreWebVitals = true 
}: UsePerformanceTrackingOptions) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({});

  useEffect(() => {
    // Temporarily disabled for Lovable environment compatibility
    return;
    
    if (!trackCoreWebVitals) return;
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'navigation') {
          const navEntry = entry as PerformanceNavigationTiming;
          const ttfb = navEntry.responseStart - navEntry.requestStart;
          
          setMetrics(prev => ({ ...prev, ttfb }));
          
          // Import SEOAnalytics dynamically to avoid issues
          import('@/utils/seoAnalytics').then(({ SEOAnalytics }) => {
            SEOAnalytics.trackPagePerformance(pageName, { ttfb });
          });
        }
      }
    });

    observer.observe({ entryTypes: ['navigation'] });

    // Track Largest Contentful Paint (LCP)
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      const lcp = lastEntry.startTime;
      
      setMetrics(prev => ({ ...prev, lcp }));
      
      import('@/utils/seoAnalytics').then(({ SEOAnalytics }) => {
        SEOAnalytics.trackPagePerformance(pageName, { lcp });
      });
    });

    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

    // Track Cumulative Layout Shift (CLS)
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!(entry as any).hadRecentInput) {
          clsValue += (entry as any).value;
        }
      }
      
      setMetrics(prev => ({ ...prev, cls: clsValue }));
      
      import('@/utils/seoAnalytics').then(({ SEOAnalytics }) => {
        SEOAnalytics.trackPagePerformance(pageName, { cls: clsValue });
      });
    });

    clsObserver.observe({ entryTypes: ['layout-shift'] });

    return () => {
      observer.disconnect();
      lcpObserver.disconnect();
      clsObserver.disconnect();
    };
  }, [pageName, trackCoreWebVitals]);

  return metrics;
};