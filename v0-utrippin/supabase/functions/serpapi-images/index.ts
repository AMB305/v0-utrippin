import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { destination, tags = [], description } = await req.json();
    const serpApiKey = Deno.env.get('SERPAPI_API_KEY');

    if (!serpApiKey) {
      throw new Error('SERPAPI_API_KEY not configured');
    }

    // Build search query
    let query = destination;
    if (description) {
      query += ` ${description}`;
    }
    if (tags?.length > 0) {
      query += ` ${tags.join(' ')}`;
    }
    
    // Add quality and licensing terms
    query += ' HD high quality travel destination';

    console.log('SerpAPI Image Search Query:', query);

    // Search Google Images via SerpAPI
    const serpApiUrl = new URL('https://serpapi.com/search');
    serpApiUrl.searchParams.set('engine', 'google');
    serpApiUrl.searchParams.set('q', query);
    serpApiUrl.searchParams.set('tbm', 'isch'); // Image search
    serpApiUrl.searchParams.set('api_key', serpApiKey);
    serpApiUrl.searchParams.set('num', '20'); // Get 20 results
    serpApiUrl.searchParams.set('safe', 'active');
    serpApiUrl.searchParams.set('ijn', '0'); // First page
    
    // Filter for high-quality images
    serpApiUrl.searchParams.set('tbs', 'isz:l,itp:photo'); // Large size, photos only

    console.log('SerpAPI Request URL:', serpApiUrl.toString().replace(serpApiKey, '***'));

    const response = await fetch(serpApiUrl.toString());
    
    if (!response.ok) {
      throw new Error(`SerpAPI request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('SerpAPI Response Status:', data.search_metadata?.status);

    if (!data.images_results || data.images_results.length === 0) {
      console.log('No images found in SerpAPI response');
      return new Response(
        JSON.stringify({ images: [], message: 'No images found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Transform SerpAPI results to our format
    const images = data.images_results
      .filter((img: any) => {
        // Filter out small images and non-HTTPS URLs
        return img.original && 
               img.original.startsWith('https://') &&
               img.original_width >= 800 &&
               img.original_height >= 600;
      })
      .slice(0, 10) // Take top 10 results
      .map((img: any) => ({
        url: img.original,
        title: img.title || `${destination} image`,
        width: img.original_width,
        height: img.original_height,
        source: img.source || 'Google Images',
        link: img.link,
        photographer: img.source || 'Unknown',
        alt: img.title || `Beautiful view of ${destination}`
      }));

    console.log(`SerpAPI: Found ${images.length} quality images for "${destination}"`);

    return new Response(
      JSON.stringify({ 
        images,
        total: images.length,
        query: query,
        api: 'serpapi'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('SerpAPI Image Search Error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message, 
        images: [],
        api: 'serpapi'
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
