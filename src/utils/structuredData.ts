import { BlogPost } from "@/data/blogPosts";

// Organization Schema
export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Utrippin.ai",
  "description": "AI-powered travel booking platform for flights, hotels, cars, packages, experiences, and travel buddy matching",
  "url": "https://utrippin.ai",
  "logo": "https://utrippin.ai/favicon.svg",
  "sameAs": [
    "https://twitter.com/utrippin",
    "https://facebook.com/utrippin",
    "https://instagram.com/utrippin"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer service",
    "availableLanguage": "English"
  },
  "foundingDate": "2024",
  "founders": [
    {
      "@type": "Person",
      "name": "Utrippin Team"
    }
  ],
  "knowsAbout": [
    "Travel Planning",
    "Flight Booking",
    "Hotel Reservations", 
    "Car Rentals",
    "Travel Packages",
    "Travel Experiences",
    "AI Travel Planning",
    "Travel Buddy Matching"
  ]
};

export const createOrganizationSchema = () => organizationSchema;

export const createBlogPostSchema = (post: BlogPost) => ({
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": post.title,
  "description": post.excerpt,
  "image": post.image,
  "author": {
    "@type": "Person",
    "name": post.author
  },
  "publisher": {
    "@type": "Organization",
    "name": "Utrippin.ai",
    "logo": {
      "@type": "ImageObject",
      "url": "https://utrippin.ai/favicon.svg"
    }
  },
  "datePublished": post.publishedAt,
  "dateModified": post.publishedAt,
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": `https://utrippin.ai/blog/${post.slug}`
  },
  "keywords": post.tags.join(", "),
  "articleSection": post.category,
  "wordCount": post.content.replace(/<[^>]*>/g, "").split(" ").length
});

export const createFAQSchema = (faqs: Array<{ question: string; answer: string }>) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map(faq => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.answer
    }
  }))
});

// Flight Search Schema
export const createFlightSearchSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Utrippin Flight Search",
  "applicationCategory": "TravelApplication",
  "description": "AI-powered flight search and booking platform",
  "url": "https://utrippin.ai/flights",
  "operatingSystem": "Web Browser",
  "offers": {
    "@type": "Offer",
    "category": "Flight Booking",
    "availability": "https://schema.org/InStock"
  },
  "featureList": [
    "AI-powered flight search",
    "Price comparison",
    "Flexible date search",
    "Best time to book recommendations"
  ]
});

// Hotel Search Schema
export const createHotelSearchSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Utrippin Hotel Search",
  "applicationCategory": "TravelApplication", 
  "description": "Find and book hotels with AI recommendations",
  "url": "https://utrippin.ai/hotels",
  "operatingSystem": "Web Browser",
  "offers": {
    "@type": "Offer",
    "category": "Hotel Booking",
    "availability": "https://schema.org/InStock"
  },
  "featureList": [
    "AI hotel recommendations",
    "Price comparison",
    "Guest reviews",
    "Location-based search"
  ]
});

// Travel Package Schema
export const createTravelPackageSchema = (packageData: {
  name: string;
  description: string;
  price: string;
  currency: string;
  destination: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "TravelPackage",
  "name": packageData.name,
  "description": packageData.description,
  "provider": {
    "@type": "Organization",
    "name": "Utrippin.ai"
  },
  "offers": {
    "@type": "Offer",
    "price": packageData.price,
    "priceCurrency": packageData.currency,
    "availability": "https://schema.org/InStock",
    "validFrom": new Date().toISOString().split('T')[0],
    "priceValidUntil": new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  },
  "itinerary": {
    "@type": "Place",
    "name": packageData.destination
  }
});

