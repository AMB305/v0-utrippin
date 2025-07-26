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
import { HotelCardDesktop } from "@/components/HotelCardDesktop";

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

  // Desktop Layout
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
      
      {/* Main Desktop Layout */}
      <main className="flex h-screen pt-20">
        {/* Left Panel: Filters & Search */}
        <aside className="w-96 flex-shrink-0 bg-card border-r border-border p-6 overflow-y-auto">
          <h2 className="text-2xl font-bold mb-6 text-foreground">Find Your Perfect Stay</h2>

          {/* Search Form */}
          <div className="space-y-4 mb-8">
            {/* Destination Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Miami Beach, Florida"
                defaultValue="Miami Beach, Florida"
                className="w-full p-4 bg-muted rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder:text-muted-foreground"
              />
            </div>

            {/* Date Inputs */}
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Check-in"
                defaultValue="May 7, 2025"
                className="p-4 bg-muted rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder:text-muted-foreground"
              />
              <input
                type="text"
                placeholder="Check-out"
                defaultValue="May 9, 2025"
                className="p-4 bg-muted rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder:text-muted-foreground"
              />
            </div>

            {/* Guests & Rooms */}
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Guests"
                defaultValue="2 guests"
                className="p-4 bg-muted rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder:text-muted-foreground"
              />
              <input
                type="text"
                placeholder="Rooms"
                defaultValue="1 room"
                className="p-4 bg-muted rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <button className="w-full bg-primary text-primary-foreground font-semibold rounded-xl py-4 hover:bg-primary/90 transition-colors">
              Search Hotels
            </button>
          </div>

          {/* Property Type Filters */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 text-foreground">Property Type</h3>
            <div className="grid grid-cols-2 gap-3">
              {['Hotel', 'Villa', 'House', 'Apartment'].map((type) => (
                <button
                  key={type}
                  className="p-3 bg-muted rounded-xl border border-border hover:border-primary text-foreground hover:bg-muted/80 transition-colors"
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 text-foreground">Price Range</h3>
            <div className="px-3">
              <div className="flex justify-between mb-2 text-sm text-muted-foreground">
                <span>$50</span>
                <span>$1000+</span>
              </div>
              <div className="h-2 bg-muted rounded-full relative">
                <div className="absolute left-1/4 right-1/3 h-full bg-primary rounded-full"></div>
                <div className="absolute left-1/4 w-4 h-4 bg-primary rounded-full -mt-1"></div>
                <div className="absolute right-1/3 w-4 h-4 bg-primary rounded-full -mt-1"></div>
              </div>
              <div className="text-center mt-2 text-sm text-foreground">$100 - $500</div>
            </div>
          </div>

          {/* Amenities */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 text-foreground">Amenities</h3>
            <div className="space-y-3">
              {['Free WiFi', 'Swimming Pool', 'Fitness Center', 'Parking', 'Pet Friendly', 'Spa'].map((amenity) => (
                <label key={amenity} className="flex items-center space-x-3 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 text-primary bg-muted border-border rounded focus:ring-primary" />
                  <span className="text-foreground">{amenity}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Popular Destinations */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-foreground">Popular Destinations</h3>
            <div className="flex flex-wrap gap-2">
              {['Roma', 'Berlin', 'New York', 'Paris', 'Tokyo'].map((destination) => (
                <button
                  key={destination}
                  className="px-4 py-2 bg-muted text-foreground rounded-full border border-border hover:border-primary transition-colors"
                >
                  {destination}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Right Panel: Map & Hotel Listings */}
        <section className="flex-1 flex flex-col">
          {/* Map Section */}
          <div className="h-96 bg-muted border-b border-border relative">
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <div className="text-4xl mb-2">🗺️</div>
                <p>Interactive Map of Miami Beach Hotels</p>
                <p className="text-sm mt-1">(Mapbox integration placeholder)</p>
              </div>
            </div>
          </div>

          {/* Hotel Listings */}
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Hotels in Miami Beach, Florida</h2>
                <p className="text-muted-foreground text-sm mt-1">
                  May 7, 2025 → May 9, 2025 • 2 guests, 1 room
                </p>
                <p className="text-muted-foreground text-sm">
                  {nearbyLoading ? 'Searching for hotels...' : `${nearbyHotels?.length || 0} hotels found`}
                </p>
              </div>
              <button className="text-primary hover:text-primary/80 font-medium">See All</button>
            </div>

            {/* Hotel Cards */}
            <div className="space-y-6">
              {nearbyLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading hotels...</p>
                </div>
              ) : nearbyHotels && nearbyHotels.length > 0 ? (
                nearbyHotels.map((hotel) => (
                  <HotelCardDesktop key={hotel.id} hotel={hotel} onHotelSelect={handleHotelSelect} />
                ))
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <div className="text-4xl mb-4">🏨</div>
                  <p>No hotels found. Try adjusting your search criteria.</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <BackToTop />
    </div>
  );
}