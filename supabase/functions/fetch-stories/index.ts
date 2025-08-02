import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Mock data for immediate testing (replace with RSS parsing later)
    const mockStories = [
      {
        title: "10 Black-Owned Wineries To Visit In California",
        link: "https://example.com/story1",
        image: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=800",
        excerpt: "Explore California's thriving Black-owned wine scene and plan your next tasting adventure.",
        source: "TravelPulse",
        published_at: new Date().toISOString()
      },
      {
        title: "Best Girls Trips: Santorini, Bali, and Ghana",
        link: "https://example.com/story2", 
        image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800",
        excerpt: "Where to go for unforgettable girls trips with your besties — from sunsets in Santorini to safaris in Ghana.",
        source: "AFAR",
        published_at: new Date(Date.now() - 86400000).toISOString()
      },
      {
        title: "Is Tokyo Safe For Black Travelers?",
        link: "https://example.com/story3",
        image: "https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?w=800",
        excerpt: "A candid look at what it's like to explore Japan as a Black tourist.",
        source: "National Geographic Travel", 
        published_at: new Date(Date.now() - 172800000).toISOString()
      },
      {
        title: "Black-Owned Restaurants Around The World You Need To Visit",
        link: "https://example.com/story4",
        image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800",
        excerpt: "From soul food in Atlanta to fine dining in Paris, discover incredible Black-owned restaurants globally.",
        source: "Travel + Leisure",
        published_at: new Date(Date.now() - 259200000).toISOString()
      },
      {
        title: "Solo Female Travel: Safest Destinations for Black Women",
        link: "https://example.com/story5",
        image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800",
        excerpt: "Expert advice on the most welcoming destinations for Black women traveling solo.",
        source: "Conde Nast Traveler",
        published_at: new Date(Date.now() - 345600000).toISOString()
      },
      {
        title: "Wine Tours in South Africa: Supporting Black-Owned Vineyards",
        link: "https://example.com/story6",
        image: "https://images.unsplash.com/photo-1464869372688-4cd8c47c5ac3?w=800",
        excerpt: "Experience the incredible wine culture of South Africa while supporting Black-owned businesses.",
        source: "Wine Spectator",
        published_at: new Date(Date.now() - 432000000).toISOString()
      }
    ];

    console.log('Inserting mock stories into database...');

    // Insert stories into database
    let successCount = 0;
    for (const story of mockStories) {
      const { error } = await supabase
        .from("stories")
        .upsert([story], { onConflict: "link" });

      if (error) {
        console.error("DB insert error:", error.message);
      } else {
        successCount++;
      }
    }

    console.log(`Successfully processed ${mockStories.length} stories`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        inserted: mockStories.length,
        message: "Stories fetched and stored successfully" 
      }),
      {
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders
        },
      }
    );
  } catch (error) {
    console.error("Error in fetch-stories function:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        status: 500,
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders
        },
      }
    );
  }
});
