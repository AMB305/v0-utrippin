import { useState, useEffect } from 'react';
import { DuffelClient, DuffelOfferRequest } from '@/lib/duffel';
import { getTripComFlights } from '@/lib/tripComClient';

interface UnifiedFlight {
  origin: string;
  destination: string;
  departTime: string;
  departDate: string;
  returnTime: string;
  returnDate: string;
  passengers: string;
  price: string;
  source: 'Duffel' | 'Trip.com';
  offerId?: string;
  deepLink?: string;
}

interface FlightSearchParams {
  origin: string;
  destination: string;
  departDate: string;
  returnDate: string;
  passengers: string;
}

export function useTripsFlights(searchParams: FlightSearchParams) {
  const [flights, setFlights] = useState<UnifiedFlight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!searchParams.origin || !searchParams.destination || !searchParams.departDate || !searchParams.returnDate) {
      setLoading(false);
      return;
    }

    const loadFlights = async () => {
      setLoading(true);
      
      try {
        // Load Duffel flights
        const duffelClient = new DuffelClient();
        const offerRequest: DuffelOfferRequest = {
          slices: [
            {
              origin: searchParams.origin,
              destination: searchParams.destination,
              departure_date: searchParams.departDate
            },
            ...(searchParams.returnDate ? [{
              origin: searchParams.destination,
              destination: searchParams.origin,
              departure_date: searchParams.returnDate
            }] : [])
          ],
          passengers: [{ type: 'adult' as const }], // Simplified for now
          cabin_class: 'economy' as const
        };

        const duffelResponse = await duffelClient.createOfferRequest(offerRequest);
        const duffelFlights = duffelResponse.data.map(offer => ({
          origin: searchParams.origin,
          destination: searchParams.destination,
          departTime: new Date(offer.slices[0]?.segments[0]?.departing_at || '').toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
          }),
          departDate: searchParams.departDate,
          returnTime: offer.slices[1] ? new Date(offer.slices[1].segments[0]?.departing_at || '').toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
          }) : '',
          returnDate: searchParams.returnDate,
          passengers: searchParams.passengers,
          price: offer.total_amount,
          source: 'Duffel' as const,
          offerId: offer.id
        }));

        // Load Trip.com flights
        const tripComFlights = await getTripComFlights({
          origin: searchParams.origin,
          destination: searchParams.destination,
          departDate: searchParams.departDate,
          returnDate: searchParams.returnDate,
          passengers: searchParams.passengers
        });

        // Combine and sort by price
        const combinedFlights = [...duffelFlights, ...tripComFlights].sort((a, b) => 
          parseFloat(a.price) - parseFloat(b.price)
        );

        setFlights(combinedFlights);
      } catch (error) {
        console.error('Error loading flights:', error);
        setFlights([]);
      } finally {
        setLoading(false);
      }
    };

    loadFlights();
  }, [searchParams.origin, searchParams.destination, searchParams.departDate, searchParams.returnDate, searchParams.passengers]);

  return { flights, loading };
}