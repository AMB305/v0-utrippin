-- Enhanced matching algorithm with more sophisticated scoring
CREATE OR REPLACE FUNCTION public.calculate_advanced_match_score(user1_id uuid, user2_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
AS $$
DECLARE
  score DECIMAL(3,2) := 0.0;
  score_breakdown jsonb := '{}';
  common_destinations INT := 0;
  common_interests INT := 0;
  common_languages INT := 0;
  age_diff INT := 0;
  location_score DECIMAL(2,1) := 0.0;
  budget_compatibility DECIMAL(2,1) := 0.0;
  travel_style_match BOOLEAN := false;
  user1_data RECORD;
  user2_data RECORD;
  user1_prefs RECORD;
  user2_prefs RECORD;
BEGIN
  -- Get user data
  SELECT age, location, travel_style, interests, preferred_destinations, languages_spoken
  INTO user1_data
  FROM users WHERE id = user1_id;
  
  SELECT age, location, travel_style, interests, preferred_destinations, languages_spoken
  INTO user2_data
  FROM users WHERE id = user2_id;
  
  -- Get travel preferences
  SELECT budget_range_min, budget_range_max, group_size_preference, travel_pace, preferred_activities
  INTO user1_prefs
  FROM travel_preferences WHERE user_id = user1_id;
  
  SELECT budget_range_min, budget_range_max, group_size_preference, travel_pace, preferred_activities
  INTO user2_prefs
  FROM travel_preferences WHERE user_id = user2_id;
  
  -- Calculate common destinations (20% weight)
  SELECT COUNT(*)
  INTO common_destinations
  FROM (
    SELECT UNNEST(COALESCE(user1_data.preferred_destinations, ARRAY[]::TEXT[])) as dest
    INTERSECT
    SELECT UNNEST(COALESCE(user2_data.preferred_destinations, ARRAY[]::TEXT[])) as dest
  ) common_dest;
  
  score := score + (LEAST(common_destinations, 5) * 0.04);
  score_breakdown := jsonb_set(score_breakdown, '{destinations}', to_jsonb(LEAST(common_destinations, 5) * 0.04));
  
  -- Calculate common interests (25% weight)
  SELECT COUNT(*)
  INTO common_interests
  FROM (
    SELECT UNNEST(COALESCE(user1_data.interests, ARRAY[]::TEXT[])) as interest
    INTERSECT
    SELECT UNNEST(COALESCE(user2_data.interests, ARRAY[]::TEXT[])) as interest
  ) common_int;
  
  score := score + (LEAST(common_interests, 5) * 0.05);
  score_breakdown := jsonb_set(score_breakdown, '{interests}', to_jsonb(LEAST(common_interests, 5) * 0.05));
  
  -- Calculate common languages (15% weight)
  SELECT COUNT(*)
  INTO common_languages
  FROM (
    SELECT UNNEST(COALESCE(user1_data.languages_spoken, ARRAY[]::TEXT[])) as lang
    INTERSECT
    SELECT UNNEST(COALESCE(user2_data.languages_spoken, ARRAY[]::TEXT[])) as lang
  ) common_lang;
  
  score := score + (LEAST(common_languages, 3) * 0.05);
  score_breakdown := jsonb_set(score_breakdown, '{languages}', to_jsonb(LEAST(common_languages, 3) * 0.05));
  
  -- Age compatibility (10% weight)
  age_diff := ABS(COALESCE(user1_data.age, 30) - COALESCE(user2_data.age, 30));
  
  IF age_diff <= 3 THEN
    score := score + 0.10;
    score_breakdown := jsonb_set(score_breakdown, '{age}', to_jsonb(0.10));
  ELSIF age_diff <= 7 THEN
    score := score + 0.07;
    score_breakdown := jsonb_set(score_breakdown, '{age}', to_jsonb(0.07));
  ELSIF age_diff <= 12 THEN
    score := score + 0.05;
    score_breakdown := jsonb_set(score_breakdown, '{age}', to_jsonb(0.05));
  ELSE
    score_breakdown := jsonb_set(score_breakdown, '{age}', to_jsonb(0.0));
  END IF;
  
  -- Travel style compatibility (10% weight)
  IF user1_data.travel_style = user2_data.travel_style AND user1_data.travel_style IS NOT NULL THEN
    score := score + 0.10;
    travel_style_match := true;
    score_breakdown := jsonb_set(score_breakdown, '{travel_style}', to_jsonb(0.10));
  ELSE
    score_breakdown := jsonb_set(score_breakdown, '{travel_style}', to_jsonb(0.0));
  END IF;
  
  -- Budget compatibility (10% weight)
  IF user1_prefs.budget_range_min IS NOT NULL AND user2_prefs.budget_range_min IS NOT NULL THEN
    -- Check if budget ranges overlap
    IF (user1_prefs.budget_range_max >= user2_prefs.budget_range_min AND 
        user1_prefs.budget_range_min <= user2_prefs.budget_range_max) THEN
      budget_compatibility := 0.10;
      score := score + budget_compatibility;
    END IF;
  END IF;
  score_breakdown := jsonb_set(score_breakdown, '{budget}', to_jsonb(budget_compatibility));
  
  -- Location proximity bonus (10% weight)
  IF user1_data.location IS NOT NULL AND user2_data.location IS NOT NULL THEN
    -- Simple location matching (can be enhanced with geolocation)
    IF LOWER(user1_data.location) = LOWER(user2_data.location) THEN
      location_score := 0.10;
    ELSIF user1_data.location ILIKE '%' || split_part(user2_data.location, ',', -1) || '%' 
          OR user2_data.location ILIKE '%' || split_part(user1_data.location, ',', -1) || '%' THEN
      location_score := 0.05;
    END IF;
    score := score + location_score;
  END IF;
  score_breakdown := jsonb_set(score_breakdown, '{location}', to_jsonb(location_score));
  
  -- Travel pace compatibility bonus
  IF user1_prefs.travel_pace = user2_prefs.travel_pace AND user1_prefs.travel_pace IS NOT NULL THEN
    score := score + 0.05;
    score_breakdown := jsonb_set(score_breakdown, '{travel_pace}', to_jsonb(0.05));
  ELSE
    score_breakdown := jsonb_set(score_breakdown, '{travel_pace}', to_jsonb(0.0));
  END IF;
  
  -- Group size preference compatibility
  IF user1_prefs.group_size_preference = user2_prefs.group_size_preference AND user1_prefs.group_size_preference IS NOT NULL THEN
    score := score + 0.05;
    score_breakdown := jsonb_set(score_breakdown, '{group_size}', to_jsonb(0.05));
  ELSE
    score_breakdown := jsonb_set(score_breakdown, '{group_size}', to_jsonb(0.0));
  END IF;
  
  -- Cap score at 1.0
  IF score > 1.0 THEN
    score := 1.0;
  END IF;
  
  -- Return detailed score breakdown
  RETURN jsonb_build_object(
    'total_score', score,
    'breakdown', score_breakdown,
    'compatibility_factors', jsonb_build_object(
      'common_destinations', common_destinations,
      'common_interests', common_interests,
      'common_languages', common_languages,
      'age_difference', age_diff,
      'travel_style_match', travel_style_match,
      'location_proximity', location_score > 0
    )
  );
END;
$$;

-- Enhanced travel buddy finder with detailed matching
CREATE OR REPLACE FUNCTION public.find_enhanced_travel_buddies(
  user_id uuid,
  destination_filter text DEFAULT NULL,
  max_age_diff integer DEFAULT 15,
  min_score decimal DEFAULT 0.3,
  limit_count integer DEFAULT 20
)
RETURNS TABLE(
  buddy_user_id uuid,
  buddy_email text,
  buddy_age integer,
  buddy_location text,
  buddy_photo text,
  buddy_bio text,
  buddy_travel_style text,
  buddy_languages text[],
  match_score decimal,
  score_breakdown jsonb,
  common_interests text[],
  common_destinations text[]
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  WITH user_data AS (
    SELECT u.*, tp.* FROM users u
    LEFT JOIN travel_preferences tp ON u.id = tp.user_id
    WHERE u.id = user_id
  ),
  potential_matches AS (
    SELECT 
      u.id as buddy_user_id,
      u.email as buddy_email,
      u.age as buddy_age,
      u.location as buddy_location,
      u.profile_photo_url as buddy_photo,
      u.bio as buddy_bio,
      u.travel_style as buddy_travel_style,
      u.languages_spoken as buddy_languages,
      calculate_advanced_match_score(user_id, u.id) as match_data
    FROM users u
    LEFT JOIN travel_preferences tp ON u.id = tp.user_id
    CROSS JOIN user_data ud
    WHERE u.id != user_id
      AND u.public_profile = true
      AND NOT EXISTS (
        SELECT 1 FROM travel_swipes s 
        WHERE s.swiper_id = user_id AND s.swiped_id = u.id
      )
      AND (max_age_diff IS NULL OR ABS(COALESCE(u.age, 30) - COALESCE(ud.age, 30)) <= max_age_diff)
      AND (destination_filter IS NULL OR 
           u.preferred_destinations @> ARRAY[destination_filter] OR
           ud.preferred_destinations @> ARRAY[destination_filter])
  )
  SELECT 
    pm.buddy_user_id,
    pm.buddy_email,
    pm.buddy_age,
    pm.buddy_location,
    pm.buddy_photo,
    pm.buddy_bio,
    pm.buddy_travel_style,
    pm.buddy_languages,
    (pm.match_data->>'total_score')::decimal as match_score,
    pm.match_data->'breakdown' as score_breakdown,
    -- Calculate common interests
    ARRAY(
      SELECT UNNEST(COALESCE(u1.interests, ARRAY[]::TEXT[]))
      INTERSECT 
      SELECT UNNEST(COALESCE(u2.interests, ARRAY[]::TEXT[]))
    ) as common_interests,
    -- Calculate common destinations  
    ARRAY(
      SELECT UNNEST(COALESCE(u1.preferred_destinations, ARRAY[]::TEXT[]))
      INTERSECT 
      SELECT UNNEST(COALESCE(u2.preferred_destinations, ARRAY[]::TEXT[]))
    ) as common_destinations
  FROM potential_matches pm
  JOIN users u1 ON u1.id = user_id
  JOIN users u2 ON u2.id = pm.buddy_user_id
  WHERE (pm.match_data->>'total_score')::decimal >= min_score
  ORDER BY (pm.match_data->>'total_score')::decimal DESC
  LIMIT limit_count;
END;
$$;
