// SEO Configuration for UTrippin
export const defaultSEOConfig = {
  type: "website",
  url: "https://utrippin.ai",
  title: "UTrippin: Your AI Travel Buddy",
  description: "Compare flights, hotels, cars & even find travel buddies.",
  image: {
    url: "https://utrippin.ai/UTrippin_Social_Card_BlueBG_1200x630.png",
    width: 1200,
    height: 630
  }
};

// Generate structured data for different page types
export const generateStructuredData = (pageType = 'website', customData = {}) => {
  const baseData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "UTrippin",
    "url": "https://utrippin.ai",
    "description": "AI-powered travel booking platform for flights, hotels, cars, and finding travel buddies",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://utrippin.ai/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  switch (pageType) {
    case 'travel-service':
      return {
        "@context": "https://schema.org",
        "@type": "TravelAgency",
        "name": "UTrippin",
        "url": "https://utrippin.ai",
        "description": "AI-powered travel booking platform",
        "serviceType": ["Flight Booking", "Hotel Booking", "Car Rental", "Travel Planning"],
        "areaServed": "Worldwide",
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "Travel Services",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Flight Booking",
                "description": "Compare and book flights worldwide"
              }
            },
            {
              "@type": "Offer", 
              "itemOffered": {
                "@type": "Service",
                "name": "Hotel Booking",
                "description": "Find and book hotels globally"
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service", 
                "name": "Travel Buddy Matching",
                "description": "Connect with compatible travel companions"
              }
            }
          ]
        },
        ...customData
      };

    case 'software-application':
      return {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "UTrippin",
        "url": "https://utrippin.ai",
        "description": "AI-powered travel booking and companion finding platform",
        "applicationCategory": "TravelApplication",
        "operatingSystem": "Web Browser",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "featureList": [
          "Flight comparison and booking",
          "Hotel search and reservation", 
          "Car rental booking",
          "AI travel assistant",
          "Travel buddy matching",
          "Trip planning tools"
        ],
        ...customData
      };

    default:
      return {
        ...baseData,
        ...customData
      };
  }
};

// Bolt-specific SEO JSON format
export const generateBoltSEOJSON = (pageData = {}) => {
  const config = { ...defaultSEOConfig, ...pageData };
  
  return {
    type: config.type,
    url: config.url,
    title: config.title,
    description: config.description,
    image: {
      url: config.image.url || config.image,
      width: config.image.width || 1200,
      height: config.image.height || 630
    }
  };
};

// Page-specific SEO configurations
export const pageSEOConfigs = {
  home: {
    title: "UTrippin: Your AI Travel Buddy",
    description: "Compare flights, hotels, cars & even find travel buddies.",
    structuredDataType: 'travel-service'
  },
  
  flights: {
    title: "Cheap Flights: Compare & Book Flight Deals | UTrippin",
    description: "Find and book cheap flights worldwide. Compare prices from hundreds of airlines and travel sites.",
    structuredDataType: 'travel-service',
    customStructuredData: {
      "serviceType": ["Flight Booking", "Flight Comparison"]
    }
  },
  
  hotels: {
    title: "Hotels: Find Cheap Hotel Rooms & Discount Hotels | UTrippin", 
    description: "Deep Discounts on Hotels. Get Exclusive Savings with UTrippin.com.",
    structuredDataType: 'travel-service',
    customStructuredData: {
      "serviceType": ["Hotel Booking", "Hotel Comparison"]
    }
  },
  
  'travel-buddy': {
    title: "Find Travel Buddies: Swipe & Match | UTrippin",
    description: "Discover travel companions who share your interests. Swipe to connect with fellow travelers worldwide.",
    structuredDataType: 'software-application',
    customStructuredData: {
      "featureList": ["Travel buddy matching", "Compatibility scoring", "Travel planning"]
    }
  },
  
  'ai-travel': {
    title: "AI Travel Assistant: Smart Trip Planning | UTrippin",
    description: "Plan your perfect trip with AI. Get custom itineraries, book flights, reserve dinners & find travel buddies.",
    structuredDataType: 'software-application',
    customStructuredData: {
      "featureList": ["AI trip planning", "Custom itineraries", "Smart recommendations"]
    }
  }
};