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

    console.log(`Getting details for place: ${placeName} in ${location || 'general location'}`);

    // Step 1: Search for the place using Places API Text Search
    const searchQuery = location ? `${placeName} ${location}` : placeName;
    const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(searchQuery)}&key=${GOOGLE_PLACES_API_KEY}`;
    
    const searchResponse = await fetch(searchUrl);
    const searchData = await searchResponse.json();

    if (!searchResponse.ok || searchData.status !== 'OK' || !searchData.results || searchData.results.length === 0) {
      console.error('Places search failed:', searchData);
      return new Response(JSON.stringify({ 
        imageUrl: null,
        websiteUrl: null,
        googleMapsUrl: null,
        error: 'Place not found' 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const place = searchData.results[0];
    
    // Step 2: Get detailed place information using Place Details API
    const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=name,formatted_address,rating,website,url,photos,price_level&key=${GOOGLE_PLACES_API_KEY}`;
    
    const detailsResponse = await fetch(detailsUrl);
    const detailsData = await detailsResponse.json();

    if (!detailsResponse.ok || detailsData.status !== 'OK') {
      console.error('Place details failed:', detailsData);
      return new Response(JSON.stringify({ 
        imageUrl: null,
        websiteUrl: null,
        googleMapsUrl: null,
        error: 'Could not get place details' 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const placeDetails = detailsData.result;
    
    // Get photo URL if available
    let imageUrl = null;
    if (placeDetails.photos && placeDetails.photos.length > 0) {
      const photoReference = placeDetails.photos[0].photo_reference;
      const maxWidth = 400; // Optimal size for mobile cards
      imageUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxWidth}&photo_reference=${photoReference}&key=${GOOGLE_PLACES_API_KEY}`;
    }

    // Get verified URLs
    const websiteUrl = placeDetails.website || null;
    const googleMapsUrl = placeDetails.url || `https://www.google.com/maps/place/?q=place_id:${place.place_id}`;

    console.log(`Found details for ${placeName}:`, {
      imageUrl: imageUrl ? 'Available' : 'None',
      websiteUrl: websiteUrl ? 'Available' : 'None',
      googleMapsUrl: 'Available'
    });

    return new Response(JSON.stringify({ 
      imageUrl,
      websiteUrl,
      googleMapsUrl,
      place_id: place.place_id,
      name: placeDetails.name,
      rating: placeDetails.rating,
      formatted_address: placeDetails.formatted_address,
      price_level: placeDetails.price_level
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in get-place-details function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      imageUrl: null,
      websiteUrl: null,
      googleMapsUrl: null
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});