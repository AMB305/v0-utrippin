import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    
    console.log('Checking OPENAI_API_KEY...', openAIApiKey ? 'Found' : 'Not found');
    
    if (!openAIApiKey) {
      console.error('OPENAI_API_KEY not found in environment variables');
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured. Please check your secrets.', trips: [] }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { prompt } = await req.json();
    
    if (!prompt) {
      return new Response(
        JSON.stringify({ error: 'Prompt is required', trips: [] }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Generating trips for prompt:', prompt);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          {
            role: 'system',
            content: 'You are a travel planner. Always respond ONLY with valid JSON. No explanations, no text, just pure JSON.'
          },
          {
            role: 'user',
            content: `Create an array of 6 trip suggestions based on: "${prompt}".
Each item should have:
{
  "destination": "string (city, country)",
  "name": "catchy trip name",
  "type": "solo|family|couple|friends|adventure|luxury|budget",
  "summary": "engaging 2-3 sentence description",
  "budget": 1500,
  "flightsLink": "https://www.expedia.com/Flights-Search?destination=DESTINATION&camref=YOUR_CAMREF",
  "hotelsLink": "https://www.expedia.com/Hotel-Search?destination=DESTINATION&camref=YOUR_CAMREF",
  "carsLink": "https://www.expedia.com/Cars-Search?destination=DESTINATION&camref=YOUR_CAMREF"
}
Return only JSON array, no markdown, no explanations.`
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, response.statusText, errorText);
      
      let errorMessage = `OpenAI API error (${response.status})`;
      if (response.status === 401) {
        errorMessage = 'Invalid OpenAI API key. Please check your API key configuration.';
      } else if (response.status === 429) {
        errorMessage = 'OpenAI API rate limit exceeded. Please try again later.';
      } else if (response.status === 400) {
        errorMessage = 'Bad request to OpenAI API. Please try a different prompt.';
      }
      
      return new Response(
        JSON.stringify({ 
          error: errorMessage, 
          trips: [] 
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const jsonText = data.choices[0]?.message?.content?.trim();
    
    if (!jsonText) {
      throw new Error('No content received from OpenAI');
    }

    console.log('Raw OpenAI response:', jsonText);

    // Parse the JSON response
    let trips;
    try {
      trips = JSON.parse(jsonText);
    } catch (parseError) {
      console.error('Failed to parse OpenAI JSON:', parseError);
      console.log('Raw content that failed to parse:', jsonText);
      
      // Return empty array on parse failure
      return new Response(
        JSON.stringify({ 
          error: 'OpenAI returned invalid JSON',
          trips: [] 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Ensure we have a valid array
    if (!Array.isArray(trips)) {
      console.error('OpenAI response is not an array:', trips);
      trips = [];
    }

    // Validate and clean trip objects
    const validTrips = trips.filter(trip => 
      trip && 
      typeof trip === 'object' && 
      trip.destination && 
      trip.name && 
      trip.summary
    ).map(trip => ({
      ...trip,
      budget: parseInt(trip.budget) || 1000,
      flightsLink: trip.flightsLink || `https://www.expedia.com/Flights-Search?destination=${encodeURIComponent(trip.destination)}&camref=YOUR_CAMREF`,
      hotelsLink: trip.hotelsLink || `https://www.expedia.com/Hotel-Search?destination=${encodeURIComponent(trip.destination)}&camref=YOUR_CAMREF`,
      carsLink: trip.carsLink || `https://www.expedia.com/Cars-Search?destination=${encodeURIComponent(trip.destination)}&camref=YOUR_CAMREF`
    }));

    console.log('Generated valid trips:', validTrips.length);

    return new Response(
      JSON.stringify({ trips: validTrips }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in openai-trips function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to generate trip suggestions',
        trips: [] 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
