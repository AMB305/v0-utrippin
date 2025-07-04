import React, { useState } from "react";
import Header from "../components/layout/header";
import Footer from "../components/layout/footer";
import SEOHead from "../components/common/seo-head";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Calendar, Plane, Hotel, Package, Star, Clock, MapPin, Filter, Search, TrendingDown, Gift, Bell, Users, Heart } from "lucide-react";
import { Link } from "react-router-dom";

export default function DealsPage() {
  const [activeFilter, setActiveFilter] = useState("all");

  const travelDeals = [
    {
      id: "deal-europe-flights",
      type: "flight",
      title: "Europe Flash Sale",
      destination: "London, Paris, Rome",
      originalPrice: 899,
      salePrice: 549,
      savings: 350,
      description: "Round-trip flights to major European cities. Limited time offer!",
      validUntil: "2025-07-15",
      image: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=400&h=250&fit=crop",
      featured: true,
      rating: 4.8,
      reviews: 2341,
      dealType: "Flash Sale",
      urgency: "24 hours left"
    },
    {
      id: "deal-hawaii-package",
      type: "package",
      title: "Hawaii All-Inclusive",
      destination: "Maui, Hawaii",
      originalPrice: 2799,
      salePrice: 1999,
      savings: 800,
      description: "7 days all-inclusive resort package with flights and transfers.",
      validUntil: "2025-07-20",
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=250&fit=crop",
      featured: true,
      rating: 4.9,
      reviews: 1876,
      dealType: "Best Value",
      urgency: "5 days left"
    },
    {
      id: "deal-luxury-hotels",
      type: "hotel",
      title: "Luxury Hotels 50% Off",
      destination: "Worldwide",
      originalPrice: 450,
      salePrice: 225,
      savings: 225,
      description: "5-star luxury hotels at unbeatable prices. Book now!",
      validUntil: "2025-07-10",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=250&fit=crop",
      featured: false,
      rating: 4.7,
      reviews: 987,
      dealType: "Luxury Deal",
      urgency: "2 days left"
    },
    {
      id: "deal-japan-adventure",
      type: "package",
      title: "Japan Cultural Experience",
      destination: "Tokyo, Kyoto",
      originalPrice: 3499,
      salePrice: 2799,
      savings: 700,
      description: "10-day cultural tour including temples, gardens, and authentic experiences.",
      validUntil: "2025-08-01",
      image: "https://images.unsplash.com/photo-1513407030348-c983a97b98d8?w=400&h=250&fit=crop",
      featured: true,
      rating: 4.8,
      reviews: 1542,
      dealType: "Cultural Explorer",
      urgency: "1 week left"
    },
    {
      id: "deal-weekend-getaway",
      type: "hotel",
      title: "Weekend City Breaks",
      destination: "Major US Cities",
      originalPrice: 299,
      salePrice: 149,
      savings: 150,
      description: "Perfect for quick weekend getaways to vibrant cities.",
      validUntil: "2025-07-25",
      image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=250&fit=crop",
      featured: false,
      rating: 4.5,
      reviews: 3201,
      dealType: "Weekend Special",
      urgency: "3 days left"
    },
    {
      id: "deal-caribbean-cruise",
      type: "package",
      title: "Caribbean Cruise Special",
      destination: "Caribbean Islands",
      originalPrice: 1899,
      salePrice: 1299,
      savings: 600,
      description: "7-night Caribbean cruise with all meals and entertainment.",
      validUntil: "2025-07-30",
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=250&fit=crop",
      featured: false,
      rating: 4.6,
      reviews: 1354,
      dealType: "Cruise Deal",
      urgency: "1 week left"
    },
    {
      id: "deal-ski-package",
      type: "package",
      title: "Alpine Ski Adventure",
      destination: "Swiss Alps",
      originalPrice: 2299,
      salePrice: 1699,
      savings: 600,
      description: "5-day ski package with luxury lodge accommodation and lift tickets.",
      validUntil: "2025-07-18",
      image: "https://images.unsplash.com/photo-1551524164-6cf2ac531400?w=400&h=250&fit=crop",
      featured: false,
      rating: 4.7,
      reviews: 892,
      dealType: "Winter Special",
      urgency: "4 days left"
    },
    {
      id: "deal-business-flights",
      type: "flight",
      title: "Business Class to Asia",
      destination: "Singapore, Bangkok, Hong Kong",
      originalPrice: 2499,
      salePrice: 1799,
      savings: 700,
      description: "Premium business class flights with lounge access and extra baggage.",
      validUntil: "2025-07-22",
      image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400&h=250&fit=crop",
      featured: true,
      rating: 4.9,
      reviews: 756,
      dealType: "Premium Deal",
      urgency: "6 days left"
    }
  ];

  const featuredDeals = travelDeals.filter(deal => deal.featured);
  const flightDeals = travelDeals.filter(deal => deal.type === "flight");
  const hotelDeals = travelDeals.filter(deal => deal.type === "hotel");
  const packageDeals = travelDeals.filter(deal => deal.type === "package");

  const getFilteredDeals = () => {
    switch (activeFilter) {
      case "flights":
        return flightDeals;
      case "hotels":
        return hotelDeals;
      case "packages":
        return packageDeals;
      default:
        return travelDeals;
    }
  };

  const DealCard = ({ deal }) => (
    <Card className="hover:shadow-lg transition-all duration-300 overflow-hidden border-2 border-gray-200 hover:border-[#0068EF] group">
      <div className="relative">
        <img
          src={deal.image}
          alt={deal.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {deal.featured && (
          <Badge className="absolute top-3 left-3 bg-[#FF6200] text-white font-bold z-10">
            Featured Deal
          </Badge>
        )}
        <Badge className="absolute top-3 right-3 bg-green-600 text-white">
          {deal.dealType}
        </Badge>
        <div className="absolute bottom-3 left-3 bg-black/70 text-white px-2 py-1 rounded text-xs font-medium">
          ⏰ {deal.urgency}
        </div>
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
              <Badge variant="outline" className="text-xs border-[#0068EF]/20 text-[#0068EF] capitalize">
                {deal.type}
              </Badge>
              <Badge className="bg-red-100 text-red-800 text-xs font-bold">
                Save ${deal.savings}
              </Badge>
            </div>
            <h3 className="font-semibold text-lg mb-1 text-[#003C8A]">{deal.title}</h3>
            <p className="text-gray-600 flex items-center text-sm mb-2">
              <MapPin className="h-4 w-4 mr-1" />
              {deal.destination}
            </p>
          </div>
        </div>
        
        {deal.rating && (
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="ml-1 text-sm font-semibold">{deal.rating}</span>
              <span className="text-sm text-gray-500 ml-1">({deal.reviews} reviews)</span>
            </div>
          </div>
        )}
        
        <p className="text-sm text-gray-600 mb-4">{deal.description}</p>
        
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <Clock className="h-4 w-4" />
          <span>Valid until {new Date(deal.validUntil).toLocaleDateString()}</span>
        </div>
        
        <div className="border-t pt-4">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-sm text-gray-500 line-through">
                ${deal.originalPrice.toLocaleString()}
              </div>
              <div className="text-2xl font-bold text-[#0068EF]">
                ${deal.salePrice.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">per person</div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="border-[#0068EF] text-[#0068EF] hover:bg-blue-50">
                View Details
              </Button>
              <Link to={deal.type === "flight" ? "/flights" : deal.type === "hotel" ? "/hotels" : "/packages"}>
                <Button className="bg-[#0068EF] hover:bg-[#0055A5]">Book Now</Button>
              </Link>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <SEOHead title="Travel Deals: Exclusive Offers & Flash Sales | UTrippin" description="Discover amazing travel deals and save up to $800 on flights, hotels, and vacation packages. Limited time offers you won't find anywhere else." />
      
      {/* Top Banner */}
      <div className="bg-[#0068EF] text-white text-sm flex justify-center py-4 px-4">
        <div className="text-center max-w-6xl mx-auto">
          <span className="font-bold mr-8">🔥 Flash Sale Alert!</span>
          <span>Limited time deals - Save up to $800 on travel packages! <span className="underline">Shop Now</span></span>
        </div>
      </div>

      <Header />
      
      <main className="pt-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-[#0068EF] to-[#0055A5] text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Exclusive Travel Deals</h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto text-blue-100">
              Save big on flights, hotels, and vacation packages. Limited time offers you won't find anywhere else.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Badge variant="secondary" className="bg-white/20 text-white px-4 py-2">
                <Clock className="h-4 w-4 mr-2" />
                Limited Time Only
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white px-4 py-2">
                <TrendingDown className="h-4 w-4 mr-2" />
                Save up to $800
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white px-4 py-2">
                <Gift className="h-4 w-4 mr-2" />
                Exclusive Offers
              </Badge>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Featured Deals */}
          <section className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-[#003C8A]">🌟 Featured Deals</h2>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Bell className="h-4 w-4" />
                <span>New deals added daily</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredDeals.map((deal) => (
                <DealCard key={deal.id} deal={deal} />
              ))}
            </div>
          </section>

          {/* Filter Tabs */}
          <section className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-[#003C8A]">Browse by Category</h2>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">Filter deals</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-6">
              <Button
                variant={activeFilter === "all" ? "default" : "outline"}
                onClick={() => setActiveFilter("all")}
                className={activeFilter === "all" ? "bg-[#0068EF] hover:bg-[#0055A5]" : "border-[#0068EF] text-[#0068EF] hover:bg-blue-50"}
              >
                All Deals ({travelDeals.length})
              </Button>
              <Button
                variant={activeFilter === "flights" ? "default" : "outline"}
                onClick={() => setActiveFilter("flights")}
                className={activeFilter === "flights" ? "bg-[#0068EF] hover:bg-[#0055A5]" : "border-[#0068EF] text-[#0068EF] hover:bg-blue-50"}
              >
                <Plane className="h-4 w-4 mr-2" />
                Flights ({flightDeals.length})
              </Button>
              <Button
                variant={activeFilter === "hotels" ? "default" : "outline"}
                onClick={() => setActiveFilter("hotels")}
                className={activeFilter === "hotels" ? "bg-[#0068EF] hover:bg-[#0055A5]" : "border-[#0068EF] text-[#0068EF] hover:bg-blue-50"}
              >
                <Hotel className="h-4 w-4 mr-2" />
                Hotels ({hotelDeals.length})
              </Button>
              <Button
                variant={activeFilter === "packages" ? "default" : "outline"}
                onClick={() => setActiveFilter("packages")}
                className={activeFilter === "packages" ? "bg-[#0068EF] hover:bg-[#0055A5]" : "border-[#0068EF] text-[#0068EF] hover:bg-blue-50"}
              >
                <Package className="h-4 w-4 mr-2" />
                Packages ({packageDeals.length})
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getFilteredDeals().map((deal) => (
                <DealCard key={deal.id} deal={deal} />
              ))}
            </div>
          </section>

          {/* Deal Stats */}
          <section className="bg-white rounded-2xl p-8 mb-12 border-2 border-gray-200">
            <h2 className="text-2xl font-bold text-center mb-8 text-[#003C8A]">Why Our Deals Are Unbeatable</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingDown className="h-8 w-8 text-[#0068EF]" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-[#003C8A]">Up to 60% Savings</h3>
                <p className="text-gray-600">
                  Our exclusive partnerships allow us to offer the deepest discounts on travel.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-8 w-8 text-[#0068EF]" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-[#003C8A]">Flash Sales Daily</h3>
                <p className="text-gray-600">
                  New limited-time offers added every day. Check back frequently for the best deals.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-[#0068EF]" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-[#003C8A]">500K+ Happy Travelers</h3>
                <p className="text-gray-600">
                  Join hundreds of thousands of satisfied customers who've saved with our deals.
                </p>
              </div>
            </div>
          </section>

          {/* Newsletter Signup */}
          <section className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-8 text-center border-2 border-[#0068EF]/20">
            <h2 className="text-2xl font-bold mb-4 text-[#003C8A]">Never Miss a Deal Again</h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Subscribe to our newsletter and be the first to know about exclusive travel deals, flash sales, and limited-time offers.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-6">
              <input 
                type="email" 
                placeholder="Enter your email address" 
                className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#0068EF] focus:outline-none"
              />
              <Button className="bg-[#0068EF] hover:bg-[#0055A5] px-6 py-3 rounded-xl font-bold">
                <Bell className="mr-2 h-4 w-4" />
                Get Deals
              </Button>
            </div>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
              <div className="flex items-center">
                <Bell className="h-4 w-4 mr-1" />
                <span>Instant notifications</span>
              </div>
              <div className="flex items-center">
                <Gift className="h-4 w-4 mr-1" />
                <span>Exclusive subscriber deals</span>
              </div>
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                <span>Join 500K+ subscribers</span>
              </div>
            </div>
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}