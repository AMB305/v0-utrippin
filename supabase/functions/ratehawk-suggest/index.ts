import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const RATEHAWK_KEY_ID = Deno.env.get('RATEHAWK_KEY_ID');
const RATEHAWK_API_KEY = Deno.env.get('RATEHAWK_API_KEY');
const RATEHAWK_BASE_URL = 'https://api.worldota.net/api/b2b/v3';

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

    if (!RATEHAWK_KEY_ID || !RATEHAWK_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'Ratehawk API credentials not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const credentials = btoa(`${RATEHAWK_KEY_ID}:${RATEHAWK_API_KEY}`);
    
    console.log(`Ratehawk Suggest - Searching for: ${query}`);

    const response = await fetch(`${RATEHAWK_BASE_URL}/search/multicomplete/`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        language
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Ratehawk suggest error:', response.status, errorText);
      console.error('Request URL:', `${RATEHAWK_BASE_URL}/search/multicomplete/`);
      console.error('Request body:', JSON.stringify({ query, language }));
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
    console.log('Full response:', JSON.stringify(data, null, 2));
    console.log('Results count:', data.data?.length || 0);
    
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