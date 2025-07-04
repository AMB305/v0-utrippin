import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import { Checkbox } from "../components/ui/checkbox";
import { Slider } from "../components/ui/slider";
import { Star, MapPin, Wifi, Car, Coffee, Dumbbell, Waves, UtensilsCrossed, Sparkles, Hotel, Search, Filter, SortAsc, Users, Calendar, Heart, Award, Clock, Bed, Bath, AirVent, PawPrint, ShoppingBag } from "lucide-react";
import Header from "../components/layout/header";
import Footer from "../components/layout/footer";
import SEOHead from "../components/common/seo-head";

export default function HotelsPage() {
  const [searchParams, setSearchParams] = useState({
    destination: "",
    checkIn: "",
    checkOut: "",
    guests: 2,
    rooms: 1
  });

  const [filters, setFilters] = useState({
    priceRange: [0, 500],
    starRating: [],
    amenities: [],
    propertyType: [],
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
    console.log("Searching hotels with:", searchParams);
  };

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setDisplayCount(prev => prev + 6);
      setIsLoadingMore(false);
    }, 1000);
  };

  // Enhanced hotel search with real-time results
  const { data: hotels, isLoading } = useQuery({
    queryKey: ['/api/search/hotels', searchParams],
    queryFn: async () => {
      // Mock data for hotels
      return [];
    },
    enabled: !!searchParams.destination,
  });

  // Featured hotels for display when no search
  const featuredHotels = [
    {
      id: 1,
      name: "The Plaza Hotel",
      location: "New York, NY",
      rating: 4.8,
      reviews: 2847,
      price: 595,
      originalPrice: 795,
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop",
      amenities: ["Free WiFi", "Pool", "Spa", "Restaurant", "Room Service", "Concierge"],
      distance: "0.2 miles from Times Square",
      stars: 5,
      propertyType: "Luxury Hotel",
      savings: 25,
      dealType: "Express Deal"
    },
    {
      id: 2,
      name: "Oceanfront Resort & Spa",
      location: "Miami Beach, FL",
      rating: 4.6,
      reviews: 1923,
      price: 299,
      originalPrice: 399,
      image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400&h=300&fit=crop",
      amenities: ["Beach Access", "Spa", "Pool", "Free WiFi", "Fitness Center", "Restaurant"],
      distance: "Beachfront",
      stars: 4,
      propertyType: "Resort",
      savings: 25,
      dealType: "Last Minute"
    },
    {
      id: 3,
      name: "Mountain Peak Lodge",
      location: "Aspen, CO",
      rating: 4.4,
      reviews: 856,
      price: 389,
      originalPrice: 489,
      image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400&h=300&fit=crop",
      amenities: ["Ski Access", "Restaurant", "Fireplace", "Free WiFi", "Hot Tub", "Ski Storage"],
      distance: "0.5 miles from slopes",
      stars: 4,
      propertyType: "Lodge",
      savings: 20,
      dealType: "VIP Access"
    },
    {
      id: 4,
      name: "Downtown Business Hotel",
      location: "Chicago, IL",
      rating: 4.2,
      reviews: 1245,
      price: 159,
      originalPrice: 229,
      image: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=400&h=300&fit=crop",
      amenities: ["Free WiFi", "Business Center", "Gym", "Restaurant", "Airport Shuttle"],
      distance: "0.8 miles from downtown",
      stars: 3,
      propertyType: "Business Hotel",
      savings: 30,
      dealType: "Express Deal"
    },
    {
      id: 5,
      name: "Boutique Heritage Inn",
      location: "San Francisco, CA",
      rating: 4.7,
      reviews: 675,
      price: 275,
      originalPrice: 350,
      image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=400&h=300&fit=crop",
      amenities: ["Free WiFi", "Restaurant", "Concierge", "Pet Friendly", "Rooftop Terrace"],
      distance: "1.2 miles from Union Square",
      stars: 4,
      propertyType: "Boutique Hotel",
      savings: 21,
      dealType: "Secret Deal"
    },
    {
      id: 6,
      name: "Vegas Strip Resort",
      location: "Las Vegas, NV",
      rating: 4.3,
      reviews: 3421,
      price: 89,
      originalPrice: 189,
      image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=300&fit=crop",
      amenities: ["Casino", "Pool", "Spa", "Shows", "Multiple Restaurants", "Free WiFi"],
      distance: "On the Strip",
      stars: 4,
      propertyType: "Resort",
      savings: 53,
      dealType: "Flash Sale"
    }
  ];

  const amenityIcons = {
    "Free WiFi": Wifi,
    "Pool": Waves,
    "Spa": Sparkles,
    "Restaurant": UtensilsCrossed,
    "Gym": Dumbbell,
    "Fitness Center": Dumbbell,
    "Business Center": Hotel,
    "Room Service": UtensilsCrossed,
    "Beach Access": MapPin,
    "Ski Access": MapPin,
    "Parking": Car,
    "Pet Friendly": PawPrint
  };

  const propertyTypes = ["Hotel", "Resort", "Boutique Hotel", "Business Hotel", "Lodge", "Motel", "Vacation Rental"];
  const amenitiesList = ["Free WiFi", "Pool", "Spa", "Restaurant", "Gym", "Business Center", "Pet Friendly", "Parking", "Beach Access"];

  return (
    <div className="min-h-screen bg-gray-50">
      <SEOHead title="Hotels: Find Cheap Hotel Rooms & Discount Hotels | UTrippin" description="Deep Discounts on Hotels. Get Exclusive Savings with UTrippin.com." />
      
      {/* Top Banner */}
      <div className="bg-[#0068EF] text-white text-sm flex justify-center py-4 px-4">
        <div className="text-center max-w-6xl mx-auto">
          <span className="font-bold mr-8">Summer Hotel Deals!</span>
          <span>Save up to 60% on Express Deals®. Book now for best rates! <span className="underline">Learn More</span></span>
        </div>
      </div>

      <Header />
      
      <main className="pt-8">
        {/* Hero Search Section */}
        <div className="bg-gradient-to-br from-[#0068EF] to-[#0055A5] text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Find Your Perfect Hotel</h1>
              <p className="text-xl text-blue-100">Save up to 60% on hotels worldwide with exclusive deals</p>
            </div>
            
            <Card className="max-w-5xl mx-auto shadow-2xl border-2 border-white/20">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="destination" className="text-[#003C8A] font-medium">Destination</Label>
                    <div className="relative mt-1">
                      <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        id="destination"
                        placeholder="City, hotel, airport, address or landmark"
                        value={searchParams.destination}
                        onChange={(e) => handleInputChange("destination", e.target.value)}
                        className="pl-10 border-2 border-gray-300 focus:border-[#0068EF]"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="checkIn" className="text-[#003C8A] font-medium">Check-in</Label>
                    <Input
                      id="checkIn"
                      type="date"
                      value={searchParams.checkIn}
                      onChange={(e) => handleInputChange("checkIn", e.target.value)}
                      className="mt-1 border-2 border-gray-300 focus:border-[#0068EF]"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="checkOut" className="text-[#003C8A] font-medium">Check-out</Label>
                    <Input
                      id="checkOut"
                      type="date"
                      value={searchParams.checkOut}
                      onChange={(e) => handleInputChange("checkOut", e.target.value)}
                      className="mt-1 border-2 border-gray-300 focus:border-[#0068EF]"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="rooms" className="text-[#003C8A] font-medium">Rooms</Label>
                    <select 
                      value={searchParams.rooms.toString()} 
                      onChange={(e) => handleInputChange("rooms", parseInt(e.target.value))}
                      className="mt-1 w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:border-[#0068EF] focus:outline-none"
                    >
                      <option value="1">1 Room</option>
                      <option value="2">2 Rooms</option>
                      <option value="3">3 Rooms</option>
                      <option value="4">4+ Rooms</option>
                    </select>
                  </div>
                  
                  <div>
                    <Label htmlFor="guests" className="text-[#003C8A] font-medium">Guests</Label>
                    <select 
                      value={searchParams.guests.toString()} 
                      onChange={(e) => handleInputChange("guests", parseInt(e.target.value))}
                      className="mt-1 w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:border-[#0068EF] focus:outline-none"
                    >
                      <option value="1">1 Guest</option>
                      <option value="2">2 Guests</option>
                      <option value="3">3 Guests</option>
                      <option value="4">4 Guests</option>
                      <option value="5">5+ Guests</option>
                    </select>
                  </div>
                </div>
                
                <Button onClick={handleSearch} className="w-full bg-[#0068EF] hover:bg-[#0055A5] text-lg py-3" size="lg">
                  <Search className="mr-2 h-5 w-5" />
                  🏨 Search Hotels
                </Button>
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
                    <Label className="font-medium text-[#003C8A]">Price per night</Label>
                    <div className="mt-2">
                      <div className="w-full h-2 bg-gray-200 rounded-full relative">
                        <div 
                          className="h-2 bg-[#0068EF] rounded-full"
                          style={{ width: `${(filters.priceRange[1] / 1000) * 100}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-sm text-gray-500 mt-1">
                        <span>${filters.priceRange[0]}</span>
                        <span>${filters.priceRange[1]}+</span>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  {/* Star Rating */}
                  <div>
                    <Label className="font-medium text-[#003C8A]">Star Rating</Label>
                    <div className="space-y-2 mt-2">
                      {[5, 4, 3, 2, 1].map((stars) => (
                        <div key={stars} className="flex items-center space-x-2">
                          <input type="checkbox" id={`stars-${stars}`} className="rounded border-gray-300 text-[#0068EF] focus:ring-[#0068EF]" />
                          <label htmlFor={`stars-${stars}`} className="flex items-center text-sm">
                            {Array.from({ length: stars }).map((_, i) => (
                              <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            ))}
                            <span className="ml-2">{stars} Star{stars > 1 ? 's' : ''}</span>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  {/* Property Type */}
                  <div>
                    <Label className="font-medium text-[#003C8A]">Property Type</Label>
                    <div className="space-y-2 mt-2">
                      {propertyTypes.map((type) => (
                        <div key={type} className="flex items-center space-x-2">
                          <input type="checkbox" id={`type-${type}`} className="rounded border-gray-300 text-[#0068EF] focus:ring-[#0068EF]" />
                          <label htmlFor={`type-${type}`} className="text-sm">{type}</label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  {/* Amenities */}
                  <div>
                    <Label className="font-medium text-[#003C8A]">Amenities</Label>
                    <div className="space-y-2 mt-2">
                      {amenitiesList.map((amenity) => (
                        <div key={amenity} className="flex items-center space-x-2">
                          <input type="checkbox" id={`amenity-${amenity}`} className="rounded border-gray-300 text-[#0068EF] focus:ring-[#0068EF]" />
                          <label htmlFor={`amenity-${amenity}`} className="text-sm">{amenity}</label>
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
                  <h2 className="text-2xl font-bold text-[#003C8A]">Express Hotel Deals Near You</h2>
                  <p className="text-gray-600">Save up to 60% with exclusive deals</p>
                </div>
                <select 
                  value={filters.sortBy} 
                  onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                  className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#0068EF] focus:outline-none"
                >
                  <option value="price">Lowest Price</option>
                  <option value="rating">Highest Rated</option>
                  <option value="savings">Best Savings</option>
                  <option value="distance">Distance</option>
                </select>
              </div>

              <div className="space-y-6">
                {featuredHotels.slice(0, displayCount).map((hotel) => (
                  <Card key={hotel.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 border-l-4 border-l-[#0068EF] border-2 border-gray-200 hover:border-[#0068EF]">
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-1/3 relative">
                        <img
                          src={hotel.image}
                          alt={hotel.name}
                          className="w-full h-48 md:h-full object-cover"
                        />
                        <Badge className="absolute top-3 left-3 bg-[#FF6200] text-white font-bold">
                          {hotel.savings}% OFF
                        </Badge>
                        <Badge className="absolute top-3 right-3 bg-green-600 text-white">
                          {hotel.dealType}
                        </Badge>
                      </div>
                      
                      <div className="md:w-2/3 p-6">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <div className="flex items-center mb-2">
                              {Array.from({ length: hotel.stars }).map((_, i) => (
                                <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              ))}
                              <span className="ml-2 text-sm text-gray-600">{hotel.propertyType}</span>
                            </div>
                            <h3 className="text-xl font-bold text-[#003C8A] mb-1">{hotel.name}</h3>
                            <div className="flex items-center text-gray-600 mb-2">
                              <MapPin className="h-4 w-4 mr-1" />
                              <span className="text-sm">{hotel.location}</span>
                            </div>
                            <div className="text-sm text-gray-500 mb-3">{hotel.distance}</div>
                          </div>
                          
                          <div className="text-right">
                            <div className="flex items-center justify-end mb-1">
                              <div className="flex items-center">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                                <span className="font-semibold">{hotel.rating}</span>
                                <span className="text-sm text-gray-500 ml-1">({hotel.reviews})</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm text-gray-500 line-through">${hotel.originalPrice}</div>
                              <div className="text-3xl font-bold text-[#0068EF]">${hotel.price}</div>
                              <div className="text-sm text-gray-600">per night</div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                          {hotel.amenities.slice(0, 6).map((amenity, idx) => {
                            const IconComponent = amenityIcons[amenity] || Hotel;
                            return (
                              <Badge key={idx} variant="secondary" className="text-xs flex items-center bg-blue-50 text-[#0068EF] border border-[#0068EF]/20">
                                <IconComponent className="h-3 w-3 mr-1" />
                                {amenity}
                              </Badge>
                            );
                          })}
                          {hotel.amenities.length > 6 && (
                            <Badge variant="outline" className="text-xs border-[#0068EF]/20">
                              +{hotel.amenities.length - 6} more
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex gap-3">
                          <Button variant="outline" className="flex-1 border-[#0068EF] text-[#0068EF] hover:bg-blue-50">
                            View Details
                          </Button>
                          <Button className="flex-1 bg-[#0068EF] hover:bg-[#0055A5]">
                            Book Now
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
              
              {/* Load More */}
              {displayCount < featuredHotels.length && (
                <div className="text-center mt-8">
                  <Button 
                    variant="outline" 
                    size="lg" 
                    onClick={handleLoadMore}
                    disabled={isLoadingMore}
                    className="border-[#0068EF] text-[#0068EF] hover:bg-blue-50"
                  >
                    {isLoadingMore ? "Loading..." : `Load More Hotels (${featuredHotels.length - displayCount} remaining)`}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}