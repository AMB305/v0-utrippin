-- Insert Vatican City detailed data (corrected)
DO $$
DECLARE
    vatican_id UUID := '275f9a62-a329-4bfd-b219-760fde5ab7f2';
BEGIN
    -- Insert activities
    INSERT INTO destination_activities (destination_id, title, description, category, duration, cost_range, location, tips) VALUES
    (vatican_id, 'St. Peters Basilica', 'Marvel at the grandeur of one of the largest churches in the world, admire Michelangelos Pietà, and climb the dome for a panoramic view of Rome and Vatican City.', 'Religious', '2-3 hours', 'Free entry, €10 for dome', 'Vatican City', 'Arrive early to avoid crowds'),
    (vatican_id, 'Sistine Chapel', 'Visit the Vatican Museums to see the Sistine Chapels famous ceiling frescoes by Michelangelo and the vast collections of art, sculptures, and tapestries gathered by the popes over centuries.', 'Cultural', '3-4 hours', '€17 online booking', 'Vatican Museums', 'Book skip-the-line tickets online'),
    (vatican_id, 'Vatican Necropolis Tour', 'Explore beneath the Basilica to see the Scavi (excavations) where St. Peters tomb lies (advance reservations required for this fascinating archaeological tour).', 'Historical', '1-2 hours', '€13 per person', 'Underground Vatican', 'Must book far in advance'),
    (vatican_id, 'St. Peters Square', 'Spend time in the famous piazza, designed by Bernini, and if possible attend a Papal Audience on Wednesday or the Sunday Angelus to see Pope Francis and receive a blessing.', 'Religious', '1 hour', 'Free', 'St. Peters Square', 'Check papal schedule online'),
    (vatican_id, 'Vatican Gardens', 'If time permits, take a guided tour of the beautifully manicured Vatican Gardens for a peaceful break amid fountains, sculptures, and greenery (tours must be booked in advance).', 'Nature', '2 hours', '€37 guided tour', 'Vatican Gardens', 'Advanced booking required');

    -- Insert weather data
    INSERT INTO destination_weather (destination_id, month, temperature, aqi, notes) VALUES
    (vatican_id, 'January', '3–12°C', 41, 'Cool and damp, light rain.'),
    (vatican_id, 'February', '5–13°C', 43, 'Mild with occasional rain.'),
    (vatican_id, 'March', '8–16°C', 44, 'Early spring, breezy and dry.'),
    (vatican_id, 'April', '10–19°C', 39, 'Ideal sightseeing, spring bloom.'),
    (vatican_id, 'May', '14–24°C', 33, 'Sunny and dry.'),
    (vatican_id, 'June', '18–27°C', 30, 'Warm and dry.'),
    (vatican_id, 'July', '20–32°C', 50, 'Hot, moderate AQI due to heat.'),
    (vatican_id, 'August', '21–35°C', 60, 'Very hot, occasional poor AQI.'),
    (vatican_id, 'September', '18–27°C', 35, 'Warm easing to mild.'),
    (vatican_id, 'October', '14–21°C', 28, 'Mild autumn, light showers.'),
    (vatican_id, 'November', '10–16°C', 33, 'Cooler with some rain.'),
    (vatican_id, 'December', '6–12°C', 40, 'Chilly and overcast.');

    -- Insert transport options
    INSERT INTO destination_transport (destination_id, mode, details) VALUES
    (vatican_id, 'By Air', 'Fly into Romes airports (Leonardo da Vinci–Fiumicino or Ciampino). Vatican City is ~30 km from the airport.'),
    (vatican_id, 'By Train/Metro', 'Take Romes Metro Line A to Ottaviano-S. Pietro station. Local trains stop at Stazione S. Pietro.'),
    (vatican_id, 'By Bus/On Foot', 'City buses (#40, #64) stop nearby. Walkable from central Rome neighborhoods (20–30 mins).');

    -- Insert travel tips
    INSERT INTO destination_tips (destination_id, category, title, content) VALUES
    (vatican_id, 'Dress Code', 'Modest Attire Required', 'Wear modest attire covering shoulders and knees. Security will deny entry otherwise.'),
    (vatican_id, 'Timing & Tickets', 'Skip the Lines', 'Arrive early. Book skip-the-line museum tickets online.'),
    (vatican_id, 'Security', 'Airport-Style Screening', 'Airport-style screening. Avoid sharp items and large bags.'),
    (vatican_id, 'Photography', 'Photo Guidelines', 'Allowed in most areas except Sistine Chapel. No flash photography.'),
    (vatican_id, 'General Etiquette', 'Respectful Behavior', 'Respect the religious setting. Keep voices low and phones silent.');

    -- Insert visit info
    INSERT INTO destination_visit_info (destination_id, best_time, notes) VALUES
    (vatican_id, 'April through June and September through October', 'Comfortable temperatures (15–25°C) with fewer crowds than summer. Arrive early on weekdays to avoid lines. Winter is low season except Christmas/Easter.');

    -- Insert photos (using only available columns)
    INSERT INTO destination_photos (destination_id, url, caption) VALUES
    (vatican_id, 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&h=600&fit=crop', 'St. Peters Basilica at sunrise'),
    (vatican_id, 'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=800&h=600&fit=crop', 'Sistine Chapel interior'),
    (vatican_id, 'https://images.unsplash.com/photo-1518638150340-f706e86654de?w=800&h=600&fit=crop', 'Vatican Gardens view');
END $$;