-- Make provider_id nullable and drop FK for seed data
ALTER TABLE public.provider_listings DROP CONSTRAINT IF EXISTS provider_listings_provider_id_fkey;
ALTER TABLE public.provider_listings ALTER COLUMN provider_id DROP NOT NULL;
