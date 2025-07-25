import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RatehawkHotelInfo {
  id: string;
  name: string;
  address: string;
  star_rating: number;
  description: string;
  images: string[];
  amenities: {
    general: string[];
    room: string[];
    business: string[];
  };
  location: {
    latitude: number;
    longitude: number;
  };
  policies: {
    check_in: string;
    check_out: string;
    cancellation: string;
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { hotelId } = await req.json();

    if (!hotelId) {
      return new Response(
        JSON.stringify({ error: 'Hotel ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Mock detailed hotel information following Ratehawk format
    const mockHotelInfo = {
      id: hotelId,
      name: hotelId === "test_hotel_do_not_book" ? "Mock Hotel Miami Beach" : "Hotel Details",
      description: "This beachfront hotel offers stunning ocean views and luxury amenities. Experience world-class comfort and service in the heart of the city.",
      address: "123 Ocean Drive, Miami, FL",
      stars: 4,
      amenities: ["Pool", "Free WiFi", "Bar", "Breakfast included", "Spa", "Fitness Center"],
      images: [
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1578774204375-826dc5d996ed?w=800&h=600&fit=crop"
      ],
      rooms: [
        {
          roomId: "rm101",
          name: "Deluxe Ocean View",
          price: {
            amount: hotelId === "test_hotel_do_not_book" ? 312.50 : 245.00,
            currency: "USD"
          },
          cancellationPolicy: "Free cancellation until 48h before check-in",
          images: ["https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop"]
        }
      ]
    };

    console.log(`Ratehawk Hotel Info - Retrieved details for hotel: ${hotelId}`);

    return new Response(
      JSON.stringify(mockHotelInfo),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Ratehawk hotel info error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});