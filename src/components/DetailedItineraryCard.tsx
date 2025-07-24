import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  MapPin, 
  Star, 
  Heart,
  Utensils,
  Building,
  Calendar
} from 'lucide-react';
import { EnhancedMapComponent } from '@/components/EnhancedMapComponent';
import { StaticMapImage } from '@/components/StaticMapImage';
import { useBehaviorTracking } from '@/hooks/useBehaviorTracking';
import { useGooglePlacesDetails } from '@/hooks/useGooglePlacesDetails';

interface Place {
  name: string;
  description: string;
  type: string;
  image_url?: string;
  location?: string;
  rating?: number;
  price_range?: string;
  estimated_cost?: string;
  booking_url?: string;
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
  if (lowerType.includes('day plan')) return 'bg-purple-900 text-purple-300 border-purple-700';
  if (lowerType.includes('restaurant') || lowerType.includes('dining')) return 'bg-orange-900 text-orange-300 border-orange-700';
  if (lowerType.includes('cultural') || lowerType.includes('museum')) return 'bg-blue-900 text-blue-300 border-blue-700';
  if (lowerType.includes('activity')) return 'bg-green-900 text-green-300 border-green-700';
  if (lowerType.includes('hotel') || lowerType.includes('accommodation')) return 'bg-pink-900 text-pink-300 border-pink-700';
  return 'bg-slate-700 text-slate-300 border-slate-600';
};

export const DetailedItineraryCard: React.FC<DetailedItineraryCardProps> = ({
  itinerary,
  destination,
  onFollowUpClick
}) => {
  const [savedPlaces, setSavedPlaces] = useState<Set<string>>(new Set());
  const [placeDetails, setPlaceDetails] = useState<Record<string, any>>({});
  const { trackDestinationView, trackClick } = useBehaviorTracking();
  const { getMultiplePlaceDetails } = useGooglePlacesDetails();

  // Fetch details for places that don't have complete information
  useEffect(() => {
    const fetchPlaceDetails = async () => {
      const placesToFetch = itinerary.recommendations
        .flatMap(category => category.places)
        .filter(place => !place.image_url || !place.booking_url)
        .map(place => ({ 
          name: place.name, 
          location: place.location || destination 
        }));

      if (placesToFetch.length > 0) {
        console.log('Fetching details for places:', placesToFetch);
        const details = await getMultiplePlaceDetails(placesToFetch);
        console.log('Received place details:', details);
        setPlaceDetails(details);
      }
    };

    fetchPlaceDetails();
  }, [itinerary, destination, getMultiplePlaceDetails]);

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
      <Card className="bg-slate-800 text-white border border-slate-700">
        <div className="p-4">
          <h2 className="text-xl font-bold mb-2 text-white">{itinerary.title}</h2>
          <p className="text-white text-sm leading-relaxed">{itinerary.summary}</p>
        </div>
      </Card>

      {/* Flight Booking CTA */}
      <Card className="bg-slate-800 border border-slate-700">
        <div className="p-3">
          <Button 
            className="w-full bg-blue-600 text-white hover:bg-blue-700 font-medium"
            onClick={() => window.open('#', '_blank')}
          >
            ✈️ Book Your Flight on Utrippin
          </Button>
        </div>
      </Card>

      {/* Map Component */}
      {destination && (
        <Card className="overflow-hidden bg-slate-800 border border-slate-700">
          <StaticMapImage 
            destinationName={destination}
            size="medium"
            className="w-full h-48"
            showFallback={true}
          />
        </Card>
      )}

      {/* Recommendations by Category */}
      {itinerary.recommendations.map((category, categoryIndex) => (
        <Card key={categoryIndex} className="bg-slate-800 border border-slate-700">
          <div className="p-4">
            <h3 className="font-semibold text-white text-sm mb-3">
              {category.category_name}
            </h3>
            
            <div className="space-y-3">
              {category.places.map((place, placeIndex) => {
                const IconComponent = getTypeIcon(place.type);
                const isSaved = savedPlaces.has(place.name);
                
                return (
                  <div key={placeIndex} className="border border-slate-600 rounded-lg bg-slate-700 overflow-hidden">
                    {/* Place Image */}
                    {(place.image_url || placeDetails[place.name]?.imageUrl) && (
                      <div className="h-32 bg-gray-200 relative overflow-hidden">
                        <img 
                          src={place.image_url || placeDetails[place.name]?.imageUrl} 
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
                          <IconComponent className="h-4 w-4 text-slate-300 flex-shrink-0" />
                          <h4 className="font-medium text-white text-sm leading-tight truncate">
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
                      
                      <p className="text-xs text-slate-300 leading-relaxed mb-2">
                        {place.description}
                      </p>
                      
                      {/* Rating and Price */}
                      <div className="flex items-center justify-between text-xs mb-2">
                        {place.rating && place.rating > 0 && (
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-slate-300">{place.rating}</span>
                          </div>
                        )}
                        <div className="flex flex-col items-end">
                          {place.price_range && (
                            <span className="text-green-600 font-medium">
                              {place.price_range}
                            </span>
                          )}
                          {place.estimated_cost && (
                            <span className="text-slate-400 text-xs">
                              {place.estimated_cost}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Booking Button */}
                      {(place.booking_url || placeDetails[place.name]?.websiteUrl || placeDetails[place.name]?.googleMapsUrl) && place.type !== 'Transportation' && (
                         <Button 
                           size="sm" 
                           className="w-full text-xs bg-blue-600 hover:bg-blue-700 text-white"
                          onClick={() => {
                            const url = place.booking_url || 
                                         placeDetails[place.name]?.websiteUrl || 
                                         placeDetails[place.name]?.googleMapsUrl;
                            if (url) window.open(url, '_blank');
                          }}
                        >
                          {place.booking_url ? 
                            (place.type.toLowerCase().includes('restaurant') || place.type.toLowerCase().includes('dining') 
                              ? 'Book Table on Utrippin'
                              : place.type.toLowerCase().includes('hotel')
                              ? 'Book Hotel on Utrippin'
                              : 'Book Tour on Utrippin')
                            : placeDetails[place.name]?.websiteUrl ? 'Visit Website' : 
                            'View on Google Maps'}
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>
      ))}

      {/* Actionable Suggestions */}
      {itinerary.actionable_suggestions && itinerary.actionable_suggestions.length > 0 && (
        <Card className="bg-slate-800 border border-slate-700">
          <div className="p-4">
            <h3 className="font-semibold text-white text-sm mb-3 flex items-center gap-2">
              <Star className="h-4 w-4 text-green-400" />
              Travel Tips
            </h3>
            <div className="space-y-2">
              {itinerary.actionable_suggestions.map((suggestion, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                  <p className="text-xs text-slate-300 leading-relaxed">{suggestion}</p>
                </div>
              ))}
            </div>
            <Separator className="my-3 bg-slate-600" />
            <p className="text-xs text-slate-400 italic font-medium">
              *All prices are estimates and subject to change.
            </p>
          </div>
        </Card>
      )}

      {/* Follow-up Questions */}
      {itinerary.follow_up_questions && itinerary.follow_up_questions.length > 0 && (
        <Card className="bg-slate-800 border border-slate-700">
          <div className="p-4">
            <h3 className="font-semibold text-white text-sm mb-3">
              Continue Planning
            </h3>
            <div className="grid gap-2">
              {itinerary.follow_up_questions.map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => onFollowUpClick(question)}
                  className="text-xs text-left h-auto py-2 px-3 border-slate-600 text-white hover:bg-slate-700 hover:text-white justify-start whitespace-normal bg-slate-700"
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