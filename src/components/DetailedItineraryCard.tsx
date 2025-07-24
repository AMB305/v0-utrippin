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
  if (lowerType.includes('day plan')) return 'bg-purple-100 text-purple-800 border-purple-300';
  if (lowerType.includes('restaurant') || lowerType.includes('dining')) return 'bg-orange-100 text-orange-800 border-orange-300';
  if (lowerType.includes('cultural') || lowerType.includes('museum')) return 'bg-blue-100 text-blue-800 border-blue-300';
  if (lowerType.includes('activity')) return 'bg-green-100 text-green-800 border-green-300';
  if (lowerType.includes('hotel') || lowerType.includes('accommodation')) return 'bg-pink-100 text-pink-800 border-pink-300';
  return 'bg-gray-100 text-gray-800 border-gray-300';
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
    <div className="space-y-6 w-full max-w-lg mx-auto">
      {/* Header */}
      <Card className="bg-white border border-gray-200 shadow-lg">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-3 text-gray-900">{itinerary.title}</h2>
          <p className="text-gray-700 text-base leading-relaxed">{itinerary.summary}</p>
        </div>
      </Card>

      {/* Flight Booking CTA */}
      <Card className="bg-white border border-gray-200 shadow-lg">
        <div className="p-4">
          <Button 
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 font-medium text-base py-3"
            onClick={() => {
              // Navigate to actual flight booking instead of placeholder
              const searchQuery = destination ? `flights to ${destination}` : 'flights';
              window.open(`https://www.expedia.com/Flights?search=${encodeURIComponent(searchQuery)}`, '_blank');
            }}
          >
            ✈️ Book Your Flight on Utrippin
          </Button>
        </div>
      </Card>

      {/* Map Component */}
      {destination && (
        <Card className="overflow-hidden bg-white border border-gray-200 shadow-lg">
          <StaticMapImage 
            destinationName={destination}
            size="medium"
            className="w-full h-56"
            showFallback={true}
          />
        </Card>
      )}

      {/* Recommendations by Category */}
      {itinerary.recommendations.map((category, categoryIndex) => (
        <Card key={categoryIndex} className="bg-white border border-gray-200 shadow-lg">
          <div className="p-6">
            <h3 className="font-semibold text-gray-900 text-lg mb-4">
              {category.category_name}
            </h3>
            
            <div className="space-y-4">
              {category.places.map((place, placeIndex) => {
                const IconComponent = getTypeIcon(place.type);
                const isSaved = savedPlaces.has(place.name);
                
                return (
                  <div key={placeIndex} className="border border-gray-200 rounded-lg bg-gray-50 overflow-hidden shadow-sm">
                    {/* Place Image */}
                    {(place.image_url || placeDetails[place.name]?.imageUrl) && (
                      <div className="h-40 bg-gray-200 relative overflow-hidden">
                        <img 
                          src={place.image_url || placeDetails[place.name]?.imageUrl} 
                          alt={place.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            // Hide image on error
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                        <div className="absolute top-3 right-3 flex gap-2">
                          <Button
                            size="sm"
                            variant="secondary"
                            className="h-8 w-8 p-0 bg-white/90 hover:bg-white shadow-md"
                            onClick={() => toggleSavePlace(place.name)}
                          >
                            <Heart 
                              className={`h-4 w-4 ${isSaved ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} 
                            />
                          </Button>
                          <Button
                            size="sm"
                            variant="secondary"
                            className="h-8 w-8 p-0 bg-white/90 hover:bg-white shadow-md"
                            onClick={() => handleViewOnMap(place.name)}
                          >
                            <MapPin className="h-4 w-4 text-gray-600" />
                          </Button>
                        </div>
                      </div>
                    )}
                    
                    {/* Place Content */}
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <IconComponent className="h-5 w-5 text-gray-600 flex-shrink-0" />
                          <h4 className="font-semibold text-gray-900 text-base leading-tight">
                            {place.name}
                          </h4>
                        </div>
                        <Badge 
                          variant="outline" 
                          className={`text-sm ${getTypeColor(place.type)} flex-shrink-0`}
                        >
                          {place.type}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-gray-600 leading-relaxed mb-3">
                        {place.description}
                      </p>
                      
                      {/* Rating and Price */}
                      <div className="flex items-center justify-between text-sm mb-3">
                        {place.rating && place.rating > 0 && (
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-gray-700 font-medium">{place.rating}</span>
                          </div>
                        )}
                        <div className="flex flex-col items-end">
                          {place.price_range && (
                            <span className="text-green-600 font-semibold text-base">
                              {place.price_range}
                            </span>
                          )}
                          {place.estimated_cost && (
                            <span className="text-gray-500 text-sm">
                              {place.estimated_cost}
                            </span>
                          )}
                        </div>
                      </div>

                       {/* Booking Button */}
                       {(place.booking_url || placeDetails[place.name]?.websiteUrl || placeDetails[place.name]?.googleMapsUrl) && place.type !== 'Transportation' && (
                         (() => {
                           const url = place.booking_url || 
                                        placeDetails[place.name]?.websiteUrl || 
                                        placeDetails[place.name]?.googleMapsUrl;
                           const buttonText = place.booking_url ? 
                             (place.type.toLowerCase().includes('restaurant') || place.type.toLowerCase().includes('dining') 
                               ? 'Book Table on Utrippin'
                               : place.type.toLowerCase().includes('hotel')
                               ? 'Book Hotel on Utrippin'
                               : 'Book Tour on Utrippin')
                             : placeDetails[place.name]?.websiteUrl ? 'Visit Website' : 
                             'View on Google Maps';
                           
                           return (
                             <a 
                               href={url} 
                               target="_blank" 
                               rel="noopener noreferrer"
                               className="block w-full"
                             >
                               <Button 
                                 size="sm" 
                                 className="w-full text-sm bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-2"
                               >
                                 {buttonText}
                               </Button>
                             </a>
                           );
                         })()
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
        <Card className="bg-white border border-gray-200 shadow-lg">
          <div className="p-6">
            <h3 className="font-semibold text-gray-900 text-lg mb-4 flex items-center gap-2">
              <Star className="h-5 w-5 text-green-500" />
              Travel Tips
            </h3>
            <div className="space-y-3">
              {itinerary.actionable_suggestions.map((suggestion, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                  <p className="text-sm text-gray-700 leading-relaxed">{suggestion}</p>
                </div>
              ))}
            </div>
            <Separator className="my-4 bg-gray-300" />
            <p className="text-sm text-gray-500 italic font-medium">
              *All prices are estimates and subject to change.
            </p>
          </div>
        </Card>
      )}

      {/* Follow-up Questions */}
      {itinerary.follow_up_questions && itinerary.follow_up_questions.length > 0 && (
        <Card className="bg-white border border-gray-200 shadow-lg">
          <div className="p-6">
            <h3 className="font-semibold text-gray-900 text-lg mb-4">
              Continue Planning
            </h3>
            <div className="grid gap-3">
              {itinerary.follow_up_questions.map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    onFollowUpClick(question);
                    // Scroll to top of the page
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-sm text-left h-auto py-3 px-4 border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900 justify-start whitespace-normal bg-white"
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