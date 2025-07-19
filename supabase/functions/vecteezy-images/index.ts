import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { query } = await req.json()
    console.log('🔍 Vecteezy request received:', { query })
    
    if (!query) {
      console.error('❌ No query provided')
      return new Response(
        JSON.stringify({ error: 'Query parameter is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    const apiKey = Deno.env.get('VECTEEZY_API_KEY')
    if (!apiKey) {
      console.error('❌ VECTEEZY_API_KEY not found')
      return new Response(
        JSON.stringify({ error: 'API key not configured' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    console.log('🔑 API key found, length:', apiKey.length)
    
    const apiUrl = `https://api.vecteezy.com/v1/resources?term=${encodeURIComponent(query)}&content_type=photo&per_page=10&sort=popular`
    console.log('📡 Making request to:', apiUrl)

    const response = await fetch(apiUrl, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    })

    console.log('📊 Response status:', response.status, response.statusText)
    
    if (!response.ok) {
      // Enhanced error logging
      let errorBody = 'No error body'
      try {
        const errorText = await response.text()
        errorBody = errorText
        console.error('❌ Vecteezy API error body:', errorText)
      } catch (e) {
        console.error('❌ Could not read error body:', e)
      }
      
      console.error('❌ Vecteezy API error:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        body: errorBody
      })
      
      return new Response(
        JSON.stringify({ 
          error: 'Failed to fetch images from Vecteezy',
          details: {
            status: response.status,
            statusText: response.statusText,
            body: errorBody
          }
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: response.status }
      )
    }

    const data = await response.json()
    console.log('✅ Vecteezy API response structure:', {
      hasResources: !!data.resources,
      resourcesLength: data.resources?.length || 0,
      firstItemKeys: data.resources?.[0] ? Object.keys(data.resources[0]) : [],
      fullResponse: data
    })

    // Return the first high-quality image
    const images = data.resources || []
    const bestImage = images.find((img: any) => 
      img.preview_url && img.dimensions && img.dimensions.width >= 1024
    ) || images[0]
    
    console.log('🖼️ Best image selected:', {
      found: !!bestImage,
      url: bestImage?.preview_url,
      width: bestImage?.dimensions?.width,
      height: bestImage?.dimensions?.height
    })
    
    // Add camref tracking to Vecteezy URLs
    const addCamrefTracking = (url: string) => {
      if (url && url.includes('vecteezy.com')) {
        const separator = url.includes('?') ? '&' : '?'
        return `${url}${separator}camref=utrippin123`
      }
      return url
    }
    
    return new Response(
      JSON.stringify({ 
        images: images.map((img: any) => ({
          ...img,
          preview_url: addCamrefTracking(img.preview_url)
        })),
        bestImage: bestImage ? {
          url: addCamrefTracking(bestImage.preview_url),
          title: bestImage.title,
          width: bestImage.dimensions?.width,
          height: bestImage.dimensions?.height
        } : null
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('💥 Unexpected error:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error.message
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})