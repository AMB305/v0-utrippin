import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ExternalLink, RefreshCw, Star, Clock, Rss, Calendar, TrendingUp, Zap, MapPin } from 'lucide-react';
import { SEOHead } from "@/components/SEOHead";
import { useFreshStories } from "@/hooks/useFreshStories";
import { RSSAttributionBadge } from "@/components/RSSAttributionBadge";
import ProductLayout from "@/components/ProductLayout";

// Mock editorial stories with photos
const mockEditorialStories = [
  {
    id: "great-migration-routes",
    title: "The Great Migration Routes: Tracing Our Ancestors' Journey",
    description: "Follow the historic paths taken by millions of African Americans during the Great Migration.",
    category: "History",
    link: "/melanin/stories/great-migration-routes",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=600&h=400&fit=crop&crop=center",
    author: "Dr. Keisha Brown",
    publishedAt: "2025-01-15",
    readTime: "8 min read",
  },
  {
    id: "harlem-renaissance-tour",
    title: "Harlem Renaissance Walking Tour",
    description: "Explore the cultural heart of the Harlem Renaissance through guided walking tours.",
    category: "Culture",
    link: "/melanin/stories/harlem-renaissance-tour",
    image: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=600&h=400&fit=crop&crop=center",
    author: "Marcus Williams",
    publishedAt: "2025-01-12",
    readTime: "6 min read",
  },
  {
    id: "black-beach-towns",
    title: "Black Beach Towns: Martha's Vineyard to Sag Harbor",
    description: "Discover historic Black beach communities along the East Coast.",
    category: "Destinations",
    link: "/melanin/stories/black-beach-towns",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400&fit=crop&crop=center",
    author: "Amara Johnson",
    publishedAt: "2025-01-10",
    readTime: "10 min read",
  },
  {
    id: "underground-railroad-sites",
    title: "Underground Railroad Sites You Can Visit Today",
    description: "Educational travel to preserved Underground Railroad stations and safe houses.",
    category: "History",
    link: "/melanin/stories/underground-railroad-sites",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=600&h=400&fit=crop&crop=center",
    author: "Dr. Samuel Davis",
    publishedAt: "2025-01-08",
    readTime: "12 min read",
  },
  {
    id: "black-cowboys-heritage",
    title: "Black Cowboys: Western Heritage Tours",
    description: "Learn about the often-overlooked history of Black cowboys in the American West.",
    category: "Heritage",
    link: "/melanin/stories/black-cowboys-heritage",
    image: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=600&h=400&fit=crop&crop=center",
    author: "Maya Rodriguez",
    publishedAt: "2025-01-05",
    readTime: "9 min read",
  },
  {
    id: "juneteenth-celebrations",
    title: "Juneteenth Celebrations Across America",
    description: "Guide to the best Juneteenth festivals and celebrations nationwide.",
    category: "Culture",
    link: "/melanin/stories/juneteenth-celebrations",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&h=400&fit=crop&crop=center",
    author: "Zara Thompson",
    publishedAt: "2025-01-03",
    readTime: "7 min read",
  },
];

