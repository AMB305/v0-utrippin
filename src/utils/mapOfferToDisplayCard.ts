import { DuffelOffer } from "@/lib/duffel";

export interface DisplayFlightCard {
  airlineName: string;
  airlineLogo: string;
  departureAirport: string;
  arrivalAirport: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  stops: string;
  cabin: string;
  baggage: string;
  refundable: boolean;
  totalPrice: string;
  currency: string;
  // Round-trip specific fields
  returnDepartureTime?: string;
  returnArrivalTime?: string;
  returnDuration?: string;
  returnStops?: string;
  returnDepartureAirport?: string;
  returnArrivalAirport?: string;
}

export function mapOfferToDisplayCard(offer: DuffelOffer): DisplayFlightCard {
  const slice = offer?.slices?.[0];
  const segment = slice?.segments?.[0];

  // Airline details - check multiple possible carrier sources
  const carrier = (segment as any)?.operating_carrier || (segment as any)?.marketing_carrier || (segment as any)?.airline || {};
  const airlineName = carrier.name || "Unknown Airline";
  const airlineLogo = carrier.logo_symbol_url || "/img/default-airline.png";

  // Airports
  const departureAirport = segment?.origin?.iata_code || "";
  const arrivalAirport = segment?.destination?.iata_code || "";

  // Times
  const departureTime = segment?.departing_at ? formatTime(segment.departing_at) : "";
  const lastSegment = slice?.segments?.[slice.segments.length - 1];
  const arrivalTime = lastSegment?.arriving_at ? formatTime(lastSegment.arriving_at) : "";

  // Duration & stops
  const duration = slice?.duration || "";
  const stopsCount = (slice?.segments?.length || 1) - 1;
  const stops = stopsCount === 0 ? "Non-stop" : 
    stopsCount === 1 ? `1 stop in ${segment?.destination?.iata_code || ''}` :
    `${stopsCount} stops`;

  // Cabin & baggage
  const cabin = (segment as any)?.passenger_fare_details?.[0]?.cabin_class_marketing_name || 
    offer.cabin_class?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) || 
    "Economy";
  
  const baggage = (segment as any)?.baggage?.quantity ? 
    `${(segment as any).baggage.quantity} checked bag${(segment as any).baggage.quantity > 1 ? "s" : ""}` : 
    "Carry-on included";

  // Refundable
  const refundable = (offer as any)?.conditions?.refundable || false;

  // Price
  const totalPrice = offer.total_amount || "0";
  const currency = offer.total_currency || "USD";

  // Round-trip data (if exists)
  const returnSlice = offer?.slices?.[1];
  let returnData = {};
  
  if (returnSlice && returnSlice.segments) {
    const returnFirstSegment = returnSlice.segments[0];
    const returnLastSegment = returnSlice.segments[returnSlice.segments.length - 1];
    const returnStopsCount = (returnSlice.segments.length || 1) - 1;
    
    returnData = {
      returnDepartureTime: returnFirstSegment?.departing_at ? formatTime(returnFirstSegment.departing_at) : "",
      returnArrivalTime: returnLastSegment?.arriving_at ? formatTime(returnLastSegment.arriving_at) : "",
      returnDuration: returnSlice.duration || "",
      returnStops: returnStopsCount === 0 ? "Non-stop" : 
        returnStopsCount === 1 ? `1 stop in ${returnFirstSegment?.destination?.iata_code || ''}` :
        `${returnStopsCount} stops`,
      returnDepartureAirport: returnFirstSegment?.origin?.iata_code || "",
      returnArrivalAirport: returnLastSegment?.destination?.iata_code || ""
    };
  }

  return {
    airlineName,
    airlineLogo,
    departureAirport,
    arrivalAirport,
    departureTime,
    arrivalTime,
    duration,
    stops,
    cabin,
    baggage,
    refundable,
    totalPrice,
    currency,
    ...returnData
  };
}

function formatTime(dateTimeString: string): string {
  try {
    const date = new Date(dateTimeString);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  } catch (error) {
    console.error('Error formatting time:', error);
    return 'N/A';
  }
}