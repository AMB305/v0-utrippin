import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { HotelbedsMappingService } from "@/services/HotelbedsMappingService";
import { supabase } from "@/integrations/supabase/client";

// Import hotel images
import castleHotel1 from "@/assets/hotels/castle-hotel-1.jpg";
import luxuryPoolHotel1 from "@/assets/hotels/luxury-pool-hotel-1.jpg";
import waterparkResort1 from "@/assets/hotels/waterpark-resort-1.jpg";
import spaHotel1 from "@/assets/hotels/spa-hotel-1.jpg";
import oceanViewHotel1 from "@/assets/hotels/ocean-view-hotel-1.jpg";
import budgetHotel1 from "@/assets/hotels/budget-hotel-1.jpg";
import businessHotel1 from "@/assets/hotels/business-hotel-1.jpg";
import beachResort1 from "@/assets/hotels/beach-resort-1.jpg";

// Enhanced mock data with real-looking hotels categorized by type
const mockHotelResults = [
  // Luxury Hotels
  {
    id: "1",
    name: "The Regal Palace Hotel & Spa",
    starRating: 5,
    images: [luxuryPoolHotel1, spaHotel1, oceanViewHotel1],
    location: "Paris, France",
    district: "1st Arrondissement",
    distanceFromCenter: "0.5 km",
    guestRating: 9.4,
    reviewCount: 2847,
    amenities: ["concierge", "fine-dining", "spa", "room-service", "pool", "gym", "wifi", "parking"],
    pricePerNight: 285,
    totalPrice: 855,
    currency: "$",
    originalPrice: 320,
    freeCancellation: true,
    payAtProperty: false,
    breakfastIncluded: true,
    dealType: "15% OFF",
    hotelType: "luxury",
    rateKey: undefined as string | undefined
  },
  // Castle Hotels
  {
    id: "2",
    name: "Highland Castle Resort",
    starRating: 5,
    images: [castleHotel1, luxuryPoolHotel1],
    location: "Edinburgh, Scotland",
    district: "Royal Mile",
    distanceFromCenter: "2.1 km",
    guestRating: 9.6,
    reviewCount: 1523,
    amenities: ["historic-architecture", "fine-dining", "spa", "wifi", "parking", "concierge"],
    pricePerNight: 450,
    totalPrice: 1350,
    currency: "$",
    originalPrice: 520,
    freeCancellation: true,
    payAtProperty: false,
    breakfastIncluded: true,
    dealType: "CASTLE SPECIAL",
    hotelType: "historic",
    rateKey: undefined as string | undefined
  },
  // Beach Resorts
  {
    id: "3",
    name: "Tropical Paradise Beach Resort",
    starRating: 4,
    images: [beachResort1, oceanViewHotel1, luxuryPoolHotel1, waterparkResort1],
    location: "Maldives",
    district: "Beachfront",
    distanceFromCenter: "0.1 km",
    guestRating: 9.2,
    reviewCount: 3421,
    amenities: ["beach-access", "water-sports", "all-inclusive", "pool", "spa", "wifi", "restaurant"],
    pricePerNight: 385,
    totalPrice: 1155,
    currency: "$",
    freeCancellation: false,
    payAtProperty: false,
    breakfastIncluded: true,
    dealType: "ALL-INCLUSIVE",
    hotelType: "resort",
    rateKey: undefined as string | undefined
  },
  // Budget Hotels
  {
    id: "4",
    name: "Central Budget Inn",
    starRating: 3,
    images: [budgetHotel1],
    location: "Paris, France",
    district: "Montmartre",
    distanceFromCenter: "3.5 km",
    guestRating: 7.8,
    reviewCount: 1634,
    amenities: ["wifi", "reception-24h", "breakfast"],
    pricePerNight: 65,
    totalPrice: 195,
    currency: "$",
    freeCancellation: true,
    payAtProperty: true,
    breakfastIncluded: false,
    hotelType: "budget",
    rateKey: undefined as string | undefined
  },
  // Business Hotels
  {
    id: "5",
    name: "Executive Business Center Hotel",
    starRating: 4,
    images: [businessHotel1, budgetHotel1],
    location: "Paris, France",
    district: "Business District",
    distanceFromCenter: "4.2 km",
    guestRating: 8.5,
    reviewCount: 2156,
    amenities: ["business-center", "meeting-rooms", "airport-shuttle", "wifi", "gym", "restaurant"],
    pricePerNight: 125,
    totalPrice: 375,
    currency: "$",
    originalPrice: 145,
    freeCancellation: true,
    payAtProperty: false,
    breakfastIncluded: true,
    hotelType: "business",
    rateKey: undefined as string | undefined
  },
  // Spa Hotels
  {
    id: "6",
    name: "Zen Wellness Spa Resort",
    starRating: 5,
    images: [spaHotel1, luxuryPoolHotel1, oceanViewHotel1],
    location: "Bali, Indonesia",
    district: "Ubud",
    distanceFromCenter: "1.8 km",
    guestRating: 9.3,
    reviewCount: 1892,
    amenities: ["spa", "wellness", "massage", "fitness", "pool", "yoga", "meditation"],
    pricePerNight: 220,
    totalPrice: 660,
    currency: "$",
    freeCancellation: true,
    payAtProperty: false,
    breakfastIncluded: true,
    dealType: "SPA PACKAGE",
    hotelType: "spa",
    rateKey: undefined as string | undefined
  },
  // Waterpark Hotels
  {
    id: "7",
    name: "Splash Family Waterpark Resort",
    starRating: 4,
    images: [waterparkResort1, beachResort1, luxuryPoolHotel1],
    location: "Orlando, FL",
    district: "Theme Park Area",
    distanceFromCenter: "5.2 km",
    guestRating: 8.9,
    reviewCount: 4521,
    amenities: ["waterpark", "family-activities", "kids-club", "pool", "restaurant", "wifi"],
    pricePerNight: 180,
    totalPrice: 540,
    currency: "$",
    freeCancellation: true,
    payAtProperty: false,
    breakfastIncluded: true,
    dealType: "FAMILY FUN",
    hotelType: "family",
    rateKey: undefined as string | undefined
  },
  // Ocean View Hotels
  {
    id: "8",
    name: "Oceanfront Luxury Suites",
    starRating: 5,
    images: [oceanViewHotel1, beachResort1, luxuryPoolHotel1],
    location: "Santorini, Greece",
    district: "Oia",
    distanceFromCenter: "0.3 km",
    guestRating: 9.7,
    reviewCount: 1234,
    amenities: ["ocean-view", "beach-access", "infinity-pool", "fine-dining", "spa", "wifi"],
    pricePerNight: 520,
    totalPrice: 1560,
    currency: "$",
    freeCancellation: false,
    payAtProperty: false,
    breakfastIncluded: true,
    dealType: "OCEAN VIEWS",
    hotelType: "luxury",
    rateKey: undefined as string | undefined
  }
];

