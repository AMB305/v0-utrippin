import { useEffect } from "react";
import { SEOAnalytics } from "@/utils/seoAnalytics";

interface ScrollTrackingProps {
  pageName: string;
  children: React.ReactNode;
}

export const ScrollTracking = ({ pageName, children }: ScrollTrackingProps) => {
  useEffect(() => {
    const trackedDepths = new Set<number>();
    
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = Math.round((scrollTop / documentHeight) * 100);
      
      // Track at 25%, 50%, 75%, and 100% scroll depths
      const depths = [25, 50, 75, 100];
      
      for (const depth of depths) {
        if (scrollPercent >= depth && !trackedDepths.has(depth)) {
          trackedDepths.add(depth);
          SEOAnalytics.trackScrollDepth(pageName, depth as 25 | 50 | 75 | 100);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pageName]);

  return <>{children}</>;
};
