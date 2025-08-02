import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface AirportResult {
  iata_code: string
  name: string
  city: string
  country: string
}

export default async function handler(req: Request) {
  console.log(`🛫 Airport search request: ${req.method}`)
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('✅ CORS preflight handled')
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const body = await req.json()
    console.log('📥 Request body:', JSON.stringify(body))
    
    const { query } = body
    
    if (!query || query.length < 2) {
      console.log('❌ Query too short:', query)
      return new Response(
        JSON.stringify({ error: 'Query must be at least 2 characters' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    const duffelApiKey = Deno.env.get('DUFFEL_API_KEY')
    if (!duffelApiKey) {
      console.error('❌ No Duffel API key found in environment')
      // Return fallback airports immediately
      const fallbackAirports = getBasicAirportMatches(query)
      return new Response(
        JSON.stringify({ airports: fallbackAirports }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log(`🔍 Searching airports for: "${query}"`)

    // Test query for connectivity
    if (query.toLowerCase() === 'test') {
      console.log('🧪 Test query detected, returning mock data')
      return new Response(
        JSON.stringify({ 
          airports: [
            {
              iata_code: 'JFK',
              name: 'John F. Kennedy International Airport',
              city: 'New York',
              country: 'United States'
            }
          ]
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    let airports: AirportResult[] = []
    
    try {
      // Use Duffel API for airport search
      console.log('🌐 Calling Duffel API...')
      const response = await fetch(
        `https://api.duffel.com/air/airports?name=${encodeURIComponent(query)}`,
        {
          headers: {
            'Authorization': `Bearer ${duffelApiKey}`,
            'Duffel-Version': 'v1',
            'Content-Type': 'application/json'
          },
          signal: AbortSignal.timeout(8000)
        }
      )

      console.log(`📡 Duffel API Response: ${response.status}`)

      if (response.ok) {
        const data = await response.json()
        console.log('✅ Duffel data received')
        
        airports = (data.data || []).map((airport: any) => ({
          iata_code: airport.iata_code,
          name: airport.name,
          city: airport.city_name || airport.city?.name || 'Unknown',
          country: airport.country_name || airport.country?.name || 'Unknown'
        })).filter((airport: any) => airport.iata_code) // Only include airports with IATA codes
      } else {
        console.log('📋 Duffel API failed, using fallback airport list')
        airports = getBasicAirportMatches(query)
      }
      
    } catch (fetchError) {
      console.error('🚨 Duffel API fetch error:', fetchError)
      // Always fallback to basic airport matches
      airports = getBasicAirportMatches(query)
    }

    console.log(`📊 Found ${airports.length} airports`)

    return new Response(
      JSON.stringify({ airports }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('💥 Airport search error:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
}

// Enhanced fallback function with more airports
function getBasicAirportMatches(query: string): AirportResult[] {
  const basicAirports = [
    // US Major Airports
    { iata_code: 'JFK', name: 'John F. Kennedy International Airport', city: 'New York', country: 'United States' },
    { iata_code: 'LAX', name: 'Los Angeles International Airport', city: 'Los Angeles', country: 'United States' },
    { iata_code: 'MIA', name: 'Miami International Airport', city: 'Miami', country: 'United States' },
    { iata_code: 'ORD', name: 'O\'Hare International Airport', city: 'Chicago', country: 'United States' },
    { iata_code: 'ATL', name: 'Hartsfield-Jackson Atlanta International Airport', city: 'Atlanta', country: 'United States' },
    { iata_code: 'DFW', name: 'Dallas/Fort Worth International Airport', city: 'Dallas', country: 'United States' },
    { iata_code: 'SFO', name: 'San Francisco International Airport', city: 'San Francisco', country: 'United States' },
    { iata_code: 'LAS', name: 'McCarran International Airport', city: 'Las Vegas', country: 'United States' },
    { iata_code: 'SEA', name: 'Seattle-Tacoma International Airport', city: 'Seattle', country: 'United States' },
    { iata_code: 'BOS', name: 'Logan International Airport', city: 'Boston', country: 'United States' },
    
    // International Major Airports
    { iata_code: 'LHR', name: 'Heathrow Airport', city: 'London', country: 'United Kingdom' },
    { iata_code: 'CDG', name: 'Charles de Gaulle Airport', city: 'Paris', country: 'France' },
    { iata_code: 'NRT', name: 'Narita International Airport', city: 'Tokyo', country: 'Japan' },
    { iata_code: 'DXB', name: 'Dubai International Airport', city: 'Dubai', country: 'United Arab Emirates' },
    { iata_code: 'SYD', name: 'Sydney Kingsford Smith Airport', city: 'Sydney', country: 'Australia' },
    { iata_code: 'YYZ', name: 'Toronto Pearson International Airport', city: 'Toronto', country: 'Canada' },
    { iata_code: 'AMS', name: 'Amsterdam Airport Schiphol', city: 'Amsterdam', country: 'Netherlands' },
    { iata_code: 'FRA', name: 'Frankfurt Airport', city: 'Frankfurt', country: 'Germany' },
    { iata_code: 'SIN', name: 'Singapore Changi Airport', city: 'Singapore', country: 'Singapore' },
    { iata_code: 'HKG', name: 'Hong Kong International Airport', city: 'Hong Kong', country: 'Hong Kong' }
  ]
  
  const queryLower = query.toLowerCase()
  return basicAirports.filter(airport => 
    airport.city.toLowerCase().includes(queryLower) ||
    airport.name.toLowerCase().includes(queryLower) ||
    airport.iata_code.toLowerCase().includes(queryLower)
  )
}
