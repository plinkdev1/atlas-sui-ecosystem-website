-- Create advertising_partners table for managing partner ad slots
CREATE TABLE IF NOT EXISTS public.advertising_partners (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  partner_id TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  logo_url TEXT,
  tagline TEXT,
  website TEXT NOT NULL,
  slot_position INTEGER NOT NULL DEFAULT 0,
  active BOOLEAN DEFAULT true,
  verified BOOLEAN DEFAULT false,
  badge TEXT,
  chains TEXT[] DEFAULT '{"Sui"}'::TEXT[],
  featured BOOLEAN DEFAULT false,
  ad_type TEXT DEFAULT 'rectangle',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW())
);

-- Enable RLS
ALTER TABLE public.advertising_partners ENABLE ROW LEVEL SECURITY;

-- Public can view active partners
CREATE POLICY "public_view_active_partners" ON public.advertising_partners
  FOR SELECT USING (active = true);

-- Admins can view all partners
CREATE POLICY "admin_view_all_partners" ON public.advertising_partners
  FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');

-- Admins can create partners
CREATE POLICY "admin_create_partners" ON public.advertising_partners
  FOR INSERT WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Admins can update partners
CREATE POLICY "admin_update_partners" ON public.advertising_partners
  FOR UPDATE USING (auth.jwt() ->> 'role' = 'admin');

-- Admins can delete partners
CREATE POLICY "admin_delete_partners" ON public.advertising_partners
  FOR DELETE USING (auth.jwt() ->> 'role' = 'admin');

-- Create index for slot positioning
CREATE INDEX idx_advertising_partners_slot_position ON public.advertising_partners(slot_position);
CREATE INDEX idx_advertising_partners_active ON public.advertising_partners(active);

-- Insert initial partners from hardcoded list
INSERT INTO public.advertising_partners (partner_id, name, logo_url, tagline, website, slot_position, active, verified, featured, chains, ad_type)
VALUES
  ('blockberry', 'Blockberry', 'https://blockberry.one/logo.png', 'Leading Blockchain Indexing & Analytics', 'https://blockberry.one', 1, true, true, true, '{"Sui","Aptos"}', 'rectangle'),
  ('blockvision', 'Blockvision', 'https://blockvision.org/logo.png', 'Real-Time Blockchain Data Infrastructure', 'https://blockvision.org', 2, true, true, true, '{"Sui"}', 'rectangle'),
  ('shinami', 'Shinami', 'https://shinami.io/logo.png', 'Enterprise-Grade RPC & Node Services', 'https://shinami.io', 3, true, true, true, '{"Sui"}', 'rectangle'),
  ('quicknode', 'QuickNode', 'https://quicknode.com/logo.png', 'Fast & Reliable Blockchain Infrastructure', 'https://quicknode.com', 4, true, true, true, '{"Sui","Ethereum","Aptos"}', 'rectangle'),
  ('mysten-labs', 'Mysten Labs', 'https://mystenlabs.com/logo.png', 'Creators of Sui & Consensus Technology', 'https://mystenlabs.com', 5, true, true, true, '{"Sui"}', 'rectangle'),
  ('cetus', 'Cetus', '/logos/cetus.png', 'Next-Gen DEX & Liquidity Protocol', 'https://cetus.finance', 6, true, false, true, '{"Sui"}', 'rectangle'),
  ('okx-wallet', 'OKX Wallet', 'https://www.okx.com/logo.png', 'Multi-Chain Web3 Wallet & DEX', 'https://www.okx.com/web3', 7, true, false, true, '{"Sui","Aptos","Ethereum","Mina"}', 'rectangle'),
  ('nightly-wallet', 'Nightly Wallet', 'https://nightly.app/logo.png', 'Secure Multi-Chain Wallet', 'https://nightly.app', 8, true, false, true, '{"Sui","Aptos","Ethereum"}', 'rectangle'),
  ('suiet', 'Suiet', 'https://suiet.app/logo.png', 'Native Sui Wallet & DApp Browser', 'https://suiet.app', 9, true, true, true, '{"Sui"}', 'rectangle'),
  ('ethos-wallet', 'Ethos Wallet', '/images/ethos.png', 'Simple & Secure Web3 Experience', 'https://ethoswallet.xyz', 10, true, false, true, '{"Sui"}', 'rectangle'),
  ('phantom', 'Phantom', 'https://phantom.app/logo.png', 'Leading Multi-Chain Web3 Wallet', 'https://phantom.app', 11, true, false, true, '{"Sui","Ethereum","Aptos","Mina"}', 'rectangle'),
  ('aptos-labs', 'Aptos Labs', 'https://aptoslabs.com/logo.png', 'Layer 1 Blockchain for Real-World Use', 'https://aptoslabs.com', 12, true, false, false, '{"Aptos"}', 'rectangle')
ON CONFLICT (partner_id) DO NOTHING;
