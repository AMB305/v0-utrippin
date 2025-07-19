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
    const url = new URL(req.url);
    const origin = url.searchParams.get('origin') || 'FLL';
    const destination = url.searchParams.get('destination') || 'STX';
    const departDate = url.searchParams.get('departDate') || '2025-07-26';
    const returnDate = url.searchParams.get('returnDate') || '2025-08-11';
    const passengers = url.searchParams.get('passengers') || '1';

    // Generate mock Trip.com flights with variations
    const tripComFlights = [
      {
        origin,
        destination,
        departDate,
        returnDate,
        passengers,
        departTime: "12:45 PM",
        returnTime: "3:30 PM",
        price: "329"
      },
      {
        origin,
        destination,
        departDate,
        returnDate,
        passengers,
        departTime: "1:15 PM",
        returnTime: "4:05 PM",
        price: "345"
      },
      {
        origin,
        destination,
        departDate,
        returnDate,
        passengers,
        departTime: "2:00 PM",
        returnTime: "5:00 PM",
        price: "359"
      },
      {
        origin,
        destination,
        departDate,
        returnDate,
        passengers,
        departTime: "6:30 AM",
        returnTime: "9:15 AM",
        price: "299"
      },
      {
        origin,
        destination,
        departDate,
        returnDate,
        passengers,
        departTime: "8:45 PM",
        returnTime: "11:30 PM",
        price: "279"
      }
    ];

    console.log(`Generated ${tripComFlights.length} Trip.com flights for ${origin} → ${destination}`);

    return new Response(
      JSON.stringify(tripComFlights),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('Error generating Trip.com flights:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to generate Trip.com flights' }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});