import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('Duffel Test function called with method:', req.method);
    
    const duffelApiKey = Deno.env.get('DUFFEL_API_KEY')
    console.log('DUFFEL_API_KEY configured:', !!duffelApiKey);
    
    if (!duffelApiKey) {
      console.error('DUFFEL_API_KEY not configured')
      throw new Error('DUFFEL_API_KEY not configured')
    }

    const requestBody = await req.json()
    console.log('Request body:', requestBody);
    
    const { action, data } = requestBody
    
    if (action === 'search_flights') {
      console.log('Processing search_flights action with data:', data);
      
      // Create offer request
      const duffelResponse = await fetch('https://api.duffel.com/air/offer_requests', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${duffelApiKey}`,
          'Content-Type': 'application/json',
          'Duffel-Version': 'v2'
        },
        body: JSON.stringify({
          data: {
            slices: [
              {
                origin: data.origin,
                destination: data.destination,
                departure_date: data.departure_date
              }
            ],
            passengers: [{ type: 'adult' }],
            cabin_class: 'economy'
          }
        })
      })

      console.log('Duffel API response status:', duffelResponse.status);
      
      if (!duffelResponse.ok) {
        const errorText = await duffelResponse.text();
        console.error('Duffel API error response:', errorText);
        throw new Error(`Duffel API error: ${duffelResponse.status} ${duffelResponse.statusText} - ${errorText}`)
      }

      const result = await duffelResponse.json()
      console.log('Duffel API success response:', JSON.stringify(result, null, 2));
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          offers: result.data.offers 
        }),
        { 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          } 
        }
      )
    }

    if (action === 'create_order') {
      // Create order (hold)
      const response = await fetch('https://api.duffel.com/air/orders', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${duffelApiKey}`,
          'Content-Type': 'application/json',
          'Duffel-Version': 'v2'
        },
        body: JSON.stringify({
          data: {
            selected_offers: [data.offer_id],
            passengers: [
              {
                id: 'passenger_1',
                title: 'mr',
                family_name: 'Test',
                given_name: 'User',
                gender: 'm',
                born_on: '1990-01-01',
                email: 'test@example.com',
                phone_number: '+1234567890'
              }
            ],
            type: 'pay_later'
          }
        })
      })

      if (!response.ok) {
        throw new Error(`Duffel API error: ${response.status} ${response.statusText}`)
      }

      const result = await response.json()
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          order: result.data 
        }),
        { 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          } 
        }
      )
    }

    throw new Error('Invalid action')

  } catch (error) {
    console.error('Duffel function error:', error)
    console.error('Error stack:', error.stack)
    return new Response(
      JSON.stringify({ 
        error: error.message 
      }),
      { 
        status: 400,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  }
})