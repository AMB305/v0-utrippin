-- Insert real destinations for different travel categories
INSERT INTO destinations (name, slug, country, region, description, overview, featured, hero_image_url, best_time_to_visit, currency, average_cost_per_day, latitude, longitude) VALUES
-- Wildlife & Nature destinations
('Masai Mara', 'masai-mara', 'Kenya', 'East Africa', 'World-renowned wildlife reserve famous for the Great Migration', 'Experience one of the world''s most spectacular wildlife events in Kenya''s premier game reserve.', true, '/lovable-uploads/1d6f39c0-2e22-4030-bf90-43a71ce90021.png', 'July to October', 'KES', 150, -1.4061, 35.0117),
('Manuel Antonio', 'manuel-antonio', 'Costa Rica', 'Central America', 'Pristine national park combining wildlife and beautiful beaches', 'Discover incredible biodiversity where rainforest meets the Pacific Ocean.', true, '/lovable-uploads/1d6f39c0-2e22-4030-bf90-43a71ce90021.png', 'December to April', 'CRC', 80, 9.3908, -84.1417),
('Chobe National Park', 'chobe-national-park', 'Botswana', 'Southern Africa', 'Famous for having the largest elephant population in Africa', 'Witness massive elephant herds along the Chobe River in this pristine wilderness.', true, '/lovable-uploads/1d6f39c0-2e22-4030-bf90-43a71ce90021.png', 'May to September', 'BWP', 120, -18.7500, 24.7500),

-- Budget Travel destinations  
('Bangkok', 'bangkok', 'Thailand', 'Southeast Asia', 'Vibrant capital city offering incredible value for money', 'Experience amazing street food, temples, and culture without breaking the bank.', true, '/lovable-uploads/1d6f39c0-2e22-4030-bf90-43a71ce90021.png', 'November to March', 'THB', 25, 13.7563, 100.5018),
('Ho Chi Minh City', 'ho-chi-minh-city', 'Vietnam', 'Southeast Asia', 'Dynamic metropolis with rich history and affordable adventures', 'Discover incredible cuisine, fascinating history, and warm hospitality at budget-friendly prices.', true, '/lovable-uploads/1d6f39c0-2e22-4030-bf90-43a71ce90021.png', 'December to April', 'VND', 30, 10.8231, 106.6297),
('Delhi', 'delhi', 'India', 'South Asia', 'Historic capital blending ancient heritage with modern energy', 'Explore magnificent monuments, bustling markets, and authentic experiences on a shoestring budget.', true, '/lovable-uploads/1d6f39c0-2e22-4030-bf90-43a71ce90021.png', 'October to March', 'INR', 20, 28.7041, 77.1025),

-- Beaches & Islands
('Maldives', 'maldives', 'Maldives', 'Indian Ocean', 'Paradise of crystal-clear waters and pristine beaches', 'Experience ultimate luxury in overwater villas surrounded by turquoise lagoons.', true, '/lovable-uploads/1d6f39c0-2e22-4030-bf90-43a71ce90021.png', 'November to April', 'MVR', 300, 3.2028, 73.2207),
('Bali', 'bali', 'Indonesia', 'Southeast Asia', 'Tropical island paradise with stunning beaches and rich culture', 'Discover beautiful temples, lush rice terraces, and world-class beaches.', true, '/lovable-uploads/1d6f39c0-2e22-4030-bf90-43a71ce90021.png', 'April to October', 'IDR', 50, -8.3405, 115.0920),
('Santorini', 'santorini', 'Greece', 'Mediterranean', 'Iconic island with dramatic cliffs and stunning sunsets', 'Experience breathtaking views, charming villages, and crystal-clear waters.', true, '/lovable-uploads/1d6f39c0-2e22-4030-bf90-43a71ce90021.png', 'April to October', 'EUR', 120, 36.3932, 25.4615),

-- Adventure destinations
('Queenstown', 'queenstown', 'New Zealand', 'Oceania', 'Adventure capital of the world with stunning alpine scenery', 'Experience thrilling activities surrounded by dramatic mountains and pristine lakes.', true, '/lovable-uploads/1d6f39c0-2e22-4030-bf90-43a71ce90021.png', 'December to February', 'NZD', 100, -45.0312, 168.6626),
('Cusco', 'cusco', 'Peru', 'South America', 'Gateway to Machu Picchu and ancient Incan heritage', 'Embark on incredible treks and discover one of the world''s greatest archaeological wonders.', true, '/lovable-uploads/1d6f39c0-2e22-4030-bf90-43a71ce90021.png', 'May to September', 'PEN', 60, -13.5319, -71.9675),
('Reykjavik', 'reykjavik', 'Iceland', 'Northern Europe', 'Gateway to incredible natural wonders and Arctic adventures', 'Witness Northern Lights, geysers, and dramatic landscapes in this Nordic adventure hub.', true, '/lovable-uploads/1d6f39c0-2e22-4030-bf90-43a71ce90021.png', 'September to March', 'ISK', 150, 64.1466, -21.9426),

