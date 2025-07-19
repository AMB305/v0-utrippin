import { useState, useEffect } from 'react';
import { sanitizeString } from '@/lib/validation';
import { useToast } from '@/hooks/use-toast';

interface SecurityMonitoringHook {
  validateUserInput: (data: any, schema: any) => Promise<boolean>;
  checkForSuspiciousActivity: () => void;
  isRateLimited: boolean;
  logSecurityEvent: (event: string, metadata?: any) => void;
}

export function useSecurityMonitoring(): SecurityMonitoringHook {
  const [isRateLimited, setIsRateLimited] = useState(false);
  const { toast } = useToast();

  const logSecurityEvent = (event: string, metadata: any = {}) => {
    // Log to console for now - in production this would go to a monitoring service
    console.warn('Security Event:', {
      event,
      metadata: {
        ...metadata,
        timestamp: new Date().toISOString(),
        user_agent: navigator.userAgent,
        url: window.location.href
      }
    });
  };

  const validateUserInput = async (data: any, schema: any): Promise<boolean> => {
    try {
      // Client-side validation
      const validated = schema.parse(data);
      
      // Additional sanitization
      if (typeof validated === 'object') {
        Object.keys(validated).forEach(key => {
          if (typeof validated[key] === 'string') {
            validated[key] = sanitizeString(validated[key]);
          }
        });
      }

      return true;
    } catch (error: any) {
      logSecurityEvent('validation_failed', {
        error: error.message,
        data_type: schema.constructor.name
      });

      toast({
        title: "Invalid data",
        description: "Please check your input and try again.",
        variant: "destructive",
      });

      return false;
    }
  };

  const checkForSuspiciousActivity = () => {
    // Basic client-side rate limiting
    const storageKey = 'security_events';
    const now = Date.now();
    const fiveMinutesAgo = now - 5 * 60 * 1000;

    try {
      const eventsJson = localStorage.getItem(storageKey);
      const events = eventsJson ? JSON.parse(eventsJson) : [];
      
      // Clean old events
      const recentEvents = events.filter((event: any) => event.timestamp > fiveMinutesAgo);
      
      // Rate limiting logic
      if (recentEvents.length > 50) {
        setIsRateLimited(true);
        logSecurityEvent('rate_limit_triggered', {
          event_count: recentEvents.length,
          time_window: '5_minutes'
        });

        toast({
          title: "Too many requests",
          description: "Please slow down and try again in a few minutes.",
          variant: "destructive",
        });

        // Reset rate limit after 5 minutes
        setTimeout(() => setIsRateLimited(false), 5 * 60 * 1000);
      }

      // Store cleaned events
      localStorage.setItem(storageKey, JSON.stringify(recentEvents));

    } catch (error) {
      console.error('Error in suspicious activity check:', error);
    }
  };

  useEffect(() => {
    // Run security check on component mount
    checkForSuspiciousActivity();

    // Set up periodic security checks
    const interval = setInterval(checkForSuspiciousActivity, 60000); // Every minute

    return () => clearInterval(interval);
  }, []);

  return {
    validateUserInput,
    checkForSuspiciousActivity,
    isRateLimited,
    logSecurityEvent
  };
}