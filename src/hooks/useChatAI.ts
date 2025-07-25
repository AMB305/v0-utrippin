import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface DetailedItinerary {
  title: string;
  summary: string;
  dates?: { start: string; end: string };
  traveler_count?: number;
  rooms?: number;
  images?: string[];
  recommendations: Array<{
    category_name: string;
    places: Array<{
      name: string;
      description: string;
      type: string;
      image_url?: string;
      location?: string;
      rating?: number;
      price_range?: string;
      estimated_cost?: string;
      booking_url?: string;
    }>;
  }>;
  actionable_suggestions: string[];
  follow_up_questions: string[];
  culture_adapter?: {
    tipping_etiquette?: string;
    dining_customs?: string;
    public_behavior?: string;
    language_tips?: string;
    beach_etiquette?: string;
  };
  insights?: {
    transportation?: string;
    freeThings?: string;
    walkability?: string;
    kidsActivities?: string;
    malls?: string;
    safety?: string;
    bestLocalFoods?: string;
    bestLocalActivities?: string;
    nightlife?: string;
    gyms?: string;
  };
  cost_breakdown?: {
    daily_estimates?: Array<{
      day: number;
      transport?: string;
      food?: string;
      activities?: string;
      accommodation?: string;
    }>;
    total_estimated?: string;
  };
}

interface ChatMessage {
  id: string;
  question: string;
  response?: string;
  loading?: boolean;
  showMap?: boolean;
  mapLocation?: string;
  tripCards?: Array<{
    type: 'hotel' | 'flight' | 'activity';
    title: string;
    description: string;
    price?: string;
    rating?: number;
    duration?: string;
    bookingUrl?: string;
  }>;
  quickReplies?: string[];
  recommendations?: {
    flights: string;
    hotels: string;
  };
  trips?: Array<{
    id: string;
    name: string;
    summary: string;
    enhanced_flights_url: string;
    enhanced_hotels_url: string;
    reason: string;
  }>;
  callsToAction?: Array<{
    text: string;
    action: string;
  }>;
  detailedItinerary?: DetailedItinerary;
  isDetailedItinerary?: boolean;
}

interface Trip {
  id: string;
  name: string;
  summary: string;
  start_date: string;
  end_date: string;
  enhanced_flights_url: string;
  enhanced_hotels_url: string;
  event_name: string;
  event_date: string;
}

// Generate a unique session ID for this chat session
const generateSessionId = () => {
  return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};

export const useChatAI = (trips: Trip[]) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(() => generateSessionId());

  const sendMessage = async (message: string) => {
    const messageId = Date.now().toString();
    
    // Add user message with loading state
    setMessages(prev => [...prev, {
      id: messageId,
      question: message,
      loading: true
    }]);
    
    setLoading(true);

    try {
      // Call the AI travel chat edge function with session ID
      const { data, error } = await supabase.functions.invoke('ai-travel-chat', {
        body: { 
          message, 
          trips,
          sessionId // Include session ID for context management
        }
      });

      console.log('AI chat response data:', data);
      console.log('AI chat response error:', error);

      if (error) {
        console.error('AI chat error:', error);
        throw error;
      }

      if (data && (data.response || data.isDetailedItinerary)) {
        // Handle detailed itinerary responses with exact schema
        if (data.isDetailedItinerary && data.detailedItinerary) {
          setMessages(prev => prev.map(msg => 
            msg.id === messageId 
              ? {
                  ...msg,
                  loading: false,
                  response: data.response,
                  detailedItinerary: data.detailedItinerary,
                  isDetailedItinerary: true,
                  showMap: data.showMap || true,
                  mapLocation: data.mapLocation,
                  quickReplies: data.quickReplies || data.detailedItinerary.follow_up_questions || [],
                  callsToAction: data.callsToAction || [
                    { text: "Book Flights", action: "book_flights" },
                    { text: "Find Hotels", action: "book_hotels" }
                  ]
                }
              : msg
          ));
        } else {
          // Handle regular responses
          setMessages(prev => prev.map(msg => 
            msg.id === messageId 
              ? {
                  ...msg,
                  loading: false,
                  response: data.response,
                  showMap: data.showMap,
                  mapLocation: data.mapLocation,
                  tripCards: data.tripCards || [],
                  quickReplies: data.quickReplies || [],
                  recommendations: data.recommendations,
                  trips: data.trips || [],
                  callsToAction: data.callsToAction || []
                }
              : msg
          ));
        }
      } else {
        throw new Error('No response data received');
      }
    } catch (error) {
      console.error('Error calling AI chat:', error);
      
      // Fallback response
      setMessages(prev => prev.map(msg => 
        msg.id === messageId 
          ? {
              ...msg,
              loading: false,
              response: "I'm having trouble processing your request right now. Please try again in a moment.",
              quickReplies: [
                "Try again",
                "Search for popular destinations",
                "Get help"
              ]
            }
          : msg
      ));
    }
    
    setLoading(false);
  };

  const clearChat = () => {
    setMessages([]);
    // When clearing chat, we maintain the same session ID but could reset context in the future
  };

  return { 
    messages, 
    sendMessage, 
    clearChat, 
    loading,
    sessionId // Expose session ID for debugging/tracking if needed
  };
};