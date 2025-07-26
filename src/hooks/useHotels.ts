import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface HotelSearchParams {
  destination: string;
  checkInDate: string;
  checkOutDate: string;
  adults: number;
  children: number;
  rooms: number;
}

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

export function useHotelSearch(searchParams: HotelSearchParams, enabled = false) {
  return useQuery({
    queryKey: ['hotels', 'search', searchParams],
    queryFn: async (): Promise<Hotel[]> => {
      const { data, error } = await supabase.functions.invoke('ratehawk-hotel-search', {
        body: {
          destination: searchParams.destination,
          checkin: searchParams.checkInDate,
          checkout: searchParams.checkOutDate,
          adults: searchParams.adults,
          children: searchParams.children,
          rooms: searchParams.rooms
        }
      });

      if (error) {
        console.error('RateHawk search error:', error);
        throw new Error(error.message || 'Failed to search hotels');
      }

      // Transform RateHawk response to our Hotel interface
      return data?.hotels?.map((hotel: any) => ({
        id: hotel.id || hotel.hotel_id,
        name: hotel.name || hotel.hotel_name,
        location: hotel.location || `${hotel.city}, ${hotel.country}`,
        address: hotel.address || `${hotel.city}, ${hotel.country}`,
        rating: hotel.star_rating || hotel.rating || 4.0,
        price: hotel.price_per_night || hotel.min_price || 150,
        image: hotel.main_photo_url || hotel.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop',
        amenities: hotel.amenities || ['wifi', 'beds'],
        locationTag: hotel.country || hotel.region
      })) || [];
    },
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function usePopularDestinations() {
  return useQuery({
    queryKey: ['hotels', 'popular-destinations'],
    queryFn: async (): Promise<Hotel[]> => {
      // For now, return static popular hotels but this could be enhanced
      // to fetch from RateHawk API for popular destinations
      return [
        {
          id: '1',
          name: 'Grand Hotel Bucuresti',
          location: 'Nicolae Balcescu Boulevard 4, Romania',
          address: 'Nicolae Balcescu Boulevard 4, Romania',
          rating: 4.7,
          price: 179,
          image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=300&fit=crop',
          amenities: ['wifi', 'beds', 'gym'],
          locationTag: 'Romania'
        },
        {
          id: '2',
          name: 'Azure Bay Resort',
          location: 'Oceanview Drive 12, Constanta, Romania',
          address: 'Oceanview Drive 12, Constanta, Romania',
          rating: 4.7,
          price: 179,
          image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop',
          amenities: ['wifi', 'beds', 'gym'],
          locationTag: 'Romania'
        }
      ];
    },
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
  });
}

export function useNearbyHotels(location: string) {
  return useQuery({
    queryKey: ['hotels', 'nearby', location],
    queryFn: async (): Promise<Hotel[]> => {
      // This could call RateHawk API for nearby hotels
      const searchParams = {
        destination: location,
        checkInDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        checkOutDate: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        adults: 2,
        children: 0,
        rooms: 1
      };

      const { data, error } = await supabase.functions.invoke('ratehawk-hotel-search', {
        body: searchParams
      });

      if (error) {
        console.error('RateHawk nearby hotels error:', error);
        // Return fallback data if API fails
        return [
          {
            id: '1',
            name: 'Grand Hotel Bucuresti',
            location: 'Nicolae Balcescu Boulevard 4, Romania',
            address: 'Nicolae Balcescu Boulevard 4, Romania',
            rating: 4.7,
            price: 179,
            image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=300&fit=crop',
            amenities: ['wifi', 'beds', 'gym'],
            locationTag: 'Romania'
          }
        ];
      }

      return data?.hotels?.map((hotel: any) => ({
        id: hotel.id || hotel.hotel_id,
        name: hotel.name || hotel.hotel_name,
        location: hotel.location || `${hotel.city}, ${hotel.country}`,
        address: hotel.address || `${hotel.city}, ${hotel.country}`,
        rating: hotel.star_rating || hotel.rating || 4.0,
        price: hotel.price_per_night || hotel.min_price || 150,
        image: hotel.main_photo_url || hotel.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop',
        amenities: hotel.amenities || ['wifi', 'beds'],
        locationTag: hotel.country || hotel.region
      })) || [];
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 20 * 60 * 1000, // 20 minutes
  });
}