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
   * Search for hotels using Ratehawk API
   */
  static async searchHotels(params: RatehawkSearchParams): Promise<{ hotels: RatehawkHotel[]; search_id: string }> {
    const { data, error } = await supabase.functions.invoke('ratehawk-hotel-search', {
      body: {
        destination: params.destination,
        checkIn: params.checkIn,
        checkOut: params.checkOut,
        adults: params.adults,
        children: params.children || [],
        language: "en",
        currency: "USD",
        residency: "US"
      }
    });

    if (error) {
      throw new Error(`Hotel search failed: ${error.message}`);
    }

    return data;
  }

  /**
   * Get detailed hotel information
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