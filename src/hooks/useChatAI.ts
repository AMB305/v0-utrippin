import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

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

  const getMockResponse = (message: string): Partial<ChatMessage> => {
    const lowerMessage = message.toLowerCase();
    
    // Hanoi flight/hotel search
    if (lowerMessage.includes('hanoi') || lowerMessage.includes('flight') || lowerMessage.includes('hotel')) {
      return {
        response: "I'll help you search for flights and hotels for your weekend trip to Hanoi. Let me check what's available for July 19-20.",
        tripCards: [
          {
            type: 'flight',
            title: '✈️ Flight results',
            description: 'Flights HAN → HAN\nHanoi, Vietnam → Hanoi, Vietnam\nRound-trip • 19 Jul - 20 Jul • 1 adult • Economy\n\n⚠️ Error\nUnknown error. Please try again.',
            price: 'Error',
            rating: 0
          },
          {
            type: 'hotel',
            title: '🏨 Hotel results',
            description: 'Stays in Hanoi\n19 Jul - 20 Jul • 1 room • 1 adult\n3622 matching stays\n\nFree Airport Service Deals w Singita Classy Boutique Hotel & Travel\n8.5 • 1,799 reviews • 4-star\nClean and comfortable hotel with friendly service and great location.',
            price: '604,997 ₫ per night',
            rating: 4.0
          }
        ],
        showMap: true,
        mapLocation: "Hanoi, Vietnam",
        quickReplies: [
          "filter for non-stop flights to Hanoi",
          "filter for flights departing in the morning to Hanoi", 
          "filter for flights returning in the evening from Hanoi",
          "Search for flights from HAN to HCM on Jul 19, returning on Jul 20, instead",
          "Search for hotels in Hanoi from Jul 19 to Jul 20"
        ]
      };
    }
    
    // Filter responses
    if (lowerMessage.includes('filter')) {
      return {
        response: "I'll apply those filters to your search results. Let me update the available options.",
        tripCards: [
          {
            type: 'flight',
            title: 'Updated Flight Results',
            description: 'Filtered results based on your preferences. Found 12 matching flights.',
            price: 'From $450',
            rating: 4.2
          }
        ],
        quickReplies: [
          "Show more flight options",
          "Add hotel search to these results",
          "Change departure time"
        ]
      };
    }
    
    // Europe travel
    if (lowerMessage.includes('europe')) {
      return {
        response: "Europe in spring is absolutely magical! I recommend visiting Paris, Rome, and Barcelona for a perfect cultural mix.",
        tripCards: [
          {
            type: 'flight',
            title: 'Multi-city Europe Trip',
            description: 'Round-trip flights to 3 European cities with flexible dates.',
            price: 'From $890',
            duration: '2 weeks'
          },
          {
            type: 'hotel',
            title: 'Boutique Hotels Package',
            description: 'Handpicked boutique hotels in city centers with breakfast included.',
            price: '$120/night avg',
            rating: 4.6
          }
        ],
        quickReplies: [
          "Show detailed itinerary",
          "Add more cities",
          "Budget travel options"
        ]
      };
    }
    
    // Default response
    return {
      response: "I'd be happy to help you plan your trip! Tell me more about your destination preferences, budget, and travel dates.",
      quickReplies: [
        "Show me popular destinations",
        "I need help with flights",
        "Find hotels for my trip",
        "Plan a weekend getaway"
      ]
    };
  };

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
      // Call the real AI travel chat edge function
      const { data, error } = await supabase.functions.invoke('ai-travel-chat', {
        body: { message, trips }
      });

      console.log('AI chat response data:', data);
      console.log('AI chat response error:', error);

      if (error) {
        console.error('AI chat error:', error);
        // Fallback to mock response on error
        const mockResponse = getMockResponse(message);
        setMessages(prev => prev.map(msg => 
          msg.id === messageId 
            ? {
                ...msg,
                loading: false,
                ...mockResponse
              }
            : msg
        ));
      } else if (data && data.response) {
        // Update message with AI response
        console.log('Updating message with response:', data.response);
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
      } else {
        console.error('No response data received:', data);
        // Fallback to mock response
        const mockResponse = getMockResponse(message);
        setMessages(prev => prev.map(msg => 
          msg.id === messageId 
            ? {
                ...msg,
                loading: false,
                ...mockResponse
              }
            : msg
        ));
      }
    } catch (error) {
      console.error('Error calling AI chat:', error);
      // Fallback to mock response on error
      const mockResponse = getMockResponse(message);
      setMessages(prev => prev.map(msg => 
        msg.id === messageId 
          ? {
              ...msg,
              loading: false,
              ...mockResponse
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