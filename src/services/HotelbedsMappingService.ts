import { supabase } from "@/integrations/supabase/client";

// Enhanced destination mapping for Hotelbeds API
const DESTINATION_MAPPINGS: Record<string, string> = {
  // Major cities - Fixed mapping codes
  'paris': 'PAR',
  'london': 'LON', 
  'madrid': 'MAD',
  'rome': 'ROM',
  'barcelona': 'BCN',
  'amsterdam': 'AMS',
  'berlin': 'BER',
  'vienna': 'VIE',
  'prague': 'PRG',
  'lisbon': 'LIS',
  'athens': 'ATH',
  'istanbul': 'IST',
  'dubai': 'DXB',
  'bangkok': 'BKK',
  'tokyo': 'TYO',
  'singapore': 'SIN',
  'hong kong': 'HKG',
  'new york': 'NYC',
  'los angeles': 'LAX',
  'miami': 'MIA',
  'chicago': 'CHI',
  'las vegas': 'LAS',
  'san francisco': 'SFO',
  'toronto': 'YTO',
  'vancouver': 'YVR',
  'sydney': 'SYD',
  'melbourne': 'MEL',
  'cairo': 'CAI',
  'marrakech': 'RAK',
  'casablanca': 'CAS',
  'cancun': 'CUN',
  'mexico city': 'MEX',
  'rio de janeiro': 'RIO',
  'sao paulo': 'SAO',
  'buenos aires': 'BUE',
  'moscow': 'MOW',
  'st petersburg': 'LED',
  'mumbai': 'BOM',
  'delhi': 'DEL',
  'bangalore': 'BLR',
  'kuala lumpur': 'KUL',
  'jakarta': 'JKT',
  'manila': 'MNL',
  'seoul': 'SEL',
  'beijing': 'PEK',
  'shanghai': 'SHA',
  'bali': 'DPS',
  'phuket': 'HKT',
  'koh samui': 'USM',
  'pattaya': 'UTP',
  'doha': 'DOH',
  'abu dhabi': 'AUH',
  'riyadh': 'RUH',
  'tel aviv': 'TLV',
  'zurich': 'ZUR',
  'geneva': 'GVA',
  'stockholm': 'STO',
  'oslo': 'OSL',
  'copenhagen': 'CPH',
  'helsinki': 'HEL',
  'reykjavik': 'KEF',
  'dublin': 'DUB',
  'edinburgh': 'EDI',
  'brussels': 'BRU',
  'luxembourg': 'LUX',
  'monaco': 'MCO',
  'nice': 'NCE',
  'cannes': 'CEQ',
  'lyon': 'LYS',
  'marseille': 'MRS',
  'milan': 'MIL',
  'florence': 'FLR',
  'venice': 'VCE',
  'naples': 'NAP',
  'palermo': 'PMO',
  'santorini': 'JTR',
  'mykonos': 'JMK',
  'rhodes': 'RHO',
  'crete': 'HER',
  'ibiza': 'IBZ',
  'mallorca': 'PMI',
  'valencia': 'VLC',
  'seville': 'SVQ',
  'bilbao': 'BIO',
  'porto': 'OPO',
  'faro': 'FAO',
  'funchal': 'FNC',
  'las palmas': 'LPA',
  'tenerife': 'TFS'
};

export interface HotelSearchRequest {
  destination: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  rooms: number;
}

export interface HotelRate {
  rateKey: string;
  net: number;
  boardName: string;
  cancellationPolicies?: any[];
  paymentType?: string;
  packaging?: boolean;
}

export interface HotelRoom {
  rateKey: string;
  name: string;
  boardName: string;
  net: number;
  cancellationPolicies: any[];
  paymentType: string;
  packaging: boolean;
}

export interface HotelBooking {
  hotelCode: string;
  hotelName: string;
  checkIn: string;
  checkOut: string;
  totalNet: number;
  currency: string;
  rooms: HotelRoom[];
}

export class HotelbedsMappingService {
  /**
   * Convert user-friendly destination to Hotelbeds destination code with live API lookup
   */
  static async getDestinationCode(destination: string): Promise<string> {
    const normalizedDestination = destination.toLowerCase().trim();
    
    console.log(`Converting destination "${destination}" to code...`);
    
    // Direct mapping first for performance
    if (DESTINATION_MAPPINGS[normalizedDestination]) {
      const code = DESTINATION_MAPPINGS[normalizedDestination];
      console.log(`Found direct mapping: ${destination} -> ${code}`);
      return code;
    }
    
    // Try live API lookup for accurate mapping
    try {
      const { data, error } = await supabase.functions.invoke('hotelbeds-destinations', {
        body: { language: 'ENG' }
      });

      if (!error && data?.mapping) {
        const apiCode = data.mapping[normalizedDestination];
        if (apiCode) {
          console.log(`Found API mapping: ${destination} -> ${apiCode}`);
          return apiCode;
        }
      }
    } catch (error) {
      console.warn('Failed to lookup destination via API, falling back to static mapping:', error);
    }
    
    // Partial matching in static mappings
    for (const [key, code] of Object.entries(DESTINATION_MAPPINGS)) {
      if (normalizedDestination.includes(key) || key.includes(normalizedDestination)) {
        console.log(`Found partial mapping: ${destination} -> ${code} (via ${key})`);
        return code;
      }
    }
    
    // Enhanced fallback with better city detection
    const fallbackCode = this.generateFallbackCode(normalizedDestination);
    console.log(`Using fallback code: ${destination} -> ${fallbackCode}`);
    return fallbackCode;
  }