-- Arts & Culture destinations
('Rome', 'rome', 'Italy', 'Southern Europe', 'Eternal city with unparalleled historical and artistic treasures', 'Walk through millennia of history while enjoying world-class art, architecture, and cuisine.', true, '/lovable-uploads/1d6f39c0-2e22-4030-bf90-43a71ce90021.png', 'April to June', 'EUR', 80, 41.9028, 12.4964),
('Tokyo', 'tokyo', 'Japan', 'East Asia', 'Vibrant metropolis blending traditional culture with cutting-edge innovation', 'Experience ancient temples alongside modern technology in this fascinating cultural capital.', true, '/lovable-uploads/1d6f39c0-2e22-4030-bf90-43a71ce90021.png', 'March to May', 'JPY', 100, 35.6762, 139.6503),
('Athens', 'athens', 'Greece', 'Southern Europe', 'Cradle of democracy with incredible ancient monuments', 'Explore the birthplace of civilization while enjoying Mediterranean culture and cuisine.', true, '/lovable-uploads/1d6f39c0-2e22-4030-bf90-43a71ce90021.png', 'April to June', 'EUR', 70, 37.9838, 23.7275);

-- Insert activities for Wildlife & Nature destinations
INSERT INTO destination_activities (destination_id, title, description, category, duration, cost_range, location, tips) VALUES
-- Masai Mara activities
((SELECT id FROM destinations WHERE slug = 'masai-mara'), 'Great Migration Game Drive', 'Witness millions of wildebeest and zebras crossing the Mara River', 'Wildlife Safari', '6-8 hours', '$150-250', 'Masai Mara National Reserve', 'Best viewing from July to October during river crossings'),
((SELECT id FROM destinations WHERE slug = 'masai-mara'), 'Hot Air Balloon Safari', 'See the Great Migration from above during sunrise', 'Adventure', '3 hours', '$400-500', 'Over Masai Mara', 'Book early, limited availability during peak season'),
((SELECT id FROM destinations WHERE slug = 'masai-mara'), 'Masai Cultural Visit', 'Learn about traditional Masai culture and customs', 'Cultural', '2-3 hours', '$30-50', 'Local Masai Village', 'Respect local customs and ask before photographing'),

-- Manuel Antonio activities  
((SELECT id FROM destinations WHERE slug = 'manuel-antonio'), 'Wildlife Spotting Hike', 'Spot sloths, monkeys, and exotic birds in the rainforest', 'Wildlife', '3-4 hours', '$40-60', 'Manuel Antonio National Park', 'Early morning visits offer best wildlife viewing'),
((SELECT id FROM destinations WHERE slug = 'manuel-antonio'), 'Beach and Forest Combo', 'Combine pristine beaches with tropical rainforest exploration', 'Nature', '6-8 hours', '$60-80', 'Manuel Antonio', 'Bring sunscreen and insect repellent'),
((SELECT id FROM destinations WHERE slug = 'manuel-antonio'), 'Canopy Zip-lining', 'Glide through the rainforest canopy', 'Adventure', '2-3 hours', '$70-90', 'Rainforest Canopy', 'Weight restrictions may apply'),

-- Budget Travel activities
((SELECT id FROM destinations WHERE slug = 'bangkok'), 'Street Food Tour', 'Sample incredible Thai cuisine from local street vendors', 'Food & Drink', '3-4 hours', '$15-25', 'Chinatown & Khao San Road', 'Try som tam, pad thai, and mango sticky rice'),
((SELECT id FROM destinations WHERE slug = 'bangkok'), 'Temple Hopping', 'Visit iconic temples including Wat Pho and Wat Arun', 'Cultural', '4-6 hours', '$10-20', 'Old City Bangkok', 'Dress modestly, cover shoulders and knees'),
((SELECT id FROM destinations WHERE slug = 'bangkok'), 'Floating Market Visit', 'Experience traditional Thai commerce on the water', 'Cultural', '4-5 hours', '$20-35', 'Damnoen Saduak', 'Go early to avoid crowds'),

