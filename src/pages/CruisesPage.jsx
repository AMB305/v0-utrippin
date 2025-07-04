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
import { Star, MapPin, Calendar, Users, Search, Filter, SortAsc, Heart, Clock, Anchor, Ship, Waves, Utensils, Wifi, Dumbbell, Sparkles, Music, Camera, Gift, Shield, Award, Globe } from "lucide-react";
import Header from "../components/layout/header";
import Footer from "../components/layout/footer";
import SEOHead from "../components/common/seo-head";

export default function CruisesPage() {
  const [searchParams, setSearchParams] = useState({
    destination: "",
    departureDate: "",
    duration: "7",
    passengers: "2",
    cabinType: "interior"
  });

  const [filters, setFilters] = useState({
    priceRange: [200, 3000],
    cruiseLine: [],
    duration: "any",
    cabinType: [],
    amenities: [],
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
    console.log("Searching cruises with:", searchParams);
  };

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setDisplayCount(prev => prev + 6);
      setIsLoadingMore(false);
    }, 1000);
  };

  // Featured cruise deals
  const featuredCruises = [
    {
      id: 1,
      name: "Royal Caribbean - Symphony of the Seas",
      cruiseLine: "Royal Caribbean",
      destination: "Western Caribbean",
      duration: "7 nights",
      departurePort: "Miami, FL",
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&h=400&fit=crop",
      originalPrice: 1299,
      price: 899,
      savings: 31,
      rating: 4.8,
      reviews: 3247,
      shipSize: "Large Ship",
      passengers: "5,518 guests",
      dealType: "Best Seller",
      highlights: ["Perfect Day at CocoCay", "Central Park", "Broadway Shows", "FlowRider Surf"],
      itinerary: ["Miami", "Perfect Day CocoCay", "Cozumel", "Roatan", "Costa Maya", "Miami"],
      amenities: ["WiFi", "Pools", "Spa", "Casino", "Theater", "Rock Climbing"],
      cabinTypes: {
        interior: { price: 899, available: true },
        oceanview: { price: 1199, available: true },
        balcony: { price: 1599, available: true },
        suite: { price: 2899, available: false }
      },
      included: ["All meals", "Entertainment", "Kids club", "Fitness center"],
      shipYear: 2018
    },
    {
      id: 2,
      name: "Norwegian Escape",
      cruiseLine: "Norwegian Cruise Line",
      destination: "Eastern Caribbean",
      duration: "7 nights",
      departurePort: "Miami, FL",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop",
      originalPrice: 1199,
      price: 799,
      savings: 33,
      rating: 4.6,
      reviews: 2156,
      shipSize: "Large Ship",
      passengers: "4,266 guests",
      dealType: "Flash Sale",
      highlights: ["Freestyle Cruising", "Aqua Park", "Ropes Course", "The Cavern Club"],
      itinerary: ["Miami", "St. Thomas", "Tortola", "Nassau", "Miami"],
      amenities: ["WiFi", "Water Slides", "Spa", "Casino", "Mini Golf", "Bowling"],
      cabinTypes: {
        interior: { price: 799, available: true },
        oceanview: { price: 999, available: true },
        balcony: { price: 1299, available: true },
        suite: { price: 2199, available: true }
      },
      included: ["All meals", "Entertainment", "Kids club", "Fitness center"],
      shipYear: 2015
    },
    {
      id: 3,
      name: "Celebrity Edge",
      cruiseLine: "Celebrity Cruises",
      destination: "Mediterranean",
      duration: "10 nights",
      departurePort: "Barcelona, Spain",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop",
      originalPrice: 2199,
      price: 1699,
      savings: 23,
      rating: 4.9,
      reviews: 1876,
      shipSize: "Large Ship",
      passengers: "2,918 guests",
      dealType: "Luxury Deal",
      highlights: ["Magic Carpet", "Eden Restaurant", "Rooftop Garden", "Infinite Veranda"],
      itinerary: ["Barcelona", "Palma", "Rome", "Florence", "Cannes", "Barcelona"],
      amenities: ["WiFi", "Spa", "Fine Dining", "Theater", "Art Gallery", "Library"],
      cabinTypes: {
        interior: { price: 1699, available: true },
        oceanview: { price: 2099, available: true },
        balcony: { price: 2699, available: true },
        suite: { price: 4999, available: true }
      },
      included: ["All meals", "Entertainment", "Fitness center", "Pool access"],
      shipYear: 2018
    },
    {
      id: 4,
      name: "Carnival Horizon",
      cruiseLine: "Carnival Cruise Line",
      destination: "Western Caribbean",
      duration: "8 nights",
      departurePort: "Miami, FL",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop",
      originalPrice: 999,
      price: 699,
      savings: 30,
      rating: 4.4,
      reviews: 2987,
      shipSize: "Large Ship",
      passengers: "3,960 guests",
      dealType: "Family Fun",
      highlights: ["SkyRide", "IMAX Theater", "WaterWorks", "Guy's Burger Joint"],
      itinerary: ["Miami", "Cozumel", "Belize", "Mahogany Bay", "Costa Maya", "Miami"],
      amenities: ["WiFi", "Water Park", "Mini Golf", "Casino", "Spa", "Kids Club"],
      cabinTypes: {
        interior: { price: 699, available: true },
        oceanview: { price: 899, available: true },
        balcony: { price: 1199, available: true },
        suite: { price: 2299, available: true }
      },
      included: ["All meals", "Entertainment", "Kids club", "Pool access"],
      shipYear: 2018
    },
    {
      id: 5,
      name: "Princess Crown Princess",
      cruiseLine: "Princess Cruises",
      destination: "Alaska Inside Passage",
      duration: "7 nights",
      departurePort: "Seattle, WA",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop",
      originalPrice: 1599,
      price: 1199,
      savings: 25,
      rating: 4.7,
      reviews: 1542,
      shipSize: "Large Ship",
      passengers: "3,080 guests",
      dealType: "Scenic Route",
      highlights: ["Glacier Bay", "Movies Under Stars", "Sanctuary", "Crown Grill"],
      itinerary: ["Seattle", "Juneau", "Skagway", "Glacier Bay", "Ketchikan", "Victoria", "Seattle"],
      amenities: ["WiFi", "Spa", "Theater", "Casino", "Library", "Art Gallery"],
      cabinTypes: {
        interior: { price: 1199, available: true },
        oceanview: { price: 1499, available: true },
        balcony: { price: 1899, available: true },
        suite: { price: 3299, available: true }
      },
      included: ["All meals", "Entertainment", "Naturalist programs", "Fitness center"],
      shipYear: 2006
    },
    {
      id: 6,
      name: "MSC Seaside",
      cruiseLine: "MSC Cruises",
      destination: "Caribbean",
      duration: "7 nights",
      departurePort: "Miami, FL",
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&h=400&fit=crop",
      originalPrice: 1099,
      price: 799,
      savings: 27,
      rating: 4.5,
      reviews: 1354,
      shipSize: "Large Ship",
      passengers: "4,140 guests",
      dealType: "European Style",
      highlights: ["Aquapark", "MSC Yacht Club", "Eataly", "Cirque du Soleil"],
      itinerary: ["Miami", "Ocean Cay", "Nassau", "Cozumel", "Miami"],
      amenities: ["WiFi", "Water Park", "Spa", "Casino", "Theater", "Shopping"],
      cabinTypes: {
        interior: { price: 799, available: true },
        oceanview: { price: 999, available: true },
        balcony: { price: 1299, available: true },
        suite: { price: 2599, available: true }
      },
      included: ["All meals", "Entertainment", "Kids club", "Pool access"],
      shipYear: 2017
    }
  ];

  const cruiseLines = ["Royal Caribbean", "Norwegian Cruise Line", "Celebrity Cruises", "Carnival Cruise Line", "Princess Cruises", "MSC Cruises", "Holland America", "Disney Cruise Line"];
  const cabinTypes = ["Interior", "Oceanview", "Balcony", "Suite"];
  const amenitiesList = ["WiFi", "Pools", "Spa", "Casino", "Theater", "Water Slides", "Rock Climbing", "Mini Golf", "Kids Club", "Fine Dining"];

  const popularDestinations = [
    { name: "Caribbean", ships: "50+ ships", deals: "From $299", image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=300&h=200&fit=crop" },
    { name: "Mediterranean", ships: "30+ ships", deals: "From $699", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop" },
    { name: "Alaska", ships: "15+ ships", deals: "From $899", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop" },
    { name: "Northern Europe", ships: "20+ ships", deals: "From $1,199", image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop" },
    { name: "Asia", ships: "25+ ships", deals: "From $799", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop" },
    { name: "Transatlantic", ships: "10+ ships", deals: "From $599", image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=300&h=200&fit=crop" }
  ];

  const amenityIcons = {
    "WiFi": Wifi,
    "Pools": Waves,
    "Spa": Sparkles,
    "Casino": Gift,
    "Theater": Music,
    "Water Slides": Waves,
    "Rock Climbing": Camera,
    "Mini Golf": Camera,
    "Kids Club": Users,
    "Fine Dining": Utensils
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SEOHead title="Cruises: Find Cruise Deals & Book Cruise Vacations | UTrippin" description="Book amazing cruise vacations with the best deals on Caribbean, Mediterranean, Alaska cruises and more. Compare cruise lines and save." />
      
      {/* Top Banner */}
      <div className="bg-[#0068EF] text-white text-sm flex justify-center py-4 px-4">
        <div className="text-center max-w-6xl mx-auto">
          <span className="font-bold mr-8">Cruise Season is Here!</span>
          <span>Save up to 70% on cruise deals. Set sail for less! <span className="underline">Learn More</span></span>
        </div>
      </div>

      <Header />
      
      <main className="pt-8">
        {/* Hero Search Section */}
        <div className="bg-gradient-to-br from-[#0068EF] to-[#0055A5] text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Find Your Perfect Cruise</h1>
              <p className="text-xl text-blue-100">Discover amazing cruise deals to destinations worldwide</p>
            </div>
            
            <Card className="max-w-5xl mx-auto shadow-2xl border-2 border-white/20">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <Label htmlFor="destination" className="text-[#003C8A] font-medium">Destination</Label>
                    <div className="relative mt-1">
                      <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        id="destination"
                        placeholder="Where do you want to cruise?"
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
                      <option value="3">3-5 days</option>
                      <option value="7">6-8 days</option>
                      <option value="10">9-14 days</option>
                      <option value="15">15+ days</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div>
                    <Label className="text-[#003C8A] font-medium">Passengers</Label>
                    <select 
                      value={searchParams.passengers} 
                      onChange={(e) => handleInputChange("passengers", e.target.value)}
                      className="mt-1 w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:border-[#0068EF] focus:outline-none"
                    >
                      <option value="1">1 passenger</option>
                      <option value="2">2 passengers</option>
                      <option value="3">3 passengers</option>
                      <option value="4">4+ passengers</option>
                    </select>
                  </div>
                  
                  <div>
                    <Label className="text-[#003C8A] font-medium">Cabin Type</Label>
                    <select 
                      value={searchParams.cabinType} 
                      onChange={(e) => handleInputChange("cabinType", e.target.value)}
                      className="mt-1 w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:border-[#0068EF] focus:outline-none"
                    >
                      <option value="interior">Interior</option>
                      <option value="oceanview">Oceanview</option>
                      <option value="balcony">Balcony</option>
                      <option value="suite">Suite</option>
                    </select>
                  </div>
                  
                  <Button onClick={handleSearch} className="mt-6 bg-[#0068EF] hover:bg-[#0055A5] text-lg py-3" size="lg">
                    <Search className="mr-2 h-5 w-5" />
                    🚢 Search Cruises
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Popular Destinations */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h2 className="text-2xl font-bold text-[#003C8A] mb-6 text-center">Popular Cruise Destinations</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
            {popularDestinations.map((destination, idx) => (
              <Card key={idx} className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer border-2 border-gray-200 hover:border-[#0068EF]">
                <div className="relative">
                  <img
                    src={destination.image}
                    alt={destination.name}
                    className="w-full h-24 object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-30 flex items-end">
                    <div className="p-2 text-white w-full">
                      <h3 className="font-bold text-sm">{destination.name}</h3>
                      <p className="text-xs opacity-90">{destination.ships}</p>
                      <p className="text-xs text-blue-200 font-medium">{destination.deals}</p>
                    </div>
                  </div>
                </div>
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
                          style={{ width: `${(filters.priceRange[1] / 3000) * 100}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-sm text-gray-500 mt-1">
                        <span>${filters.priceRange[0]}</span>
                        <span>${filters.priceRange[1]}+</span>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  {/* Cruise Lines */}
                  <div>
                    <Label className="font-medium text-[#003C8A]">Cruise Line</Label>
                    <div className="space-y-2 mt-2 max-h-48 overflow-y-auto">
                      {cruiseLines.map((line) => (
                        <div key={line} className="flex items-center space-x-2">
                          <input type="checkbox" id={`line-${line}`} className="rounded border-gray-300 text-[#0068EF] focus:ring-[#0068EF]" />
                          <label htmlFor={`line-${line}`} className="text-sm">{line}</label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  {/* Duration */}
                  <div>
                    <Label className="font-medium text-[#003C8A]">Duration</Label>
                    <div className="space-y-2 mt-2">
                      {["Any duration", "3-5 days", "6-8 days", "9-14 days", "15+ days"].map((duration) => (
                        <div key={duration} className="flex items-center space-x-2">
                          <input type="checkbox" id={`duration-${duration}`} className="rounded border-gray-300 text-[#0068EF] focus:ring-[#0068EF]" />
                          <label htmlFor={`duration-${duration}`} className="text-sm">{duration}</label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  {/* Cabin Type */}
                  <div>
                    <Label className="font-medium text-[#003C8A]">Cabin Type</Label>
                    <div className="space-y-2 mt-2">
                      {cabinTypes.map((cabin) => (
                        <div key={cabin} className="flex items-center space-x-2">
                          <input type="checkbox" id={`cabin-${cabin}`} className="rounded border-gray-300 text-[#0068EF] focus:ring-[#0068EF]" />
                          <label htmlFor={`cabin-${cabin}`} className="text-sm">{cabin}</label>
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
                  <h2 className="text-2xl font-bold text-[#003C8A]">Featured Cruise Deals</h2>
                  <p className="text-gray-600">{featuredCruises.length} cruises available</p>
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
                  <option value="departure">Departure Date</option>
                </select>
              </div>

              <div className="space-y-6">
                {featuredCruises.slice(0, displayCount).map((cruise) => (
                  <Card key={cruise.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 border-2 border-gray-200 hover:border-[#0068EF]">
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-1/3 relative">
                        <img
                          src={cruise.image}
                          alt={cruise.name}
                          className="w-full h-48 md:h-full object-cover"
                        />
                        <Badge className="absolute top-3 left-3 bg-[#FF6200] text-white font-bold">
                          {cruise.savings}% OFF
                        </Badge>
                        <Badge className="absolute top-3 right-3 bg-green-600 text-white">
                          {cruise.dealType}
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          className="absolute bottom-3 right-3 bg-white/90 hover:bg-white border-[#0068EF] text-[#0068EF]"
                        >
                          <Heart className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="md:w-2/3 p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline" className="text-xs border-[#0068EF]/20 text-[#0068EF]">{cruise.cruiseLine}</Badge>
                              <Badge variant="outline" className="text-xs">{cruise.shipSize}</Badge>
                            </div>
                            <h3 className="text-xl font-bold text-[#003C8A] mb-2">{cruise.name}</h3>
                            <div className="flex items-center text-gray-600 mb-2">
                              <MapPin className="h-4 w-4 mr-1" />
                              <span className="text-sm">{cruise.destination} • {cruise.duration}</span>
                            </div>
                            <div className="flex items-center text-gray-600 mb-2">
                              <Anchor className="h-4 w-4 mr-1" />
                              <span className="text-sm">Departs from {cruise.departurePort}</span>
                            </div>
                            <div className="flex items-center mb-3">
                              <div className="flex items-center">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                                <span className="font-semibold">{cruise.rating}</span>
                                <span className="text-sm text-gray-500 ml-1">({cruise.reviews} reviews)</span>
                              </div>
                              <Separator orientation="vertical" className="mx-3 h-4" />
                              <span className="text-sm text-gray-500">{cruise.passengers}</span>
                            </div>
                          </div>
                          
                          <div className="text-right ml-4">
                            <div className="text-sm text-gray-500 line-through">${cruise.originalPrice}</div>
                            <div className="text-3xl font-bold text-[#0068EF]">${cruise.price}</div>
                            <div className="text-sm text-gray-600">per person</div>
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <div className="text-sm font-medium text-gray-700 mb-2">Itinerary:</div>
                          <div className="flex flex-wrap gap-1">
                            {cruise.itinerary.slice(0, 4).map((port, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs bg-blue-50 text-[#0068EF] border border-[#0068EF]/20">
                                {port}
                              </Badge>
                            ))}
                            {cruise.itinerary.length > 4 && (
                              <Badge variant="outline" className="text-xs border-[#0068EF]/20">
                                +{cruise.itinerary.length - 4} more
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                          {cruise.amenities.slice(0, 4).map((amenity, idx) => {
                            const IconComponent = amenityIcons[amenity] || Ship;
                            return (
                              <Badge key={idx} variant="secondary" className="text-xs flex items-center bg-gray-50 text-gray-700 border border-gray-200">
                                <IconComponent className="h-3 w-3 mr-1" />
                                {amenity}
                              </Badge>
                            );
                          })}
                          {cruise.amenities.length > 4 && (
                            <Badge variant="outline" className="text-xs border-gray-200">
                              +{cruise.amenities.length - 4} more
                            </Badge>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-4 gap-2 mb-4 text-xs">
                          <div className="text-center p-2 bg-gray-50 rounded">
                            <div className="font-medium">Interior</div>
                            <div className="text-[#0068EF] font-bold">${cruise.cabinTypes.interior.price}</div>
                          </div>
                          <div className="text-center p-2 bg-gray-50 rounded">
                            <div className="font-medium">Oceanview</div>
                            <div className="text-[#0068EF] font-bold">${cruise.cabinTypes.oceanview.price}</div>
                          </div>
                          <div className="text-center p-2 bg-gray-50 rounded">
                            <div className="font-medium">Balcony</div>
                            <div className="text-[#0068EF] font-bold">${cruise.cabinTypes.balcony.price}</div>
                          </div>
                          <div className="text-center p-2 bg-gray-50 rounded">
                            <div className="font-medium">Suite</div>
                            <div className={`font-bold ${cruise.cabinTypes.suite.available ? 'text-[#0068EF]' : 'text-gray-400'}`}>
                              {cruise.cabinTypes.suite.available ? `$${cruise.cabinTypes.suite.price}` : 'Sold Out'}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-gray-600">
                            <span className="text-green-600 font-medium">✓ {cruise.included[0]}</span>
                          </div>
                          <div className="flex gap-3">
                            <Button variant="outline" className="border-[#0068EF] text-[#0068EF] hover:bg-blue-50">
                              View Details
                            </Button>
                            <Button className="bg-[#0068EF] hover:bg-[#0055A5]">
                              Select Cruise
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
              
              {/* Load More */}
              {displayCount < featuredCruises.length && (
                <div className="text-center mt-8">
                  <Button 
                    variant="outline" 
                    size="lg" 
                    onClick={handleLoadMore}
                    disabled={isLoadingMore}
                    className="border-[#0068EF] text-[#0068EF] hover:bg-blue-50"
                  >
                    {isLoadingMore ? "Loading..." : `Load More Cruises (${featuredCruises.length - displayCount} remaining)`}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Why Choose Cruises */}
        <div className="bg-white py-16 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12 text-[#003C8A]">Why Choose a Cruise Vacation?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="text-center border-2 border-gray-200">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Ship className="h-8 w-8 text-[#0068EF]" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-[#003C8A]">All-Inclusive Value</h3>
                  <p className="text-gray-600">
                    Your cruise fare includes accommodation, meals, entertainment, and transportation to multiple destinations.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="text-center border-2 border-gray-200">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Globe className="h-8 w-8 text-[#0068EF]" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-[#003C8A]">Multiple Destinations</h3>
                  <p className="text-gray-600">
                    Visit multiple countries and cities in one trip without the hassle of packing and unpacking.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="text-center border-2 border-gray-200">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-[#0068EF]" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-[#003C8A]">Something for Everyone</h3>
                  <p className="text-gray-600">
                    From kids clubs to adult-only areas, fine dining to casual buffets, there's something for every traveler.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Cruise Tips */}
        <div className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12 text-[#003C8A]">First Time Cruising?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-2 border-gray-200">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <Calendar className="h-6 w-6 text-[#0068EF]" />
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-[#003C8A]">Best Time to Book</h3>
                  <p className="text-sm text-gray-600">
                    Book 6-12 months in advance for the best cabin selection and prices.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-2 border-gray-200">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <Ship className="h-6 w-6 text-[#0068EF]" />
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-[#003C8A]">Choose Your Cabin</h3>
                  <p className="text-sm text-gray-600">
                    Interior cabins are budget-friendly, while balcony cabins offer ocean views.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-2 border-gray-200">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <Utensils className="h-6 w-6 text-[#0068EF]" />
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-[#003C8A]">Dining Options</h3>
                  <p className="text-sm text-gray-600">
                    Main dining rooms and buffets are included. Specialty restaurants cost extra.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-2 border-gray-200">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <Anchor className="h-6 w-6 text-[#0068EF]" />
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-[#003C8A]">Shore Excursions</h3>
                  <p className="text-sm text-gray-600">
                    Book excursions through the cruise line or explore ports independently.
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