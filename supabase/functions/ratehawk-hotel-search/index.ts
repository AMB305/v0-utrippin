import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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
    }: RatehawkSearchRequest & { destination: string } = requestData;

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

    // Mock Ratehawk data following exact API format
    const mockRatehawkData: RatehawkHotel[] = [
      {
        id: "test_hotel_do_not_book",
        name: "Mock Hotel Miami Beach",
        stars: 4,
        address: `123 Ocean Drive, ${destinationObj.cityName}`,
        price: {
          amount: 312.50,
          currency: currency
        },
        images: [
          "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&h=600&fit=crop"
        ],
        amenities: ["Pool", "Free WiFi", "Bar", "Breakfast included"]
      },
      {
        id: "hotel_002_premium",
        name: "Premium Resort & Spa",
        stars: 5,
        address: `456 Beach Front, ${destinationObj.cityName}`,
        price: {
          amount: 485.00,
          currency: currency
        },
        images: [
          "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop"
        ],
        amenities: ["Pool", "Free WiFi", "Spa", "All-Inclusive", "Beach Access"]
      },
      {
        id: "hotel_003_business",
        name: "Business District Hotel",
        stars: 4,
        address: `789 Financial District, ${destinationObj.cityName}`,
        price: {
          amount: 225.00,
          currency: currency
        },
        images: [
          "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1578774204375-826dc5d996ed?w=800&h=600&fit=crop"
        ],
        amenities: ["Free WiFi", "Business Center", "Meeting Rooms", "Restaurant"]
      }
    ];

    console.log(`Ratehawk Search - Found ${mockRatehawkData.length} hotels for ${destinationObj.cityName}`);

    return new Response(
      JSON.stringify({ 
        hotels: mockRatehawkData,
        search_id: `search_${Date.now()}`,
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