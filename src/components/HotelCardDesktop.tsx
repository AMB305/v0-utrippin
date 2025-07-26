import React from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Star, Wifi, Car, Dumbbell, MapPin, CreditCard, XCircle } from 'lucide-react';

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
  // RateHawk specific fields
  hid?: string;
  currency?: string;
  taxes_and_fees?: Array<{
    name: string;
    amount: number;
    currency: string;
    included_by_supplier: boolean;
  }>;
  policies?: {
    cancellation?: string;
    metapolicy_struct?: any;
  };
  freeCancellation?: boolean;
  payAtProperty?: boolean;
  breakfastIncluded?: boolean;
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
      case 'free wifi':
        return <Wifi size={14} className="text-primary" />;
      case 'gym':
      case 'fitness center':
        return <Dumbbell size={14} className="text-primary" />;
      case 'parking':
        return <Car size={14} className="text-primary" />;
      default:
        return null;
    }
  };

  // Calculate non-included fees
  const nonIncludedFees = hotel.taxes_and_fees?.filter(fee => !fee.included_by_supplier) || [];
  const totalNonIncludedFees = nonIncludedFees.reduce((sum, fee) => sum + fee.amount, 0);

  return (
    <div className="bg-card rounded-lg flex mb-3 shadow-lg overflow-hidden border border-border hover:border-primary/50 transition-all duration-200 hover:shadow-xl">
      {/* Image Section */}
      <div className="w-1/3 flex-shrink-0 relative">
        <img
          src={hotel.image}
          alt={hotel.name}
          className="w-full h-full object-cover"
          style={{ minHeight: '180px' }}
        />
        <div className="absolute top-2 right-2 bg-black/60 text-white px-2 py-1 rounded-md text-xs">
          {hotel.locationTag}
        </div>
        {hotel.freeCancellation && (
          <div className="absolute top-2 left-2">
            <Badge className="bg-green-600 text-white text-xs">
              Free Cancellation
            </Badge>
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className="flex-1 p-4 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-bold text-foreground mb-1">{hotel.name}</h3>
          <div className="flex items-center text-muted-foreground text-sm mb-2">
            <MapPin size={14} className="mr-1" />
            <span>{hotel.address}</span>
          </div>

          {/* Rating */}
          <div className="flex items-center mb-2">
            <div className="flex items-center text-yellow-500">
              <Star size={16} fill="currentColor" className="mr-1" />
              <span className="font-semibold text-foreground text-sm">{hotel.rating}</span>
            </div>
            <span className="text-muted-foreground ml-2 text-xs">(1,234 Reviews)</span>
          </div>

          {/* Amenities */}
          <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground mb-2">
            {hotel.amenities.slice(0, 4).map((amenity, index) => (
              <div key={index} className="flex items-center gap-1">
                {getAmenityIcon(amenity)}
                <span className="capitalize">{amenity}</span>
              </div>
            ))}
          </div>

          {/* Policy badges */}
          <div className="flex flex-wrap gap-1 mb-2">
            {hotel.breakfastIncluded && (
              <Badge variant="secondary" className="text-xs">Breakfast Included</Badge>
            )}
            {hotel.payAtProperty && (
              <Badge variant="outline" className="text-xs">Pay at Property</Badge>
            )}
          </div>

          <p className="text-muted-foreground text-xs mb-2 line-clamp-2">
            Experience luxury accommodations in the heart of Miami Beach with stunning ocean views and world-class amenities.
          </p>
        </div>

        <div className="flex justify-between items-end mt-auto">
          <div className="text-foreground">
            <div className="flex items-baseline">
              <span className="text-xl font-bold">${hotel.price}</span>
              <span className="text-sm font-normal text-muted-foreground">/night</span>
            </div>
            
            {/* Non-included fees display */}
            {totalNonIncludedFees > 0 && (
              <div className="text-xs text-orange-600 mt-1">
                <div className="flex items-center gap-1">
                  <CreditCard size={12} />
                  <span>+${totalNonIncludedFees.toFixed(2)} taxes & fees</span>
                </div>
              </div>
            )}
            
            {/* Cancellation policy indicator */}
            {hotel.policies?.cancellation && (
              <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <XCircle size={12} />
                <span className="truncate max-w-[150px]">
                  {hotel.policies.cancellation}
                </span>
              </div>
            )}
          </div>
          
          <Button 
            onClick={handleViewDetails}
            className="bg-primary text-primary-foreground font-semibold rounded-lg py-2 px-4 text-sm hover:bg-primary/90 transition-colors"
          >
            View Details
          </Button>
        </div>
      </div>
    </div>
  );
}