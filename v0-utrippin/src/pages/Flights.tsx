import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ExpediaWidget from "@/components/ExpediaWidget";
import HeroFlightWidget from "@/components/HeroFlightWidget";
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
    
    const baseURL = "https://www.expedia.com/Flights-Search";
    const params = new URLSearchParams({
      trip: searchData.tripType === 'round-trip' ? 'roundtrip' : 'oneway',
      leg1: `from:${originCode},to:${destinationCode},departure:${departureDateStr}TANYT`,
      passengers: `adults:${searchData.passengers.adults},children:0`,
      mode: 'search',
      AID: '15754452',
      PID: '101486313',
      affcid: 'network.cj.101486313'
    });

    if (searchData.tripType === 'round-trip' && searchData.returnDate) {
      params.append('leg2', `from:${destinationCode},to:${originCode},departure:${returnDateStr}TANYT`);
    }

    const expediaUrl = `${baseURL}?${params.toString()}`;
    window.open(expediaUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-background">
      <SkipNavigation />
      <SEOHead 
        title="AI-Powered Flight Search & Booking | Utrippin.ai"
        description="Find cheap flights with our AI Traveler assistant. Compare prices, discover cultural destinations with The Melanin Compass, and connect with Travel Buddies for group trips."
        canonical="https://utrippin.ai/flights"
        keywords="AI flight search, cheap flights, cultural travel, melanin compass, travel buddies, AI traveler, flight deals"
        structuredData={{
          "@context": "https://schema.org",
          "@graph": [
            breadcrumbs,
            flightServiceSchema,
            {
              "@type": "WebPage",
              "@id": "https://utrippin.ai/flights#webpage",
              "url": "https://utrippin.ai/flights",
              "name": "AI-Powered Flight Search & Booking | Utrippin.ai",
              "description": "Find cheap flights with our AI Traveler assistant. Compare prices, discover cultural destinations with The Melanin Compass, and connect with Travel Buddies for group trips.",
              "inLanguage": "en-US"
            }
          ]
        }}
      />
      <Header />
      
      {/* Hero Section with Flight Widget */}
      <HeroFlightWidget />
      
      {/* Clean white background for content below */}
      <div className="bg-white min-h-screen">
        {/* Main Content Container */}
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
