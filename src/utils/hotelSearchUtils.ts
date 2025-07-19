import { addDays } from "date-fns";

export interface HotelSearchParams {
  destination: string;
  checkInDate: Date | null;
  checkOutDate: Date | null;
  adults: number;
  children: number;
  rooms: number;
  category?: string;
  dealType?: string;
  priceRange?: [number, number];
  amenities?: string[];
  hotelType?: string;
}

// Category to destination mapping for specific hotel types
export const categoryDestinationMapping: { [key: string]: { destinations: string[], amenities?: string[], hotelType?: string } } = {
  'castle': {
    destinations: ['Scotland', 'Ireland', 'France', 'Germany', 'England'],
    hotelType: 'historic'
  },
  'pool': {
    destinations: ['Global'],
    amenities: ['pool', 'outdoor-pool']
  },
  'waterpark': {
    destinations: ['Orlando', 'Dubai', 'Singapore', 'Bahamas', 'Costa Rica'],
    amenities: ['waterpark', 'family-activities', 'kids-club']
  },
  'spa hotels': {
    destinations: ['Global'],
    amenities: ['spa', 'wellness', 'massage', 'fitness']
  },
  'ocean view': {
    destinations: ['Maldives', 'Hawaii', 'Santorini', 'Bali', 'Cabo', 'Miami'],
    amenities: ['beach-access', 'ocean-view']
  }
};

// Hotel type to search parameters mapping
export const hotelTypeMapping: { [key: string]: { destinations: string[], amenities?: string[], priceRange: [number, number], hotelType?: string } } = {
  'budget hotels': {
    destinations: ['Global'],
    amenities: ['wifi', 'reception-24h'],
    priceRange: [20, 80],
    hotelType: 'budget'
  },
  'business hotels': {
    destinations: ['Global'],
    amenities: ['business-center', 'meeting-rooms', 'airport-shuttle', 'wifi'],
    priceRange: [80, 150],
    hotelType: 'business'
  },
  'luxury hotels': {
    destinations: ['Global'],
    amenities: ['concierge', 'fine-dining', 'spa', 'room-service'],
    priceRange: [200, 500],
    hotelType: 'luxury'
  },
  'beach resorts': {
    destinations: ['Maldives', 'Hawaii', 'Bahamas', 'Cabo', 'Miami', 'Barbados'],
    amenities: ['beach-access', 'water-sports', 'all-inclusive', 'pool'],
    priceRange: [100, 300],
    hotelType: 'resort'
  }
};

export const createSearchParams = (params: HotelSearchParams): URLSearchParams => {
  const searchParams = new URLSearchParams();
  
  if (params.destination) searchParams.set('destination', params.destination);
  if (params.checkInDate) searchParams.set('checkInDate', params.checkInDate.toISOString());
  if (params.checkOutDate) searchParams.set('checkOutDate', params.checkOutDate.toISOString());
  searchParams.set('adults', params.adults.toString());
  searchParams.set('children', params.children.toString());
  searchParams.set('rooms', params.rooms.toString());
  if (params.category) searchParams.set('category', params.category);
  if (params.dealType) searchParams.set('dealType', params.dealType);
  if (params.priceRange) searchParams.set('priceRange', `${params.priceRange[0]}-${params.priceRange[1]}`);
  
  return searchParams;
};

export const getDefaultSearchDates = () => {
  const checkIn = addDays(new Date(), 7); // 1 week from now
  const checkOut = addDays(checkIn, 2); // 2 nights stay
  return { checkIn, checkOut };
};

export const createDestinationSearchParams = (destination: string): HotelSearchParams => {
  const { checkIn, checkOut } = getDefaultSearchDates();
  return {
    destination,
    checkInDate: checkIn,
    checkOutDate: checkOut,
    adults: 2,
    children: 0,
    rooms: 1
  };
};

export const createDealSearchParams = (
  destination: string, 
  dealType: string,
  priceRange?: [number, number]
): HotelSearchParams => {
  const { checkIn, checkOut } = getDefaultSearchDates();
  return {
    destination,
    checkInDate: checkIn,
    checkOutDate: checkOut,
    adults: 2,
    children: 0,
    rooms: 1,
    dealType,
    priceRange
  };
};

export const createCategorySearchParams = (
  destination: string,
  category: string
): HotelSearchParams => {
  const { checkIn, checkOut } = getDefaultSearchDates();
  const categoryMapping = categoryDestinationMapping[category.toLowerCase()];
  
  // Use specific destination for the category, or default to first destination in mapping
  const categoryDestination = categoryMapping?.destinations[0] || destination;
  
  return {
    destination: categoryDestination,
    checkInDate: checkIn,
    checkOutDate: checkOut,
    adults: 2,
    children: 0,
    rooms: 1,
    category,
    amenities: categoryMapping?.amenities,
    hotelType: categoryMapping?.hotelType
  };
};

export const createHotelTypeSearchParams = (
  hotelType: string
): HotelSearchParams => {
  const { checkIn, checkOut } = getDefaultSearchDates();
  const typeMapping = hotelTypeMapping[hotelType.toLowerCase()];
  
  if (!typeMapping) {
    // Fallback for unknown hotel types
    return {
      destination: 'Global',
      checkInDate: checkIn,
      checkOutDate: checkOut,
      adults: 2,
      children: 0,
      rooms: 1,
      hotelType
    };
  }
  
  return {
    destination: typeMapping.destinations[0],
    checkInDate: checkIn,
    checkOutDate: checkOut,
    adults: 2,
    children: 0,
    rooms: 1,
    hotelType: typeMapping.hotelType,
    amenities: typeMapping.amenities,
    priceRange: typeMapping.priceRange
  };
};