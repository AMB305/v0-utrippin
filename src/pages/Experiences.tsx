import React, { useState } from "react";
import { SEOHead } from "@/components/SEOHead";
import { experiencesData } from "@/data/utrippin_experiences";
import { MapPin, Star, ChevronRight, Search, Sparkles, Loader2, ExternalLink } from "lucide-react";
import SerpApiImage from "@/components/SerpApiImage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useAITripPlanner } from "@/hooks/useAITripPlanner";
import Typewriter from "typewriter-effect";

const Experiences = () => {
  const [visibleCount, setVisibleCount] = useState(8);
  const [inputValue, setInputValue] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(false);
  const { messages, sendMessage, isLoading, error } = useAITripPlanner();

  const tripPlanningExamples = [
    "Plan me a solo trip to Italy on a $1000 budget and set an itinerary",
    "What day can I travel to Miami in the next 2 months the cheapest?",
    "Find me a 5-day adventure trip to Costa Rica under $2000",
    "Book me a hotel in Tokyo with a view of Mount Fuji under $150/night",
    "Plan a romantic weekend getaway to Paris for under $800",
    "Find me the best family-friendly resort in Cancun for summer",
    "Plan a business trip to London with meetings near the financial district"
  ];

  const handleGenerate = () => {
    const messageToSend = inputValue.trim() || tripPlanningExamples[Math.floor(Math.random() * tripPlanningExamples.length)];
    sendMessage(messageToSend);
    setInputValue("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleGenerate();
    }
  };

  // Function to extract booking links from AI response
  const extractBookingLinks = (content: string) => {
    const lines = content.split('\n');
    const links: Array<{title: string, url: string, price?: string}> = [];
    
    lines.forEach(line => {
      // Look for Expedia or booking URLs
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      const urls = line.match(urlRegex);
      if (urls) {
        urls.forEach(url => {
          if (url.includes('expedia') || url.includes('booking') || url.includes('hotels') || url.includes('flights')) {
            const title = line.replace(urlRegex, '').trim().replace(/[*-]/g, '').trim();
            links.push({ title: title || 'Book Now', url });
          }
        });
      }
    });
    
    return links;
  };

  // Generate structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Explore Magical Experiences | Utrippin",
    "description": "Book unforgettable adventures with Utrippin. Save on hotels, flights, theme parks & global vacations.",
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": experiencesData.slice(0, visibleCount).map((exp, idx) => ({
        "@type": "TravelOffer",
        "position": idx + 1,
        "name": exp.title,
        "description": exp.description,
        "image": exp.image,
        "offers": {
          "@type": "Offer",
          "price": exp.price.replace("from $", ""),
          "priceCurrency": "USD"
        }
      }))
    }
  };

  const featuredDeals = experiencesData.slice(0, 6);

  // Helper function to determine image provider based on booking URL
  const getImageProvider = (bookingUrl: string) => {
    if (bookingUrl.includes('undercovertourist') || bookingUrl.includes('tkqlhce') || bookingUrl.includes('anrdoezrs')) {
      return 'undercover-tourist';
    } else if (bookingUrl.includes('expedia')) {
      return 'expedia';
    }
    return 'general';
  };
  const categories = [
    {
      name: "Theme Parks",
      icon: "🎢",
      color: "bg-gradient-to-br from-teal-500 to-teal-600",
      description: "Disney, Universal & More"
    },
    {
      name: "Attractions", 
      icon: "🗽",
      color: "bg-gradient-to-br from-orange-400 to-orange-500",
      description: "Museums, Tours & Sights"
    },
    {
      name: "Sports",
      icon: "🏟️", 
      color: "bg-gradient-to-br from-green-500 to-green-600",
      description: "Games, Events & Activities"
    }
  ];

  return (
    <>
      <SEOHead
        title="Travel Experiences & Activities | uTrippin"
        description="Same experiences for less. No catch! Book amazing travel experiences and activities worldwide at guaranteed best prices."
        canonical="https://utrippin.ai/experiences"
        keywords="Disney deals, theme parks, hotels, vacation packages, travel experiences, attractions"
        structuredData={structuredData}
      />

      <div className="min-h-screen bg-background">
        {/* Hero Section - Undercover Tourist Style */}
        <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative container mx-auto px-4 py-16 md:py-24">
            
            {/* Navigation Tabs */}
            <div className="flex justify-center mb-8">
              <div className="bg-white/10 rounded-lg p-1 inline-flex">
                <div className="bg-white text-blue-900 px-6 py-2 rounded-lg font-semibold text-sm border-b-2 border-orange-400">
                  Discount Experiences
                </div>
                <div className="px-6 py-2 text-white/80 hover:text-white font-semibold text-sm cursor-pointer">
                  Vacation Packages
                </div>
              </div>
            </div>

            <div className="text-center max-w-4xl mx-auto">
              <div className="mb-8">
                <div className="inline-flex bg-yellow-400 text-blue-900 px-4 py-2 rounded-full font-bold text-sm mb-4">
                  SAVE UP TO 35%
                </div>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Same Experiences For Less.
                <br />
                <span className="text-yellow-400">No Catch!</span>
              </h1>
              <p className="text-xl md:text-2xl mb-8 opacity-90">
                We offer the best price on the exact same travel experiences, guaranteed.
              </p>
              
              {/* Search Bar */}
              <div className="max-w-2xl mx-auto mb-8">
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const query = formData.get('search') as string;
                  if (query.trim()) {
                    window.location.href = `/experiences/results?location=${encodeURIComponent(query)}`;
                  }
                }}>
                  <div className="bg-white rounded-full p-2 shadow-lg">
                    <div className="flex items-center">
                      <Search className="h-5 w-5 text-gray-400 ml-4" />
                      <input 
                        name="search"
                        type="text" 
                        placeholder="Theme Park, city, sport, concert, theater"
                        className="w-full px-4 py-4 text-gray-900 rounded-full border-none outline-none text-lg"
                      />
                      <button
                        type="submit"
                        className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-4 mr-2 rounded-full font-bold transition-colors"
                      >
                        Search
                      </button>
                    </div>
                  </div>
                </form>
              </div>
              
              <div className="flex items-center justify-center gap-2 text-green-400">
                <Star className="h-5 w-5 fill-current" />
                <span className="font-semibold">NO HIDDEN FEES</span>
              </div>
            </div>
          </div>
        </section>

        {/* Hotel Booking Promotion */}
        <section className="py-8 bg-yellow-400 text-center">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between max-w-4xl mx-auto">
              <h2 className="text-xl md:text-2xl font-bold text-blue-900">
                Book Your Disney or Universal Resort Hotel with Only a $200 Deposit!
              </h2>
              <a 
                href="/hotels"
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-full font-bold text-sm transition-colors hidden md:flex items-center gap-1"
              >
                Book Now <ChevronRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </section>

        {/* Featured Hot Deals */}
        <section className="py-12 bg-gradient-to-r from-blue-900 to-blue-800 text-white">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="text-2xl">🔥</div>
                <h2 className="text-2xl md:text-3xl font-bold text-yellow-400">This Week's Hot Deals</h2>
              </div>
              <div className="bg-white/10 px-3 py-1 rounded-full text-sm">1 of 7</div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {featuredDeals.map((deal, index) => (
                <div key={index} className="bg-white text-gray-900 rounded-lg overflow-hidden shadow-lg">
                  <div className="relative h-48">
                    <SerpApiImage
                      destination={deal.title}
                      description={deal.description}
                      provider={getImageProvider(deal.bookingUrl)}
                      className="w-full h-full object-cover"
                      alt={deal.title}
                      fallbackImage={deal.image}
                    />
                    <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                      LIMITED TIME!
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-2 line-clamp-2">{deal.title}</h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{deal.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="text-green-600 font-bold text-lg">{deal.price}</div>
                      <a
                        href={deal.bookingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-bold text-sm transition-colors"
                      >
                        QUICK ADD
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center">
              <a 
                href="/deals" 
                className="text-white font-semibold hover:text-yellow-400 transition-colors flex items-center gap-2 mx-auto"
              >
                See More Hot Deals <ChevronRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </section>

        {/* Browse by Category */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-3xl font-bold text-gray-900">Browse by Category</h2>
              <div className="text-gray-500 text-sm">1 - 3 of 12</div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category, index) => (
                <div key={index} className={`${category.color} rounded-2xl p-8 text-white text-center hover:scale-105 transition-transform cursor-pointer relative overflow-hidden`}>
                  <div className="relative z-10">
                    <div className="text-4xl mb-4">{category.icon}</div>
                    <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
                    <p className="opacity-90">{category.description}</p>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* AI Trip Planner Section */}
        <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-travel-navy via-travel-blue-dark to-primary overflow-hidden relative">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-overlay opacity-10"></div>
          
          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              {/* Header */}
              <div className="mb-8 sm:mb-10 md:mb-12">
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4">
                  Describe your perfect trip and budget!
                </h2>
                <p className="text-base sm:text-lg text-white/80 max-w-2xl mx-auto">
                  Get custom itineraries, dates, and budgets tailored just for you.
                </p>
              </div>

              {/* AI Input Interface */}
              <div className="bg-background/10 backdrop-blur-lg rounded-xl sm:rounded-2xl p-1.5 sm:p-2 shadow-large border border-white/10 max-w-3xl mx-auto">
                <div className="flex flex-col sm:flex-row items-center bg-background/80 backdrop-blur-sm rounded-lg sm:rounded-xl px-3 sm:px-4 py-3 sm:py-4 gap-3 sm:gap-4">
                  {/* AI Icon */}
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-primary to-travel-blue rounded-full flex items-center justify-center">
                      <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                  </div>

                  {/* Input Field with Typewriter Overlay */}
                  <div className="flex-1 relative">
                    <Input
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onFocus={() => setIsInputFocused(true)}
                      onBlur={() => setIsInputFocused(false)}
                      onKeyPress={handleKeyPress}
                      className="w-full bg-transparent border-none text-sm sm:text-base md:text-lg p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                      disabled={isLoading}
                    />
                    
                    {/* Typewriter overlay - only show when input is empty and not focused */}
                    {!inputValue && !isInputFocused && (
                      <div className="absolute inset-0 pointer-events-none text-muted-foreground text-sm sm:text-base md:text-lg">
                        <Typewriter
                          options={{
                            strings: tripPlanningExamples,
                            autoStart: true,
                            loop: true,
                            delay: 50,
                            deleteSpeed: 30,
                          }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Generate Button */}
                  <div className="flex-shrink-0 w-full sm:w-auto mt-3 sm:mt-0">
                    <Button 
                      size="lg"
                      onClick={handleGenerate}
                      disabled={isLoading}
                      className="w-full sm:w-auto bg-gradient-to-r from-primary to-travel-blue hover:from-primary-hover hover:to-travel-blue-dark text-white font-semibold px-6 sm:px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-sm sm:text-base"
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Planning...
                        </div>
                      ) : (
                        'Generate'
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Instruction text below the generate box */}
              <p className="text-white/70 text-sm sm:text-base mt-3 sm:mt-4">
                Describe your perfect trip...
              </p>

              {/* Additional Info */}
              <div className="mt-6 sm:mt-8 text-center">
                <p className="text-xs sm:text-sm text-white/60 mb-3 sm:mb-4">
                  Powered by advanced AI • Personalized recommendations • Real-time pricing
                </p>
                <div className="flex flex-wrap justify-center gap-3 sm:gap-4 text-xs text-white/50">
                  <span className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-travel-gold rounded-full"></div>
                    Custom Itineraries
                  </span>
                  <span className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-travel-gold rounded-full"></div>
                    Budget Optimization
                  </span>
                  <span className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-travel-gold rounded-full"></div>
                    Real-time Booking
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* AI Trip Results Section */}
        {(messages.length > 0 || error) && (
          <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Your Personalized Trip Plan</h2>
                
                {/* Error Display */}
                {error && (
                  <Card className="mb-6 border-red-200 bg-red-50">
                    <CardContent className="p-6">
                      <div className="text-red-600 text-center">
                        <p className="font-semibold">Oops! Something went wrong</p>
                        <p className="text-sm mt-1">{error}</p>
                        <Button 
                          onClick={() => window.location.reload()} 
                          className="mt-3 bg-red-600 hover:bg-red-700"
                        >
                          Try Again
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Messages Display */}
                <div className="space-y-6">
                  {messages.map((message, index) => (
                    <Card key={index} className={`${message.role === 'user' ? 'ml-8 bg-blue-50 border-blue-200' : 'mr-8 bg-white'}`}>
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                            message.role === 'user' ? 'bg-blue-600' : 'bg-gradient-to-br from-primary to-travel-blue'
                          }`}>
                            {message.role === 'user' ? (
                              <span className="text-white text-sm font-bold">You</span>
                            ) : (
                              <Sparkles className="w-4 h-4 text-white" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="prose prose-gray max-w-none">
                              <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                                {message.content}
                              </div>
                            </div>
                            
                            {/* Extract and display booking links for AI responses */}
                            {message.role === 'assistant' && (() => {
                              const bookingLinks = extractBookingLinks(message.content);
                              if (bookingLinks.length > 0) {
                                return (
                                  <div className="mt-6 pt-4 border-t border-gray-200">
                                    <h4 className="font-semibold text-gray-900 mb-3">Quick Booking Links:</h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                      {bookingLinks.map((link, linkIndex) => (
                                        <a
                                          key={linkIndex}
                                          href={link.url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="flex items-center justify-between bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-4 py-3 rounded-lg font-semibold transition-all hover:scale-105 shadow-lg"
                                        >
                                          <span className="text-sm">{link.title}</span>
                                          <ExternalLink className="w-4 h-4" />
                                        </a>
                                      ))}
                                    </div>
                                    
                                    {/* General Expedia Links */}
                                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                                      <a
                                        href="https://www.expedia.com/Flights"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm"
                                      >
                                        Book Flights
                                      </a>
                                      <a
                                        href="https://www.expedia.com/Hotels"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm"
                                      >
                                        Book Hotels
                                      </a>
                                      <a
                                        href="https://www.expedia.com/Cars"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm"
                                      >
                                        Rent Cars
                                      </a>
                                    </div>
                                  </div>
                                );
                              }
                              return null;
                            })()}
                          </div>
                        </div>
                        <div className="text-xs text-gray-400 mt-3 text-right">
                          {message.timestamp.toLocaleTimeString()}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Loading indicator */}
                {isLoading && (
                  <Card className="mr-8 bg-white">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-8 h-8 bg-gradient-to-br from-primary to-travel-blue rounded-full flex items-center justify-center flex-shrink-0">
                          <Sparkles className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Planning your perfect trip...
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Featured Experiences */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-3xl font-bold text-gray-900">Featured Experiences</h2>
              <div className="text-gray-500 text-sm">1 of 13</div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {experiencesData.slice(0, visibleCount).map((experience, index) => (
                <div key={index} className="bg-white text-gray-900 rounded-lg overflow-hidden shadow-lg">
                  <div className="relative h-48">
                    <SerpApiImage
                      destination={experience.title}
                      description={experience.description}
                      provider={getImageProvider(experience.bookingUrl)}
                      className="w-full h-full object-cover"
                      alt={experience.title}
                      fallbackImage={experience.image}
                    />
                    <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                      LIMITED TIME!
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-2 line-clamp-2">{experience.title}</h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{experience.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="text-green-600 font-bold text-lg">{experience.price}</div>
                      <a
                        href={experience.bookingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-bold text-sm transition-colors"
                      >
                        QUICK ADD
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {visibleCount < experiencesData.length && (
              <div className="text-center mt-12">
                <button
                  onClick={() => setVisibleCount(prev => Math.min(prev + 8, experiencesData.length))}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
                >
                  Load More Experiences
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Theme Park Planning Guides */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-3xl font-bold text-gray-900">Theme Park Planning Guides</h2>
              <div className="text-gray-500 text-sm">1 of 12</div>
            </div>
            
            {/* Guide Tabs */}
            <div className="flex mb-8">
              <div className="bg-blue-500 text-white px-6 py-3 rounded-l-lg font-semibold">
                Florida Resort Guides
              </div>
              <div className="bg-gray-200 text-gray-700 px-6 py-3 rounded-r-lg font-semibold hover:bg-gray-300 cursor-pointer">
                California Resort Guides
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Featured Guide */}
              <div className="relative rounded-lg overflow-hidden shadow-lg">
                <SerpApiImage
                  destination="Disney World Magic Kingdom Orlando Florida"
                  description="Lightning Lane passes theme park attractions"
                  provider="undercover-tourist"
                  className="w-full h-64 object-cover"
                  alt="Disney World Castle Lightning Lane"
                  fallbackImage="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop&crop=center&q=80"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                  <div className="text-cyan-400 font-bold text-sm mb-2">ORLANDO</div>
                  <h3 className="text-white text-xl font-bold">
                    What You Need to Know About Disney World Lightning Lane Passes
                  </h3>
                </div>
              </div>

              {/* Second Guide */}
              <div className="relative rounded-lg overflow-hidden shadow-lg">
                <SerpApiImage
                  destination="Universal Studios Orlando Florida"
                  description="Theme park guide attractions rides"
                  provider="undercover-tourist"
                  className="w-full h-64 object-cover"
                  alt="Universal Orlando Studios"
                  fallbackImage="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop&crop=center&q=80"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                  <div className="text-cyan-400 font-bold text-sm mb-2">ORLANDO</div>
                  <h3 className="text-white text-xl font-bold">
                    Orlando Universal Studios Guide
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Planning Guides List */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  "Our Ultimate Guide to Disneyland Park",
                  "Our Ultimate Guide to Disney California Adventure Park", 
                  "The Ins and Outs of Disney World's Advance Dining Reservation System",
                  "Do Cruise Ships Have Wi-Fi? Your ~Frogtastic~ Guide to Staying Connected at Sea",
                  "Your Guide to Disney World Weather, Plus How to Pack Year-Round",
                  "Disney World Refurbishments & Closings",
                  "Disneyland Refurbishments & Closings", 
                  "Universal Orlando Refurbishments & Closings — Hollywood Rip Ride Rockit Closing...",
                  "Your Guide to Halloween Horror Nights 2025 at Universal Studios Florida"
                ].map((guide, index) => (
                  <div key={index} className="py-3">
                    <a href="#" className="text-blue-600 hover:text-blue-800 text-lg font-medium hover:underline transition-colors">
                      {guide}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Best Price Guarantee */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 text-center">
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="bg-blue-600 text-white p-4 rounded-2xl">
                <div className="text-yellow-400 text-sm font-bold">BEST</div>
                <div className="text-yellow-400 text-sm font-bold">PRICE</div>
                <div className="text-yellow-400 text-sm font-bold">GUARANTEE</div>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Best Price Guarantee</h2>
                <p className="text-gray-600 max-w-2xl">
                  We offer the best price on the exact same theme park tickets, guaranteed!
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 items-center justify-center">
              {[
                { name: "365 Day Ticket Returns", logo: "🔄" },
                { name: "Walt Disney World", logo: "🏰" },
                { name: "Disneyland", logo: "🎢" },
                { name: "Universal Orlando", logo: "🌍" },
                { name: "Universal Studios", logo: "🎬" },
                { name: "United Parks", logo: "🎪" }
              ].map((partner, index) => (
                <div key={index} className="bg-white p-4 rounded-lg shadow-sm text-center">
                  <div className="text-2xl mb-2">{partner.logo}</div>
                  <div className="text-xs text-gray-600 font-semibold">{partner.name}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Experiences;
