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
  const requestId = `content-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log(`[${requestId}] Content API request initiated`);
    
    const { type, codes, language = 'ENG' } = await request.json();

    console.log(`[${requestId}] Content request parameters:`, {
      type,
      codes,
      language
    });

    if (!type || !codes) {
      console.error(`[${requestId}] Missing required parameters:`, { type, codes });
      return new Response(JSON.stringify({ 
        error: 'Missing required parameters',
        required: ['type', 'codes'],
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

    let endpoint = '';
    let queryParams = '';

    switch (type) {
      case 'ratecomments':
        endpoint = 'ratecomments';
        queryParams = `?codes=${Array.isArray(codes) ? codes.join(',') : codes}&language=${language}`;
        break;
      case 'destinations':
        endpoint = 'destinations';
        queryParams = `?codes=${Array.isArray(codes) ? codes.join(',') : codes}&language=${language}`;
        break;
      case 'hotels':
        endpoint = 'hotels';
        queryParams = `?codes=${Array.isArray(codes) ? codes.join(',') : codes}&language=${language}`;
        break;
      case 'facilities':
        endpoint = 'facilities';
        queryParams = `?codes=${Array.isArray(codes) ? codes.join(',') : codes}&language=${language}`;
        break;
      default:
        console.error(`[${requestId}] Invalid content type:`, type);
        return new Response(JSON.stringify({ 
          error: 'Invalid content type',
          validTypes: ['ratecomments', 'destinations', 'hotels', 'facilities'],
          requestId 
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }

    console.log(`[${requestId}] Making Hotelbeds Content API request to: ${endpoint}`);

    const startTime = Date.now();
    const response = await fetch(`https://api.hotelbeds.com/hotel-content-api/1.0/${endpoint}${queryParams}`, {
      method: 'GET',
      headers: {
        'Api-key': hotelbedsApiKey,
        'X-Signature': signature,
        'Accept': 'application/json',
        'Accept-Encoding': 'gzip'
      }
    });

    const responseTime = Date.now() - startTime;
    console.log(`[${requestId}] Hotelbeds Content API response received in ${responseTime}ms with status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[${requestId}] Hotelbeds Content API error:`, {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
        responseTime
      });
      
      return new Response(JSON.stringify({ 
        error: 'Content API request failed', 
        details: errorText,
        status: response.status,
        requestId,
        responseTime
      }), {
        status: response.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const contentData = await response.json();
    console.log(`[${requestId}] Content API response processed:`, {
      type,
      itemsReturned: Array.isArray(contentData[type]) ? contentData[type].length : 'N/A',
      responseTime
    });

    return new Response(JSON.stringify({ 
      data: contentData,
      type,
      requestId,
      responseTime
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error(`[${requestId}] Error in hotelbeds-content-api:`, {
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
