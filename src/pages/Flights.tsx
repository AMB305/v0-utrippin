import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ExpediaWidget from "@/components/ExpediaWidget";
import { useNavigate } from "react-router-dom";
import { SEOHead } from "@/components/SEOHead";
import { generateBreadcrumbSchema, generateTravelServiceSchema } from "@/utils/structuredData";
import { DebugPanel } from "@/components/DebugPanel";
import { BackToTop } from '@/components/BackToTop';
import { SearchLoadingSpinner } from '@/components/LoadingStates';
import { ResponsiveContainer, ResponsiveGrid } from '@/components/ResponsiveDesignFixes';
import { AccessibleButton, SkipNavigation } from '@/components/AccessibilityEnhancements';

export default function Flights() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const destinationParam = searchParams.get('destination');

  const breadcrumbs = generateBreadcrumbSchema([
    { name: "Home", url: "https://utrippin.ai" },
    { name: "Flights", url: "https://utrippin.ai/flights" }
  ]);

  const flightServiceSchema = generateTravelServiceSchema({
    name: "Flight Booking Service",
    description: "Book cheap flights worldwide with AI-powered search",
    provider: "Utrippin.ai",
    url: "https://utrippin.ai/flights"
  });

  const handleFlightSearch = (searchData: any) => {
    // Build Expedia URL for flight search
    const departureDateStr = searchData.departureDate?.toISOString().split('T')[0] || '';
    const returnDateStr = searchData.returnDate?.toISOString().split('T')[0] || '';
    const originCode = searchData.origin[0]?.iata_code || '';
    const destinationCode = searchData.destination[0]?.iata_code || '';
    
    let expediaUrl = '';
    
    if (searchData.tripType === 'round-trip' && searchData.returnDate) {
      // Round trip
      expediaUrl = `https://www.expedia.com/Flights-Search?trip=roundtrip&leg1=from:${encodeURIComponent(originCode)},to:${encodeURIComponent(destinationCode)},departure:${departureDateStr}&leg2=from:${encodeURIComponent(destinationCode)},to:${encodeURIComponent(originCode)},departure:${returnDateStr}&passengers=adults:${searchData.passengers.adults}&mode=search&camref=1101l5dQSW`;
    } else {
      // One way
      expediaUrl = `https://www.expedia.com/Flights-Search?trip=oneway&leg1=from:${encodeURIComponent(originCode)},to:${encodeURIComponent(destinationCode)},departure:${departureDateStr}&passengers=adults:${searchData.passengers.adults}&mode=search&camref=1101l5dQSW`;
    }
    
    // Open Expedia in new tab
    const finalUrl = `https://www.dpbolvw.net/click-101486313-15754452?url=${encodeURIComponent(expediaUrl)}`;
    window.open(finalUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-background">
      <SkipNavigation />
      <SEOHead 
        title="Find Cheap Flights Online - AI Flight Planner | Utrippin.ai"
        description="Discover cheap flights with our AI search. Compare millions of flights from 500+ airlines and book with confidence. Best prices guaranteed."
        canonical="https://utrippin.ai/flights"
        keywords="cheap flights, flight booking, AI flight search, airline tickets, flight deals"
        structuredData={{
          "@context": "https://schema.org",
          "@graph": [
            breadcrumbs,
            flightServiceSchema,
            {
              "@type": "WebPage",
              "@id": "https://utrippin.ai/flights#webpage",
              "url": "https://utrippin.ai/flights",
              "name": "Find Cheap Flights Online - AI Flight Planner | Utrippin.ai",
              "description": "Discover cheap flights with our AI search. Compare millions of flights from 500+ airlines and book with confidence. Best prices guaranteed.",
              "inLanguage": "en-US"
            }
          ]
        }}
      />
      <Header />
      
      {/* Hero Section with Background */}
      <div className="relative h-screen overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/lovable-uploads/dd949a6b-079d-4828-9b8d-09578dc11945.png')`
          }}
        />
        
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/40" />
        
        {/* Left sidebar navigation */}
        <div className="absolute left-6 top-1/2 -translate-y-1/2 z-20">
          <div className="flex flex-col space-y-8 text-white">
            <div className="writing-mode-vertical text-sm font-light tracking-[0.3em] opacity-80 hover:opacity-100 transition-opacity cursor-pointer">
              AIR TICKETS
            </div>
            <div className="writing-mode-vertical text-sm font-light tracking-[0.3em] opacity-60 hover:opacity-100 transition-opacity cursor-pointer">
              EXCURSIONS
            </div>
            <div className="writing-mode-vertical text-sm font-light tracking-[0.3em] opacity-60 hover:opacity-100 transition-opacity cursor-pointer">
              HOTELS
            </div>
            <div className="writing-mode-vertical text-sm font-light tracking-[0.3em] opacity-60 hover:opacity-100 transition-opacity cursor-pointer">
              TOURS
            </div>
          </div>
        </div>
        
        {/* Right side location markers */}
        <div className="absolute right-6 top-1/2 -translate-y-1/2 z-20">
          <div className="flex flex-col items-end space-y-4">
            <div className="flex items-center space-x-2 text-white">
              <span className="text-sm font-light tracking-wide">LOS ANGELES</span>
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            </div>
          </div>
        </div>
        
        {/* Center content */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="text-center text-white px-4 max-w-4xl mx-auto">
            <div className="mb-4">
              <span className="text-6xl md:text-8xl font-light tracking-wider">Discover</span>
            </div>
            <div className="mb-8">
              <span className="text-3xl md:text-5xl font-light tracking-wide">Adventure & Action in Travel</span>
            </div>
            <div className="text-sm font-light tracking-[0.2em] opacity-80">
              ATMOSPHERE OF LOS ANGELES COUNTRY
            </div>
          </div>
        </div>
        
        {/* Bottom search widget */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 w-full max-w-4xl px-4">
          <ExpediaWidget />
        </div>
      </div>
      
      {/* Content below hero */}
      <div className="bg-white">
        <div className="container mx-auto px-6 py-8">
          
          {/* Popular Destinations Section */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Popular destinations</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { 
                  name: 'New York', 
                  country: 'United States',
                  image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&h=300&fit=crop',
                  price: 'from $299'
                },
                { 
                  name: 'London', 
                  country: 'United Kingdom',
                  image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&h=300&fit=crop',
                  price: 'from $459'
                },
                { 
                  name: 'Tokyo', 
                  country: 'Japan',
                  image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=300&fit=crop',
                  price: 'from $689'
                },
                { 
                  name: 'Paris', 
                  country: 'France',
                  image: 'https://images.unsplash.com/photo-1431274172761-fca41d930114?w=400&h=300&fit=crop',
                  price: 'from $399'
                },
                { 
                  name: 'Dubai', 
                  country: 'UAE',
                  image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&h=300&fit=crop',
                  price: 'from $549'
                },
                { 
                  name: 'Sydney', 
                  country: 'Australia',
                  image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
                  price: 'from $799'
                },
                { 
                  name: 'Barcelona', 
                  country: 'Spain',
                  image: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=400&h=300&fit=crop',
                  price: 'from $349'
                },
                { 
                  name: 'Rome', 
                  country: 'Italy',
                  image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400&h=300&fit=crop',
                  price: 'from $379'
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