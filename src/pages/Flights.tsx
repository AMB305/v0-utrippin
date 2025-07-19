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
      
      {/* Hero Section with Sky Gradient and Modern Search */}
      <div className="bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 relative overflow-hidden min-h-[500px]">
        {/* Cloud Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Subtle cloud shapes */}
          <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-white/10 to-transparent rounded-b-[100%] transform -translate-y-12"></div>
          <div className="absolute top-16 right-32 w-20 h-10 bg-white/8 rounded-full blur-sm"></div>
          <div className="absolute top-20 left-24 w-16 h-8 bg-white/6 rounded-full blur-sm"></div>
          <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-white/15 to-transparent rounded-t-[100%] transform translate-y-10"></div>
          
          {/* Subtle sparkles */}
          <div className="absolute top-32 right-16 w-2 h-2 bg-white/40 rounded-full animate-pulse"></div>
          <div className="absolute top-48 left-20 w-1 h-1 bg-white/50 rounded-full animate-pulse"></div>
          <div className="absolute top-40 right-40 w-1.5 h-1.5 bg-white/30 rounded-full animate-pulse"></div>
        </div>

        <div className="container mx-auto px-4 py-16 relative z-10">
          {/* Hero Text */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Book flights. Pay later.
            </h1>
            <p className="text-white/90 text-lg max-w-2xl mx-auto">
              Book your perfect flight with confidence.
            </p>
          </div>

          {/* Expedia Widget */}
          <ExpediaWidget />
        </div>
      </div>
      
      {/* Main Content */}
      <main id="main-content" className="container mx-auto px-4 py-12">
        <div className="space-y-12">{/* How It Works Section */}
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">How It Works</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Book your perfect flight in just three simple steps
            </p>
            
            <ResponsiveGrid cols="1 md:3" className="max-w-6xl mx-auto">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">1. Search</h3>
                <p className="text-muted-foreground">
                  Enter your travel details and let us find the best flights for you
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">2. Compare</h3>
                <p className="text-muted-foreground">
                  Compare prices, times, and airlines to find your perfect match
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">3. Book</h3>
                <p className="text-muted-foreground">
                  Secure booking with 24/7 customer support and flexible options
                </p>
              </div>
            </ResponsiveGrid>
          </div>

          {/* Popular Destinations */}
          <div>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Popular Destinations</h2>
              <p className="text-muted-foreground">
                Explore the world's most loved travel destinations
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto px-4">
              {[
                { name: 'New York', image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&h=300&fit=crop' },
                { name: 'London', image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&h=300&fit=crop' },
                { name: 'Tokyo', image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=300&fit=crop' },
                { name: 'Paris', image: 'https://images.unsplash.com/photo-1431274172761-fca41d930114?w=400&h=300&fit=crop' },
                { name: 'Sydney', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop' },
                { name: 'Dubai', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&h=300&fit=crop' },
                { name: 'Rome', image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400&h=300&fit=crop' },
                { name: 'Barcelona', image: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=400&h=300&fit=crop' }
              ].map((destination) => (
                <div key={destination.name} className="group cursor-pointer">
                  <div className="relative overflow-hidden rounded-lg aspect-[4/3] mb-3">
                    <img 
                      src={destination.image} 
                      alt={destination.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <h3 className="font-semibold text-foreground text-center">{destination.name}</h3>
                </div>
              ))}
            </div>
          </div>

          {/* Explore Beach Destinations */}
          <div>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-4">Explore stays in popular destinations</h2>
              <p className="text-muted-foreground mb-6">
                Average prices based on current calendar month
              </p>
              
              {/* Category Tabs */}
              <div className="flex gap-6 justify-center mb-8 border-b">
                <Link 
                  to="/categories/beach" 
                  className="pb-3 px-1 border-b-2 border-primary text-primary font-medium hover:text-primary/80 transition-colors"
                >
                  Beach
                </Link>
                <Link 
                  to="/categories/culture" 
                  className="pb-3 px-1 text-muted-foreground hover:text-foreground transition-colors"
                >
                  Culture
                </Link>
                <Link 
                  to="/categories/ski" 
                  className="pb-3 px-1 text-muted-foreground hover:text-foreground transition-colors"
                >
                  Ski
                </Link>
                <Link 
                  to="/categories/family" 
                  className="pb-3 px-1 text-muted-foreground hover:text-foreground transition-colors"
                >
                  Family
                </Link>
                <Link 
                  to="/categories/wellness" 
                  className="pb-3 px-1 text-muted-foreground hover:text-foreground transition-colors"
                >
                  Wellness and Relaxation
                </Link>
              </div>
            </div>

            {/* Beach Destinations Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 max-w-7xl mx-auto mb-8 px-4">
              {[
                {
                  name: 'St. John',
                  location: 'U.S. Virgin Islands',
                  price: '$459',
                  priceLabel: 'avg. nightly price',
                  image: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=300&h=200&fit=crop&crop=center'
                },
                {
                  name: 'San Juan',
                  location: 'Puerto Rico',
                  price: '$185',
                  priceLabel: 'avg. nightly price',
                  image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=300&h=200&fit=crop&crop=center'
                },
                {
                  name: 'Christiansted',
                  location: 'St. Croix Island, U.S. Virgin Islands',
                  price: '$384',
                  priceLabel: 'avg. nightly price',
                  image: 'https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?w=300&h=200&fit=crop&crop=center'
                },
                {
                  name: 'Punta Cana',
                  location: 'La Altagracia, Dominican Republic',
                  price: '$297',
                  priceLabel: 'avg. nightly price',
                  image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=300&h=200&fit=crop&crop=center'
                },
                {
                  name: 'Roatan',
                  location: 'Bay Islands, Honduras',
                  price: '$178',
                  priceLabel: 'avg. nightly price',
                  image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=300&h=200&fit=crop&crop=center'
                }
              ].map((destination, index) => (
                <div key={index} className="group cursor-pointer">
                  <div className="relative overflow-hidden rounded-lg mb-3">
                    <img 
                      src={destination.image} 
                      alt={destination.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-lg">{destination.name}</h3>
                    <p className="text-muted-foreground text-sm mb-2">{destination.location}</p>
                    <div>
                      <span className="text-2xl font-bold text-foreground">{destination.price}</span>
                      <span className="text-muted-foreground text-sm ml-1">{destination.priceLabel}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Show More Button */}
            <div className="text-center">
              <AccessibleButton 
                className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
                ariaLabel="Show more destinations"
              >
                Show more
              </AccessibleButton>
            </div>
          </div>

          {/* Features Section */}
          <div className="bg-muted/50 rounded-lg p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-4">Why Choose Us?</h2>
              <p className="text-muted-foreground">
                Experience the best in flight booking with our premium features
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Best Price Guarantee</h3>
                <p className="text-muted-foreground text-sm">
                  Find a better price? We'll match it and give you an extra 5% off
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Secure Booking</h3>
                <p className="text-muted-foreground text-sm">
                  SSL encrypted booking process with secure payment options
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25A9.75 9.75 0 002.25 12c0 5.384 4.365 9.75 9.75 9.75s9.75-4.366 9.75-9.75S17.635 2.25 12 2.25z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">24/7 Support</h3>
                <p className="text-muted-foreground text-sm">
                  Round-the-clock customer support for all your travel needs
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
      <BackToTop />
    </div>
  );
}