// Black-owned restaurants with photos
const mockRestaurants = [
  {
    id: "sylvias-restaurant",
    name: "Sylvia's Restaurant",
    location: "Harlem, NY",
    cuisine: "Soul Food",
    link: "/melanin/restaurants/sylvias-restaurant",
    description: "The Queen of Soul Food since 1962",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop&crop=center",
  },
  {
    id: "dooky-chases",
    name: "Dooky Chase's",
    location: "New Orleans, LA",
    cuisine: "Creole",
    link: "/melanin/restaurants/dooky-chases",
    description: "Legendary Creole cuisine and civil rights history",
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop&crop=center",
  },
  {
    id: "paschals",
    name: "Paschal's",
    location: "Atlanta, GA",
    cuisine: "Southern",
    link: "/melanin/restaurants/paschals",
    description: "Historic meeting place of civil rights leaders",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop&crop=center",
  },
  {
    id: "amy-ruths",
    name: "Amy Ruth's",
    location: "Harlem, NY",
    cuisine: "Soul Food",
    link: "/melanin/restaurants/amy-ruths",
    description: "Famous for chicken and waffles",
    image: "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400&h=300&fit=crop&crop=center",
  },
  {
    id: "the-grey",
    name: "The Grey",
    location: "Savannah, GA",
    cuisine: "Southern",
    link: "/melanin/restaurants/the-grey",
    description: "James Beard Award-winning Southern cuisine",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop&crop=center",
  },
  {
    id: "kikis-chicken-waffles",
    name: "Kiki's Chicken & Waffles",
    location: "Chicago, IL",
    cuisine: "Soul Food",
    link: "/melanin/restaurants/kikis-chicken-waffles",
    description: "Chicago's premier soul food destination",
    image: "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400&h=300&fit=crop&crop=center",
  },
  {
    id: "brown-sugar-kitchen",
    name: "Brown Sugar Kitchen",
    location: "Oakland, CA",
    cuisine: "Soul Food",
    link: "/melanin/restaurants/brown-sugar-kitchen",
    description: "West Coast soul food with a modern twist",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop&crop=center",
  },
  {
    id: "melbas",
    name: "Melba's",
    location: "Harlem, NY",
    cuisine: "American Soul",
    link: "/melanin/restaurants/melbas",
    description: "Comfort food in the heart of Harlem",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop&crop=center",
  },
];

// Mock wineries with photos
const mockWineries = [
  { name: "Brown Estate", location: "Napa Valley, CA", specialty: "Cabernet Sauvignon" },
  { name: "Theopolis Vineyards", location: "Mendocino, CA", specialty: "Petite Sirah" },
  { name: "Abbey Creek Vineyard", location: "North Plains, OR", specialty: "Pinot Noir" },
  { name: "Aslina Wines", location: "Eden Valley, Australia", specialty: "Riesling" },
  { name: "McBride Sisters", location: "Livermore, CA", specialty: "Sauvignon Blanc" },
  { name: "Camille Winery", location: "Paso Robles, CA", specialty: "Rhône Blends" },
  { name: "Dusted Valley", location: "Walla Walla, WA", specialty: "Syrah" },
  { name: "Reynvaan Family Vineyards", location: "Walla Walla, WA", specialty: "Syrah" },
];

