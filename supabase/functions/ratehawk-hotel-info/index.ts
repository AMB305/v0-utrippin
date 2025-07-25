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
    const { hotel_id } = await req.json();

    if (!hotel_id) {
      return new Response(
        JSON.stringify({ error: 'Hotel ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Mock detailed hotel information
    // Replace with actual Ratehawk API call once test keys are provided
    const mockHotelInfo: RatehawkHotelInfo = {
      id: hotel_id,
      name: hotel_id === "test_hotel_do_not_book" ? "Ratehawk Test Hotel" : "Hotel Details",
      address: "123 Main Street, City Center",
      star_rating: 4,
      description: "Experience luxury and comfort at our beautifully appointed hotel. Located in the heart of the city, we offer world-class amenities and exceptional service to make your stay memorable.",
      images: [
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1578774204375-826dc5d996ed?w=800&h=600&fit=crop"
      ],
      amenities: {
        general: ["Free WiFi", "Swimming Pool", "Spa & Wellness Center", "Restaurant", "Bar", "24-hour Front Desk"],
        room: ["Air Conditioning", "Flat-screen TV", "Mini Bar", "Room Service", "Safe", "Balcony"],
        business: ["Business Center", "Meeting Rooms", "Conference Facilities", "Airport Shuttle"]
      },
      location: {
        latitude: 40.7128,
        longitude: -74.0060
      },
      policies: {
        check_in: "3:00 PM",
        check_out: "11:00 AM",
        cancellation: "Free cancellation up to 24 hours before check-in"
      }
    };

    console.log(`Ratehawk Hotel Info - Retrieved details for hotel: ${hotel_id}`);

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