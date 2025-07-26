import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroHotelWidget from "@/components/HeroHotelWidget";
import { useNavigate } from "react-router-dom";
import { SEOHead } from "@/components/SEOHead";
import { generateBreadcrumbSchema, generateTravelServiceSchema } from "@/utils/structuredData";
import { BackToTop } from '@/components/BackToTop';
import { useIsMobile } from "@/hooks/use-mobile";
import { MobileHeader } from "@/components/mobile/MobileHeader";
import { SearchWidget } from "@/components/mobile/SearchWidget";
import { QuickDestinations } from "@/components/mobile/QuickDestinations";
import { MobileHotelResults } from "@/components/mobile/MobileHotelResults";
import { BottomNavigation } from "@/components/mobile/BottomNavigation";
import { useNearbyHotels } from "@/hooks/useHotels";

export default function Hotels() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const destinationParam = searchParams.get('destination');
  const isMobile = useIsMobile();
  
  // Use RateHawk integration for nearby hotels
  const { data: nearbyHotels, isLoading: nearbyLoading } = useNearbyHotels("Miami Beach, Florida");

  const breadcrumbs = generateBreadcrumbSchema([
    { name: "Home", url: "https://utrippin.ai" },
    { name: "Hotels", url: "https://utrippin.ai/hotels" }
  ]);

  const hotelServiceSchema = generateTravelServiceSchema({
    name: "Hotel Booking Service",
    description: "Find and book hotels worldwide with AI-powered search",
    provider: "Utrippin.ai",
    url: "https://utrippin.ai/hotels"
  });

  const handleSearch = (searchData: any) => {
    console.log('Search data:', searchData);
    // Navigate to hotel search results or handle search
    const params = new URLSearchParams(searchData);
    navigate(`/hotels/search?${params.toString()}`);
  };

  const handleHotelSelect = (hotel: any) => {
    console.log('Selected hotel:', hotel);
    // Navigate to hotel details
  };

  // Mobile Layout
  if (isMobile) {
    return (
      <div className="min-h-screen bg-mobile-dark">
        <SEOHead 
          title="AI Hotel Search & Black-Owned Stays | Utrippin.ai"
          description="Discover culturally rich accommodations with The Melanin Compass. Find Black-owned hotels, boutique stays, and budget-friendly options with our AI Traveler assistant."
          canonical="https://utrippin.ai/hotels"
          keywords="AI hotel search, black-owned hotels, cultural accommodations, melanin compass, boutique hotels, AI traveler, diverse travel"
          structuredData={{
            "@context": "https://schema.org",
            "@graph": [
              breadcrumbs,
              hotelServiceSchema,
              {
                "@type": "WebPage",
                "@id": "https://utrippin.ai/hotels#webpage",
                "url": "https://utrippin.ai/hotels",
                "name": "AI Hotel Search & Black-Owned Stays | Utrippin.ai",
                "description": "Discover culturally rich accommodations with The Melanin Compass. Find Black-owned hotels, boutique stays, and budget-friendly options with our AI Traveler assistant.",
                "inLanguage": "en-US"
              }
            ]
          }}
        />
        
        {/* Mobile Header */}
        <MobileHeader />
        
        {/* Mobile Search Widget */}
        <div className="px-4 py-6">
          <SearchWidget onSearch={handleSearch} />
        </div>
        
        {/* Quick Destinations */}
        <QuickDestinations destinations={['Roma', 'Berlin', 'New York', 'Paris', 'Tokyo']} />
        
        {/* Nearby Hotels Section */}
        <div className="px-4 py-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-mobile-text-primary text-lg font-semibold">Nearby Hotels</h2>
            <button className="text-mobile-primary-teal text-sm font-medium">See All</button>
          </div>
          
          <MobileHotelResults 
            hotels={nearbyHotels || []}
            loading={nearbyLoading}
            onHotelSelect={handleHotelSelect}
            searchData={{
              destination: "Miami Beach, Florida",
              checkInDate: "May 7, 2025",
              checkOutDate: "May 9, 2025",
              adults: 2,
              children: 0,
              rooms: 1
            }}
          />
        </div>
        
        {/* Bottom Navigation */}
        <BottomNavigation />
      </div>
    );
  }

  // Desktop Layout (unchanged)
  return (
    <div className="min-h-screen bg-background">
      <SEOHead 
        title="AI Hotel Search & Black-Owned Stays | Utrippin.ai"
        description="Discover culturally rich accommodations with The Melanin Compass. Find Black-owned hotels, boutique stays, and budget-friendly options with our AI Traveler assistant."
        canonical="https://utrippin.ai/hotels"
        keywords="AI hotel search, black-owned hotels, cultural accommodations, melanin compass, boutique hotels, AI traveler, diverse travel"
        structuredData={{
          "@context": "https://schema.org",
          "@graph": [
            breadcrumbs,
            hotelServiceSchema,
            {
              "@type": "WebPage",
              "@id": "https://utrippin.ai/hotels#webpage",
              "url": "https://utrippin.ai/hotels",
              "name": "AI Hotel Search & Black-Owned Stays | Utrippin.ai",
              "description": "Discover culturally rich accommodations with The Melanin Compass. Find Black-owned hotels, boutique stays, and budget-friendly options with our AI Traveler assistant.",
              "inLanguage": "en-US"
            }
          ]
        }}
      />
      <Header />
      
      {/* Hero Section with Hotel Widget */}
      <HeroHotelWidget />
      
      {/* Clean white background for content below */}
      <div className="bg-white min-h-screen">
        {/* Main Content Container */}
        <div className="container mx-auto px-6 py-8">
          {/* Popular Hotel Destinations Section */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Popular hotel destinations</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { 
                  name: 'New York', 
                  country: 'United States',
                  image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&h=300&fit=crop',
                  price: 'from $150/night'
                },
                { 
                  name: 'London', 
                  country: 'United Kingdom',
                  image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&h=300&fit=crop',
                  price: 'from $180/night'
                },
                { 
                  name: 'Tokyo', 
                  country: 'Japan',
                  image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=300&fit=crop',
                  price: 'from $120/night'
                },
                { 
                  name: 'Paris', 
                  country: 'France',
                  image: 'https://images.unsplash.com/photo-1431274172761-fca41d930114?w=400&h=300&fit=crop',
                  price: 'from $160/night'
                },
                { 
                  name: 'Dubai', 
                  country: 'UAE',
                  image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&h=300&fit=crop',
                  price: 'from $200/night'
                },
                { 
                  name: 'Sydney', 
                  country: 'Australia',
                  image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
                  price: 'from $140/night'
                },
                { 
                  name: 'Barcelona', 
                  country: 'Spain',
                  image: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=400&h=300&fit=crop',
                  price: 'from $110/night'
                },
                { 
                  name: 'Rome', 
                  country: 'Italy',
                  image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400&h=300&fit=crop',
                  price: 'from $130/night'
                }
              ].map((destination, index) => (
                <div key={index} className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer">
                  <img 
                    src={destination.image} 
                    alt={destination.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 text-lg">{destination.name}</h3>
                    <p className="text-gray-500 text-sm">{destination.country}</p>
                    <p className="text-blue-600 font-medium mt-2">{destination.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
      <BackToTop />
    </div>
  );
}