export default function Melanin() {
  const {
    stories,
    freshStories,
    olderStories,
    loading,
    error,
    refreshStories,
    lastUpdated,
    sources,
    totalFound,
    freshCount,
    olderCount,
    rss_sources,
  } = useFreshStories();
  
  const structuredData = [
    {
      "@context": "https://schema.org/",
      "@type": "Product",
      "name": "Melanin & Trippin - Black Travel Community",
      "image": ["/lovable-uploads/55c9029a-d3a1-4fb1-b1dd-12aefc25a39c.png"],
      "description": "Join the ultimate Black travel community. Discover safe destinations, connect with fellow travelers, and explore Black-owned businesses worldwide.",
      "sku": "MT-002",
      "brand": { "@type": "Brand", "name": "Utrippin.ai" },
      "offers": {
        "@type": "Offer",
        "url": "https://utrippin.ai/melanin",
        "priceCurrency": "USD",
        "price": "0.00",
        "priceValidUntil": "2025-12-31",
        "itemCondition": "https://schema.org/NewCondition",
        "availability": "https://schema.org/InStock"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "reviewCount": "89"
      },
      "review": [
        {
          "@type": "Review",
          "author": { "@type": "Person", "name": "Maya Johnson" },
          "datePublished": "2025-01-10",
          "description": "Amazing platform for Black travelers! Found safe destinations and connected with incredible travel buddies.",
          "name": "Perfect for Black travel community",
          "reviewRating": { "@type": "Rating", "ratingValue": "5" }
        }
      ]
    }
  ];

  return (
    <>
      <SEOHead 
        title="Melanin & Trippin - Black Travel Community | Utrippin"
        description="Join the ultimate Black travel community. Discover safe destinations, connect with fellow travelers, and explore Black-owned businesses worldwide."
        structuredData={structuredData}
      />
      
      <ProductLayout>
        <div className="min-h-screen bg-background text-foreground">
          {/* The Melanin Compass Hero */}
          <section className="bg-gradient-to-br from-muted to-muted/80 py-20">
            <div className="max-w-4xl mx-auto text-center px-4">
              <div className="flex items-center justify-center mb-6">
                <div className="relative mr-4">
                  {/* Animated Compass SVG */}
                  <svg
                    width="80"
                    height="80"
                    viewBox="0 0 100 100"
                    className="animate-spin"
                    style={{ animationDuration: "20s" }}
                  >
                    {/* Outer ring */}
                    <circle cx="50" cy="50" r="45" fill="none" stroke="url(#compassGradient)" strokeWidth="2" />

                    {/* Inner compass face */}
                    <circle cx="50" cy="50" r="35" fill="white" stroke="hsl(var(--border))" strokeWidth="1" />

                    {/* Compass needle */}
                    <g className="animate-pulse">
                      {/* North needle (red) */}
                      <polygon points="50,15 55,45 50,40 45,45" fill="hsl(var(--destructive))" />
                      {/* South needle (white) */}
                      <polygon points="50,85 45,55 50,60 55,55" fill="hsl(var(--muted-foreground))" />
                    </g>

                    {/* Center dot */}
                    <circle cx="50" cy="50" r="3" fill="hsl(var(--foreground))" />

                    {/* Cardinal directions */}
                    <text x="50" y="10" textAnchor="middle" className="text-xs font-bold fill-foreground">
                      N
                    </text>
                    <text x="90" y="55" textAnchor="middle" className="text-xs font-bold fill-foreground">
                      E
                    </text>
                    <text x="50" y="95" textAnchor="middle" className="text-xs font-bold fill-foreground">
                      S
                    </text>
                    <text x="10" y="55" textAnchor="middle" className="text-xs font-bold fill-foreground">
                      W
                    </text>

                    <defs>
                      <linearGradient id="compassGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="hsl(var(--warning))" />
                        <stop offset="50%" stopColor="hsl(var(--destructive))" />
                        <stop offset="100%" stopColor="hsl(var(--primary))" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>

                <h1 className="text-6xl font-bold">
                  <span className="text-foreground">The </span>
                  <span className="bg-gradient-to-r from-primary via-accent to-warning bg-clip-text text-transparent">
                    Melanin
                  </span>{" "}
                  <span className="bg-gradient-to-r from-warning via-destructive to-warning bg-clip-text text-transparent">
                    Compass
                  </span>
                </h1>
              </div>

              <p className="text-xl text-muted-foreground mb-8">
                Navigate the world with confidence, celebrating our rich heritage and discovering destinations where melanin
                shines bright
              </p>

              <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                <div className="w-2 h-2 bg-warning rounded-full animate-pulse"></div>
                <span>Current 2025 content • Live RSS feeds • Fresh travel insights</span>
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: "1s" }}></div>
              </div>

              {/* Content Freshness Indicators */}
              {sources && sources.length > 0 && (
                <div className="mt-6 flex flex-wrap justify-center gap-2">
                  <Badge className="bg-success/20 text-success border-success/30">
                    <Zap className="h-3 w-3 mr-1" />
                    {freshCount} Fresh Stories (2025)
                  </Badge>
                  <Badge className="bg-warning/20 text-warning border-warning/30">
                    <Rss className="h-3 w-3 mr-1" />
                    {rss_sources || sources.length} Live Sources
                  </Badge>
                  <Badge className="bg-primary/20 text-primary border-primary/30">
                    <Calendar className="h-3 w-3 mr-1" />
                    Updated Every 15 Minutes
                  </Badge>
                </div>
              )}
            </div>
          </section>

          {/* Current Month Featured Stories - TOP PRIORITY */}
          <section className="py-12 bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-foreground flex items-center">
                    <Zap className="h-8 w-8 text-success mr-3" />
                    Latest 2025 Travel Updates
                  </h2>
                  <p className="text-muted-foreground mt-2">Current information for making travel decisions right now</p>
                </div>
                <Badge className="bg-success/20 text-success border-success/30 px-4 py-2">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  {freshCount} Fresh Stories
                </Badge>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Featured Fresh Story */}
                <div className="lg:col-span-2">
                  {!loading && !error && freshStories.length > 0 ? (
                    <div className="relative h-96 rounded-lg overflow-hidden">
                      {/* Background Image */}
                      <img
                        src={freshStories[0].image || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=400&fit=crop&crop=center"}
                        alt={freshStories[0].title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=400&fit=crop&crop=center"
                        }}
                      />
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                      {/* Content */}
                      <div className="absolute inset-0 p-6 flex flex-col justify-between">
                        {/* Top badges */}
                        <div className="flex justify-between items-start">
                          <div className="flex space-x-2">
                            <Badge className="bg-success/30 text-success border-success/50 backdrop-blur-sm">
                              <Zap className="h-3 w-3 mr-1" />
                              Fresh 2025 Content
                            </Badge>
                            <RSSAttributionBadge
                              source={freshStories[0].source}
                              rssSource={freshStories[0].rssSource}
                              attribution={freshStories[0].attribution}
                            />
                          </div>
                          <Badge className="bg-warning/20 text-warning border-warning/30 backdrop-blur-sm">
                            Featured Story
                          </Badge>
                        </div>

                        {/* Bottom content */}
                        <div>
                          <h1 className="text-3xl lg:text-4xl font-bold text-white mb-3">{freshStories[0].title}</h1>
                          <p className="text-white/90 text-lg mb-4 line-clamp-2">{freshStories[0].excerpt}</p>
                          <div className="flex items-center space-x-4">
                            <a
                              href={freshStories[0].link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-block bg-success hover:bg-success/80 text-white font-bold px-6 py-3 rounded-lg transition-colors"
                            >
                              Read Latest Update →
                            </a>
                            <div className="text-white/70 text-sm">
                              {freshStories[0].source} • {freshStories[0].publishedAt || freshStories[0].published_at}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : loading ? (
                    <div className="relative h-96 rounded-lg overflow-hidden bg-muted animate-pulse">
                      <div className="absolute bottom-6 left-6 right-6">
                        <div className="h-8 bg-muted-foreground/20 rounded mb-4"></div>
                        <div className="h-4 bg-muted-foreground/20 rounded mb-2"></div>
                        <div className="h-4 bg-muted-foreground/20 rounded w-3/4"></div>
                      </div>
                    </div>
                  ) : (
                    <div className="relative h-96 rounded-lg overflow-hidden bg-gradient-to-br from-success to-success/80">
                      <div className="absolute inset-0 p-6 flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                          <Badge className="bg-white/20 text-white border-white/30">Loading Fresh Content</Badge>
                        </div>
                        <div>
                          <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">Loading 2025 Travel Updates...</h1>
                          <p className="text-white/90 text-lg mb-4">
                            We're fetching the latest Black travel content from trusted sources for current travel
                            decisions.
                          </p>
                          <Button
                            onClick={refreshStories}
                            className="bg-white/20 hover:bg-white/30 text-white font-bold px-6 py-3 rounded-lg transition-colors"
                          >
                            Refresh Latest Content
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Additional Fresh Stories */}
                  {!loading && !error && freshStories.length > 1 && (
                    <div className="mt-8 p-6 bg-card rounded-lg border border-success/30">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-foreground flex items-center">
                          <div className="w-2 h-2 bg-success rounded-full animate-pulse mr-2"></div>
                          More Current 2025 Updates
                        </h3>
                        <Badge className="bg-success/20 text-success border-success/30">Live Updates</Badge>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        {freshStories.slice(1, 3).map((story, index) => (
                          <div
                            key={story.id}
                            className="flex items-start space-x-3 p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors border border-success/20"
                          >
                            <div className="w-12 h-12 bg-gradient-to-br from-success to-success/80 rounded-lg flex-shrink-0 flex items-center justify-center">
                              <Zap className="h-5 w-5 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-semibold text-foreground mb-1 line-clamp-2">{story.title}</h4>
                              <p className="text-xs text-muted-foreground mb-2 line-clamp-1">{story.excerpt}</p>
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-success">{story.publishedAt || story.published_at}</span>
                                <ExternalLink className="h-3 w-3 text-muted-foreground" />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Column - Fresh Stories List */}
                <div className="space-y-8">
                  {/* Fresh Stories Section */}
                  <div className="space-y-6">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-xl font-bold text-foreground">This Month's Updates</h3>
                        {lastUpdated && (
                          <div className="flex items-center text-xs text-muted-foreground mt-1">
                            <Clock className="h-3 w-3 mr-1" />
                            Updated {new Date(lastUpdated).toLocaleTimeString()}
                          </div>
                        )}
                      </div>
                      <Button
                        onClick={refreshStories}
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground hover:text-foreground"
                        disabled={loading}
                      >
                        <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                      </Button>
                    </div>

                    {loading && (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-success mx-auto"></div>
                        <p className="mt-4 text-muted-foreground">Fetching latest 2025 content...</p>
                      </div>
                    )}

                    {error && (
                      <div className="text-center py-8">
                        <p className="text-destructive mb-4">{error}</p>
                        <Button
                          onClick={refreshStories}
                          variant="outline"
                          className="border-border text-foreground bg-transparent"
                        >
                          Try Again
                        </Button>
                      </div>
                    )}

                    {!loading && !error && freshStories.length > 0 && (
                      <div className="space-y-4">
                        {freshStories.slice(1, 5).map((story, index) => (
                          <div
                            key={story.id}
                            className="flex items-start space-x-4 group cursor-pointer border border-success/20 rounded-lg p-3 hover:border-success/40 transition-colors"
                          >
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <Badge className="bg-success/20 text-success border-success/30 text-xs">
                                  <Zap className="h-2 w-2 mr-1" />
                                  Fresh
                                </Badge>
                              </div>
                              <h3 className="text-sm font-semibold text-foreground group-hover:text-success transition-colors mb-1 line-clamp-2">
                                {story.title}
                              </h3>
                              <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{story.excerpt}</p>
                              <div className="flex items-center text-xs text-muted-foreground mb-1">
                                <span>{story.source}</span>
                                <span className="mx-2">•</span>
                                <span className="text-success">{story.publishedAt || story.published_at}</span>
                              </div>
                              <RSSAttributionBadge
                                source={story.source}
                                rssSource={story.rssSource}
                                attribution={story.attribution}
                              />
                            </div>
                            <div className="w-6 h-6 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0">
                              <ExternalLink className="h-3 w-3 text-success" />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Editorial Stories Grid */}
          <section className="py-16 bg-muted/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-foreground mb-4">Black Travel Stories ✈️</h2>
                <p className="text-xl text-muted-foreground">Curated editorial content celebrating Black travel experiences</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {mockEditorialStories.slice(0, 6).map((story, index) => (
                  <Card
                    key={story.id}
                    className="bg-card border-border overflow-hidden group hover:border-warning/50 transition-all"
                  >
                    <div className="h-48 bg-gradient-to-br from-warning to-destructive relative overflow-hidden">
                      <img
                        src={story.image || "/placeholder.svg"}
                        alt={story.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.svg?height=200&width=300&text=Story+Image"
                        }}
                      />
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-white/90 text-foreground border-0">{story.category}</Badge>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-warning transition-colors">
                        {story.title}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-3">{story.description}</p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>By {story.author}</span>
                        <span>{story.readTime}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Black-Owned Restaurants */}
          <section className="py-16 bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Black-Owned Restaurants 🍽️</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {mockRestaurants.slice(0, 8).map((restaurant, index) => (
                  <Card
                    key={restaurant.id}
                    className="bg-card border-border overflow-hidden group hover:border-warning/50 transition-all"
                  >
                    <div className="h-32 bg-gradient-to-br from-warning to-destructive relative overflow-hidden">
                      <img
                        src={restaurant.image || "/placeholder.svg"}
                        alt={restaurant.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.svg?height=128&width=200&text=Restaurant"
                        }}
                      />
                    </div>
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-foreground mb-1 group-hover:text-warning transition-colors">
                        {restaurant.name}
                      </h4>
                      <p className="text-sm text-muted-foreground mb-2">{restaurant.location}</p>
                      <p className="text-xs text-muted-foreground line-clamp-2">{restaurant.description}</p>
                      <Badge className="bg-warning/20 text-warning border-warning/30 text-xs mt-2">
                        {restaurant.cuisine}
                      </Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Black-Owned Wineries */}
          <section className="py-16 bg-muted/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Black-Owned Wineries 🍷</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {mockWineries.slice(0, 8).map((winery, index) => (
                  <Card
                    key={index}
                    className="bg-card border-border overflow-hidden group hover:border-primary/50 transition-all"
                  >
                    <div className="h-32 bg-gradient-to-br from-primary to-accent"></div>
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                        {winery.name}
                      </h4>
                      <p className="text-sm text-muted-foreground mb-2">{winery.location}</p>
                      <Badge className="bg-primary/20 text-primary border-primary/30 text-xs">
                        {winery.specialty}
                      </Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Older Stories Section - BOTTOM */}
          {!loading && !error && olderStories.length > 0 && (
            <section className="py-16 bg-background border-t border-border">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">Older Stories</h2>
                    <p className="text-muted-foreground mt-2">Previous travel content and historical perspectives</p>
                  </div>
                  <Badge className="bg-muted text-muted-foreground border-border">{olderCount} Archive Stories</Badge>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  {olderStories.slice(0, 9).map((story) => (
                    <Card
                      key={story.id}
                      className="bg-card border-border overflow-hidden group hover:border-border/50 transition-all opacity-75"
                    >
                      <div className="h-48 bg-gradient-to-br from-muted to-muted/80 relative overflow-hidden">
                        <img
                          src={story.image || "/placeholder.svg"}
                          alt={story.title}
                          className="w-full h-full object-cover opacity-60"
                          onError={(e) => {
                            e.currentTarget.src = "/placeholder.svg?height=200&width=400&text=Archive+Story"
                          }}
                        />
                      </div>
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge className="bg-muted text-muted-foreground border-border text-xs">Archive</Badge>
                          <span className="text-xs text-muted-foreground">{story.publishedAt || story.published_at}</span>
                        </div>
                        <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-muted-foreground transition-colors">
                          {story.title}
                        </h3>
                        <p className="text-muted-foreground text-sm mb-4">{story.excerpt}</p>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-muted-foreground">{story.source}</span>
                          <a
                            href={story.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-foreground"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </div>
                        <RSSAttributionBadge
                          source={story.source}
                          rssSource={story.rssSource}
                          attribution={story.attribution}
                        />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Newsletter Section */}
          <section className="bg-gradient-to-r from-warning to-destructive py-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-3xl font-bold text-white mb-4">Stay Updated with Fresh 2025 Black Travel Content</h2>
              <p className="text-xl text-warning-foreground mb-8">
                Get the latest travel updates, current destination info, and fresh insights delivered weekly for making
                informed travel decisions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/70"
                />
                <Button className="bg-white text-warning hover:bg-white/90">Subscribe</Button>
              </div>
            </div>
          </section>
        </div>
      </ProductLayout>
    </>
  );
}