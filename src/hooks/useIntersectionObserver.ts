import { useEffect, useRef, useState } from 'react';

interface UseIntersectionObserverOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

export const useIntersectionObserver = (
  options: UseIntersectionObserverOptions = {}
) => {
  const { threshold = 0.1, rootMargin = '200px', triggerOnce = true } = options;
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element || !element.isConnected) return;
    if (triggerOnce && hasTriggered) return;

    try {
      const observer = new IntersectionObserver(
        ([entry]) => {
          const isVisible = entry.isIntersecting;
          setIsIntersecting(isVisible);
          
          if (isVisible && triggerOnce) {
            setHasTriggered(true);
          }
        },
        { threshold, rootMargin }
      );

      if (element.isConnected) {
        observer.observe(element);
      }

      return () => {
        try {
          if (element.isConnected) {
            observer.unobserve(element);
          }
          observer.disconnect();
        } catch (error) {
          console.warn('Observer cleanup failed:', error);
        }
      };
    } catch (error) {
      console.warn('IntersectionObserver failed:', error);
      return () => {};
    }
  }, [threshold, rootMargin, triggerOnce, hasTriggered]);

  return { elementRef, isIntersecting: triggerOnce ? hasTriggered : isIntersecting };
};