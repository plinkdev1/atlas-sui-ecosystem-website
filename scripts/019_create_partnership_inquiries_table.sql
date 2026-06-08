-- Create partnership_inquiries table for storing partnership contact form submissions
CREATE TABLE IF NOT EXISTS partnership_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  inquiry_type VARCHAR(50) NOT NULL, -- 'partnership', 'developer', 'brand', 'provider'
  message TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'new', -- new, contacted, in-progress, completed
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Create indexes for common queries
CREATE INDEX idx_partnership_inquiries_email ON partnership_inquiries(email);
CREATE INDEX idx_partnership_inquiries_status ON partnership_inquiries(status);
CREATE INDEX idx_partnership_inquiries_created_at ON partnership_inquiries(created_at DESC);
CREATE INDEX idx_partnership_inquiries_type ON partnership_inquiries(inquiry_type);

-- Enable RLS
ALTER TABLE partnership_inquiries ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Anyone can submit an inquiry
CREATE POLICY "Anyone can create partnership inquiry" ON partnership_inquiries
  FOR INSERT WITH CHECK (true);

-- Users can view their own inquiries by email
CREATE POLICY "Users can view own inquiries" ON partnership_inquiries
  FOR SELECT USING (email = LOWER(current_setting('request.jwt.claims', true)::json->>'email'));

-- Admins can view all inquiries
CREATE POLICY "Admins can view all inquiries" ON partnership_inquiries
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_app_meta_data->>'role' = 'admin'
    )
  );

-- Admins can update inquiry status
CREATE POLICY "Admins can update inquiries" ON partnership_inquiries
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_app_meta_data->>'role' = 'admin'
    )
  );

-- Grant permissions
GRANT SELECT, INSERT ON partnership_inquiries TO authenticated;
GRANT SELECT, INSERT, UPDATE ON partnership_inquiries TO service_role;
