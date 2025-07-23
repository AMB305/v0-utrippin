import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  MapPin, 
  Clock, 
  Star, 
  Camera, 
  Heart,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Utensils,
  Building,
  Calendar
} from 'lucide-react';
import { EnhancedMapComponent } from '@/components/EnhancedMapComponent';
import { StaticMapImage } from '@/components/StaticMapImage';
import { useBehaviorTracking } from '@/hooks/useBehaviorTracking';

interface Place {
  name: string;
  description: string;
  type: string;
  image_url?: string;
  location?: string;
  rating?: number;
  price_range?: string;
}

interface Recommendation {
  category_name: string;
  places: Place[];
}

interface DetailedItinerary {
  title: string;
  summary: string;
  recommendations: Recommendation[];
  actionable_suggestions: string[];
  follow_up_questions: string[];
}

interface DetailedItineraryCardProps {
  itinerary: DetailedItinerary;
  destination?: string;
  onFollowUpClick: (question: string) => void;
}

const getTypeIcon = (type: string) => {
  const lowerType = type.toLowerCase();
  if (lowerType.includes('day plan')) return Calendar;
  if (lowerType.includes('restaurant') || lowerType.includes('dining')) return Utensils;
  if (lowerType.includes('cultural') || lowerType.includes('museum')) return Building;
  if (lowerType.includes('activity')) return Star;
  if (lowerType.includes('hotel') || lowerType.includes('accommodation')) return MapPin;
  return MapPin;
};

const getTypeColor = (type: string) => {
  const lowerType = type.toLowerCase();
  if (lowerType.includes('day plan')) return 'bg-purple-100 text-purple-800 border-purple-200';
  if (lowerType.includes('restaurant') || lowerType.includes('dining')) return 'bg-orange-100 text-orange-800 border-orange-200';
  if (lowerType.includes('cultural') || lowerType.includes('museum')) return 'bg-blue-100 text-blue-800 border-blue-200';
  if (lowerType.includes('activity')) return 'bg-green-100 text-green-800 border-green-200';
  if (lowerType.includes('hotel') || lowerType.includes('accommodation')) return 'bg-pink-100 text-pink-800 border-pink-200';
  return 'bg-gray-100 text-gray-800 border-gray-200';
};

