-- Create storage bucket for Vecteezy images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('vecteezy-images', 'vecteezy-images', true);

-- Create policy to allow public read access
CREATE POLICY "Public Access" ON storage.objects
  FOR SELECT USING (bucket_id = 'vecteezy-images');

-- Create policy to allow authenticated users to upload
CREATE POLICY "Authenticated users can upload vecteezy images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'vecteezy-images' AND auth.role() = 'authenticated');

-- Create policy to allow authenticated users to update
CREATE POLICY "Authenticated users can update vecteezy images" ON storage.objects
  FOR UPDATE USING (bucket_id = 'vecteezy-images' AND auth.role() = 'authenticated');