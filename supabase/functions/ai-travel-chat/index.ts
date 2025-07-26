// COPY AND REPLACE THE ENTIRE 'serve' FUNCTION WITH THIS

import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.3';

const openRouterApiKey = Deno.env.get('OPENROUTER_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

// This is our single, authoritative validation function.
function validateDetailedItinerary(itinerary) {
  if (!itinerary || typeof itinerary !== 'object') {
    console.log('Validation FAIL: Itinerary data is not an object.');
    return false;
  }

  const { summary, days, culture_tips, actionable_suggestions } = itinerary;

  // 1. Validate Summary: Must be a meaningful string, not a question or error.
  const summaryLower = (summary || "").toLowerCase();
  const errorPhrases = ["i'm having trouble", "could you tell me", "i'd love to help"];
  if (!summary || summary.trim().length < 30 || errorPhrases.some(phrase => summaryLower.includes(phrase))) {
    console.log('Validation FAIL: Summary is invalid.');
    return false;
  }

  // 2. Validate Days: Must be a non-empty array of days with real activities.
  if (!Array.isArray(days) || days.length === 0) {
    console.log('Validation FAIL: Days array is missing or empty.');
    return false;
  }
  const hasMeaningfulActivities = days.every(day =>
    Array.isArray(day.activities) && day.activities.some(activity => typeof activity === 'string' && activity.trim().length > 5)
  );
  if (!hasMeaningfulActivities) {
    console.log('Validation FAIL: A day is missing meaningful activities.');
    return false;
  }

  // 3. Validate Tips/Suggestions: Must have at least one of these arrays with content.
  const hasCultureTips = culture_tips && typeof culture_tips === 'object' && Object.keys(culture_tips).length > 0;
  const hasSuggestions = Array.isArray(actionable_suggestions) && actionable_suggestions.some(s => typeof s === 'string' && s.trim().length > 10);
  if (!hasCultureTips && !hasSuggestions) {
    console.log('Validation FAIL: Missing both culture_tips and actionable_suggestions.');
    return false;
  }
  
  console.log('Validation PASS: Itinerary is valid.');
  return true;
}


serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestBody = await req.json();
    const { message } = requestBody;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // NOTE: System prompt simplified for clarity. Your original prompt was very complex.
    // This maintains the core requirement: return valid JSON only.
    const systemPrompt = `You are Keila, an AI travel assistant. You MUST respond with VALID JSON ONLY. No text before or after the JSON object. Based on the user's request, provide a detailed trip itinerary using the specified JSON schema. If the user's request is too vague or is a simple greeting, respond with a simple text message asking for more details.`;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openRouterApiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://utrippin.ai', // Or your actual site
        'X-Title': 'Utrippin AI'
      },
      body: JSON.stringify({
        model: 'nousresearch/nous-hermes-2-mixtral-8x7b-dpo',
        messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: message }],
        response_format: { type: "json_object" }, // Crucial for forcing JSON output
        temperature: 0.7,
        max_tokens: 4000
      })
    });

    if (!response.ok) {
        throw new Error(`OpenRouter API error: ${response.statusText}`);
    }

    const aiData = await response.json();
    const aiContent = aiData.choices[0].message.content;
    let parsedResponse;

    try {
        parsedResponse = JSON.parse(aiContent);
    } catch (e) {
        console.error("Fatal Error: AI returned invalid JSON.", aiContent);
        // If the AI fails to return JSON, create a clean error response.
        return new Response(JSON.stringify({
          response: "I'm having a bit of trouble generating a full itinerary right now. Could you please try rephrasing your request?",
          isDetailedItinerary: false,
          quickReplies: ["Plan a 3-day trip to Miami", "Find a romantic getaway"]
        }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    
    // --- The Single Point of Truth ---
    // Immediately validate the detailedItinerary object after parsing.
    const itineraryData = parsedResponse.detailedItinerary;
    if (validateDetailedItinerary(itineraryData)) {
      
      // If VALID, structure and return the full itinerary.
      console.log("Decision: Returning DETAILED itinerary.");
      return new Response(JSON.stringify({
        ...parsedResponse, // Pass through the full valid response from the AI
        isDetailedItinerary: true,
      }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

    } else {

      // If INVALID, return a clean, simple fallback.
      console.log("Decision: Returning SIMPLE fallback response.");
      return new Response(JSON.stringify({
        response: parsedResponse.response || "I can help with that! To get started, could you tell me a bit more about the trip you have in mind?",
        isDetailedItinerary: false,
        quickReplies: [
            "Plan a weekend getaway",
            "I need a family-friendly vacation",
            "Show me budget travel options"
        ]
      }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

  } catch (error) {
    console.error('AI Travel Chat - Unhandled error in main function:', error);
    return new Response(JSON.stringify({ error: "I'm having trouble processing your request right now. Please try again." }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});