-- Beaches & Islands activities
((SELECT id FROM destinations WHERE slug = 'maldives'), 'Snorkeling with Manta Rays', 'Swim with gentle giants in crystal-clear waters', 'Water Sports', '3-4 hours', '$80-120', 'Baa Atoll', 'Best from May to November'),
((SELECT id FROM destinations WHERE slug = 'maldives'), 'Sunset Dolphin Cruise', 'Watch dolphins play while enjoying a spectacular sunset', 'Wildlife', '2-3 hours', '$60-90', 'Various Atolls', 'Bring camera for amazing photo opportunities'),
((SELECT id FROM destinations WHERE slug = 'maldives'), 'Private Island Picnic', 'Enjoy lunch on a deserted tropical island', 'Relaxation', '6-8 hours', '$150-250', 'Private Sandbank', 'Ultimate romantic experience'),

-- Adventure activities
((SELECT id FROM destinations WHERE slug = 'queenstown'), 'Bungee Jumping', 'Take the ultimate leap from the original bungee site', 'Extreme Sports', '2-3 hours', '$150-200', 'Kawarau Gorge', 'World''s first commercial bungee jumping site'),
((SELECT id FROM destinations WHERE slug = 'queenstown'), 'Skydiving', 'Freefall over stunning alpine landscapes', 'Extreme Sports', '3-4 hours', '$300-400', 'The Remarkables', 'Weather dependent, book flexible dates'),
((SELECT id FROM destinations WHERE slug = 'queenstown'), 'Milford Sound Day Trip', 'Cruise through dramatic fjords and waterfalls', 'Nature', '12-14 hours', '$200-300', 'Milford Sound', 'Full day trip, bring warm clothes');

-- Insert attractions for cultural destinations
INSERT INTO destination_attractions (destination_id, name, description, type, address, rating, price_range, opening_hours, website_url, image_url) VALUES
-- Rome attractions
((SELECT id FROM destinations WHERE slug = 'rome'), 'Colosseum', 'Iconic ancient amphitheater and symbol of Imperial Rome', 'Historical Site', 'Piazza del Colosseo, 1, Rome', 4.6, '€16-25', '8:30 AM - 7:15 PM', 'https://www.coopculture.it', '/lovable-uploads/1d6f39c0-2e22-4030-bf90-43a71ce90021.png'),
((SELECT id FROM destinations WHERE slug = 'rome'), 'Vatican Museums', 'World''s greatest collection of art including the Sistine Chapel', 'Museum', 'Viale Vaticano, Vatican City', 4.5, '€17-30', '8:00 AM - 6:00 PM', 'https://www.museivaticani.va', '/lovable-uploads/1d6f39c0-2e22-4030-bf90-43a71ce90021.png'),
((SELECT id FROM destinations WHERE slug = 'rome'), 'Trevi Fountain', 'Baroque masterpiece and Rome''s most famous fountain', 'Monument', 'Piazza di Trevi, Rome', 4.5, 'Free', '24 hours', NULL, '/lovable-uploads/1d6f39c0-2e22-4030-bf90-43a71ce90021.png'),

-- Tokyo attractions
((SELECT id FROM destinations WHERE slug = 'tokyo'), 'Senso-ji Temple', 'Tokyo''s oldest temple in the historic Asakusa district', 'Religious Site', '2-3-1 Asakusa, Taito City, Tokyo', 4.3, 'Free', '6:00 AM - 5:00 PM', NULL, '/lovable-uploads/1d6f39c0-2e22-4030-bf90-43a71ce90021.png'),
((SELECT id FROM destinations WHERE slug = 'tokyo'), 'Tokyo Skytree', 'World''s tallest tower with incredible city views', 'Observation Deck', '1-1-2 Oshiage, Sumida City, Tokyo', 4.1, '¥2,100-3,400', '8:00 AM - 10:00 PM', 'https://www.tokyo-skytree.jp', '/lovable-uploads/1d6f39c0-2e22-4030-bf90-43a71ce90021.png'),
((SELECT id FROM destinations WHERE slug = 'tokyo'), 'Tsukiji Outer Market', 'Famous fish market with incredible fresh sushi', 'Market', '5 Chome Tsukiji, Chuo City, Tokyo', 4.2, '¥500-3,000', '5:00 AM - 2:00 PM', NULL, '/lovable-uploads/1d6f39c0-2e22-4030-bf90-43a71ce90021.png');

-- Insert travel tips for destinations
INSERT INTO destination_tips (destination_id, category, title, content) VALUES
-- Wildlife & Nature tips
((SELECT id FROM destinations WHERE slug = 'masai-mara'), 'Best Time', 'Great Migration Timing', 'The best time to witness the Great Migration river crossings is between July and October. Book accommodations well in advance as this is peak season.'),
((SELECT id FROM destinations WHERE slug = 'masai-mara'), 'What to Pack', 'Safari Essentials', 'Bring neutral-colored clothing, a wide-brimmed hat, sunscreen, binoculars, and a good camera with extra batteries. Avoid bright colors that might disturb wildlife.'),
((SELECT id FROM destinations WHERE slug = 'masai-mara'), 'Safety', 'Wildlife Safety', 'Always follow your guide''s instructions. Never leave your vehicle during game drives unless specifically told it''s safe. Keep windows closed when near predators.'),

