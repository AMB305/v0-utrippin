import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface PexelsPhoto {
  id: number;
  width: number;
  height: number;
  url: string;
  photographer: string;
  photographer_url: string;
  photographer_id: number;
  avg_color: string;
  src: {
    original: string;
    large2x: string;
    large: string;
    medium: string;
    small: string;
    portrait: string;
    landscape: string;
    tiny: string;
  };
  liked: boolean;
  alt: string;
}

interface PexelsResponse {
  page: number;
  per_page: number;
  photos: PexelsPhoto[];
  total_results: number;
  next_page?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { destination, tags = [], perPage = 5, category = 'travel', description } = await req.json();
    
    if (!destination) {
      return new Response(
        JSON.stringify({ error: 'Destination parameter is required' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const PEXELS_API_KEY = Deno.env.get('PEXELS_API_KEY');
    if (!PEXELS_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'Pexels API key not configured' }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Enhanced search query construction based on category and tags
    let searchTerms = [destination];
    
    // Add category-specific terms
    if (category === 'event') {
      searchTerms.push('festival', 'celebration', 'gathering');
    } else if (category === 'travel') {
      searchTerms.push('travel', 'tourism', 'vacation');
    } else if (category === 'people') {
      searchTerms.push('traveler', 'tourist', 'person');
    } else if (category) {
      searchTerms.push(category);
    }
    
    // Add description keywords if provided
    if (description) {
      const descWords = description.split(' ').filter(word => 
        word.length > 3 && 
        !['the', 'and', 'with', 'from', 'this', 'that', 'will', 'have'].includes(word.toLowerCase())
      );
      searchTerms.push(...descWords.slice(0, 2));
    }
    
    // Add relevant tags
    searchTerms.push(...tags.slice(0, 3));
    
    const query = searchTerms.filter(Boolean).join(' ').trim();
    
    console.log(`Searching Pexels for: "${query}" with category: ${category}`);
    
    const pexelsUrl = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${perPage}&orientation=landscape`;

    const response = await fetch(pexelsUrl, {
      headers: {
        'Authorization': PEXELS_API_KEY,
        'User-Agent': 'UTrippin/1.0'
      }
    });

    if (!response.ok) {
      console.error(`Pexels API error: ${response.status} ${response.statusText}`);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch from Pexels API' }),
        { 
          status: response.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const data: PexelsResponse = await response.json();
    
    // Transform the response to match our frontend expectations
    const images = data.photos.map(photo => ({
      id: photo.id,
      url: photo.src.large,
      largeImageURL: photo.src.large2x,
      webformatURL: photo.src.medium,
      tags: query,
      photographer: photo.photographer,
      photographer_url: photo.photographer_url,
      alt: photo.alt || `Beautiful view of ${destination}`,
      views: 0, // Pexels doesn't provide view count
      downloads: 0 // Pexels doesn't provide download count
    }));

    console.log(`Found ${images.length} images for "${query}"`);

    return new Response(
      JSON.stringify({
        images,
        total: data.total_results,
        query: query
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error in pexels-images function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});