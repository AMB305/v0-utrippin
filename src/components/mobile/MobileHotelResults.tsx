import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { MobileHotelCard } from './MobileHotelCard';
import { RatehawkService } from '@/services/RatehawkService';

interface MobileHotelResultsProps {
  hotels: any[];
  loading: boolean;
  onHotelSelect: (hotel: any) => void;
  searchData: {
    destination: string;
    checkInDate: string;
    checkOutDate: string;
    adults: number;
    children: number;
    rooms: number;
  };
}

export function MobileHotelResults({ 
  hotels, 
  loading, 
  onHotelSelect, 
  searchData 
}: MobileHotelResultsProps) {
  const [refreshing, setRefreshing] = useState(false);

  const handlePullToRefresh = async () => {
    setRefreshing(true);
    // Simulate refresh delay
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <Loader2 className="w-8 h-8 animate-spin text-mobile-primary-teal" />
        <span className="ml-2 text-mobile-text-primary">Searching hotels...</span>
      </div>
    );
  }

  if (hotels.length === 0) {
    return (
      <div className="text-center py-12 px-4">
        <p className="text-mobile-text-secondary text-lg">No hotels found</p>
        <p className="text-mobile-text-secondary text-sm mt-2">
          Try adjusting your search criteria
        </p>
      </div>
    );
  }

  return (
    <div className="pb-20"> {/* Extra padding for bottom nav */}
      {/* Search Summary */}
      <div className="p-4 bg-mobile-section-bg">
        <h2 className="text-mobile-text-primary text-xl font-bold mb-1">
          Hotels in {searchData.destination}
        </h2>
        <p className="text-mobile-text-secondary text-sm">
          {searchData.checkInDate} → {searchData.checkOutDate} • 
          {searchData.adults + searchData.children} guests, {searchData.rooms} room{searchData.rooms > 1 ? 's' : ''}
        </p>
        <p className="text-mobile-primary-teal text-sm mt-1">
          {hotels.length} hotels found
        </p>
      </div>

      {/* Hotel Cards */}
      <div className="space-y-0">
        {hotels.map((hotel) => {
          // Transform the hotel data to match our card interface
          const transformedHotel = {
            id: hotel.id,
            name: hotel.name,
            location: hotel.location,
            starRating: hotel.starRating || 4,
            images: hotel.images || ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop'],
            pricePerNight: hotel.pricePerNight || hotel.price?.amount || 0,
            currency: hotel.currency || hotel.price?.currency || 'USD',
            amenities: hotel.amenities || ['WiFi', 'Pool', 'Parking'],
            freeCancellation: hotel.freeCancellation || true,
            breakfastIncluded: hotel.breakfastIncluded || false
          };

          return (
            <MobileHotelCard
              key={hotel.id}
              hotel={transformedHotel}
              onSelect={() => onHotelSelect(hotel)}
            />
          );
        })}
      </div>

      {/* Pull to refresh indicator */}
      {refreshing && (
        <div className="text-center py-4">
          <Loader2 className="w-6 h-6 animate-spin text-mobile-primary-teal mx-auto" />
        </div>
      )}
    </div>
  );
}
