-- Add missing consent_given column to cookie_consents table
-- This fixes the error: "Could not find the 'consent_given' column of 'cookie_consents' in the schema cache"

-- Add the column if it doesn't exist
ALTER TABLE IF EXISTS public.cookie_consents
ADD COLUMN IF NOT EXISTS consent_given BOOLEAN NOT NULL DEFAULT false;

-- Create index if missing
CREATE INDEX IF NOT EXISTS idx_cookie_consents_consent_given 
ON cookie_consents(consent_given);
