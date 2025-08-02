-- Add agent affiliate tracking columns to users table
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS expedia_affiliate_id TEXT,
ADD COLUMN IF NOT EXISTS booking_affiliate_id TEXT,
ADD COLUMN IF NOT EXISTS agoda_affiliate_id TEXT;
