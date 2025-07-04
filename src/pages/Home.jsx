import { useEffect, useState } from "react";
import Header from "../components/layout/header";
import Footer from "../components/layout/footer";
import MultiSearch from "../components/search/multi-search";
import AiSearchDemo from "../components/search/ai-search-demo.jsx";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { Plane, Hotel, Car, Package, Bot, Heart, Users, Gem, ChartLine, Leaf, Bell, Gift, Compass, ShieldCheck, Sparkles, ChevronLeft, ChevronRight, MessageCircle, Clock } from "lucide-react";
import SEOHead from "../components/common/seo-head";
import AiChat from "../components/ai/ai-chat";
import SponsoredContent, { BannerAd } from "../components/advertising/sponsored-content";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";

export default function Home() {
  const [showAiChat, setShowAiChat] = useState(false);

  const { data: trendingDestinations } = useQuery({
    queryKey: ['/api/destinations/trending'],
    queryFn: async () => {
      const response = await fetch('/api/destinations/trending');
      if (!response.ok) throw new Error('Failed to fetch trending destinations');
      return response.json();
    }
  });

  const features = [
    {
      icon: Bot,
      title: "AI Travel Assistant",
      description: "Chat naturally with our AI to plan complex trips, get recommendations, and book everything in one conversation.",
      color: "bg-blue-50 border-blue-200",
      iconColor: "bg-blue-500",
      textColor: "text-blue-600"
    },
    {
      icon: Heart,
      title: "VR Destination Previews", 
      description: "Virtually explore hotels, destinations, and attractions before you book. See exactly what you're getting.",
      color: "bg-teal-50 border-teal-200",
      iconColor: "bg-teal-500",
      textColor: "text-teal-600"
    },
    {
      icon: Users,
      title: "Social Trip Planning",
      description: "Plan trips with friends, share itineraries, split costs, and vote on activities together in real-time.",
      color: "bg-green-50 border-green-200", 
      iconColor: "bg-green-500",
      textColor: "text-green-600"
    },
    {
      icon: ChartLine,
      title: "Smart Price Prediction",
      description: "Our AI predicts if prices will rise or fall, telling you the best time to book for maximum savings.",
      color: "bg-orange-50 border-orange-200",
      iconColor: "bg-orange-500", 
      textColor: "text-orange-600"
    },
    {
      icon: Leaf,
      title: "Eco-Friendly Travel",
      description: "Track your carbon footprint, find sustainable options, and offset emissions with verified green projects.",
      color: "bg-teal-50 border-teal-200",
      iconColor: "bg-teal-500",
      textColor: "text-teal-600"
    },
    {
      icon: Gem,
      title: "Hidden Gems Discovery", 
      description: "Find authentic, less crowded destinations using local insights and anti-overtourism recommendations.",
      color: "bg-yellow-50 border-yellow-200",
      iconColor: "bg-yellow-500",
      textColor: "text-yellow-600"
    }
  ];

  return (
    <>
      <SEOHead 
        title="UTrippin - AI-Powered Travel Booking Platform | Compare Flights, Hotels & More"
        description="Discover the future of travel booking with UTrippin. Compare flights, hotels, cars and vacation packages with AI-powered recommendations, VR previews, and social travel planning."
        keywords="travel booking, cheap flights, hotel deals, car rentals, vacation packages, AI travel assistant, trip planning"
      />
      
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        {/* Hero Section - Kayak Inspired */}
        <section className="relative bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Main Search Section */}
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-orange-500 via-teal-600 to-blue-600 bg-clip-text text-transparent">
                Search hundreds of travel sites at once
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mb-8">
                Your AI-powered travel companion for digital nomad workations, accessible travel, and unique adventures worldwide
              </p>
            </div>

            {/* Search Tabs - Kayak Style */}
            <div className="mb-8">
              <Tabs defaultValue="ai" className="w-full">
                <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-6">
                  <TabsTrigger value="traditional" className="flex items-center gap-2">
                    <Plane className="h-4 w-4" />
                    Traditional Search
                  </TabsTrigger>
                  <TabsTrigger value="ai" className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    AI Assistant
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="traditional" className="space-y-6">
                  <MultiSearch />
                </TabsContent>
                
                <TabsContent value="ai" className="space-y-6">
                  <AiSearchDemo />
                  <div className="text-center">
                    <Button 
                      onClick={() => setShowAiChat(true)}
                      className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-8 py-3 rounded-full text-lg font-medium"
                    >
                      Start AI Planning Session
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            
            {/* Banner Ad Below Search */}
            <div className="mt-8">
              <BannerAd placement="homepage_search" />
            </div>
          </div>
        </section>

        {/* Travel Deals Section - Kayak Style */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900">
                AI-curated travel deals under $500
              </h2>
              <Button variant="ghost" className="text-teal-600 hover:text-teal-700 font-medium">
                Explore more →
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Deal Card 1 */}
              <Card className="hover:shadow-lg transition-shadow overflow-hidden">
                <div 
                  className="h-48 relative"
                  style={{
                    backgroundImage: "url('https://images.unsplash.com/photo-1555881400-74d7acaacd8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  <div className="absolute inset-0 bg-black bg-opacity-30" />
                  <div className="absolute bottom-2 left-2 text-white">
                    <div className="text-xs opacity-90 font-medium">Digital Nomad Hub</div>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-1">Lisbon</h3>
                  <p className="text-sm text-gray-600 mb-2">2h 15m, non-stop</p>
                  <p className="text-sm text-gray-600 mb-3">Thu 8/15 → Mon 8/19</p>
                  <p className="text-xl font-bold text-gray-900">from $285</p>
                </CardContent>
              </Card>

              {/* Deal Card 2 */}
              <Card className="hover:shadow-lg transition-shadow overflow-hidden">
                <div 
                  className="h-48 relative"
                  style={{
                    backgroundImage: "url('https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  <div className="absolute inset-0 bg-black bg-opacity-30" />
                  <div className="absolute bottom-2 left-2 text-white">
                    <div className="text-xs opacity-90 font-medium">Workation Paradise</div>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-1">Bali</h3>
                  <p className="text-sm text-gray-600 mb-2">14h 30m, 1 stop</p>
                  <p className="text-sm text-gray-600 mb-3">Sat 8/10 → Fri 8/16</p>
                  <p className="text-xl font-bold text-gray-900">from $425</p>
                </CardContent>
              </Card>

              {/* Deal Card 3 */}
              <Card className="hover:shadow-lg transition-shadow overflow-hidden">
                <div 
                  className="h-48 relative"
                  style={{
                    backgroundImage: "url('https://images.unsplash.com/photo-1539037116277-4db20889f2d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  <div className="absolute inset-0 bg-black bg-opacity-30" />
                  <div className="absolute bottom-2 left-2 text-white">
                    <div className="text-xs opacity-90 font-medium">Accessible Travel</div>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-1">Barcelona</h3>
                  <p className="text-sm text-gray-600 mb-2">8h 45m, non-stop</p>
                  <p className="text-sm text-gray-600 mb-3">Wed 8/21 → Sun 8/25</p>
                  <p className="text-xl font-bold text-gray-900">from $395</p>
                </CardContent>
              </Card>

              {/* Deal Card 4 */}
              <Card className="hover:shadow-lg transition-shadow overflow-hidden">
                <div 
                  className="h-48 relative"
                  style={{
                    backgroundImage: "url('https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  <div className="absolute inset-0 bg-black bg-opacity-30" />
                  <div className="absolute bottom-2 left-2 text-white">
                    <div className="text-xs opacity-90 font-medium">Business Bleisure</div>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-1">London</h3>
                  <p className="text-sm text-gray-600 mb-2">7h 20m, non-stop</p>
                  <p className="text-sm text-gray-600 mb-3">Mon 8/12 → Thu 8/15</p>
                  <p className="text-xl font-bold text-gray-900">from $455</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* For Travel Pros Section - Kayak Style */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">
                For travel pros
              </h2>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-10 h-10 rounded-full p-0 bg-white border-gray-200 hover:bg-gray-50"
                  onClick={() => {
                    const container = document.getElementById('travel-pros-container');
                    if (container) {
                      container.scrollLeft -= 320;
                    }
                  }}
                >
                  <ChevronLeft className="h-4 w-4 text-gray-600" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-10 h-10 rounded-full p-0 bg-white border-gray-200 hover:bg-gray-50"
                  onClick={() => {
                    const container = document.getElementById('travel-pros-container');
                    if (container) {
                      container.scrollLeft += 320;
                    }
                  }}
                >
                  <ChevronRight className="h-4 w-4 text-gray-600" />
                </Button>
              </div>
            </div>
            
            <div 
              id="travel-pros-container"
              className="flex gap-6 overflow-x-auto scrollbar-hide pb-4"
              style={{ scrollBehavior: 'smooth' }}
            >
              {/* UTrippin AI */}
              <Card className="hover:shadow-lg transition-shadow bg-white flex-shrink-0 w-80">
                <CardContent className="p-6">
                  <div className="mb-4">
                    <Badge className="bg-gray-800 text-white text-xs font-medium px-2 py-1 mb-3">
                      BETA
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">UTrippin.ai</h3>
                  <p className="text-sm text-gray-600 mb-6">
                    Get travel questions answered with AI-powered insights
                  </p>
                  <div className="h-40 relative bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg flex items-center justify-center overflow-hidden">
                    {/* AI Chat Bubble Illustration - Larger */}
                    <div className="relative">
                      <div className="w-24 h-20 bg-orange-400 rounded-2xl shadow-lg flex items-center justify-center relative">
                        <MessageCircle className="h-12 w-12 text-white" />
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-400 rounded-full flex items-center justify-center shadow-md">
                          <Sparkles className="h-4 w-4 text-white" />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Best Time to Travel */}
              <Card className="hover:shadow-lg transition-shadow bg-white flex-shrink-0 w-80">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-2">Best Time to Travel</h3>
                  <p className="text-sm text-gray-600 mb-6">
                    Know when to save with AI price predictions
                  </p>
                  <div className="h-40 relative bg-gradient-to-br from-orange-100 to-red-100 rounded-lg flex items-center justify-center overflow-hidden">
                    {/* Updated Globe with Timing Elements - Cache Refresh */}
                    <div className="relative">
                      {/* Central Globe */}
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-green-400 rounded-full shadow-lg relative overflow-hidden">
                        <div className="w-6 h-8 bg-green-500 rounded-full absolute top-2 left-3"></div>
                        <div className="w-8 h-6 bg-green-600 rounded-full absolute bottom-3 right-2"></div>
                        <div className="w-3 h-3 bg-blue-600 rounded-full absolute top-6 right-4"></div>
                      </div>
                      
                      {/* Clock/Timer Element */}
                      <div className="absolute -top-2 -right-2 w-12 h-12 bg-red-400 rounded-full shadow-md flex items-center justify-center">
                        <div className="w-8 h-8 bg-white rounded-full relative flex items-center justify-center">
                          <div className="w-0.5 h-3 bg-red-500 absolute top-1"></div>
                          <div className="w-2 h-0.5 bg-red-500 absolute"></div>
                          <div className="w-1 h-1 bg-red-500 rounded-full"></div>
                        </div>
                      </div>
                      
                      {/* Location Pins */}
                      <div className="absolute -bottom-1 -left-1 w-6 h-8 bg-orange-500 rounded-t-full shadow-sm">
                        <div className="w-3 h-3 bg-white rounded-full absolute top-1 left-1.5"></div>
                      </div>
                      
                      {/* Lightning/Speed Elements - Using SVG-like shapes */}
                      <div className="absolute top-2 -left-3 w-4 h-8 bg-yellow-400 transform rotate-12">
                        <div className="w-0 h-0 border-l-2 border-r-2 border-b-4 border-transparent border-b-yellow-400 absolute top-0 left-1"></div>
                        <div className="w-1 h-3 bg-yellow-400 absolute top-2 left-1.5"></div>
                        <div className="w-0 h-0 border-l-2 border-r-2 border-t-4 border-transparent border-t-yellow-400 absolute bottom-0 left-1"></div>
                      </div>
                      
                      <div className="absolute bottom-2 -right-4 w-5 h-10 bg-yellow-300 transform -rotate-12">
                        <div className="w-0 h-0 border-l-2 border-r-2 border-b-4 border-transparent border-b-yellow-300 absolute top-0 left-2"></div>
                        <div className="w-1 h-4 bg-yellow-300 absolute top-3 left-2"></div>
                        <div className="w-0 h-0 border-l-2 border-r-2 border-t-4 border-transparent border-t-yellow-300 absolute bottom-0 left-2"></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Explore Destinations */}
              <Card className="hover:shadow-lg transition-shadow bg-white flex-shrink-0 w-80">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-2">Explore</h3>
                  <p className="text-sm text-gray-600 mb-6">
                    See destinations on your budget with niche market focus
                  </p>
                  <div className="h-40 relative bg-gradient-to-br from-blue-100 to-teal-100 rounded-lg flex items-center justify-center overflow-hidden">
                    {/* Globe with Magnifying Glass Illustration - Larger */}
                    <div className="relative">
                      <div className="w-24 h-24 bg-blue-400 rounded-full shadow-lg relative overflow-hidden">
                        <div className="w-6 h-10 bg-green-500 rounded-full absolute top-3 left-3"></div>
                        <div className="w-8 h-6 bg-green-500 rounded-full absolute bottom-3 right-3"></div>
                        <div className="w-4 h-4 bg-yellow-400 rounded-full absolute top-5 right-5"></div>
                        <div className="w-3 h-3 bg-green-600 rounded-full absolute bottom-6 left-6"></div>
                      </div>
                      <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-green-400 rounded-full flex items-center justify-center shadow-md">
                        <Compass className="h-5 w-5 text-white" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Trips Planning */}
              <Card className="hover:shadow-lg transition-shadow bg-white flex-shrink-0 w-80">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-2">Trips</h3>
                  <p className="text-sm text-gray-600 mb-6">
                    Keep all your plans in one place with group collaboration
                  </p>
                  <div className="h-40 relative bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center overflow-hidden">
                    {/* Map with Plane Illustration - Larger */}
                    <div className="relative">
                      <div className="w-28 h-20 bg-blue-400 rounded-2xl shadow-lg relative overflow-hidden flex items-center justify-center">
                        <div className="w-6 h-4 bg-green-500 rounded-md absolute top-2 left-2"></div>
                        <div className="w-4 h-6 bg-green-500 rounded-md absolute bottom-2 right-3"></div>
                        <div className="w-3 h-3 bg-red-400 rounded-full absolute top-3 right-4"></div>
                        <div className="w-2 h-2 bg-yellow-400 rounded-full absolute bottom-4 left-8"></div>
                      </div>
                      <div className="absolute -top-3 -right-4 transform rotate-45 bg-white rounded-full p-2 shadow-md">
                        <Plane className="h-6 w-6 text-orange-500" />
                      </div>
                      <div className="absolute bottom-2 left-4 flex space-x-2">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Price Alerts */}
              <Card className="hover:shadow-lg transition-shadow bg-white flex-shrink-0 w-80">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-2">Price Alerts</h3>
                  <p className="text-sm text-gray-600 mb-6">
                    Know when prices change for your tracked routes
                  </p>
                  <div className="h-40 relative bg-gradient-to-br from-orange-100 to-red-100 rounded-lg flex items-center justify-center overflow-hidden">
                    {/* Phone with Notification Illustration - Larger */}
                    <div className="relative">
                      <div className="w-16 h-28 bg-orange-400 rounded-2xl shadow-lg relative flex items-center justify-center">
                        <div className="w-12 h-20 bg-white rounded-xl absolute top-2 left-2">
                          <div className="w-8 h-3 bg-gray-200 rounded-md absolute top-2 left-2"></div>
                          <div className="w-6 h-2 bg-gray-200 rounded-sm absolute top-6 left-2"></div>
                          <div className="w-7 h-2 bg-gray-200 rounded-sm absolute top-9 left-2"></div>
                          <div className="w-5 h-2 bg-gray-200 rounded-sm absolute top-12 left-2"></div>
                        </div>
                        <div className="w-4 h-2 bg-orange-500 rounded-md absolute bottom-2 left-6"></div>
                      </div>
                      <div className="absolute -top-3 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center shadow-md">
                        <Bell className="h-4 w-4 text-white" />
                      </div>
                      <div className="absolute -bottom-2 left-4 w-3 h-3 bg-orange-600 rounded-full animate-ping"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Flight Tracker */}
              <Card className="hover:shadow-lg transition-shadow bg-white flex-shrink-0 w-80">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-2">Flight Tracker</h3>
                  <p className="text-sm text-gray-600 mb-6">
                    See real-time delays and gate changes for your flights
                  </p>
                  <div className="h-40 relative bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg flex items-center justify-center overflow-hidden">
                    {/* Tablet with Plane Illustration - Larger */}
                    <div className="relative">
                      <div className="w-28 h-20 bg-blue-400 rounded-2xl shadow-lg relative flex items-center justify-center">
                        <div className="w-24 h-16 bg-white rounded-xl absolute top-2 left-2">
                          <div className="w-20 h-3 bg-blue-200 rounded-md absolute top-2 left-2"></div>
                          <div className="absolute top-6 left-4 transform rotate-45 bg-orange-100 rounded-full p-1">
                            <Plane className="h-4 w-4 text-orange-500" />
                          </div>
                          <div className="w-4 h-1 bg-gray-300 rounded-full absolute top-8 left-10"></div>
                          <div className="w-6 h-1 bg-gray-300 rounded-full absolute top-10 left-11"></div>
                          <div className="w-3 h-1 bg-gray-300 rounded-full absolute top-12 left-8"></div>
                        </div>
                      </div>
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-400 rounded-full animate-pulse shadow-md flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Trending Destinations */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-12">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Trending Destinations for 2025
                </h2>
                <p className="text-xl text-gray-600">
                  Discover the hottest travel destinations with unbeatable deals
                </p>
              </div>
              <Button className="hidden md:block">
                View All Destinations
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {trendingDestinations?.slice(0, 4).map((destination) => (
                <Card key={destination.id} className="overflow-hidden hover:shadow-xl transition-shadow group cursor-pointer">
                  <div 
                    className="h-48 bg-cover bg-center relative"
                    style={{ backgroundImage: `url(${destination.imageUrl || 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&h=600'})` }}
                  >
                    <div className="absolute top-4 right-4 bg-white bg-opacity-90 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Heart className="h-4 w-4 text-gray-400 hover:text-red-500" />
                    </div>
                    {destination.isHiddenGem && (
                      <div className="absolute bottom-4 left-4">
                        <Badge className="bg-green-500">
                          <Leaf className="mr-1 h-3 w-3" />
                          Eco-Certified
                        </Badge>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{destination.name}</h3>
                    <p className="text-gray-600 text-sm mb-3">{destination.description}</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-bold text-primary">${destination.averagePrice}</span>
                        <span className="text-gray-500 text-sm ml-1">avg/person</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Plane className="mr-1 h-4 w-4" />
                        <span>12h 30m</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-16 bg-gradient-to-r from-primary to-cyan-500 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Never Miss a Great Travel Deal
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Get personalized travel deals, price alerts, and exclusive offers delivered straight to your inbox. Join over 500,000 smart travelers.
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
                  className="bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
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
                <Compass className="h-6 w-6 mx-auto mb-2" />
                <div className="font-semibold">Travel Inspiration</div>
                <div className="text-sm text-blue-100">Weekly destination highlights</div>
              </div>
            </div>
            
            <div className="mt-6 text-sm text-blue-100">
              <ShieldCheck className="inline mr-1 h-4 w-4" />
              We respect your privacy. Unsubscribe at any time.
            </div>
          </div>
        </section>

        <Footer />

        {/* Floating AI Chat Button */}
        <div className="fixed bottom-6 right-6 z-50">
          <Button 
            onClick={() => setShowAiChat(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white w-14 h-14 rounded-full shadow-2xl transition-all transform hover:scale-110"
            size="icon"
          >
            <Bot className="h-6 w-6" />
          </Button>
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
        </div>

        {/* AI Chat Modal */}
        {showAiChat && <AiChat onClose={() => setShowAiChat(false)} />}
      </div>
    </>
  );
}