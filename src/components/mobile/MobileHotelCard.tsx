import { Star, MapPin, Wifi, Car, Waves, Bed, Coffee } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface MobileHotelCardProps {
  hotel: {
    id: string;
    name: string;
    location: string;
    starRating: number;
    images: string[];
    pricePerNight: number;
    currency: string;
    amenities: string[];
    freeCancellation?: boolean;
    breakfastIncluded?: boolean;
  };
  onSelect: () => void;
}

export function MobileHotelCard({ hotel, onSelect }: MobileHotelCardProps) {
  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case 'wifi':
      case 'free wifi':
        return <Wifi className="w-4 h-4 text-mobile-primary-teal" />;
      case 'pool':
        return <Waves className="w-4 h-4 text-mobile-primary-teal" />;
      case 'parking':
      case 'free parking':
        return <Car className="w-4 h-4 text-mobile-primary-teal" />;
      case 'breakfast':
      case 'breakfast included':
        return <Coffee className="w-4 h-4 text-mobile-primary-teal" />;
      default:
        return <Bed className="w-4 h-4 text-mobile-primary-teal" />;
    }
  };

  return (
    <div className="mobile-card mb-4 mx-4">
      {/* Hotel Image */}
      <div className="relative h-48">
        <img
          src={hotel.images[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop'}
          alt={hotel.name}
          className="w-full h-full object-cover"
        />
        {/* Location Tag Overlay */}
        <div className="absolute top-3 left-3">
          <Badge className="bg-black/70 text-white border-none">
            {hotel.location.split(',')[1]?.trim() || hotel.location}
          </Badge>
        </div>
        {/* Price Overlay */}
        <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm rounded-lg px-3 py-1">
          <p className="text-white font-bold text-lg">
            {hotel.currency} {hotel.pricePerNight}
          </p>
          <p className="text-white/80 text-sm">per night</p>
        </div>
      </div>

      {/* Hotel Details */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h3 className="text-mobile-text-primary font-semibold text-lg mb-1">
              {hotel.name}
            </h3>
            <div className="flex items-center mb-2">
              {[...Array(hotel.starRating)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex items-center text-mobile-text-secondary mb-3">
          <MapPin className="w-4 h-4 mr-1" />
          <span className="text-sm">{hotel.location}</span>
        </div>

        {/* Amenities */}
        <div className="flex items-center gap-3 mb-4">
          {hotel.amenities.slice(0, 4).map((amenity, index) => (
            <div key={index} className="flex items-center">
              {getAmenityIcon(amenity)}
            </div>
          ))}
          {hotel.amenities.length > 4 && (
            <span className="text-mobile-text-secondary text-sm">
              +{hotel.amenities.length - 4} more
            </span>
          )}
        </div>

        {/* Tags */}
        <div className="flex items-center gap-2 mb-4">
          {hotel.freeCancellation && (
            <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">
              Free Cancellation
            </Badge>
          )}
          {hotel.breakfastIncluded && (
            <Badge variant="outline" className="border-mobile-border-color text-mobile-text-secondary">
              Breakfast Included
            </Badge>
          )}
        </div>

        {/* Book Button */}
        <Button 
          onClick={onSelect}
          className="w-full teal-button"
        >
          View Details
        </Button>
      </div>
    </div>
  );
}
