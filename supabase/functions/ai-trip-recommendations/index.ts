import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const openaiApiKey = Deno.env.get('OPENAI_API_KEY')!

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    const { user_id, recommendation_type = 'destination', force_refresh = false } = await req.json()
    
    console.log(`Generating AI recommendations for user: ${user_id}, type: ${recommendation_type}`)
    
    if (!user_id) {
      throw new Error('User ID is required')
    }

    // Check for existing fresh recommendations (unless force refresh)
    if (!force_refresh) {
      const { data: existingRecs } = await supabase
        .from('user_recommendations')
        .select('*')
        .eq('user_id', user_id)
        .eq('recommendation_type', recommendation_type)
        .eq('is_active', true)
        .gt('expires_at', new Date().toISOString())
        .order('generated_at', { ascending: false })
        .limit(5)
      
      if (existingRecs && existingRecs.length > 0) {
        console.log(`Found ${existingRecs.length} fresh recommendations, returning cached results`)
        return new Response(
          JSON.stringify({ 
            success: true, 
            recommendations: existingRecs,
            source: 'cache',
            generated_at: existingRecs[0].generated_at
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    }

    // Get user behavior patterns
    const { data: behaviorPatterns } = await supabase.rpc('get_user_behavior_patterns', {
      p_user_id: user_id,
      p_days_back: 30
    })

    console.log('User behavior patterns:', behaviorPatterns)

    // Get user profile and preferences for context
    const { data: userProfile } = await supabase
      .from('users')
      .select('*, travel_preferences(*)')
      .eq('id', user_id)
      .single()

    // Generate AI-powered recommendations based on behavior and preferences
    const aiPrompt = buildRecommendationPrompt(
      recommendation_type,
      behaviorPatterns?.[0] || {},
      userProfile
    )

    console.log('Sending prompt to OpenAI:', aiPrompt.substring(0, 200) + '...')

    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an expert travel AI that generates personalized travel recommendations. Always respond with valid JSON only.'
          },
          {
            role: 'user',
            content: aiPrompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      }),
    })

    if (!openaiResponse.ok) {
      throw new Error(`OpenAI API error: ${openaiResponse.status}`)
    }

    const aiResult = await openaiResponse.json()
    const aiContent = aiResult.choices[0].message.content

    console.log('Raw AI response:', aiContent)

    // Parse AI response
    let recommendations
    try {
      const parsedContent = JSON.parse(aiContent)
      recommendations = parsedContent.recommendations || parsedContent
    } catch (error) {
      console.error('Failed to parse AI response:', error)
      // Fallback to creating structured recommendations
      recommendations = createFallbackRecommendations(recommendation_type, behaviorPatterns?.[0])
    }

    // Store recommendations in database
    const storedRecommendations = []
    
    for (let i = 0; i < Math.min(recommendations.length, 5); i++) {
      const rec = recommendations[i]
      const confidence = calculateConfidenceScore(rec, behaviorPatterns?.[0] || {})
      
      const { data: storedRec, error: storeError } = await supabase
        .from('user_recommendations')
        .insert({
          user_id,
          recommendation_type,
          recommendation_data: rec,
          confidence_score: confidence,
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
        })
        .select()
        .single()

      if (storeError) {
        console.error('Error storing recommendation:', storeError)
      } else {
        storedRecommendations.push(storedRec)
      }
    }

    // Track API usage
    await supabase.rpc('track_api_call', {
      p_provider: 'openai',
      p_endpoint: 'chat/completions',
      p_usage_count: 1,
      p_metadata: { 
        model: 'gpt-4o-mini',
        recommendation_type,
        user_id
      }
    })

    console.log(`Generated ${storedRecommendations.length} new recommendations`)

    return new Response(
      JSON.stringify({ 
        success: true, 
        recommendations: storedRecommendations,
        source: 'ai_generated',
        generated_at: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in ai-trip-recommendations:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})

function buildRecommendationPrompt(type: string, behaviorData: any, userProfile: any) {
  const basePrompt = `Generate ${type} recommendations for a travel user based on their behavior and preferences.

User Behavior Analysis:
- Search patterns: ${JSON.stringify(behaviorData.search_patterns || [])}
- Destination interests: ${JSON.stringify(behaviorData.destination_interests || [])}
- Activity preferences: ${JSON.stringify(behaviorData.activity_preferences || [])}

User Profile:
- Travel style: ${userProfile?.travel_style || 'not specified'}
- Interests: ${JSON.stringify(userProfile?.interests || [])}
- Location: ${userProfile?.location || 'not specified'}
- Budget preferences: ${JSON.stringify(behaviorData.budget_range || {})}

Generate 5 personalized ${type} recommendations. Each recommendation should include:
- title: Short descriptive title
- description: Detailed explanation (2-3 sentences)
- reasoning: Why this matches their behavior/preferences
- confidence: 0.0-1.0 score of how well it matches
- metadata: Relevant details (price range, duration, location, etc.)

Respond with valid JSON in this format:
{
  "recommendations": [
    {
      "title": "Recommendation Title",
      "description": "Detailed description...",
      "reasoning": "Why this matches...",
      "confidence": 0.85,
      "metadata": {
        "location": "Location Name",
        "price_range": "$$",
        "duration": "7 days",
        "best_time": "Spring",
        "activities": ["hiking", "culture"]
      }
    }
  ]
}`

  return basePrompt
}

function createFallbackRecommendations(type: string, behaviorData: any) {
  const fallbacks = {
    destination: [
      {
        title: "Explore Southeast Asia",
        description: "Discover the vibrant cultures and stunning landscapes of Thailand, Vietnam, and Cambodia. Perfect for adventure seekers.",
        reasoning: "Popular destination for diverse experiences",
        confidence: 0.6,
        metadata: {
          location: "Southeast Asia",
          price_range: "$$",
          duration: "14 days",
          best_time: "November-March",
          activities: ["culture", "food", "adventure"]
        }
      }
    ],
    activity: [
      {
        title: "Food Tourism Experience",
        description: "Immerse yourself in local culinary traditions with cooking classes and food tours.",
        reasoning: "Universally appealing travel activity",
        confidence: 0.5,
        metadata: {
          category: "Cultural",
          duration: "Half day",
          difficulty: "Easy",
          group_size: "Small"
        }
      }
    ]
  }

  return fallbacks[type] || fallbacks.destination
}

function calculateConfidenceScore(recommendation: any, behaviorData: any): number {
  let score = 0.5 // Base score
  
  // Boost score based on behavior matching
  if (behaviorData.search_patterns?.length > 0) {
    score += 0.2
  }
  
  if (behaviorData.destination_interests?.length > 0) {
    score += 0.2
  }
  
  // Use AI confidence if provided
  if (recommendation.confidence) {
    score = Math.max(score, recommendation.confidence)
  }
  
  return Math.min(score, 1.0)
}
