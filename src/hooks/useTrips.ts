import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { buildHotelUrl, buildFlightUrl } from "@/utils/buildAffiliateUrl";

interface Trip {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  summary: string;
  flights_url: string;
  hotels_url: string;
  event_name: string;
  event_date: string;
  created_at: string;
  updated_at: string;
}

interface EnhancedTrip extends Trip {
  enhanced_flights_url: string;
  enhanced_hotels_url: string;
}

interface UseTripsOptions {
  budget?: number;
  limit?: number;
}

export const useTrips = (options: UseTripsOptions = {}) => {
  const [trips, setTrips] = useState<EnhancedTrip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        setLoading(true);
        setError(null);

        let query = supabase
          .from("ai_trips")
          .select("*");

        // Apply budget filter if provided
        if (options.budget) {
          query = query.lte("budget", options.budget);
        }

        query = query
          .order("start_date", { ascending: true })
          .limit(options.limit || 6);

        const { data, error } = await query;

        if (error) {
          console.error("Error fetching trips:", error);
          setError(error.message);
          toast({
            title: "Error loading trips",
            description: "Unable to load AI travel recommendations. Please try again.",
            variant: "destructive",
          });
          return;
        }

        if (data) {
          // Enhance trips with dynamic affiliate URLs
          const enhancedTrips: EnhancedTrip[] = data.map((trip) => ({
            ...trip,
            enhanced_flights_url: buildFlightUrl({
              origin: "user-location", // Will be dynamically determined
              destination: trip.name,
              departDate: trip.start_date,
              returnDate: trip.end_date,
              adults: 2
            }),
            enhanced_hotels_url: buildHotelUrl({
              destination: trip.name,
              startDate: trip.start_date,
              endDate: trip.end_date,
              rooms: 1,
              adults: 2
            })
          }));
          setTrips(enhancedTrips);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
        setError("An unexpected error occurred");
        toast({
          title: "Error",
          description: "An unexpected error occurred while loading trips.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, [options.budget, options.limit, toast]);

  return { trips, loading, error };
};
