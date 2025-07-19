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

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method Not Allowed" }), 
      { 
        status: 405,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }

  try {
    const { origin, destination, departDate, returnDate, passengers } = await req.json();

    console.log(`Dynamic flight search: ${origin} → ${destination}, ${passengers} passengers`);

    const flights = [
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

    console.log(`Generated ${flights.length} dynamic Trip.com flights for ${origin} → ${destination}`);

    return new Response(
      JSON.stringify(flights),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('Error generating dynamic Trip.com flights:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to generate dynamic Trip.com flights' }),
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