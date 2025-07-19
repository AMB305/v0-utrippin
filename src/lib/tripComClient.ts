import { supabase } from "@/integrations/supabase/client";

export async function getTripComFlights(searchParams: {
  origin: string;
  destination: string;
  departDate: string;
  returnDate: string;
  passengers: string;
}) {
  try {
    const { data, error } = await supabase.functions.invoke('tripcom-flights-dynamic', {
      body: searchParams
    });

    if (error) {
      console.error('Trip.com flights error:', error);
      return [];
    }

    // Normalize Trip.com flights to standard format
    return (data || []).map((flight: any) => ({
      origin: flight.origin,
      destination: flight.destination,
      departTime: flight.departTime,
      departDate: flight.departDate,
      returnTime: flight.returnTime,
      returnDate: flight.returnDate,
      passengers: flight.passengers,
      price: flight.price,
      deepLink: `https://www.aviasales.com/search/${flight.origin}${formatDateForLink(flight.departDate)}${flight.destination}${formatDateForLink(flight.returnDate)}${flight.passengers}?marker=650105`,
      source: 'Trip.com'
    }));
  } catch (err) {
    console.error('Failed to load Trip.com flights', err);
    return [];
  }
}

function formatDateForLink(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit" }).replace(/\//g, "");
}