// Local Business Schema for Travel Agency
export const createLocalBusinessSchema = () => ({
  "@context": "https://schema.org",
  "@type": "TravelAgency",
  "name": "Utrippin.ai",
  "description": "AI-powered travel booking platform specializing in flights, hotels, cars, and vacation packages",
  "url": "https://utrippin.ai",
  "image": "https://utrippin.ai/favicon.svg",
  "priceRange": "$$",
  "openingHours": "Mo-Su 00:00-23:59",
  "telephone": "+1-800-UTRIPPIN",
  "email": "support@utrippin.ai",
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "US",
    "addressLocality": "Global",
    "addressRegion": "Worldwide"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 40.7128,
    "longitude": -74.0060
  },
  "sameAs": [
    "https://twitter.com/utrippin_ai",
    "https://facebook.com/utrippin.ai",
    "https://instagram.com/utrippin.ai"
  ],
  "serviceArea": {
    "@type": "Place",
    "name": "Worldwide"
  },
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Travel Services",
    "itemListElement": [
      {
        "@type": "OfferCatalog",
        "name": "Flight Booking",
        "itemListElement": {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Flight Booking Service"
          }
        }
      },
      {
        "@type": "OfferCatalog", 
        "name": "Hotel Booking",
        "itemListElement": {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Hotel Booking Service"
          }
        }
      }
    ]
  }
});

// Event Schema for Travel Deals
export const createTravelDealEventSchema = (dealData: {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  url: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "Event",
  "name": dealData.name,
  "description": dealData.description,
  "startDate": dealData.startDate,
  "endDate": dealData.endDate,
  "eventStatus": "https://schema.org/EventScheduled",
  "eventAttendanceMode": "https://schema.org/OnlineEventAttendanceMode",
  "location": {
    "@type": "VirtualLocation",
    "url": dealData.url
  },
  "organizer": {
    "@type": "Organization",
    "name": "Utrippin.ai",
    "url": "https://utrippin.ai"
  },
  "offers": {
    "@type": "Offer",
    "url": dealData.url,
    "price": "0",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock",
    "category": "Travel Deal"
  }
});

// Breadcrumb Schema Generator
export const generateBreadcrumbSchema = (breadcrumbs: Array<{ name: string; url: string }>) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": breadcrumbs.map((crumb, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": crumb.name,
    "item": crumb.url
  }))
});

// Product Schema for Travel Services
export const generateTravelServiceSchema = (service: {
  name: string;
  description: string;
  provider: string;
  url: string;
  price?: string;
  currency?: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "Product",
  "name": service.name,
  "description": service.description,
  "brand": {
    "@type": "Brand",
    "name": service.provider
  },
  "url": service.url,
  ...(service.price && {
    "offers": {
      "@type": "Offer",
      "price": service.price,
      "priceCurrency": service.currency || "USD",
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": "Utrippin.ai"
      }
    }
  })
});

// FAQ Schema Generator
export const generateFAQSchema = (faqs: Array<{ question: string; answer: string }>) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map(faq => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.answer
    }
  }))
});

// Local Business Schema (if applicable)
export const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "TravelAgency",
  "name": "Utrippin.ai",
  "description": "AI-powered travel booking platform",
  "url": "https://utrippin.ai",
  "telephone": "+1-800-UTRIPPIN",
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "US"
  },
  "openingHours": "Mo-Su 00:00-23:59",
  "priceRange": "$$"
};

// Website Schema
export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Utrippin.ai",
  "description": "AI Travel Booking Platform",
  "url": "https://utrippin.ai",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://utrippin.ai/search?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
};

// Name Your Price Product Schema (fixes Google Search Console structured data issues)
export const createNameYourPriceProductSchema = () => ({
  "@context": "https://schema.org/",
  "@type": "Product",
  "name": "Name Your Price Travel Package - Utrippin.ai",
  "image": [
    "https://utrippin.ai/lovable-uploads/55c9029a-d3a1-4fb1-b1dd-12aefc25a39c.png",
    "https://utrippin.ai/hero-santorini.jpg"
  ],
  "description": "Plan your perfect staycation or vacation with Utrippin's Name Your Price tool. Enter your budget, and we'll match you with trips tailored to your preferences including flights, hotels, and experiences.",
  "sku": "NYPT-001",
  "brand": {
    "@type": "Brand",
    "name": "Utrippin.ai"
  },
  "category": "Travel Services",
  "offers": {
    "@type": "Offer",
    "url": "https://utrippin.ai/name-your-price",
    "priceCurrency": "USD",
    "price": "199.00",
    "priceValidUntil": "2025-12-31",
    "itemCondition": "https://schema.org/NewCondition",
    "availability": "https://schema.org/InStock",
    "seller": {
      "@type": "Organization",
      "name": "Utrippin.ai"
    }
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "247",
    "bestRating": "5",
    "worstRating": "1"
  },
  "review": [
    {
      "@type": "Review",
      "author": {
        "@type": "Person",
        "name": "Tasha Williams"
      },
      "datePublished": "2025-01-10",
      "description": "Loved how easy it was to name my price and get matched with a trip! Found a perfect staycation for the weekend that fit my budget perfectly.",
      "name": "Amazing experience with Utrippin Name Your Price",
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": "5",
        "bestRating": "5"
      }
    },
    {
      "@type": "Review",
      "author": {
        "@type": "Person",
        "name": "Marcus Johnson"
      },
      "datePublished": "2025-01-08",
      "description": "The AI matching was spot on. I entered my budget for a family vacation and got amazing options that I never would have found myself.",
      "name": "Great AI travel matching",
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": "5",
        "bestRating": "5"
      }
    },
    {
      "@type": "Review",
      "author": {
        "@type": "Person",
        "name": "Keisha Brown"
      },
      "datePublished": "2025-01-05",
      "description": "Perfect for budget-conscious travelers. The platform understood my price range and delivered excellent travel packages within my budget.",
      "name": "Budget-friendly travel planning",
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": "4",
        "bestRating": "5"
      }
    }
  ]
});

