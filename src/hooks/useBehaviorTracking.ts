import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface TrackingEvent {
  type: 'search' | 'view' | 'click' | 'save' | 'share';
  data: Record<string, any>;
  pageUrl?: string;
}

export const useBehaviorTracking = () => {
  const { user } = useAuth();
  const sessionId = useRef<string>(`session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);

  const trackEvent = async (event: TrackingEvent) => {
    if (!user) return;

    try {
      console.log('Tracking behavior event:', event);
      
      const { error } = await supabase.rpc('track_user_behavior', {
        p_user_id: user.id,
        p_session_id: sessionId.current,
        p_event_type: event.type,
        p_event_data: event.data,
        p_page_url: event.pageUrl || window.location.pathname,
        p_ip_address: null, // Will be handled server-side if needed
        p_user_agent: navigator.userAgent
      });

      if (error) {
        console.error('Error tracking behavior:', error);
      }
    } catch (error) {
      console.error('Failed to track behavior:', error);
    }
  };

  // Auto-track page views
  useEffect(() => {
    if (!user) return;

    const trackPageView = () => {
      trackEvent({
        type: 'view',
        data: {
          page: window.location.pathname,
          referrer: document.referrer || 'direct',
          timestamp: new Date().toISOString()
        },
        pageUrl: window.location.pathname
      });
    };

    // Track initial page view
    trackPageView();

    // Track navigation changes (for SPAs)
    const handlePopState = () => trackPageView();
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [user]);

  // Convenience methods for common tracking events
  const trackSearch = (query: string, destination?: string, filters?: Record<string, any>) => {
    trackEvent({
      type: 'search',
      data: {
        query,
        destination,
        filters,
        timestamp: new Date().toISOString()
      }
    });
  };

  const trackDestinationView = (destination: string, country?: string, metadata?: Record<string, any>) => {
    trackEvent({
      type: 'view',
      data: {
        destination,
        country,
        ...metadata,
        timestamp: new Date().toISOString()
      }
    });
  };

  const trackTripSave = (tripData: Record<string, any>) => {
    trackEvent({
      type: 'save',
      data: {
        action: 'save_trip',
        ...tripData,
        timestamp: new Date().toISOString()
      }
    });
  };

  const trackTripShare = (tripData: Record<string, any>, shareMethod?: string) => {
    trackEvent({
      type: 'share',
      data: {
        action: 'share_trip',
        share_method: shareMethod,
        ...tripData,
        timestamp: new Date().toISOString()
      }
    });
  };

  const trackClick = (element: string, context?: Record<string, any>) => {
    trackEvent({
      type: 'click',
      data: {
        element,
        ...context,
        timestamp: new Date().toISOString()
      }
    });
  };

  return {
    trackEvent,
    trackSearch,
    trackDestinationView,
    trackTripSave,
    trackTripShare,
    trackClick
  };
};
