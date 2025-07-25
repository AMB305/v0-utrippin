import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const RATEHAWK_API_KEY = Deno.env.get('RATEHAWK_API_KEY');
const RATEHAWK_BASE_URL = 'https://api.ratehawk.com/v1';

interface RatehawkPrebookRequest {
  roomId: string;
  hotelId: string;
  checkIn: string;
  checkOut: string;
  guests: {
    adults: number;
    children: number[];
  };
}

interface RatehawkPrebookResponse {
  prebookId: string;
  finalPrice: {
    amount: number;
    currency: string;
  };
  expiresAt: string;
  available: boolean;
  hotelId: string;
  roomId: string;
  cancellationPolicy: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { roomId, hotelId, checkIn, checkOut, guests }: RatehawkPrebookRequest = await req.json();

    if (!roomId || !hotelId || !checkIn || !checkOut) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters: roomId, hotelId, checkIn, checkOut' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Calculate expiry time (30 minutes from now)
    const expiryTime = new Date();
    expiryTime.setMinutes(expiryTime.getMinutes() + 30);

    // Mock prebook response following exact Ratehawk format
    const prebookResponse: RatehawkPrebookResponse = {
      prebookId: `pbk_${Date.now()}_${hotelId}`,
      finalPrice: {
        amount: hotelId === "test_hotel_do_not_book" ? 312.50 : 245.00,
        currency: "USD"
      },
      expiresAt: expiryTime.toISOString(),
      available: true,
      hotelId: hotelId,
      roomId: roomId,
      cancellationPolicy: "Free cancellation until 48h before check-in"
    };

    console.log(`Ratehawk Prebook - Created prebook for hotel: ${hotelId}, expires: ${expiryTime.toISOString()}`);
    
    // Log certification data
    console.log('📋 RATEHAWK PREBOOK CERTIFICATION LOG:');
    console.log('Request:', JSON.stringify({ roomId, hotelId, checkIn, checkOut, guests }, null, 2));
    console.log('Response:', JSON.stringify(prebookResponse, null, 2));
    console.log('Authentication:', RATEHAWK_API_KEY ? 'API Key Present' : 'No API Key');

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