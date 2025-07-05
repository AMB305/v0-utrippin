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
      // Mock data for trending destinations
      return [
        {
          id: 1,
          name: "Lisbon",
          description: "Digital Nomad Hub",
          averagePrice: 285,
          imageUrl: "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
          isHiddenGem: false
        },
        {
          id: 2,
          name: "Bali",
          description: "Workation Paradise",
          averagePrice: 425,
          imageUrl: "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
          isHiddenGem: true
        },
        {
          id: 3,
          name: "Barcelona",
          description: "Accessible Travel",
          averagePrice: 395,
          imageUrl: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
          isHiddenGem: false
        },
        {
          id: 4,
          name: "London",
          description: "Business Bleisure",
          averagePrice: 455,
          imageUrl: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
          isHiddenGem: false
        }
      ];
    }
  });

  const features = [
    {
      icon: Bot,
      title: "AI Travel Assistant",
      description: "Chat naturally with our AI to plan complex trips, get recommendations, and book everything in one conversation.",
      color: "bg-blue-50 border-blue-200",
      iconColor: "bg-[#0068EF]",
      textColor: "text-[#0068EF]"
    },
    {
      icon: Heart,
      title: "VR Destination Previews", 
      description: "Virtually explore hotels, destinations, and attractions before you book. See exactly what you're getting.",
      color: "bg-teal-50 border-teal-200",
      iconColor: "bg-[#0055A5]",
      textColor: "text-[#0055A5]"
    },
    {
      icon: Users,
      title: "Social Trip Planning",
      description: "Plan trips with friends, share itineraries, split costs, and vote on activities together in real-time.",
      color: "bg-green-50 border-green-200", 
      iconColor: "bg-green-600",
      textColor: "text-green-600"
    },
    {
      icon: ChartLine,
      title: "Smart Price Prediction",
      description: "Our AI predicts if prices will rise or fall, telling you the best time to book for maximum savings.",
      color: "bg-orange-50 border-orange-200",
      iconColor: "bg-[#FF6200]", 
      textColor: "text-[#FF6200]"
    },
    {
      icon: Leaf,
      title: "Eco-Friendly Travel",
      description: "Track your carbon footprint, find sustainable options, and offset emissions with verified green projects.",
      color: "bg-green-50 border-green-200",
      iconColor: "bg-green-600",
      textColor: "text-green-600"
    },
    {
      icon: Gem,
      title: "Hidden Gems Discovery", 
      description: "Find authentic, less crowded destinations using local insights and anti-overtourism recommendations.",
      color: "bg-yellow-50 border-yellow-200",
      iconColor: "bg-yellow-600",
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
        {/* Top Banner */}
        <div className="bg-[#0068EF] text-white text-sm flex justify-center py-4 px-4">
          <div className="text-center max-w-6xl mx-auto">
            <span className="font-bold mr-8">Summer Travel Deals!</span>
            <span>Save up to 60% on Express Deals®. Book now for best rates! <span className="underline">Learn More</span></span>
          </div>
        </div>

        <Header />
        
        {/* Hero Section */}
        <section className="relative bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Main Search Section */}
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#FF6200] via-[#0055A5] to-[#0068EF] bg-clip-text text-transparent">
                Search hundreds of travel sites at once
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mb-8">
                Your AI-powered travel companion for digital nomad workations, accessible travel, and unique adventures worldwide
              </p>
            </div>

            {/* Search Tabs */}
            <div className="mb-8">
              <Tabs defaultValue="ai" className="w-full">
                <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-6 bg-gray-100">
                  <TabsTrigger value="traditional" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-[#0068EF]">
                    <Plane className="h-4 w-4" />
                    Traditional Search
                  </TabsTrigger>
                  <TabsTrigger value="ai" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-[#0068EF]">
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
                      className="bg-gradient-to-r from-[#0068EF] to-[#0055A5] hover:from-[#0055A5] hover:to-[#003d7a] text-white px-8 py-3 rounded-full text-lg font-medium"
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

        {/* Travel Deals Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-[#003C8A]">
                AI-curated travel deals under $500
              </h2>
              <Button variant="ghost" className="text-[#0068EF] hover:text-[#0055A5] font-medium">
                Explore more →
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Deal Cards */}
              {trendingDestinations?.map((destination) => (
                <Card key={destination.id} className="hover:shadow-lg transition-shadow overflow-hidden border-2 border-gray-200 hover:border-[#0068EF]">
                  <div 
                    className="h-48 relative"
                    style={{
                      backgroundImage: `url('${destination.imageUrl}')`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  >
                    <div className="absolute inset-0 bg-black bg-opacity-30" />
                    <div className="absolute bottom-2 left-2 text-white">
                      <div className="text-xs opacity-90 font-medium">{destination.description}</div>
                    </div>
                    {destination.isHiddenGem && (
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-green-600 text-white">
                          <Leaf className="mr-1 h-3 w-3" />
                          Eco-Certified
                        </Badge>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-1 text-[#003C8A]">{destination.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">2h 15m, non-stop</p>
                    <p className="text-sm text-gray-600 mb-3">Thu 8/15 → Mon 8/19</p>
                    <p className="text-xl font-bold text-[#0068EF]">from ${destination.averagePrice}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Travel Buddy Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-[#003C8A] mb-4">
                Find Your Travel Buddy
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Connect with fellow travelers who share your interests and discover amazing destinations together.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Find Travel Buddy */}
              <Card className="hover:shadow-lg transition-shadow border-2 border-gray-200 hover:border-[#0068EF] text-center">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <div className="text-2xl">✈️</div>
                  </div>
                  <h3 className="text-xl font-bold text-[#003C8A] mb-3">Find Travel Buddy</h3>
                  <p className="text-gray-600 mb-6">
                    Swipe to match with travelers who share your vibe and travel style.
                  </p>
                  <a 
                    href="/travel-buddy"
                    className="inline-flex items-center text-[#FF6200] font-semibold hover:text-orange-700 transition-colors"
                  >
                    Get Started →
                  </a>
                </CardContent>
              </Card>

              {/* Your Matches */}
              <Card className="hover:shadow-lg transition-shadow border-2 border-gray-200 hover:border-[#0068EF] text-center">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <div className="text-2xl">❤️</div>
                  </div>
                  <h3 className="text-xl font-bold text-[#003C8A] mb-3">Your Matches</h3>
                  <p className="text-gray-600 mb-6">
                    View all your travel buddy connections and start planning together.
                  </p>
                  <a 
                    href="/travel-matches"
                    className="inline-flex items-center text-[#FF6200] font-semibold hover:text-orange-700 transition-colors"
                  >
                    View Matches →
                  </a>
                </CardContent>
              </Card>

              {/* Social Planning */}
              <Card className="hover:shadow-lg transition-shadow border-2 border-gray-200 hover:border-[#0068EF] text-center">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-[#003C8A] mb-3">Plan Together</h3>
                  <p className="text-gray-600 mb-6">
                    Collaborate on itineraries, share costs, and vote on activities with your travel group.
                  </p>
                  <a 
                    href="/ai-travel"
                    className="inline-flex items-center text-[#FF6200] font-semibold hover:text-orange-700 transition-colors"
                  >
                    Start Planning →
                  </a>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* For Travel Pros Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-12">
              <h2 className="text-3xl font-bold text-[#003C8A]">
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
              <Card className="hover:shadow-lg transition-shadow bg-white flex-shrink-0 w-80 border-2 border-gray-200 hover:border-[#0068EF]">
                <CardContent className="p-6">
                  <div className="mb-4">
                    <Badge className="bg-[#003C8A] text-white text-xs font-medium px-2 py-1 mb-3">
                      BETA
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-lg mb-2 text-[#003C8A]">UTrippin.ai</h3>
                  <p className="text-sm text-gray-600 mb-6">
                    Get travel questions answered with AI-powered insights
                  </p>
                  <div className="h-40 relative bg-gradient-to-br from-[#0068EF]/10 to-[#0055A5]/20 rounded-lg flex items-center justify-center overflow-hidden">
                    <div className="relative">
                      <div className="w-24 h-20 bg-[#0068EF] rounded-2xl shadow-lg flex items-center justify-center relative">
                        <MessageCircle className="h-12 w-12 text-white" />
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#FF6200] rounded-full flex items-center justify-center shadow-md">
                          <Sparkles className="h-4 w-4 text-white" />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Best Time to Travel */}
              <Card className="hover:shadow-lg transition-shadow bg-white flex-shrink-0 w-80 border-2 border-gray-200 hover:border-[#0068EF]">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-2 text-[#003C8A]">Best Time to Travel</h3>
                  <p className="text-sm text-gray-600 mb-6">
                    Know when to save with AI price predictions
                  </p>
                  <div className="h-40 relative bg-gradient-to-br from-[#FF6200]/10 to-red-100 rounded-lg flex items-center justify-center overflow-hidden">
                    <div className="relative">
                      <div className="w-20 h-20 bg-gradient-to-br from-[#0068EF] to-[#0055A5] rounded-full shadow-lg relative overflow-hidden">
                        <div className="w-6 h-8 bg-green-500 rounded-full absolute top-2 left-3"></div>
                        <div className="w-8 h-6 bg-green-600 rounded-full absolute bottom-3 right-2"></div>
                        <div className="w-3 h-3 bg-blue-600 rounded-full absolute top-6 right-4"></div>
                      </div>
                      <div className="absolute -top-2 -right-2 w-12 h-12 bg-[#FF6200] rounded-full shadow-md flex items-center justify-center">
                        <Clock className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Price Alerts */}
              <Card className="hover:shadow-lg transition-shadow bg-white flex-shrink-0 w-80 border-2 border-gray-200 hover:border-[#0068EF]">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-2 text-[#003C8A]">Price Alerts</h3>
                  <p className="text-sm text-gray-600 mb-6">
                    Know when prices change for your tracked routes
                  </p>
                  <div className="h-40 relative bg-gradient-to-br from-[#FF6200]/10 to-red-100 rounded-lg flex items-center justify-center overflow-hidden">
                    <div className="relative">
                      <div className="w-16 h-28 bg-[#0068EF] rounded-2xl shadow-lg relative flex items-center justify-center">
                        <div className="w-12 h-20 bg-white rounded-xl absolute top-2 left-2">
                          <div className="w-8 h-3 bg-gray-200 rounded-md absolute top-2 left-2"></div>
                          <div className="w-6 h-2 bg-gray-200 rounded-sm absolute top-6 left-2"></div>
                          <div className="w-7 h-2 bg-gray-200 rounded-sm absolute top-9 left-2"></div>
                          <div className="w-5 h-2 bg-gray-200 rounded-sm absolute top-12 left-2"></div>
                        </div>
                        <div className="w-4 h-2 bg-[#0055A5] rounded-md absolute bottom-2 left-6"></div>
                      </div>
                      <div className="absolute -top-3 -right-2 w-8 h-8 bg-[#FF6200] rounded-full flex items-center justify-center shadow-md">
                        <Bell className="h-4 w-4 text-white" />
                      </div>
                      <div className="absolute -bottom-2 left-4 w-3 h-3 bg-[#FF6200] rounded-full animate-ping"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Flight Tracker */}
              <Card className="hover:shadow-lg transition-shadow bg-white flex-shrink-0 w-80 border-2 border-gray-200 hover:border-[#0068EF]">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-2 text-[#003C8A]">Flight Tracker</h3>
                  <p className="text-sm text-gray-600 mb-6">
                    See real-time delays and gate changes for your flights
                  </p>
                  <div className="h-40 relative bg-gradient-to-br from-[#0068EF]/10 to-cyan-100 rounded-lg flex items-center justify-center overflow-hidden">
                    <div className="relative">
                      <div className="w-28 h-20 bg-[#0068EF] rounded-2xl shadow-lg relative flex items-center justify-center">
                        <div className="w-24 h-16 bg-white rounded-xl absolute top-2 left-2">
                          <div className="w-20 h-3 bg-blue-200 rounded-md absolute top-2 left-2"></div>
                          <div className="absolute top-6 left-4 transform rotate-45 bg-[#FF6200]/20 rounded-full p-1">
                            <Plane className="h-4 w-4 text-[#FF6200]" />
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

        {/* Newsletter Section */}
        <section className="py-16 bg-gradient-to-r from-[#0068EF] to-[#0055A5] text-white">
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
            className="bg-[#0068EF] hover:bg-[#0055A5] text-white w-14 h-14 rounded-full shadow-2xl transition-all transform hover:scale-110"
            size="icon"
          >
            <Bot className="h-6 w-6" />
          </Button>
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-[#FF6200] rounded-full animate-pulse"></div>
        </div>

        {/* AI Chat Modal */}
        {showAiChat && <AiChat onClose={() => setShowAiChat(false)} />}
      </div>
    </>
  );
}