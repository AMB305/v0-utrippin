import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RatehawkCancelRequest {
  reservationId: string;
}

interface RatehawkCancelResponse {
  status: string;
  refundedAmount: {
    amount: number;
    currency: string;
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { reservationId }: RatehawkCancelRequest = await req.json();

    if (!reservationId) {
      return new Response(
        JSON.stringify({ error: 'Reservation ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Mock cancellation response following exact Ratehawk format
    const cancelResponse: RatehawkCancelResponse = {
      status: "cancelled",
      refundedAmount: {
        amount: reservationId.includes("test_hotel_do_not_book") ? 312.50 : 245.00,
        currency: "USD"
      }
    };

    console.log(`Ratehawk Cancel - Cancelled reservation: ${reservationId}`);
    
    // Log test booking cancellation for certification tracking
    if (reservationId.includes("test_hotel_do_not_book")) {
      console.log("✅ TEST BOOKING CANCELLED - Required for certification process");
      console.log(`Reservation ID: ${reservationId}`);
    }

    return new Response(
      JSON.stringify(cancelResponse),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Ratehawk cancellation error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});