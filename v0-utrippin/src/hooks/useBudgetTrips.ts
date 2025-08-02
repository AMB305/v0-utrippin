import { useState, useEffect } from 'react';

interface BudgetTrip {
  id: string;
  destination: string;
  summary: string;
  totalCost: number;
  duration: number;
  activities: string[];
  images: string[];
}

export function useBudgetTrips(budget: number, groupSize: number) {
  const [trips, setTrips] = useState<BudgetTrip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTrips() {
      setLoading(true);
      
      // Mock data for demo purposes
      // In a real app, this would call your API or edge function
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      
      const mockTrips: BudgetTrip[] = [
        {
          id: '1',
          destination: 'Barcelona, Spain',
          summary: 'Wine festivals, Gothic Quarter walks, and beachside tapas',
          totalCost: Math.floor(budget * 0.8),
          duration: 5,
          activities: ['Wine tasting', 'City tours', 'Beach relaxation'],
          images: ['https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=400']
        },
        {
          id: '2',
          destination: 'Prague, Czech Republic',
          summary: 'Medieval Christmas markets and traditional beer halls',
          totalCost: Math.floor(budget * 0.6),
          duration: 4,
          activities: ['Christmas markets', 'Castle tours', 'Beer tasting'],
          images: ['https://images.unsplash.com/photo-1541849546-216549ae216d?w=400']
        },
        {
          id: '3',
          destination: 'Tokyo, Japan',
          summary: 'Jazz clubs in Shinjuku and authentic ramen adventures',
          totalCost: Math.floor(budget * 0.9),
          duration: 7,
          activities: ['Jazz clubs', 'Food tours', 'Temple visits'],
          images: ['https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400']
        },
        {
          id: '4',
          destination: 'Santorini, Greece',
          summary: 'Sunset cruises and romantic cliffside dining',
          totalCost: Math.floor(budget * 0.75),
          duration: 6,
          activities: ['Sunset cruises', 'Wine tours', 'Beach hopping'],
          images: ['https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400']
        },
        {
          id: '5',
          destination: 'Reykjavik, Iceland',
          summary: 'Northern lights hunting and glacier jeep tours',
          totalCost: Math.floor(budget * 0.85),
          duration: 5,
          activities: ['Aurora hunting', 'Glacier tours', 'Hot springs'],
          images: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400']
        },
        {
          id: '6',
          destination: 'New Orleans, USA',
          summary: 'Jazz music, Creole cuisine, and historic French Quarter',
          totalCost: Math.floor(budget * 0.7),
          duration: 4,
          activities: ['Jazz tours', 'Food festivals', 'Historic walks'],
          images: ['https://images.unsplash.com/photo-1558929996-d1d98e2b76a8?w=400']
        }
      ];

      // Filter trips based on group size (adjust pricing)
      const adjustedTrips = mockTrips.map(trip => ({
        ...trip,
        totalCost: Math.floor(trip.totalCost * (1 + (groupSize - 1) * 0.3))
      })).filter(trip => trip.totalCost <= budget);

      setTrips(adjustedTrips);
      setLoading(false);
    }

    fetchTrips();
  }, [budget, groupSize]);

  return { trips, loading };
}
