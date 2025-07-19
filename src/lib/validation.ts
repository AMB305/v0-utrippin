import { z } from 'zod';

// Security validation schemas
const blockedDomains = ['test.com', 'example.com', 'domain.com', 'fake.com', 'invalid.com'];

export const emailSchema = z.string()
  .email('Invalid email format')
  .min(1, 'Email is required')
  .refine((email) => {
    const domain = email.split('@')[1]?.toLowerCase();
    return !blockedDomains.includes(domain);
  }, 'Please use a valid email address');
export const passwordSchema = z.string().min(8, 'Password must be at least 8 characters').max(128, 'Password too long');
export const usernameSchema = z.string().min(2, 'Username must be at least 2 characters').max(50, 'Username too long').regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens');

// Flight search validation - simplified for compatibility
export const passengerCountSchema = z.object({
  adults: z.number().int().min(1, 'At least 1 adult required').max(9, 'Maximum 9 adults allowed'),
  children: z.number().int().min(0).max(8, 'Maximum 8 children allowed'),
  infants: z.number().int().min(0).max(4, 'Maximum 4 infants allowed')
});

export const flightSearchSchema = z.object({
  origin: z.array(z.any()).min(1, 'Origin airport required'),
  destination: z.array(z.any()).min(1, 'Destination airport required'),
  departureDate: z.date().min(new Date(), 'Departure date must be in the future'),
  returnDate: z.date().optional(),
  passengers: passengerCountSchema,
  tripType: z.enum(['round-trip', 'one-way']),
  cabinClass: z.enum(['economy', 'premium_economy', 'business', 'first']),
  directFlightsOnly: z.boolean()
}).refine((data) => {
  if (data.tripType === 'round-trip' && data.returnDate) {
    return data.returnDate > data.departureDate;
  }
  return true;
}, { message: 'Return date must be after departure date', path: ['returnDate'] });

// User profile validation
export const userProfileSchema = z.object({
  email: emailSchema,
  bio: z.string().max(500, 'Bio too long').optional(),
  age: z.number().int().min(18, 'Must be at least 18 years old').max(120, 'Invalid age').optional(),
  location: z.string().max(100, 'Location too long').optional(),
  interests: z.array(z.string().max(50)).max(20, 'Too many interests').optional(),
  travel_style: z.string().max(50, 'Travel style too long').optional(),
  preferred_destinations: z.array(z.string().max(100)).max(50, 'Too many destinations').optional(),
  languages_spoken: z.array(z.string().max(50)).max(20, 'Too many languages').optional()
});

// Trip validation
export const tripSchema = z.object({
  title: z.string().min(1, 'Title required').max(200, 'Title too long'),
  destination: z.string().min(1, 'Destination required').max(200, 'Destination too long'),
  country: z.string().max(100, 'Country name too long').optional(),
  start_date: z.date().min(new Date(), 'Start date must be in the future').optional(),
  end_date: z.date().optional(),
  budget: z.number().min(0, 'Budget cannot be negative').max(1000000, 'Budget too high').optional(),
  currency: z.string().length(3, 'Invalid currency code').optional(),
  trip_type: z.string().max(50, 'Trip type too long').optional(),
  ai_prompt: z.string().max(1000, 'Prompt too long').optional(),
  max_buddies: z.number().int().min(1).max(10, 'Maximum 10 buddies allowed').optional()
}).refine((data) => {
  if (data.start_date && data.end_date) {
    return data.end_date > data.start_date;
  }
  return true;
}, { message: 'End date must be after start date', path: ['end_date'] });

// Buddy request validation
export const buddyRequestSchema = z.object({
  to_user_id: z.string().uuid('Invalid user ID'),
  trip_id: z.string().uuid('Invalid trip ID').optional(),
  message: z.string().max(500, 'Message too long').optional()
});

// Booking validation
export const bookingSchema = z.object({
  total_price: z.number().min(0, 'Price cannot be negative').max(100000, 'Price too high'),
  type: z.enum(['flight', 'hotel', 'car', 'package']),
  details: z.record(z.any()).optional(),
  payment_method: z.string().max(50, 'Payment method too long').optional()
});

// Input sanitization helpers
export function sanitizeString(input: string): string {
  if (typeof input !== 'string') return '';
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/[\x00-\x1F\x7F]/g, ''); // Remove control characters
}

export function sanitizeHtml(input: string): string {
  if (typeof input !== 'string') return '';
  return input
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .trim();
}

// Rate limiting helpers
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(identifier: string, maxRequests: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(identifier);
  
  if (!entry || now > entry.resetTime) {
    rateLimitStore.set(identifier, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (entry.count >= maxRequests) {
    return false;
  }
  
  entry.count++;
  return true;
}

// Security headers helper
export function getSecurityHeaders() {
  return {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:; frame-ancestors 'none';",
  };
}