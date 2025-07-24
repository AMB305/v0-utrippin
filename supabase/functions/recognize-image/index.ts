import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

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
    console.log('Starting image recognition process...');
    
    const formData = await req.formData();
    const imageFile = formData.get('image') as File;
    
    if (!imageFile) {
      console.error('No image file provided');
      return new Response(
        JSON.stringify({ error: 'No image file provided' }), 
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('Image file received:', imageFile.name, imageFile.size, 'bytes');

    // Convert image to base64 for Google Cloud Vision API
    const imageBuffer = await imageFile.arrayBuffer();
    const base64Image = btoa(String.fromCharCode(...new Uint8Array(imageBuffer)));

    console.log('Image converted to base64, calling Google Cloud Vision API...');

    // Call Google Cloud Vision API for landmark detection
    const visionApiKey = Deno.env.get('GOOGLE_CLOUD_VISION_API_KEY');
    if (!visionApiKey) {
      console.error('Google Cloud Vision API key not found');
      return new Response(
        JSON.stringify({ error: 'Google Cloud Vision API key not configured' }), 
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const visionResponse = await fetch(
      `https://vision.googleapis.com/v1/images:annotate?key=${visionApiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requests: [
            {
              image: {
                content: base64Image
              },
              features: [
                {
                  type: 'LANDMARK_DETECTION',
                  maxResults: 5
                },
                {
                  type: 'TEXT_DETECTION',
                  maxResults: 5
                }
              ]
            }
          ]
        })
      }
    );

    const visionData = await visionResponse.json();
    console.log('Vision API response:', JSON.stringify(visionData, null, 2));

    let landmarkName = '';
    let identifiedText = '';

    // Extract landmark information
    if (visionData.responses?.[0]?.landmarkAnnotations?.length > 0) {
      landmarkName = visionData.responses[0].landmarkAnnotations[0].description;
      console.log('Landmark identified:', landmarkName);
    }

    // Extract text information as fallback
    if (visionData.responses?.[0]?.textAnnotations?.length > 0) {
      identifiedText = visionData.responses[0].textAnnotations[0].description;
      console.log('Text identified:', identifiedText);
    }

    // If no landmark found, use general image description
    if (!landmarkName && !identifiedText) {
      console.log('No landmark or text detected, using general description');
      landmarkName = 'an interesting location or structure';
    }

    // Call OpenRouter with specialized Live Guide prompt
    const openRouterApiKey = Deno.env.get('OPENROUTER_API_KEY');
    if (!openRouterApiKey) {
      console.error('OpenRouter API key not found');
      return new Response(
        JSON.stringify({ error: 'OpenRouter API key not configured' }), 
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const liveGuidePrompt = `You are Keila, an expert local tour guide for Utrippin.ai, "The Melanin Compass". You are providing a "Live Guide" experience. Your tone is engaging, knowledgeable, and full of fascinating details.

The user has just sent you a photo, and our system has identified the landmark in the photo. Your task is to take the landmark name provided in the user's prompt and create a rich, conversational response.

Your response must:

• Start by confidently identifying the landmark.
• Provide a brief (3-4 sentences) and fascinating history or cultural significance of the location. Prioritize stories or facts that would be of interest to the Melanin traveler where appropriate.
• Suggest one other interesting thing (a cafe, another landmark, a shop) that the user can see or do within a 5-minute walk from their current location.
• Keep the entire response concise and easy to read on a mobile screen.`;

    const userMessage = landmarkName 
      ? `I'm looking at a landmark identified as '${landmarkName}'. Tell me about it.`
      : identifiedText 
        ? `I'm looking at something with text that says '${identifiedText}'. Tell me about this location.`
        : "I'm looking at an interesting location or structure. Tell me about it and what I might find nearby.";

    console.log('Calling OpenRouter with message:', userMessage);

    const openRouterResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openRouterApiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://utrippin.ai',
        'X-Title': 'Utrippin AI Travel Assistant'
      },
      body: JSON.stringify({
        model: 'nousresearch/nous-hermes-2-mixtral-8x7b-dpo',
        messages: [
          {
            role: 'system',
            content: liveGuidePrompt
          },
          {
            role: 'user',
            content: userMessage
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    });

    const openRouterData = await openRouterResponse.json();
    console.log('OpenRouter response received');

    if (!openRouterData.choices?.[0]?.message?.content) {
      console.error('Invalid OpenRouter response:', openRouterData);
      return new Response(
        JSON.stringify({ error: 'Failed to generate AI response' }), 
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const aiResponse = openRouterData.choices[0].message.content;
    console.log('AI response generated successfully');

    return new Response(
      JSON.stringify({ 
        success: true,
        response: aiResponse,
        landmark: landmarkName || 'Unknown location',
        detectedText: identifiedText
      }), 
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in recognize-image function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'An unexpected error occurred', 
        details: error.message 
      }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});