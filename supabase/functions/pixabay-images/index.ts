import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface PixabayImage {
  id: number
  webformatURL: string
  largeImageURL: string
  tags: string
  user: string
  views: number
  downloads: number
}

interface PixabayResponse {
  hits: PixabayImage[]
  total: number
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { destination, description, tags, category = 'places' } = await req.json()
    
    if (!destination) {
      return new Response(
        JSON.stringify({ error: 'Destination is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    const pixabayApiKey = Deno.env.get('PIXABAY_API_KEY')
    if (!pixabayApiKey) {
      return new Response(
        JSON.stringify({ error: 'Pixabay API key not configured' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    // Build search query combining destination, description, and tags
    const searchTerms = [
      destination,
      ...(description ? [description] : []),
      ...(tags ? tags.slice(0, 3) : []), // Limit to first 3 tags
      'travel', 'tourism'
    ].join(' ')

    const url = new URL('https://pixabay.com/api/')
    url.searchParams.set('key', pixabayApiKey)
    url.searchParams.set('q', searchTerms)
    url.searchParams.set('image_type', 'photo')
    url.searchParams.set('orientation', 'horizontal')
    url.searchParams.set('category', category)
    url.searchParams.set('min_width', '640')
    url.searchParams.set('min_height', '480')
    url.searchParams.set('safesearch', 'true')
    url.searchParams.set('per_page', '10')
    url.searchParams.set('order', 'popular')

    console.log(`🖼️ Searching Pixabay for: ${searchTerms}`)

    const response = await fetch(url.toString())
    
    if (!response.ok) {
      throw new Error(`Pixabay API error: ${response.status}`)
    }

    const data: PixabayResponse = await response.json()
    
    console.log(`✅ Found ${data.hits.length} images for ${destination}`)

    // Return the best images with metadata
    const images = data.hits.map(hit => ({
      id: hit.id,
      url: hit.webformatURL,
      largeUrl: hit.largeImageURL,
      tags: hit.tags,
      photographer: hit.user,
      views: hit.views,
      downloads: hit.downloads
    }))

    return new Response(
      JSON.stringify({ 
        images,
        total: data.total,
        searchQuery: searchTerms
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in pixabay-images function:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Failed to fetch images',
        details: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 500 
      }
    )
  }
})
