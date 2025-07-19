import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const CAMREF = "1110l15dQSW";

const buildBookingUrl = (baseUrl: string, destination: string, type: 'flights' | 'hotels' | 'cars') => {
  const params = new URLSearchParams();
  params.append('CAMREF', CAMREF);
  
  if (type === 'flights') {
    params.append('destination', destination);
    params.append('type', 'flights');
  } else if (type === 'hotels') {
    params.append('destination', destination);
    params.append('type', 'hotels');
  } else if (type === 'cars') {
    params.append('location', destination);
    params.append('type', 'cars');
  }
  
  return `${baseUrl}?${params.toString()}`;
};

const generateTripsWithOpenRouter = async (query: string, budget: number) => {
  const openRouterKey = Deno.env.get('OPENROUTER_API_KEY');
  if (!openRouterKey) {
    throw new Error('OpenRouter API key not found');
  }

  const prompt = `Based on this travel query: "${query}" and budget of $${budget}, generate exactly 3 travel trip suggestions. Each trip should be a realistic destination that fits the budget and be extremely compelling and detailed.

Return a JSON array with this exact structure:
[
  {
    "destination": "City, Country",
    "name": "Captivating Trip Name",
    "type": "adventure/relaxation/culture/luxury/culinary/etc",
    "summary": "Brief compelling hook (1-2 sentences)",
    "detailedDescription": "Detailed 3-4 paragraph description covering: unique experiences, local culture, food & wine, stunning views, must-see attractions, hidden gems, and why this destination will create unforgettable memories. Make it emotionally compelling and paint vivid pictures.",
    "highlights": [
      "Specific highlight 1 (e.g., Private wine tasting at historic vineyard)",
      "Specific highlight 2 (e.g., Sunset dinner overlooking rolling hills)", 
      "Specific highlight 3 (e.g., Guided truffle hunting with local experts)",
      "Specific highlight 4 (e.g., Cooking class with Michelin-starred chef)"
    ],
    "imageUrl": "https://images.unsplash.com/photo-[relevant-photo-id]?w=800&h=600&fit=crop",
    "budget": ${budget}
  }
]

Make the descriptions vivid, emotional, and irresistible. Include sensory details, cultural insights, and unique experiences. Use real Unsplash image URLs that match the destination.`;

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openRouterKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://utrippin.ai',
      'X-Title': 'Utrippin AI Travel Planner'
    },
    body: JSON.stringify({
      model: 'openai/gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a travel expert. Always respond with valid JSON only, no additional text.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
       temperature: 0.8,
       max_tokens: 2000
    })
  });

  if (!response.ok) {
    throw new Error(`OpenRouter API error: ${response.status}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  
  if (!content) {
    throw new Error('No content received from OpenRouter');
  }

  let trips;
  try {
    // Clean up the content in case there's extra text
    let cleanContent = content.trim();
    
    // Look for JSON array in the content
    const jsonStart = cleanContent.indexOf('[');
    const jsonEnd = cleanContent.lastIndexOf(']');
    
    if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
      cleanContent = cleanContent.substring(jsonStart, jsonEnd + 1);
    }
    
    trips = JSON.parse(cleanContent);
  } catch (e) {
    console.error('Failed to parse OpenRouter JSON:', e, 'Content:', content);
    throw new Error(`Invalid JSON response from OpenRouter: ${e.message}`);
  }

  if (!Array.isArray(trips)) {
    console.error('OpenRouter response is not an array:', trips);
    throw new Error('Response is not an array');
  }

  return trips.map(trip => ({
    ...trip,
    flightsLink: buildBookingUrl('https://www.expedia.com/Flights', trip.destination, 'flights'),
    hotelsLink: buildBookingUrl('https://www.expedia.com/Hotels', trip.destination, 'hotels'),
    carsLink: buildBookingUrl('https://www.expedia.com/Cars', trip.destination, 'cars')
  }));
};

const generateTripsWithSupabase = async (query: string, budget: number) => {
  const openAIKey = Deno.env.get('OPENAI_API_KEY');
  if (!openAIKey) {
    console.error('OpenAI API key not found in environment');
    throw new Error('OpenAI API key not found');
  }
  
  console.log('OpenAI API key found, length:', openAIKey.length);

  const prompt = `Based on this travel query: "${query}" and budget of $${budget}, generate exactly 3 travel trip suggestions. Each trip should be a realistic destination that fits the budget and be extremely compelling and detailed.

Return a JSON array with this exact structure:
[
  {
    "destination": "City, Country", 
    "name": "Captivating Trip Name",
    "type": "adventure/relaxation/culture/luxury/culinary/etc",
    "summary": "Brief compelling hook (1-2 sentences)",
    "detailedDescription": "Detailed 3-4 paragraph description covering: unique experiences, local culture, food & wine, stunning views, must-see attractions, hidden gems, and why this destination will create unforgettable memories. Make it emotionally compelling and paint vivid pictures.",
    "highlights": [
      "Specific highlight 1 (e.g., Private wine tasting at historic vineyard)",
      "Specific highlight 2 (e.g., Sunset dinner overlooking rolling hills)", 
      "Specific highlight 3 (e.g., Guided truffle hunting with local experts)",
      "Specific highlight 4 (e.g., Cooking class with Michelin-starred chef)"
    ],
    "imageUrl": "https://images.unsplash.com/photo-[relevant-photo-id]?w=800&h=600&fit=crop",
    "budget": ${budget}
  }
]

Make the descriptions vivid, emotional, and irresistible. Include sensory details, cultural insights, and unique experiences. Use real Unsplash image URLs that match the destination.`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openAIKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a travel expert. Always respond with valid JSON only, no additional text.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
       temperature: 0.8,
       max_tokens: 2000
    })
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error(`OpenAI API error: ${response.status} - ${errorBody}`);
    throw new Error(`OpenAI API error: ${response.status} - ${errorBody}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  
  if (!content) {
    throw new Error('No content received from OpenAI');
  }

  let trips;
  try {
    trips = JSON.parse(content);
  } catch (e) {
    throw new Error('Invalid JSON response from OpenAI');
  }

  if (!Array.isArray(trips)) {
    throw new Error('Response is not an array');
  }

  return trips.map(trip => ({
    ...trip,
    flightsLink: buildBookingUrl('https://www.expedia.com/Flights', trip.destination, 'flights'),
    hotelsLink: buildBookingUrl('https://www.expedia.com/Hotels', trip.destination, 'hotels'),
    carsLink: buildBookingUrl('https://www.expedia.com/Cars', trip.destination, 'cars')
  }));
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, budget = 3000 } = await req.json();

    if (!query) {
      return new Response(
        JSON.stringify({ error: 'Query is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log(`Generating trips for query: "${query}" with budget: $${budget}`);

    let trips;
    let provider = 'unknown';

    try {
      console.log('Trying OpenRouter first...');
      trips = await generateTripsWithOpenRouter(query, budget);
      provider = 'openrouter';
      console.log('Successfully generated trips with OpenRouter');
    } catch (openRouterError) {
      console.log('OpenRouter failed:', openRouterError.message);
      console.log('Falling back to OpenAI via Supabase...');
      
      try {
        trips = await generateTripsWithSupabase(query, budget);
        provider = 'openai';
        console.log('Successfully generated trips with OpenAI');
      } catch (openAIError) {
        console.error('Both providers failed:', {
          openRouter: openRouterError.message,
          openAI: openAIError.message
        });
        
        return new Response(
          JSON.stringify({ 
            error: 'Failed to generate trips with both providers',
            details: {
              openRouter: openRouterError.message,
              openAI: openAIError.message
            }
          }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }
    }

    return new Response(
      JSON.stringify({ 
        trips, 
        provider,
        query,
        budget 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Unexpected error in openai-trips-enhanced:', error);
    return new Response(
      JSON.stringify({ 
        error: 'An unexpected error occurred', 
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});