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

    // Get user data and affiliate IDs
    let userAffiliateIds = null;
    let userRole = 'user';
    
    if (userId) {
      const { data: userData } = await supabase
        .from('users')
        .select(`
          booking_affiliate_id,
          expedia_affiliate_id,
          hotels_affiliate_id,
          kayak_affiliate_id,
          priceline_affiliate_id
        `)
        .eq('id', userId)
        .single();
      
      if (userData) {
        userAffiliateIds = userData;
        
        // Check if user has agent role
        const { data: roles } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', userId);
        
        userRole = roles?.some(r => r.role === 'agent') ? 'agent' : 'user';
      }
    }

    // Generate hotel options with affiliate URLs
    const hotelModule = await generateHotelOptions({
      destination,
      checkIn,
      checkOut,
      guests,
      rooms,
      userAffiliateIds,
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
  userAffiliateIds,
  userRole
}: {
  destination: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  rooms: number;
  userAffiliateIds: any;
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

      const bookingUrls = buildAffiliateUrls(searchParams, userAffiliateIds, userRole);

      return {
        name: hotel.name,
        price: `$${hotel.basePrice}/night`,
        rating: hotel.rating,
        imageUrl: `https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=250&fit=crop`,
        bookingLink: bookingUrls.primary,
        agentUrl: userRole === 'agent' && bookingUrls.agent ? bookingUrls.agent : undefined,
        amenities: hotel.amenities,
        description: hotel.description
      };
    }),
    defaultUrl: buildDefaultHotelUrl(destination, checkIn, checkOut, guests, rooms)
  };
}

function buildAffiliateUrls(searchParams: URLSearchParams, userAffiliateIds: any, userRole: string) {
  const destination = searchParams.get('destination');
  const checkin = searchParams.get('checkin');
  const checkout = searchParams.get('checkout');
  const guests = searchParams.get('guests');
  const rooms = searchParams.get('rooms');

  // Default URLs for regular users
  const defaultUrls = {
    booking: `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(destination!)}&checkin=${checkin}&checkout=${checkout}&group_adults=${guests}&no_rooms=${rooms}`,
    expedia: `https://www.expedia.com/Hotels-Search?destination=${encodeURIComponent(destination!)}&startDate=${checkin}&endDate=${checkout}&rooms=${rooms}&adults=${guests}`,
    hotels: `https://www.hotels.com/search.do?destination=${encodeURIComponent(destination!)}&startDate=${checkin}&endDate=${checkout}&rooms=${rooms}&adults=${guests}`
  };

  // If user is an agent and has affiliate IDs, use them
  if (userRole === 'agent' && userAffiliateIds) {
    const agentUrls: any = {};
    
    if (userAffiliateIds.booking_affiliate_id) {
      agentUrls.booking = `${defaultUrls.booking}&aid=${userAffiliateIds.booking_affiliate_id}`;
    }
    
    if (userAffiliateIds.expedia_affiliate_id) {
      agentUrls.expedia = `${defaultUrls.expedia}&affid=${userAffiliateIds.expedia_affiliate_id}`;
    }
    
    if (userAffiliateIds.hotels_affiliate_id) {
      agentUrls.hotels = `${defaultUrls.hotels}&affiliate=${userAffiliateIds.hotels_affiliate_id}`;
    }

    return {
      primary: agentUrls.booking || agentUrls.expedia || agentUrls.hotels || defaultUrls.booking,
      agent: agentUrls.booking || agentUrls.expedia || agentUrls.hotels
    };
  }

  return {
    primary: defaultUrls.booking,
    agent: null
  };
}

function buildDefaultHotelUrl(destination: string, checkIn: string, checkOut: string, guests: number, rooms: number) {
  return `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(destination)}&checkin=${checkIn}&checkout=${checkOut}&group_adults=${guests}&no_rooms=${rooms}`;
}