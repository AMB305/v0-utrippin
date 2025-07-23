
import React, { useEffect, useRef } from "react";
import { MapPin } from "lucide-react";
import { TypingIndicator } from "./TypingIndicator";
import { EnhancedMapComponent } from "./EnhancedMapComponent";
import { TripSummaryCard } from "./TripSummaryCard";
import { QuickReplyButtons } from "./QuickReplyButtons";
import { DetailedItineraryDisplay } from "./DetailedItineraryDisplay";

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
  detailedItinerary?: DetailedItinerary;
}

interface ChatInterfaceProps {
  onSendMessage: (message: string) => void;
  messages: ChatMessage[];
  loading?: boolean;
  tripName?: string;
}

const dummyMessages: ChatMessage[] = [
  {
    id: "1",
    question: "Search for a flight to Hanoi for 1 person for the upcoming weekend. Also search for a hotel in Hanoi for the same dates.",
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
  },
  {
    id: "2",
    question: "Can you help me plan a trip to the Philippines?",
    response: "I'd be happy to help you plan your Philippines adventure! The Philippines offers incredible diversity - from pristine beaches in Palawan to vibrant culture in Manila. What type of experience are you looking for?",
    quickReplies: ["Beach destinations", "Cultural experiences", "Adventure activities", "Food tours"]
  },
  {
    id: "3",
    question: "I'm interested in beach destinations and some cultural experiences",
    response: "Perfect choice! I recommend combining Boracay or Palawan for stunning beaches with Manila or Cebu for rich cultural experiences. Here are some top recommendations:",
    showMap: true,
    mapLocation: "Boracay, Philippines",
    tripCards: [
      {
        type: 'hotel',
        title: 'Shangri-La Boracay',
        description: 'Luxury beachfront resort with world-class amenities and pristine white sand beach access.',
        price: '$320/night',
        rating: 4.8
      },
      {
        type: 'flight',
        title: 'Manila to Boracay',
        description: 'Direct flight with Philippine Airlines, includes baggage and meals.',
        price: '$180',
        duration: '1h 25m'
      },
      {
        type: 'activity',
        title: 'Island Hopping Tour',
        description: 'Visit Crystal Cove, Tambisaan Beach, and Crocodile Island with local guide.',
        price: '$65',
        duration: '6 hours'
      }
    ]
  }
];

// Utility function to get coordinates for locations
const getLocationCoordinates = (location: string): [number, number] => {
  const coordinates: Record<string, [number, number]> = {
    'hanoi, vietnam': [105.8342, 21.0285],
    'boracay, philippines': [121.9240, 11.9674],
    'manila, philippines': [120.9842, 14.5995],
    'cebu, philippines': [123.8854, 10.3157],
    'palawan, philippines': [118.7384, 9.8349],
    'bohol, philippines': [124.1139, 9.8349],
    'davao, philippines': [125.6081, 7.1907],
    'iloilo, philippines': [122.5621, 10.7202],
    'bangkok, thailand': [100.5018, 13.7563],
    'tokyo, japan': [139.6917, 35.6895],
    'singapore': [103.8198, 1.3521],
    'kuala lumpur, malaysia': [101.6869, 3.1390],
    'ho chi minh city, vietnam': [106.6297, 10.8231],
    'phnom penh, cambodia': [104.9160, 11.5564],
    'yangon, myanmar': [96.1951, 16.8661],
    'vientiane, laos': [102.6331, 17.9757],
    'jakarta, indonesia': [106.8451, -6.2088],
    'bali, indonesia': [115.0920, -8.4095],
  };
  
  const key = location.toLowerCase();
  return coordinates[key] || [120.9842, 14.5995]; // Default to Manila
};

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  onSendMessage, 
  messages: propMessages = [], 
  loading = false,
  tripName = "Philippines Adventure"
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Show dummy messages only when there are no real messages AND no loading state
  const messages = (propMessages.length > 0 || loading) ? propMessages : dummyMessages;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleQuickReply = (suggestion: string) => {
    onSendMessage(suggestion);
  };

  return (
    <div className="px-6 py-6 space-y-6 max-w-4xl mx-auto">
      {messages.map((message) => (
        <div key={message.id} className="space-y-4">
          {/* User Message */}
          <div className="flex justify-end">
            <div className="bg-blue-600 text-white px-6 py-4 rounded-3xl max-w-md shadow-lg">
              <p className="text-sm leading-relaxed">{message.question}</p>
            </div>
          </div>
          
          {/* AI Response */}
          <div className="flex justify-start">
            <div className="bg-slate-800/60 backdrop-blur-sm text-white px-6 py-4 rounded-3xl max-w-2xl shadow-lg border border-slate-700/50">
              {message.loading ? (
                <TypingIndicator />
              ) : (
                <div className="space-y-4">
                  {/* Detailed Itinerary Display */}
                  {message.detailedItinerary ? (
                    <DetailedItineraryDisplay itinerary={message.detailedItinerary} />
                  ) : (
                    message.response && (
                      <p className="text-sm leading-relaxed text-slate-200">{message.response}</p>
                    )
                  )}
                  
                  {/* Map Integration */}
                  {message.showMap && (
                    <div className="mt-4">
                      <div className="flex items-center gap-2 mb-3">
                        <MapPin className="h-4 w-4 text-blue-400" />
                        <span className="text-xs text-slate-400 font-medium">
                          {message.mapLocation || "Location"}
                        </span>
                      </div>
                      <EnhancedMapComponent 
                        locations={[{
                          id: '1',
                          name: message.mapLocation || 'Location',
                          coordinates: getLocationCoordinates(message.mapLocation || ''),
                          type: 'destination'
                        }]}
                        showRoute={false}
                        className="h-48"
                      />
                    </div>
                  )}
                  
                  {/* Trip Summary Cards */}
                  {message.tripCards && message.tripCards.length > 0 && (
                    <div className="space-y-3 mt-4">
                      {message.tripCards.map((card, index) => (
                        <TripSummaryCard
                          key={index}
                          type={card.type}
                          title={card.title}
                          description={card.description}
                          price={card.price}
                          rating={card.rating}
                          duration={card.duration}
                        />
                      ))}
                    </div>
                  )}
                  
                  {/* Quick Reply Buttons */}
                  {message.quickReplies && (
                    <QuickReplyButtons
                      suggestions={message.quickReplies}
                      onSelect={handleQuickReply}
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
      
      {/* Typing Indicator */}
      {loading && (
        <div className="flex justify-start">
          <div className="bg-slate-800/60 backdrop-blur-sm text-white px-6 py-4 rounded-3xl shadow-lg border border-slate-700/50">
            <TypingIndicator />
          </div>
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
};
