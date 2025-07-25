import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const RATEHAWK_KEY_ID = Deno.env.get('RATEHAWK_KEY_ID');
const RATEHAWK_API_KEY = Deno.env.get('RATEHAWK_API_KEY');
const RATEHAWK_BASE_URL = 'https://api-sandbox.emergingtravel.com/v1';

interface SuggestRequest {
  query: string;
  language?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, language = 'en' }: SuggestRequest = await req.json();

    if (!query) {
      return new Response(
        JSON.stringify({ error: 'Query parameter is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`🔑 Ratehawk Credentials Debug:`);
    console.log(`RATEHAWK_KEY_ID: ${RATEHAWK_KEY_ID ? 'Present' : 'Missing'}`);
    console.log(`RATEHAWK_API_KEY: ${RATEHAWK_API_KEY ? 'Present (length: ' + RATEHAWK_API_KEY.length + ')' : 'Missing'}`);

    if (!RATEHAWK_KEY_ID || !RATEHAWK_API_KEY) {
      console.error('❌ Missing API credentials:', { 
        key_id_present: !!RATEHAWK_KEY_ID, 
        api_key_present: !!RATEHAWK_API_KEY 
      });
      return new Response(
        JSON.stringify({ error: 'Ratehawk API credentials not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    console.log(`🧠 Ratehawk Suggest - Searching for: ${query}`);
    console.log(`🌐 API URL: ${RATEHAWK_BASE_URL}/search/suggest`);

    const response = await fetch(`${RATEHAWK_BASE_URL}/search/suggest`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RATEHAWK_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        language
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Ratehawk suggest error:', response.status, errorText);
      console.error('🔍 Request details:', {
        url: `${RATEHAWK_BASE_URL}/search/suggest`,
        method: 'POST',
        headers: {
          'Authorization': 'Bearer [REDACTED]',
          'Content-Type': 'application/json'
        },
        body: { query, language }
      });
      return new Response(
        JSON.stringify({ 
          error: `Ratehawk API error: ${response.status}`, 
          details: errorText,
          requestData: { query, language }
        }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    
    console.log('✅ RATEHAWK SUGGEST SUCCESS:');
    console.log('Query:', query);
    console.log('Response status:', response.status);
    console.log('💬 Suggest Response:', JSON.stringify(data, null, 2));
    console.log('Locations count:', data.locations?.length || 0);
    
    // Enhanced debugging for certification
    if (data.locations && data.locations.length > 0) {
      console.log('🎯 First location details:', JSON.stringify(data.locations[0], null, 2));
      const location = data.locations[0];
      if (location.region_id) {
        console.log(`✅ Found region_id: ${location.region_id} for ${location.name}`);
      } else {
        console.log('⚠️ No region_id found in location object');
      }
    } else {
      console.log('❌ No locations returned in response');
    }
    
    return new Response(
      JSON.stringify(data),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Ratehawk suggest error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});