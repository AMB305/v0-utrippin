import { affiliateConfig } from '@/config/affiliateConfig.js';

/**
 * Build Expedia hotel booking URL with affiliate parameters
 * @param {Object} params - Booking parameters
 * @param {string} params.destination - Hotel destination (city name)
 * @param {string} [params.startDate] - Check-in date (YYYY-MM-DD format)
 * @param {string} [params.endDate] - Check-out date (YYYY-MM-DD format)
 * @param {number} [params.rooms] - Number of rooms (default: 1)
 * @param {number} [params.adults] - Number of adults (default: 2)
 * @param {number} [params.children] - Number of children (default: 0)
 * @returns {string} Complete Expedia URL with affiliate tracking
 */
export function buildHotelUrl({
  destination,
  startDate,
  endDate, 
  rooms = 1,
  adults = 2,
  children = 0
}) {
  const { expedia } = affiliateConfig;
  const baseUrl = `${expedia.baseUrl}/Hotel-Search`;
  
  // Direct link with inline affiliate params
  const params = new URLSearchParams({
    destination: destination,
    rooms: rooms.toString(),
    adults: adults.toString(),
    AID: '15754452',
    PID: '101486313',
    affcid: 'network.cj.101486313'
  });
  
  // Add optional parameters if provided
  if (startDate) {
    params.append('startDate', startDate);
  }
  
  if (endDate) {
    params.append('endDate', endDate);
  }
  
  if (children > 0) {
    params.append('children', children.toString());
  }

  return `${baseUrl}?${params.toString()}`;
}

/**
 * Build Expedia flight booking URL with affiliate parameters
 * @param {Object} params - Flight parameters
 * @param {string} params.origin - Departure city/airport
 * @param {string} params.destination - Arrival city/airport
 * @param {string} [params.departDate] - Departure date (YYYY-MM-DD)
 * @param {string} [params.returnDate] - Return date (YYYY-MM-DD) - omit for one-way
 * @param {number} [params.adults] - Number of adults (default: 1)
 * @returns {string} Complete Expedia flight URL with affiliate tracking
 */
export function buildFlightUrl({
  origin,
  destination,
  departDate,
  returnDate,
  adults = 1
}) {
  const { expedia } = affiliateConfig;
  const baseUrl = `${expedia.baseUrl}/Flights-Search`;
  
  if (returnDate) {
    // Round trip - direct link with inline affiliate params
    const params = new URLSearchParams({
      trip: 'roundtrip',
      leg1: `from:${origin},to:${destination},departure:${departDate}`,
      leg2: `from:${destination},to:${origin},departure:${returnDate}`,
      passengers: `adults:${adults}`,
      mode: 'search',
      AID: '15754452',
      PID: '101486313',
      affcid: 'network.cj.101486313'
    });
    return `${baseUrl}?${params.toString()}`;
  } else {
    // One way - direct link with inline affiliate params
    const params = new URLSearchParams({
      trip: 'oneway',
      leg1: `from:${origin},to:${destination},departure:${departDate}`,
      passengers: `adults:${adults}`,
      mode: 'search',
      AID: '15754452',
      PID: '101486313',
      affcid: 'network.cj.101486313'
    });
    return `${baseUrl}?${params.toString()}`;
  }
}

/**
 * Build Expedia car rental URL with affiliate parameters
 * @param {Object} params - Car rental parameters
 * @param {string} params.location - Pickup location
 * @param {string} [params.pickupDate] - Pickup date (YYYY-MM-DD)
 * @param {string} [params.dropoffDate] - Dropoff date (YYYY-MM-DD)
 * @returns {string} Complete Expedia car rental URL with affiliate tracking
 */
export function buildCarUrl({
  location,
  pickupDate,
  dropoffDate
}) {
  const { expedia } = affiliateConfig;
  const baseUrl = `${expedia.baseUrl}/Cars-Search`;
  
  // Direct link with inline affiliate params - matching the working flight format
  const params = new URLSearchParams({
    locn: location,
    camref: '1101l5dQSW' // This is the key missing parameter!
  });

  if (pickupDate) {
    params.append('date1', pickupDate);
  }
  
  if (dropoffDate) {
    params.append('date2', dropoffDate);
  }

  return `${baseUrl}?${params.toString()}`;
}

/**
 * Build Expedia package URL with affiliate tracking
 * @param {Object} params - Package booking parameters
 * @param {string} params.destination - Package destination
 * @param {string} [params.departDate] - Departure date
 * @param {string} [params.returnDate] - Return date  
 * @param {number} [params.travelers=2] - Number of travelers
 * @param {string} [params.packageType='Flight + Hotel'] - Package type
 * @returns {string} Complete Expedia package affiliate URL
 */
export function buildPackageUrl({
  destination,
  departDate,
  returnDate,
  travelers = 2,
  packageType = 'Flight + Hotel'
}) {
  const { expedia } = affiliateConfig;
  const baseUrl = `${expedia.baseUrl}/Packages`;
  
  // Direct link with inline affiliate params - matching the working flight format
  const params = new URLSearchParams({
    destination: destination,
    camref: '1101l5dQSW' // Using the same working affiliate parameter as flights
  });
  
  if (departDate) {
    params.append('startDate', departDate);
  }
  
  if (returnDate) {
    params.append('endDate', returnDate);
  }
  
  if (travelers) {
    params.append('travelers', travelers.toString());
  }

  return `${baseUrl}?${params.toString()}`;
}

/**
 * Build Expedia cruise URL with affiliate tracking  
 * @param {Object} params - Cruise booking parameters
 * @param {string} params.departurePort - Departure port
 * @param {string} [params.sailDate] - Sail date
 * @param {string} [params.duration='7'] - Duration in nights
 * @param {number} [params.guests=2] - Number of guests
 * @param {string} [params.cabinType='Interior'] - Cabin type
 * @returns {string} Complete Expedia cruise affiliate URL
 */
export function buildCruiseUrl({
  departurePort,
  sailDate,
  duration = '7',
  guests = 2,
  cabinType = 'Interior'
}) {
  const { expedia } = affiliateConfig;
  const baseUrl = `${expedia.baseUrl}/Cruises`;
  
  // Direct link with inline affiliate params - matching the working flight format
  const params = new URLSearchParams({
    port: departurePort,
    camref: '1101l5dQSW' // Using the same working affiliate parameter as flights
  });
  
  if (sailDate) {
    params.append('sailDate', sailDate);
  }
  
  if (duration) {
    params.append('duration', duration);
  }
  
  if (guests) {
    params.append('guests', guests.toString());
  }

  return `${baseUrl}?${params.toString()}`;
}

/**
 * Generic affiliate URL builder for other networks (future expansion)
 * @param {string} network - Network name (booking, agoda, etc.)
 * @param {string} type - Service type (hotel, flight, car)
 * @param {Object} params - Service-specific parameters
 * @returns {string} Affiliate URL for specified network
 */
export function buildGenericAffiliateUrl(network, type, params) {
  const config = affiliateConfig[network];
  if (!config) {
    console.warn(`Affiliate configuration not found for network: ${network}`);
    return '';
  }

  // This can be expanded based on specific network requirements
  // For now, return base URL - implement specific logic as needed
  return config.baseUrl;
}

// Export config for direct access if needed
export { affiliateConfig };

export default {
  buildHotelUrl,
  buildFlightUrl, 
  buildCarUrl,
  buildPackageUrl,
  buildCruiseUrl,
  buildGenericAffiliateUrl,
  affiliateConfig
};
