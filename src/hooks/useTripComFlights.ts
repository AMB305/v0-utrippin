import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface TripComFlight {
  origin: string;
  destination: string;
  departDate: string;
  returnDate: string;
  passengers: string;
  departTime: string;
  returnTime: string;
  price: string;
}

export function useTripComFlights(
  origin: string,
  destination: string,
  departDate: string,
  returnDate: string,
  passengers: string
) {
  const [tripComFlights, setTripComFlights] = useState<TripComFlight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!origin || !destination || !departDate || !returnDate || !passengers) {
      setLoading(false);
      return;
    }

    setLoading(true);
    supabase.functions.invoke('tripcom-flights-dynamic', {
      body: { origin, destination, departDate, returnDate, passengers }
    })
      .then(({ data, error }) => {
        if (error) {
          console.error('Trip.com flights error:', error);
          setTripComFlights([]);
        } else {
          setTripComFlights(data || []);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Trip.com flights fetch error:', err);
        setTripComFlights([]);
        setLoading(false);
      });
  }, [origin, destination, departDate, returnDate, passengers]);

  return { tripComFlights, loading };
}