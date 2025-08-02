import { DuffelOffer, DuffelSegment, DuffelSlice } from "@/lib/duffel";

export interface FlightDisplayData {
  airlineName: string;
  airlineCode: string;
  airlineLogo: string;
  flightNumber: string;
  aircraft: string;
  origin: {
    code: string;
    city: string;
    name: string;
  };
  destination: {
    code: string;
    city: string;
    name: string;
  };
  departureTime: string;
  arrivalTime: string;
  duration: string;
  stops: number;
  stopDetails: string;
  cabin: string;
  date: string;
}

export interface BaggageInfo {
  included: {
    carryOn: string;
    checked: string;
  };
  available: Array<{
    type: string;
    price: string;
    description: string;
  }>;
}

export interface RefundPolicy {
  refundable: boolean;
  changeable: boolean;
  details: string;
  deadlines: {
    refund?: string;
    change?: string;
  };
}

export function extractFlightData(slice: DuffelSlice, sliceIndex: number = 0): FlightDisplayData {
  const firstSegment = slice.segments[0];
  const lastSegment = slice.segments[slice.segments.length - 1];
  
  // Extract carrier information
  const carrier = (firstSegment as any)?.operating_carrier || 
                  (firstSegment as any)?.marketing_carrier || 
                  (firstSegment as any)?.airline || {};
  
  // Format time helper
  const formatTime = (dateTime: string) => {
    try {
      return new Date(dateTime).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    } catch {
      return 'N/A';
    }
  };

  // Format date helper
  const formatDate = (dateTime: string) => {
    try {
      return new Date(dateTime).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'N/A';
    }
  };

  // Calculate stops and details
  const stops = slice.segments.length - 1;
  let stopDetails = 'Nonstop';
  
  if (stops === 1) {
    const stopAirport = firstSegment.destination?.iata_code || '';
    stopDetails = `1 stop in ${stopAirport}`;
  } else if (stops > 1) {
    stopDetails = `${stops} stops`;
  }

  return {
    airlineName: carrier.name || 'Unknown Airline',
    airlineCode: carrier.iata_code || 'XX',
    airlineLogo: carrier.logo_symbol_url || '',
    flightNumber: (firstSegment as any)?.flight_number || `${carrier.iata_code || 'XX'}${Math.floor(Math.random() * 9999)}`,
    aircraft: (firstSegment as any)?.aircraft?.name || 'Aircraft TBD',
    origin: {
      code: firstSegment.origin?.iata_code || '',
      city: firstSegment.origin?.city_name || '',
      name: firstSegment.origin?.name || ''
    },
    destination: {
      code: lastSegment.destination?.iata_code || '',
      city: lastSegment.destination?.city_name || '',
      name: lastSegment.destination?.name || ''
    },
    departureTime: formatTime(firstSegment.departing_at),
    arrivalTime: formatTime(lastSegment.arriving_at),
    duration: formatDuration(slice.duration),
    stops,
    stopDetails,
    cabin: (firstSegment as any)?.passenger_fare_details?.[0]?.cabin_class_marketing_name || 'Economy',
    date: formatDate(firstSegment.departing_at)
  };
}

export function extractBaggageInfo(offer: DuffelOffer): BaggageInfo {
  const firstSegment = offer.slices[0]?.segments[0];
  const baggage = (firstSegment as any)?.baggage || {};
  
  return {
    included: {
      carryOn: "1 personal item + 1 carry-on bag",
      checked: baggage.quantity ? `${baggage.quantity} checked bag${baggage.quantity > 1 ? 's' : ''}` : "Not included"
    },
    available: [
      { type: "Extra Checked Bag", price: "$35", description: "Up to 50 lbs" },
      { type: "Overweight Bag", price: "$100", description: "51-70 lbs" },
      { type: "Oversized Bag", price: "$150", description: "Over 62 inches" }
    ]
  };
}

export function extractRefundPolicy(offer: DuffelOffer): RefundPolicy {
  const conditions = (offer as any)?.conditions || {};
  
  return {
    refundable: conditions.refundable || false,
    changeable: conditions.changeable !== false, // Default to true unless explicitly false
    details: conditions.refundable 
      ? "Fully refundable within 24 hours of booking"
      : "Non-refundable. Changes may be permitted with fees.",
    deadlines: {
      refund: conditions.refundable ? "24 hours" : undefined,
      change: "Up to 2 hours before departure"
    }
  };
}

export function formatDuration(duration: string): string {
  if (!duration) return 'N/A';
  
  try {
    // Parse ISO 8601 duration (PT2H30M)
    const matches = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
    if (!matches) return duration;
    
    const hours = parseInt(matches[1] || '0');
    const minutes = parseInt(matches[2] || '0');
    
    if (hours && minutes) {
      return `${hours}h ${minutes}m`;
    } else if (hours) {
      return `${hours}h`;
    } else if (minutes) {
      return `${minutes}m`;
    }
    
    return duration;
  } catch {
    return duration;
  }
}

export function formatPrice(amount: string, currency: string = 'USD'): string {
  try {
    const num = parseFloat(amount);
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(num);
  } catch {
    return `${currency} ${amount}`;
  }
}

export function getAirlineLogo(airlineCode: string): string {
  // Fallback CDN URL pattern for airline logos
  return `https://images.kiwi.com/airlines/64x64/${airlineCode}.png`;
}
