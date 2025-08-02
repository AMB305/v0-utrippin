import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useDestinationImages } from './useDestinationImages';

interface TripPackage {
  destination: string;
  name: string;
  type: string;
  summary: string;
  budget: number;
  costPerPerson?: number;
  groupSize?: number;
  imageUrl?: string;
  highlights?: string[];
  duration: string;
  flightsLink: string;
  hotelsLink: string;
  carsLink: string;
  detailedItinerary?: any;
  costBreakdown?: {
    flights: number;
    hotels: number;
    food: number;
    activities: number;
    transportation: number;
  };
}

interface BudgetTripResponse {
  trips: TripPackage[];
  provider: string;
  query: string;
  budget: number;
  groupSize: number;
  tripType: string;
}

export const useBudgetTripPlanner = () => {
  const { fetchDestinationImage } = useDestinationImages();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [trips, setTrips] = useState<TripPackage[]>([]);
  const [loadingStage, setLoadingStage] = useState<string>('');

  const generateBudgetTrips = useCallback(async (
    budget: number,
    groupSize: number,
    tripType: 'staycation' | 'vacation',
    zipCode?: string
  ): Promise<TripPackage[]> => {
    setLoading(true);
    setError(null);
    setLoadingStage(`Planning your ${tripType === 'staycation' ? 'Staycation' : 'Vacation'}`);

    try {
      console.log(`Generating ${tripType} trips for ${groupSize} people with budget $${budget}`);

      setLoadingStage('Generating trip ideas...');
      const { data, error: supabaseError } = await supabase.functions.invoke('budget-trip-planner', {
        body: { 
          budget,
          groupSize,
          tripType,
          zipCode
        }
      });

      if (supabaseError) {
        console.error('Supabase function error:', supabaseError);
        throw new Error(supabaseError.message);
      }

      if (data?.error) {
        console.error('Function returned error:', data.error);
        // Still use the fallback trips if there's an error
        if (data.trips && data.trips.length > 0) {
          console.log(`Got ${data.trips.length} fallback trips`);
          setTrips(data.trips);
          return data.trips;
        }
        throw new Error(data.error);
      }

      console.log(`Generated ${data.trips?.length || 0} trips using ${data.provider}`);
      let generatedTrips = data.trips || [];
      
      setLoadingStage('Finding destination images...');
      // Fetch images for each trip
      generatedTrips = await Promise.all(
        generatedTrips.map(async (trip: TripPackage) => {
          try {
            const imageUrl = await fetchDestinationImage(trip.destination);
            return { ...trip, imageUrl };
          } catch (error) {
            console.error('Failed to fetch image for', trip.destination, error);
            return trip;
          }
        })
      );
      
      setLoadingStage('Finalizing recommendations...');
      
      setTrips(generatedTrips);
      
      return generatedTrips;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate budget trips';
      setError(errorMessage);
      console.error('Error generating budget trips:', err);
      
      // Return fallback trips
      const fallbackTrips = generateFallbackTrips(budget, groupSize, tripType, zipCode);
      setTrips(fallbackTrips);
      return fallbackTrips;
    } finally {
      setLoading(false);
      setLoadingStage('');
    }
  }, [fetchDestinationImage]);

  const generateFallbackTrips = (budget: number, groupSize: number, tripType: string, zipCode?: string): TripPackage[] => {
    const destinations = tripType === 'staycation' 
      ? ['Local City Exploration', 'Nearby National Parks', 'Regional Wine Country', 'Coastal Day Trips', 'Mountain Retreats', 'Historic Districts']
      : ['Lisbon, Portugal', 'Prague, Czech Republic', 'Bali, Indonesia', 'Costa Rica', 'Vietnam', 'Thailand', 'Mexico City', 'Morocco', 'Greece', 'Turkey', 'Philippines', 'Colombia'];

    return destinations.map((destination, index) => ({
      destination,
      name: `${destination} ${tripType === 'staycation' ? 'Staycation' : 'Adventure'} Package`,
      type: tripType,
      summary: `Complete ${tripType} package for ${groupSize} people including accommodations, meals, and activities within your $${budget} budget.`,
      budget: budget,
      costPerPerson: Math.round(budget / groupSize),
      groupSize: groupSize,
      highlights: [
        'Curated local experiences',
        'Comfortable accommodations',
        'Delicious local cuisine',
        'Professional guided tours',
        'Cultural immersion activities'
      ],
      duration: '7 days',
      flightsLink: `https://utrippin.com/flights?destination=${encodeURIComponent(destination)}`,
      hotelsLink: `https://utrippin.com/hotels?destination=${encodeURIComponent(destination)}`,
      carsLink: `https://utrippin.com/cars?location=${encodeURIComponent(destination)}`
    }));
  };

  return { 
    generateBudgetTrips, 
    loading, 
    error, 
    trips,
    loadingStage,
    setTrips: (newTrips: TripPackage[]) => setTrips(newTrips)
  };
};
