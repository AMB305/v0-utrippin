import { createClient } from "https://esm.sh/@supabase/supabase-js";
import { createHash } from "https://deno.land/std@0.177.0/crypto/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const hotelbedsApiKey = Deno.env.get('HOTELBEDS_API_KEY')!;
const hotelbedsSecret = Deno.env.get('HOTELBEDS_SECRET')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

function createSignature(apiKey: string, secret: string, timestamp: number): string {
  const data = apiKey + secret + timestamp;
  const encoder = new TextEncoder();
  const hash = createHash("sha256");
  hash.update(encoder.encode(data));
  return hash.toString("hex");
}

export default async function handler(request: Request) {
  const requestId = `booking-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log(`[${requestId}] Booking creation request initiated`);
    
    const { 
      rateKey, 
      holder, 
      rooms, 
      clientReference,
      language = 'ENG' 
    } = await request.json();

    console.log(`[${requestId}] Booking parameters:`, {
      hasRateKey: !!rateKey,
      holderEmail: holder?.email,
      roomsCount: rooms?.length || 0,
      clientReference,
      language
    });

    // Get user ID from auth header
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      console.error(`[${requestId}] No authorization header provided`);
      return new Response(JSON.stringify({ 
        error: 'Unauthorized',
        details: 'Authentication required for booking creation',
        requestId 
      }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      console.error(`[${requestId}] Authentication failed:`, authError);
      return new Response(JSON.stringify({ 
        error: 'Invalid authentication',
        details: 'Please log in again',
        requestId 
      }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    console.log(`[${requestId}] User authenticated:`, user.id);

    // Validate required booking parameters
    if (!rateKey || !holder || !rooms) {
      console.error(`[${requestId}] Missing required booking parameters:`, {
        hasRateKey: !!rateKey,
        hasHolder: !!holder,
        hasRooms: !!rooms
      });
      return new Response(JSON.stringify({ 
        error: 'Missing required booking parameters',
        required: ['rateKey', 'holder', 'rooms'],
        requestId 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Validate holder information
    const requiredHolderFields = ['name', 'surname', 'email', 'phoneNumber'];
    const missingHolderFields = requiredHolderFields.filter(field => !holder[field]);
    if (missingHolderFields.length > 0) {
      console.error(`[${requestId}] Missing holder information:`, missingHolderFields);
      return new Response(JSON.stringify({ 
        error: 'Missing holder information',
        missing: missingHolderFields,
        requestId 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Validate rooms information
    if (!Array.isArray(rooms) || rooms.length === 0) {
      console.error(`[${requestId}] Invalid rooms data:`, rooms);
      return new Response(JSON.stringify({ 
        error: 'Invalid rooms data',
        details: 'rooms must be a non-empty array',
        requestId 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Create API signature
    const timestamp = Math.floor(Date.now() / 1000);
    const signature = createSignature(hotelbedsApiKey, hotelbedsSecret, timestamp);

    console.log(`[${requestId}] API signature created for timestamp: ${timestamp}`);

    // Hotelbeds Booking API request
    const bookingPayload = {
      holder: {
        name: holder.name,
        surname: holder.surname,
        email: holder.email,
        phoneNumber: holder.phoneNumber
      },
      rooms: rooms.map((room: any) => ({
        rateKey: room.rateKey,
        paxes: room.paxes.map((pax: any) => ({
          roomId: pax.roomId,
          type: pax.type, // AD (Adult), CH (Child)
          age: pax.age,
          name: pax.name,
          surname: pax.surname
        }))
      })),
      clientReference: clientReference || `UTRIPPIN-${Date.now()}`,
      remark: "Booking created via UTRIPPIN platform",
      language: language
    };

    console.log(`[${requestId}] Making Hotelbeds Booking API request:`, {
      ...bookingPayload,
      holder: { ...bookingPayload.holder, phoneNumber: '[REDACTED]' }
    });

    const startTime = Date.now();
    const response = await fetch('https://api.hotelbeds.com/hotel-api/1.0/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Api-key': hotelbedsApiKey,
        'X-Signature': signature,
        'Accept': 'application/json',
        'Accept-Encoding': 'gzip'
      },
      body: JSON.stringify(bookingPayload)
    });

    const responseTime = Date.now() - startTime;
    console.log(`[${requestId}] Hotelbeds Booking API response received in ${responseTime}ms with status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[${requestId}] Hotelbeds Booking API error:`, {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
        responseTime
      });
      
      return new Response(JSON.stringify({ 
        error: 'Booking creation failed', 
        details: errorText,
        status: response.status,
        requestId,
        responseTime
      }), {
        status: response.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const bookingData = await response.json();
    console.log(`[${requestId}] Hotelbeds Booking API response processed:`, {
      bookingReference: bookingData.booking?.reference,
      status: bookingData.booking?.status,
      totalNet: bookingData.booking?.totalNet,
      responseTime
    });

    // Store booking in our database
    try {
      const { data: dbBooking, error: dbError } = await supabase
        .from('bookings')
        .insert({
          user_id: user.id,
          type: 'hotel',
          total_price: bookingData.booking?.totalNet || 0,
          status: bookingData.booking?.status || 'confirmed',
          details: {
            hotelbedsReference: bookingData.booking?.reference,
            clientReference: bookingData.booking?.clientReference,
            hotelCode: bookingData.booking?.hotel?.code,
            hotelName: bookingData.booking?.hotel?.name,
            checkIn: bookingData.booking?.hotel?.checkIn,
            checkOut: bookingData.booking?.hotel?.checkOut,
            totalNet: bookingData.booking?.totalNet,
            currency: bookingData.booking?.hotel?.currency,
            holder: bookingData.booking?.holder,
            rooms: bookingData.booking?.hotel?.rooms,
            requestId,
            createdAt: new Date().toISOString()
          },
          payment_status: 'pending'
        })
        .select()
        .single();

      if (dbError) {
        console.error(`[${requestId}] Database error storing booking:`, dbError);
        // Don't fail the entire request if DB storage fails, but log it
      } else {
        console.log(`[${requestId}] Booking stored successfully in database:`, dbBooking?.id);
      }

      return new Response(JSON.stringify({ 
        booking: bookingData.booking,
        localBookingId: dbBooking?.id,
        success: true,
        requestId,
        responseTime
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });

    } catch (dbError) {
      console.error(`[${requestId}] Database storage failed:`, dbError);
      
      // Return success since Hotelbeds booking succeeded, even if local storage failed
      return new Response(JSON.stringify({ 
        booking: bookingData.booking,
        success: true,
        warning: 'Booking created but local storage failed',
        requestId,
        responseTime
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

  } catch (error) {
    console.error(`[${requestId}] Error in hotelbeds-create-booking:`, {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error',
      requestId
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}