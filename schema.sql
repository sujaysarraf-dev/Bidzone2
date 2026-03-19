-- SQL Schema for Bidzone Platform

-- 1. Profiles Table (Users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('Buyer', 'Institution', 'Admin')),
  status TEXT NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Suspended', 'Pending')),
  institution_name TEXT,
  phone_number TEXT,
  photo_url TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Auctions Table (Listings)
CREATE TABLE IF NOT EXISTS auctions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  asset_type TEXT NOT NULL CHECK (asset_type IN ('Real Estate', 'Vehicle', 'Machinery', 'Financial Asset', 'Other')),
  base_price DECIMAL NOT NULL,
  reserve_price DECIMAL NOT NULL,
  current_bid DECIMAL DEFAULT 0,
  bid_count INTEGER DEFAULT 0,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'Active' CHECK (status IN ('Pending', 'Active', 'Closed', 'Cancelled')),
  address TEXT NOT NULL,
  latitude DECIMAL NOT NULL,
  longitude DECIMAL NOT NULL,
  institution_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  institution_name TEXT NOT NULL,
  images TEXT[] DEFAULT '{}',
  documents JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Function to increment bid count and update current bid atomically
CREATE OR REPLACE FUNCTION increment_bid(a_id UUID, new_amount DECIMAL)
RETURNS void AS $$
BEGIN
  UPDATE auctions
  SET current_bid = new_amount,
      bid_count = bid_count + 1
  WHERE id = a_id;
END;
$$ LANGUAGE plpgsql;

-- 3. Bids Table
CREATE TABLE IF NOT EXISTS bids (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auction_id UUID REFERENCES auctions(id) ON DELETE CASCADE,
  bidder_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  bidder_name TEXT NOT NULL,
  amount DECIMAL NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('outbid', 'ending_soon', 'won', 'new_listing')),
  auction_id UUID REFERENCES auctions(id) ON DELETE SET NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Initial Data (Mock Data Migration)

-- Insert Institutions
INSERT INTO profiles (id, email, display_name, role, status, institution_name)
VALUES 
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'nib@example.com', 'Nepal Investment Bank Admin', 'Institution', 'Active', 'Nepal Investment Bank'),
  ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'nabil@example.com', 'Nabil Bank Admin', 'Institution', 'Active', 'Nabil Bank'),
  ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'global@example.com', 'Global IME Bank Admin', 'Institution', 'Active', 'Global IME Bank'),
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 'nic@example.com', 'NIC Asia Bank Admin', 'Institution', 'Active', 'NIC Asia Bank')
ON CONFLICT (email) DO NOTHING;

-- Insert Auctions
INSERT INTO auctions (id, title, description, asset_type, base_price, reserve_price, current_bid, bid_count, start_time, end_time, status, address, latitude, longitude, institution_id, institution_name, images, documents)
VALUES 
  ('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a21', 'Prime Commercial Land in Kathmandu', 'A 5000 sq. ft. commercial plot located in the heart of Kathmandu. Ideal for business centers or retail outlets.', 'Real Estate', 50000000, 55000000, 52000000, 12, NOW(), NOW() + INTERVAL '3 days', 'Active', 'Durbar Marg, Kathmandu', 27.7103, 85.3222, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Nepal Investment Bank', ARRAY['https://picsum.photos/seed/realestate1/800/600'], '[{"name": "Valuation Report", "url": "#"}]'::jsonb),
  ('f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', '2022 Toyota Hilux - Repossessed', 'Excellent condition, low mileage (15,000 km). Fully serviced and maintained by authorized dealer.', 'Vehicle', 4500000, 4800000, 4600000, 8, NOW(), NOW() + INTERVAL '1 day', 'Active', 'Pokhara, Kaski', 28.2096, 83.9856, 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'Nabil Bank', ARRAY['https://picsum.photos/seed/vehicle1/800/600'], '[{"name": "Bluebook Copy", "url": "#"}]'::jsonb),
  ('10eebc99-9c0b-4ef8-bb6d-6bb9bd380a23', 'Industrial Printing Press - Heidelberg', 'High-capacity industrial printing press. Model 2018, well-maintained, currently in storage.', 'Machinery', 12000000, 13500000, 12500000, 5, NOW(), NOW() + INTERVAL '5 days', 'Active', 'Biratnagar, Morang', 26.4525, 87.2718, 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'Global IME Bank', ARRAY['https://picsum.photos/seed/machinery1/800/600'], '[{"name": "Technical Specs", "url": "#"}]'::jsonb),
  ('20eebc99-9c0b-4ef8-bb6d-6bb9bd380a24', 'Corporate Bond Portfolio - 500 Units', 'A portfolio of high-yield corporate bonds from various manufacturing sectors.', 'Financial Asset', 2000000, 2100000, 2050000, 15, NOW(), NOW() + INTERVAL '2 days', 'Active', 'Lalitpur, Bagmati', 27.6644, 85.3188, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Nepal Investment Bank', ARRAY['https://picsum.photos/seed/finance1/800/600'], '[{"name": "Prospectus", "url": "#"}]'::jsonb),
  ('30eebc99-9c0b-4ef8-bb6d-6bb9bd380a25', 'Luxury Apartment in Sanepa', '3 BHK luxury apartment with modern amenities. 1800 sq. ft. area, 5th floor.', 'Real Estate', 35000000, 38000000, 36000000, 20, NOW(), NOW() + INTERVAL '10 days', 'Active', 'Sanepa, Lalitpur', 27.6784, 85.3012, 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 'NIC Asia Bank', ARRAY['https://picsum.photos/seed/realestate2/800/600'], '[{"name": "Ownership Certificate", "url": "#"}]'::jsonb),
  ('40eebc99-9c0b-4ef8-bb6d-6bb9bd380a26', 'Excavator - Caterpillar 320D', 'Heavy-duty excavator, 2019 model. 4500 hours of operation. Ready for construction projects.', 'Machinery', 8500000, 9000000, 8700000, 3, NOW(), NOW() + INTERVAL '4 days', 'Active', 'Butwal, Rupandehi', 27.7006, 83.4484, 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'Nabil Bank', ARRAY['https://picsum.photos/seed/machinery2/800/600'], '[{"name": "Maintenance Log", "url": "#"}]'::jsonb)
ON CONFLICT (id) DO NOTHING;
