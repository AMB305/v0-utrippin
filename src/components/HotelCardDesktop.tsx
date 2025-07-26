import React from 'react';
import { Button } from './ui/button';
import { Star, Wifi, Car, Dumbbell, MapPin } from 'lucide-react';

interface Hotel {
  id: string;
  name: string;
  location: string;
  address: string;
  rating: number;
  price: number;
  image: string;
  amenities: string[];
  locationTag: string;
}

interface HotelCardDesktopProps {
  hotel: Hotel;
  onHotelSelect?: (hotel: Hotel) => void;
}

export function HotelCardDesktop({ hotel, onHotelSelect }: HotelCardDesktopProps) {
  const handleViewDetails = () => {
    if (onHotelSelect) {
      onHotelSelect(hotel);
    }
  };

  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case 'wifi':
        return <Wifi size={16} className="text-primary" />;
      case 'gym':
        return <Dumbbell size={16} className="text-primary" />;
      case 'parking':
        return <Car size={16} className="text-primary" />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-card rounded-xl flex mb-6 shadow-lg overflow-hidden border border-border hover:border-primary/50 transition-all duration-200 hover:shadow-xl">
      {/* Image Section */}
      <div className="w-1/3 flex-shrink-0 relative">
        <img
          src={hotel.image}
          alt={hotel.name}
          className="w-full h-full object-cover"
          style={{ minHeight: '200px' }}
        />
        <div className="absolute top-3 right-3 bg-black/60 text-white px-2 py-1 rounded-md text-sm">
          {hotel.locationTag}
        </div>
      </div>

      {/* Info Section */}
      <div className="flex-1 p-6 flex flex-col justify-between">
        <div>
          <h3 className="text-2xl font-bold text-foreground mb-2">{hotel.name}</h3>
          <div className="flex items-center text-muted-foreground text-base mb-3">
            <MapPin size={16} className="mr-1" />
            <span>{hotel.address}</span>
          </div>

          {/* Rating */}
          <div className="flex items-center mb-3">
            <div className="flex items-center text-yellow-500">
              <Star size={18} fill="currentColor" className="mr-1" />
              <span className="font-semibold text-foreground">{hotel.rating}</span>
            </div>
            <span className="text-muted-foreground ml-2 text-sm">(1,234 Reviews)</span>
          </div>

          {/* Amenities */}
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground mb-4">
            {hotel.amenities.slice(0, 4).map((amenity, index) => (
              <div key={index} className="flex items-center gap-2">
                {getAmenityIcon(amenity)}
                <span className="capitalize">{amenity}</span>
              </div>
            ))}
          </div>

          <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
            Experience luxury accommodations in the heart of Miami Beach with stunning ocean views and world-class amenities.
          </p>
        </div>

        <div className="flex justify-between items-end mt-auto">
          <div className="text-foreground">
            <span className="text-3xl font-bold">${hotel.price}</span>
            <span className="text-base font-normal text-muted-foreground">/night</span>
          </div>
          <Button 
            onClick={handleViewDetails}
            className="bg-primary text-primary-foreground font-semibold rounded-lg py-3 px-6 text-base hover:bg-primary/90 transition-colors"
          >
            View Details
          </Button>
        </div>
      </div>
    </div>
  );
}