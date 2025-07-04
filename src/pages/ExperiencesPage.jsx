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
import { Star, MapPin, Calendar, Users, Search, Filter, Clock, Camera, Mountain, Waves, Building, Trees, Utensils, Car, SortAsc, Heart, Award, Globe, Sparkles, Gift, Shield } from "lucide-react";
import Header from "../components/layout/header";
import Footer from "../components/layout/footer";
import SEOHead from "../components/common/seo-head";

export default function ExperiencesPage() {
  const [searchParams, setSearchParams] = useState({
    destination: "",
    date: "",
    travelers: 2,
    category: "all"
  });

  const [filters, setFilters] = useState({
    priceRange: [0, 500],
    duration: "any",
    category: [],
    rating: 0,
    sortBy: "popular"
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
    console.log("Searching experiences with:", searchParams);
  };

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setDisplayCount(prev => prev + 6);
      setIsLoadingMore(false);
    }, 1000);
  };

  // Featured experiences data
  const featuredExperiences = [
    {
      id: 1,
      title: "Skip-the-Line: Statue of Liberty & Ellis Island Tour",
      location: "New York City, NY",
      category: "Historical Tours",
      duration: "4 hours",
      rating: 4.8,
      reviews: 3247,
      price: 89,
      originalPrice: 129,
      savings: 31,
      image: "https://images.unsplash.com/photo-1485871981521-5b1fd3805b6d?w=400&h=300&fit=crop",
      highlights: ["Skip-the-line access", "Professional guide", "Ferry included", "Audio guide"],
      dealType: "Popular Choice",
      provider: "GetYourGuide",
      groupSize: "Up to 30 people",
      languages: ["English", "Spanish", "French"],
      featured: true
    },
    {
      id: 2,
      title: "Helicopter Tour: Manhattan and Brooklyn Bridge",
      location: "New York City, NY",
      category: "Air Tours",
      duration: "30 minutes",
      rating: 4.9,
      reviews: 1893,
      price: 199,
      originalPrice: 299,
      savings: 33,
      image: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=400&h=300&fit=crop",
      highlights: ["Bird's eye views", "Professional pilot", "Central Park views", "Brooklyn Bridge"],
      dealType: "Best Seller",
      provider: "Viator",
      groupSize: "Up to 6 people",
      languages: ["English"],
      featured: true
    },
    {
      id: 3,
      title: "Food Tour: Little Italy & Chinatown Walking Experience",
      location: "New York City, NY",
      category: "Food & Drink",
      duration: "3 hours",
      rating: 4.7,
      reviews: 2156,
      price: 79,
      originalPrice: 99,
      savings: 20,
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop",
      highlights: ["6 food tastings", "Local guide", "Hidden gems", "Cultural stories"],
      dealType: "Flash Sale",
      provider: "GetYourGuide",
      groupSize: "Up to 15 people",
      languages: ["English"],
      featured: false
    },
    {
      id: 4,
      title: "Broadway Show: The Lion King - Premium Seats",
      location: "New York City, NY",
      category: "Theater & Shows",
      duration: "2.5 hours",
      rating: 4.9,
      reviews: 4521,
      price: 149,
      originalPrice: 199,
      savings: 25,
      image: "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=400&h=300&fit=crop",
      highlights: ["Premium orchestra seats", "Award-winning show", "Iconic costumes", "Live music"],
      dealType: "Limited Time",
      provider: "Broadway.com",
      groupSize: "Any size",
      languages: ["English"],
      featured: true
    },
    {
      id: 5,
      title: "Central Park Bike Tour with Local Guide",
      location: "New York City, NY",
      category: "Outdoor Activities",
      duration: "2 hours",
      rating: 4.6,
      reviews: 1678,
      price: 49,
      originalPrice: 69,
      savings: 29,
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
      highlights: ["Bike rental included", "Bethesda Fountain", "Strawberry Fields", "Local stories"],
      dealType: "Great Value",
      provider: "Central Park Tours",
      groupSize: "Up to 12 people",
      languages: ["English", "Spanish"],
      featured: false
    },
    {
      id: 6,
      title: "Night Photography Workshop: Brooklyn Bridge",
      location: "New York City, NY",
      category: "Photography",
      duration: "3 hours",
      rating: 4.8,
      reviews: 892,
      price: 119,
      originalPrice: 159,
      savings: 25,
      image: "https://images.unsplash.com/photo-1560439613-dff9c9927f73?w=400&h=300&fit=crop",
      highlights: ["Professional photographer", "Camera techniques", "Golden hour shots", "Editing tips"],
      dealType: "Expert Led",
      provider: "Photo Adventures NYC",
      groupSize: "Up to 8 people",
      languages: ["English"],
      featured: false
    },
    {
      id: 7,
      title: "Sunset Sailing Experience with Dinner",
      location: "New York City, NY",
      category: "Water Activities",
      duration: "3 hours",
      rating: 4.7,
      reviews: 1234,
      price: 129,
      originalPrice: 179,
      savings: 28,
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop",
      highlights: ["Sunset views", "3-course dinner", "Open bar", "Live music"],
      dealType: "Romantic",
      provider: "NYC Sailing",
      groupSize: "Up to 20 people",
      languages: ["English"],
      featured: true
    },
    {
      id: 8,
      title: "Street Art & Graffiti Tour in Brooklyn",
      location: "New York City, NY",
      category: "Cultural Tours",
      duration: "2.5 hours",
      rating: 4.5,
      reviews: 987,
      price: 39,
      originalPrice: 59,
      savings: 34,
      image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop",
      highlights: ["Local artist guide", "Hidden murals", "Art history", "Photo opportunities"],
      dealType: "Cultural",
      provider: "Brooklyn Art Tours",
      groupSize: "Up to 15 people",
      languages: ["English"],
      featured: false
    }
  ];

  const categories = [
    { name: "All Categories", value: "all", icon: Globe },
    { name: "Historical Tours", value: "historical", icon: Building },
    { name: "Food & Drink", value: "food", icon: Utensils },
    { name: "Outdoor Activities", value: "outdoor", icon: Trees },
    { name: "Air Tours", value: "air", icon: Mountain },
    { name: "Photography", value: "photography", icon: Camera },
    { name: "Theater & Shows", value: "theater", icon: Star },
    { name: "Water Activities", value: "water", icon: Waves }
  ];

  const popularDestinations = [
    { city: "New York", country: "USA", experiences: "500+ experiences" },
    { city: "Paris", country: "France", experiences: "450+ experiences" },
    { city: "London", country: "UK", experiences: "380+ experiences" },
    { city: "Tokyo", country: "Japan", experiences: "320+ experiences" },
    { city: "Barcelona", country: "Spain", experiences: "290+ experiences" },
    { city: "Rome", country: "Italy", experiences: "350+ experiences" }
  ];

  const featuredExperiencesList = featuredExperiences.filter(exp => exp.featured);

  return (
    <div className="min-h-screen bg-gray-50">
      <SEOHead title="Experiences: Things to Do, Activities & Tours | UTrippin" description="Book amazing experiences, tours, and activities worldwide. Skip-the-line tickets, guided tours, and unique adventures." />
      
      {/* Top Banner */}
      <div className="bg-[#0068EF] text-white text-sm flex justify-center py-4 px-4">
        <div className="text-center max-w-6xl mx-auto">
          <span className="font-bold mr-8">Adventure Awaits!</span>
          <span>Book unique experiences and activities worldwide. <span className="underline">Learn More</span></span>
        </div>
      </div>

      <Header />
      
      <main className="pt-8">
        {/* Hero Search Section */}
        <div className="bg-gradient-to-br from-[#0068EF] to-[#0055A5] text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Discover Amazing Experiences</h1>
              <p className="text-xl text-blue-100">Tours, activities, and unique adventures in 200+ destinations worldwide</p>
            </div>
            
            <Card className="max-w-4xl mx-auto shadow-2xl border-2 border-white/20">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="destination" className="text-[#003C8A] font-medium">Where to?</Label>
                    <div className="relative mt-1">
                      <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        id="destination"
                        placeholder="Enter a destination or activity"
                        value={searchParams.destination}
                        onChange={(e) => handleInputChange("destination", e.target.value)}
                        className="pl-10 border-2 border-gray-300 focus:border-[#0068EF]"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="date" className="text-[#003C8A] font-medium">When?</Label>
                    <div className="relative mt-1">
                      <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        id="date"
                        type="date"
                        value={searchParams.date}
                        onChange={(e) => handleInputChange("date", e.target.value)}
                        className="pl-10 border-2 border-gray-300 focus:border-[#0068EF]"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="travelers" className="text-[#003C8A] font-medium">Travelers</Label>
                    <select 
                      value={searchParams.travelers.toString()} 
                      onChange={(e) => handleInputChange("travelers", parseInt(e.target.value))}
                      className="mt-1 w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:border-[#0068EF] focus:outline-none"
                    >
                      <option value="1">1 Traveler</option>
                      <option value="2">2 Travelers</option>
                      <option value="3">3 Travelers</option>
                      <option value="4">4 Travelers</option>
                      <option value="5">5+ Travelers</option>
                    </select>
                  </div>
                </div>
                
                <Button onClick={handleSearch} className="w-full bg-[#0068EF] hover:bg-[#0055A5] text-lg py-3" size="lg">
                  <Search className="mr-2 h-5 w-5" />
                  🎯 Find Experiences
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Categories Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h2 className="text-2xl font-bold text-[#003C8A] mb-6 text-center">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-12">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <Card key={category.value} className="hover:shadow-md transition-shadow cursor-pointer text-center p-4 border-2 border-gray-200 hover:border-[#0068EF]">
                  <CardContent className="p-2">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <IconComponent className="h-6 w-6 text-[#0068EF]" />
                    </div>
                    <h3 className="text-sm font-medium text-[#003C8A]">{category.name}</h3>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Featured Experiences */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <h2 className="text-3xl font-bold text-[#003C8A] mb-8 text-center">🌟 Featured Experiences</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {featuredExperiencesList.map((experience) => (
              <Card key={experience.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 border-2 border-gray-200 hover:border-[#0068EF] group">
                <div className="relative">
                  <img
                    src={experience.image}
                    alt={experience.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <Badge className="absolute top-3 left-3 bg-[#FF6200] text-white font-bold">
                    {experience.savings}% OFF
                  </Badge>
                  <Badge className="absolute top-3 right-3 bg-green-600 text-white">
                    {experience.dealType}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute bottom-3 right-3 bg-white/90 hover:bg-white border-[#0068EF] text-[#0068EF]"
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
                
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-xs border-[#0068EF]/20 text-[#0068EF]">{experience.category}</Badge>
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1 text-gray-500" />
                          <span className="text-xs text-gray-500">{experience.duration}</span>
                        </div>
                      </div>
                      <h3 className="text-lg font-bold text-[#003C8A] mb-2 line-clamp-2">{experience.title}</h3>
                      <div className="flex items-center text-gray-600 mb-2">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span className="text-sm">{experience.location}</span>
                      </div>
                      <div className="flex items-center mb-3">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                          <span className="font-semibold">{experience.rating}</span>
                          <span className="text-sm text-gray-500 ml-1">({experience.reviews})</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right ml-4">
                      <div className="text-sm text-gray-500 line-through">${experience.originalPrice}</div>
                      <div className="text-2xl font-bold text-[#0068EF]">${experience.price}</div>
                      <div className="text-sm text-gray-600">per person</div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mb-4">
                    {experience.highlights.slice(0, 2).map((highlight, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs bg-blue-50 text-[#0068EF] border border-[#0068EF]/20">
                        {highlight}
                      </Badge>
                    ))}
                    {experience.highlights.length > 2 && (
                      <Badge variant="outline" className="text-xs border-[#0068EF]/20">
                        +{experience.highlights.length - 2} more
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1 border-[#0068EF] text-[#0068EF] hover:bg-blue-50">
                      View Details
                    </Button>
                    <Button className="flex-1 bg-[#0068EF] hover:bg-[#0055A5]">
                      Book Now
                    </Button>
                  </div>
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
                    <Label className="font-medium text-[#003C8A]">Price Range</Label>
                    <div className="mt-2">
                      <div className="w-full h-2 bg-gray-200 rounded-full relative">
                        <div 
                          className="h-2 bg-[#0068EF] rounded-full"
                          style={{ width: `${(filters.priceRange[1] / 500) * 100}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-sm text-gray-500 mt-1">
                        <span>${filters.priceRange[0]}</span>
                        <span>${filters.priceRange[1]}+</span>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  {/* Duration */}
                  <div>
                    <Label className="font-medium text-[#003C8A]">Duration</Label>
                    <div className="space-y-2 mt-2">
                      {["Any duration", "Up to 1 hour", "1-3 hours", "3-6 hours", "6+ hours", "Full day", "Multi-day"].map((duration) => (
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
                          <label htmlFor={`rating-${rating}`} className="flex items-center text-sm">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                            {rating}+ stars
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
                  <h2 className="text-2xl font-bold text-[#003C8A]">All Experiences in New York</h2>
                  <p className="text-gray-600">{featuredExperiences.length} experiences available</p>
                </div>
                <select 
                  value={filters.sortBy} 
                  onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                  className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#0068EF] focus:outline-none"
                >
                  <option value="popular">Most Popular</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="duration">Duration</option>
                </select>
              </div>

              <div className="space-y-6">
                {featuredExperiences.slice(0, displayCount).map((experience) => (
                  <Card key={experience.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 border-2 border-gray-200 hover:border-[#0068EF]">
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-1/3 relative">
                        <img
                          src={experience.image}
                          alt={experience.title}
                          className="w-full h-48 md:h-full object-cover"
                        />
                        <Badge className="absolute top-3 left-3 bg-[#FF6200] text-white font-bold">
                          {experience.savings}% OFF
                        </Badge>
                        <Badge className="absolute top-3 right-3 bg-green-600 text-white">
                          {experience.dealType}
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
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline" className="text-xs border-[#0068EF]/20 text-[#0068EF]">{experience.category}</Badge>
                              <div className="flex items-center">
                                <Clock className="h-3 w-3 mr-1 text-gray-500" />
                                <span className="text-xs text-gray-500">{experience.duration}</span>
                              </div>
                            </div>
                            <h3 className="text-xl font-bold text-[#003C8A] mb-2">{experience.title}</h3>
                            <div className="flex items-center text-gray-600 mb-2">
                              <MapPin className="h-4 w-4 mr-1" />
                              <span className="text-sm">{experience.location}</span>
                            </div>
                            <div className="flex items-center mb-3">
                              <div className="flex items-center">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                                <span className="font-semibold">{experience.rating}</span>
                                <span className="text-sm text-gray-500 ml-1">({experience.reviews} reviews)</span>
                              </div>
                              <Separator orientation="vertical" className="mx-3 h-4" />
                              <span className="text-sm text-gray-500">{experience.groupSize}</span>
                            </div>
                          </div>
                          
                          <div className="text-right ml-4">
                            <div className="text-sm text-gray-500 line-through">${experience.originalPrice}</div>
                            <div className="text-2xl font-bold text-[#0068EF]">${experience.price}</div>
                            <div className="text-sm text-gray-600">per person</div>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                          {experience.highlights.slice(0, 4).map((highlight, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs bg-blue-50 text-[#0068EF] border border-[#0068EF]/20">
                              {highlight}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>By {experience.provider}</span>
                            <span>{experience.languages.join(", ")}</span>
                          </div>
                          <div className="flex gap-3">
                            <Button variant="outline" className="border-[#0068EF] text-[#0068EF] hover:bg-blue-50">
                              View Details
                            </Button>
                            <Button className="bg-[#0068EF] hover:bg-[#0055A5]">
                              Book Now
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
              
              {/* Load More */}
              {displayCount < featuredExperiences.length && (
                <div className="text-center mt-8">
                  <Button 
                    variant="outline" 
                    size="lg" 
                    onClick={handleLoadMore}
                    disabled={isLoadingMore}
                    className="border-[#0068EF] text-[#0068EF] hover:bg-blue-50"
                  >
                    {isLoadingMore ? "Loading..." : `Load More Experiences (${featuredExperiences.length - displayCount} remaining)`}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Popular Destinations */}
        <div className="bg-white py-16 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-8 text-[#003C8A]">Popular Destinations</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {popularDestinations.map((destination, idx) => (
                <Card key={idx} className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-gray-200 hover:border-[#0068EF]">
                  <CardContent className="p-4 text-center">
                    <h3 className="font-bold text-lg text-[#003C8A]">{destination.city}</h3>
                    <p className="text-gray-600 text-sm mb-2">{destination.country}</p>
                    <p className="text-[#0068EF] text-xs font-medium">{destination.experiences}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Why Book Experiences */}
        <div className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12 text-[#003C8A]">Why Book with UTrippin?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="text-center border-2 border-gray-200">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="h-8 w-8 text-[#0068EF]" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-[#003C8A]">Best Price Guarantee</h3>
                  <p className="text-gray-600">
                    Find a lower price elsewhere? We'll match it and give you an extra 5% off.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="text-center border-2 border-gray-200">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="h-8 w-8 text-[#0068EF]" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-[#003C8A]">Skip-the-Line Access</h3>
                  <p className="text-gray-600">
                    Save time with priority access to popular attractions and experiences.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="text-center border-2 border-gray-200">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Gift className="h-8 w-8 text-[#0068EF]" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-[#003C8A]">Free Cancellation</h3>
                  <p className="text-gray-600">
                    Cancel up to 24 hours before your experience for a full refund.
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