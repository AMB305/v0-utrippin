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
import { Star, MapPin, Car, Search, Filter, SortAsc, Users, Calendar, Heart, Award, Clock, Fuel, Shield, Wifi, Navigation, Snowflake, Baby, Luggage, Settings } from "lucide-react";
import Header from "../components/layout/header";
import Footer from "../components/layout/footer";
import SEOHead from "../components/common/seo-head";

export default function CarsPage() {
  const [searchParams, setSearchParams] = useState({
    pickupLocation: "",
    dropoffLocation: "",
    pickupDate: "",
    pickupTime: "10:00",
    dropoffDate: "",
    dropoffTime: "10:00",
    driverAge: 25
  });

  const [filters, setFilters] = useState({
    priceRange: [20, 300],
    carType: [],
    transmission: "any",
    fuelType: "any",
    supplier: [],
    features: [],
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
    console.log("Searching cars with:", searchParams);
  };

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setDisplayCount(prev => prev + 6);
      setIsLoadingMore(false);
    }, 1000);
  };

  // Featured car rental deals
  const featuredCars = [
    {
      id: 1,
      name: "Toyota Camry",
      category: "Intermediate",
      supplier: "Enterprise",
      image: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400&h=250&fit=crop",
      pricePerDay: 45,
      originalPrice: 65,
      savings: 31,
      rating: 4.7,
      reviews: 2341,
      passengers: 5,
      luggage: 2,
      transmission: "Automatic",
      fuelType: "Gasoline",
      fuelPolicy: "Full to Full",
      features: ["Air Conditioning", "Bluetooth", "Backup Camera"],
      dealType: "Best Seller",
      included: ["Unlimited Mileage", "Basic Insurance", "24/7 Support"],
      location: "Los Angeles Airport (LAX)",
      supplier_rating: 4.8
    },
    {
      id: 2,
      name: "Jeep Wrangler",
      category: "SUV",
      supplier: "Hertz",
      image: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=400&h=250&fit=crop",
      pricePerDay: 89,
      originalPrice: 129,
      savings: 31,
      rating: 4.6,
      reviews: 1876,
      passengers: 4,
      luggage: 2,
      transmission: "Manual",
      fuelType: "Gasoline",
      fuelPolicy: "Full to Full",
      features: ["4WD", "Air Conditioning", "GPS Navigation"],
      dealType: "Adventure Ready",
      included: ["Unlimited Mileage", "Full Coverage", "Roadside Assistance"],
      location: "Denver Airport (DEN)",
      supplier_rating: 4.5
    },
    {
      id: 3,
      name: "Tesla Model 3",
      category: "Luxury",
      supplier: "Avis",
      image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400&h=250&fit=crop",
      pricePerDay: 120,
      originalPrice: 180,
      savings: 33,
      rating: 4.9,
      reviews: 987,
      passengers: 5,
      luggage: 1,
      transmission: "Automatic",
      fuelType: "Electric",
      fuelPolicy: "Full to Full",
      features: ["Autopilot", "Supercharging", "Premium Audio"],
      dealType: "Eco-Friendly",
      included: ["Unlimited Mileage", "Premium Insurance", "Charging Included"],
      location: "San Francisco Airport (SFO)",
      supplier_rating: 4.7
    },
    {
      id: 4,
      name: "Ford Mustang Convertible",
      category: "Convertible",
      supplier: "Budget",
      image: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400&h=250&fit=crop",
      pricePerDay: 75,
      originalPrice: 110,
      savings: 32,
      rating: 4.8,
      reviews: 1542,
      passengers: 4,
      luggage: 1,
      transmission: "Automatic",
      fuelType: "Gasoline",
      fuelPolicy: "Full to Full",
      features: ["Convertible Top", "Premium Sound", "Sport Mode"],
      dealType: "Summer Special",
      included: ["Unlimited Mileage", "Basic Insurance", "24/7 Support"],
      location: "Miami Airport (MIA)",
      supplier_rating: 4.3
    },
    {
      id: 5,
      name: "Honda CR-V",
      category: "SUV",
      supplier: "National",
      image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=250&fit=crop",
      pricePerDay: 55,
      originalPrice: 78,
      savings: 29,
      rating: 4.5,
      reviews: 3201,
      passengers: 5,
      luggage: 3,
      transmission: "Automatic",
      fuelType: "Gasoline",
      fuelPolicy: "Full to Full",
      features: ["All-Wheel Drive", "Apple CarPlay", "Lane Assist"],
      dealType: "Family Favorite",
      included: ["Unlimited Mileage", "Basic Insurance", "GPS Included"],
      location: "Chicago Airport (ORD)",
      supplier_rating: 4.6
    },
    {
      id: 6,
      name: "BMW 3 Series",
      category: "Luxury",
      supplier: "Sixt",
      image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=250&fit=crop",
      pricePerDay: 95,
      originalPrice: 140,
      savings: 32,
      rating: 4.7,
      reviews: 1354,
      passengers: 5,
      luggage: 2,
      transmission: "Automatic",
      fuelType: "Gasoline",
      fuelPolicy: "Full to Full",
      features: ["Premium Interior", "Navigation", "Sport Package"],
      dealType: "Luxury Deal",
      included: ["Unlimited Mileage", "Premium Insurance", "Concierge Service"],
      location: "New York Airport (JFK)",
      supplier_rating: 4.8
    }
  ];

  const carCategories = [
    { name: "Economy", icon: Car, description: "Great for city driving" },
    { name: "Compact", icon: Car, description: "Easy to park and fuel efficient" },
    { name: "Intermediate", icon: Car, description: "Perfect balance of space and efficiency" },
    { name: "Standard", icon: Car, description: "Comfortable for longer trips" },
    { name: "Full Size", icon: Car, description: "Spacious for families" },
    { name: "SUV", icon: Car, description: "High seating and cargo space" },
    { name: "Luxury", icon: Car, description: "Premium features and comfort" },
    { name: "Convertible", icon: Car, description: "Open-air driving experience" }
  ];

  const suppliers = ["Enterprise", "Hertz", "Avis", "Budget", "National", "Alamo", "Sixt", "Thrifty"];
  const popularLocations = [
    { city: "Los Angeles", code: "LAX", deals: "From $25/day" },
    { city: "New York", code: "JFK", deals: "From $35/day" },
    { city: "Miami", code: "MIA", deals: "From $30/day" },
    { city: "Las Vegas", code: "LAS", deals: "From $28/day" },
    { city: "San Francisco", code: "SFO", deals: "From $40/day" },
    { city: "Orlando", code: "MCO", deals: "From $25/day" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <SEOHead title="Car Rentals: Book Cheap Rental Cars | UTrippin" description="Compare and book car rentals from top suppliers worldwide. Best prices guaranteed with unlimited mileage." />
      
      {/* Top Banner */}
      <div className="bg-[#0068EF] text-white text-sm flex justify-center py-4 px-4">
        <div className="text-center max-w-6xl mx-auto">
          <span className="font-bold mr-8">Road Trip Season!</span>
          <span>Save up to 40% on car rentals. Book your adventure today! <span className="underline">Learn More</span></span>
        </div>
      </div>

      <Header />
      
      <main className="pt-8">
        {/* Hero Search Section */}
        <div className="bg-gradient-to-br from-[#0068EF] to-[#0055A5] text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Find Your Perfect Rental Car</h1>
              <p className="text-xl text-blue-100">Compare prices from top car rental companies worldwide</p>
            </div>
            
            <Card className="max-w-6xl mx-auto shadow-2xl border-2 border-white/20">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="pickupLocation" className="text-[#003C8A] font-medium">Pick-up Location</Label>
                    <div className="relative mt-1">
                      <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        id="pickupLocation"
                        placeholder="Enter city or airport"
                        value={searchParams.pickupLocation}
                        onChange={(e) => handleInputChange("pickupLocation", e.target.value)}
                        className="pl-10 border-2 border-gray-300 focus:border-[#0068EF]"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-[#003C8A] font-medium">Different drop-off?</Label>
                    <div className="relative mt-1">
                      <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        placeholder="Drop-off location (optional)"
                        value={searchParams.dropoffLocation}
                        onChange={(e) => handleInputChange("dropoffLocation", e.target.value)}
                        className="pl-10 border-2 border-gray-300 focus:border-[#0068EF]"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div>
                    <Label className="text-[#003C8A] font-medium">Pick-up Date</Label>
                    <div className="relative mt-1">
                      <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        type="date"
                        value={searchParams.pickupDate}
                        onChange={(e) => handleInputChange("pickupDate", e.target.value)}
                        className="pl-10 border-2 border-gray-300 focus:border-[#0068EF]"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-[#003C8A] font-medium">Pick-up Time</Label>
                    <select 
                      value={searchParams.pickupTime} 
                      onChange={(e) => handleInputChange("pickupTime", e.target.value)}
                      className="mt-1 w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:border-[#0068EF] focus:outline-none"
                    >
                      <option value="10:00">10:00 AM</option>
                      <option value="12:00">12:00 PM</option>
                      <option value="14:00">2:00 PM</option>
                      <option value="16:00">4:00 PM</option>
                      <option value="18:00">6:00 PM</option>
                    </select>
                  </div>
                  
                  <div>
                    <Label className="text-[#003C8A] font-medium">Drop-off Date</Label>
                    <div className="relative mt-1">
                      <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        type="date"
                        value={searchParams.dropoffDate}
                        onChange={(e) => handleInputChange("dropoffDate", e.target.value)}
                        className="pl-10 border-2 border-gray-300 focus:border-[#0068EF]"
                      />
                    </div>
                  </div>
                  
                  <Button onClick={handleSearch} className="mt-6 bg-[#0068EF] hover:bg-[#0055A5] text-lg py-3" size="lg">
                    <Search className="mr-2 h-5 w-5" />
                    🚗 Search Cars
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Car Categories */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h2 className="text-2xl font-bold text-[#003C8A] mb-6 text-center">Choose Your Vehicle Type</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-12">
            {carCategories.map((category) => {
              const IconComponent = category.icon;
              return (
                <Card key={category.name} className="hover:shadow-md transition-shadow cursor-pointer text-center p-4 border-2 border-gray-200 hover:border-[#0068EF]">
                  <CardContent className="p-2">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <IconComponent className="h-6 w-6 text-[#0068EF]" />
                    </div>
                    <h3 className="text-sm font-medium text-[#003C8A]">{category.name}</h3>
                    <p className="text-xs text-gray-500 mt-1">{category.description}</p>
                  </CardContent>
                </Card>
              );
            })}
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
                    <Label className="font-medium text-[#003C8A]">Price Range (per day)</Label>
                    <div className="mt-2">
                      <div className="w-full h-2 bg-gray-200 rounded-full relative">
                        <div 
                          className="h-2 bg-[#0068EF] rounded-full"
                          style={{ width: `${(filters.priceRange[1] / 300) * 100}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-sm text-gray-500 mt-1">
                        <span>${filters.priceRange[0]}</span>
                        <span>${filters.priceRange[1]}+</span>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  {/* Car Suppliers */}
                  <div>
                    <Label className="font-medium text-[#003C8A]">Car Rental Company</Label>
                    <div className="space-y-2 mt-2 max-h-48 overflow-y-auto">
                      {suppliers.map((supplier) => (
                        <div key={supplier} className="flex items-center space-x-2">
                          <input type="checkbox" id={`supplier-${supplier}`} className="rounded border-gray-300 text-[#0068EF] focus:ring-[#0068EF]" />
                          <label htmlFor={`supplier-${supplier}`} className="text-sm">{supplier}</label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  {/* Transmission */}
                  <div>
                    <Label className="font-medium text-[#003C8A]">Transmission</Label>
                    <div className="space-y-2 mt-2">
                      {["Any", "Automatic", "Manual"].map((trans) => (
                        <div key={trans} className="flex items-center space-x-2">
                          <input type="checkbox" id={`trans-${trans}`} className="rounded border-gray-300 text-[#0068EF] focus:ring-[#0068EF]" />
                          <label htmlFor={`trans-${trans}`} className="text-sm">{trans}</label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  {/* Fuel Type */}
                  <div>
                    <Label className="font-medium text-[#003C8A]">Fuel Type</Label>
                    <div className="space-y-2 mt-2">
                      {["Any", "Gasoline", "Diesel", "Electric", "Hybrid"].map((fuel) => (
                        <div key={fuel} className="flex items-center space-x-2">
                          <input type="checkbox" id={`fuel-${fuel}`} className="rounded border-gray-300 text-[#0068EF] focus:ring-[#0068EF]" />
                          <label htmlFor={`fuel-${fuel}`} className="text-sm">{fuel}</label>
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
                  <h2 className="text-2xl font-bold text-[#003C8A]">Featured Car Deals</h2>
                  <p className="text-gray-600">{featuredCars.length} vehicles available</p>
                </div>
                <select 
                  value={filters.sortBy} 
                  onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                  className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#0068EF] focus:outline-none"
                >
                  <option value="price">Price: Low to High</option>
                  <option value="rating">Highest Rated</option>
                  <option value="supplier">Rental Company</option>
                  <option value="category">Vehicle Type</option>
                </select>
              </div>

              <div className="space-y-6">
                {featuredCars.slice(0, displayCount).map((car) => (
                  <Card key={car.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 border-2 border-gray-200 hover:border-[#0068EF]">
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-1/3 relative">
                        <img
                          src={car.image}
                          alt={car.name}
                          className="w-full h-48 md:h-full object-cover"
                        />
                        <Badge className="absolute top-3 left-3 bg-[#FF6200] text-white font-bold">
                          {car.savings}% OFF
                        </Badge>
                        <Badge className="absolute top-3 right-3 bg-green-600 text-white">
                          {car.dealType}
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
                              <Badge variant="outline" className="text-xs border-[#0068EF]/20 text-[#0068EF]">{car.category}</Badge>
                              <span className="text-sm text-gray-600">{car.supplier}</span>
                            </div>
                            <h3 className="text-xl font-bold text-[#003C8A] mb-2">{car.name}</h3>
                            <div className="flex items-center text-gray-600 mb-2">
                              <MapPin className="h-4 w-4 mr-1" />
                              <span className="text-sm">{car.location}</span>
                            </div>
                            <div className="flex items-center mb-3">
                              <div className="flex items-center">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                                <span className="font-semibold">{car.rating}</span>
                                <span className="text-sm text-gray-500 ml-1">({car.reviews} reviews)</span>
                              </div>
                              <Separator orientation="vertical" className="mx-3 h-4" />
                              <span className="text-sm text-gray-500">Supplier: {car.supplier_rating}★</span>
                            </div>
                          </div>
                          
                          <div className="text-right ml-4">
                            <div className="text-sm text-gray-500 line-through">${car.originalPrice}</div>
                            <div className="text-3xl font-bold text-[#0068EF]">${car.pricePerDay}</div>
                            <div className="text-sm text-gray-600">per day</div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-1 text-gray-500" />
                            <span>{car.passengers} passengers</span>
                          </div>
                          <div className="flex items-center">
                            <Luggage className="h-4 w-4 mr-1 text-gray-500" />
                            <span>{car.luggage} bags</span>
                          </div>
                          <div className="flex items-center">
                            <Settings className="h-4 w-4 mr-1 text-gray-500" />
                            <span>{car.transmission}</span>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                          {car.features.slice(0, 3).map((feature, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs bg-blue-50 text-[#0068EF] border border-[#0068EF]/20">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-gray-600">
                            <span className="text-green-600 font-medium">✓ {car.included[0]}</span>
                          </div>
                          <div className="flex gap-3">
                            <Button variant="outline" className="border-[#0068EF] text-[#0068EF] hover:bg-blue-50">
                              View Details
                            </Button>
                            <Button className="bg-[#0068EF] hover:bg-[#0055A5]">
                              Select Car
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
              
              {/* Load More */}
              {displayCount < featuredCars.length && (
                <div className="text-center mt-8">
                  <Button 
                    variant="outline" 
                    size="lg" 
                    onClick={handleLoadMore}
                    disabled={isLoadingMore}
                    className="border-[#0068EF] text-[#0068EF] hover:bg-blue-50"
                  >
                    {isLoadingMore ? "Loading..." : `Load More Cars (${featuredCars.length - displayCount} remaining)`}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Popular Locations */}
        <div className="bg-white py-16 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-8 text-[#003C8A]">Popular Rental Locations</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {popularLocations.map((location, idx) => (
                <Card key={idx} className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-gray-200 hover:border-[#0068EF]">
                  <CardContent className="p-4 text-center">
                    <h3 className="font-bold text-lg text-[#003C8A]">{location.city}</h3>
                    <p className="text-gray-600 text-sm">{location.code}</p>
                    <p className="text-[#0068EF] text-sm font-medium mt-1">{location.deals}</p>
                  </CardContent>
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
                    We compare prices from all major car rental companies to ensure you get the best deal.
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
                    Cancel your booking for free up to 48 hours before pick-up time.
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
                    Our travel experts are available around the clock to assist with your rental.
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