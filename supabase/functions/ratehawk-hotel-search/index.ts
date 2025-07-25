import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RatehawkSearchRequest {
  destination: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children?: number;
  rooms?: number;
}

interface RatehawkHotel {
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

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { destination, checkIn, checkOut, adults = 2, children = 0, rooms = 1 }: RatehawkSearchRequest = await req.json();

    if (!destination || !checkIn || !checkOut) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters: destination, checkIn, checkOut' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // For now, return mock data following Ratehawk response format
    // Replace this with actual Ratehawk API call once test keys are provided
    const mockRatehawkData: RatehawkHotel[] = [
      {
        id: "test_hotel_do_not_book",
        name: "Ratehawk Test Hotel",
        address: `${destination} City Center`,
        star_rating: 4,
        images: [
          "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&h=600&fit=crop"
        ],
        amenities: ["wifi", "pool", "spa", "restaurant", "fitness-center"],
        price: {
          amount: 120.00,
          currency: "USD"
        },
        room_data_trans: {
          main_room_type: "Standard Room",
          main_name: "Deluxe King Room with City View"
        }
      },
      {
        id: "hotel_002",
        name: "Premium Resort & Spa",
        address: `${destination} Beach Front`,
        star_rating: 5,
        images: [
          "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop"
        ],
        amenities: ["wifi", "pool", "spa", "restaurant", "beach-access", "all-inclusive"],
        price: {
          amount: 285.00,
          currency: "USD"
        },
        room_data_trans: {
          main_room_type: "Ocean View Suite",
          main_name: "Junior Suite with Ocean View"
        }
      },
      {
        id: "hotel_003",
        name: "Business District Hotel",
        address: `${destination} Financial District`,
        star_rating: 4,
        images: [
          "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1578774204375-826dc5d996ed?w=800&h=600&fit=crop"
        ],
        amenities: ["wifi", "business-center", "meeting-rooms", "restaurant", "fitness-center"],
        price: {
          amount: 165.00,
          currency: "USD"
        },
        room_data_trans: {
          main_room_type: "Business Room",
          main_name: "Executive Room with Work Desk"
        }
      }
    ];

    console.log(`Ratehawk Search - Found ${mockRatehawkData.length} hotels for ${destination}`);

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