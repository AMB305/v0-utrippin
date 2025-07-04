import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label.jsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import { Checkbox } from "../components/ui/checkbox";
import { Slider } from "../components/ui/slider";
import { Star, MapPin, Calendar, Users, Search, Filter, SortAsc, Heart, Clock, Plane, Hotel, Car, Camera, Utensils, Shield, Award, CheckCircle, ArrowRight } from "lucide-react";
import Header from "../components/layout/header";
import Footer from "../components/layout/footer";
import SEOHead from "../components/common/seo-head";

export default function PackagesPage() {
  const [searchParams, setSearchParams] = useState({
    destination: "",
    departureDate: "",
    duration: "7",
    travelers: "2",
    budget: "medium"
  });

  const [filters, setFilters] = useState({
    priceRange: [500, 5000],
    packageType: [],
    duration: "any",
    rating: 0,
    activities: [],
    sortBy: "price"
  });

  const [displayCount, setDisplayCount] = useState(6);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const handleInputChange = (field, value) => {
    setSearchParams(prev => ({ ...prev, [field]: value }));
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
  };

  const handleSearch = () => {
    console.log("Searching packages with:", searchParams);
  };

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setDisplayCount(prev => prev + 6);
      setIsLoadingMore(false);
    }, 1000);
  };

  // Featured vacation packages
  const featuredPackages = [
    {
      id: 1,
      title: "Hawaiian Paradise Escape",
      destination: "Maui, Hawaii",
      duration: "7 days, 6 nights",
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&h=400&fit=crop",
      originalPrice: 2899,
      price: 1999,
      savings: 31,
      rating: 4.8,
      reviews: 2341,
      travelers: "2 adults",
      dealType: "Best Value",
      highlights: ["Beachfront Resort", "Snorkeling Tour", "Luau Dinner", "Rental Car"],
      included: {
        flight: "Round-trip flights from LAX",
        hotel: "5★ Grand Wailea Resort",
        activities: "3 tours included",
        extras: "Daily breakfast, Airport transfers"
      },
      itinerary: [
        { day: 1, title: "Arrival & Beach Time", description: "Check-in and sunset dinner" },
        { day: 2, title: "Snorkeling Adventure", description: "Molokini Crater tour" },
        { day: 3, title: "Road to Hana", description: "Scenic coastal drive" },
        { day: 4, title: "Free Day", description: "Relax at resort or explore" },
        { day: 5, title: "Cultural Experience", description: "Traditional luau dinner" },
        { day: 6, title: "Final Beach Day", description: "Last day in paradise" },
        { day: 7, title: "Departure", description: "Check-out and flight home" }
      ],
      packageType: "Beach & Relaxation",
      theme: "bg-gradient-to-br from-blue-500 to-teal-600"
    },
    {
      id: 2,
      title: "European Grand Tour",
      destination: "Paris, Rome, Barcelona",
      duration: "10 days, 9 nights",
      image: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=600&h=400&fit=crop",
      originalPrice: 3499,
      price: 2699,
      savings: 23,
      rating: 4.9,
      reviews: 1876,
      travelers: "2 adults",
      dealType: "Cultural Explorer",
      highlights: ["Historic Cities", "High-Speed Rail", "Museum Passes", "Local Guides"],
      included: {
        flight: "Round-trip flights + inter-city",
        hotel: "4★ Central hotels",
        activities: "City tours & museum passes",
        extras: "Rail passes, Local guides"
      },
      itinerary: [
        { day: 1, title: "Arrive Paris", description: "Eiffel Tower welcome dinner" },
        { day: 2, title: "Paris Highlights", description: "Louvre & Seine cruise" },
        { day: 3, title: "Versailles Day Trip", description: "Palace and gardens tour" },
        { day: 4, title: "Travel to Rome", description: "High-speed train journey" },
        { day: 5, title: "Ancient Rome", description: "Colosseum & Forum tour" },
        { day: 6, title: "Vatican City", description: "Sistine Chapel & St. Peter's" },
        { day: 7, title: "Travel to Barcelona", description: "Flight to Spain" },
        { day: 8, title: "Gaudí & Gothic", description: "Sagrada Familia & Park Güell" },
        { day: 9, title: "Barcelona Beach", description: "Leisure day in the city" },
        { day: 10, title: "Departure", description: "Flight home" }
      ],
      packageType: "Cultural & Historical",
      theme: "bg-gradient-to-br from-purple-500 to-pink-600"
    },
    {
      id: 3,
      title: "African Safari Adventure",
      destination: "Kenya & Tanzania",
      duration: "8 days, 7 nights",
      image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=600&h=400&fit=crop",
      originalPrice: 4999,
      price: 3899,
      savings: 22,
      rating: 4.7,
      reviews: 987,
      travelers: "2 adults",
      dealType: "Adventure",
      highlights: ["Big Five Safari", "Luxury Lodges", "Maasai Village", "Great Migration"],
      included: {
        flight: "International + domestic flights",
        hotel: "Luxury safari lodges",
        activities: "All game drives & tours",
        extras: "All meals, Professional guide"
      },
      itinerary: [
        { day: 1, title: "Arrive Nairobi", description: "Welcome dinner & briefing" },
        { day: 2, title: "Maasai Mara", description: "First game drive" },
        { day: 3, title: "Full Day Safari", description: "Big Five hunting" },
        { day: 4, title: "Cultural Visit", description: "Maasai village experience" },
        { day: 5, title: "Serengeti", description: "Cross to Tanzania" },
        { day: 6, title: "Great Migration", description: "Witness nature's spectacle" },
        { day: 7, title: "Ngorongoro Crater", description: "Final game drive" },
        { day: 8, title: "Departure", description: "Flight home via Kilimanjaro" }
      ],
      packageType: "Adventure & Wildlife",
      theme: "bg-gradient-to-br from-orange-500 to-red-600"
    },
    {
      id: 4,
      title: "Japan Discovery Journey",
      destination: "Tokyo, Kyoto, Osaka",
      duration: "9 days, 8 nights",
      image: "https://images.unsplash.com/photo-1513407030348-c983a97b98d8?w=600&h=400&fit=crop",
      originalPrice: 3799,
      price: 2999,
      savings: 21,
      rating: 4.9,
      reviews: 1542,
      travelers: "2 adults",
      dealType: "Cultural Immersion",
      highlights: ["Temples & Gardens", "Bullet Train", "Sushi Making", "Mount Fuji"],
      included: {
        flight: "Round-trip flights",
        hotel: "Traditional ryokans & modern hotels",
        activities: "Cultural experiences & tours",
        extras: "JR Pass, English guide"
      },
      itinerary: [
        { day: 1, title: "Arrive Tokyo", description: "Shibuya & Harajuku exploration" },
        { day: 2, title: "Tokyo Modern", description: "Skytree & Ginza district" },
        { day: 3, title: "Mount Fuji Day Trip", description: "5th Station & Lake Kawaguchi" },
        { day: 4, title: "Travel to Kyoto", description: "Bullet train experience" },
        { day: 5, title: "Kyoto Temples", description: "Fushimi Inari & Kiyomizu" },
        { day: 6, title: "Traditional Arts", description: "Tea ceremony & geisha district" },
        { day: 7, title: "Osaka Food Tour", description: "Street food & sake tasting" },
        { day: 8, title: "Free Day", description: "Last-minute shopping" },
        { day: 9, title: "Departure", description: "Flight home from Osaka" }
      ],
      packageType: "Cultural & Culinary",
      theme: "bg-gradient-to-br from-pink-500 to-purple-600"
    },
    {
      id: 5,
      title: "Caribbean Island Hopping",
      destination: "Barbados, St. Lucia, Martinique",
      duration: "8 days, 7 nights",
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&h=400&fit=crop",
      originalPrice: 2699,
      price: 1899,
      savings: 30,
      rating: 4.6,
      reviews: 3201,
      travelers: "2 adults",
      dealType: "Multi-Island",
      highlights: ["3 Islands", "Catamaran Cruise", "Snorkeling", "Rum Distillery"],
      included: {
        flight: "Round-trip + inter-island",
        hotel: "Beachfront resorts",
        activities: "Island tours & water sports",
        extras: "All transfers, Welcome drinks"
      },
      itinerary: [
        { day: 1, title: "Arrive Barbados", description: "Beach welcome dinner" },
        { day: 2, title: "Island Tour", description: "Rum distillery & beaches" },
        { day: 3, title: "Sail to St. Lucia", description: "Catamaran transfer" },
        { day: 4, title: "Pitons Adventure", description: "Hiking & snorkeling" },
        { day: 5, title: "Ferry to Martinique", description: "French Caribbean culture" },
        { day: 6, title: "Martinique Explorer", description: "Markets & rum tours" },
        { day: 7, title: "Return to Barbados", description: "Final beach day" },
        { day: 8, title: "Departure", description: "Flight home" }
      ],
      packageType: "Island & Beach",
      theme: "bg-gradient-to-br from-cyan-500 to-blue-600"
    },
    {
      id: 6,
      title: "Northern Lights Iceland",
      destination: "Reykjavik & South Coast",
      duration: "6 days, 5 nights",
      image: "https://images.unsplash.com/photo-1539593395743-7da5ee10ff07?w=600&h=400&fit=crop",
      originalPrice: 2199,
      price: 1599,
      savings: 27,
      rating: 4.8,
      reviews: 1354,
      travelers: "2 adults",
      dealType: "Natural Wonder",
      highlights: ["Northern Lights", "Blue Lagoon", "Glaciers", "Waterfalls"],
      included: {
        flight: "Round-trip flights",
        hotel: "Northern Lights hotel",
        activities: "All tours & Blue Lagoon",
        extras: "Aurora alerts, Winter gear"
      },
      itinerary: [
        { day: 1, title: "Arrive Reykjavik", description: "City tour & Blue Lagoon" },
        { day: 2, title: "Golden Circle", description: "Geysir & Gullfoss waterfall" },
        { day: 3, title: "South Coast", description: "Black sand beaches & glaciers" },
        { day: 4, title: "Ice Cave Tour", description: "Crystal ice formations" },
        { day: 5, title: "Northern Lights", description: "Aurora hunting & photography" },
        { day: 6, title: "Departure", description: "Last-minute shopping & flight" }
      ],
      packageType: "Nature & Adventure",
      theme: "bg-gradient-to-br from-indigo-500 to-cyan-600"
    }
  ];

  const packageTypes = [
    { name: "Beach & Relaxation", icon: "🏖️", color: "bg-blue-50 text-[#0068EF] border border-[#0068EF]/20" },
    { name: "Adventure & Wildlife", icon: "🦁", color: "bg-orange-50 text-[#FF6200] border border-[#FF6200]/20" },
    { name: "Cultural & Historical", icon: "🏛️", color: "bg-purple-50 text-purple-600 border border-purple-200" },
    { name: "Island & Beach", icon: "🏝️", color: "bg-cyan-50 text-cyan-600 border border-cyan-200" },
    { name: "Nature & Adventure", icon: "🏔️", color: "bg-green-50 text-green-600 border border-green-200" },
    { name: "Cultural & Culinary", icon: "🍜", color: "bg-pink-50 text-pink-600 border border-pink-200" }
  ];

  const popularDestinations = [
    { name: "Europe", deals: "From $1,599", image: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=300&h=200&fit=crop" },
    { name: "Asia", deals: "From $1,899", image: "https://images.unsplash.com/photo-1480796927426-f609979314bd?w=300&h=200&fit=crop" },
    { name: "Caribbean", deals: "From $1,299", image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=300&h=200&fit=crop" },
    { name: "Africa", deals: "From $2,599", image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=300&h=200&fit=crop" },
    { name: "South America", deals: "From $1,799", image: "https://images.unsplash.com/photo-1544550285-f813152fb2fd?w=300&h=200&fit=crop" },
    { name: "Middle East", deals: "From $1,999", image: "https://images.unsplash.com/photo-1539650116574-75c0c6d0c29e?w=300&h=200&fit=crop" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <SEOHead title="Vacation Packages: All-Inclusive Travel Deals | UTrippin" description="Book complete vacation packages with flights, hotels, and activities. Save up to 40% on bundled travel deals worldwide." />
      
      {/* Top Banner */}
      <div className="bg-[#0068EF] text-white text-sm flex justify-center py-4 px-4">
        <div className="text-center max-w-6xl mx-auto">
          <span className="font-bold mr-8">Package Deals Save More!</span>
          <span>Bundle and save up to $500 on vacation packages. <span className="underline">Learn More</span></span>
        </div>
      </div>

      <Header />
      
      <main className="pt-8">
        {/* Hero Search Section */}
        <div className="bg-gradient-to-br from-[#0068EF] to-[#0055A5] text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">All-Inclusive Vacation Packages</h1>
              <p className="text-xl text-blue-100">Save up to 40% when you bundle flights, hotels, and activities</p>
            </div>
            
            <Card className="max-w-4xl mx-auto shadow-2xl border-2 border-white/20">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <Label htmlFor="destination" className="text-[#003C8A] font-medium">Destination</Label>
                    <div className="relative mt-1">
                      <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        id="destination"
                        placeholder="Where do you want to go?"
                        value={searchParams.destination}
                        onChange={(e) => handleInputChange("destination", e.target.value)}
                        className="pl-10 border-2 border-gray-300 focus:border-[#0068EF]"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-[#003C8A] font-medium">Departure Date</Label>
                    <div className="relative mt-1">
                      <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        type="date"
                        value={searchParams.departureDate}
                        onChange={(e) => handleInputChange("departureDate", e.target.value)}
                        className="pl-10 border-2 border-gray-300 focus:border-[#0068EF]"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-[#003C8A] font-medium">Duration</Label>
                    <select 
                      value={searchParams.duration} 
                      onChange={(e) => handleInputChange("duration", e.target.value)}
                      className="mt-1 w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:border-[#0068EF] focus:outline-none"
                    >
                      <option value="3">3-4 days</option>
                      <option value="7">1 week</option>
                      <option value="10">10 days</option>
                      <option value="14">2 weeks</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div>
                    <Label className="text-[#003C8A] font-medium">Travelers</Label>
                    <select 
                      value={searchParams.travelers} 
                      onChange={(e) => handleInputChange("travelers", e.target.value)}
                      className="mt-1 w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:border-[#0068EF] focus:outline-none"
                    >
                      <option value="1">1 traveler</option>
                      <option value="2">2 travelers</option>
                      <option value="3">3 travelers</option>
                      <option value="4">4+ travelers</option>
                    </select>
                  </div>
                  
                  <div>
                    <Label className="text-[#003C8A] font-medium">Budget Range</Label>
                    <select 
                      value={searchParams.budget} 
                      onChange={(e) => handleInputChange("budget", e.target.value)}
                      className="mt-1 w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:border-[#0068EF] focus:outline-none"
                    >
                      <option value="budget">Budget ($500-1500)</option>
                      <option value="medium">Mid-range ($1500-3500)</option>
                      <option value="luxury">Luxury ($3500+)</option>
                    </select>
                  </div>
                  
                  <Button onClick={handleSearch} className="mt-6 bg-[#0068EF] hover:bg-[#0055A5] text-lg py-3" size="lg">
                    <Search className="mr-2 h-5 w-5" />
                    🌎 Search Packages
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Package Types */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h2 className="text-2xl font-bold text-[#003C8A] mb-6 text-center">Choose Your Adventure Type</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
            {packageTypes.map((type) => (
              <Card key={type.name} className="hover:shadow-md transition-shadow cursor-pointer text-center p-4 border-2 border-gray-200 hover:border-[#0068EF]">
                <CardContent className="p-2">
                  <div className="text-3xl mb-2">{type.icon}</div>
                  <h3 className="text-sm font-medium text-[#003C8A]">{type.name}</h3>
                  <Badge className={`mt-2 text-xs ${type.color}`} variant="secondary">
                    Popular
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className="lg:w-1/4">
              <Card className="sticky top-4 border-2 border-gray-200">
                <CardHeader>
                  <CardTitle className="flex items-center text-[#003C8A]">
                    <Filter className="mr-2 h-5 w-5" />
                    Filters
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Price Range */}
                  <div>
                    <Label className="font-medium text-[#003C8A]">Price Range (per person)</Label>
                    <div className="mt-2">
                      <div className="w-full h-2 bg-gray-200 rounded-full relative">
                        <div 
                          className="h-2 bg-[#0068EF] rounded-full"
                          style={{ width: `${(filters.priceRange[1] / 5000) * 100}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-sm text-gray-500 mt-1">
                        <span>${filters.priceRange[0]}</span>
                        <span>${filters.priceRange[1]}+</span>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  {/* Package Types */}
                  <div>
                    <Label className="font-medium text-[#003C8A]">Package Type</Label>
                    <div className="space-y-2 mt-2">
                      {packageTypes.map((type) => (
                        <div key={type.name} className="flex items-center space-x-2">
                          <input type="checkbox" id={`type-${type.name}`} className="rounded border-gray-300 text-[#0068EF] focus:ring-[#0068EF]" />
                          <label htmlFor={`type-${type.name}`} className="text-sm">{type.name}</label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  {/* Duration */}
                  <div>
                    <Label className="font-medium text-[#003C8A]">Duration</Label>
                    <div className="space-y-2 mt-2">
                      {["Any duration", "3-5 days", "6-8 days", "9-12 days", "13+ days"].map((duration) => (
                        <div key={duration} className="flex items-center space-x-2">
                          <input type="checkbox" id={`duration-${duration}`} className="rounded border-gray-300 text-[#0068EF] focus:ring-[#0068EF]" />
                          <label htmlFor={`duration-${duration}`} className="text-sm">{duration}</label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  {/* Rating */}
                  <div>
                    <Label className="font-medium text-[#003C8A]">Minimum Rating</Label>
                    <div className="space-y-2 mt-2">
                      {[4.5, 4.0, 3.5, 3.0].map((rating) => (
                        <div key={rating} className="flex items-center space-x-2">
                          <input type="checkbox" id={`rating-${rating}`} className="rounded border-gray-300 text-[#0068EF] focus:ring-[#0068EF]" />
                          <label htmlFor={`rating-${rating}`} className="text-sm flex items-center">
                            {rating}+ <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 ml-1" />
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Results Section */}
            <div className="lg:w-3/4">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-[#003C8A]">Featured Vacation Packages</h2>
                  <p className="text-gray-600">{featuredPackages.length} packages available</p>
                </div>
                <select 
                  value={filters.sortBy} 
                  onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                  className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#0068EF] focus:outline-none"
                >
                  <option value="price">Price: Low to High</option>
                  <option value="rating">Highest Rated</option>
                  <option value="savings">Best Savings</option>
                  <option value="duration">Duration</option>
                </select>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {featuredPackages.slice(0, displayCount).map((pkg) => (
                  <Card key={pkg.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 group border-2 border-gray-200 hover:border-[#0068EF]">
                    <div className="relative">
                      <img
                        src={pkg.image}
                        alt={pkg.title}
                        className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[#FF6200] text-white font-bold text-sm">
                        {pkg.savings}% OFF
                      </div>
                      <Badge className="absolute top-4 right-4 bg-green-600 text-white font-medium">
                        {pkg.dealType}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        className="absolute bottom-4 right-4 bg-white/90 hover:bg-white border-[#0068EF] text-[#0068EF]"
                      >
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <Badge variant="outline" className="mb-2 text-xs border-[#0068EF]/20 text-[#0068EF]">
                            {pkg.packageType}
                          </Badge>
                          <h3 className="text-xl font-bold text-[#003C8A] mb-2">{pkg.title}</h3>
                          <div className="flex items-center text-gray-600 mb-2">
                            <MapPin className="h-4 w-4 mr-1" />
                            <span className="text-sm">{pkg.destination}</span>
                          </div>
                          <div className="flex items-center text-gray-600 mb-3">
                            <Clock className="h-4 w-4 mr-1" />
                            <span className="text-sm">{pkg.duration} • {pkg.travelers}</span>
                          </div>
                          <div className="flex items-center mb-4">
                            <div className="flex items-center">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                              <span className="font-semibold">{pkg.rating}</span>
                              <span className="text-sm text-gray-500 ml-1">({pkg.reviews} reviews)</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right ml-4">
                          <div className="text-sm text-gray-500 line-through">${pkg.originalPrice}</div>
                          <div className="text-2xl font-bold text-[#0068EF]">${pkg.price}</div>
                          <div className="text-sm text-gray-600">per person</div>
                        </div>
                      </div>
                      
                      <div className="space-y-3 mb-4">
                        <div className="flex items-center text-sm">
                          <Plane className="h-4 w-4 mr-2 text-gray-500" />
                          <span>{pkg.included.flight}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Hotel className="h-4 w-4 mr-2 text-gray-500" />
                          <span>{pkg.included.hotel}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Camera className="h-4 w-4 mr-2 text-gray-500" />
                          <span>{pkg.included.activities}</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-1 mb-4">
                        {pkg.highlights.slice(0, 3).map((highlight, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs bg-blue-50 text-[#0068EF] border border-[#0068EF]/20">
                            {highlight}
                          </Badge>
                        ))}
                        {pkg.highlights.length > 3 && (
                          <Badge variant="outline" className="text-xs border-[#0068EF]/20">
                            +{pkg.highlights.length - 3} more
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex gap-2">
                        <Button variant="outline" className="flex-1 border-[#0068EF] text-[#0068EF] hover:bg-blue-50">
                          View Details
                        </Button>
                        <Button className="flex-1 bg-[#0068EF] hover:bg-[#0055A5]">
                          Book Now
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {/* Load More */}
              {displayCount < featuredPackages.length && (
                <div className="text-center mt-8">
                  <Button 
                    variant="outline" 
                    size="lg" 
                    onClick={handleLoadMore}
                    disabled={isLoadingMore}
                    className="border-[#0068EF] text-[#0068EF] hover:bg-blue-50"
                  >
                    {isLoadingMore ? "Loading..." : `Load More Packages (${featuredPackages.length - displayCount} remaining)`}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Popular Destinations */}
        <div className="bg-white py-16 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-8 text-[#003C8A]">Popular Package Destinations</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {popularDestinations.map((destination, idx) => (
                <Card key={idx} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer border-2 border-gray-200 hover:border-[#0068EF]">
                  <div className="relative">
                    <img
                      src={destination.image}
                      alt={destination.name}
                      className="w-full h-32 object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-30 flex items-end">
                      <div className="p-3 text-white">
                        <h3 className="font-bold">{destination.name}</h3>
                        <p className="text-sm opacity-90">{destination.deals}</p>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Why Book Packages */}
        <div className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12 text-[#003C8A]">Why Book a Package Deal?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="text-center border-2 border-gray-200">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="h-8 w-8 text-[#0068EF]" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-[#003C8A]">Save Up to 40%</h3>
                  <p className="text-gray-600">
                    Bundle flights, hotels, and activities for massive savings compared to booking separately.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="text-center border-2 border-gray-200">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-8 w-8 text-[#0068EF]" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-[#003C8A]">Everything Included</h3>
                  <p className="text-gray-600">
                    No hidden fees or surprise costs. Everything you need for your perfect vacation is included.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="text-center border-2 border-gray-200">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="h-8 w-8 text-[#0068EF]" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-[#003C8A]">Expertly Curated</h3>
                  <p className="text-gray-600">
                    Our travel experts hand-pick the best hotels, activities, and experiences for each destination.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}