  /**
   * Synchronous version for backward compatibility
   */
  static getDestinationCodeSync(destination: string): string {
    const normalizedDestination = destination.toLowerCase().trim();
    
    // Direct mapping
    if (DESTINATION_MAPPINGS[normalizedDestination]) {
      return DESTINATION_MAPPINGS[normalizedDestination];
    }
    
    // Partial matching
    for (const [key, code] of Object.entries(DESTINATION_MAPPINGS)) {
      if (normalizedDestination.includes(key) || key.includes(normalizedDestination)) {
        return code;
      }
    }
    
    return this.generateFallbackCode(normalizedDestination);
  }

  /**
   * Generate a better fallback destination code
   */
  static generateFallbackCode(destination: string): string {
    // Remove common words and get meaningful parts
    const cleanDestination = destination
      .replace(/\b(city|hotel|resort|beach|island|airport)\b/g, '')
      .replace(/[^a-z]/g, '')
      .substring(0, 3)
      .toUpperCase();
    
    return cleanDestination.length >= 3 ? cleanDestination : 'DEF';
  }

  /**
   * Search hotels using Hotelbeds API
   */
  static async searchHotels(searchRequest: HotelSearchRequest) {
    const destinationCode = await this.getDestinationCode(searchRequest.destination);
    
    try {
      const { data, error } = await supabase.functions.invoke('hotelbeds-hotels-search', {
        body: {
          destination: destinationCode,
          checkIn: searchRequest.checkIn,
          checkOut: searchRequest.checkOut,
          adults: searchRequest.adults,
          children: searchRequest.children,
          rooms: searchRequest.rooms
        }
      });

      if (error) {
        console.error('Hotel search error:', error);
        throw new Error('Failed to search hotels');
      }

      return data;
    } catch (error) {
      console.error('Unexpected error in hotel search:', error);
      throw error;
    }
  }

  /**
   * Check hotel rates using Hotelbeds API
   */
  static async checkRates(rateKeys: string[], language = 'ENG') {
    try {
      const { data, error } = await supabase.functions.invoke('hotelbeds-check-rates', {
        body: {
          rateKeys,
          language
        }
      });

      if (error) {
        console.error('Rate check error:', error);
        throw new Error('Failed to check rates');
      }

      return data;
    } catch (error) {
      console.error('Unexpected error in rate check:', error);
      throw error;
    }
  }

  /**
   * Create hotel booking using Hotelbeds API
   */
  static async createBooking(bookingData: {
    rateKey: string;
    holder: {
      name: string;
      surname: string;
      email: string;
      phoneNumber: string;
    };
    rooms: Array<{
      rateKey: string;
      paxes: Array<{
        roomId: number;
        type: 'AD' | 'CH';
        age?: number;
        name: string;
        surname: string;
      }>;
    }>;
    clientReference?: string;
    language?: string;
  }) {
    try {
      const { data, error } = await supabase.functions.invoke('hotelbeds-create-booking', {
        body: bookingData
      });

      if (error) {
        console.error('Booking creation error:', error);
        throw new Error('Failed to create booking');
      }

      return data;
    } catch (error) {
      console.error('Unexpected error in booking creation:', error);
      throw error;
    }
  }

  /**
   * Map Hotelbeds hotel data to our frontend format
   */
  static mapHotelData(hotelbedsHotel: any) {
    return {
      id: hotelbedsHotel.code || hotelbedsHotel.id,
      name: hotelbedsHotel.name || 'Unknown Hotel',
      starRating: hotelbedsHotel.categoryCode ? parseInt(hotelbedsHotel.categoryCode) : 0,
      images: hotelbedsHotel.images?.map((img: any) => img.path) || ['/placeholder.svg'],
      location: hotelbedsHotel.destinationName || 'Unknown Location',
      district: hotelbedsHotel.zoneName || 'City Center',
      distanceFromCenter: hotelbedsHotel.distance ? `${hotelbedsHotel.distance}km` : 'N/A',
      guestRating: hotelbedsHotel.ranking ? parseFloat(hotelbedsHotel.ranking) : 0,
      reviewCount: hotelbedsHotel.reviewCount || 0,
      amenities: hotelbedsHotel.facilities?.map((f: any) => f.description) || [],
      pricePerNight: hotelbedsHotel.minRate || 0,
      totalPrice: hotelbedsHotel.totalNet || 0,
      currency: hotelbedsHotel.currency || 'EUR',
      freeCancellation: hotelbedsHotel.cancellationPolicies?.some((p: any) => p.amount === 0) || false,
      payAtProperty: false,
      breakfastIncluded: hotelbedsHotel.rooms?.[0]?.boardName?.toLowerCase().includes('breakfast') || false,
      rateKey: hotelbedsHotel.rooms?.[0]?.rates?.[0]?.rateKey // Important for booking
    };
  }
}