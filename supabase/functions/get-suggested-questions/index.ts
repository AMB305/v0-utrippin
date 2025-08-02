import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface QuestionSet {
  planner: string;
  compass: string;
  insider: string;
  ultimate: string;
}

const locationQuestions: Record<string, QuestionSet> = {
  "U.S. Virgin Islands": {
    planner: "Plan a 3-day adventure in St. Thomas for me.",
    compass: "Find some Black-owned restaurants and businesses in St. Croix.",
    insider: "Where can I find the best local seafood for dinner tonight?",
    ultimate: "What are some fun, free things to do in the USVI this week?"
  },
  "Miami": {
    planner: "Plan a 3-day itinerary for a first-timer in Miami.",
    compass: "Show me the best spots to experience Afro-Caribbean culture in Miami.",
    insider: "Where can I find the best nightlife beyond the big South Beach clubs?",
    ultimate: "What are the best free things to do in Miami Beach?"
  },
  "New York": {
    planner: "Plan a weekend in NYC for a first-timer.",
    compass: "Show me cultural neighborhoods beyond Manhattan.",
    insider: "Where can I find authentic local food away from tourist spots?",
    ultimate: "What are the best free activities in New York City?"
  },
  "Los Angeles": {
    planner: "Plan a 3-day LA itinerary beyond Hollywood.",
    compass: "Show me diverse neighborhoods and cultural experiences in LA.",
    insider: "Where can I find the best hidden beaches and local spots?",
    ultimate: "What are fun, free things to do in Los Angeles?"
  }
};

const defaultQuestions: QuestionSet = {
  planner: "Plan a weekend getaway for me.",
  compass: "What are some good destinations for solo travelers?",
  insider: "How do I find culturally rich experiences on a trip?",
  ultimate: "Show me how to travel the world on a budget."
};

async function getLocationFromIP(clientIP: string): Promise<string | null> {
  try {
    const response = await fetch(`http://ip-api.com/json/${clientIP}`);
    const data = await response.json();
    
    if (data.status === 'success') {
      // Return city or region based on what's available
      if (data.city && data.region) {
        return `${data.city}, ${data.region}`;
      } else if (data.regionName) {
        return data.regionName;
      } else if (data.country) {
        return data.country;
      }
    }
    return null;
  } catch (error) {
    console.error('IP geolocation failed:', error);
    return null;
  }
}

function findBestLocationMatch(location: string): QuestionSet {
  const normalizedLocation = location.toLowerCase();
  
  // Direct matches
  for (const [key, questions] of Object.entries(locationQuestions)) {
    if (normalizedLocation.includes(key.toLowerCase())) {
      return questions;
    }
  }
  
  // Partial matches
  if (normalizedLocation.includes('virgin islands') || normalizedLocation.includes('usvi')) {
    return locationQuestions["U.S. Virgin Islands"];
  }
  if (normalizedLocation.includes('miami') || normalizedLocation.includes('florida')) {
    return locationQuestions["Miami"];
  }
  if (normalizedLocation.includes('new york') || normalizedLocation.includes('nyc')) {
    return locationQuestions["New York"];
  }
  if (normalizedLocation.includes('los angeles') || normalizedLocation.includes('california')) {
    return locationQuestions["Los Angeles"];
  }
  
  return defaultQuestions;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const location = url.searchParams.get('location');
    
    let questions: QuestionSet;
    
    if (location) {
      console.log(`Received location: ${location}`);
      questions = findBestLocationMatch(location);
    } else {
      // Try to get location from IP if not provided
      const clientIP = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
      console.log(`No location provided, trying IP geolocation for: ${clientIP}`);
      
      const ipLocation = await getLocationFromIP(clientIP);
      if (ipLocation) {
        console.log(`IP location detected: ${ipLocation}`);
        questions = findBestLocationMatch(ipLocation);
      } else {
        console.log('Using default questions');
        questions = defaultQuestions;
      }
    }

    return new Response(JSON.stringify(questions), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in get-suggested-questions function:', error);
    return new Response(JSON.stringify(defaultQuestions), {
      status: 200, // Return 200 with default questions instead of error
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
