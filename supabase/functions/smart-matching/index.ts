import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface MatchingRequest {
  userId: string
  filters?: {
    destination?: string
    maxAgeDiff?: number
    minScore?: number
    limit?: number
  }
}

interface MatchingResponse {
  matches: any[]
  totalCount: number
  averageScore: number
  filters: any
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    console.log('Smart matching request received')

    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { userId, filters = {} }: MatchingRequest = await req.json()

    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'User ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log(`Finding enhanced matches for user: ${userId}`, filters)

    // Use the enhanced matching function
    const { data: matches, error } = await supabase.rpc('find_enhanced_travel_buddies', {
      user_id: userId,
      destination_filter: filters.destination || null,
      max_age_diff: filters.maxAgeDiff || 15,
      min_score: filters.minScore || 0.3,
      limit_count: filters.limit || 20
    })

    if (error) {
      console.error('Error finding matches:', error)
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Calculate statistics
    const totalCount = matches?.length || 0
    const averageScore = totalCount > 0 
      ? matches.reduce((sum: number, match: any) => sum + parseFloat(match.match_score), 0) / totalCount
      : 0

    // Enrich matches with additional insights
    const enrichedMatches = matches?.map((match: any) => {
      const scoreBreakdown = match.score_breakdown || {}
      const compatibilityFactors = []

      // Analyze compatibility factors
      if (scoreBreakdown.destinations > 0) {
        compatibilityFactors.push({
          type: 'destinations',
          score: scoreBreakdown.destinations,
          description: `${match.common_destinations?.length || 0} shared destinations`
        })
      }
      
      if (scoreBreakdown.interests > 0) {
        compatibilityFactors.push({
          type: 'interests',
          score: scoreBreakdown.interests,
          description: `${match.common_interests?.length || 0} shared interests`
        })
      }
      
      if (scoreBreakdown.languages > 0) {
        compatibilityFactors.push({
          type: 'languages',
          score: scoreBreakdown.languages,
          description: 'Shared languages'
        })
      }
      
      if (scoreBreakdown.age > 0) {
        compatibilityFactors.push({
          type: 'age',
          score: scoreBreakdown.age,
          description: 'Similar age'
        })
      }
      
      if (scoreBreakdown.travel_style > 0) {
        compatibilityFactors.push({
          type: 'travel_style',
          score: scoreBreakdown.travel_style,
          description: 'Matching travel style'
        })
      }
      
      if (scoreBreakdown.budget > 0) {
        compatibilityFactors.push({
          type: 'budget',
          score: scoreBreakdown.budget,
          description: 'Compatible budget ranges'
        })
      }
      
      if (scoreBreakdown.location > 0) {
        compatibilityFactors.push({
          type: 'location',
          score: scoreBreakdown.location,
          description: 'Location proximity'
        })
      }

      // Determine match quality
      let matchQuality = 'Low'
      if (match.match_score >= 0.8) matchQuality = 'Excellent'
      else if (match.match_score >= 0.6) matchQuality = 'Good'
      else if (match.match_score >= 0.4) matchQuality = 'Fair'

      return {
        ...match,
        matchQuality,
        compatibilityFactors: compatibilityFactors.sort((a, b) => b.score - a.score),
        matchPercentage: Math.round(match.match_score * 100),
        topCommonInterests: match.common_interests?.slice(0, 3) || [],
        topCommonDestinations: match.common_destinations?.slice(0, 3) || []
      }
    }) || []

    const response: MatchingResponse = {
      matches: enrichedMatches,
      totalCount,
      averageScore: Math.round(averageScore * 100) / 100,
      filters: {
        applied: filters,
        resultsCount: totalCount,
        scoreRange: totalCount > 0 ? {
          min: Math.min(...enrichedMatches.map(m => m.match_score)),
          max: Math.max(...enrichedMatches.map(m => m.match_score))
        } : null
      }
    }

    console.log(`Found ${totalCount} enhanced matches with average score: ${averageScore}`)

    return new Response(
      JSON.stringify(response),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Smart matching error:', error)
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})