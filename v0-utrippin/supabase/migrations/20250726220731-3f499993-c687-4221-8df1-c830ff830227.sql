-- Phase 2: Add agent affiliate IDs to users table for hotel/car booking URLs
ALTER TABLE public.users 
ADD COLUMN booking_affiliate_id text,
ADD COLUMN expedia_affiliate_id text,
ADD COLUMN hotels_affiliate_id text,
ADD COLUMN kayak_affiliate_id text,
ADD COLUMN priceline_affiliate_id text;
