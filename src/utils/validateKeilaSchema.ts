import { z } from 'zod';

export const keilaSchema = z.object({
  destination: z.string(),
  dates: z.object({
    start: z.string(),
    end: z.string()
  }),
  travelers: z.object({
    count: z.number(),
    rooms: z.number(),
    isFamilyTrip: z.boolean().optional()
  }),
  overview: z.object({
    title: z.string(),
    summary: z.string()
  }),
  themes: z.array(z.string()),
  images: z.array(z.string()),
  transportation: z.object({
    arrival: z.string(),
    local: z.array(z.string()),
    walkabilityScore: z.number()
  }),
  flights: z.array(z.object({
    airline: z.string(),
    from: z.string(),
    to: z.string(),
    duration: z.string(),
    price: z.string(),
    departure: z.string(),
    arrival: z.string()
  })),
  hotels: z.array(z.object({
    name: z.string(),
    pricePerNight: z.string(),
    rating: z.string(),
    location: z.string(),
    amenities: z.array(z.string()),
    link: z.string()
  })),
  days: z.array(z.object({
    day: z.string(),
    date: z.string(),
    title: z.string(),
    costEstimate: z.string(),
    morning: z.array(z.string()),
    afternoon: z.array(z.string()),
    evening: z.array(z.string())
  })),
  culture_tips: z.record(z.string()),
  sources: z.array(z.string()),
  buttons: z.array(z.string())
});

export function validateKeilaSchema(data: any) {
  const result = keilaSchema.safeParse(data);
  return {
    valid: result.success,
    errors: result.success ? [] : result.error.issues.map((e: any) => `${e.path.join('.')} - ${e.message}`)
  };
}