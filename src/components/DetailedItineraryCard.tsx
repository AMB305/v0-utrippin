import React from 'react';
import { DetailedItineraryDisplay } from '@/components/DetailedItineraryDisplay';
import { Card } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

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

interface DetailedItineraryCardProps {
  itinerary?: DetailedItinerary;
  isLoading?: boolean;
  destination?: string;
  onFollowUpClick?: (question: string) => void;
}

// Validation function to check if itinerary has valid content
const isValidItinerary = (itinerary?: DetailedItinerary): boolean => {
  if (!itinerary) return false;
  
  // Check for placeholder/generic content
  const invalidSummaries = [
    "I'm having trouble processing",
    "I'd love to help you plan",
    "Could you provide more specific details",
    "Here's some helpful information"
  ];
  
  const hasInvalidSummary = invalidSummaries.some(phrase => 
    itinerary.summary?.toLowerCase().includes(phrase.toLowerCase())
  );
  
  if (hasInvalidSummary) return false;
  
  // Basic content validation
  const hasValidSummary = itinerary.summary && itinerary.summary.trim().length >= 30;
  const hasValidRecommendations = Array.isArray(itinerary.recommendations) && 
    itinerary.recommendations.length > 0 &&
    itinerary.recommendations.some(rec => 
      Array.isArray(rec.places) && rec.places.length > 0
    );
  const hasValidSuggestions = Array.isArray(itinerary.actionable_suggestions) && 
    itinerary.actionable_suggestions.length > 0;
  
  return hasValidSummary && hasValidRecommendations && hasValidSuggestions;
};

export const DetailedItineraryCard: React.FC<DetailedItineraryCardProps> = ({ 
  itinerary, 
  isLoading,
  destination,
  onFollowUpClick
}) => {
  if (isLoading) {
    return (
      <Card className="bg-slate-900/50 border-slate-700 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-slate-700 rounded w-3/4"></div>
          <div className="h-4 bg-slate-700 rounded w-full"></div>
          <div className="h-4 bg-slate-700 rounded w-5/6"></div>
          <div className="space-y-2">
            <div className="h-4 bg-slate-700 rounded w-full"></div>
            <div className="h-4 bg-slate-700 rounded w-4/5"></div>
          </div>
        </div>
      </Card>
    );
  }

  if (!itinerary || !isValidItinerary(itinerary)) {
    return (
      <Card className="bg-red-900/20 border-red-500/30 p-6">
        <div className="flex items-center gap-3 text-red-400">
          <AlertTriangle className="h-5 w-5" />
          <div>
            <h3 className="font-semibold">Unable to generate detailed itinerary</h3>
            <p className="text-sm text-red-300 mt-1">
              Please try asking for a specific destination with travel dates and preferences for a complete itinerary.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-900/50 border-slate-700">
      <div className="p-6">
        <DetailedItineraryDisplay itinerary={itinerary} />
        
        {/* Follow-up questions */}
        {itinerary.follow_up_questions && itinerary.follow_up_questions.length > 0 && onFollowUpClick && (
          <div className="mt-6 pt-4 border-t border-slate-700">
            <h4 className="text-sm font-medium text-slate-300 mb-3">Ask me more:</h4>
            <div className="flex flex-wrap gap-2">
              {itinerary.follow_up_questions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => onFollowUpClick(question)}
                  className="px-3 py-1 text-xs bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 rounded-full transition-colors duration-200"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};