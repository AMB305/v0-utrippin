import React from 'react';
import { Calendar, MapPin, Star, Lightbulb, CheckCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PerfectTravelCardProps {
  destination: string;
  days: number;
  summary: string;
  activities: string[];
  tips: string[];
  suggestions: string[];
  rating?: number;
}

export const PerfectTravelCard: React.FC<PerfectTravelCardProps> = ({
  destination,
  days,
  summary,
  activities,
  tips,
  suggestions,
  rating = 4.8
}) => {
  // LAYER 2: FRONTEND DEFENSIVE VALIDATION - Never trust the backend
  const isValidContent = validateContent();
  
  function validateContent(): boolean {
    // Summary validation - check for meaningful content
    if (!summary || typeof summary !== 'string' || summary.length < 30) {
      console.warn('PerfectTravelCard: Invalid summary', { 
        hasSummary: !!summary, 
        summaryLength: summary?.length 
      });
      return false;
    }

    // Check for error phrases that indicate failed AI response
    const errorPhrases = [
      "i'm having trouble",
      "could you tell me", 
      "could you provide",
      "i'd love to help you plan",
      "i need more information"
    ];
    
    if (errorPhrases.some(phrase => summary.toLowerCase().includes(phrase))) {
      console.warn('PerfectTravelCard: Summary contains error phrases');
      return false;
    }

    // Activities validation
    if (!activities || !Array.isArray(activities) || activities.length === 0) {
      console.warn('PerfectTravelCard: Invalid activities', { 
        hasActivities: !!activities, 
        activitiesLength: activities?.length 
      });
      return false;
    }

    // Check for meaningful activities (not just empty strings)
    const validActivities = activities.filter(activity => 
      activity && typeof activity === 'string' && activity.trim().length > 5
    );
    
    if (validActivities.length === 0) {
      console.warn('PerfectTravelCard: No meaningful activities found');
      return false;
    }

    return true;
  }

  // FALLBACK COMPONENT - Show when validation fails
  if (!isValidContent) {
    console.warn('PerfectTravelCard: Content validation failed, showing fallback');
    
    return (
      <div className="bg-gradient-to-br from-zinc-800/90 to-zinc-900/90 backdrop-blur-sm rounded-xl p-6 border border-orange-500/30 shadow-lg animate-fade-in max-w-3xl mx-auto text-center">
        <div className="text-orange-300 mb-4">
          ✋ Keila needs a bit more information
        </div>
        <h3 className="text-xl font-semibold text-white mb-3">
          Let's create your perfect itinerary!
        </h3>
        <p className="text-gray-300 mb-6 leading-relaxed">
          To generate a detailed travel plan, please include:
          <br />• Your destination • Travel dates • Number of travelers • Your interests
        </p>
        <div className="space-y-3 mb-6">
          <div className="text-sm text-gray-400">Try asking:</div>
          <div className="text-sm text-purple-300 italic">
            "Plan a 5-day trip to Tokyo for 2 people in March, interested in culture and food"
          </div>
        </div>
        <Button 
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-semibold shadow-lg hover:shadow-purple-500/25"
          onClick={() => window.location.reload()}
        >
          Try Again
        </Button>
      </div>
    );
  }
  return (
    <div className="bg-gradient-to-br from-zinc-800/90 to-zinc-900/90 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30 shadow-lg animate-fade-in max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          <div className="flex items-center gap-2 text-purple-300 text-sm font-medium mb-2">
            <MapPin size={16} className="text-purple-400" />
            <span>{destination}</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
            🧭 Your Perfect {days}-Day Adventure
          </h2>
          <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
            <div className="flex items-center gap-1">
              <Calendar size={14} />
              <span>{days} days planned</span>
            </div>
          </div>
          <p className="text-gray-300 leading-relaxed">{summary}</p>
        </div>
        <div className="flex items-center gap-1 text-yellow-400 ml-4">
          <Star size={16} fill="currentColor" />
          <span className="font-semibold">{rating}</span>
        </div>
      </div>

      {/* Daily Activities */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          ✨ Daily Itinerary
        </h3>
        <div className="space-y-3">
          {activities.map((activity, index) => (
            <div 
              key={index}
              className="flex items-start gap-3 p-3 bg-zinc-700/30 rounded-lg border border-zinc-600/30 hover:bg-purple-600/10 hover:border-purple-500/30 transition-all duration-200"
            >
              <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                {index + 1}
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">{activity}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Travel Tips */}
      {tips.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            💡 Essential Tips
          </h3>
          <div className="space-y-2">
            {tips.map((tip, index) => (
              <div key={index} className="flex items-start gap-3">
                <Lightbulb className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                <p className="text-gray-300 text-sm leading-relaxed">{tip}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Smart Suggestions */}
      {suggestions.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            🎯 Smart Suggestions
          </h3>
          <div className="space-y-2">
            {suggestions.map((suggestion, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                <p className="text-gray-300 text-sm leading-relaxed">{suggestion}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-zinc-700/50">
        <div className="flex flex-col">
          <span className="text-xs text-gray-400">Estimated Cost</span>
          <span className="text-lg font-bold text-green-400">$1,200</span>
          <span className="text-xs text-gray-500">per person</span>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline"
            className="px-4 py-2 border border-purple-500/50 text-purple-300 rounded-lg text-sm font-medium hover:bg-purple-600/20 hover:border-purple-400 transition-colors bg-transparent"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Customize
          </Button>
          <Button 
            className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg text-sm font-semibold hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-purple-500/25"
          >
            🚀 Book This Trip
          </Button>
        </div>
      </div>

      {/* Footer Note */}
      <div className="mt-4 pt-4 border-t border-purple-500/20">
        <p className="text-xs text-gray-400 italic text-center">
          ✨ Personalized by Keila AI • All prices are estimates and subject to change
        </p>
      </div>
    </div>
  );
};