// CREATE THIS NEW FILE: src/lib/schemas.ts

import { z } from 'zod';

// This is the single source of truth for a day's plan.
const DaySchema = z.object({
  day: z.string().min(1, "Day title is required."),
  title: z.string().min(1, "Day title is required."),
  activities: z.array(z.string().min(10, "Activity description must be meaningful.")).min(1, "Each day must have at least one activity.")
});

// This is the Golden Schema for a valid, detailed itinerary.
export const DetailedItinerarySchema = z.object({
  destination: z.string().min(1, "Destination is required."),
  overview: z.object({
    title: z.string().min(1, "Overview title is required."),
    summary: z.string().min(50, "Summary must be at least 50 characters long and not be a generic question.")
  }),
  days: z.array(DaySchema).min(1, "Itinerary must have at least one day."),
  culture_tips: z.record(z.string()).optional(),
  actionable_suggestions: z.array(z.string()).optional()
});

// This is the schema for a simple fallback response.
export const SimpleResponseSchema = z.object({
  response: z.string().min(1),
  quickReplies: z.array(z.string()).optional()
});

// This allows us to use the schema as a TypeScript type in our components.
export type DetailedItinerary = z.infer<typeof DetailedItinerarySchema>;
