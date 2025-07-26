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

// LAYER 2: BULLETPROOF VALIDATION - Never trust the backend
const isValidItinerary = (itinerary?: DetailedItinerary): boolean => {
  console.log('DetailedItineraryCard: Starting validation for:', itinerary);
  
  if (!itinerary) {
    console.log('DetailedItineraryCard: No itinerary provided');
    return false;
  }
  
  // CRITICAL: Check for error phrases that indicate failed AI response
  const errorPhrases = [
    "i'm having trouble processing",
    "i'd love to help you plan",
    "could you provide more specific details", 
    "here's some helpful information",
    "i need more information",
    "could you tell me",
    "can you specify"
  ];
  
  const summaryLower = itinerary.summary?.toLowerCase() || '';
  const hasErrorPhrase = errorPhrases.some(phrase => 
    summaryLower.includes(phrase.toLowerCase())
  );
  
  if (hasErrorPhrase) {
    console.log('DetailedItineraryCard: Summary contains error phrases');
    return false;
  }
  
  // Summary validation - must be meaningful content
  const hasValidSummary = itinerary.summary && 
    typeof itinerary.summary === 'string' && 
    itinerary.summary.trim().length >= 30;
  
  if (!hasValidSummary) {
    console.log('DetailedItineraryCard: Invalid summary', {
      hasSummary: !!itinerary.summary,
      summaryLength: itinerary.summary?.length
    });
    return false;
  }
  
  // Recommendations validation - must have real content
  const hasValidRecommendations = Array.isArray(itinerary.recommendations) && 
    itinerary.recommendations.length > 0 &&
    itinerary.recommendations.some(rec => 
      rec && Array.isArray(rec.places) && rec.places.length > 0 &&
      rec.places.some(place => place && place.name && place.name.trim().length > 0)
    );
  
  if (!hasValidRecommendations) {
    console.log('DetailedItineraryCard: Invalid recommendations');
    return false;
  }
  
  // Actionable suggestions validation
  const hasValidSuggestions = Array.isArray(itinerary.actionable_suggestions) && 
    itinerary.actionable_suggestions.length > 0 &&
    itinerary.actionable_suggestions.some(suggestion => 
      suggestion && typeof suggestion === 'string' && suggestion.trim().length > 10
    );
  
  if (!hasValidSuggestions) {
    console.log('DetailedItineraryCard: Invalid suggestions');
    return false;
  }
  
  console.log('DetailedItineraryCard: Validation passed');
  return true;
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

  // LAYER 2: FRONTEND VALIDATION FALLBACK - Same as PerfectTravelCard
  if (!itinerary || !isValidItinerary(itinerary)) {
    console.warn('DetailedItineraryCard: Content validation failed, showing fallback');
    
    return (
      <Card className="bg-orange-900/20 border-orange-500/30 p-6">
        <div className="flex items-center gap-3 text-orange-400">
          <AlertTriangle className="h-5 w-5" />
          <div>
            <h3 className="font-semibold">Keila needs a bit more information</h3>
            <p className="text-sm text-orange-300 mt-2 leading-relaxed">
              To generate a detailed travel plan, please include:
              <br />• Your destination • Travel dates • Number of travelers • Your interests
            </p>
            <div className="mt-3 text-xs text-orange-200/80 italic">
              Try: "Plan a 5-day trip to Tokyo for 2 people in March, interested in culture and food"
            </div>
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