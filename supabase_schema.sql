-- Run this SQL in your Supabase SQL Editor to create the necessary tables.

CREATE TABLE memories (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  image_url text,
  note text NOT NULL,
  date date NOT NULL,
  rating integer DEFAULT 5,
  repeat boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE wishlist (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  text text NOT NULL,
  completed boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS (Row Level Security) - optional but recommended, here we make it fully accessible for simplicity
ALTER TABLE memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist ENABLE ROW LEVEL SECURITY;

-- Allow all operations for now (You might want to restrict this in production)
CREATE POLICY "Enable read access for all users" ON memories FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON memories FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON memories FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON memories FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON wishlist FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON wishlist FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON wishlist FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON wishlist FOR DELETE USING (true);

-- Settings Table for Banner URL
CREATE TABLE app_settings (
  id integer PRIMARY KEY DEFAULT 1,
  banner_url text
);

-- Insert default row
INSERT INTO app_settings (id, banner_url) VALUES (1, null);

ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable all access for all users" ON app_settings FOR ALL USING (true) WITH CHECK (true);

-- Storage configuration for 'assets' bucket
-- This creates the bucket if it doesn't exist and makes it public
INSERT INTO storage.buckets (id, name, public) 
VALUES ('assets', 'assets', true) 
ON CONFLICT (id) DO NOTHING;

-- Note: Storage RLS is enabled by default in Supabase.

-- Allow public access to read files
CREATE POLICY "Public Read Access" 
ON storage.objects FOR SELECT 
USING ( bucket_id = 'assets' );

-- Allow public access to upload files
CREATE POLICY "Public Upload Access" 
ON storage.objects FOR INSERT 
WITH CHECK ( bucket_id = 'assets' );

-- Allow public access to update files
CREATE POLICY "Public Update Access" 
ON storage.objects FOR UPDATE 
USING ( bucket_id = 'assets' );

-- Allow public access to delete files
CREATE POLICY "Public Delete Access" 
ON storage.objects FOR DELETE 
USING ( bucket_id = 'assets' );
