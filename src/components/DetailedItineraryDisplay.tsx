
import React from 'react';
import { MapPin, Clock, DollarSign, Star, Users } from 'lucide-react';

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

interface DetailedItineraryDisplayProps {
  itinerary: DetailedItinerary;
}

const getTypeIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case 'day plan':
      return <Clock className="h-4 w-4 text-blue-400" />;
    case 'restaurant':
      return <Star className="h-4 w-4 text-yellow-400" />;
    case 'cultural site':
      return <MapPin className="h-4 w-4 text-purple-400" />;
    case 'bar/club/entertainment':
      return <Users className="h-4 w-4 text-pink-400" />;
    case 'activity':
      return <MapPin className="h-4 w-4 text-green-400" />;
    default:
      return <MapPin className="h-4 w-4 text-slate-400" />;
  }
};

const getTypeColor = (type: string) => {
  switch (type.toLowerCase()) {
    case 'day plan':
      return 'border-blue-500/30 bg-blue-950/20';
    case 'restaurant':
      return 'border-yellow-500/30 bg-yellow-950/20';
    case 'cultural site':
      return 'border-purple-500/30 bg-purple-950/20';
    case 'bar/club/entertainment':
      return 'border-pink-500/30 bg-pink-950/20';
    case 'activity':
      return 'border-green-500/30 bg-green-950/20';
    default:
      return 'border-slate-500/30 bg-slate-950/20';
  }
};

export const DetailedItineraryDisplay: React.FC<DetailedItineraryDisplayProps> = ({ itinerary }) => {
  return (
    <div className="space-y-6 text-slate-200">
      {/* Title and Summary */}
      <div className="space-y-3">
        <h3 className="text-xl font-bold text-white">{itinerary.title}</h3>
        <p className="text-slate-300 leading-relaxed">{itinerary.summary}</p>
      </div>

      {/* Recommendations */}
      <div className="space-y-6">
        {itinerary.recommendations.map((category, categoryIndex) => (
          <div key={categoryIndex} className="space-y-3">
            <h4 className="text-lg font-semibold text-blue-400 border-b border-blue-500/30 pb-2">
              {category.category_name}
            </h4>
            
            <div className="space-y-3">
              {category.places.map((place, placeIndex) => (
                <div 
                  key={placeIndex}
                  className={`p-4 rounded-lg border ${getTypeColor(place.type)} backdrop-blur-sm`}
                >
                  <div className="flex items-start gap-3">
                    {getTypeIcon(place.type)}
                    <div className="flex-1">
                      <h5 className="font-semibold text-white mb-1">{place.name}</h5>
                      <p className="text-sm text-slate-300 leading-relaxed">{place.description}</p>
                      <span className="inline-block mt-2 px-2 py-1 text-xs bg-slate-700/50 rounded-full text-slate-400">
                        {place.type}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Actionable Suggestions */}
      {itinerary.actionable_suggestions && itinerary.actionable_suggestions.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-lg font-semibold text-green-400 border-b border-green-500/30 pb-2">
            <DollarSign className="h-5 w-5 inline mr-2" />
            Smart Travel Tips
          </h4>
          <div className="space-y-2">
            {itinerary.actionable_suggestions.map((suggestion, index) => (
              <div key={index} className="flex items-start gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-slate-300">{suggestion}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Follow-up Questions */}
      {itinerary.follow_up_questions && itinerary.follow_up_questions.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-lg font-semibold text-purple-400 border-b border-purple-500/30 pb-2">
            Want to explore more?
          </h4>
          <div className="space-y-2">
            {itinerary.follow_up_questions.map((question, index) => (
              <div key={index} className="text-sm text-slate-300 bg-purple-950/20 border border-purple-500/30 rounded-lg p-3">
                {question}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
