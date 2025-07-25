import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RatehawkCancelRequest {
  booking_id: string;
  reason?: string;
}

interface RatehawkCancelResponse {
  booking_id: string;
  status: string;
  cancellation_id: string;
  cancellation_fee: {
    amount: number;
    currency: string;
  };
  refund_amount: {
    amount: number;
    currency: string;
  };
  refund_timeline: string;
  cancelled_at: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { booking_id, reason = "User requested cancellation" }: RatehawkCancelRequest = await req.json();

    if (!booking_id) {
      return new Response(
        JSON.stringify({ error: 'Booking ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate cancellation ID
    const cancellationId = `cancel_${Date.now()}_${booking_id.split('_').pop()}`;

    // Mock cancellation response - replace with actual Ratehawk API call
    const cancelResponse: RatehawkCancelResponse = {
      booking_id: booking_id,
      status: "cancelled",
      cancellation_id: cancellationId,
      cancellation_fee: {
        amount: 0.00, // Free cancellation for test bookings
        currency: "USD"
      },
      refund_amount: {
        amount: booking_id.includes("test_hotel_do_not_book") ? 99.99 : 240.00,
        currency: "USD"
      },
      refund_timeline: "3-5 business days",
      cancelled_at: new Date().toISOString()
    };

    console.log(`Ratehawk Cancel - Cancelled booking: ${booking_id}`);
    
    // Log test booking cancellation for certification tracking
    if (booking_id.includes("test_hotel_do_not_book")) {
      console.log("✅ TEST BOOKING CANCELLED - Required for certification process");
      console.log(`Cancellation ID: ${cancellationId}`);
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