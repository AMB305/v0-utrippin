// supabase/functions/hotel-affiliate-integration/index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      destination, 
      checkIn, 
      checkOut,
      guests = 2,
      rooms = 1,
      userId 
    } = await req.json();

    if (!destination || !checkIn || !checkOut) {
      throw new Error('Missing required parameters: destination, checkIn, checkOut');
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

    // Generate hotel options with affiliate URLs for ALL customers
    const hotelModule = await generateHotelOptions({
      destination,
      checkIn,
      checkOut,
      guests,
      rooms,
      userRole
    });

    return new Response(
      JSON.stringify({ hotelModule }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Hotel search error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        hotelModule: {
          title: "Where to Stay",
          items: [],
          defaultUrl: "https://www.booking.com"
        }
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

async function generateHotelOptions({
  destination,
  checkIn,
  checkOut,
  guests,
  rooms,
  userRole
}: {
  destination: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  rooms: number;
  userRole: string;
}) {
  const hotels = [
    {
      name: "Grand Plaza Hotel",
      basePrice: 180,
      rating: 4.5,
      amenities: ["Free WiFi", "Pool", "Spa", "Fitness Center"],
      description: "Luxury hotel in the heart of the city with panoramic views"
    },
    {
      name: "Comfort Inn & Suites",
      basePrice: 120,
      rating: 4.2,
      amenities: ["Free WiFi", "Breakfast Included", "Parking"],
      description: "Comfortable accommodations with excellent value"
    },
    {
      name: "Boutique Heritage Hotel",
      basePrice: 250,
      rating: 4.7,
      amenities: ["Free WiFi", "Restaurant", "Historic Building", "Concierge"],
      description: "Charming historic hotel with modern amenities"
    }
  ];

  return {
    title: "Where to Stay",
    items: hotels.map(hotel => {
      const searchParams = new URLSearchParams({
        destination: destination,
        checkin: checkIn,
        checkout: checkOut,
        guests: guests.toString(),
        rooms: rooms.toString()
      });

      // ALL customers get affiliate URLs when booking from Keila Bot
      const bookingUrl = buildKeilaAffiliateUrl(searchParams);

      return {
        name: hotel.name,
        price: `$${hotel.basePrice}/night`,
        rating: hotel.rating,
        imageUrl: `https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=250&fit=crop`,
        bookingLink: bookingUrl,
        amenities: hotel.amenities,
        description: hotel.description
      };
    }),
    defaultUrl: buildDefaultHotelUrl(destination, checkIn, checkOut, guests, rooms)
  };
}

function buildKeilaAffiliateUrl(searchParams: URLSearchParams) {
  const destination = searchParams.get('destination');
  const checkin = searchParams.get('checkin');
  const checkout = searchParams.get('checkout');
  const guests = searchParams.get('guests');
  const rooms = searchParams.get('rooms');

  // Your Commission Junction affiliate tracking for Expedia
  const affiliateId = "101486313";
  const advertiserId = "15575456";
  
  // Build the Expedia destination URL
  const expediaUrl = `https://www.expedia.com/Hotels-Search?destination=${encodeURIComponent(destination!)}&startDate=${checkin}&endDate=${checkout}&rooms=${rooms}&adults=${guests}`;
  
  // Wrap with CJ tracking
  return `https://www.jdoqocy.com/click-${affiliateId}-${advertiserId}?url=${encodeURIComponent(expediaUrl)}`;
}

function buildDefaultHotelUrl(destination: string, checkIn: string, checkOut: string, guests: number, rooms: number) {
  const affiliateId = "101486313";
  const advertiserId = "15575456";
  
  const expediaUrl = `https://www.expedia.com/Hotels-Search?destination=${encodeURIComponent(destination)}&startDate=${checkIn}&endDate=${checkOut}&rooms=${rooms}&adults=${guests}`;
  
  return `https://www.jdoqocy.com/click-${affiliateId}-${advertiserId}?url=${encodeURIComponent(expediaUrl)}`;
}
