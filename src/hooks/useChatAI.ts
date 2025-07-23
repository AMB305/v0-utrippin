
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface DetailedItinerary {
  title: string;
  summary: string;
  recommendations: Array<{
    category_name: string;
    places: Array<{
      name: string;
      description: string;
      type: string;
    }>;
  }>;
  actionable_suggestions: string[];
  follow_up_questions: string[];
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

export const useChatAI = (trips: Trip[]) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);

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
      // Call the AI travel chat edge function
      const { data, error } = await supabase.functions.invoke('ai-travel-chat', {
        body: { message, trips }
      });

      console.log('AI chat response data:', data);
      console.log('AI chat response error:', error);

      if (error) {
        console.error('AI chat error:', error);
        throw error;
      }

      if (data && data.response) {
        // Update message with AI response
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
                callsToAction: data.callsToAction || [],
                detailedItinerary: data.detailedItinerary
              }
            : msg
        ));
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
  };

  return {
    messages,
    sendMessage,
    clearChat,
    loading
  };
};
