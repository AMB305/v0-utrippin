import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, count = 1 } = await req.json();
    
    const pixabayKey = Deno.env.get('PIXABAY_API_KEY');
    const pexelsKey = Deno.env.get('PEXELS_API_KEY');
    
    let imageUrl = null;
    
    if (pixabayKey) {
      console.log('Fetching image from Pixabay for:', query);
      imageUrl = await fetchFromPixabay(query, pixabayKey);
    }
    
    if (!imageUrl && pexelsKey) {
      console.log('Fetching image from Pexels for:', query);
      imageUrl = await fetchFromPexels(query, pexelsKey);
    }
    
    if (!imageUrl) {
      console.log('No image found, using fallback');
      imageUrl = getFallbackImage(query);
    }

    return new Response(JSON.stringify({
      imageUrl,
      query,
      provider: imageUrl ? (pixabayKey ? 'Pixabay' : 'Pexels') : 'Fallback'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in destination-images function:', error);
    
    const { query = 'travel destination' } = await req.json().catch(() => ({}));
    
    return new Response(JSON.stringify({
      imageUrl: getFallbackImage(query),
      query,
      provider: 'Fallback',
      error: error.message
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function fetchFromPixabay(query: string, apiKey: string): Promise<string | null> {
  try {
    // Create more specific and location-focused search terms
    const locationSpecificTerms = `${query} city skyline landmarks attractions OR ${query} downtown OR ${query} tourism`;
    const searchQuery = encodeURIComponent(locationSpecificTerms);
    const response = await fetch(
      `https://pixabay.com/api/?key=${apiKey}&q=${searchQuery}&image_type=photo&category=places&min_width=800&min_height=600&per_page=5&safesearch=true&order=popular`
    );
    
    if (!response.ok) {
      throw new Error(`Pixabay API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.hits && data.hits.length > 0) {
      // Filter out generic images by checking tags and select most relevant
      const relevantImage = data.hits.find(hit => 
        hit.tags.toLowerCase().includes(query.toLowerCase()) ||
        hit.tags.toLowerCase().includes('city') ||
        hit.tags.toLowerCase().includes('landmark')
      ) || data.hits[0];
      
      return relevantImage.webformatURL;
    }
    
    return null;
  } catch (error) {
    console.error('Pixabay fetch error:', error);
    return null;
  }
}

async function fetchFromPexels(query: string, apiKey: string): Promise<string | null> {
  try {
    // Create more specific search for actual city/location imagery
    const locationSpecificSearch = `${query} city architecture landmarks OR ${query} skyline OR ${query} downtown streets`;
    const searchQuery = encodeURIComponent(locationSpecificSearch);
    const response = await fetch(
      `https://api.pexels.com/v1/search?query=${searchQuery}&per_page=5&orientation=landscape`,
      {
        headers: {
          'Authorization': apiKey
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`Pexels API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.photos && data.photos.length > 0) {
      // Find most relevant photo that mentions the location in alt text
      const relevantPhoto = data.photos.find(photo => 
        photo.alt.toLowerCase().includes(query.toLowerCase()) ||
        photo.alt.toLowerCase().includes('city') ||
        photo.alt.toLowerCase().includes('building')
      ) || data.photos[0];
      
      return relevantPhoto.src.large;
    }
    
    return null;
  } catch (error) {
    console.error('Pexels fetch error:', error);
    return null;
  }
}

function getFallbackImage(query: string): string {
  // Generate a gradient background based on the destination name
  const colors = [
    'from-blue-500 to-purple-600',
    'from-green-500 to-blue-600',
    'from-purple-500 to-pink-600',
    'from-orange-500 to-red-600',
    'from-teal-500 to-blue-600',
    'from-indigo-500 to-purple-600'
  ];
  
  const colorIndex = Math.abs(query.split('').reduce((a, b) => a + b.charCodeAt(0), 0)) % colors.length;
  const gradient = colors[colorIndex];
  
  // Return a data URL for a simple gradient
  return `data:image/svg+xml,%3Csvg width='800' height='600' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3ClinearGradient id='grad' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23${gradient.includes('blue') ? '3B82F6' : gradient.includes('green') ? '10B981' : gradient.includes('purple') ? '8B5CF6' : gradient.includes('orange') ? 'F97316' : gradient.includes('teal') ? '14B8A6' : '6366F1'};stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%23${gradient.includes('purple') ? '8B5CF6' : gradient.includes('blue') ? '2563EB' : gradient.includes('pink') ? 'EC4899' : gradient.includes('red') ? 'DC2626' : gradient.includes('teal') ? '0891B2' : '7C3AED'};stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23grad)' /%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='48' fill='white' text-anchor='middle' dy='.3em'%3E🌍%3C/text%3E%3C/svg%3E`;
}