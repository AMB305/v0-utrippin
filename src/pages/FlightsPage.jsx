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
import { Star, MapPin, Calendar, Users, Search, Filter, SortAsc, Heart, Clock, Plane, Wifi, Utensils, Luggage, Shield, Award, TrendingDown, Bell, Gift } from "lucide-react";
import Header from "../components/layout/header";
import Footer from "../components/layout/footer";
import SEOHead from "../components/common/seo-head";
import { generateStructuredData, generateBoltSEOJSON, pageSEOConfigs } from "../utils/seo-config";

export default function FlightsPage() {
  const [searchParams, setSearchParams] = useState({
    from: "",
    to: "",
    departDate: "",
    returnDate: "",
    passengers: 1,
    cabinClass: "economy",
    tripType: "roundtrip"
  });

  const [filters, setFilters] = useState({
    priceRange: [0, 2000],
    airlines: [],
    stops: "any",
    departureTime: "any",
    duration: "any",
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
    console.log("Searching flights with:", searchParams);
  };

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setDisplayCount(prev => prev + 6);
      setIsLoadingMore(false);
    }, 1000);
  };

  // Generate structured data for flights page
  const flightsStructuredData = generateStructuredData('travel-service', {
    ...pageSEOConfigs.flights.customStructuredData,
    "name": "UTrippin Flight Booking",
    "description": "Compare and book cheap flights from hundreds of airlines worldwide"
  });

  const boltSEOJSON = generateBoltSEOJSON(pageSEOConfigs.flights);

  // Featured flight deals
  const featuredFlights = [
    {
      id: 1,
      from: "New York (JFK)",
      to: "London (LHR)",
      airline: "British Airways",
      flightNumber: "BA 178",
      departTime: "10:30 PM",
      arriveTime: "9:45 AM+1",
      duration: "7h 15m",
      stops: "Nonstop",
      price: 542,
      originalPrice: 789,
      savings: 31,
      cabinClass: "Economy",
      aircraft: "Boeing 777-200",
      image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400&h=250&fit=crop",
      dealType: "Express Deal",
      amenities: ["WiFi", "Meals", "Entertainment", "Power Outlets"],
      baggage: "1 carry-on, 1 checked bag",
      rating: 4.2,
      reviews: 1847
    },
    {
      id: 2,
      from: "Los Angeles (LAX)",
      to: "Tokyo (NRT)",
      airline: "Japan Airlines",
      flightNumber: "JL 62",
      departTime: "11:50 AM",
      arriveTime: "3:35 PM+1",
      duration: "11h 45m",
      stops: "Nonstop",
      price: 698,
      originalPrice: 1024,
      savings: 32,
      cabinClass: "Economy",
      aircraft: "Boeing 787-9",
      image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&h=250&fit=crop",
      dealType: "Best Value",
      amenities: ["WiFi", "Premium Meals", "Entertainment", "Extra Legroom"],
      baggage: "2 carry-on, 2 checked bags",
      rating: 4.6,
      reviews: 2341
    },
    {
      id: 3,
      from: "Miami (MIA)",
      to: "Barcelona (BCN)",
      airline: "Iberia",
      flightNumber: "IB 6251",
      departTime: "7:20 PM",
      arriveTime: "8:30 AM+1",
      duration: "8h 10m",
      stops: "Nonstop",
      price: 456,
      originalPrice: 678,
      savings: 33,
      cabinClass: "Economy",
      aircraft: "Airbus A330-200",
      image: "https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=400&h=250&fit=crop",
      dealType: "Flash Sale",
      amenities: ["WiFi", "Meals", "Entertainment"],
      baggage: "1 carry-on, 1 checked bag",
      rating: 4.1,
      reviews: 987
    },
    {
      id: 4,
      from: "Chicago (ORD)",
      to: "Paris (CDG)",
      airline: "Air France",
      flightNumber: "AF 23",
      departTime: "9:25 PM",
      arriveTime: "2:20 PM+1",
      duration: "8h 55m",
      stops: "Nonstop",
      price: 587,
      originalPrice: 834,
      savings: 30,
      cabinClass: "Economy",
      aircraft: "Boeing 777-300ER",
      image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=250&fit=crop",
      dealType: "Limited Time",
      amenities: ["WiFi", "Premium Meals", "Entertainment", "Amenity Kit"],
      baggage: "1 carry-on, 1 checked bag",
      rating: 4.4,
      reviews: 1542
    },
    {
      id: 5,
      from: "San Francisco (SFO)",
      to: "Sydney (SYD)",
      airline: "United Airlines",
      flightNumber: "UA 863",
      departTime: "10:40 PM",
      arriveTime: "6:05 AM+2",
      duration: "14h 25m",
      stops: "Nonstop",
      price: 892,
      originalPrice: 1247,
      savings: 28,
      cabinClass: "Economy",
      aircraft: "Boeing 787-10",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=250&fit=crop",
      dealType: "Long Haul",
      amenities: ["WiFi", "Meals", "Entertainment", "Power Outlets", "Extra Space"],
      baggage: "1 carry-on, 2 checked bags",
      rating: 4.3,
      reviews: 3201
    },
    {
      id: 6,
      from: "Boston (BOS)",
      to: "Dublin (DUB)",
      airline: "Aer Lingus",
      flightNumber: "EI 137",
      departTime: "9:50 PM",
      arriveTime: "6:30 AM+1",
      duration: "6h 40m",
      stops: "Nonstop",
      price: 398,
      originalPrice: 567,
      savings: 30,
      cabinClass: "Economy",
      aircraft: "Airbus A330-300",
      image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&h=250&fit=crop",
      dealType: "European Deal",
      amenities: ["WiFi", "Meals", "Entertainment"],
      baggage: "1 carry-on, 1 checked bag",
      rating: 4.5,
      reviews: 1354
    }
  ];

  const airlines = ["American Airlines", "Delta", "United", "British Airways", "Lufthansa", "Air France", "Emirates", "Qatar Airways"];
  const popularRoutes = [
    { route: "NYC → London", price: "From $542", image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=300&h=200&fit=crop" },
    { route: "LAX → Tokyo", price: "From $698", image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=300&h=200&fit=crop" },
    { route: "Miami → Barcelona", price: "From $456", image: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=300&h=200&fit=crop" },
    { route: "Chicago → Paris", price: "From $587", image: "https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=300&h=200&fit=crop" },
    { route: "SFO → Sydney", price: "From $892", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop" },
    { route: "Boston → Dublin", price: "From $398", image: "https://images.unsplash.com/photo-1549918864-48ac978761a4?w=300&h=200&fit=crop" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <SEOHead 
        title={pageSEOConfigs.flights.title}
        description={pageSEOConfigs.flights.description}
        image="https://utrippin.ai/UTrippin_Social_Card_BlueBG_1200x630.png"
        url="https://utrippin.ai/flights"
        structuredData={flightsStructuredData}
      />

      <script 
        type="application/json" 
        id="bolt-seo-config"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(boltSEOJSON, null, 2) }}
      />
      
      {/* Top Banner */}
      <div className="bg-[#0068EF] text-white text-sm flex justify-center py-4 px-4">
        <div className="text-center max-w-6xl mx-auto">
          <span className="font-bold mr-8">July 4th Getaways!</span>
          <span>Take an extra $10 off Flight Express Deals®. Use code: <strong>EXTRA10</strong> <span className="underline">Learn More</span></span>
        </div>
      </div>

      <Header />
      
      <main className="pt-8">
        {/* Hero Search Section */}
        <div className="bg-gradient-to-br from-[#0068EF] to-[#0055A5] text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Find Your Perfect Flight</h1>
              <p className="text-xl text-blue-100">Compare prices from hundreds of airlines and save up to 60%</p>
            </div>
            
            <Card className="max-w-5xl mx-auto shadow-2xl border-2 border-white/20">
              <CardContent className="p-6">
                {/* Trip Type Selection */}
                <div className="flex gap-6 mb-6 text-sm text-gray-600 font-medium">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="tripType" 
                      value="roundtrip"
                      checked={searchParams.tripType === "roundtrip"}
                      onChange={(e) => handleInputChange("tripType", e.target.value)}
                      className="w-4 h-4 text-[#0068EF]"
                    />
                    <span className={searchParams.tripType === "roundtrip" ? "text-[#0068EF] font-semibold" : ""}>Round-trip</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="tripType" 
                      value="oneway"
                      checked={searchParams.tripType === "oneway"}
                      onChange={(e) => handleInputChange("tripType", e.target.value)}
                      className="w-4 h-4 text-[#0068EF]"
                    />
                    <span className={searchParams.tripType === "oneway" ? "text-[#0068EF] font-semibold" : ""}>One-way</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="tripType" 
                      value="multicity"
                      checked={searchParams.tripType === "multicity"}
                      onChange={(e) => handleInputChange("tripType", e.target.value)}
                      className="w-4 h-4 text-[#0068EF]"
                    />
                    <span className={searchParams.tripType === "multicity" ? "text-[#0068EF] font-semibold" : ""}>Multi-city</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <Label htmlFor="from" className="text-[#003C8A] font-medium">From</Label>
                    <div className="relative mt-1">
                      <Plane className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        id="from"
                        placeholder="Departing from?"
                        value={searchParams.from}
                        onChange={(e) => handleInputChange("from", e.target.value)}
                        className="pl-10 border-2 border-gray-300 focus:border-[#0068EF]"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="to" className="text-[#003C8A] font-medium">To</Label>
                    <div className="relative mt-1">
                      <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        id="to"
                        placeholder="Going to?"
                        value={searchParams.to}
                        onChange={(e) => handleInputChange("to", e.target.value)}
                        className="pl-10 border-2 border-gray-300 focus:border-[#0068EF]"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="departDate" className="text-[#003C8A] font-medium">Departure</Label>
                    <div className="relative mt-1">
                      <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        id="departDate"
                        type="date"
                        value={searchParams.departDate}
                        onChange={(e) => handleInputChange("departDate", e.target.value)}
                        className="pl-10 border-2 border-gray-300 focus:border-[#0068EF]"
                      />
                    </div>
                  </div>
                  
                  {searchParams.tripType === "roundtrip" && (
                    <div>
                      <Label htmlFor="returnDate" className="text-[#003C8A] font-medium">Return</Label>
                      <div className="relative mt-1">
                        <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <Input
                          id="returnDate"
                          type="date"
                          value={searchParams.returnDate}
                          onChange={(e) => handleInputChange("returnDate", e.target.value)}
                          className="pl-10 border-2 border-gray-300 focus:border-[#0068EF]"
                        />
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div>
                    <Label htmlFor="passengers" className="text-[#003C8A] font-medium">Passengers</Label>
                    <select 
                      value={searchParams.passengers.toString()} 
                      onChange={(e) => handleInputChange("passengers", parseInt(e.target.value))}
                      className="mt-1 w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:border-[#0068EF] focus:outline-none"
                    >
                      <option value="1">1 Adult</option>
                      <option value="2">2 Adults</option>
                      <option value="3">3 Adults</option>
                      <option value="4">4+ Adults</option>
                    </select>
                  </div>
                  
                  <div>
                    <Label htmlFor="cabinClass" className="text-[#003C8A] font-medium">Cabin Class</Label>
                    <select 
                      value={searchParams.cabinClass} 
                      onChange={(e) => handleInputChange("cabinClass", e.target.value)}
                      className="mt-1 w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:border-[#0068EF] focus:outline-none"
                    >
                      <option value="economy">Economy</option>
                      <option value="premium">Premium Economy</option>
                      <option value="business">Business</option>
                      <option value="first">First Class</option>
                    </select>
                  </div>
                  
                  <Button onClick={handleSearch} className="mt-6 bg-[#0068EF] hover:bg-[#0055A5] text-lg py-3" size="lg">
                    <Search className="mr-2 h-5 w-5" />
                    ✈️ Search Flights
                  </Button>
                </div>

                {/* Bundle & Save */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Gift className="w-5 h-5 text-green-700" />
                    <span className="text-green-700 font-semibold text-sm">Bundle + Save</span>
                  </div>
                  <div className="flex flex-wrap gap-3 text-sm">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="w-4 h-4 text-[#0068EF] border border-gray-300 rounded focus:ring-[#0068EF]" />
                      <span>Add a hotel</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="w-4 h-4 text-[#0068EF] border border-gray-300 rounded focus:ring-[#0068EF]" />
                      <span>Add a car</span>
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                    <Label className="font-medium text-[#003C8A]">Price Range</Label>
                    <div className="mt-2">
                      <div className="w-full h-2 bg-gray-200 rounded-full relative">
                        <div 
                          className="h-2 bg-[#0068EF] rounded-full"
                          style={{ width: `${(filters.priceRange[1] / 2000) * 100}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-sm text-gray-500 mt-1">
                        <span>${filters.priceRange[0]}</span>
                        <span>${filters.priceRange[1]}+</span>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  {/* Airlines */}
                  <div>
                    <Label className="font-medium text-[#003C8A]">Airlines</Label>
                    <div className="space-y-2 mt-2 max-h-48 overflow-y-auto">
                      {airlines.map((airline) => (
                        <div key={airline} className="flex items-center space-x-2">
                          <input type="checkbox" id={`airline-${airline}`} className="rounded border-gray-300 text-[#0068EF] focus:ring-[#0068EF]" />
                          <label htmlFor={`airline-${airline}`} className="text-sm">{airline}</label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  {/* Stops */}
                  <div>
                    <Label className="font-medium text-[#003C8A]">Stops</Label>
                    <div className="space-y-2 mt-2">
                      {["Any number of stops", "Nonstop only", "1 stop or fewer", "2 stops or fewer"].map((stop) => (
                        <div key={stop} className="flex items-center space-x-2">
                          <input type="checkbox" id={`stop-${stop}`} className="rounded border-gray-300 text-[#0068EF] focus:ring-[#0068EF]" />
                          <label htmlFor={`stop-${stop}`} className="text-sm">{stop}</label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  {/* Departure Time */}
                  <div>
                    <Label className="font-medium text-[#003C8A]">Departure Time</Label>
                    <div className="space-y-2 mt-2">
                      {["Any time", "Morning (6AM - 12PM)", "Afternoon (12PM - 6PM)", "Evening (6PM - 12AM)", "Night (12AM - 6AM)"].map((time) => (
                        <div key={time} className="flex items-center space-x-2">
                          <input type="checkbox" id={`time-${time}`} className="rounded border-gray-300 text-[#0068EF] focus:ring-[#0068EF]" />
                          <label htmlFor={`time-${time}`} className="text-sm">{time}</label>
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
                  <h2 className="text-2xl font-bold text-[#003C8A]">Flight Deals</h2>
                  <p className="text-gray-600">{featuredFlights.length} flights found</p>
                </div>
                <select 
                  value={filters.sortBy} 
                  onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                  className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#0068EF] focus:outline-none"
                >
                  <option value="price">Price: Low to High</option>
                  <option value="duration">Duration: Shortest</option>
                  <option value="departure">Departure Time</option>
                  <option value="airline">Airline</option>
                </select>
              </div>

              <div className="space-y-6">
                {featuredFlights.slice(0, displayCount).map((flight) => (
                  <Card key={flight.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 border-2 border-gray-200 hover:border-[#0068EF]">
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-1/3 relative">
                        <img
                          src={flight.image}
                          alt={`${flight.airline} flight`}
                          className="w-full h-48 md:h-full object-cover"
                        />
                        <Badge className="absolute top-3 left-3 bg-[#FF6200] text-white font-bold">
                          {flight.savings}% OFF
                        </Badge>
                        <Badge className="absolute top-3 right-3 bg-green-600 text-white">
                          {flight.dealType}
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
                              <Badge variant="outline" className="text-xs border-[#0068EF]/20 text-[#0068EF]">{flight.airline}</Badge>
                              <Badge variant="outline" className="text-xs">{flight.flightNumber}</Badge>
                            </div>
                            <h3 className="text-xl font-bold text-[#003C8A] mb-2">{flight.from} → {flight.to}</h3>
                            <div className="flex items-center text-gray-600 mb-2">
                              <Clock className="h-4 w-4 mr-1" />
                              <span className="text-sm">{flight.departTime} - {flight.arriveTime}</span>
                            </div>
                            <div className="flex items-center text-gray-600 mb-3">
                              <Plane className="h-4 w-4 mr-1" />
                              <span className="text-sm">{flight.duration} • {flight.stops}</span>
                            </div>
                            <div className="flex items-center mb-3">
                              <div className="flex items-center">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                                <span className="font-semibold">{flight.rating}</span>
                                <span className="text-sm text-gray-500 ml-1">({flight.reviews} reviews)</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-right ml-4">
                            <div className="text-sm text-gray-500 line-through">${flight.originalPrice}</div>
                            <div className="text-3xl font-bold text-[#0068EF]">${flight.price}</div>
                            <div className="text-sm text-gray-600">per person</div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                          <div className="flex items-center">
                            <Luggage className="h-4 w-4 mr-1 text-gray-500" />
                            <span>{flight.baggage}</span>
                          </div>
                          <div className="flex items-center">
                            <span className="font-medium">{flight.aircraft}</span>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                          {flight.amenities.slice(0, 4).map((amenity, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs bg-blue-50 text-[#0068EF] border border-[#0068EF]/20">
                              {amenity}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-gray-600">
                            <span className="text-green-600 font-medium">✓ Free cancellation</span>
                          </div>
                          <div className="flex gap-3">
                            <Button variant="outline" className="border-[#0068EF] text-[#0068EF] hover:bg-blue-50">
                              View Details
                            </Button>
                            <Button className="bg-[#0068EF] hover:bg-[#0055A5]">
                              Select Flight
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
              
              {/* Load More */}
              {displayCount < featuredFlights.length && (
                <div className="text-center mt-8">
                  <Button 
                    variant="outline" 
                    size="lg" 
                    onClick={handleLoadMore}
                    disabled={isLoadingMore}
                    className="border-[#0068EF] text-[#0068EF] hover:bg-blue-50"
                  >
                    {isLoadingMore ? "Loading..." : `Load More Flights (${featuredFlights.length - displayCount} remaining)`}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Popular Routes */}
        <div className="bg-white py-16 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-8 text-[#003C8A]">Popular Flight Routes</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {popularRoutes.map((route, idx) => (
                <Card key={idx} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer border-2 border-gray-200 hover:border-[#0068EF]">
                  <div className="relative">
                    <img
                      src={route.image}
                      alt={route.route}
                      className="w-full h-32 object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-30 flex items-end">
                      <div className="p-3 text-white w-full">
                        <h3 className="font-bold text-sm">{route.route}</h3>
                        <p className="text-xs opacity-90">{route.price}</p>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="text-center border-2 border-gray-200">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="h-8 w-8 text-[#0068EF]" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-[#003C8A]">Best Price Guarantee</h3>
                  <p className="text-gray-600">
                    We compare prices from hundreds of airlines to ensure you get the best deal.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="text-center border-2 border-gray-200">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="h-8 w-8 text-[#0068EF]" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-[#003C8A]">Free Cancellation</h3>
                  <p className="text-gray-600">
                    Cancel your flight booking for free up to 24 hours before departure.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="text-center border-2 border-gray-200">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-[#0068EF]" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-[#003C8A]">24/7 Customer Support</h3>
                  <p className="text-gray-600">
                    Our travel experts are available around the clock to assist with your booking.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="bg-gradient-to-r from-[#0068EF] to-[#0055A5] text-white py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Never Miss a Flight Deal
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Get personalized flight deals, price alerts, and exclusive offers delivered straight to your inbox.
            </p>
            
            <form className="max-w-md mx-auto mb-8">
              <div className="flex flex-col sm:flex-row gap-3">
                <input 
                  type="email" 
                  placeholder="Enter your email address" 
                  className="flex-1 px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-white focus:ring-opacity-50 focus:outline-none"
                  required
                />
                <Button 
                  type="submit" 
                  className="bg-[#FF6200] hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors shadow-lg"
                >
                  Subscribe
                </Button>
              </div>
            </form>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <Bell className="h-6 w-6 mx-auto mb-2" />
                <div className="font-semibold">Price Alerts</div>
                <div className="text-sm text-blue-100">Get notified when prices drop</div>
              </div>
              <div>
                <Gift className="h-6 w-6 mx-auto mb-2" />
                <div className="font-semibold">Exclusive Deals</div>
                <div className="text-sm text-blue-100">Member-only discounts & offers</div>
              </div>
              <div>
                <TrendingDown className="h-6 w-6 mx-auto mb-2" />
                <div className="font-semibold">Best Prices</div>
                <div className="text-sm text-blue-100">Guaranteed lowest fares</div>
              </div>
            </div>
            
            <div className="mt-6 text-sm text-blue-100">
              <Shield className="inline mr-1 h-4 w-4" />
              We respect your privacy. Unsubscribe at any time.
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}