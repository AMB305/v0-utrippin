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
  const requestId = `destinations-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log(`[${requestId}] Destinations API request initiated`);
    
    const { 
      countryCode, 
      language = 'ENG',
      fields = 'code,name,countryCode'
    } = await request.json();

    console.log(`[${requestId}] Destinations request parameters:`, {
      countryCode,
      language,
      fields
    });

    // Create API signature
    const timestamp = Math.floor(Date.now() / 1000);
    const signature = createSignature(hotelbedsApiKey, hotelbedsSecret, timestamp);

    console.log(`[${requestId}] API signature created for timestamp: ${timestamp}`);

    let queryParams = `?language=${language}&fields=${fields}`;
    if (countryCode) {
      queryParams += `&countryCode=${countryCode}`;
    }

    console.log(`[${requestId}] Making Hotelbeds Destinations API request`);

    const startTime = Date.now();
    const response = await fetch(`https://api.hotelbeds.com/hotel-content-api/1.0/destinations${queryParams}`, {
      method: 'GET',
      headers: {
        'Api-key': hotelbedsApiKey,
        'X-Signature': signature,
        'Accept': 'application/json',
        'Accept-Encoding': 'gzip'
      }
    });

    const responseTime = Date.now() - startTime;
    console.log(`[${requestId}] Hotelbeds Destinations API response received in ${responseTime}ms with status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[${requestId}] Hotelbeds Destinations API error:`, {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
        responseTime
      });
      
      return new Response(JSON.stringify({ 
        error: 'Destinations API request failed', 
        details: errorText,
        status: response.status,
        requestId,
        responseTime
      }), {
        status: response.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const destinationsData = await response.json();
    console.log(`[${requestId}] Destinations API response processed:`, {
      destinationsReturned: destinationsData.destinations?.length || 0,
      responseTime
    });

    // Create a mapping for easy lookup
    const destinationMapping: Record<string, string> = {};
    destinationsData.destinations?.forEach((dest: any) => {
      if (dest.name && dest.code) {
        // Create multiple mapping variations
        const name = dest.name.toLowerCase();
        destinationMapping[name] = dest.code;
        destinationMapping[dest.code.toLowerCase()] = dest.code;
        
        // Handle common variations
        if (name.includes(' ')) {
          destinationMapping[name.replace(/ /g, '')] = dest.code;
        }
      }
    });

    return new Response(JSON.stringify({ 
      destinations: destinationsData.destinations || [],
      mapping: destinationMapping,
      total: destinationsData.destinations?.length || 0,
      requestId,
      responseTime
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error(`[${requestId}] Error in hotelbeds-destinations:`, {
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