-- Budget Travel tips
((SELECT id FROM destinations WHERE slug = 'bangkok'), 'Money Saving', 'Street Food Budget', 'Eat like a local at street food stalls - meals cost $1-3 and are often better than expensive restaurants. Always choose busy stalls with high turnover for freshness.'),
((SELECT id FROM destinations WHERE slug = 'bangkok'), 'Transportation', 'Getting Around', 'Use the BTS Skytrain and MRT subway for efficient travel. Tuk-tuks are fun but negotiate prices beforehand. Grab (ride-sharing) is convenient and affordable.'),
((SELECT id FROM destinations WHERE slug = 'bangkok'), 'Cultural Etiquette', 'Temple Visits', 'Dress modestly when visiting temples - cover shoulders, knees, and remove shoes. Show respect to Buddha images and monks. Small donations are appreciated.'),

-- Beach destinations tips
((SELECT id FROM destinations WHERE slug = 'maldives'), 'Best Time', 'Weather Guide', 'Dry season (November-April) offers the best weather but higher prices. Wet season (May-October) has occasional rain but better deals and fewer crowds.'),
((SELECT id FROM destinations WHERE slug = 'maldives'), 'Activities', 'Water Sports', 'The Maldives offers world-class diving and snorkeling. Many resorts provide complimentary equipment. Book diving trips early as spots fill up quickly.'),
((SELECT id FROM destinations WHERE slug = 'maldives'), 'Budgeting', 'Resort Costs', 'All-inclusive packages often provide better value. Alcohol is expensive due to import taxes. Consider bringing reef-safe sunscreen as many brands aren''t available locally.');

-- Add keywords for better searchability
UPDATE destinations SET keywords = ARRAY['wildlife', 'safari', 'great migration', 'big five', 'nature', 'elephants'] WHERE slug = 'masai-mara';
UPDATE destinations SET keywords = ARRAY['wildlife', 'rainforest', 'sloths', 'national park', 'beaches', 'nature'] WHERE slug = 'manuel-antonio';
UPDATE destinations SET keywords = ARRAY['elephants', 'safari', 'botswana', 'chobe river', 'wildlife', 'nature'] WHERE slug = 'chobe-national-park';
UPDATE destinations SET keywords = ARRAY['budget', 'street food', 'temples', 'backpacking', 'affordable', 'culture'] WHERE slug = 'bangkok';
UPDATE destinations SET keywords = ARRAY['budget', 'vietnam', 'history', 'food', 'backpacking', 'affordable'] WHERE slug = 'ho-chi-minh-city';
UPDATE destinations SET keywords = ARRAY['budget', 'india', 'history', 'culture', 'monuments', 'affordable'] WHERE slug = 'delhi';
UPDATE destinations SET keywords = ARRAY['luxury', 'beaches', 'overwater villas', 'honeymoon', 'diving', 'tropical'] WHERE slug = 'maldives';
UPDATE destinations SET keywords = ARRAY['beaches', 'temples', 'culture', 'surfing', 'rice terraces', 'tropical'] WHERE slug = 'bali';
UPDATE destinations SET keywords = ARRAY['beaches', 'sunset', 'greek islands', 'volcanic', 'romantic', 'wine'] WHERE slug = 'santorini';
UPDATE destinations SET keywords = ARRAY['adventure', 'bungee jumping', 'skydiving', 'queenstown', 'extreme sports', 'mountains'] WHERE slug = 'queenstown';
UPDATE destinations SET keywords = ARRAY['adventure', 'machu picchu', 'trekking', 'inca trail', 'mountains', 'culture'] WHERE slug = 'cusco';
UPDATE destinations SET keywords = ARRAY['adventure', 'northern lights', 'geysers', 'iceland', 'nordic', 'nature'] WHERE slug = 'reykjavik';
UPDATE destinations SET keywords = ARRAY['culture', 'history', 'art', 'colosseum', 'vatican', 'roman empire'] WHERE slug = 'rome';
UPDATE destinations SET keywords = ARRAY['culture', 'technology', 'temples', 'sushi', 'anime', 'modern'] WHERE slug = 'tokyo';
UPDATE destinations SET keywords = ARRAY['culture', 'history', 'ancient greece', 'acropolis', 'philosophy', 'mediterranean'] WHERE slug = 'athens';