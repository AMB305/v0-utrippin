import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Wifi, Car, Utensils, Waves, Dumbbell, Heart } from "lucide-react";
import HotelRateComments from "@/components/HotelRateComments";
import HotelCancellationPolicy from "@/components/HotelCancellationPolicy";

interface HotelResult {
  id: string;
  name: string;
  starRating: number;
  images: string[];
  location: string;
  district: string;
  distanceFromCenter: string;
  guestRating: number;
  reviewCount: number;
  amenities: string[];
  pricePerNight: number;
  totalPrice: number;
  currency: string;
  originalPrice?: number;
  freeCancellation: boolean;
  payAtProperty: boolean;
  breakfastIncluded: boolean;
  dealType?: string;
  rateKey?: string; // Added for Hotelbeds compliance
}

interface HotelResultCardProps {
  hotel: HotelResult;
  onSelect: (hotel: HotelResult) => void;
  selected?: boolean;
}

const HotelResultCard = ({ hotel, onSelect, selected = false }: HotelResultCardProps) => {
  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case "wifi":
        return <Wifi className="w-3 h-3" />;
      case "parking":
        return <Car className="w-3 h-3" />;
      case "restaurant":
        return <Utensils className="w-3 h-3" />;
      case "pool":
        return <Waves className="w-3 h-3" />;
      case "gym":
        return <Dumbbell className="w-3 h-3" />;
      default:
        return null;
    }
  };

  const getRatingColor = () => {
    if (hotel.guestRating >= 9) return "text-green-600 bg-green-50";
    if (hotel.guestRating >= 8) return "text-blue-600 bg-blue-50";
    if (hotel.guestRating >= 7) return "text-orange-600 bg-orange-50";
    return "text-gray-600 bg-gray-50";
  };

  const getRatingText = () => {
    if (hotel.guestRating >= 9) return "Excellent";
    if (hotel.guestRating >= 8) return "Very Good";
    if (hotel.guestRating >= 7) return "Good";
    return "Pleasant";
  };

  return (
    <Card className={`hover:shadow-soft transition-all duration-300 cursor-pointer ${selected ? 'ring-2 ring-primary' : ''}`}>
      <CardContent className="p-0">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          {/* Hotel Images */}
          <div className="lg:col-span-4">
            <div className="relative h-64 lg:h-48">
              <img
                src={hotel.images[0]}
                alt={hotel.name}
                className="w-full h-full object-cover rounded-l-lg"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder.svg';
                }}
              />
              {hotel.dealType && (
                <Badge className="absolute top-2 left-2 bg-red-600 text-white">
                  {hotel.dealType}
                </Badge>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 bg-white/80 hover:bg-white"
              >
                <Heart className="w-4 h-4" />
              </Button>
              {hotel.images.length > 1 && (
                <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                  +{hotel.images.length - 1} photos
                </div>
              )}
            </div>
          </div>

          {/* Hotel Details */}
          <div className="lg:col-span-8 p-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-full">
              {/* Main Info */}
              <div className="lg:col-span-8">
                <div className="space-y-3">
                  {/* Hotel Name & Rating */}
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-lg">{hotel.name}</h3>
                        <div className="flex items-center">
                          {[...Array(hotel.starRating)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-travel-gold text-travel-gold" />
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="w-3 h-3" />
                        <span>{hotel.district}</span>
                        <span>•</span>
                        <span>{hotel.distanceFromCenter} from center</span>
                      </div>
                    </div>
                    
                    {hotel.guestRating > 0 && (
                      <div className="text-right">
                        <div className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getRatingColor()}`}>
                          {hotel.guestRating.toFixed(1)}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {getRatingText()} ({hotel.reviewCount} reviews)
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Amenities */}
                  <div className="flex flex-wrap gap-3">
                    {hotel.amenities.slice(0, 6).map((amenity, index) => (
                      <div key={index} className="flex items-center gap-1 text-xs text-muted-foreground">
                        {getAmenityIcon(amenity)}
                        <span className="capitalize">{amenity}</span>
                      </div>
                    ))}
                    {hotel.amenities.length > 6 && (
                      <span className="text-xs text-muted-foreground">
                        +{hotel.amenities.length - 6} more
                      </span>
                    )}
                  </div>

                  {/* Benefits */}
                  <div className="flex flex-wrap gap-2">
                    {hotel.freeCancellation && (
                      <Badge variant="outline" className="text-xs text-green-600 border-green-200">
                        Free cancellation
                      </Badge>
                    )}
                    {hotel.payAtProperty && (
                      <Badge variant="outline" className="text-xs text-blue-600 border-blue-200">
                        Pay at property
                      </Badge>
                    )}
                    {hotel.breakfastIncluded && (
                      <Badge variant="outline" className="text-xs text-orange-600 border-orange-200">
                        Breakfast included
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Price & Action */}
              <div className="lg:col-span-4 flex flex-col justify-between">
                <div className="text-right space-y-2">
                  {hotel.originalPrice && hotel.originalPrice > hotel.pricePerNight && (
                    <div className="text-sm text-muted-foreground line-through">
                      {hotel.currency}{hotel.originalPrice}
                    </div>
                  )}
                  
                  <div>
                    <div className="text-xs text-muted-foreground">Per night</div>
                    <div className="text-2xl font-bold">
                      {hotel.currency}{hotel.pricePerNight}
                    </div>
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    Total: {hotel.currency}{hotel.totalPrice}
                  </div>
                  
                  {hotel.originalPrice && hotel.originalPrice > hotel.pricePerNight && (
                    <div className="text-xs text-green-600 font-medium">
                      Save {hotel.currency}{hotel.originalPrice - hotel.pricePerNight} per night
                    </div>
                  )}
                </div>
                
                <Button 
                  onClick={() => onSelect(hotel)}
                  className="w-full mt-4"
                  variant={selected ? "default" : "outline"}
                >
                  {selected ? "Selected" : "See Availability"}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Hotelbeds Compliance: Rate Comments and Cancellation Policy */}
        <div className="px-6 pb-4 space-y-3 border-t pt-4">
          <HotelRateComments 
            rateCommentsId="102|166598|0" // Mock rate comments ID for demo
            className="text-xs"
          />
          <HotelCancellationPolicy
            freeCancellation={hotel.freeCancellation}
            policies={hotel.freeCancellation ? undefined : [
              { amount: "50.00", from: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), currency: hotel.currency }
            ]}
            className="text-xs"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default HotelResultCard;
