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
    const hotels = [
      {
        city: "St. Croix",
        checkIn: "2025-07-26",
        checkOut: "2025-08-11",
        guests: "2",
        hotelName: "Renaissance Carambola Beach",
        price: "259",
        currency: "USD"
      },
      {
        city: "St. Croix",
        checkIn: "2025-07-26",
        checkOut: "2025-08-11",
        guests: "2",
        hotelName: "The Buccaneer Beach & Golf Resort",
        price: "329",
        currency: "USD"
      },
      {
        city: "St. Croix",
        checkIn: "2025-07-26",
        checkOut: "2025-08-11",
        guests: "2",
        hotelName: "Carambola Beach Resort",
        price: "189",
        currency: "USD"
      },
      {
        city: "St. Croix",
        checkIn: "2025-07-26",
        checkOut: "2025-08-11",
        guests: "2",
        hotelName: "Hotel on the Cay",
        price: "229",
        currency: "USD"
      }
    ];

    console.log(`Generated ${hotels.length} Trip.com hotel options`);

    return new Response(
      JSON.stringify(hotels),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('Error generating Trip.com hotels:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to generate Trip.com hotels' }),
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
