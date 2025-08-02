import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SearchAPIImageResult {
  title: string;
  link: string;
  source: string;
  thumbnail: string;
  original: string;
  width: number;
  height: number;
}

interface SearchAPIResponse {
  images_results: SearchAPIImageResult[];
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { destination, description, tags = [], category = 'travel' } = await req.json();
    
    const apiKey = Deno.env.get('SEARCHAPI_API_KEY');
    if (!apiKey) {
      console.error('SEARCHAPI_API_KEY not found');
      return new Response(
        JSON.stringify({ error: 'SearchAPI key not configured' }), 
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    // Build search query using destination, description, and tags
    let searchQuery = destination;
    
    if (description) {
      // Extract key visual terms from description
      const visualTerms = description.match(/\b(beach|mountain|city|temple|castle|waterfall|forest|desert|lake|ocean|skyline|architecture|historic|ancient|modern|scenic|landscape|sunset|sunrise|nature|urban|cultural|traditional)\b/gi);
      if (visualTerms && visualTerms.length > 0) {
        searchQuery += ` ${visualTerms.slice(0, 3).join(' ')}`;
      }
    }
    
    if (tags && tags.length > 0) {
      searchQuery += ` ${tags.slice(0, 2).join(' ')}`;
    }
    
    // Add travel and HD quality terms
    searchQuery += ' travel photography HD';

    console.log(`SearchAPI query: ${searchQuery}`);

    // Call SearchAPI.io Images API
    const searchUrl = new URL('https://www.searchapi.io/api/v1/search');
    searchUrl.searchParams.append('q', searchQuery);
    searchUrl.searchParams.append('tbm', 'isch'); // Image search
    searchUrl.searchParams.append('num', '20'); // Get 20 results
    searchUrl.searchParams.append('safe', 'active');
    searchUrl.searchParams.append('api_key', apiKey);

    const response = await fetch(searchUrl.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`SearchAPI error ${response.status}:`, errorText);
      return new Response(
        JSON.stringify({ error: `SearchAPI returned ${response.status}` }), 
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: response.status }
      );
    }

    const data: SearchAPIResponse = await response.json();
    
    if (!data.images_results || data.images_results.length === 0) {
      console.log('No images found for query:', searchQuery);
      return new Response(
        JSON.stringify({ 
          images: [], 
          total: 0, 
          query: searchQuery,
          message: 'No images found'
        }), 
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Transform SearchAPI results to our standard format
    const transformedImages = data.images_results
      .filter(img => img.original && img.width >= 800 && img.height >= 600) // Filter for quality
      .slice(0, 10) // Take top 10
      .map(img => ({
        id: img.link,
        url: img.original,
        alt: img.title || `${destination} travel photography`,
        photographer: img.source || 'Unknown',
        src: {
          large: img.original,
          medium: img.thumbnail,
          small: img.thumbnail
        },
        width: img.width,
        height: img.height
      }));

    console.log(`Found ${transformedImages.length} quality images for ${destination}`);

    return new Response(
      JSON.stringify({
        images: transformedImages,
        total: transformedImages.length,
        query: searchQuery,
        source: 'SearchAPI'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('SearchAPI function error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }), 
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
