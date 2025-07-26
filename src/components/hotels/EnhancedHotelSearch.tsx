import React, { useState } from 'react';
import { DateRangePicker } from './DateRangePicker';
import { GuestRoomSelector } from './GuestRoomSelector';
import { HotelFilters } from './HotelFilters';
import { HotelSortSelector } from './HotelSortSelector';
import { HotelErrorHandler } from './HotelErrorHandler';
import { HotelCardDesktop } from '../HotelCardDesktop';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent } from '../ui/card';
import { MapPin, Search, Loader2 } from 'lucide-react';
import { RatehawkService } from '@/services/RatehawkService';

interface DateRange {
  checkIn: Date | undefined;
  checkOut: Date | undefined;
}

interface GuestConfig {
  adults: number;
  children: number[];
  rooms: number;
}

interface FilterState {
  propertyTypes: string[];
  priceRange: [number, number];
  starRating: number[];
  amenities: string[];
}

interface EnhancedHotelSearchProps {
  className?: string;
}

export function EnhancedHotelSearch({ className }: EnhancedHotelSearchProps) {
  const [destination, setDestination] = useState('Miami Beach, Florida');
  const [dateRange, setDateRange] = useState<DateRange>({
    checkIn: undefined,
    checkOut: undefined,
  });
  const [guestConfig, setGuestConfig] = useState<GuestConfig>({
    adults: 2,
    children: [],
    rooms: 1,
  });
  const [filters, setFilters] = useState<FilterState>({
    propertyTypes: [],
    priceRange: [0, 1000],
    starRating: [],
    amenities: [],
  });
  const [sortBy, setSortBy] = useState('recommended');
  const [isLoading, setIsLoading] = useState(false);
  const [hotels, setHotels] = useState<any[]>([]);
  const [error, setError] = useState<any>(null);

  const handleSearch = async () => {
    if (!dateRange.checkIn || !dateRange.checkOut) {
      setError({
        type: 'invalid_params',
        message: 'Please select check-in and check-out dates',
        retryable: false,
      });
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const searchParams = {
        destination,
        checkIn: dateRange.checkIn.toISOString().split('T')[0],
        checkOut: dateRange.checkOut.toISOString().split('T')[0],
        adults: guestConfig.adults,
        children: guestConfig.children,
        residency: 'US',
        currency: 'USD',
        language: 'en',
      };

      console.log('🔍 Enhanced search with RateHawk integration:', searchParams);

      const result = await RatehawkService.searchHotels(searchParams);
      
      if (!result.hotels || result.hotels.length === 0) {
        setError({
          type: 'no_results',
          message: `No hotels found in ${destination} for your selected dates.`,
          retryable: true,
        });
        setHotels([]);
      } else {
        // Transform RateHawk data and apply local filters
        let transformedHotels = result.hotels.map(RatehawkService.transformHotelData);
        
        // Apply local filters
        transformedHotels = applyFilters(transformedHotels, filters);
        
        // Apply sorting
        transformedHotels = applySorting(transformedHotels, sortBy);
        
        setHotels(transformedHotels);
        console.log(`✅ Found ${transformedHotels.length} hotels after filtering`);
      }
    } catch (err: any) {
      console.error('❌ Hotel search error:', err);
      
      if (err.message?.includes('network') || err.message?.includes('fetch')) {
        setError({
          type: 'network',
          message: 'Unable to connect to hotel search service',
          details: 'Please check your internet connection and try again.',
          retryable: true,
        });
      } else if (err.message?.includes('rate limit')) {
        setError({
          type: 'rate_limit',
          message: 'Too many search requests',
          details: 'Please wait a moment before searching again.',
          retryable: true,
        });
      } else {
        setError({
          type: 'api',
          message: 'Hotel search is temporarily unavailable',
          details: err.message || 'Unknown error occurred',
          retryable: true,
        });
      }
      setHotels([]);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = (hotels: any[], filters: FilterState) => {
    return hotels.filter(hotel => {
      // Property type filter
      if (filters.propertyTypes.length > 0) {
        // This would need to be mapped from RateHawk property types
        // For now, allowing all types to pass
      }
      
      // Price range filter
      if (hotel.pricePerNight < filters.priceRange[0] || hotel.pricePerNight > filters.priceRange[1]) {
        return false;
      }
      
      // Star rating filter
      if (filters.starRating.length > 0 && !filters.starRating.includes(hotel.starRating)) {
        return false;
      }
      
      // Amenities filter
      if (filters.amenities.length > 0) {
        const hotelAmenities = hotel.amenities?.map((a: string) => a.toLowerCase()) || [];
        const hasRequiredAmenities = filters.amenities.every(amenity => 
          hotelAmenities.some((ha: string) => ha.includes(amenity))
        );
        if (!hasRequiredAmenities) {
          return false;
        }
      }
      
      return true;
    });
  };

  const applySorting = (hotels: any[], sortBy: string) => {
    const sorted = [...hotels];
    
    switch (sortBy) {
      case 'price_low':
        return sorted.sort((a, b) => a.pricePerNight - b.pricePerNight);
      case 'price_high':
        return sorted.sort((a, b) => b.pricePerNight - a.pricePerNight);
      case 'rating_high':
        return sorted.sort((a, b) => b.guestRating - a.guestRating);
      case 'rating_low':
        return sorted.sort((a, b) => a.guestRating - b.guestRating);
      case 'name_asc':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'name_desc':
        return sorted.sort((a, b) => b.name.localeCompare(a.name));
      default:
        return sorted; // Keep recommended order
    }
  };

  const resetFilters = () => {
    setFilters({
      propertyTypes: [],
      priceRange: [0, 1000],
      starRating: [],
      amenities: [],
    });
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Search Header */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Destination */}
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Where to?"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Dates */}
            <DateRangePicker
              value={dateRange}
              onChange={setDateRange}
              className="w-full"
            />

            {/* Guests & Rooms */}
            <GuestRoomSelector
              value={guestConfig}
              onChange={setGuestConfig}
              className="w-full"
            />

            {/* Search Button */}
            <Button 
              onClick={handleSearch} 
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Searching...</>
              ) : (
                <><Search className="h-4 w-4 mr-2" />Search Hotels</>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-6">
        {/* Filters Sidebar */}
        <div className="w-80 flex-shrink-0">
          <HotelFilters
            filters={filters}
            onChange={setFilters}
            onApply={handleSearch}
            onReset={resetFilters}
          />
        </div>

        {/* Results Area */}
        <div className="flex-1">
          {/* Sort Controls */}
          <HotelSortSelector
            value={sortBy}
            onChange={setSortBy}
            resultCount={hotels.length}
            className="mb-4"
          />

          {/* Error Display */}
          {error && (
            <HotelErrorHandler
              error={error}
              onRetry={handleSearch}
              onModifySearch={() => setError(null)}
              className="mb-6"
            />
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin mr-3" />
              <span>Searching hotels...</span>
            </div>
          )}

          {/* Hotel Results */}
          {!isLoading && !error && hotels.length > 0 && (
            <div className="space-y-4">
              {hotels.map((hotel) => (
                <HotelCardDesktop
                  key={hotel.id}
                  hotel={{
                    ...hotel,
                    location: hotel.location || destination,
                    address: hotel.address || hotel.location,
                    image: hotel.images?.[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=250&fit=crop&q=80',
                    amenities: hotel.amenities || ['WiFi', 'Parking', 'Gym'],
                    locationTag: 'Best Rate',
                    rating: hotel.guestRating || hotel.starRating || 4.5,
                    price: hotel.pricePerNight || 299,
                  }}
                  onHotelSelect={(hotel) => {
                    console.log('Selected hotel:', hotel);
                    // Handle hotel selection (open details modal, etc.)
                  }}
                />
              ))}
            </div>
          )}

          {/* No Results State */}
          {!isLoading && !error && hotels.length === 0 && dateRange.checkIn && (
            <div className="text-center py-12">
              <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Ready to search</h3>
              <p className="text-muted-foreground">
                Click "Search Hotels" to find accommodations in {destination}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}