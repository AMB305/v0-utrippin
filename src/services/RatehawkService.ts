import { supabase } from '@/integrations/supabase/client';

export interface RatehawkHotel {
  id: string;
  name: string;
  address: string;
  star_rating: number;
  images: string[];
  amenities: string[];
  price: {
    amount: number;
    currency: string;
  };
  room_data_trans: {
    main_room_type: string;
    main_name: string;
  };
}

export interface RatehawkSearchParams {
  destination: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children?: number;
  rooms?: number;
}

export interface RatehawkPrebookResponse {
  prebook_id: string;
  hotel_id: string;
  room_data: {
    room_name: string;
    bed_type: string;
    max_occupancy: number;
  };
  price: {
    amount: number;
    currency: string;
    taxes_included: boolean;
  };
  cancellation_policy: {
    is_free_cancellation: boolean;
    free_cancellation_until: string;
    penalty_amount?: number;
  };
  booking_conditions: string[];
  expires_at: string;
  status: string;
}

export interface RatehawkGuestInfo {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
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
        children: params.children || 0,
        rooms: params.rooms || 1
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
      body: { hotel_id: hotelId }
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
    hotel_id: string;
    check_in: string;
    check_out: string;
    adults: number;
    children?: number;
    rooms?: number;
  }): Promise<RatehawkPrebookResponse> {
    const { data, error } = await supabase.functions.invoke('ratehawk-hotel-prebook', {
      body: {
        hotel_id: params.hotel_id,
        check_in: params.check_in,
        check_out: params.check_out,
        adults: params.adults,
        children: params.children || 0,
        rooms: params.rooms || 1
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
        prebook_id: prebookId,
        guest_info: guestInfo
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
        booking_id: bookingId,
        reason: reason || "User requested cancellation"
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
      starRating: ratehawkHotel.star_rating || 4,
      images: ratehawkHotel.images || [],
      amenities: ratehawkHotel.amenities || [],
      pricePerNight: ratehawkHotel.price?.amount || 120,
      currency: ratehawkHotel.price?.currency || 'USD',
      location: ratehawkHotel.address,
      roomType: ratehawkHotel.room_data_trans?.main_name || 'Standard Room',
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
      destination: params.destination.trim(),
      checkIn: params.checkIn,
      checkOut: params.checkOut,
      adults: Math.max(1, params.adults),
      children: Math.max(0, params.children || 0),
      rooms: Math.max(1, params.rooms || 1)
    };
  }

  /**
   * Validate booking data before submission
   */
  static validateBookingData(guestInfo: RatehawkGuestInfo): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!guestInfo.first_name?.trim()) {
      errors.push('First name is required');
    }

    if (!guestInfo.last_name?.trim()) {
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
    if (this.isTestHotel(data.hotel_id || data.booking_id)) {
      console.log(`🧪 RATEHAWK CERTIFICATION LOG - ${endpoint}:`, {
        request: data,
        response: response,
        timestamp: new Date().toISOString()
      });
    }
  }
}