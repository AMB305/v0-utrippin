import React, { useState, useEffect } from "react";
import ProductLayout from "@/components/ProductLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Calendar, Users, Heart, Star, Loader, MessageCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import TravelBuddyFilters from "@/components/TravelBuddyFilters";
import EnhancedTravelBuddyCard from "@/components/EnhancedTravelBuddyCard";
import SignUpWall from "@/components/SignUpWall";
import { travelBuddyService, BrowseFilters } from "@/services/TravelBuddyService";
import { tripService, TripFilters, PublicTrip } from "@/services/TripService";
import { useAuth } from "@/hooks/useAuth";
import { SEOHead } from "@/components/SEOHead";

// Import travel buddy images for fallback content
import travelBuddy1 from "@/assets/travel-buddy-1.jpg";
import travelBuddy2 from "@/assets/travel-buddy-2.jpg";
import travelBuddy3 from "@/assets/travel-buddy-3.jpg";
import travelBuddy4 from "@/assets/travel-buddy-4.jpg";
import travelBuddy5 from "@/assets/travel-buddy-5.jpg";

const TravelBuddies = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchDestination, setSearchDestination] = useState("");
  const [filters, setFilters] = useState<BrowseFilters & TripFilters>({});
  const [travelers, setTravelers] = useState([]);
  const [trips, setTrips] = useState<PublicTrip[]>([]);
  const [popularDestinations, setPopularDestinations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [signUpWall, setSignUpWall] = useState({ isOpen: false, feature: 'connect', title: '', description: '' });

  // Load data when filters change
  useEffect(() => {
    loadData();
  }, [filters]);

  const loadData = async (isLoadMore = false) => {
    setLoading(true);
    try {
      const currentPage = isLoadMore ? page + 1 : 0;
      const limit = 20;
      const offset = currentPage * limit;

      // Load travelers
      const travelersData = await travelBuddyService.getPotentialBuddies(
        user?.id, 
        filters, 
        limit, 
        offset
      );

      // Load trips
      const tripsData = await tripService.getPublicTrips(filters, limit, offset);

      // Load popular destinations
      const destinationsData = await tripService.getPopularDestinations(10);

      if (isLoadMore) {
        setTravelers(prev => [...prev, ...travelersData]);
        setTrips(prev => [...prev, ...tripsData]);
        setPage(currentPage);
      } else {
        setTravelers(travelersData);
        setTrips(tripsData);
        setPage(0);
      }

      setPopularDestinations(destinationsData);
      setHasMore(travelersData.length === limit || tripsData.length === limit);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLocationSuggestions = async (query: string) => {
    return await travelBuddyService.searchByLocation(query);
  };

  const handleDestinationSuggestions = async (query: string) => {
    return await tripService.searchDestinations(query);
  };

  const handleSignUpTrigger = (feature = 'connect', title?: string, description?: string) => {
    if (user) {
      // User is already logged in, proceed with action
      return;
    }
    setSignUpWall({ 
      isOpen: true, 
      feature, 
      title: title || '', 
      description: description || '' 
    });
  };

  const closeSignUpWall = () => {
    setSignUpWall({ isOpen: false, feature: 'connect', title: '', description: '' });
  };

  const handleSearch = () => {
    if (searchDestination) {
      setFilters(prev => ({ ...prev, destination: searchDestination }));
    }
  };

  // Mock travel buddies data organized by region
  const mockAmericaTravelers = [
    {
      id: 'am-1',
      email: 'alex.rivera@email.com',
      location: 'New York City',
      age: 28,
      bio: 'First time exploring the Pacific Coast. Starting with California, making day trips to nearby cities.',
      interests: ['photography', 'food', 'culture'],
      travel_style: 'Relaxed explorer',
      preferred_destinations: ['Los Angeles', 'San Francisco', 'Portland'],
      profile_photo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      compatibility_score: 0.92,
      verified: true,
      created_at: '2025-01-01T00:00:00Z',
      languages_spoken: ['English', 'Spanish'],
      public_profile: true,
      stripe_customer_id: null,
      subscription_status: null
    },
    {
      id: 'am-2', 
      email: 'maria.gonzalez@email.com',
      location: 'Mexico City',
      age: 25,
      bio: 'Looking to visit and explore the Canadian Rockies for the first time this summer.',
      interests: ['hiking', 'nature', 'adventure'],
      travel_style: 'Adventure seeker',
      preferred_destinations: ['Banff', 'Jasper', 'Vancouver'],
      profile_photo_url: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400',
      compatibility_score: 0.88,
      verified: false,
      created_at: '2025-01-01T00:00:00Z',
      languages_spoken: ['Spanish', 'English'],
      public_profile: true,
      stripe_customer_id: null,
      subscription_status: null
    },
    {
      id: 'am-3',
      email: 'james.wilson@email.com', 
      location: 'Toronto',
      age: 31,
      bio: 'Road trip from Toronto to Miami. Looking for travel companions who enjoy good music and great food.',
      interests: ['music', 'road trips', 'local cuisine'],
      travel_style: 'Social traveler',
      preferred_destinations: ['Miami', 'Nashville', 'Austin'],
      profile_photo_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
      compatibility_score: 0.85,
      verified: false,
      created_at: '2025-01-01T00:00:00Z',
      languages_spoken: ['English', 'French'],
      public_profile: true,
      stripe_customer_id: null,
      subscription_status: null
    },
    {
      id: 'am-4',
      email: 'sarah.johnson@email.com',
      location: 'Chicago',
      age: 29,
      bio: 'Relaxing entertainment and cultural exploration. Travel comfort is important to me.',
      interests: ['theater', 'museums', 'fine dining'],
      travel_style: 'Cultural explorer',
      preferred_destinations: ['Boston', 'Washington DC', 'Montreal'],
      profile_photo_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
      compatibility_score: 0.91,
      verified: true,
      created_at: '2025-01-01T00:00:00Z',
      languages_spoken: ['English'],
      public_profile: true,
      stripe_customer_id: null,
      subscription_status: null
    }
  ];

  const mockAmericaTrips = [
    {
      id: 'at-1',
      title: 'First time visit to California',
      destination: 'Los Angeles',
      country: 'USA',
      start_date: '2025-07-15',
      end_date: '2025-07-22',
      duration_days: 8,
      budget: 1500,
      max_buddies: 3,
      spots_available: 2,
      participants_count: 1,
      trip_type: 'Cultural exploration',
      ai_generated: false,
      ai_prompt: null,
      created_at: '2025-01-01T00:00:00Z',
      currency: 'USD',
      itinerary_json: null,
      looking_for_buddies: true,
      public: true,
      status: 'planning',
      updated_at: '2025-01-01T00:00:00Z',
      user_id: 'am-1',
      organizer: {
        id: 'am-1',
        email: 'alex.rivera@email.com',
        profile_photo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
        location: 'New York City',
        age: 28,
        bio: null,
        interests: null,
        travel_style: null,
        preferred_destinations: null,
        compatibility_score: null
      }
    },
    {
      id: 'at-2',
      title: 'Canadian Rockies adventure',
      destination: 'Banff',
      country: 'Canada', 
      start_date: '2025-08-01',
      end_date: '2025-08-14',
      duration_days: 14,
      budget: 2200,
      max_buddies: 4,
      spots_available: 3,
      participants_count: 1,
      trip_type: 'Adventure hiking',
      ai_generated: false,
      ai_prompt: null,
      created_at: '2025-01-01T00:00:00Z',
      currency: 'USD',
      itinerary_json: null,
      looking_for_buddies: true,
      public: true,
      status: 'planning',
      updated_at: '2025-01-01T00:00:00Z',
      user_id: 'am-2',
      organizer: {
        id: 'am-2',
        email: 'maria.gonzalez@email.com',
        profile_photo_url: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400',
        location: 'Mexico City',
        age: 25,
        bio: null,
        interests: null,
        travel_style: null,
        preferred_destinations: null,
        compatibility_score: null
      }
    }
  ];

  const mockEuropeTravelers = [
    {
      id: 'eu-1',
      email: 'elena.martinez@email.com',
      location: 'Madrid',
      age: 26,
      bio: 'Visiting Spain for the first time. Starting with cultural Madrid, making day trips to nearby cities.',
      interests: ['art', 'history', 'tapas'],
      travel_style: 'Cultural explorer',
      preferred_destinations: ['Barcelona', 'Seville', 'Valencia'],
      profile_photo_url: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400',
      compatibility_score: 0.89,
      verified: false,
      created_at: '2025-01-01T00:00:00Z',
      languages_spoken: ['Spanish', 'English'],
      public_profile: true,
      stripe_customer_id: null,
      subscription_status: null
    },
    {
      id: 'eu-2',
      email: 'pierre.dubois@email.com',
      location: 'Agde',
      age: 24,
      bio: 'Looking to visit and explore Cap d\'Agde for the first time this summer.',
      interests: ['beaches', 'sailing', 'photography'],
      travel_style: 'Beach lover',
      preferred_destinations: ['Nice', 'Cannes', 'Monaco'],
      profile_photo_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
      compatibility_score: 0.86,
      verified: false,
      created_at: '2025-01-01T00:00:00Z',
      languages_spoken: ['French', 'English'],
      public_profile: true,
      stripe_customer_id: null,
      subscription_status: null
    },
    {
      id: 'eu-3',
      email: 'ana.lopez@email.com',
      location: 'San Sebastián',
      age: 27,
      bio: 'Traveling to San Sebastián. Looking for solo travelers to enjoy pintxos and socializing.',
      interests: ['food', 'nightlife', 'culture'],
      travel_style: 'Foodie explorer',
      preferred_destinations: ['Bilbao', 'Barcelona', 'Porto'],
      profile_photo_url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400',
      compatibility_score: 0.93,
      verified: true,
      created_at: '2025-01-01T00:00:00Z',
      languages_spoken: ['Spanish', 'English'],
      public_profile: true,
      stripe_customer_id: null,
      subscription_status: null
    },
    {
      id: 'eu-4',
      email: 'erik.hansen@email.com',
      location: 'Amsterdam',
      age: 35,
      bio: 'Road trip from Amsterdam to Spain. I would like someone to join me two days in Amsterdam.',
      interests: ['road trips', 'cycling', 'local culture'],
      travel_style: 'Adventurous',
      preferred_destinations: ['Paris', 'Barcelona', 'Madrid'],
      profile_photo_url: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=400',
      compatibility_score: 0.82,
      verified: false,
      created_at: '2025-01-01T00:00:00Z',
      languages_spoken: ['Dutch', 'English'],
      public_profile: true,
      stripe_customer_id: null,
      subscription_status: null
    }
  ];

  const mockAsiaTrips = [
    {
      id: 'as-1',
      title: 'Weekend in Tokyo',
      destination: 'Tokyo',
      country: 'Japan',
      start_date: '2025-08-15',
      end_date: '2025-08-17',
      duration_days: 3,
      budget: 800,
      max_buddies: 2,
      spots_available: 1,
      participants_count: 1,
      trip_type: 'City exploration',
      ai_generated: false,
      ai_prompt: null,
      created_at: '2025-01-01T00:00:00Z',
      currency: 'USD',
      itinerary_json: null,
      looking_for_buddies: true,
      public: true,
      status: 'planning',
      updated_at: '2025-01-01T00:00:00Z',
      user_id: 'as-1',
      organizer: {
        id: 'as-1',
        email: 'yuki.tanaka@email.com',
        profile_photo_url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400',
        location: 'Osaka',
        age: 30,
        bio: null,
        interests: null,
        travel_style: null,
        preferred_destinations: null,
        compatibility_score: null
      }
    },
    {
      id: 'as-2',
      title: 'Singapore discovery: 6-7 nights',
      destination: 'Singapore',
      country: 'Singapore',
      start_date: '2025-07-14',
      end_date: '2025-07-21',
      duration_days: 8,
      budget: 1200,
      max_buddies: 3,
      spots_available: 2,
      participants_count: 1,
      trip_type: 'Urban adventure',
      ai_generated: false,
      ai_prompt: null,
      created_at: '2025-01-01T00:00:00Z',
      currency: 'USD',
      itinerary_json: null,
      looking_for_buddies: true,
      public: true,
      status: 'planning',
      updated_at: '2025-01-01T00:00:00Z',
      user_id: 'as-2',
      organizer: {
        id: 'as-2',
        email: 'li.wei@email.com',
        profile_photo_url: 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=400',
        location: 'Singapore',
        age: 28,
        bio: null,
        interests: null,
        travel_style: null,
        preferred_destinations: null,
        compatibility_score: null
      }
    }
  ];

  // Mock data for locals and stories sections
  const mockLocals = [
    {
      id: '1',
      name: "Sarah",
      city: "Lisbon", 
      tagline: "Happy to show off my favorite rooftops and Fado spots!",
      image: travelBuddy3,
      rating: 4.9,
    },
    {
      id: '2',
      name: "Marco",
      city: "Rome",
      tagline: "Gelato & ruins tour specialist", 
      image: travelBuddy4,
      rating: 5.0,
    },
    {
      id: '3',
      name: "Yuki",
      city: "Kyoto",
      tagline: "Hidden temples and authentic ramen spots",
      image: travelBuddy5,
      rating: 4.8,
    },
  ];

  const mockStories = [
    {
      id: 1,
      user: "Jenna",
      content: "Hiking volcanoes in Guatemala with new buds!",
      image: travelBuddy1,
      likes: 23,
    },
    {
      id: 2,
      user: "Alex", 
      content: "Tokyo nights with strangers turned friends.",
      image: travelBuddy2,
      likes: 45,
    },
    {
      id: 3,
      user: "Maya",
      content: "Sunset surf session in Bali - perfect end to the day",
      image: travelBuddy3,
      likes: 67,
    },
  ];

  return (
    <>
      <SEOHead 
        title="Find Travel Buddies | Connect with Fellow Travelers | Utrippin"
        description="Connect with like-minded travelers worldwide. Find travel buddies, join group trips, and create amazing adventures together with Utrippin's travel buddy matching service."
        canonical="https://utrippin.ai/travel-buddies"
        keywords="travel buddies, travel companions, group travel, solo travel, travel matching, find travel partners"
        structuredData={{
          "@context": "https://schema.org/",
          "@type": "Product",
          "name": "Travel Buddy Matching Service - Utrippin.ai",
          "image": ["https://utrippin.ai/travel-buddy-1.jpg"],
          "description": "Connect with like-minded travelers through our AI-powered travel buddy matching service. Find your perfect travel companion for safe, fun, and affordable adventures.",
          "sku": "TBM-001",
          "brand": {"@type": "Brand", "name": "Utrippin.ai"},
          "category": "Travel Matching Services",
          "offers": {
            "@type": "Offer",
            "url": "https://utrippin.ai/travel-buddies",
            "priceCurrency": "USD",
            "price": "29.99",
            "priceValidUntil": "2025-12-31",
            "itemCondition": "https://schema.org/NewCondition",
            "availability": "https://schema.org/InStock",
            "seller": {"@type": "Organization", "name": "Utrippin.ai"}
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.6",
            "reviewCount": "189",
            "bestRating": "5",
            "worstRating": "1"
          },
          "review": [{
            "@type": "Review",
            "author": {"@type": "Person", "name": "Sarah Mitchell"},
            "datePublished": "2025-01-12",
            "description": "Found an amazing travel buddy for my trip to Ghana! The matching algorithm really understood my preferences and travel style.",
            "name": "Perfect travel companion match",
            "reviewRating": {"@type": "Rating", "ratingValue": "5", "bestRating": "5"}
          }]
        }}
      />
    <ProductLayout>
      <div className="min-h-screen bg-gradient-to-b from-travel-light to-background">
        {/* Enhanced Hero Section */}
        <section className="relative py-20 px-4 bg-gradient-to-br from-primary/10 via-accent/5 to-background overflow-hidden">
          <div className="absolute inset-0 bg-[url('/lovable-uploads/hero-background.jpg')] bg-cover bg-center opacity-20" />
          <div className="container mx-auto text-center max-w-5xl relative z-10">
            <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
              Find A Travel Buddy,<br />
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Create Amazing Adventures
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Connect with fellow adventurers from around the world. Plan together, travel safely, and create unforgettable memories.
            </p>
            
            <div className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-3 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  placeholder="Where are you traveling to?"
                  value={searchDestination}
                  onChange={(e) => setSearchDestination(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-12 h-14 text-lg border-2 border-border/50 focus:border-primary"
                />
              </div>
              <Button variant="hero" onClick={handleSearch} size="lg" className="h-14 px-8 text-lg">
                Search
              </Button>
            </div>

            <div className="flex flex-wrap justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                <span><strong className="text-foreground">190+</strong> Countries</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                <span><strong className="text-foreground">40,000+</strong> Trips Started</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-primary" />
                <span><strong className="text-foreground">Safe &</strong> Verified</span>
              </div>
            </div>
          </div>
        </section>

        {/* How UTrippIN Works */}
        <section className="py-16 px-4 bg-gradient-subtle">
          <div className="container mx-auto">
            <h2 className="text-4xl font-bold text-center text-foreground mb-16">How UTrippIN Works</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Search Destination</h3>
                <p className="text-muted-foreground">Search and select a destination that you are traveling to.</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-accent" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Find Travel Partners</h3>
                <p className="text-muted-foreground">Browse through the list of trips, locals, and nearby users in that location.</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Get Connected</h3>
                <p className="text-muted-foreground">When you find someone that you want to meet up with, click connect and start chatting.</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-accent" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Trip Together</h3>
                <p className="text-muted-foreground">Plan together, meet up at a pre-decided public place and travel together.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Filters Section */}
        <section className="py-8 px-4">
          <div className="container mx-auto">
            <TravelBuddyFilters
              onFiltersChange={setFilters}
              onLocationSuggestions={handleLocationSuggestions}
              onDestinationSuggestions={handleDestinationSuggestions}
            />
          </div>
        </section>

        {/* Find Travel Buddies by Region */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <h2 className="text-4xl font-bold text-center text-foreground mb-4">
              Find Travel Buddies Worldwide
            </h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              Connect with fellow adventurers and join exciting trips organized by region
            </p>

            {/* North & Central America - Featured First */}
            <div className="mb-16">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-3xl font-bold text-foreground">🇺🇸 North & Central America</h3>
                <Button 
                  variant="travel-outline" 
                  onClick={() => setFilters(prev => ({ ...prev, destination: 'North America' }))}
                >
                  Discover North & Central America
                </Button>
              </div>
              
              {loading && page === 0 ? (
                <div className="flex justify-center py-12">
                  <Loader className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Show mock America travelers and trips */}
                {mockAmericaTravelers.map((traveler) => (
                  <EnhancedTravelBuddyCard
                    key={traveler.id}
                    traveler={traveler}
                    type="traveler"
                    onConnect={() => handleSignUpTrigger('connect', 'Connect with Travel Buddy', 'Start a conversation and plan your next adventure together!')}
                  />
                ))}
                {mockAmericaTrips.map((trip) => (
                  <EnhancedTravelBuddyCard
                    key={trip.id}
                    trip={trip}
                    type="trip"
                    onConnect={() => handleSignUpTrigger('join-trip', 'Join This Trip', 'Apply to join this exciting adventure and meet fellow travelers!')}
                  />
                ))}
              </div>
              )}
            </div>

            {/* Other Regions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Europe */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-foreground">🇪🇺 Europe</h3>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setFilters(prev => ({ ...prev, destination: 'Europe' }))}
                  >
                    View All →
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mockEuropeTravelers.map((traveler) => (
                    <EnhancedTravelBuddyCard
                      key={traveler.id}
                      traveler={traveler}
                      type="traveler"
                      className="scale-95"
                      onConnect={() => handleSignUpTrigger('connect')}
                    />
                  ))}
                </div>
              </div>

              {/* Asia & Middle East */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-foreground">🌏 Asia & Middle East</h3>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setFilters(prev => ({ ...prev, destination: 'Asia' }))}
                  >
                    View All →
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mockAsiaTrips.map((trip) => (
                    <EnhancedTravelBuddyCard
                      key={trip.id}
                      trip={trip}
                      type="trip"
                      className="scale-95"
                      onConnect={() => handleSignUpTrigger('join-trip')}
                    />
                  ))}
                </div>
              </div>

              {/* Australia & New Zealand */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-foreground">🇦🇺 Australia & New Zealand</h3>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setFilters(prev => ({ ...prev, destination: 'Australia' }))}
                  >
                    View All →
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mockEuropeTravelers.slice(2).map((traveler) => (
                    <EnhancedTravelBuddyCard
                      key={`au-${traveler.id}`}
                      traveler={traveler}
                      type="traveler"
                      className="scale-95"
                      onConnect={() => handleSignUpTrigger('connect')}
                    />
                  ))}
                </div>
              </div>

              {/* Africa & South America */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-foreground">🌍 Africa & South America</h3>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setFilters(prev => ({ ...prev, destination: 'Africa' }))}
                  >
                    View All →
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mockAsiaTrips.map((trip) => (
                    <EnhancedTravelBuddyCard
                      key={`af-${trip.id}`}
                      trip={trip}
                      type="trip"
                      className="scale-95"
                      onConnect={() => handleSignUpTrigger('join-trip')}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Load More */}
            {(mockAmericaTravelers.length > 0 || mockEuropeTravelers.length > 0) && (
              <div className="text-center mt-12">
                <Button 
                  variant="travel-outline" 
                  onClick={() => loadData(true)}
                  disabled={loading}
                  size="lg"
                >
                  {loading ? <Loader className="w-4 h-4 animate-spin mr-2" /> : null}
                  Discover More Travel Buddies
                </Button>
              </div>
            )}

            {/* Empty State */}
            {!loading && mockAmericaTravelers.length === 0 && mockEuropeTravelers.length === 0 && (
              <div className="text-center py-16">
                <MapPin className="w-20 h-20 text-muted-foreground mx-auto mb-6" />
                <h3 className="text-2xl font-semibold mb-4">No travel buddies found</h3>
                <p className="text-muted-foreground mb-6 text-lg">Try adjusting your filters or explore different destinations</p>
                <Button variant="hero" onClick={() => setFilters({})} size="lg">
                  Clear Filters & Browse All
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* Future Trips */}
        <section className="py-12 px-4 bg-gradient-card">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-foreground mb-2">
              Find Travel Buddies For Future Trips
            </h2>
            <p className="text-muted-foreground mb-8">Plan your next adventure</p>
            <p className="text-lg mb-6">Going somewhere soon? Find others traveling there.</p>
            
            {/* Trip Search */}
            <div className="max-w-2xl mx-auto mb-12">
              <div className="flex flex-col sm:flex-row gap-4 p-6 bg-background/50 backdrop-blur-sm rounded-xl border border-border">
                <Input placeholder="Destination" className="flex-1" />
                <Input placeholder="Travel dates" className="flex-1" />
                <Button variant="hero" onClick={() => handleSignUpTrigger('post-trip', 'Post Your Trip', 'Share your travel plans and find the perfect travel companions.')}>Find Buddies</Button>
              </div>
            </div>

            {/* Popular Destinations */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {popularDestinations.map((dest, index) => (
                <Card key={index} className="cursor-pointer hover:shadow-medium transition-all duration-300 overflow-hidden" onClick={() => setFilters(prev => ({ ...prev, destination: dest.destination }))}>
                  <div className="relative h-32">
                    <div className="w-full h-full bg-gradient-to-br from-primary/10 to-accent/20 flex items-center justify-center">
                      <div className="text-center">
                        <MapPin className="w-8 h-8 text-primary mx-auto mb-2" />
                        <h4 className="font-semibold text-foreground">{dest.destination}</h4>
                        <p className="text-sm text-muted-foreground">{dest.count} trips planned</p>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div className="text-center">
              <Button variant="travel-outline" onClick={() => handleSignUpTrigger('browse-profiles', 'Browse Future Trips', 'Discover and join amazing trips planned by fellow travelers.')}>
                Explore Future Trips
              </Button>
            </div>
          </div>
        </section>


        {/* Meet Locals */}
        <section className="py-12 px-4 bg-gradient-card">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-foreground mb-2">
              Locals ready to show you around
            </h2>
            <p className="text-muted-foreground mb-8">Connect with friendly locals who know the best spots</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {mockLocals.map((local) => (
                <Card key={local.id} className="cursor-pointer hover:shadow-medium transition-all duration-300" onClick={() => handleSignUpTrigger('connect', 'Connect with Locals', 'Meet friendly locals who know the best hidden spots and authentic experiences.')}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <img
                        src={local.image}
                        alt={local.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg">{local.name}, {local.city}</h4>
                        <div className="flex items-center gap-1 mb-2">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-medium">{local.rating}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{local.tagline}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center">
              <Button variant="travel-outline" onClick={() => handleSignUpTrigger('connect', 'Meet Locals', 'Connect with friendly locals who know the best spots.')}>
                Meet Locals
              </Button>
            </div>
          </div>
        </section>

        {/* Travel Stories Feed */}
        <section className="py-12 px-4">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-foreground mb-2">
              Recent adventures shared by travelers
            </h2>
            <p className="text-muted-foreground mb-8">Get inspired by amazing travel stories</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {mockStories.map((story) => (
                <Card key={story.id} className="cursor-pointer hover:shadow-medium transition-all duration-300 overflow-hidden" onClick={() => handleSignUpTrigger('browse-profiles', 'View Travel Stories', 'Get inspired by amazing travel adventures and share your own stories.')}>
                  <div className="relative h-48">
                    <img src={story.image} alt="Travel story" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-overlay" />
                  </div>
                  <CardContent className="p-4">
                    <p className="font-medium mb-2">{story.content}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">- {story.user}</span>
                      <div className="flex items-center gap-1">
                        <Heart className="w-4 h-4 text-red-500" />
                        <span className="text-sm">{story.likes}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center">
              <Button variant="travel-outline" onClick={() => handleSignUpTrigger('post-trip', 'Share Your Adventures', 'Sign up to share your travel stories and inspire other adventurers.')}>
                Sign up to share your adventures
              </Button>
            </div>
          </div>
        </section>

        {/* Sign Up Wall Modal */}
        <SignUpWall
          isOpen={signUpWall.isOpen}
          onClose={closeSignUpWall}
          triggerSource="travel-buddies"
        />
      </div>
    </ProductLayout>
    </>
  );
};

export default TravelBuddies;
