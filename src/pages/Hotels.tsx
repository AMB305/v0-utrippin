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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useEmblaCarousel from "embla-carousel-react";
import { MapPin, Calendar, Users, Hotel, Star, Wifi, Car, Dumbbell, Search, Palmtree, Home, Building, Sparkles, Coffee, TreePine, Crown, ArrowLeft, ArrowRight } from "lucide-react";

export default function Hotels() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const destinationParam = searchParams.get('destination');
  const isMobile = useIsMobile();
  
  // Form state for desktop search
  const [destination, setDestination] = useState('Miami Beach, Florida');
  const [checkInDate, setCheckInDate] = useState('2025-05-07');
  const [checkOutDate, setCheckOutDate] = useState('2025-05-09');
  const [guests, setGuests] = useState('2 guests, 1 room');
  
  // Use RateHawk integration for nearby hotels
  const { data: nearbyHotels, isLoading: nearbyLoading } = useNearbyHotels("Miami Beach, Florida");

  // Dummy data for carousel sections (Miami Beach-focused for demo)
  const dealsData = [
    { id: 'deal_001', name: 'Save 20% at The Setai!', address: '2001 Collins Avenue', price: 360, imageUrl: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=250&fit=crop&q=80', originalPrice: 450, discount: '20%' },
    { id: 'deal_002', name: 'Last Minute at Eden Roc', address: '4525 Collins Avenue', price: 280, imageUrl: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400&h=250&fit=crop&q=80', originalPrice: 350, discount: '20%' },
    { id: 'deal_003', name: 'Weekend at Cadillac Hotel', address: '3925 Collins Avenue', price: 230, imageUrl: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&h=250&fit=crop&q=80', originalPrice: 290, discount: '20%' },
    { id: 'deal_004', name: 'Fontainebleau Flash Sale', address: '4441 Collins Avenue', price: 300, imageUrl: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=400&h=250&fit=crop&q=80', originalPrice: 380, discount: '21%' },
  ];

  const popularDestinations = [
    { id: 'dest_ny', name: 'New York', imageUrl: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=300&h=200&fit=crop&q=80', hotelsCount: '1500+ hotels' },
    { id: 'dest_la', name: 'Los Angeles', imageUrl: 'https://images.unsplash.com/photo-1534190760961-74e8c1c5c3da?w=300&h=200&fit=crop&q=80', hotelsCount: '1200+ hotels' },
    { id: 'dest_sf', name: 'San Francisco', imageUrl: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=300&h=200&fit=crop&q=80', hotelsCount: '800+ hotels' },
    { id: 'dest_chi', name: 'Chicago', imageUrl: 'https://images.unsplash.com/photo-1477414348463-c0eb7f1359b6?w=300&h=200&fit=crop&q=80', hotelsCount: '900+ hotels' },
    { id: 'dest_lon', name: 'London', imageUrl: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=300&h=200&fit=crop&q=80', hotelsCount: '2000+ hotels' },
  ];

  const uniqueStays = [
    { id: 'unique_001', name: 'Boutique Art Hotel', address: 'South Beach', imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=250&fit=crop&q=80', description: 'Experience art and culture in a vibrant setting.' },
    { id: 'unique_002', name: 'Waterfront Villa', address: 'Miami Beach', imageUrl: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=250&fit=crop&q=80', description: 'Private villa with stunning bay views.' },
    { id: 'unique_003', name: 'Designer Loft', address: 'Mid-Beach', imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=250&fit=crop&q=80', description: 'Modern loft living with urban amenities.' },
  ];

  // Embla carousel hooks for each carousel
  const [dealsEmblaRef, dealsEmblaApi] = useEmblaCarousel({ loop: false, align: 'start' });
  const [popularEmblaRef, popularEmblaApi] = useEmblaCarousel({ loop: false, align: 'start' });
  const [uniqueEmblaRef, uniqueEmblaApi] = useEmblaCarousel({ loop: false, align: 'start' });

  const scrollPrev = (api: any) => api && api.scrollPrev();
  const scrollNext = (api: any) => api && api.scrollNext();

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

  const handleSearch = () => {
    // Parse guests string to extract adults and rooms
    const guestsMatch = guests.match(/(\d+)\s+guests?/);
    const roomsMatch = guests.match(/(\d+)\s+rooms?/);
    
    const adults = guestsMatch ? parseInt(guestsMatch[1]) : 2;
    const rooms = roomsMatch ? parseInt(roomsMatch[1]) : 1;
    
    const searchData = {
      destination,
      checkInDate,
      checkOutDate,
      adults: adults.toString(),
      children: '0',
      rooms: rooms.toString()
    };
    
    console.log('Desktop search triggered with full parameters:', searchData);
    
    // Navigate to hotel search results with all required parameters
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

  // Desktop Layout - FULL PAGE EXPERIENCE
  return (
    <div className="min-h-screen bg-background">
      <SEOHead 
        title="Hotels in Miami Beach, Florida - Find Perfect Stays | Utrippin.ai"
        description="Discover luxury resorts, boutique hotels, and budget-friendly accommodations in Miami Beach, Florida. Book your perfect stay with AI-powered search and exclusive deals."
        canonical="https://utrippin.ai/hotels"
        keywords="Miami Beach hotels, Florida hotels, luxury hotels Miami, cheap hotels Miami, family resorts Miami Beach, boutique hotels South Beach, book hotel Miami, Miami travel, UTrippIN hotels"
        structuredData={{
          "@context": "https://schema.org",
          "@graph": [
            breadcrumbs,
            hotelServiceSchema,
            {
              "@type": "WebPage",
              "@id": "https://utrippin.ai/hotels#webpage",
              "url": "https://utrippin.ai/hotels",
              "name": "Hotels in Miami Beach, Florida - Find Perfect Stays | Utrippin.ai",
              "description": "Discover luxury resorts, boutique hotels, and budget-friendly accommodations in Miami Beach, Florida. Book your perfect stay with AI-powered search and exclusive deals.",
              "inLanguage": "en-US"
            }
          ]
        }}
      />

      {/* Global Header - NEUTRAL DESIGN CONSISTENT ACROSS PLATFORM */}
      <Header />
      
      {/* Hero Section - CONTENT DYNAMICALLY POPULATED BASED ON currentDestination */}
      <section 
        className="relative h-[500px] flex items-center justify-center text-center bg-cover bg-center"
        style={{ 
          backgroundImage: "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.4)), url('https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1920&h=500&fit=crop&q=80')"
          // TODO: Background image should also be dynamic based on destination
        }}
      >
        <div className="relative z-10 max-w-4xl mx-auto px-6">
          {/* DYNAMIC HERO TITLE - Changes based on destination in production */}
          <h1 className="text-5xl font-bold text-white mb-4">
            Find Your Perfect Stay in Miami Beach, Florida
          </h1>
          {/* DYNAMIC HERO DESCRIPTION - Changes based on destination in production */}
          <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Discover luxury oceanfront resorts, charming Art Deco boutique hotels, and family-friendly accommodations in Florida's most vibrant beach destination.
          </p>

          {/* Hero Search Form */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-2xl max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <Input 
                  placeholder="Miami Beach, Florida"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="pl-10 h-12 text-base bg-gray-50 border-gray-200"
                />
              </div>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <Input 
                  placeholder="Check-in - Check-out"
                  value={`${checkInDate} - ${checkOutDate}`}
                  readOnly
                  className="pl-10 h-12 text-base bg-gray-50 border-gray-200 cursor-pointer"
                />
              </div>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <Input 
                  placeholder="Guests & Rooms"
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  className="pl-10 h-12 text-base bg-gray-50 border-gray-200"
                />
              </div>
              <Button 
                onClick={handleSearch}
                className="h-12 text-base font-semibold bg-primary hover:bg-primary/90"
              >
                <Search className="mr-2" size={20} />
                Search Hotels
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area - Split Layout */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Left Sidebar - Filters & SEO Content */}
          <aside className="lg:col-span-1 space-y-8">
            
            {/* Quick Filters */}
            <div className="bg-card rounded-2xl p-6 border border-border">
              <h3 className="text-xl font-semibold mb-6 text-foreground">Refine Your Search</h3>
              
              {/* Property Type */}
              <div className="mb-6">
                <h4 className="font-medium mb-3 text-foreground">Property Type</h4>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { name: 'Hotel', icon: Hotel },
                    { name: 'Resort', icon: Palmtree },
                    { name: 'Villa', icon: Home },
                    { name: 'Apartment', icon: Building },
                    { name: 'Boutique Hotel', icon: Sparkles },
                    { name: 'Motel', icon: Car },
                    { name: 'Bed & Breakfast', icon: Coffee },
                    { name: 'Hostel', icon: Users },
                    { name: 'Guesthouse', icon: Home },
                    { name: 'Lodge', icon: TreePine },
                    { name: 'Inn', icon: MapPin },
                    { name: 'All-Inclusive Resort', icon: Crown }
                  ].map((type) => (
                    <Button
                      key={type.name}
                      variant="outline"
                      className="justify-start gap-2 h-10 text-sm"
                    >
                      <type.icon size={16} />
                      {type.name}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Star Rating */}
              <div className="mb-6">
                <h4 className="font-medium mb-3 text-foreground">Star Rating</h4>
                <div className="space-y-2">
                  {[5, 4, 3, 2].map((stars) => (
                    <label key={stars} className="flex items-center space-x-2 cursor-pointer">
                      <input type="checkbox" className="rounded border-gray-300" />
                      <div className="flex">
                        {Array.from({ length: stars }).map((_, i) => (
                          <Star key={i} size={16} className="text-yellow-400 fill-current" />
                        ))}
                      </div>
                      <span className="text-sm">& up</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="font-medium mb-3 text-foreground">Price Range</h4>
                <div className="space-y-2">
                  {[
                    { label: 'Under $100', range: '$0 - $100' },
                    { label: '$100 - $250', range: '$100 - $250' },
                    { label: '$250 - $500', range: '$250 - $500' },
                    { label: 'Over $500', range: '$500+' }
                  ].map((price) => (
                    <label key={price.label} className="flex items-center space-x-2 cursor-pointer">
                      <input type="checkbox" className="rounded border-gray-300" />
                      <span className="text-sm">{price.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Amenities */}
              <div>
                <h4 className="font-medium mb-3 text-foreground">Popular Amenities</h4>
                <div className="space-y-2">
                  {[
                    { name: 'Free WiFi', icon: Wifi },
                    { name: 'Pool', icon: Hotel },
                    { name: 'Fitness Center', icon: Dumbbell },
                    { name: 'Parking', icon: Car },
                    { name: 'Beach Access', icon: Hotel },
                    { name: 'Spa', icon: Hotel }
                  ].map((amenity) => (
                    <label key={amenity.name} className="flex items-center space-x-2 cursor-pointer">
                      <input type="checkbox" className="rounded border-gray-300" />
                      <amenity.icon size={16} className="text-gray-400" />
                      <span className="text-sm">{amenity.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* SEO Content Block - CONTENT DYNAMICALLY POPULATED BASED ON currentDestination */}
            <div className="bg-card rounded-2xl p-6 border border-border">
              {/* DYNAMIC SEO TITLE - Changes based on destination in production */}
              <h3 className="text-lg font-semibold mb-4 text-foreground">About Miami Beach, Florida Hotels</h3>
              {/* DYNAMIC SEO CONTENT - Fetched from database or Edge Function in production */}
              <div className="text-sm text-muted-foreground space-y-3">
                <p>
                  Miami Beach, Florida, offers an unparalleled vacation experience with its pristine sandy beaches, 
                  vibrant Art Deco architecture, and world-class accommodations. From luxury oceanfront resorts 
                  to charming boutique hotels, there's a perfect stay for every traveler.
                </p>
                <p>
                  Popular areas include South Beach with its energetic nightlife, Mid-Beach for upscale relaxation, 
                  and North Beach for a more local, authentic experience. Many hotels feature stunning ocean views, 
                  multiple pools, spa services, and easy beach access.
                </p>
                <p>
                  Whether you're planning a romantic getaway, family vacation, or business trip, Miami Beach's 
                  hotels provide exceptional service, prime locations, and unforgettable experiences in the 
                  heart of Florida's most iconic destination.
                </p>
                {/* TODO: Add more dynamic SEO content, keywords, and internal links for better search ranking */}
              </div>
            </div>

            {/* Popular Destinations */}
            <div className="bg-card rounded-2xl p-6 border border-border">
              <h3 className="text-lg font-semibold mb-4 text-foreground">Popular Destinations</h3>
              <div className="flex flex-wrap gap-2">
                {['New York', 'Los Angeles', 'Las Vegas', 'Orlando', 'San Francisco'].map((city) => (
                  <Button
                    key={city}
                    variant="outline"
                    size="sm"
                    className="text-xs"
                  >
                    {city}
                  </Button>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Content - Map & Results */}
          <div className="lg:col-span-3 space-y-8">
            
            {/* Interactive Map Placeholder */}
            <div className="bg-card rounded-2xl border border-border overflow-hidden">
              <div className="h-80 bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center relative">
                <div className="text-center">
                  <div className="text-6xl mb-4">🗺️</div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">Interactive Map View</h3>
                  <p className="text-gray-600">Miami Beach Hotels with Real-time Availability</p>
                  <p className="text-sm text-gray-500 mt-1">(Mapbox GL integration)</p>
                </div>
                {/* Map markers overlay */}
                <div className="absolute top-1/4 left-1/3 text-2xl">📍</div>
                <div className="absolute top-1/2 right-1/4 text-2xl">📍</div>
                <div className="absolute bottom-1/3 left-1/2 text-2xl">📍</div>
              </div>
            </div>

            {/* Search Results Header */}
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-bold text-foreground">Hotels in Miami Beach, Florida</h2>
                <p className="text-muted-foreground mt-1">
                  May 7 - May 9, 2025 • 2 guests, 1 room
                </p>
                <p className="text-sm text-muted-foreground">
                  {nearbyLoading ? 'Searching hotels...' : `${nearbyHotels?.length || 0} properties found`}
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">Sort by Price</Button>
                <Button variant="outline" size="sm">Sort by Rating</Button>
              </div>
            </div>

            {/* Hotel Results */}
            <div className="space-y-6">
              {nearbyLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Finding the best hotels for you...</h3>
                  <p className="text-muted-foreground">Searching Miami Beach properties</p>
                </div>
              ) : nearbyHotels && nearbyHotels.length > 0 ? (
                nearbyHotels.map((hotel) => (
                  <HotelCardDesktop key={hotel.id} hotel={hotel} onHotelSelect={handleHotelSelect} />
                ))
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🏨</div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">No hotels found</h3>
                  <p className="text-muted-foreground">Try adjusting your search criteria or dates</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Dynamic Carousel Sections for Discovery & SEO */}
      
      {/* Section 1: Top Deals for a Last-Minute Getaway */}
      <section className="py-12 bg-muted/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-foreground">Top Deals for a Last-Minute Getaway in Miami Beach</h2>
            <div className="flex space-x-2">
              <Button variant="ghost" size="icon" onClick={() => scrollPrev(dealsEmblaApi)}>
                <ArrowLeft size={20} />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => scrollNext(dealsEmblaApi)}>
                <ArrowRight size={20} />
              </Button>
            </div>
          </div>
          
          <div className="overflow-hidden" ref={dealsEmblaRef}>
            <div className="flex gap-6">
              {dealsData.map((deal) => (
                <div key={deal.id} className="flex-shrink-0 w-80">
                  <div className="bg-card rounded-2xl overflow-hidden border border-border hover:shadow-lg transition-shadow">
                    <img 
                      src={deal.imageUrl} 
                      alt={deal.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-6">
                      <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full inline-block mb-3">
                        {deal.discount} OFF
                      </div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">{deal.name}</h3>
                      <p className="text-muted-foreground text-sm mb-4">{deal.address}</p>
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-2xl font-bold text-foreground">${deal.price}</span>
                          <span className="text-sm line-through text-muted-foreground ml-2">${deal.originalPrice}</span>
                        </div>
                        <Button size="sm">View Deal</Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Explore Stays in Popular Destinations */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-foreground">Explore Stays in Popular Destinations</h2>
            <div className="flex space-x-2">
              <Button variant="ghost" size="icon" onClick={() => scrollPrev(popularEmblaApi)}>
                <ArrowLeft size={20} />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => scrollNext(popularEmblaApi)}>
                <ArrowRight size={20} />
              </Button>
            </div>
          </div>
          
          <div className="overflow-hidden" ref={popularEmblaRef}>
            <div className="flex gap-6">
              {popularDestinations.map((destination) => (
                <div key={destination.id} className="flex-shrink-0 w-64">
                  <div className="bg-card rounded-2xl overflow-hidden border border-border hover:shadow-lg transition-shadow cursor-pointer">
                    <img 
                      src={destination.imageUrl} 
                      alt={destination.name}
                      className="w-full h-40 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-foreground mb-1">{destination.name}</h3>
                      <p className="text-muted-foreground text-sm">{destination.hotelsCount}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Explore These Unique Stays */}
      <section className="py-12 bg-muted/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-foreground">Explore These Unique Stays in Miami Beach</h2>
            <div className="flex space-x-2">
              <Button variant="ghost" size="icon" onClick={() => scrollPrev(uniqueEmblaApi)}>
                <ArrowLeft size={20} />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => scrollNext(uniqueEmblaApi)}>
                <ArrowRight size={20} />
              </Button>
            </div>
          </div>
          
          <div className="overflow-hidden" ref={uniqueEmblaRef}>
            <div className="flex gap-6">
              {uniqueStays.map((stay) => (
                <div key={stay.id} className="flex-shrink-0 w-80">
                  <div className="bg-card rounded-2xl overflow-hidden border border-border hover:shadow-lg transition-shadow">
                    <img 
                      src={stay.imageUrl} 
                      alt={stay.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-foreground mb-2">{stay.name}</h3>
                      <p className="text-muted-foreground text-sm mb-2">{stay.address}</p>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{stay.description}</p>
                      <Button size="sm" className="w-full">Explore</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Hotels Section */}
      <section className="bg-muted/30 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">Featured Miami Beach Hotels</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Handpicked luxury resorts, boutique stays, and family-friendly hotels offering the best Miami Beach experience
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {nearbyHotels?.slice(0, 3).map((hotel) => (
              <div key={`featured-${hotel.id}`} className="bg-card rounded-2xl overflow-hidden border border-border hover:shadow-lg transition-shadow">
                <img 
                  src={hotel.image} 
                  alt={hotel.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-2">{hotel.name}</h3>
                  <div className="flex items-center mb-3">
                    <div className="flex items-center">
                      <Star size={16} className="text-yellow-400 fill-current mr-1" />
                      <span className="font-medium">{hotel.rating}</span>
                    </div>
                    <span className="text-muted-foreground ml-2">(1,234 reviews)</span>
                  </div>
                  <p className="text-muted-foreground text-sm mb-4">
                    Experience luxury at this premier Miami Beach location with world-class amenities and stunning ocean views.
                  </p>
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-2xl font-bold text-foreground">${hotel.price}</span>
                      <span className="text-muted-foreground">/night</span>
                    </div>
                    <Button>View Details</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hotel Categories Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">Explore Hotels by Category</h2>
            <p className="text-xl text-muted-foreground">Find exactly what you're looking for</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: 'Luxury Resorts', count: '15+', color: 'bg-gradient-to-br from-purple-500 to-pink-500' },
              { name: 'Boutique Hotels', count: '25+', color: 'bg-gradient-to-br from-blue-500 to-cyan-500' },
              { name: 'Family Friendly', count: '30+', color: 'bg-gradient-to-br from-green-500 to-emerald-500' },
              { name: 'Budget Hotels', count: '40+', color: 'bg-gradient-to-br from-orange-500 to-red-500' },
              { name: 'Beachfront', count: '20+', color: 'bg-gradient-to-br from-teal-500 to-blue-500' },
              { name: 'Pet Friendly', count: '18+', color: 'bg-gradient-to-br from-indigo-500 to-purple-500' },
              { name: 'Business Hotels', count: '12+', color: 'bg-gradient-to-br from-gray-600 to-gray-800' },
              { name: 'Spa Resorts', count: '8+', color: 'bg-gradient-to-br from-pink-500 to-rose-500' }
            ].map((category) => (
              <Button
                key={category.name}
                variant="outline"
                className="h-24 flex flex-col items-center justify-center gap-2 border-2 hover:border-primary/50 transition-colors"
              >
                <div className={`w-8 h-8 rounded-full ${category.color}`}></div>
                <div className="text-center">
                  <div className="font-semibold text-sm">{category.name}</div>
                  <div className="text-xs text-muted-foreground">{category.count} hotels</div>
                </div>
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter & Footer */}
      <Footer />
      <BackToTop />
    </div>
  );
}