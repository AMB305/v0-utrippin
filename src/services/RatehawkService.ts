import { supabase } from '@/integrations/supabase/client';

export interface RatehawkHotel {
  id: string;
  name: string;
  stars: number;
  address: string;
  price: {
    amount: number;
    currency: string;
  };
  images: string[];
  amenities?: string[];
}

export interface RatehawkSearchParams {
  language?: string;
  currency?: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children?: number[];
  residency?: string;
  destination: string | {
    countryCode?: string;
    regionCode?: string;
    cityName: string;
  };
}

export interface RatehawkPrebookResponse {
  prebookId: string;
  finalPrice: {
    amount: number;
    currency: string;
  };
  expiresAt: string;
  available: boolean;
  hotelId: string;
  roomId?: string;
  cancellationPolicy: string;
}

export interface RatehawkGuestInfo {
  firstName: string;
  lastName: string;
  email: string;
}

export class RatehawkService {
  /**
   * Suggest destinations and hotels by name (autocomplete)
   */
  static async suggestDestinations(query: string, language = 'en'): Promise<any> {
    console.log(`🧠 Calling Ratehawk suggest API with query: '${query}'`);
    
    const { data, error } = await supabase.functions.invoke('ratehawk-suggest', {
      body: { query, language }
    });

    if (error) {
      console.error('❌ Suggest API error:', error);
      throw new Error(`Destination suggest failed: ${error.message}`);
    }

    console.log('✅ Suggest API response:', data);
    return data;
  }

  /**
   * Search for hotels using Ratehawk region search API
   */
  static async searchHotelsByRegion(params: {
    checkin: string;
    checkout: string;
    region_id: number;
    guests: Array<{ adults: number; children: number[] }>;
    currency?: string;
    language?: string;
    residency?: string;
  }): Promise<any> {
    const { data, error } = await supabase.functions.invoke('ratehawk-search-region', {
      body: {
        checkin: params.checkin,
        checkout: params.checkout,
        region_id: params.region_id,
        guests: params.guests,
        currency: params.currency || 'USD',
        language: params.language || 'en',
        residency: params.residency || 'us'
      }
    });

    if (error) {
      throw new Error(`Hotel search failed: ${error.message}`);
    }

    return data;
  }

  /**
   * Find region ID for a destination using the suggest API
   */
  static async findRegionId(destination: string): Promise<number | null> {
    try {
      console.log(`🔍 Finding region ID for destination: ${destination}`);
      const suggestions = await this.suggestDestinations(destination);
      
      console.log('🧠 Suggest response structure:', JSON.stringify(suggestions, null, 2));
      
      // Check multiple possible response structures
      // Structure 1: data.regions (current assumption)
      if (suggestions.data && suggestions.data.regions && suggestions.data.regions.length > 0) {
        console.log('✅ Found regions array in data.regions');
        
        // Prioritize City type regions first, then other types
        const cityRegion = suggestions.data.regions.find((region: any) => 
          region.type === 'City' && 
          region.name.toLowerCase().includes(destination.toLowerCase())
        );
        
        if (cityRegion) {
          console.log(`✅ Found city region: ${cityRegion.name} (ID: ${cityRegion.id})`);
          return parseInt(cityRegion.id);
        }
        
        // Fallback to any region that matches the destination name
        const anyRegion = suggestions.data.regions.find((region: any) => 
          region.name.toLowerCase().includes(destination.toLowerCase())
        );
        
        if (anyRegion) {
          console.log(`✅ Found matching region: ${anyRegion.name} (ID: ${anyRegion.id})`);
          return parseInt(anyRegion.id);
        }
        
        // If no name match, return the first region (often the most relevant)
        console.log(`✅ Using first available region: ${suggestions.data.regions[0].name} (ID: ${suggestions.data.regions[0].id})`);
        return parseInt(suggestions.data.regions[0].id);
      }
      
      // Structure 2: data.locations (alternative structure)
      if (suggestions.data && suggestions.data.locations && suggestions.data.locations.length > 0) {
        console.log('✅ Found locations array in data.locations');
        const location = suggestions.data.locations[0];
        if (location.region_id) {
          console.log(`✅ Found region_id in location: ${location.region_id}`);
          return parseInt(location.region_id);
        }
        if (location.id) {
          console.log(`✅ Using location.id as region_id: ${location.id}`);
          return parseInt(location.id);
        }
      }
      
      // Structure 3: Direct data array
      if (suggestions.data && Array.isArray(suggestions.data) && suggestions.data.length > 0) {
        console.log('✅ Found direct data array');
        const item = suggestions.data[0];
        if (item.region_id) {
          console.log(`✅ Found region_id: ${item.region_id}`);
          return parseInt(item.region_id);
        }
        if (item.id) {
          console.log(`✅ Using item.id as region_id: ${item.id}`);
          return parseInt(item.id);
        }
      }
      
      console.warn('❌ No valid region found in any expected structure');
      return null;
    } catch (error) {
      console.error('❌ Failed to find region ID:', error);
      return null;
    }
  }