export const DetailedItineraryCard: React.FC<DetailedItineraryCardProps> = ({
  itinerary,
  destination,
  onFollowUpClick
}) => {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['Suggested']))
  const [savedPlaces, setSavedPlaces] = useState<Set<string>>(new Set());
  const { trackDestinationView, trackClick } = useBehaviorTracking();

  const toggleCategory = (categoryName: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryName)) {
      newExpanded.delete(categoryName);
    } else {
      newExpanded.add(categoryName);
    }
    setExpandedCategories(newExpanded);
  };

  const toggleSavePlace = (placeName: string) => {
    const newSaved = new Set(savedPlaces);
    if (newSaved.has(placeName)) {
      newSaved.delete(placeName);
    } else {
      newSaved.add(placeName);
    }
    setSavedPlaces(newSaved);
    trackClick(`save_place_${placeName}`);
  };

  const handleViewOnMap = (placeName: string) => {
    trackDestinationView(placeName);
    // Could open map modal or external map app
  };

  return (
    <div className="space-y-4 w-full max-w-md mx-auto">
      {/* Header */}
      <Card className="bg-gradient-to-r from-purple-900 to-blue-900 text-white border-0">
        <div className="p-4">
          <h2 className="text-xl font-bold mb-2">{itinerary.title}</h2>
          <p className="text-purple-100 text-sm leading-relaxed">{itinerary.summary}</p>
        </div>
      </Card>

      {/* Map Component */}
      {destination && (
        <Card className="overflow-hidden">
          <StaticMapImage 
            destinationName={destination}
            size="medium"
            className="w-full h-48"
            showFallback={true}
          />
        </Card>
      )}

      {/* Recommendations by Category */}
      {itinerary.recommendations.map((category, categoryIndex) => {
        const isExpanded = expandedCategories.has(category.category_name);
        
        return (
          <Card key={categoryIndex} className="bg-gray-50 border border-gray-200">
            <div className="p-4">
              <Button
                variant="ghost"
                onClick={() => toggleCategory(category.category_name)}
                className="w-full flex items-center justify-between p-0 h-auto text-left"
              >
                <h3 className="font-semibold text-gray-900 text-sm">
                  {category.category_name}
                </h3>
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4 text-gray-500" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                )}
              </Button>

              {isExpanded && (
                <div className="mt-3 space-y-3">
                  {category.places.map((place, placeIndex) => {
                    const IconComponent = getTypeIcon(place.type);
                    const isSaved = savedPlaces.has(place.name);
                    
                    return (
                      <div key={placeIndex} className="border border-gray-200 rounded-lg bg-white overflow-hidden">
                        {/* Place Image */}
                        {place.image_url && (
                          <div className="h-32 bg-gray-200 relative overflow-hidden">
                            <img 
                              src={place.image_url} 
                              alt={place.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                // Hide image on error
                                (e.target as HTMLElement).style.display = 'none';
                              }}
                            />
                            <div className="absolute top-2 right-2 flex gap-1">
                              <Button
                                size="sm"
                                variant="secondary"
                                className="h-7 w-7 p-0 bg-white/80 hover:bg-white/90"
                                onClick={() => toggleSavePlace(place.name)}
                              >
                                <Heart 
                                  className={`h-3 w-3 ${isSaved ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} 
                                />
                              </Button>
                              <Button
                                size="sm"
                                variant="secondary"
                                className="h-7 w-7 p-0 bg-white/80 hover:bg-white/90"
                                onClick={() => handleViewOnMap(place.name)}
                              >
                                <MapPin className="h-3 w-3 text-gray-600" />
                              </Button>
                            </div>
                          </div>
                        )}
                        
                        {/* Place Content */}
                        <div className="p-3">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              <IconComponent className="h-4 w-4 text-gray-600 flex-shrink-0" />
                              <h4 className="font-medium text-gray-900 text-sm leading-tight truncate">
                                {place.name}
                              </h4>
                            </div>
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${getTypeColor(place.type)} flex-shrink-0`}
                            >
                              {place.type}
                            </Badge>
                          </div>
                          
                          <p className="text-xs text-gray-600 leading-relaxed mb-2">
                            {place.description}
                          </p>
                          
                          {/* Rating and Price */}
                          <div className="flex items-center justify-between text-xs">
                            {place.rating && (
                              <div className="flex items-center gap-1">
                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                <span className="text-gray-600">{place.rating}</span>
                              </div>
                            )}
                            {place.price_range && (
                              <span className="text-green-600 font-medium">
                                {place.price_range}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </Card>
        );
      })}

      {/* Actionable Suggestions */}
      {itinerary.actionable_suggestions && itinerary.actionable_suggestions.length > 0 && (
        <Card className="bg-green-50 border-green-200">
          <div className="p-4">
            <h3 className="font-semibold text-green-900 text-sm mb-3 flex items-center gap-2">
              <Star className="h-4 w-4" />
              Travel Tips
            </h3>
            <div className="space-y-2">
              {itinerary.actionable_suggestions.map((suggestion, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                  <p className="text-xs text-green-800 leading-relaxed">{suggestion}</p>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Follow-up Questions */}
      {itinerary.follow_up_questions && itinerary.follow_up_questions.length > 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <div className="p-4">
            <h3 className="font-semibold text-blue-900 text-sm mb-3">
              Continue Planning
            </h3>
            <div className="grid gap-2">
              {itinerary.follow_up_questions.map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => onFollowUpClick(question)}
                  className="text-xs text-left h-auto py-2 px-3 border-blue-300 text-blue-700 hover:bg-blue-100 justify-start whitespace-normal"
                >
                  {question}
                </Button>
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};