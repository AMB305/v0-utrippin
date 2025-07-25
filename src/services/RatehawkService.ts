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
      console.error('❌ Error details:', JSON.stringify(error, null, 2));
      // Log the specific error properties
      console.error('❌ Error message:', error.message);
      console.error('❌ Error name:', error.name);
      console.error('❌ Error context:', error.context);
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
    try {
      console.log('🔍 Searching hotels by region:', params.region_id);
      
      const { data, error } = await supabase.functions.invoke('ratehawk-search-region', {
        body: {
          hotel_id: params.region_id.toString(), // Convert region_id to hotel_id for hotel-based search
          checkin: params.checkin,
          checkout: params.checkout,
          guests: params.guests,
          currency: params.currency,
          language: params.language,
          residency: params.residency
        }
      });

      if (error) {
        console.error('❌ Hotel search error:', error);
        throw new Error(`Hotel search failed: ${error.message}`);
      }

      if (!data || data.status !== 'ok') {
        throw new Error('Invalid response from hotel search');
      }

      console.log(`✅ Found hotel data`);
      
      return data;
    } catch (error) {
      console.error('Hotel search error:', error);
      throw error;
    }
  }

  // New method for complete workflow testing
  async executeCompleteWorkflow(params: {
    hotel_id?: string;
    checkin: string;
    checkout: string;
    guests: Array<{ adults: number; children: number[] }>;
    currency?: string;
    language?: string;
    residency?: string;
  }): Promise<any> {
    try {
      console.log('🔍 Executing complete RateHawk workflow');
      
      const { data, error } = await supabase.functions.invoke('ratehawk-complete-workflow', {
        body: params
      });

      if (error) {
        console.error('❌ Complete workflow error:', error);
        throw new Error(`Complete workflow failed: ${error.message}`);
      }

      console.log('✅ Complete workflow executed successfully');
      
      return data;
    } catch (error) {
      console.error('Complete workflow error:', error);
      throw error;
    }
  }

  /**
   * Find region ID for a destination using the suggest API
   */
  static async findRegionId(destination: string): Promise<number | null> {
    try {
      console.log(`🔍 Finding region ID for destination: ${destination}`);
      
      // Temporary hardcoded region IDs for testing while we fix the suggest API
      const knownRegions: { [key: string]: number } = {
        'miami': 19333,
        'new york': 20088,
        'los angeles': 21605,
        'chicago': 22320,
        'san francisco': 21621,
        'las vegas': 21667,
        'orlando': 19384,
        'paris': 146,
        'london': 26887,
        'tokyo': 17562
      };
      
      const destinationLower = destination.toLowerCase();
      
      // Check for exact or partial matches
      for (const [key, regionId] of Object.entries(knownRegions)) {
        if (destinationLower.includes(key) || key.includes(destinationLower)) {
          console.log(`✅ Found hardcoded region ID for ${destination}: ${regionId}`);
          return regionId;
        }
      }
      
      // If no hardcoded match, try the suggest API
      try {
        const suggestions = await this.suggestDestinations(destination);
        
        console.log('🧠 Suggest response structure:', JSON.stringify(suggestions, null, 2));
        
        // Handle the new Ratehawk API response structure
        // Structure: { locations: [ { id, name, type, country, region_id } ] }
        if (suggestions.locations && Array.isArray(suggestions.locations) && suggestions.locations.length > 0) {
          console.log('✅ Found locations array in response');
          
          // Prioritize locations with exact name match first
          const exactMatch = suggestions.locations.find((location: any) => 
            location.name && location.name.toLowerCase() === destination.toLowerCase()
          );
          
          if (exactMatch && exactMatch.region_id) {
            console.log(`✅ Found exact match: ${exactMatch.name} (region_id: ${exactMatch.region_id})`);
            return parseInt(exactMatch.region_id);
          }
          
          // Fallback to any location that contains the destination name
          const partialMatch = suggestions.locations.find((location: any) => 
            location.name && location.name.toLowerCase().includes(destination.toLowerCase())
          );
          
          if (partialMatch && partialMatch.region_id) {
            console.log(`✅ Found partial match: ${partialMatch.name} (region_id: ${partialMatch.region_id})`);
            return parseInt(partialMatch.region_id);
          }
          
          // If no name match, use the first location with a region_id
          const firstWithRegion = suggestions.locations.find((location: any) => location.region_id);
          if (firstWithRegion) {
            console.log(`✅ Using first location with region_id: ${firstWithRegion.name} (region_id: ${firstWithRegion.region_id})`);
            return parseInt(firstWithRegion.region_id);
          }
          
          // If no region_id, try using the location id as region_id
          const firstLocation = suggestions.locations[0];
          if (firstLocation && firstLocation.id) {
            console.log(`✅ Using location.id as region_id: ${firstLocation.name} (id: ${firstLocation.id})`);
            return parseInt(firstLocation.id);
          }
        }
      } catch (suggestError) {
        console.warn('⚠️ Suggest API failed, using hardcoded fallback:', suggestError);
      }
      
      // Default fallback for Miami area
      if (destinationLower.includes('mia') || destinationLower.includes('florida')) {
        console.log(`✅ Using Miami fallback region ID: 19333`);
        return 19333;
      }
      
      console.warn('❌ No valid region found in response');
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
    console.log('🔍 Getting hotel info for:', hotelId);
    
    try {
      const { data, error } = await supabase.functions.invoke('ratehawk-hotel-page', {
        body: {
          checkin: '2025-07-25',
          checkout: '2025-08-01',
          hotel_id: hotelId,
          guests: [{ adults: 2, children: [] }],
          currency: 'USD',
          language: 'en',
          residency: 'us'
        }
      });

      console.log('🔍 Raw response:', { data, error });

      if (error) {
        console.error('❌ Hotel info API error:', error);
        throw new Error(`Hotel info failed: ${error.message}`);
      }

      if (!data) {
        console.error('❌ No data returned from hotel page API');
        throw new Error('No hotel data returned');
      }

      // Handle the response structure - check if it's wrapped in status/data
      const hotel = data.status === 'ok' ? data.data : data;
      console.log('✅ Processed hotel data:', hotel);
      
      // Inject fallback policies if missing
      if (!hotel.policies) {
        hotel.policies = {
          check_in: '14:00',
          check_out: '12:00',
          children: 'Children allowed',
          pets: 'Pets not allowed'
        };
      }

      return hotel;
    } catch (error) {
      console.error('❌ getHotelInfo error:', error);
      throw error;
    }
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
    console.log('🔍 Starting prebook for hotel:', params);
    
    try {
      const { data, error } = await supabase.functions.invoke('ratehawk-hotel-prebook', {
        body: {
          book_hash: `test_book_hash_${Date.now()}` // Use a test book_hash instead of roomId
        }
      });

      console.log('🔍 Prebook response:', { data, error });

      if (error) {
        console.error('❌ Prebook API error:', error);
        throw new Error(`Prebook failed: ${error.message}`);
      }

      if (!data) {
        console.error('❌ No data returned from prebook API');
        throw new Error('No prebook data returned');
      }

      console.log('✅ Prebook successful:', data);
      return data;
    } catch (error) {
      console.error('❌ prebookHotel error:', error);
      throw error;
    }
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