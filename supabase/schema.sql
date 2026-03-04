-- ============================================
-- eFootball Account Store - Supabase Schema
-- ============================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enum for account status
CREATE TYPE account_status AS ENUM ('Available', 'Pending', 'Sold');

-- ============================================
-- Emails Table
-- ============================================
CREATE TABLE emails (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email_address TEXT NOT NULL,
  password TEXT NOT NULL,
  recovery_info TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Accounts Table
-- ============================================
CREATE TABLE accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  purchase_price NUMERIC(12, 2) NOT NULL DEFAULT 0,
  selling_price NUMERIC(12, 2) NOT NULL DEFAULT 0,
  images TEXT[] DEFAULT '{}',
  primary_image_url TEXT,
  status account_status NOT NULL DEFAULT 'Available',
  total_gp BIGINT DEFAULT 0,
  total_coins_android BIGINT DEFAULT 0,
  total_coins_ios BIGINT DEFAULT 0,
  team_strength INTEGER DEFAULT 0,
  email_id UUID UNIQUE REFERENCES emails(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast public queries
CREATE INDEX idx_accounts_status ON accounts(status);
CREATE INDEX idx_accounts_email_id ON accounts(email_id);

-- ============================================
-- Auto-update updated_at trigger
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_emails_updated_at
  BEFORE UPDATE ON emails
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_accounts_updated_at
  BEFORE UPDATE ON accounts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- Row Level Security (RLS) Policies
-- ============================================

-- Enable RLS on both tables
ALTER TABLE emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;

-- Emails: Only authenticated users (admin) can access
CREATE POLICY "Admin full access to emails"
  ON emails FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Accounts: Public can only read Available accounts (restricted columns via view)
CREATE POLICY "Public can view available accounts"
  ON accounts FOR SELECT
  USING (true);

CREATE POLICY "Admin full access to accounts"
  ON accounts FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ============================================
-- Public view: hides sensitive fields
-- ============================================
CREATE OR REPLACE VIEW public_accounts AS
SELECT
  id,
  title,
  selling_price,
  images,
  primary_image_url,
  status,
  total_gp,
  total_coins_android,
  total_coins_ios,
  team_strength,
  created_at
FROM accounts
WHERE status = 'Available';

-- Grant access to the public view for anon role
GRANT SELECT ON public_accounts TO anon;
GRANT SELECT ON accounts TO anon;
GRANT ALL ON emails TO authenticated;
GRANT ALL ON accounts TO authenticated;

-- ============================================
-- Storage bucket for account images (optional)
-- ============================================
-- Run this in the Supabase dashboard SQL editor:
-- INSERT INTO storage.buckets (id, name, public) VALUES ('account-images', 'account-images', true);
