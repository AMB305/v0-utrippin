import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface TripComHotel {
  city: string;
  checkIn: string;
  checkOut: string;
  guests: string;
  hotelName: string;
  price: string;
  currency: string;
}

export function useTripComHotels(
  destination: string,
  checkIn: string,
  checkOut: string,
  guests: string
) {
  const [tripComHotels, setTripComHotels] = useState<TripComHotel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!destination || !checkIn || !checkOut || !guests) {
      setLoading(false);
      return;
    }

    setLoading(true);
    supabase.functions.invoke('tripcom-hotels', {
      body: { destination, checkIn, checkOut, guests }
    })
      .then(({ data, error }) => {
        if (error) {
          console.error('Trip.com hotels error:', error);
          setTripComHotels([]);
        } else {
          setTripComHotels(data || []);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Trip.com hotels fetch error:', err);
        setTripComHotels([]);
        setLoading(false);
      });
  }, [destination, checkIn, checkOut, guests]);

  return { tripComHotels, loading };
}