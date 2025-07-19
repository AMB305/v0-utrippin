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
  const requestId = `rates-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log(`[${requestId}] Rate check request initiated`);
    
    const { rateKeys, language = 'ENG' } = await request.json();

    console.log(`[${requestId}] Rate check parameters:`, {
      rateKeysCount: rateKeys?.length || 0,
      language,
      rateKeys: rateKeys
    });

    if (!rateKeys || !Array.isArray(rateKeys) || rateKeys.length === 0) {
      console.error(`[${requestId}] Invalid rate keys provided:`, rateKeys);
      return new Response(JSON.stringify({ 
        error: 'Rate keys are required',
        details: 'rateKeys must be a non-empty array',
        requestId 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Validate rate keys format
    const invalidRateKeys = rateKeys.filter(key => !key || typeof key !== 'string');
    if (invalidRateKeys.length > 0) {
      console.error(`[${requestId}] Invalid rate key format:`, invalidRateKeys);
      return new Response(JSON.stringify({ 
        error: 'Invalid rate key format',
        details: 'All rate keys must be non-empty strings',
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

    // Hotelbeds CheckRates API request
    const checkRatesPayload = {
      rooms: rateKeys.map((rateKey: string) => ({
        rateKey: rateKey
      })),
      language: language
    };

    console.log(`[${requestId}] Making Hotelbeds CheckRates API request:`, checkRatesPayload);

    const startTime = Date.now();
    const response = await fetch('https://api.hotelbeds.com/hotel-api/1.0/checkrates', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Api-key': hotelbedsApiKey,
        'X-Signature': signature,
        'Accept': 'application/json',
        'Accept-Encoding': 'gzip'
      },
      body: JSON.stringify(checkRatesPayload)
    });

    const responseTime = Date.now() - startTime;
    console.log(`[${requestId}] Hotelbeds CheckRates API response received in ${responseTime}ms with status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[${requestId}] Hotelbeds CheckRates API error:`, {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
        responseTime
      });
      
      return new Response(JSON.stringify({ 
        error: 'Rate check failed', 
        details: errorText,
        status: response.status,
        requestId,
        responseTime
      }), {
        status: response.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const rateData = await response.json();
    console.log(`[${requestId}] Hotelbeds CheckRates API response processed:`, {
      hotelFound: !!rateData.hotel,
      hotelCode: rateData.hotel?.code,
      totalNet: rateData.hotel?.totalNet,
      responseTime
    });

    // Transform the response for frontend
    const transformedRates = rateData.hotel ? {
      hotelCode: rateData.hotel.code,
      hotelName: rateData.hotel.name,
      checkIn: rateData.hotel.checkIn,
      checkOut: rateData.hotel.checkOut,
      totalNet: rateData.hotel.totalNet,
      currency: rateData.hotel.currency,
      rooms: rateData.hotel.rooms?.map((room: any) => ({
        rateKey: room.rates[0]?.rateKey,
        name: room.name,
        boardName: room.rates[0]?.boardName,
        net: room.rates[0]?.net,
        cancellationPolicies: room.rates[0]?.cancellationPolicies,
        paymentType: room.rates[0]?.paymentType,
        packaging: room.rates[0]?.packaging
      })) || []
    } : null;

    console.log(`[${requestId}] Rate check completed successfully:`, {
      ratesAvailable: !!transformedRates,
      totalResponseTime: responseTime
    });

    return new Response(JSON.stringify({ 
      hotel: transformedRates,
      success: !!transformedRates,
      requestId,
      responseTime
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error(`[${requestId}] Error in hotelbeds-check-rates:`, {
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