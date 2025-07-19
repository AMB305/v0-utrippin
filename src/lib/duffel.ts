// Duffel API client and types
import { supabase } from "@/integrations/supabase/client";

const DUFFEL_API_URL = 'https://api.duffel.com/air';
// Note: Real API key is configured in Supabase edge functions for security

// Core Duffel types
export interface DuffelAirport {
  id: string;
  name: string;
  iata_code: string;
  city_name: string;
  country_name: string;
  latitude: number;
  longitude: number;
}

export interface DuffelAirline {
  id: string;
  name: string;
  iata_code: string;
  logo_symbol_url?: string;
}

export interface DuffelCabin {
  amenities: {
    power?: boolean;
    wifi?: boolean;
  };
  cabin_class: 'first' | 'business' | 'premium_economy' | 'economy';
  marketing_name: string;
}

export interface DuffelSegment {
  id: string;
  aircraft: {
    name: string;
    iata_code: string;
  };
  airline: DuffelAirline;
  arriving_at: string;
  departing_at: string;
  destination: DuffelAirport;
  origin: DuffelAirport;
  duration: string;
  distance: string;
  stops: DuffelAirport[];
}

export interface DuffelSlice {
  id: string;
  segments: DuffelSegment[];
  duration: string;
  destination: DuffelAirport;
  origin: DuffelAirport;
}

export interface DuffelOffer {
  id: string;
  total_amount: string;
  total_currency: string;
  base_amount: string;
  tax_amount: string;
  slices: DuffelSlice[];
  passengers: Array<{
    id: string;
    type: 'adult' | 'child' | 'infant_without_seat';
    age?: number;
  }>;
  cabin_class: string;
  live_mode: boolean;
  expires_at: string;
  available_services: Array<{
    id: string;
    type: string;
    total_amount: string;
    total_currency: string;
  }>;
}

export interface DuffelOfferRequest {
  slices: Array<{
    origin: string; // IATA code
    destination: string; // IATA code
    departure_date: string; // YYYY-MM-DD
  }>;
  passengers: Array<{
    type: 'adult' | 'child' | 'infant_without_seat';
    age?: number;
  }>;
  cabin_class?: 'first' | 'business' | 'premium_economy' | 'economy';
  return_offers?: boolean;
}

// Seat map types
export interface DuffelSeat {
  id: string;
  available: boolean;
  price?: {
    amount: string;
    currency: string;
  };
  designator: string; // e.g., "12A"
  seat_elements: Array<{
    type: 'seat' | 'aisle' | 'wall';
  }>;
}

export interface DuffelSeatMap {
  id: string;
  cabin_class: string;
  layout: {
    rows: number;
    columns: string[];
  };
  seats: DuffelSeat[];
}

export interface DuffelSeatMapResponse {
  data: {
    seat_maps: DuffelSeatMap[];
  };
}

// Baggage types
export interface DuffelBaggageOption {
  id: string;
  type: 'checked' | 'carry_on';
  quantity: number;
  price: {
    amount: string;
    currency: string;
  };
  segment_id: string;
}

export interface DuffelOrderChangeRequest {
  add_services?: string[];
  add_baggage?: Array<{
    segment_id: string;
    quantity: number;
  }>;
}

export interface DuffelOrderChangeResponse {
  data: {
    id: string;
    total_amount: string;
    total_currency: string;
    change_offers: Array<{
      id: string;
      updated_total_amount: string;
      updated_total_currency: string;
    }>;
  };
}

// API client
export class DuffelClient {
  // Search for airports using real Duffel API via edge function with fallback
  async searchAirports(query: string): Promise<{ data: DuffelAirport[] }> {
    try {
      if (!query || query.length < 2) {
        console.log('Query too short, returning empty results');
        return { data: [] }; 
      }
      
      console.log(`🔍 Frontend: Searching airports with query: ${query} (using Supabase functions.invoke)`);
      
      // Use the new Duffel v2 edge function
      const { data, error } = await supabase.functions.invoke('duffel-v2', {
        body: { mode: "airport_search", query }
      });

      if (error) {
        console.error('❌ Frontend: Supabase function error:', error);
        console.log('🔄 Frontend: Falling back to mock data');
        return this.getMockAirports(query);
      }

      // Parse the JSON string response from Supabase
      let parsedData;
      try {
        parsedData = typeof data === 'string' ? JSON.parse(data) : data;
      } catch (parseError) {
        console.error('❌ Frontend: Failed to parse JSON response:', parseError);
        console.log('🔄 Frontend: Falling back to mock data');
        return this.getMockAirports(query);
      }

      if (parsedData?.error) {
        console.error('❌ Frontend: Duffel API error:', parsedData.error, parsedData.message);
        console.log('🔄 Frontend: Falling back to mock data');
        return this.getMockAirports(query);
      }
      
      console.log('✅ Frontend: Parsed airport data:', parsedData?.data?.length || 0, 'airports');
      
      return { data: parsedData?.data || [] };
    } catch (error) {
      console.error('Error searching airports:', error);
      // Fall back to mock data if everything fails
      return this.getMockAirports(query);
    }
  }