  /**
   * Search for hotels (main method that handles the full workflow)
   */
  static async searchHotels(params: RatehawkSearchParams): Promise<{ hotels: RatehawkHotel[]; search_id: string }> {
    // If destination is a string, we need to find the region ID first
    if (typeof params.destination === 'string') {
      console.log('Searching for destination:', params.destination);
      
      // Step 1: Find region ID using suggest API
      const regionId = await this.findRegionId(params.destination);
      
      if (!regionId) {
        throw new Error(`Could not find region for destination: ${params.destination}`);
      }
      
      console.log('Found region ID:', regionId);
      
      // Step 2: Search hotels using the region ID
      const guests = [{ adults: params.adults, children: params.children || [] }];
      const result = await this.searchHotelsByRegion({
        checkin: params.checkIn,
        checkout: params.checkOut,
        region_id: regionId,
        guests,
        currency: params.currency,
        language: params.language,
        residency: params.residency
      });
      
      // Transform to legacy format
      return {
        hotels: result.data?.hotels || [],
        search_id: result.data?.search_id || 'auto_generated'
      };
    }
    
    // Handle object destination (legacy compatibility)
    if (typeof params.destination === 'object' && 'regionCode' in params.destination) {
      const regionId = parseInt(params.destination.regionCode || '0');
      if (regionId) {
        const guests = [{ adults: params.adults, children: params.children || [] }];
        const result = await this.searchHotelsByRegion({
          checkin: params.checkIn,
          checkout: params.checkOut,
          region_id: regionId,
          guests,
          currency: params.currency,
          language: params.language,
          residency: params.residency
        });
        
        // Transform to legacy format
        return {
          hotels: result.data?.hotels || [],
          search_id: result.data?.search_id || 'legacy'
        };
      }
    }

    throw new Error('Invalid destination format');
  }

  /**
   * Get hotel page with detailed rates and information
   */
  static async getHotelPage(params: {
    checkin: string;
    checkout: string;
    hotel_id: string;
    guests: Array<{ adults: number; children: number[] }>;
    currency?: string;
    language?: string;
    residency?: string;
  }): Promise<any> {
    const { data, error } = await supabase.functions.invoke('ratehawk-hotel-page', {
      body: params
    });

    if (error) {
      throw new Error(`Hotel page failed: ${error.message}`);
    }

    return data;
  }

  /**
   * Get detailed hotel information (legacy method)
   */
  static async getHotelInfo(hotelId: string): Promise<any> {
    const { data, error } = await supabase.functions.invoke('ratehawk-hotel-info', {
      body: { hotelId }
    });

    if (error) {
      throw new Error(`Hotel info failed: ${error.message}`);
    }

    return data;
  }

  /**
   * Prebook hotel room (check availability and pricing)
   */
  static async prebookHotel(params: {
    hotelId: string;
    roomId?: string;
    checkIn: string;
    checkOut: string;
    adults: number;
    children?: number[];
  }): Promise<RatehawkPrebookResponse> {
    const { data, error } = await supabase.functions.invoke('ratehawk-hotel-prebook', {
      body: {
        roomId: params.roomId || "rm101",
        hotelId: params.hotelId,
        checkIn: params.checkIn,
        checkOut: params.checkOut,
        guests: {
          adults: params.adults,
          children: params.children || []
        }
      }
    });

    if (error) {
      throw new Error(`Prebook failed: ${error.message}`);
    }

    return data;
  }

  /**
   * Book hotel room
   */
  static async bookHotel(prebookId: string, guestInfo: RatehawkGuestInfo): Promise<any> {
    const { data, error } = await supabase.functions.invoke('ratehawk-hotel-book', {
      body: {
        prebookId,
        guest: guestInfo
      }
    });

    if (error) {
      throw new Error(`Booking failed: ${error.message}`);
    }

    return data;
  }

  /**
   * Cancel hotel booking
   */
  static async cancelBooking(bookingId: string, reason?: string): Promise<any> {
    const { data, error } = await supabase.functions.invoke('ratehawk-hotel-cancel', {
      body: {
        reservationId: bookingId
      }
    });

    if (error) {
      throw new Error(`Cancellation failed: ${error.message}`);
    }

    return data;
  }

  /**
   * Transform Ratehawk hotel data to app format
   */
  static transformHotelData(ratehawkHotel: RatehawkHotel) {
    return {
      id: ratehawkHotel.id,
      name: ratehawkHotel.name,
      starRating: ratehawkHotel.stars || 4,
      images: ratehawkHotel.images || [],
      amenities: ratehawkHotel.amenities || [],
      pricePerNight: ratehawkHotel.price?.amount || 120,
      currency: ratehawkHotel.price?.currency || 'USD',
      location: ratehawkHotel.address,
      guestRating: 8.5, // Mock rating as not provided by Ratehawk
      reviewCount: 1200, // Mock review count
      freeCancellation: true,
      payAtProperty: false,
      breakfastIncluded: false
    };
  }

  /**
   * Format search parameters for API calls
   */
  static formatSearchParams(params: RatehawkSearchParams): RatehawkSearchParams {
    return {
      destination: params.destination,
      checkIn: params.checkIn,
      checkOut: params.checkOut,
      adults: Math.max(1, params.adults),
      children: params.children || [],
      language: "en",
      currency: "USD",
      residency: "US"
    };
  }

  /**
   * Validate booking data before submission
   */
  static validateBookingData(guestInfo: RatehawkGuestInfo): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!guestInfo.firstName?.trim()) {
      errors.push('First name is required');
    }

    if (!guestInfo.lastName?.trim()) {
      errors.push('Last name is required');
    }

    if (!guestInfo.email?.trim()) {
      errors.push('Email is required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guestInfo.email)) {
      errors.push('Valid email is required');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Check if hotel is test hotel for certification
   */
  static isTestHotel(hotelId: string): boolean {
    return hotelId === 'test_hotel_do_not_book';
  }

  /**
   * Log API calls for certification tracking
   */
  static logCertificationCall(endpoint: string, data: any, response: any) {
    if (this.isTestHotel(data.hotelId || data.reservationId || data.prebookId)) {
      console.log(`🧪 RATEHAWK CERTIFICATION LOG - ${endpoint}:`, {
        request: data,
        response: response,
        timestamp: new Date().toISOString()
      });
    }
  }
}