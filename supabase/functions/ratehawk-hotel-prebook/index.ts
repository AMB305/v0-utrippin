import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RatehawkPrebookRequest {
  hotel_id: string;
  room_id?: string;
  check_in: string;
  check_out: string;
  adults: number;
  children?: number;
  rooms?: number;
}

interface RatehawkPrebookResponse {
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

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { hotel_id, check_in, check_out, adults = 2, children = 0, rooms = 1 }: RatehawkPrebookRequest = await req.json();

    if (!hotel_id || !check_in || !check_out) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters: hotel_id, check_in, check_out' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Calculate expiry time (30 minutes from now)
    const expiryTime = new Date();
    expiryTime.setMinutes(expiryTime.getMinutes() + 30);

    // Mock prebook response - replace with actual Ratehawk API call
    const prebookResponse: RatehawkPrebookResponse = {
      prebook_id: `prebook_${Date.now()}_${hotel_id}`,
      hotel_id: hotel_id,
      room_data: {
        room_name: hotel_id === "test_hotel_do_not_book" ? "Test Room - DO NOT BOOK" : "Deluxe King Room",
        bed_type: "King Bed",
        max_occupancy: adults + children
      },
      price: {
        amount: hotel_id === "test_hotel_do_not_book" ? 99.99 : 120.00,
        currency: "USD",
        taxes_included: true
      },
      cancellation_policy: {
        is_free_cancellation: true,
        free_cancellation_until: check_in,
        penalty_amount: 0
      },
      booking_conditions: [
        "Valid ID required at check-in",
        "Credit card required for incidentals",
        "Non-smoking property",
        hotel_id === "test_hotel_do_not_book" ? "THIS IS A TEST BOOKING - WILL BE CANCELLED" : "Standard hotel policies apply"
      ],
      expires_at: expiryTime.toISOString(),
      status: "confirmed"
    };

    console.log(`Ratehawk Prebook - Created prebook for hotel: ${hotel_id}, expires: ${expiryTime.toISOString()}`);

    return new Response(
      JSON.stringify(prebookResponse),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Ratehawk prebook error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});