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
    const cars = [
      {
        location: "St. Croix Airport",
        pickup: "2025-07-26",
        dropoff: "2025-08-11",
        carType: "SUV",
        price: "69",
        currency: "USD"
      },
      {
        location: "St. Croix Airport",
        pickup: "2025-07-26",
        dropoff: "2025-08-11",
        carType: "Compact",
        price: "49",
        currency: "USD"
      },
      {
        location: "St. Croix Airport",
        pickup: "2025-07-26",
        dropoff: "2025-08-11",
        carType: "Sedan",
        price: "59",
        currency: "USD"
      },
      {
        location: "St. Croix Airport",
        pickup: "2025-07-26",
        dropoff: "2025-08-11",
        carType: "Convertible",
        price: "89",
        currency: "USD"
      }
    ];

    console.log(`Generated ${cars.length} Trip.com car rental options`);

    return new Response(
      JSON.stringify(cars),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('Error generating Trip.com cars:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to generate Trip.com cars' }),
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
