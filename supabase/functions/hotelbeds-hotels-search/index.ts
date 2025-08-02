import { createClient } from "https://esm.sh/@supabase/supabase-js";
import { createHash } from "https://deno.land/std@0.177.0/crypto/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const hotelbedsApiKey = Deno.env.get('HOTELBEDS_API_KEY')!;
const hotelbedsSecret = Deno.env.get('HOTELBEDS_SECRET')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

function createSignature(apiKey: string, secret: string, timestamp: number): string {
  const data = apiKey + secret + timestamp;
  const encoder = new TextEncoder();
  const hash = createHash("sha256");
  hash.update(encoder.encode(data));
  return hash.toString("hex");
}

export default async function handler(request: Request) {
  const requestId = `search-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log(`[${requestId}] Hotel search request initiated`);
    
    const { 
      destination, 
      checkIn, 
      checkOut, 
      adults = 2, 
      children = 0, 
      rooms = 1,
      category,
      amenities,
      hotelType
    } = await request.json();

    console.log(`[${requestId}] Search parameters:`, {
      destination,
      checkIn,
      checkOut,
      adults,
      children,
      rooms,
      category,
      amenities,
      hotelType
    });

    if (!destination || !checkIn || !checkOut) {
      console.error(`[${requestId}] Missing required parameters:`, { destination, checkIn, checkOut });
      return new Response(JSON.stringify({ 
        error: 'Missing required parameters',
        required: ['destination', 'checkIn', 'checkOut'],
        requestId 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Validate dates
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const now = new Date();
    
    if (checkInDate < now) {
      console.error(`[${requestId}] Check-in date is in the past:`, checkIn);
      return new Response(JSON.stringify({ 
        error: 'Check-in date cannot be in the past',
        requestId 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (checkOutDate <= checkInDate) {
      console.error(`[${requestId}] Check-out date must be after check-in:`, { checkIn, checkOut });
      return new Response(JSON.stringify({ 
        error: 'Check-out date must be after check-in date',
        requestId 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Create API signature
    const timestamp = Math.floor(Date.now() / 1000);
    const signature = createSignature(hotelbedsApiKey, hotelbedsSecret, timestamp);

    console.log(`[${requestId}] API signature created for timestamp: ${timestamp}`);

    // Hotelbeds Hotels API search request
    const searchPayload: any = {
      stay: {
        checkIn,
        checkOut
      },
      occupancies: [
        {
          rooms: rooms,
          adults: adults,
          children: children
        }
      ],
      destination: {
        code: destination // This should be a destination code from Hotelbeds
      }
    };

    // Add filters based on category and amenities
    if (amenities && amenities.length > 0) {
      searchPayload.filter = {
        ...(searchPayload.filter || {}),
        facilityGroups: amenities.map((amenity: string) => ({ group: amenity }))
      };
    }

    if (hotelType) {
      searchPayload.filter = {
        ...(searchPayload.filter || {}),
        hotelType: hotelType
      };
    }

    if (category) {
      searchPayload.filter = {
        ...(searchPayload.filter || {}),
        category: category.toLowerCase()
      };
    }

    console.log(`[${requestId}] Making Hotelbeds API request:`, searchPayload);

    const startTime = Date.now();
    const response = await fetch('https://api.hotelbeds.com/hotel-api/1.0/hotels', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Api-key': hotelbedsApiKey,
        'X-Signature': signature,
        'Accept': 'application/json',
        'Accept-Encoding': 'gzip',
        'User-Agent': 'UTRIPPIN/1.0 (Hotelbeds Certified Partner)'
      },
      body: JSON.stringify(searchPayload)
    });

    const responseTime = Date.now() - startTime;
    console.log(`[${requestId}] Hotelbeds API response received in ${responseTime}ms with status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[${requestId}] Hotelbeds API error:`, {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
        responseTime
      });
      
      return new Response(JSON.stringify({ 
        error: 'Hotel search failed', 
        details: errorText,
        status: response.status,
        requestId,
        responseTime
      }), {
        status: response.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const hotelData = await response.json();
    console.log(`[${requestId}] Hotelbeds API response processed:`, {
      totalHotels: hotelData.hotels?.total || 0,
      hotelsReturned: hotelData.hotels?.hotels?.length || 0,
      responseTime
    });

    // Transform the response to match our frontend expectations and Hotelbeds compliance
    const transformedHotels = hotelData.hotels?.hotels?.map((hotel: any) => {
      const room = hotel.rooms?.[0];
      const rate = room?.rates?.[0];
      
      return {
        id: hotel.code,
        name: hotel.name,
        starRating: hotel.categoryCode ? parseInt(hotel.categoryCode) : 0,
        images: hotel.images ? hotel.images.map((img: any) => img.path) : ['/placeholder.svg'],
        location: `${hotel.destinationName || destination}`,
        district: hotel.zoneName || 'City Center',
        distanceFromCenter: hotel.distance ? `${hotel.distance}km` : 'N/A',
        guestRating: hotel.ranking ? parseFloat(hotel.ranking) : 0,
        reviewCount: hotel.reviewCount || 0,
        amenities: hotel.facilities ? hotel.facilities.map((f: any) => f.description) : [],
        pricePerNight: rate?.net || hotel.minRate || 0,
        totalPrice: rate?.net || hotel.totalNet || 0,
        currency: hotel.currency || 'EUR',
        freeCancellation: rate?.cancellationPolicies ? rate.cancellationPolicies.some((p: any) => p.amount === 0) : false,
        payAtProperty: rate?.paymentType === 'AT_HOTEL',
        breakfastIncluded: rate?.boardName?.toLowerCase().includes('breakfast') || false,
        
        // Hotelbeds specific fields for compliance
        rateKey: rate?.rateKey, // Critical for CheckRate and booking
        rateType: rate?.rateType || 'BOOKABLE', // BOOKABLE vs RECHECK
        rateClass: rate?.rateClass,
        boardName: rate?.boardName || 'RO', // Room Only, Breakfast, etc.
        roomType: room?.name || 'Standard Room',
        cancellationPolicies: rate?.cancellationPolicies || [],
        rateCommentsId: rate?.rateCommentsId,
        promotions: rate?.promotions || [],
        packaging: rate?.packaging || false,
        hotelMandatory: rate?.hotelMandatory || false
      };
    }) || [];

    console.log(`[${requestId}] Search completed successfully:`, {
      hotelsTransformed: transformedHotels.length,
      totalResponseTime: responseTime
    });

    return new Response(JSON.stringify({ 
      hotels: transformedHotels,
      total: hotelData.hotels?.total || 0,
      requestId,
      responseTime
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error(`[${requestId}] Error in hotelbeds-hotels-search:`, {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error',
      requestId
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}
