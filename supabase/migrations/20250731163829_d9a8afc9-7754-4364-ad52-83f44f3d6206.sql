-- Create a view to fetch full destination detail
CREATE VIEW full_destination_detail AS
SELECT
  d.id AS destination_id,
  d.slug,
  d.name AS title,
  d.category AS subtitle,
  d.description AS overview,
  '2-3 days' AS suggested_trip_duration,
  COALESCE(json_agg(DISTINCT jsonb_build_object('title', da.title, 'description', da.description)) FILTER (WHERE da.id IS NOT NULL), '[]'::json) AS activities,
  COALESCE(json_agg(DISTINCT jsonb_build_object('month', dw.month, 'temperature', dw.temperature, 'aqi', dw.aqi, 'notes', dw.notes)) FILTER (WHERE dw.id IS NOT NULL), '[]'::json) AS weather,
  COALESCE(json_agg(DISTINCT jsonb_build_object('mode', dt.mode, 'details', dt.details)) FILTER (WHERE dt.id IS NOT NULL), '[]'::json) AS transport,
  COALESCE(json_agg(DISTINCT jsonb_build_object('category', dtp.category, 'title', dtp.title, 'content', dtp.content)) FILTER (WHERE dtp.id IS NOT NULL), '[]'::json) AS travel_tips,
  COALESCE(json_agg(DISTINCT jsonb_build_object('url', dp.url, 'caption', dp.caption)) FILTER (WHERE dp.id IS NOT NULL), '[]'::json) AS photos,
  dvi.best_time,
  dvi.notes AS best_time_notes
FROM destinations d
LEFT JOIN destination_activities da ON d.id = da.destination_id
LEFT JOIN destination_weather dw ON d.id = dw.destination_id
LEFT JOIN destination_transport dt ON d.id = dt.destination_id
LEFT JOIN destination_tips dtp ON d.id = dtp.destination_id
LEFT JOIN destination_photos dp ON d.id = dp.destination_id
LEFT JOIN destination_visit_info dvi ON d.id = dvi.destination_id
GROUP BY d.id, d.slug, d.name, d.category, d.description, dvi.best_time, dvi.notes;
