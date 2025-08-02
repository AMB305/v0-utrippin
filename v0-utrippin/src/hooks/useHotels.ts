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
          name: 'The Setai Miami Beach',
          location: '2001 Collins Avenue, Miami Beach, Florida',
          address: '2001 Collins Avenue, Miami Beach, Florida',
          rating: 4.8,
          price: 450,
          image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop',
          amenities: ['wifi', 'beds', 'gym'],
          locationTag: 'Florida'
        },
        {
          id: '2',
          name: 'W South Beach',
          location: '2201 Collins Avenue, Miami Beach, Florida',
          address: '2201 Collins Avenue, Miami Beach, Florida',
          rating: 4.6,
          price: 320,
          image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=300&fit=crop',
          amenities: ['wifi', 'beds', 'gym'],
          locationTag: 'Florida'
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

      console.log('Making RateHawk API call with params:', searchParams);
      const { data, error } = await supabase.functions.invoke('ratehawk-hotel-search', {
        body: searchParams
      });
      console.log('RateHawk API response:', { data, error });

      if (error) {
        console.error('RateHawk nearby hotels error:', error);
        // Return fallback Miami Beach data if API fails
        return [
          {
            id: '1',
            name: 'The Setai Miami Beach',
            location: '2001 Collins Avenue, Miami Beach, Florida',
            address: '2001 Collins Avenue, Miami Beach, Florida',
            rating: 4.8,
            price: 450,
            image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop',
            amenities: ['wifi', 'beds', 'gym'],
            locationTag: 'Florida'
          },
          {
            id: '2',
            name: 'W South Beach',
            location: '2201 Collins Avenue, Miami Beach, Florida',
            address: '2201 Collins Avenue, Miami Beach, Florida',
            rating: 4.6,
            price: 320,
            image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=300&fit=crop',
            amenities: ['wifi', 'beds', 'gym'],
            locationTag: 'Florida'
          },
          {
            id: '3',
            name: 'Edition Miami Beach',
            location: '2901 Collins Avenue, Miami Beach, Florida',
            address: '2901 Collins Avenue, Miami Beach, Florida',
            rating: 4.7,
            price: 380,
            image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=300&fit=crop',
            amenities: ['wifi', 'beds', 'gym'],
            locationTag: 'Florida'
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
