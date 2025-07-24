import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ExpediaHotelData {
  name: string;
  bookingUrl: string;
  imageUrl?: string;
  rating?: number;
  price?: string;
  description?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { hotelName, destination } = await req.json();

    if (!hotelName) {
      return new Response(
        JSON.stringify({ error: 'Hotel name is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // For now, we'll generate Expedia affiliate links based on the hotel name and destination
    // In a production environment, you would integrate with Expedia's Partner API
    const expediaData: ExpediaHotelData = {
      name: hotelName,
      bookingUrl: buildExpediaUrl(hotelName, destination),
      // These would come from actual Expedia API in production
      imageUrl: `https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop`,
      rating: 4.2,
      price: 'Starting from $180/night',
      description: `Book ${hotelName} with our partner Expedia for the best rates and deals.`
    };

    console.log(`Generated Expedia data for hotel: ${hotelName}`);

    return new Response(
      JSON.stringify(expediaData),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in expedia-hotel-lookup function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function buildExpediaUrl(hotelName: string, destination?: string): string {
  const baseUrl = 'https://www.expedia.com/Hotel-Search';
  // Use the same affiliate credentials as defined in affiliateConfig.js
  const clickref = '1101l5dQSW';
  const camref = '1101l5dQSW';
  
  // Use destination if provided, otherwise use hotel name for search
  const searchTerm = destination || hotelName;
  const encodedDestination = encodeURIComponent(searchTerm);
  
  // Build comprehensive affiliate URL with proper parameters
  const affiliateParams = new URLSearchParams({
    destination: searchTerm,
    clickref: clickref,
    camref: camref,
    rooms: '1',
    adults: '2'
  });
  
  return `${baseUrl}?${affiliateParams.toString()}`;
}