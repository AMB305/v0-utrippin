import { DuffelOffer } from "@/lib/duffel";

export interface GroupedFlight {
  key: string;
  slices: any[];
  offers: DuffelOffer[];
  baseOffer: DuffelOffer; // The cheapest offer for display
  lowestPrice: number;
  highestPrice: number;
}

/**
 * Creates a unique key for grouping flights based on route and timing
 */
function createFlightKey(offer: DuffelOffer): string {
  const outbound = offer.slices[0];
  
  // Add safety checks for undefined properties
  if (!outbound || !outbound.segments || outbound.segments.length === 0) {
    console.warn('Invalid offer structure:', offer);
    return `invalid-${offer.id}`;
  }
  
  const segments = outbound.segments;
  const firstSegment = segments[0];
  
  // Safety checks for required properties
  if (!firstSegment || !firstSegment.departing_at || !firstSegment.airline) {
    console.warn('Invalid segment structure:', firstSegment);
    return `invalid-segment-${offer.id}`;
  }
  
  // Use segment origin/destination as fallback if slice origin/destination is undefined
  const originCode = outbound.origin?.iata_code || firstSegment.origin?.iata_code || 'UNK';
  const destinationCode = outbound.destination?.iata_code || segments[segments.length - 1]?.destination?.iata_code || 'UNK';
  
  // Try to get airline code - use same logic as mapOfferToDisplayCard  
  const carrier = (firstSegment as any)?.operating_carrier || (firstSegment as any)?.marketing_carrier || (firstSegment as any)?.airline || {};
  const airlineCode = carrier.iata_code || 'UNK';
  
  // Create key based on: origin-destination-date-departure_time-airline-stops
  const key = [
    originCode,
    destinationCode,
    firstSegment.departing_at.split('T')[0], // Date only
    firstSegment.departing_at.split('T')[1].split(':')[0], // Hour only for grouping
    airlineCode,
    segments.length // Number of segments (indicates stops)
  ].join('-');
  
  return key;
}

/**
 * Groups Duffel offers by flight characteristics to show multiple branded fares
 */
export function groupOffersByFlight(offers: DuffelOffer[]): GroupedFlight[] {
  if (!offers || offers.length === 0) {
    return [];
  }
  
  const groups: { [key: string]: DuffelOffer[] } = {};
  
  // Group offers by flight key
  offers.forEach(offer => {
    try {
      const key = createFlightKey(offer);
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(offer);
    } catch (error) {
      console.warn('Error creating flight key for offer:', offer, error);
      // Skip this offer if we can't create a key
    }
  });
  
  // Convert groups to GroupedFlight objects
  return Object.entries(groups).map(([key, groupOffers]) => {
    // Sort offers by price (cheapest first)
    const sortedOffers = groupOffers.sort((a, b) => 
      parseFloat(a.total_amount) - parseFloat(b.total_amount)
    );
    
    const baseOffer = sortedOffers[0]; // Cheapest offer as base
    const prices = sortedOffers.map(offer => parseFloat(offer.total_amount));
    
    return {
      key,
      slices: baseOffer.slices,
      offers: sortedOffers,
      baseOffer,
      lowestPrice: Math.min(...prices),
      highestPrice: Math.max(...prices)
    };
  }).sort((a, b) => a.lowestPrice - b.lowestPrice); // Sort groups by lowest price
}

/**
 * Filters offers based on various criteria
 */
export interface FilterCriteria {
  priceRange: [number, number];
  airlines: string[];
  stops: string[];
  cabinTypes: string[];
  departureTimeRanges: string[];
  arrivalTimeRanges: string[];
  maxDuration: number; // in hours
}

