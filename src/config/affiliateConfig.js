// Global Affiliate Configuration
// Update these settings in one place to affect all affiliate links site-wide

export const affiliateConfig = {
  expedia: {
    clickref: "1101l5dQSW",
    camref: "1101l5dQSW",
    baseUrl: "https://www.expedia.com",
    network: "expedia_affiliate_network",
    program: "utrippin_travel",
  },
  
  // Future affiliate networks can be added here
  booking: {
    aid: "", // Booking.com affiliate ID (when ready)
    baseUrl: "https://www.booking.com",
  },
  
  agoda: {
    cid: "", // Agoda partner ID (when ready) 
    baseUrl: "https://www.agoda.com",
  },
  
  // Add more affiliate networks as needed
  tripadvisor: {
    partnerId: "",
    baseUrl: "https://www.tripadvisor.com",
  }
};

export default affiliateConfig;
