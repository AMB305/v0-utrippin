// src/lib/schemas.ts

import { z } from 'zod';

const DaySchema = z.object({
  day: z.string(),
  title: z.string(),
  activities: z.array(z.string())
});

const ItineraryOptionSchema = z.object({
  title: z.string(), // e.g., "The Budget Saver"
  estimated_cost: z.string(),
  summary: z.string(),
  days: z.array(DaySchema).min(1),
});

export const MultiItinerarySchema = z.object({
  destination: z.string(),
  overview_summary: z.string(),
  options: z.array(ItineraryOptionSchema).length(3)
});

export type DetailedItinerary = z.infer<typeof MultiItinerarySchema>;