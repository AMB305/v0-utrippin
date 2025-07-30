import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// COST OPTIMIZATION STRATEGY 2: Cache for common queries to avoid API calls
const commonResponses = {
  "what is utrippin.ai": "Utrippin.ai is an AI-powered travel planning platform that helps you discover destinations, plan itineraries, and connect with travel buddies. I'm Keila, your personal travel assistant!",
  "what is utrippin": "Utrippin.ai is an AI-powered travel planning platform that helps you discover destinations, plan itineraries, and connect with travel buddies. I'm Keila, your personal travel assistant!",
  "who are you": "I'm Keila, your AI travel assistant! I help you plan amazing trips, find destinations, and create personalized itineraries.",
  "hello": "Hi there! I'm Keila, your AI travel assistant. How can I help you plan your next adventure?",
  "hi": "Hi! I'm Keila, ready to help you plan an amazing trip. Where would you like to go?",
  "hey": "Hey! I'm Keila, your travel planning assistant. What adventure are we planning today?",
  "help": "I can help you plan trips, find destinations, create itineraries, and answer travel questions. What would you like to explore?",
  "what can you do": "I can help you plan trips, find destinations, create custom itineraries, suggest activities, and provide travel advice. Where would you like to go?"
};

// Function to check if query matches a cached response
function getCachedResponse(query: string): string | null {
  const normalizedQuery = query.toLowerCase().trim().replace(/[.,!?]/g, '');
  return commonResponses[normalizedQuery] || null;
}

// COST OPTIMIZATION STRATEGY 1: Limit chat history to last N turns
function limitChatHistory(chatHistory: any[], maxTurns: number = 5): any[] {
  if (!chatHistory || chatHistory.length <= maxTurns) {
    return chatHistory || [];
  }
  
  // Take only the last N turns to reduce input tokens significantly
  return chatHistory.slice(-maxTurns);
}

// COST OPTIMIZATION STRATEGY 3: Create concise, optimized prompts
function createOptimizedPrompt(currentPrompt: string): string {
  // Add conciseness instructions to reduce output tokens
  const conciseInstructions = `You are Keila, a helpful travel assistant. Be concise and practical.

RESPONSE GUIDELINES:
- Keep responses under 100 words unless detailed itinerary requested
- Use bullet points for efficiency
- Be direct and actionable
- Focus only on essential travel information

USER REQUEST: ${currentPrompt}

Provide a helpful, concise response.`;

  return conciseInstructions;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const { chatHistory, currentPrompt } = await req.json();
    
    console.log('=== COST OPTIMIZATION METRICS ===');
    console.log('Original chat history length:', chatHistory?.length || 0);
    console.log('Current prompt:', currentPrompt?.substring(0, 50) + '...');

    // STRATEGY 2: Check for cached common responses first (saves API calls)
    const cachedResponse = getCachedResponse(currentPrompt);
    if (cachedResponse) {
      console.log('✅ COST SAVED: Serving cached common response - API call avoided');
      return new Response(
        JSON.stringify({ 
          text: cachedResponse,
          costOptimized: true,
          source: 'common_cache'
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );
    
    // Check database cache
    const cacheKey = currentPrompt.toLowerCase().trim();
    console.log('Checking database cache for prompt...');
    const { data: cachedData } = await supabase
      .from('cached_itineraries')
      .select('response')
      .eq('prompt', cacheKey)
      .maybeSingle();
    
    if (cachedData) {
      console.log('✅ COST SAVED: Found cached database response - API call avoided');
      return new Response(JSON.stringify({ 
        text: cachedData.response,
        costOptimized: true,
        source: 'database_cache'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get Gemini API key
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    if (!geminiApiKey) {
      console.error('Gemini API Key is not configured');
      return new Response(JSON.stringify({ error: 'Gemini API Key is not configured on the server.' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // STRATEGY 1: Limit chat history to reduce input tokens
    const limitedHistory = limitChatHistory(chatHistory, 5);
    const tokensSaved = (chatHistory?.length || 0) - limitedHistory.length;
    console.log('✅ TOKENS OPTIMIZED: Limited chat history to', limitedHistory.length, 'messages');
    console.log('✅ COST SAVED: Reduced input by', tokensSaved, 'messages (~', tokensSaved * 50, 'tokens estimated)');

    // STRATEGY 3: Use optimized, concise prompt
    const optimizedPrompt = createOptimizedPrompt(currentPrompt);
    console.log('✅ PROMPT OPTIMIZED: Added conciseness instructions to reduce output tokens');

    // Format chat history for Gemini API
    const contents = [];
    
    // Add limited chat history
    if (limitedHistory && Array.isArray(limitedHistory)) {
      for (const message of limitedHistory) {
        contents.push({
          role: message.role === 'bot' ? 'model' : 'user',
          parts: [{ text: message.text }]
        });
      }
    }

    // Add optimized current prompt
    contents.push({
      role: 'user',
      parts: [{ text: optimizedPrompt }]
    });

    console.log('Final API call - Total messages:', contents.length);

    // Call Gemini API with cost-optimized settings
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: contents,
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.8,
          maxOutputTokens: 400, // REDUCED from 2048 to 400 for cost savings
          stopSequences: [],
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Gemini API error:', response.status, errorData);
      return new Response(JSON.stringify({ 
        error: `Gemini API error: ${response.status} - ${errorData}` 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!responseText) {
      console.error('No response text from Gemini:', data);
      return new Response(JSON.stringify({ 
        error: 'No response text generated by Gemini' 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('✅ API call completed - Response length:', responseText.length, 'characters');
    console.log('✅ OUTPUT TOKENS OPTIMIZED: Limited to ~400 tokens max');
    console.log('=== END COST OPTIMIZATION METRICS ===');

    // Cache the response for future use
    try {
      await supabase
        .from('cached_itineraries')
        .insert({
          prompt: cacheKey,
          response: responseText
        });
      console.log('Response cached for future cost savings');
    } catch (cacheError) {
      console.error('Failed to cache response:', cacheError);
    }

    return new Response(JSON.stringify({ 
      text: responseText,
      costOptimized: true,
      optimizations: {
        historyLimited: tokensSaved > 0,
        promptOptimized: true,
        outputLimited: true
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in gemini-chat function:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Internal server error during LLM call' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});