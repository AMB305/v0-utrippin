-- Add missing columns to destinations table for category filtering and display
ALTER TABLE destinations 
ADD COLUMN IF NOT EXISTS category text,
ADD COLUMN IF NOT EXISTS price integer,
ADD COLUMN IF NOT EXISTS per text DEFAULT 'night',
ADD COLUMN IF NOT EXISTS img text;

-- Insert sample categorized destination data (without tags column)
INSERT INTO destinations (name, description, category, price, per, img, country, slug) VALUES
('Vatican City', 'Experience the spiritual heart of Catholicism with iconic St. Peters Basilica and Sistine Chapel', 'Religious', 150, 'night', 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400&h=300&fit=crop', 'Italy', 'vatican-city'),
('Varanasi', 'Sacred city on the Ganges with ancient temples and spiritual ceremonies', 'Religious', 40, 'night', 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=400&h=300&fit=crop', 'India', 'varanasi'),
('Kyoto', 'Ancient temples, traditional culture, and stunning zen gardens', 'Cultural', 120, 'night', 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&h=300&fit=crop', 'Japan', 'kyoto'),
('Paris', 'City of lights with world-class museums, art, and cuisine', 'Cultural', 180, 'night', 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=400&h=300&fit=crop', 'France', 'paris'),
('Maldives', 'Pristine white sand beaches and crystal-clear turquoise waters', 'Beaches', 400, 'night', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', 'Maldives', 'maldives'),
('Bali', 'Tropical paradise with beautiful beaches and rich Hindu culture', 'Beaches', 60, 'night', 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=400&h=300&fit=crop', 'Indonesia', 'bali'),
('Swiss Alps', 'Majestic mountain peaks perfect for skiing and hiking adventures', 'Mountains', 200, 'night', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', 'Switzerland', 'swiss-alps'),
('Patagonia', 'Wild mountain landscapes with glaciers and pristine wilderness', 'Mountains', 100, 'night', 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop', 'Argentina', 'patagonia'),
('Tokyo', 'Ultra-modern metropolis with incredible food scene and nightlife', 'Food', 140, 'night', 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=300&fit=crop', 'Japan', 'tokyo'),
('Bangkok', 'Street food paradise with vibrant markets and temple cuisine', 'Food', 50, 'night', 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=400&h=300&fit=crop', 'Thailand', 'bangkok')
ON CONFLICT (name) DO UPDATE SET
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  per = EXCLUDED.per,
  img = EXCLUDED.img;

-- Ensure RLS policies allow public read access
ALTER TABLE destinations ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'destinations' 
    AND policyname = 'Allow public read access to destinations'
  ) THEN
    CREATE POLICY "Allow public read access to destinations"
    ON destinations FOR SELECT
    USING (true);
  END IF;
END $$;