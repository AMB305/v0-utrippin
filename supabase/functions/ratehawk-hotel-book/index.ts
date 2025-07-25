import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RatehawkBookingRequest {
  prebook_id: string;
  guest_info: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
  };
  payment_info?: {
    type: string;
    [key: string]: any;
  };
}

interface RatehawkBookingResponse {
  booking_id: string;
  confirmation_number: string;
  status: string;
  hotel_info: {
    name: string;
    address: string;
    phone: string;
  };
  guest_info: {
    first_name: string;
    last_name: string;
    email: string;
  };
  booking_details: {
    check_in: string;
    check_out: string;
    room_type: string;
    guests: number;
  };
  total_amount: {
    amount: number;
    currency: string;
  };
  cancellation_policy: {
    is_free_cancellation: boolean;
    cancellation_deadline: string;
  };
  created_at: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prebook_id, guest_info }: RatehawkBookingRequest = await req.json();

    if (!prebook_id || !guest_info) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters: prebook_id, guest_info' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { first_name, last_name, email, phone } = guest_info;

    if (!first_name || !last_name || !email) {
      return new Response(
        JSON.stringify({ error: 'Missing required guest information: first_name, last_name, email' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate booking confirmation
    const confirmationNumber = `RTH${Date.now().toString().slice(-6)}`;
    const bookingId = `booking_${Date.now()}_${prebook_id.split('_').pop()}`;

    // Mock booking response - replace with actual Ratehawk API call
    const bookingResponse: RatehawkBookingResponse = {
      booking_id: bookingId,
      confirmation_number: confirmationNumber,
      status: prebook_id.includes("test_hotel_do_not_book") ? "confirmed_test" : "confirmed",
      hotel_info: {
        name: prebook_id.includes("test_hotel_do_not_book") ? "Ratehawk Test Hotel" : "Premium Hotel",
        address: "123 Main Street, City Center",
        phone: "+1-555-HOTEL"
      },
      guest_info: {
        first_name,
        last_name,
        email
      },
      booking_details: {
        check_in: "2025-01-15", // This would come from prebook data
        check_out: "2025-01-17",
        room_type: "Deluxe King Room",
        guests: 2
      },
      total_amount: {
        amount: prebook_id.includes("test_hotel_do_not_book") ? 99.99 : 240.00,
        currency: "USD"
      },
      cancellation_policy: {
        is_free_cancellation: true,
        cancellation_deadline: "2025-01-14T23:59:59Z"
      },
      created_at: new Date().toISOString()
    };

    console.log(`Ratehawk Booking - Created booking: ${bookingId} for ${first_name} ${last_name}`);
    
    // Log test booking for certification tracking
    if (prebook_id.includes("test_hotel_do_not_book")) {
      console.log("🧪 TEST BOOKING CREATED - Remember to cancel this booking for certification");
      console.log(`Confirmation: ${confirmationNumber}, Booking ID: ${bookingId}`);
    }

    return new Response(
      JSON.stringify(bookingResponse),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Ratehawk booking error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});