export function filterOffers(offers: DuffelOffer[], filters: FilterCriteria): DuffelOffer[] {
  if (!offers || offers.length === 0) {
    return [];
  }
  
  return offers.filter(offer => {
    try {
      // Safety checks
      if (!offer || !offer.slices || offer.slices.length === 0) {
        return false;
      }
      
      const firstSlice = offer.slices[0];
      if (!firstSlice || !firstSlice.segments || firstSlice.segments.length === 0) {
        return false;
      }
      
      const firstSegment = firstSlice.segments[0];
      const lastSegment = offer.slices[offer.slices.length - 1].segments[offer.slices[offer.slices.length - 1].segments.length - 1];
      
      if (!firstSegment || !lastSegment) {
        return false;
      }
      
      const price = parseFloat(offer.total_amount);
      
      // Get airline name for filtering - use same logic as mapOfferToDisplayCard
      const carrier = (firstSegment as any)?.operating_carrier || (firstSegment as any)?.marketing_carrier || (firstSegment as any)?.airline || {};
      const airline = carrier.name || 'Unknown';
      
      const stops = firstSlice.segments.length - 1;
      const cabin = offer.cabin_class || 'Economy';
      
      // Duration parsing (PT6H30M format)
      const durationStr = firstSlice.duration;
      const durationHours = parseDuration(durationStr);
      
      // Departure time
      const departureTime = new Date(firstSegment.departing_at);
      const departureHour = departureTime.getHours();
      
      // Arrival time  
      const arrivalTime = new Date(lastSegment.arriving_at);
      const arrivalHour = arrivalTime.getHours();
    
      // Apply filters
      return (
        // Price range
        price >= filters.priceRange[0] && price <= filters.priceRange[1] &&
        
        // Airlines
        (filters.airlines.length === 0 || filters.airlines.includes(airline)) &&
        
        // Stops
        (filters.stops.length === 0 || filters.stops.includes(getStopsLabel(stops))) &&
        
        // Cabin types
        (filters.cabinTypes.length === 0 || filters.cabinTypes.includes(cabin)) &&
        
        // Duration
        durationHours <= filters.maxDuration &&
        
        // Departure time ranges
        (filters.departureTimeRanges.length === 0 || filters.departureTimeRanges.some(range => 
          isTimeInRange(departureHour, range)
        )) &&
        
        // Arrival time ranges
        (filters.arrivalTimeRanges.length === 0 || filters.arrivalTimeRanges.some(range => 
          isTimeInRange(arrivalHour, range)
        ))
      );
    } catch (error) {
      console.warn('Error filtering offer:', offer, error);
      return false; // Exclude offers that cause errors
    }
  });
}

function parseDuration(duration: string): number {
  // Parse PT6H30M format
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
  if (!match) return 0;
  
  const hours = parseInt(match[1] || '0');
  const minutes = parseInt(match[2] || '0');
  
  return hours + (minutes / 60);
}

function getStopsLabel(stops: number): string {
  if (stops === 0) return 'Non-stop';
  if (stops === 1) return '1 stop';
  return '2+ stops';
}

function isTimeInRange(hour: number, timeRange: string): boolean {
  switch (timeRange) {
    case 'Morning (5-12)':
      return hour >= 5 && hour < 12;
    case 'Afternoon (12-6)':
      return hour >= 12 && hour < 18;
    case 'Evening (6-12)':
      return hour >= 18 || hour < 5;
    default:
      return true;
  }
}

/**
 * Gets unique values from offers for filter options
 */
export function getFilterOptions(offers: DuffelOffer[]) {
  if (!offers || offers.length === 0) {
    return {
      airlines: [],
      cabinTypes: [],
      priceRange: [0, 1000] as [number, number],
      maxDuration: 24
    };
  }
  
  const airlines = new Set<string>();
  const cabinTypes = new Set<string>();
  let minPrice = Infinity;
  let maxPrice = 0;
  let maxDuration = 0;
  
  offers.forEach(offer => {
    try {
      if (!offer || !offer.slices || offer.slices.length === 0) {
        return;
      }
      
      const firstSegment = offer.slices[0].segments?.[0];
      if (!firstSegment) {
        return;
      }
      const price = parseFloat(offer.total_amount);
      
      // Debug airline structure - log the first offer to see what's available
      if (offer === offers[0]) {
        console.log('🔍 First offer structure for debugging:', {
          offer: offer,
          firstSegment: firstSegment,
          airline: firstSegment.airline,
          airlineName: firstSegment.airline?.name,
          slices: offer.slices
        });
      }
      
      // Get airline name - use same logic as mapOfferToDisplayCard
      const carrier = (firstSegment as any)?.operating_carrier || (firstSegment as any)?.marketing_carrier || (firstSegment as any)?.airline || {};
      const airline = carrier.name || 'Unknown';
      
      const cabin = offer.cabin_class || 'Economy';
      const duration = parseDuration(offer.slices[0].duration);
      
      airlines.add(airline);
      cabinTypes.add(cabin);
      minPrice = Math.min(minPrice, price);
      maxPrice = Math.max(maxPrice, price);
      maxDuration = Math.max(maxDuration, Math.ceil(duration));
    } catch (error) {
      console.warn('Error processing offer for filter options:', offer, error);
    }
  });
  
  return {
    airlines: Array.from(airlines).sort(),
    cabinTypes: Array.from(cabinTypes).sort(),
    priceRange: [Math.floor(minPrice), Math.ceil(maxPrice)] as [number, number],
    maxDuration: maxDuration || 24
  };
}