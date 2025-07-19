import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface TripComCar {
  location: string;
  pickup: string;
  dropoff: string;
  carType: string;
  price: string;
  currency: string;
}

export function useTripComCars(
  location: string,
  pickup: string,
  dropoff: string
) {
  const [tripComCars, setTripComCars] = useState<TripComCar[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!location || !pickup || !dropoff) {
      setLoading(false);
      return;
    }

    setLoading(true);
    supabase.functions.invoke('tripcom-cars', {
      body: { location, pickup, dropoff }
    })
      .then(({ data, error }) => {
        if (error) {
          console.error('Trip.com cars error:', error);
          setTripComCars([]);
        } else {
          setTripComCars(data || []);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Trip.com cars fetch error:', err);
        setTripComCars([]);
        setLoading(false);
      });
  }, [location, pickup, dropoff]);

  return { tripComCars, loading };
}