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
      // Safety check to prevent flatMap error
      if (!itinerary.recommendations || !Array.isArray(itinerary.recommendations)) {
        return;
      }

      const placesToFetch = itinerary.recommendations
        .flatMap(category => Array.isArray(category.places) ? category.places : [])
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
      <div className="bg-gradient-to-br from-zinc-800/90 to-zinc-900/90 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30 shadow-lg animate-fade-in">
        <h2 className="text-2xl font-bold mb-3 text-white flex items-center gap-2">
          🧭 {itinerary.title}
        </h2>
        <p className="text-gray-300 text-base leading-relaxed">{itinerary.summary}</p>
      </div>

      {/* Flight Booking CTA */}
      <div className="bg-gradient-to-br from-zinc-800/90 to-zinc-900/90 backdrop-blur-sm rounded-xl p-4 border border-purple-500/30 shadow-lg">
        <Button 
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium text-base py-3 shadow-lg hover:shadow-purple-500/25 transition-all duration-200"
          onClick={() => {
            const searchQuery = destination ? `flights to ${destination}` : 'flights';
            window.open(`https://www.expedia.com/Flights?search=${encodeURIComponent(searchQuery)}`, '_blank');
          }}
        >
          ✈️ Book Your Flight on Utrippin
        </Button>
      </div>

      {/* Map Component */}
      {destination && (
        <div className="bg-gradient-to-br from-zinc-800/90 to-zinc-900/90 backdrop-blur-sm rounded-xl overflow-hidden border border-purple-500/30 shadow-lg">
          <div className="p-4 border-b border-purple-500/20">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              📍 {destination} Location
            </h3>
          </div>
          <StaticMapImage 
            destinationName={destination}
            size="medium"
            className="w-full h-56"
            showFallback={true}
          />
        </div>
      )}

      {/* Recommendations by Category */}
      {Array.isArray(itinerary.recommendations) && itinerary.recommendations.length > 0 && (
        itinerary.recommendations.map((category, categoryIndex) => (
        <div key={categoryIndex} className="bg-gradient-to-br from-zinc-800/90 to-zinc-900/90 backdrop-blur-sm rounded-xl border border-purple-500/30 shadow-lg">
          <div className="p-6">
            <h3 className="font-semibold text-white text-lg mb-4 flex items-center gap-2">
              ✨ {category.category_name}
            </h3>
            
            <div className="space-y-4">
              {Array.isArray(category.places) && category.places.length > 0 && (
                category.places.map((place, placeIndex) => {
                const IconComponent = getTypeIcon(place.type);
                const isSaved = savedPlaces.has(place.name);
                
                return (
                  <div key={placeIndex} className="border border-zinc-700/50 rounded-lg bg-zinc-700/30 overflow-hidden shadow-sm">
                    {/* Place Image */}
                    {(place.image_url || placeDetails[place.name]?.imageUrl) && (
                      <div className="h-40 bg-zinc-800 relative overflow-hidden">
                        <img 
                          src={place.image_url || placeDetails[place.name]?.imageUrl} 
                          alt={place.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                        <div className="absolute top-3 right-3 flex gap-2">
                          <Button
                            size="sm"
                            variant="secondary"
                            className="h-8 w-8 p-0 bg-black/60 hover:bg-black/80 border border-purple-500/30 shadow-md"
                            onClick={() => toggleSavePlace(place.name)}
                          >
                            <Heart 
                              className={`h-4 w-4 ${isSaved ? 'fill-pink-500 text-pink-500' : 'text-gray-300'}`} 
                            />
                          </Button>
                          <Button
                            size="sm"
                            variant="secondary"
                            className="h-8 w-8 p-0 bg-black/60 hover:bg-black/80 border border-purple-500/30 shadow-md"
                            onClick={() => handleViewOnMap(place.name)}
                          >
                            <MapPin className="h-4 w-4 text-gray-300" />
                          </Button>
                        </div>
                      </div>
                    )}
                    
                    {/* Place Content */}
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <IconComponent className="h-5 w-5 text-purple-400 flex-shrink-0" />
                          <h4 className="font-semibold text-white text-base leading-tight">
                            {place.name}
                          </h4>
                        </div>
                        <Badge 
                          variant="outline" 
                          className="text-sm bg-purple-600/20 text-purple-300 border-purple-500/30 flex-shrink-0"
                        >
                          {place.type}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-gray-300 leading-relaxed mb-3">
                        {place.description}
                      </p>
                      
                      {/* Rating and Price */}
                      <div className="flex items-center justify-between text-sm mb-3">
                        {place.rating && place.rating > 0 && (
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-white font-medium">{place.rating}</span>
                          </div>
                        )}
                        <div className="flex flex-col items-end">
                          {place.price_range && (
                            <span className="text-green-400 font-semibold text-base">
                              {place.price_range}
                            </span>
                          )}
                          {place.estimated_cost && (
                            <span className="text-gray-400 text-sm">
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
                               ? '🍽️ Book Table on Utrippin'
                               : place.type.toLowerCase().includes('hotel')
                               ? '🏨 Book Hotel on Utrippin'
                               : '🎫 Book Tour on Utrippin')
                             : placeDetails[place.name]?.websiteUrl ? '🌐 Visit Website' : 
                             '📍 View on Google Maps';
                           
                           return (
                             <a 
                               href={url} 
                               target="_blank" 
                               rel="noopener noreferrer"
                               className="block w-full"
                             >
                               <Button 
                                 size="sm" 
                                 className="w-full text-sm bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-2 shadow-lg hover:shadow-purple-500/25 transition-all duration-200"
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
              })
              )}
            </div>
          </div>
        </div>
        ))
      )}

      {/* Actionable Suggestions */}
      {itinerary.actionable_suggestions && itinerary.actionable_suggestions.length > 0 && (
        <div className="bg-gradient-to-br from-zinc-800/90 to-zinc-900/90 backdrop-blur-sm rounded-xl border border-purple-500/30 shadow-lg">
          <div className="p-6">
            <h3 className="font-semibold text-white text-lg mb-4 flex items-center gap-2">
              💡 Travel Tips
            </h3>
            <div className="space-y-3">
              {itinerary.actionable_suggestions.map((suggestion, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                  <p className="text-sm text-gray-300 leading-relaxed">{suggestion}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-purple-500/20">
              <p className="text-sm text-gray-400 italic font-medium">
                *All prices are estimates and subject to change.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Follow-up Questions */}
      {itinerary.follow_up_questions && itinerary.follow_up_questions.length > 0 && (
        <div className="bg-gradient-to-br from-zinc-800/90 to-zinc-900/90 backdrop-blur-sm rounded-xl border border-purple-500/30 shadow-lg">
          <div className="p-6">
            <h3 className="font-semibold text-white text-lg mb-4 flex items-center gap-2">
              🚀 Continue Planning
            </h3>
            <div className="grid gap-3">
              {itinerary.follow_up_questions.map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    onFollowUpClick(question);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-sm text-left h-auto py-3 px-4 border border-purple-500/30 text-gray-300 hover:bg-purple-600/20 hover:text-white hover:border-purple-400 justify-start whitespace-normal bg-transparent backdrop-blur-sm transition-all duration-200"
                >
                  {question}
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};