  // Mock airport data as fallback
  private getMockAirports(query: string): { data: DuffelAirport[] } {
    const mockAirports: DuffelAirport[] = [
      {
        id: "arp_lhr_gb",
        name: "Heathrow Airport",
        iata_code: "LHR",
        city_name: "London",
        country_name: "United Kingdom",
        latitude: 51.4700,
        longitude: -0.4543
      },
      {
        id: "arp_jfk_us",
        name: "John F. Kennedy International Airport",
        iata_code: "JFK",
        city_name: "New York",
        country_name: "United States",
        latitude: 40.6413,
        longitude: -73.7781
      },
      {
        id: "arp_lax_us",
        name: "Los Angeles International Airport",
        iata_code: "LAX",
        city_name: "Los Angeles",
        country_name: "United States",
        latitude: 33.9416,
        longitude: -118.4085
      },
      {
        id: "arp_mia_us",
        name: "Miami International Airport",
        iata_code: "MIA",
        city_name: "Miami",
        country_name: "United States",
        latitude: 25.7932,
        longitude: -80.2906
      },
      {
        id: "arp_fll_us",
        name: "Fort Lauderdale-Hollywood International Airport",
        iata_code: "FLL",
        city_name: "Fort Lauderdale",
        country_name: "United States",
        latitude: 26.0725,
        longitude: -80.1527
      },
      {
        id: "arp_cdg_fr",
        name: "Charles de Gaulle Airport",
        iata_code: "CDG",
        city_name: "Paris",
        country_name: "France",
        latitude: 49.0097,
        longitude: 2.5479
      },
      {
        id: "arp_dxb_ae",
        name: "Dubai International Airport",
        iata_code: "DXB",
        city_name: "Dubai",
        country_name: "United Arab Emirates",
        latitude: 25.2528,
        longitude: 55.3644
      },
      {
        id: "arp_nrt_jp",
        name: "Narita International Airport",
        iata_code: "NRT",
        city_name: "Tokyo",
        country_name: "Japan",
        latitude: 35.7647,
        longitude: 140.3864
      }
    ];
    
    // Filter airports based on the query
    const filteredAirports = mockAirports.filter(airport => {
      const searchLower = query.toLowerCase();
      return (
        airport.name.toLowerCase().includes(searchLower) ||
        airport.city_name.toLowerCase().includes(searchLower) ||
        airport.country_name.toLowerCase().includes(searchLower) ||
        airport.iata_code.toLowerCase().includes(searchLower)
      );
    });
    
    console.log(`Using mock data: found ${filteredAirports.length} airports for query "${query}"`);
    return { data: filteredAirports };
  }

