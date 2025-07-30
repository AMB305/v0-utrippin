import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const RATEHAWK_API_KEY = Deno.env.get('RATEHAWK_API_KEY');
const RATEHAWK_BASE_URL = 'https://api.ratehawk.com/v1';

interface RatehawkSearchRequest {
  language?: string;
  currency?: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children?: number[];
  residency?: string;
  destination: {
    countryCode?: string;
    regionCode?: string;
    cityName: string;
  };
}

interface RatehawkHotel {
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

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestData = await req.json();
    const { 
      destination, 
      checkIn, 
      checkOut, 
      adults = 2, 
      children = [], 
      language = "en",
      currency = "USD",
      residency = "US"
    }: RatehawkSearchRequest & { destination: string; children?: number | number[] } = requestData;

    if (!destination || !checkIn || !checkOut) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters: destination, checkIn, checkOut' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse destination to create proper destination object
    const destinationObj = typeof destination === 'string' 
      ? { cityName: destination, countryCode: "US", regionCode: "" }
      : destination;

    // Mock Ratehawk data following exact API format - RateHawk Test Hotels
    const mockRatehawkData: RatehawkHotel[] = [
      {
        id: "ratehawk_test_miami_main_001",
        name: "RateHawk Test Hotel Miami Beach (Test Hotel - DO NOT BOOK)",
        stars: 4,
        address: `500 Ocean Drive, Miami Beach, FL 33139`,
        price: {
          amount: 312.50,
          currency: currency
        },
        images: [
          "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&h=600&fit=crop"
        ],
        amenities: ["Pool", "Free WiFi", "Bar", "Breakfast included", "Test Hotel"]
      },
      {
        id: "ratehawk_test_miami_main_002",
        name: "RateHawk Demo Premium Resort & Spa (Test Hotel - DO NOT BOOK)",
        stars: 5,
        address: `600 Collins Avenue, Miami Beach, FL 33139`,
        price: {
          amount: 485.00,
          currency: currency
        },
        images: [
          "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop"
        ],
        amenities: ["Pool", "Free WiFi", "Spa", "All-Inclusive", "Beach Access", "Test Hotel"]
      },
      {
        id: "ratehawk_test_miami_main_003",
        name: "RateHawk Test Business Hotel (Test Hotel - DO NOT BOOK)",
        stars: 4,
        address: `700 Biscayne Boulevard, Miami, FL 33132`,
        price: {
          amount: 225.00,
          currency: currency
        },
        images: [
          "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1578774204375-826dc5d996ed?w=800&h=600&fit=crop"
        ],
        amenities: ["Free WiFi", "Business Center", "Meeting Rooms", "Restaurant", "Test Hotel"]
      }
    ];

    console.log(`Ratehawk Search - Found ${mockRatehawkData.length} hotels for ${destinationObj.cityName}`);
    
    // Log certification data for test bookings
    const searchId = `search_${Date.now()}`;
    console.log('🏨 RATEHAWK SEARCH CERTIFICATION LOG:');
    console.log('Request:', JSON.stringify({ destination: destinationObj, checkIn, checkOut, adults, children }, null, 2));
    console.log('Response:', JSON.stringify({ hotels: mockRatehawkData, search_id: searchId, status: "success" }, null, 2));
    console.log('Authentication:', RATEHAWK_API_KEY ? 'API Key Present' : 'No API Key');

    return new Response(
      JSON.stringify({ 
        hotels: mockRatehawkData,
        search_id: searchId,
        status: "success"
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Ratehawk search error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});