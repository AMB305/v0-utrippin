import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const GOOGLE_PLACES_API_KEY = Deno.env.get('GOOGLE_PLACES_API_KEY');

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!GOOGLE_PLACES_API_KEY) {
      throw new Error('Google Places API key is not configured');
    }

    const { placeName, location } = await req.json();
    
    if (!placeName) {
      throw new Error('Place name is required');
    }

    console.log(`Searching for place: ${placeName} in ${location || 'general location'}`);

    // Step 1: Search for the place using Places API Text Search
    const searchQuery = location ? `${placeName} ${location}` : placeName;
    const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(searchQuery)}&key=${GOOGLE_PLACES_API_KEY}`;
    
    const searchResponse = await fetch(searchUrl);
    const searchData = await searchResponse.json();

    if (!searchResponse.ok || searchData.status !== 'OK') {
      console.error('Places search failed:', searchData);
      return new Response(JSON.stringify({ 
        imageUrl: null, 
        error: 'Place not found' 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const place = searchData.results[0];
    
    if (!place || !place.photos || place.photos.length === 0) {
      console.log('No photos found for place:', placeName);
      return new Response(JSON.stringify({ 
        imageUrl: null, 
        error: 'No photos available for this place' 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Step 2: Get the photo using the photo reference
    const photoReference = place.photos[0].photo_reference;
    const maxWidth = 400; // Optimal size for mobile cards
    
    const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxWidth}&photo_reference=${photoReference}&key=${GOOGLE_PLACES_API_KEY}`;

    console.log(`Found photo for ${placeName}: ${photoUrl}`);

    return new Response(JSON.stringify({ 
      imageUrl: photoUrl,
      place_id: place.place_id,
      name: place.name,
      rating: place.rating,
      formatted_address: place.formatted_address
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in get-place-image function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      imageUrl: null 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
