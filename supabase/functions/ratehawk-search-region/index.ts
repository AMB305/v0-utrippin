import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const RATEHAWK_KEY_ID = Deno.env.get('RATEHAWK_KEY_ID');
const RATEHAWK_API_KEY = Deno.env.get('RATEHAWK_API_KEY');
const RATEHAWK_BASE_URL = 'https://api.worldota.net/api/b2b/v3';

interface RegionSearchRequest {
  checkin: string;
  checkout: string;
  region_id: number;
  guests: Array<{
    adults: number;
    children: number[];
  }>;
  currency?: string;
  language?: string;
  residency?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const searchParams: RegionSearchRequest = await req.json();

    if (!searchParams.checkin || !searchParams.checkout || !searchParams.region_id || !searchParams.guests) {
      return new Response(
        JSON.stringify({ error: 'Required fields: checkin, checkout, region_id, guests' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!RATEHAWK_KEY_ID || !RATEHAWK_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'Ratehawk API credentials not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const credentials = btoa(`${RATEHAWK_KEY_ID}:${RATEHAWK_API_KEY}`);
    
    console.log(`Ratehawk Region Search - Region: ${searchParams.region_id}, Dates: ${searchParams.checkin} to ${searchParams.checkout}`);

    const requestBody = {
      checkin: searchParams.checkin,
      checkout: searchParams.checkout,
      region_id: searchParams.region_id,
      guests: searchParams.guests,
      currency: searchParams.currency || 'USD',
      language: searchParams.language || 'en',
      residency: searchParams.residency || 'us'
    };

    const response = await fetch(`${RATEHAWK_BASE_URL}/search/serp/region/`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Ratehawk region search error:', response.status, errorText);
      return new Response(
        JSON.stringify({ error: `Ratehawk API error: ${response.status}` }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    
    console.log('✅ RATEHAWK REGION SEARCH SUCCESS:');
    console.log('Region ID:', searchParams.region_id);
    console.log('Hotels found:', data.data?.hotels?.length || 0);
    
    // Log certification data
    console.log('🔍 RATEHAWK SEARCH CERTIFICATION LOG:');
    console.log('Request:', JSON.stringify(requestBody, null, 2));
    console.log('Response hotels count:', data.data?.hotels?.length || 0);
    console.log('Authentication:', RATEHAWK_API_KEY ? 'API Key Present' : 'No API Key');
    
    return new Response(
      JSON.stringify(data),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Ratehawk region search error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});