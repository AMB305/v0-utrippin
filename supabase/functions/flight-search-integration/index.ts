// supabase/functions/flight-search-integration/index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const duffelApiKey = Deno.env.get('DUFFEL_API_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      origin, 
      destination, 
      departureDate, 
      returnDate,
      passengers = 1,
      userId 
    } = await req.json();

    if (!origin || !destination || !departureDate) {
      throw new Error('Missing required parameters: origin, destination, departureDate');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get user data (optional - for any user-specific features)
    let userRole = 'customer';
    if (userId) {
      // Check if user has agent role for any agent-specific features
      const { data: roles } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId);
      
      userRole = roles?.some(r => r.role === 'agent') ? 'agent' : 'customer';
    }

    // Search for flights using Duffel API
    const searchResults = await searchFlights({
      origin,
      destination,
      departureDate,
      returnDate,
      passengers
    });

    // Format results for BookingModule schema
    const flightModule = {
      title: "Flight Options",
      items: searchResults.map((flight: any) => ({
        name: `${flight.airline} ${flight.flightNumber}`,
        price: flight.price,
        rating: flight.rating || 4.2,
        imageUrl: flight.airlineLogoUrl,
        bookingLink: buildKeilaFlightBookingUrl(origin, destination, departureDate, returnDate),
        amenities: flight.amenities,
        description: `${flight.duration} • ${flight.stops === 0 ? 'Direct' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}`
      })),
      defaultUrl: buildDefaultFlightUrl(origin, destination, departureDate, returnDate)
    };

    return new Response(
      JSON.stringify({ flightModule }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Flight search error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        flightModule: {
          title: "Flight Options",
          items: [],
          defaultUrl: "https://www.skyscanner.com"
        }
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

async function searchFlights({
  origin,
  destination,
  departureDate,
  returnDate,
  passengers
}: {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  passengers: number;
}) {
  if (!duffelApiKey) {
    // Return mock data if no API key
    return generateMockFlights(origin, destination, departureDate, returnDate);
  }

  try {
    // Create flight search with Duffel
    const searchResponse = await fetch('https://api.duffel.com/air/offer_requests', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${duffelApiKey}`,
        'Duffel-Version': 'v1'
      },
      body: JSON.stringify({
        data: {
          slices: [
            {
              origin,
              destination,
              departure_date: departureDate
            },
            ...(returnDate ? [{
              origin: destination,
              destination: origin,
              departure_date: returnDate
            }] : [])
          ],
          passengers: Array(passengers).fill({
            type: 'adult'
          }),
          cabin_class: 'economy'
        }
      })
    });

    if (!searchResponse.ok) {
      throw new Error(`Duffel API error: ${searchResponse.statusText}`);
    }

    const searchData = await searchResponse.json();
    const requestId = searchData.data.id;

    // Get offers
    const offersResponse = await fetch(`https://api.duffel.com/air/offers?offer_request_id=${requestId}`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${duffelApiKey}`,
        'Duffel-Version': 'v1'
      }
    });

    if (!offersResponse.ok) {
      throw new Error(`Duffel offers API error: ${offersResponse.statusText}`);
    }

    const offersData = await offersResponse.json();
    
    return offersData.data.slice(0, 3).map((offer: any) => ({
      airline: offer.slices[0].segments[0].marketing_carrier.name,
      flightNumber: offer.slices[0].segments[0].marketing_carrier_flight_number,
      price: `$${Math.round(parseFloat(offer.total_amount))}`,
      duration: offer.slices[0].duration,
      stops: offer.slices[0].segments.length - 1,
      bookingUrl: `https://www.skyscanner.com/flights/${origin}/${destination}/${departureDate}${returnDate ? `/${returnDate}` : ''}`,
      agentUrl: `https://www.skyscanner.com/flights/${origin}/${destination}/${departureDate}${returnDate ? `/${returnDate}` : ''}?associate_id=AGENT_001`,
      airlineLogoUrl: offer.slices[0].segments[0].marketing_carrier.logo_url,
      amenities: ['Carry-on included', 'Seat selection'],
      rating: 4.2 + Math.random() * 0.6
    }));

  } catch (error) {
    console.error('Duffel API error:', error);
    return generateMockFlights(origin, destination, departureDate, returnDate);
  }
}

function generateMockFlights(origin: string, destination: string, departureDate: string, returnDate?: string) {
  const airlines = [
    { name: 'Delta Air Lines', code: 'DL' },
    { name: 'American Airlines', code: 'AA' },
    { name: 'United Airlines', code: 'UA' }
  ];

  return airlines.map((airline, index) => ({
    airline: airline.name,
    flightNumber: `${airline.code}${1200 + index * 100}`,
    price: `$${400 + index * 150}`,
    duration: 'PT5H30M',
    stops: index === 0 ? 0 : 1,
    bookingUrl: `https://www.skyscanner.com/flights/${origin}/${destination}/${departureDate}${returnDate ? `/${returnDate}` : ''}`,
    agentUrl: `https://www.skyscanner.com/flights/${origin}/${destination}/${departureDate}${returnDate ? `/${returnDate}` : ''}?associate_id=AGENT_001`,
    amenities: ['Carry-on included', index === 2 ? 'Premium seat' : 'Standard seat'],
    rating: 4.2 + Math.random() * 0.6
  }));
}

function buildKeilaFlightBookingUrl(origin: string, destination: string, departureDate: string, returnDate?: string) {
  // Your Commission Junction affiliate tracking for Expedia
  const affiliateId = "101486313";
  const advertiserId = "15575456";
  
  // Build the Expedia flight search URL
  const expediaUrl = `https://www.expedia.com/Flights-Search?trip=${returnDate ? 'roundtrip' : 'oneway'}&leg1=from:${origin},to:${destination},departure:${departureDate}${returnDate ? `&leg2=from:${destination},to:${origin},departure:${returnDate}` : ''}&passengers=adults:1&options=cabinclass:economy`;
  
  // Wrap with CJ tracking
  return `https://www.jdoqocy.com/click-${affiliateId}-${advertiserId}?url=${encodeURIComponent(expediaUrl)}`;
}

async function buildFlightBookingUrl(flight: any, userRole: string, userId?: string) {
  // This function is no longer used - keeping for backward compatibility
  return buildKeilaFlightBookingUrl(flight.origin || 'NYC', flight.destination || 'LAX', flight.departureDate || '2024-03-01', flight.returnDate);
}

function buildDefaultFlightUrl(origin: string, destination: string, departureDate: string, returnDate?: string) {
  const affiliateId = "101486313";
  const advertiserId = "15575456";
  
  const expediaUrl = `https://www.expedia.com/Flights-Search?trip=${returnDate ? 'roundtrip' : 'oneway'}&leg1=from:${origin},to:${destination},departure:${departureDate}${returnDate ? `&leg2=from:${destination},to:${origin},departure:${returnDate}` : ''}&passengers=adults:1&options=cabinclass:economy`;
  
  return `https://www.jdoqocy.com/click-${affiliateId}-${advertiserId}?url=${encodeURIComponent(expediaUrl)}`;
}