export type Hotel = typeof mockHotelResults[0];

interface SearchData {
  destination: string;
  checkInDate: Date | null;
  checkOutDate: Date | null;
  guests: {
    adults: number;
    children: number;
    rooms: number;
  };
  category?: string;
  dealType?: string;
  priceRange?: [number, number];
  hotelType?: string;
}

export const useHotelSearch = () => {
  const [searchParams] = useSearchParams();
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | undefined>();
  const [apiStatus, setApiStatus] = useState<'live' | 'demo'>('demo');
  const { toast } = useToast();

  // Parse search parameters
  const searchData: SearchData = {
    destination: searchParams.get('destination') || '',
    checkInDate: searchParams.get('checkInDate') ? new Date(searchParams.get('checkInDate')!) : null,
    checkOutDate: searchParams.get('checkOutDate') ? new Date(searchParams.get('checkOutDate')!) : null,
    guests: {
      adults: parseInt(searchParams.get('adults') || '2'),
      children: parseInt(searchParams.get('children') || '0'),
      rooms: parseInt(searchParams.get('rooms') || '1')
    },
    category: searchParams.get('category') || undefined,
    dealType: searchParams.get('dealType') || undefined,
    priceRange: searchParams.get('priceRange') 
      ? searchParams.get('priceRange')!.split('-').map(Number) as [number, number]
      : undefined,
    hotelType: searchParams.get('hotelType') || undefined
  };

  const searchHotels = async () => {
    setLoading(true);
    
    if (!searchData.destination || !searchData.checkInDate || !searchData.checkOutDate) {
      console.log('Missing required search parameters');
      setLoading(false);
      return;
    }

    try {
      // Use Ratehawk API for hotel search
      console.log('Attempting Ratehawk API search...', {
        destination: searchData.destination,
        checkIn: searchData.checkInDate.toISOString().split('T')[0],
        checkOut: searchData.checkOutDate.toISOString().split('T')[0],
        adults: searchData.guests.adults,
        children: searchData.guests.children,
        rooms: searchData.guests.rooms
      });

      const { data, error } = await supabase.functions.invoke('ratehawk-hotel-search', {
        body: {
          destination: searchData.destination,
          checkIn: searchData.checkInDate.toISOString().split('T')[0],
          checkOut: searchData.checkOutDate.toISOString().split('T')[0],
          adults: searchData.guests.adults,
          children: searchData.guests.children,
          rooms: searchData.guests.rooms
        }
      });

      if (error) {
        console.error('Ratehawk API error:', error);
        throw new Error('API unavailable');
      }

      if (data?.hotels && data.hotels.length > 0) {
        // Transform Ratehawk data to our format
        const transformedHotels = data.hotels.map((hotel: any) => ({
          id: hotel.id,
          name: hotel.name,
          starRating: hotel.star_rating || 4,
          images: hotel.images || [],
          amenities: hotel.amenities || [],
          pricePerNight: hotel.price?.amount || 120,
          currency: hotel.price?.currency || 'USD',
          location: hotel.address,
          guestRating: 8.5,
          roomType: hotel.room_data_trans?.main_name || 'Standard Room'
        }));

        console.log(`Found ${transformedHotels.length} hotels from Ratehawk API`);
        setApiStatus('live');
        setHotels(transformedHotels);
        
        toast({
          title: "Ratehawk Hotels",
          description: `Found ${transformedHotels.length} hotels via Ratehawk`,
        });
      } else {
        throw new Error('No hotels found');
      }
    } catch (err) {
      console.error('Hotel search error, falling back to demo:', err);
      setApiStatus('demo');
      const filteredHotels = applyFilters([...mockHotelResults]);
      setHotels(filteredHotels);
      
      const filterDetails = getFilterSummary();
      toast({
        title: "Demo Mode Active",
        description: `API unavailable - showing ${filteredHotels.length} demo hotels${filterDetails}`,
      });
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = (hotels: Hotel[]): Hotel[] => {
    let filtered = [...hotels];

    // Filter by hotel type (from category cards)
    if (searchData.hotelType) {
      filtered = filterByHotelType(filtered, searchData.hotelType);
    }

    // Filter by category
    if (searchData.category) {
      filtered = filterByCategory(filtered, searchData.category);
    }

    // Filter by deal type
    if (searchData.dealType) {
      filtered = filterByDealType(filtered, searchData.dealType);
    }

    // Filter by price range
    if (searchData.priceRange) {
      filtered = filterByPriceRange(filtered, searchData.priceRange);
    }

    return filtered;
  };

  const filterByHotelType = (hotels: Hotel[], hotelType: string): Hotel[] => {
    const typeFilters: { [key: string]: (hotel: Hotel) => boolean } = {
      'budget': (hotel) => hotel.hotelType === 'budget' || hotel.pricePerNight <= 80,
      'business': (hotel) => hotel.hotelType === 'business' || hotel.amenities.some(a => 
        ['business-center', 'meeting-rooms', 'airport-shuttle'].includes(a)),
      'luxury': (hotel) => hotel.hotelType === 'luxury' || hotel.starRating >= 5 || hotel.pricePerNight >= 200,
      'resort': (hotel) => hotel.hotelType === 'resort' || hotel.amenities.some(a => 
        ['beach-access', 'water-sports', 'all-inclusive'].includes(a))
    };

    const normalizedType = hotelType.toLowerCase().replace(' hotels', '').replace(' resorts', '');
    const filter = typeFilters[normalizedType];
    return filter ? hotels.filter(filter) : hotels;
  };

  // Enhanced filter functions
  const filterByCategory = (hotels: Hotel[], category: string): Hotel[] => {
    const categoryFilters: { [key: string]: (hotel: Hotel) => boolean } = {
      'castle': (hotel) => 
        hotel.hotelType === 'historic' ||
        hotel.name.toLowerCase().includes('castle') || 
        hotel.name.toLowerCase().includes('palace') ||
        hotel.amenities.includes('historic-architecture'),
      'pool': (hotel) => 
        hotel.amenities.some(a => ['pool', 'outdoor-pool', 'infinity-pool'].includes(a)),
      'waterpark': (hotel) => 
        hotel.hotelType === 'family' ||
        hotel.amenities.includes('waterpark') ||
        hotel.name.toLowerCase().includes('waterpark'),
      'spa hotels': (hotel) => 
        hotel.hotelType === 'spa' ||
        hotel.amenities.some(a => ['spa', 'wellness', 'massage'].includes(a)),
      'ocean view': (hotel) => 
        hotel.amenities.some(a => ['ocean-view', 'beach-access'].includes(a)) ||
        hotel.name.toLowerCase().includes('ocean')
    };

    const filter = categoryFilters[category.toLowerCase()];
    return filter ? hotels.filter(filter) : hotels;
  };

  const filterByDealType = (hotels: Hotel[], dealType: string): Hotel[] => {
    switch (dealType.toLowerCase()) {
      case 'vip':
        return hotels.filter(hotel => hotel.starRating >= 5 || hotel.guestRating >= 9.0);
      case 'deal':
        return hotels.filter(hotel => hotel.originalPrice && hotel.originalPrice > hotel.pricePerNight);
      case 'unique':
        return hotels.filter(hotel => hotel.starRating >= 4 && hotel.guestRating >= 8.5);
      default:
        return hotels;
    }
  };

  const filterByPriceRange = (hotels: Hotel[], priceRange: [number, number]): Hotel[] => {
    const [min, max] = priceRange;
    return hotels.filter(hotel => hotel.pricePerNight >= min && hotel.pricePerNight <= max);
  };

  const getFilterSummary = (): string => {
    const filters = [];
    if (searchData.hotelType) filters.push(`${searchData.hotelType} hotels`);
    if (searchData.category) filters.push(`${searchData.category} category`);
    if (searchData.dealType) filters.push(`${searchData.dealType} deals`);
    if (searchData.priceRange) filters.push(`$${searchData.priceRange[0]}-$${searchData.priceRange[1]} range`);
    
    return filters.length > 0 ? ` matching: ${filters.join(', ')}` : '';
  };

  const handleHotelSelect = async (hotel: Hotel) => {
    setSelectedHotel(hotel);
    
    // Check rates before proceeding to booking if we have a rateKey
    if (hotel.rateKey) {
      try {
        toast({
          title: "Checking Rates",
          description: "Verifying current rates for this hotel...",
        });
        
        const rateData = await HotelbedsMappingService.checkRates([hotel.rateKey]);
        
        if (rateData?.success && rateData.hotel) {
          return { success: true, rateKey: hotel.rateKey };
        } else {
          toast({
            title: "Rate Unavailable",
            description: "This rate is no longer available. Please try another hotel.",
            variant: "destructive",
          });
          return { success: false };
        }
      } catch (error) {
        console.error('Rate check failed:', error);
        toast({
          title: "Rate Check Failed",
          description: "Unable to verify rates. Proceeding with booking anyway.",
          variant: "destructive",
        });
        
        return { success: true };
      }
    } else {
      return { success: true };
    }
  };

  const getDurationInNights = () => {
    if (!searchData.checkInDate || !searchData.checkOutDate) return 1;
    const diffTime = searchData.checkOutDate.getTime() - searchData.checkInDate.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getGuestSummary = () => {
    const totalGuests = searchData.guests.adults + searchData.guests.children;
    return `${totalGuests} guest${totalGuests > 1 ? 's' : ''}, ${searchData.guests.rooms} room${searchData.guests.rooms > 1 ? 's' : ''}`;
  };

  useEffect(() => {
    // Always trigger search to show demo data
    searchHotels();
  }, []);

  return {
    hotels,
    loading,
    selectedHotel,
    searchData,
    searchHotels,
    handleHotelSelect,
    getDurationInNights,
    getGuestSummary,
    apiStatus
  };
};