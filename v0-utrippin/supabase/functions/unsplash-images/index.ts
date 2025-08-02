import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface UnsplashImage {
  id: string;
  urls: {
    raw: string;
    full: string;
    regular: string;
    small: string;
    thumb: string;
  };
  alt_description: string | null;
  description: string | null;
  user: {
    name: string;
    username: string;
  };
  width: number;
  height: number;
}

interface UnsplashResponse {
  results: UnsplashImage[];
  total: number;
  total_pages: number;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { destination, description, tags = [], perPage = 20 } = await req.json();
    
    const accessKey = Deno.env.get('UNSPLASH_ACCESS_KEY');
    if (!accessKey) {
      console.error('UNSPLASH_ACCESS_KEY not found');
      return new Response(
        JSON.stringify({ error: 'Unsplash access key not configured' }), 
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    // Build search query
    let searchQuery = destination;
    
    if (description) {
      // Extract visual terms from description
      const visualTerms = description.match(/\b(beach|mountain|city|temple|castle|waterfall|forest|desert|lake|ocean|skyline|architecture|historic|ancient|modern|scenic|landscape|sunset|sunrise|nature|urban|cultural|traditional|colorful|vibrant)\b/gi);
      if (visualTerms && visualTerms.length > 0) {
        searchQuery += ` ${visualTerms.slice(0, 2).join(' ')}`;
      }
    }
    
    if (tags && tags.length > 0) {
      searchQuery += ` ${tags.slice(0, 2).join(' ')}`;
    }

    console.log(`Unsplash query: ${searchQuery}`);

    // Call Unsplash Search API
    const unsplashUrl = new URL('https://api.unsplash.com/search/photos');
    unsplashUrl.searchParams.append('query', searchQuery);
    unsplashUrl.searchParams.append('per_page', perPage.toString());
    unsplashUrl.searchParams.append('orientation', 'landscape');
    unsplashUrl.searchParams.append('order_by', 'relevant');

    const response = await fetch(unsplashUrl.toString(), {
      headers: {
        'Authorization': `Client-ID ${accessKey}`,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Unsplash error ${response.status}:`, errorText);
      return new Response(
        JSON.stringify({ error: `Unsplash API returned ${response.status}` }), 
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: response.status }
      );
    }

    const data: UnsplashResponse = await response.json();
    
    if (!data.results || data.results.length === 0) {
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

    // Transform Unsplash results to our standard format
    const transformedImages = data.results
      .filter(img => img.width >= 800 && img.height >= 600) // Quality filter
      .map(img => ({
        id: img.id,
        url: img.urls.regular,
        alt: img.alt_description || img.description || `${destination} photography`,
        photographer: img.user.name,
        src: {
          large: img.urls.full,
          medium: img.urls.regular,
          small: img.urls.small
        },
        width: img.width,
        height: img.height
      }));

    console.log(`Found ${transformedImages.length} quality images for ${destination}`);

    return new Response(
      JSON.stringify({
        images: transformedImages,
        total: data.total,
        query: searchQuery,
        source: 'Unsplash'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Unsplash function error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }), 
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
