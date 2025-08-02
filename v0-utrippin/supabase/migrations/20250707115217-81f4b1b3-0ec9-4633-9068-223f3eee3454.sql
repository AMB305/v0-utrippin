-- Insert sample users
INSERT INTO users (email, age, bio, location, preferred_destinations, travel_style, interests, public_profile) VALUES
('emily@example.com', 27, 'Adventure seeker exploring Southeast Asia. Love temples, street food, and meeting locals!', 'Bangkok, Thailand', ARRAY['Thailand', 'Vietnam', 'Cambodia'], 'Adventure', ARRAY['Photography', 'Food', 'Culture', 'History'], true),
('marcus@example.com', 24, 'Digital nomad passionate about authentic local experiences and amazing food.', 'Tokyo, Japan', ARRAY['Japan', 'South Korea', 'Taiwan'], 'Cultural', ARRAY['Food', 'Technology', 'Art', 'Music'], true),
('sofia@example.com', 29, 'Art enthusiast and history buff planning museum tours across Europe.', 'Barcelona, Spain', ARRAY['Spain', 'Italy', 'France', 'Portugal'], 'Cultural', ARRAY['Art', 'History', 'Culture', 'Photography'], true),
('alex@example.com', 31, 'Outdoor enthusiast seeking hiking and nature adventures around the world.', 'Denver, USA', ARRAY['Nepal', 'Peru', 'New Zealand', 'Chile'], 'Adventure', ARRAY['Adventure', 'Nature', 'Photography', 'Wellness'], true),
('maya@example.com', 26, 'Beach lover and surfer looking for coastal adventures and sunset sessions.', 'Bali, Indonesia', ARRAY['Indonesia', 'Australia', 'Philippines', 'Thailand'], 'Relaxation', ARRAY['Adventure', 'Nature', 'Wellness', 'Photography'], true),
('james@example.com', 28, 'Music festival enthusiast and nightlife explorer seeking party destinations.', 'Berlin, Germany', ARRAY['Germany', 'Netherlands', 'Belgium', 'Czech Republic'], 'Nightlife', ARRAY['Music', 'Nightlife', 'Culture', 'Food'], true);

-- Insert sample trips
INSERT INTO trips (user_id, title, destination, country, start_date, end_date, budget, trip_type, status, public, looking_for_buddies, max_buddies, duration_days) VALUES
((SELECT id FROM users WHERE email = 'emily@example.com'), 'Temple Hopping in Kyoto', 'Kyoto', 'Japan', '2024-04-15', '2024-04-22', 1200, 'Cultural Tour', 'planning', true, true, 3, 7),
((SELECT id FROM users WHERE email = 'marcus@example.com'), 'Street Food Adventure Tokyo', 'Tokyo', 'Japan', '2024-05-01', '2024-05-10', 1500, 'Food Tour', 'planning', true, true, 4, 9),
((SELECT id FROM users WHERE email = 'sofia@example.com'), 'Art & Museums Barcelona', 'Barcelona', 'Spain', '2024-06-10', '2024-06-17', 800, 'Cultural Tour', 'planning', true, true, 2, 7),
((SELECT id FROM users WHERE email = 'alex@example.com'), 'Hiking Annapurna Base Camp', 'Pokhara', 'Nepal', '2024-10-15', '2024-10-30', 2000, 'Adventure Travel', 'planning', true, true, 6, 15),
((SELECT id FROM users WHERE email = 'maya@example.com'), 'Surf & Beach Vibes Bali', 'Canggu', 'Indonesia', '2024-07-20', '2024-08-05', 1000, 'Beach Holiday', 'planning', true, true, 4, 16),
((SELECT id FROM users WHERE email = 'james@example.com'), 'Music Festivals Europe', 'Amsterdam', 'Netherlands', '2024-08-15', '2024-08-25', 1800, 'City Break', 'planning', true, true, 8, 10);
