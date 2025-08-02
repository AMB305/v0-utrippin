import React, { useState, useEffect } from "react";
import { Search, Filter, MapPin, Clock, Users, Star, Map, BarChart3, Wallet } from "lucide-react";
import { SEOHead } from "@/components/SEOHead";
import { ChatAssistant } from "@/components/ChatAssistant";
import { DestinationCard } from "@/components/DestinationCard";
import { ItineraryModal } from "@/components/ItineraryModal";
import { PersonalizedRecommendations } from "@/components/PersonalizedRecommendations";
import { MapboxMap } from "@/components/MapboxMap";
import { TravelInsightsDashboard } from "@/components/TravelInsightsDashboard";

import { BudgetTripsView } from "@/components/BudgetTripsView";
import { BackToTop } from "@/components/BackToTop";

import { ErrorBoundary } from "@/components/ErrorBoundary";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import destinationsData from "@/data/destinations.json";
import dailyIdeas from "@/data/dailyIdeas.json";

interface Destination {
  name: string;
  summary: string;
  description: string;
  image: string;
  tags: string[];
  cuisine: string[];
  highlights: string[];
  tips: string[];
}

const ExploreMerged = () => {
  const [selectedTrip, setSelectedTrip] = useState<Destination | null>(null);
  const [dailyHighlights, setDailyHighlights] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [visibleDestinations, setVisibleDestinations] = useState(12);
  const [viewMode, setViewMode] = useState<'grid' | 'map' | 'insights' | 'budget-trips'>('grid');
  const [userActivity, setUserActivity] = useState({
    favoriteCount: 0,
    viewedCount: 0,
    ratedCount: 0
  });

  // Get unique tags for filtering
  const allTags = Array.from(new Set(destinationsData.flatMap(dest => dest.tags)));
  const filters = ["All", ...allTags.slice(0, 8)]; // Top 8 most common tags

  useEffect(() => {
    // Pick 6 random daily highlight ideas each day
    const shuffled = [...dailyIdeas].sort(() => 0.5 - Math.random());
    setDailyHighlights(shuffled.slice(0, 6));

    // Calculate user activity
    const favorites = JSON.parse(localStorage.getItem('favoriteDestinations') || '[]');
    const views = JSON.parse(localStorage.getItem('destinationViews') || '[]');
    const ratings = JSON.parse(localStorage.getItem('destinationRatings') || '{}');
    
    setUserActivity({
      favoriteCount: favorites.length,
      viewedCount: views.length,
      ratedCount: Object.keys(ratings).length
    });
  }, []);

  // Filter destinations based on search and filter
  const filteredDestinations = destinationsData.filter(dest => {
    const matchesSearch = dest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dest.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dest.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = selectedFilter === "All" || dest.tags.includes(selectedFilter);
    
    return matchesSearch && matchesFilter;
  });

  const loadMoreDestinations = () => {
    setVisibleDestinations(prev => Math.min(prev + 12, filteredDestinations.length));
  };

  return (
    <>
      <SEOHead 
        title="Explore Destinations & Plan Trips | Utrippin"
        description="Discover 50+ amazing destinations worldwide. Get detailed itineraries, local cuisine tips, and book with AI-powered travel planning."
        canonical="https://utrippin.ai/explore"
        keywords="travel planning, destinations, book hotels, flights, AI trips, travel guides"
        structuredData={[
          {
            "@context": "https://schema.org",
            "@type": "TouristDestination",
            "name": "Global Travel Destinations with Utrippin",
            "description": "Explore amazing destinations, plan itineraries, and book your perfect trip with AI assistance.",
            "url": "https://utrippin.ai/explore",
            "numberOfDestinations": destinationsData.length
          },
          // Name Your Price Product Schema (fixes Google Search Console issues)
          {
            "@context": "https://schema.org/",
            "@type": "Product",
            "name": "Name Your Price Travel Package - Utrippin.ai",
            "image": [
              "https://utrippin.ai/lovable-uploads/55c9029a-d3a1-4fb1-b1dd-12aefc25a39c.png"
            ],
            "description": "Plan your perfect staycation or vacation with Utrippin's Name Your Price tool. Enter your budget, and we'll match you with trips tailored to your preferences including flights, hotels, and experiences.",
            "sku": "NYPT-001",
            "brand": {
              "@type": "Brand",
              "name": "Utrippin.ai"
            },
            "category": "Travel Services",
            "offers": {
              "@type": "Offer",
              "url": "https://utrippin.ai/name-your-price",
              "priceCurrency": "USD",
              "price": "199.00",
              "priceValidUntil": "2025-12-31",
              "itemCondition": "https://schema.org/NewCondition",
              "availability": "https://schema.org/InStock",
              "seller": {
                "@type": "Organization",
                "name": "Utrippin.ai"
              }
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "reviewCount": "247",
              "bestRating": "5",
              "worstRating": "1"
            },
            "review": [
              {
                "@type": "Review",
                "author": {
                  "@type": "Person",
                  "name": "Tasha Williams"
                },
                "datePublished": "2025-01-10",
                "description": "Loved how easy it was to name my price and get matched with a trip! Found a perfect staycation for the weekend that fit my budget perfectly.",
                "name": "Amazing experience with Utrippin Name Your Price",
                "reviewRating": {
                  "@type": "Rating",
                  "ratingValue": "5",
                  "bestRating": "5"
                }
              },
              {
                "@type": "Review",
                "author": {
                  "@type": "Person",
                  "name": "Marcus Johnson"
                },
                "datePublished": "2025-01-08",
                "description": "The AI matching was spot on. I entered my budget for a family vacation and got amazing options that I never would have found myself.",
                "name": "Great AI travel matching",
                "reviewRating": {
                  "@type": "Rating",
                  "ratingValue": "5",
                  "bestRating": "5"
                }
              }
            ]
          }
        ]}
      />

      <Header />

      <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-black text-white">
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/src/assets/earth-clouds.jpg')] bg-cover bg-center opacity-10" />
          <div className="relative max-w-7xl mx-auto py-12 sm:py-16 md:py-20 px-4 sm:px-6 text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-fade-in">
              Explore the World
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-slate-300 max-w-4xl mx-auto mb-6 sm:mb-8 animate-fade-in">
              Discover 50+ incredible destinations with detailed itineraries, local insights, and seamless booking
            </p>
            
            {/* Search and Filter Bar */}
            <div className="max-w-4xl mx-auto bg-slate-800/30 backdrop-blur-sm border border-blue-500/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 animate-fade-in">
              <div className="flex flex-col md:flex-row gap-3 sm:gap-4">
                {/* Search Input */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 sm:w-5 sm:h-5" />
                  <input
                    type="text"
                    placeholder="Search destinations, experiences, cuisine..."
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg sm:rounded-xl pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors text-sm sm:text-base"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                {/* Filter Button */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-medium transition-colors text-sm sm:text-base"
                >
                  <Filter className="w-4 h-4 sm:w-5 sm:h-5" />
                  Filters
                </button>
              </div>
              
              {/* View Mode Selector */}
              <div className="flex flex-wrap gap-2 mt-3 sm:mt-4">
                {[
                  { id: 'grid', label: 'Grid View', icon: <MapPin className="w-3 h-3 sm:w-4 sm:h-4" /> },
                  { id: 'budget-trips', label: 'Staycation & Vacation 💰', icon: <Wallet className="w-3 h-3 sm:w-4 sm:h-4" /> },
                  { id: 'map', label: 'Map View', icon: <Map className="w-3 h-3 sm:w-4 sm:h-4" /> },
                  { id: 'insights', label: 'Insights', icon: <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4" /> }
                ].map((mode) => (
                  mode.id === 'budget-trips' ? (
                    <button
                      key={mode.id}
                      onClick={() => setViewMode(mode.id as any)}
                      className={`btn-rotating-glow px-3 sm:px-4 py-2 font-medium flex items-center gap-1 sm:gap-2 transition-colors text-xs sm:text-sm ${
                        viewMode === mode.id ? 'opacity-100' : 'opacity-90'
                      }`}
                    >
                      {mode.icon}
                      {mode.label}
                    </button>
                  ) : (
                    <button
                      key={mode.id}
                      onClick={() => setViewMode(mode.id as any)}
                      className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                        viewMode === mode.id
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'
                      }`}
                    >
                      {mode.icon}
                      {mode.label}
                    </button>
                  )
                ))}
              </div>
              
              {/* Filter Options */}
              {showFilters && (
                <div className="mt-6 pt-6 border-t border-slate-600">
                  <div className="flex flex-wrap gap-3">
                    {filters.map((filter) => (
                      <button
                        key={filter}
                        onClick={() => setSelectedFilter(filter)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                          selectedFilter === filter
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'
                        }`}
                      >
                        {filter}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-4">
          {/* Results Summary */}
          {viewMode === 'grid' && (
            <div className="mb-6 sm:mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
                <h2 className="text-xl sm:text-2xl font-bold">
                  {filteredDestinations.length} Amazing Destinations
                  {searchTerm && <span className="text-blue-400 ml-2">for "{searchTerm}"</span>}
                  {selectedFilter !== "All" && <span className="text-purple-400 ml-2">in {selectedFilter}</span>}
                </h2>
                <div className="text-slate-400 text-xs sm:text-sm">
                  Showing {Math.min(visibleDestinations, filteredDestinations.length)} of {filteredDestinations.length}
                </div>
              </div>
            </div>
          )}

          {/* Content based on view mode */}
          {viewMode === 'grid' && (
            <>
              {/* Personalized Recommendations */}
              <div className="mb-16">
                <PersonalizedRecommendations onDestinationClick={setSelectedTrip} />
              </div>

              {/* Main Destinations Grid */}
              <div className="mb-16">
                {filteredDestinations.length > 0 ? (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
                      {filteredDestinations.slice(0, visibleDestinations).map((dest, idx) => (
                        <div
                          key={idx}
                          className="animate-fade-in"
                          style={{ animationDelay: `${idx * 0.1}s` }}
                        >
                          <DestinationCard 
                            destination={dest}
                            onClick={setSelectedTrip}
                          />
                        </div>
                      ))}
                    </div>
                    
                    {/* Load More Button */}
                    {visibleDestinations < filteredDestinations.length && (
                      <div className="text-center">
                        <button
                          onClick={loadMoreDestinations}
                          className="bg-slate-700 hover:bg-slate-600 text-white px-6 sm:px-8 py-3 rounded-xl font-medium transition-colors text-sm sm:text-base"
                        >
                          Load More Destinations ({filteredDestinations.length - visibleDestinations} remaining)
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-16">
                    <div className="text-6xl mb-4">🌍</div>
                    <h3 className="text-2xl font-bold mb-2">No destinations found</h3>
                    <p className="text-slate-400 mb-6">Try adjusting your search or filters</p>
                    <button
                      onClick={() => {
                        setSearchTerm("");
                        setSelectedFilter("All");
                      }}
                      className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-medium transition-colors"
                    >
                      Clear Filters
                    </button>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Map View */}
          {viewMode === 'map' && (
            <div className="mb-16">
              <div className="text-center mb-6 sm:mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Explore Destinations on Map</h2>
                <p className="text-slate-400">Discover amazing places around the world with our interactive globe</p>
              </div>
              <ErrorBoundary
                fallback={({ error, resetError }) => (
                  <div className="bg-slate-800/50 border border-red-500/20 rounded-2xl p-8 text-center">
                    <div className="text-red-400 text-lg mb-4">Map failed to load</div>
                    <p className="text-slate-400 mb-4">{error?.message || 'An error occurred loading the map'}</p>
                    <button
                      onClick={resetError}
                      className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg transition-colors"
                    >
                      Try Again
                    </button>
                  </div>
                )}
              >
                <MapboxMap 
                  destinations={filteredDestinations}
                  onDestinationClick={(dest) => {
                    // Find the full destination object from the original data
                    const fullDestination = destinationsData.find(d => d.name === dest.name);
                    if (fullDestination) {
                      setSelectedTrip(fullDestination);
                    }
                  }}
                  selectedTags={selectedFilter === "All" ? [] : [selectedFilter]}
                />
              </ErrorBoundary>
            </div>
          )}

          {/* Travel Insights */}
          {viewMode === 'insights' && (
            <div className="mb-16">
              <div className="text-center mb-6 sm:mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Travel Insights & Analytics</h2>
                <p className="text-slate-400">Discover travel trends and personalized recommendations</p>
              </div>
              <ErrorBoundary
                fallback={({ error, resetError }) => (
                  <div className="bg-slate-800/50 border border-red-500/20 rounded-2xl p-8 text-center">
                    <div className="text-red-400 text-lg mb-4">Insights failed to load</div>
                    <p className="text-slate-400 mb-4">{error?.message || 'An error occurred loading travel insights'}</p>
                    <button
                      onClick={resetError}
                      className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg transition-colors"
                    >
                      Try Again
                    </button>
                  </div>
                )}
              >
                <TravelInsightsDashboard 
                  destinations={destinationsData}
                  userActivity={userActivity}
                />
              </ErrorBoundary>
            </div>
          )}

          {/* Budget Trips */}
          {viewMode === 'budget-trips' && (
            <div className="mb-16">
              <ErrorBoundary
                fallback={({ error, resetError }) => (
                  <div className="bg-slate-800/50 border border-red-500/20 rounded-2xl p-8 text-center">
                    <div className="text-red-400 text-lg mb-4">Budget Trips failed to load</div>
                    <p className="text-slate-400 mb-4">{error?.message || 'An error occurred loading budget trips'}</p>
                    <button
                      onClick={resetError}
                      className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg transition-colors"
                    >
                      Try Again
                    </button>
                  </div>
                )}
              >
                <BudgetTripsView />
              </ErrorBoundary>
            </div>
          )}

          {/* Daily Explore Ideas - Show only in grid view */}
          {viewMode === 'grid' && (
            <div className="mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 flex items-center">
                <span className="text-orange-400 mr-3">✨</span> 
                Daily Travel Inspiration
              </h2>
              <p className="text-slate-300 mb-6 sm:mb-8 text-sm sm:text-base">Fresh ideas updated daily - discover new ways to explore</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
                {dailyHighlights.map((idea, idx) => (
                  <button
                    key={idx}
                    className="group bg-slate-800/50 hover:bg-slate-700/50 border border-orange-500/20 hover:border-orange-500/40 text-white p-4 sm:p-6 rounded-xl sm:rounded-2xl transition-all duration-300 hover:scale-105 text-center"
                    onClick={() => {
                      setSearchTerm(idea);
                      setSelectedFilter("All");
                    }}
                  >
                    <div className="text-xl sm:text-2xl mb-2">🎯</div>
                    <div className="text-xs sm:text-sm font-medium group-hover:text-orange-300 transition-colors">{idea}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Travel Stats Section - Show only in grid view */}
          {viewMode === 'grid' && (
            <div className="mb-12 sm:mb-16">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                <div className="bg-slate-800/30 border border-blue-500/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center">
                  <MapPin className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                  <div className="text-2xl font-bold text-white mb-1">{destinationsData.length}+</div>
                  <div className="text-slate-400 text-sm">Destinations</div>
                </div>
                <div className="bg-slate-800/30 border border-green-500/20 rounded-2xl p-6 text-center">
                  <Users className="w-8 h-8 text-green-400 mx-auto mb-3" />
                  <div className="text-2xl font-bold text-white mb-1">50K+</div>
                  <div className="text-slate-400 text-sm">Happy Travelers</div>
                </div>
                <div className="bg-slate-800/30 border border-purple-500/20 rounded-2xl p-6 text-center">
                  <Star className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                  <div className="text-2xl font-bold text-white mb-1">4.9</div>
                  <div className="text-slate-400 text-sm">Average Rating</div>
                </div>
                <div className="bg-slate-800/30 border border-orange-500/20 rounded-2xl p-6 text-center">
                  <Clock className="w-8 h-8 text-orange-400 mx-auto mb-3" />
                  <div className="text-2xl font-bold text-white mb-1">24/7</div>
                  <div className="text-slate-400 text-sm">AI Support</div>
                </div>
              </div>
            </div>
          )}

          {/* Call to Action - Show only in grid view */}
          {viewMode === 'grid' && (
            <div className="text-center bg-gradient-to-r from-slate-800/30 to-blue-900/30 border border-blue-500/20 rounded-3xl p-12">
              <h3 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Ready for Your Next Adventure?
              </h3>
              <p className="text-slate-300 mb-8 max-w-2xl mx-auto text-lg">
                Let our AI travel assistant create personalized itineraries, find the best deals, and guide you through your perfect trip from start to finish.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <button 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
                  onClick={() => setViewMode('budget-trips')}
                >
                  🤖 Start Planning with AI
                </button>
                <button 
                  className="bg-slate-700 hover:bg-slate-600 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 border border-slate-600"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                >
                  🌍 Explore More Destinations
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Itinerary modal when selecting a destination */}
      {selectedTrip && (
        <ItineraryModal 
          trip={selectedTrip} 
          onClose={() => setSelectedTrip(null)} 
        />
      )}

      {/* Floating chat assistant */}
      <ChatAssistant />
      
      {/* Footer */}
      <Footer />
      
      {/* Back to top button */}
      <BackToTop />
      
    </>
  );
};

export default ExploreMerged;
