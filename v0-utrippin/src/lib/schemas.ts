// src/lib/schemas.ts

import { z } from 'zod';

// Legacy schemas for backward compatibility
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

// New comprehensive schema for Phase 1
const BookingItemSchema = z.object({
  name: z.string(),
  price: z.string(),
  rating: z.number().optional(),
  imageUrl: z.string().optional(),
  bookingLink: z.string(),
  agentUrl: z.string().optional(),
  amenities: z.array(z.string()).optional(),
  description: z.string().optional()
});

const BookingModuleSchema = z.object({
  title: z.string(),
  items: z.array(BookingItemSchema),
  defaultUrl: z.string().optional()
});

const EventSchema = z.object({
  time: z.string(),
  title: z.string(),
  description: z.string().optional(),
  type: z.enum(['activity', 'transport', 'dining', 'accommodation']),
  location: z.string().optional(),
  cost: z.string().optional(),
  imageUrl: z.string().optional(),
  bookingUrl: z.string().optional()
});

const DayPlanSchema = z.object({
  day: z.string(),
  date: z.string(),
  title: z.string(),
  events: z.array(EventSchema),
  totalEstimatedCost: z.string().optional(),
  niceToKnow: z.object({
    freeThingsToDo: z.array(z.string()),
    walkability: z.string(),
    transportation: z.string(),
    foodOptions: z.object({
      budget: z.string(),
      splurge: z.string()
    }),
    mallOptions: z.array(z.string()),
    kidsActivities: z.array(z.string()),
    nightlife: z.array(z.string()),
    bestBreakfast: z.string(),
    beaches: z.array(z.string()),
    bestCoffeeShop: z.string(),
    drugStores: z.array(z.string()),
    tours: z.array(z.string()),
    parks: z.array(z.string()),
    fishingSpots: z.array(z.string()),
    horsebackRiding: z.string(),
    sportingEvents: z.string(),
    groceryStores: z.array(z.string()),
    scenicRoutes: z.string(),
    hospital: z.string(),
    nailSalon: z.string()
  }).optional()
});

const CultureTipSchema = z.object({
  category: z.string(),
  title: z.string(),
  content: z.string()
});

const CategoryRecommendationSchema = z.object({
  category: z.string(),
  title: z.string(),
  items: z.array(z.object({
    name: z.string(),
    description: z.string(),
    imageUrl: z.string().optional(),
    location: z.string().optional(),
    cost: z.string().optional()
  }))
});

const CustomizationCallToActionSchema = z.object({
  title: z.string(),
  message: z.string(),
  quickReplies: z.array(z.string())
});

export const ComprehensiveItinerarySchema = z.object({
  itineraryId: z.string(),
  tripTitle: z.string(),
  destinationCity: z.string(),
  destinationCountry: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  numberOfTravelers: z.number(),
  travelStyle: z.string(),
  introductoryMessage: z.string(),
  imageCollageUrls: z.array(z.string()).min(3).max(6),
  bookingModules: z.object({
    flights: BookingModuleSchema,
    accommodations: BookingModuleSchema
  }),
  dailyPlan: z.array(DayPlanSchema).min(1),
  additionalInfo: z.object({
    cultureAdapter: z.array(CultureTipSchema),
    categoryBasedRecommendations: z.array(CategoryRecommendationSchema)
  }),
  utility: z.object({
    sources: z.array(z.string()),
    downloadPdfLink: z.string().optional()
  }),
  customizationCallToAction: CustomizationCallToActionSchema.optional()
});

export type DetailedItinerary = z.infer<typeof MultiItinerarySchema>;
export type ComprehensiveItinerary = z.infer<typeof ComprehensiveItinerarySchema>;
export type BookingModule = z.infer<typeof BookingModuleSchema>;
export type DayPlan = z.infer<typeof DayPlanSchema>;
export type Event = z.infer<typeof EventSchema>;
export type CultureTip = z.infer<typeof CultureTipSchema>;
export type CategoryRecommendation = z.infer<typeof CategoryRecommendationSchema>;
export type CustomizationCallToAction = z.infer<typeof CustomizationCallToActionSchema>;