// Travel Buddy Product Schema
export const createTravelBuddyProductSchema = () => ({
  "@context": "https://schema.org/",
  "@type": "Product",
  "name": "Travel Buddy Matching Service - Utrippin.ai",
  "image": [
    "https://utrippin.ai/travel-buddy-1.jpg",
    "https://utrippin.ai/travel-buddy-2.jpg"
  ],
  "description": "Connect with like-minded travelers through our AI-powered travel buddy matching service. Find your perfect travel companion for safe, fun, and affordable adventures.",
  "sku": "TBM-001",
  "brand": {
    "@type": "Brand",
    "name": "Utrippin.ai"
  },
  "category": "Travel Matching Services",
  "offers": {
    "@type": "Offer",
    "url": "https://utrippin.ai/travel-buddies",
    "priceCurrency": "USD",
    "price": "29.99",
    "priceValidUntil": "2025-12-31",
    "itemCondition": "https://schema.org/NewCondition",
    "availability": "https://schema.org/InStock",
    "seller": {
      "@type": "Organization",
      "name": "Utrippin.ai"
    }
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.6",
    "reviewCount": "189",
    "bestRating": "5",
    "worstRating": "1"
  },
  "review": [
    {
      "@type": "Review",
      "author": {
        "@type": "Person",
        "name": "Sarah Mitchell"
      },
      "datePublished": "2025-01-12",
      "description": "Found an amazing travel buddy for my trip to Ghana! The matching algorithm really understood my preferences and travel style.",
      "name": "Perfect travel companion match",
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": "5",
        "bestRating": "5"
      }
    }
  ]
});

// Melanin & Trippin Product Schema
export const createMelaninTrippinProductSchema = () => ({
  "@context": "https://schema.org/",
  "@type": "Product",
  "name": "Melanin & Trippin - Black Travel Experiences",
  "image": [
    "https://utrippin.ai/lovable-uploads/81b7dff6-141a-42f0-a275-1d7a430418a8.png"
  ],
  "description": "Your ultimate guide to safe, affordable, and culturally rich travel experiences for Black travelers. Discover destinations, events, and travel buddies.",
  "sku": "MT-001",
  "brand": {
    "@type": "Brand",
    "name": "Utrippin.ai"
  },
  "category": "Cultural Travel Services",
  "offers": {
    "@type": "Offer",
    "url": "https://utrippin.ai/melanin",
    "priceCurrency": "USD",
    "price": "0",
    "priceValidUntil": "2025-12-31",
    "itemCondition": "https://schema.org/NewCondition",
    "availability": "https://schema.org/InStock",
    "seller": {
      "@type": "Organization",
      "name": "Utrippin.ai"
    }
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "reviewCount": "156",
    "bestRating": "5",
    "worstRating": "1"
  },
  "review": [
    {
      "@type": "Review",
      "author": {
        "@type": "Person",
        "name": "Destiny Jackson"
      },
      "datePublished": "2025-01-11",
      "description": "Finally, a travel platform that understands the unique needs of Black travelers. The safety guides and cultural event listings are invaluable.",
      "name": "Excellent resource for Black travelers",
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": "5",
        "bestRating": "5"
      }
    }
  ]
});