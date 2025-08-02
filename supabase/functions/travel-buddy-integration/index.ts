import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    const { action, data } = await req.json()

    switch (action) {
      case 'join_event':
        return await handleJoinEvent(supabase, data)
      case 'create_trip_alert':
        return await handleCreateTripAlert(supabase, data)
      case 'get_event_attendees':
        return await handleGetEventAttendees(supabase, data)
      case 'share_trip':
        return await handleShareTrip(supabase, data)
      case 'follow_user':
        return await handleFollowUser(supabase, data)
      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
  } catch (error) {
    console.error('Error in travel-buddy-integration:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

async function handleJoinEvent(supabase: any, data: any) {
  const { userId, eventId, lookingForBuddies = false } = data

  // Add user to event attendees
  const { error: insertError } = await supabase
    .from('event_attendees')
    .insert({
      user_id: userId,
      event_id: eventId,
      looking_for_buddies: lookingForBuddies,
      joined_at: new Date().toISOString()
    })

  if (insertError) throw insertError

  // If looking for buddies, notify other attendees
  if (lookingForBuddies) {
    // Get other attendees who are also looking for buddies
    const { data: otherAttendees } = await supabase
      .from('event_attendees')
      .select('user_id')
      .eq('event_id', eventId)
      .eq('looking_for_buddies', true)
      .neq('user_id', userId)

    // Create notifications for potential buddy matches
    if (otherAttendees && otherAttendees.length > 0) {
      const notifications = otherAttendees.map(attendee => ({
        user_id: attendee.user_id,
        sender_id: userId,
        type: 'event_buddy_match',
        content: `Someone new is looking for travel buddies for this event!`,
        event_id: eventId
      }))

      await supabase
        .from('travel_buddy_notifications')
        .insert(notifications)
    }
  }

  return new Response(
    JSON.stringify({ success: true, message: 'Successfully joined event' }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function handleCreateTripAlert(supabase: any, data: any) {
  const { userId, tripData, lookingForBuddies } = data

  // Create trip record
  const { data: trip, error: tripError } = await supabase
    .from('trips')
    .insert({
      user_id: userId,
      ...tripData,
      looking_for_buddies: lookingForBuddies,
      public: true,
      status: 'planning'
    })
    .select()
    .single()

  if (tripError) throw tripError

  // If looking for buddies, find potential matches
  if (lookingForBuddies) {
    const { data: potentialBuddies } = await supabase.rpc('find_travel_buddies', {
      user_trip_id: trip.id
    })

    // Send notifications to potential matches
    if (potentialBuddies && potentialBuddies.length > 0) {
      const notifications = potentialBuddies.slice(0, 10).map(buddy => ({
        user_id: buddy.buddy_user_id,
        sender_id: userId,
        type: 'trip_buddy_request',
        content: `Someone is planning a trip to ${tripData.destination} and looking for travel companions!`,
        trip_id: trip.id
      }))

      await supabase
        .from('travel_buddy_notifications')
        .insert(notifications)
    }
  }

  return new Response(
    JSON.stringify({ success: true, trip, potential_matches: potentialBuddies?.length || 0 }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function handleGetEventAttendees(supabase: any, data: any) {
  const { eventId } = data

  const { data: attendees, error } = await supabase
    .from('event_attendees')
    .select(`
      user_id,
      looking_for_buddies,
      joined_at,
      users (
        id,
        email,
        profile_photo_url,
        location,
        age,
        bio,
        interests,
        travel_style
      )
    `)
    .eq('event_id', eventId)
    .order('joined_at', { ascending: false })

  if (error) throw error

  return new Response(
    JSON.stringify({ attendees: attendees || [] }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function handleShareTrip(supabase: any, data: any) {
  const { tripId, platform, userId } = data

  // Log the share event
  await supabase
    .from('trip_shares')
    .insert({
      trip_id: tripId,
      user_id: userId,
      platform,
      shared_at: new Date().toISOString()
    })

  // Get trip details for sharing
  const { data: trip } = await supabase
    .from('trips')
    .select('*')
    .eq('id', tripId)
    .single()

  // Generate share URLs based on platform
  let shareUrl = `https://utrippin.ai/trip/${tripId}`
  let shareText = `Check out this amazing trip to ${trip?.destination}! 🌍✈️`

  const shareUrls = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`
  }

  return new Response(
    JSON.stringify({ success: true, shareUrl: shareUrls[platform] || shareUrl }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function handleFollowUser(supabase: any, data: any) {
  const { followerId, followingId } = data

  // Check if already following
  const { data: existing } = await supabase
    .from('user_follows')
    .select('id')
    .eq('follower_id', followerId)
    .eq('following_id', followingId)
    .single()

  if (existing) {
    // Unfollow
    await supabase
      .from('user_follows')
      .delete()
      .eq('follower_id', followerId)
      .eq('following_id', followingId)

    return new Response(
      JSON.stringify({ success: true, action: 'unfollowed' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } else {
    // Follow
    await supabase
      .from('user_follows')
      .insert({
        follower_id: followerId,
        following_id: followingId,
        created_at: new Date().toISOString()
      })

    // Create notification
    await supabase
      .from('travel_buddy_notifications')
      .insert({
        user_id: followingId,
        sender_id: followerId,
        type: 'new_follower',
        content: 'started following you!'
      })

    return new Response(
      JSON.stringify({ success: true, action: 'followed' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
}
