import { useState, useCallback, useRef } from 'react';

interface QueueItem {
  id: string;
  request: () => Promise<any>;
  resolve: (value: any) => void;
  reject: (error: any) => void;
  priority: number;
}

const MAX_CONCURRENT_REQUESTS = 3;
const REQUEST_DELAY = 200; // ms between requests

export const useRequestQueue = () => {
  const [activeRequests, setActiveRequests] = useState(0);
  const queueRef = useRef<QueueItem[]>([]);
  const processingRef = useRef(false);

  const processQueue = useCallback(async () => {
    if (processingRef.current || activeRequests >= MAX_CONCURRENT_REQUESTS) {
      return;
    }

    processingRef.current = true;

    while (queueRef.current.length > 0 && activeRequests < MAX_CONCURRENT_REQUESTS) {
      // Sort by priority (higher number = higher priority)
      queueRef.current.sort((a, b) => b.priority - a.priority);
      
      const item = queueRef.current.shift();
      if (!item) break;

      setActiveRequests(prev => prev + 1);

      try {
        const result = await item.request();
        item.resolve(result);
      } catch (error) {
        item.reject(error);
      } finally {
        setActiveRequests(prev => prev - 1);
        
        // Add delay between requests to prevent rate limiting
        if (queueRef.current.length > 0) {
          await new Promise(resolve => setTimeout(resolve, REQUEST_DELAY));
        }
      }
    }

    processingRef.current = false;

    // Continue processing if there are more items
    if (queueRef.current.length > 0) {
      setTimeout(processQueue, REQUEST_DELAY);
    }
  }, [activeRequests]);

  const addToQueue = useCallback(
    (request: () => Promise<any>, priority: number = 1): Promise<any> => {
      return new Promise((resolve, reject) => {
        const id = Math.random().toString(36).substr(2, 9);
        queueRef.current.push({
          id,
          request,
          resolve,
          reject,
          priority
        });

        processQueue();
      });
    },
    [processQueue]
  );

  return { addToQueue, queueLength: queueRef.current.length, activeRequests };
};