  // Alternative method using direct fetch (fallback)
  async searchAirportsDirectly(query: string): Promise<{ data: DuffelAirport[] }> {
    try {
      if (!query || query.length < 2) {
        console.log('Query too short, returning empty results');
        return { data: [] }; 
      }
      
      console.log(`Searching airports with query: ${query} (direct HTTP method)`);
      
      // Call the edge function directly via HTTP (supports both GET and POST)
      const response = await fetch(`https://ytraidksgwxttjeevjuc.supabase.co/functions/v1/duffel-search-airports`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0cmFpZGtzZ3d4dHRqZWV2anVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1NzYwOTYsImV4cCI6MjA2NzE1MjA5Nn0.JrVIUPfYYzwBf3zfbdYQx0Up0X_jax23XpcLsSdBmmw`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        console.error(`Edge function error: ${response.status} ${response.statusText}`);
        return { data: [] };
      }
      
      const data = await response.json();
      
      if (data?.error) {
        console.error('Duffel API error:', data.error, data.message);
        return { data: [] };
      }
      
      console.log('Airport search results (direct):', data);
      return data || { data: [] };
    } catch (error) {
      console.error('Error searching airports:', error);
      return { data: [] };
    }
  }

  // Get nearby airports within specified radius
  async getNearbyAirports(airportId: string, radiusMiles: number = 50): Promise<{ data: DuffelAirport[] }> {
    // For now, return empty - this would need a separate Duffel API endpoint
    try {
      // This is a mock implementation - in a real app, you would call a proper API endpoint
      console.log(`Getting airports near ${airportId} within ${radiusMiles} miles`);
      return { data: [] };
    } catch (error) {
      console.error('Error getting nearby airports:', error);
      return { data: [] };
    }
  }

  // Get price calendar data for a route
  async getPriceCalendar(
    origin: string, 
    destination: string, 
    month: Date,
    passengers: Array<{ type: 'adult' | 'child' | 'infant_without_seat' }> = [{ type: 'adult' }]
  ): Promise<{ data: Array<{ date: string; price: string; currency: string }> }> {
    // Mock price data for calendar - can be implemented with real API later
    const prices: Array<{ date: string; price: string; currency: string }> = [];
    const startDate = new Date(month.getFullYear(), month.getMonth(), 1);
    const endDate = new Date(month.getFullYear(), month.getMonth() + 1, 0);
    
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const basePrice = 200 + Math.random() * 600; // Random price between $200-$800
      const weekendMultiplier = (d.getDay() === 0 || d.getDay() === 6) ? 1.3 : 1;
      const finalPrice = Math.round(basePrice * weekendMultiplier);
      
      prices.push({
        date: d.toISOString().split('T')[0],
        price: finalPrice.toString(),
        currency: 'USD'
      });
    }
    
    return Promise.resolve({ data: prices });
  }

  // Create offer request to search flights using real Duffel API
  async createOfferRequest(request: DuffelOfferRequest): Promise<{ data: DuffelOffer[] }> {
    try {
      console.log('Creating offer request with real Duffel API:', request);
      
      // Use the new Duffel v2 edge function for flight search
      const { data, error } = await supabase.functions.invoke('duffel-v2', {
        body: { mode: "search_offers", offerRequest: request }
      });

      if (error) {
        console.error('Supabase function error:', error);
        return { data: [] };
      }
      
      if (data?.error) {
        console.error('Duffel API error:', data.error);
        return { data: [] };
      }
      
      console.log('Flight search results:', data);
      return data || { data: [] };
    } catch (error) {
      console.error('Error searching flights:', error);
      return { data: [] };
    }
  }

  // Get specific offer details using real Duffel API
  async getOffer(offerId: string): Promise<{ data: DuffelOffer }> {
    try {
      const response = await fetch(`${DUFFEL_API_URL}/offers/${offerId}`, {
        headers: {
          'Content-Type': 'application/json',
          'Duffel-Version': '2023-11-01',
        },
      });

      if (!response.ok) {
        throw new Error(`Duffel API error: ${response.status} ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error('Error getting offer:', error);
      throw error;
    }
  }

  // Get seat maps for an offer
  async getSeatMaps(offerId: string): Promise<DuffelSeatMapResponse> {
    try {
      console.log('Fetching seat maps for offer:', offerId);
      
      const { data, error } = await supabase.functions.invoke('duffel-v2', {
        body: { mode: "seat_maps", offerId }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error('Failed to fetch seat maps');
      }
      
      if (data?.error) {
        console.error('Duffel API error:', data.error);
        throw new Error(data.error);
      }
      
      console.log('Seat maps response:', data);
      return data;
    } catch (error) {
      console.error('Error fetching seat maps:', error);
      throw error;
    }
  }

  // Request order changes for baggage
  async requestOrderChanges(request: DuffelOrderChangeRequest): Promise<DuffelOrderChangeResponse> {
    try {
      console.log('Requesting order changes:', request);
      
      const { data, error } = await supabase.functions.invoke('duffel-v2', {
        body: { mode: "order_changes", orderChangeRequest: request }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error('Failed to request order changes');
      }
      
      if (data?.error) {
        console.error('Duffel API error:', data.error);
        throw new Error(data.error);
      }
      
      console.log('Order changes response:', data);
      return data;
    } catch (error) {
      console.error('Error requesting order changes:', error);
      throw error;
    }
  }

  // Create order (book flight) - this uses the existing edge function
  async createOrder(data: {
    selected_offers: string[];
    passengers: Array<{
      id?: string;
      title?: string;
      given_name: string;
      family_name: string;
      born_on: string;
      email: string;
      phone_number: string;
      type: 'adult' | 'child' | 'infant_without_seat';
    }>;
    payments: Array<{
      type: 'balance';
      amount: string;
      currency: string;
    }>;
    selected_seats?: string[];
    selected_baggage?: Array<{
      segment_id: string;
      quantity: number;
    }>;
  }): Promise<any> {
    // This will be handled by the existing create-flight-booking edge function
    throw new Error('Use create-flight-booking edge function for booking');
  }
}

// Singleton instance
export const duffelClient = new DuffelClient();

// Utility functions
export const formatDuration = (duration: string): string => {
  try {
    // Convert ISO 8601 duration to readable format
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
    if (!match) return duration;
    
    const hours = parseInt(match[1] || '0');
    const minutes = parseInt(match[2] || '0');
    
    if (hours === 0) return `${minutes}m`;
    if (minutes === 0) return `${hours}h`;
    return `${hours}h ${minutes}m`;
  } catch (error) {
    console.error('Error formatting duration:', error);
    return duration;
  }
};

export const formatPrice = (amount: string, currency: string): string => {
  const numAmount = parseFloat(amount);
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(numAmount);
};

export const calculateStops = (segments: DuffelSegment[]): string => {
  if (segments.length === 1) return 'Direct';
  return `${segments.length - 1} stop${segments.length > 2 ? 's' : ''}`;
};