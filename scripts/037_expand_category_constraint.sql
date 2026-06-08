-- Expand category check constraint on provider_listings to support all ecosystem categories
ALTER TABLE public.provider_listings DROP CONSTRAINT IF EXISTS provider_listings_category_check;
ALTER TABLE public.provider_listings ADD CONSTRAINT provider_listings_category_check
  CHECK (category IN ('RPC', 'Indexing', 'Validator', 'Gateway', 'Service', 'Oracle', 'DEX', 'NFT', 'Bridge', 'Wallet', 'Analytics', 'SDK', 'Storage'));
