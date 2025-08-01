"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Zap, TrendingUp, Clock, RefreshCw, ExternalLink, Calendar, Rss } from "lucide-react"
import { useFreshStories } from "@/hooks/useFreshStories"
import { RSSAttributionBadge } from "@/components/RSSAttributionBadge"

// REAL editorial stories with working links - YOUR STORIES
const editorialStories = [
  {
    id: "great-migration-routes",
    title: "The Great Migration Routes: Tracing Our Ancestors' Journey",
    description: "Follow the historic paths taken by millions of African Americans during the Great Migration.",
    category: "History",
    link: "/melanin/stories/great-migration-routes",
    image: "/placeholder.svg?height=400&width=600&text=Great+Migration+Historical+Routes",
    author: "Dr. Keisha Brown",
    publishedAt: "2025-01-15",
    readTime: "8 min read",
  },
  {
    id: "2025-black-travel-trends",
    title: "2025 Black Travel Trends: Where Melanin Travelers Are Heading This Year",
    description:
      "Discover the hottest destinations and travel trends for Black Americans in 2025, from luxury heritage tours to sustainable travel experiences.",
    category: "Trends",
    link: "/melanin/stories/2025-black-travel-trends",
    image: "/placeholder.svg?height=400&width=600&text=2025+Black+Travel+Trends",
    author: "Utrippin Editorial Team",
    publishedAt: "2025-01-15",
    readTime: "12 min read",
  },
  {
    id: "harlem-renaissance-tour",
    title: "Harlem Renaissance Walking Tour",
    description: "Explore the cultural heart of the Harlem Renaissance through guided walking tours.",
    category: "Culture",
    link: "/melanin/stories/harlem-renaissance-tour",
    image: "/placeholder.svg?height=400&width=600&text=Harlem+Renaissance+Walking+Tour",
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
    image: "/placeholder.svg?height=400&width=600&text=Historic+Black+Beach+Communities",
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
    image: "/placeholder.svg?height=400&width=600&text=Underground+Railroad+Historical+Sites",
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
    image: "/placeholder.svg?height=400&width=600&text=Black+Cowboys+Western+Heritage",
    author: "Maya Rodriguez",
    publishedAt: "2025-01-05",
    readTime: "9 min read",
  },
]

// REAL restaurants with working links - YOUR RESTAURANTS
const blackOwnedRestaurants = [
  {
    id: "sylvias-restaurant",
    name: "Sylvia's Restaurant",
    location: "Harlem, NY",
    cuisine: "Soul Food",
    link: "/melanin/restaurants/sylvias-restaurant",
    description: "The Queen of Soul Food since 1962",
  },
  {
    id: "dooky-chases",
    name: "Dooky Chase's",
    location: "New Orleans, LA",
    cuisine: "Creole",
    link: "/melanin/restaurants/dooky-chases",
    description: "Legendary Creole cuisine and civil rights history",
  },
  {
    id: "paschals",
    name: "Paschal's",
    location: "Atlanta, GA",
    cuisine: "Southern",
    link: "/melanin/restaurants/paschals",
    description: "Historic meeting place of civil rights leaders",
  },
  {
    id: "amy-ruths",
    name: "Amy Ruth's",
    location: "Harlem, NY",
    cuisine: "Soul Food",
    link: "/melanin/restaurants/amy-ruths",
    description: "Famous for chicken and waffles",
  },
  {
    id: "the-grey",
    name: "The Grey",
    location: "Savannah, GA",
    cuisine: "Southern",
    link: "/melanin/restaurants/the-grey",
    description: "James Beard Award-winning Southern cuisine",
  },
  {
    id: "kikis-chicken-waffles",
    name: "Kiki's Chicken & Waffles",
    location: "Chicago, IL",
    cuisine: "Soul Food",
    link: "/melanin/restaurants/kikis-chicken-waffles",
    description: "Chicago's premier soul food destination",
  },
  {
    id: "brown-sugar-kitchen",
    name: "Brown Sugar Kitchen",
    location: "Oakland, CA",
    cuisine: "Soul Food",
    link: "/melanin/restaurants/brown-sugar-kitchen",
    description: "West Coast soul food with a modern twist",
  },
  {
    id: "melbas",
    name: "Melba's",
    location: "Harlem, NY",
    cuisine: "American Soul",
    link: "/melanin/restaurants/melbas",
    description: "Comfort food in the heart of Harlem",
  },
]

// REAL wineries with working links - YOUR WINERIES
const blackOwnedWineries = [
  {
    id: "brown-estate",
    name: "Brown Estate",
    location: "Napa Valley, CA",
    specialty: "Cabernet Sauvignon",
    link: "/melanin/wineries/brown-estate",
    description: "First Black-owned winery in Napa Valley",
  },
  {
    id: "theopolis-vineyards",
    name: "Theopolis Vineyards",
    location: "Mendocino, CA",
    specialty: "Petite Sirah",
    link: "/melanin/wineries/theopolis-vineyards",
    description: "Award-winning Petite Sirah specialists",
  },
  {
    id: "abbey-creek-vineyard",
    name: "Abbey Creek Vineyard",
    location: "North Plains, OR",
    specialty: "Pinot Noir",
    link: "/melanin/wineries/abbey-creek-vineyard",
    description: "Oregon's premier Black-owned vineyard",
  },
  {
    id: "mcbride-sisters",
    name: "McBride Sisters",
    location: "Livermore, CA",
    specialty: "Sauvignon Blanc",
    link: "/melanin/wineries/mcbride-sisters",
    description: "Sister duo creating exceptional wines",
  },
]

export default function Melanin() {
  // YOUR RSS FUNCTIONALITY - RESTORED
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
  } = useFreshStories()

  return (
    <div className="bg-white text-black min-h-screen">
      {/* Hero Section - WHITE BACKGROUND WITH ANIMATED COMPASS */}
      <section className="bg-gradient-to-br from-gray-50 to-blue-50 py-20">
        <div className="max-w-4xl mx-auto text-center px-4">
          <div className="flex items-center justify-center mb-6">
            <div className="relative mr-4">
              {/* ANIMATED COMPASS SVG - YOUR COMPASS RESTORED */}
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
                <circle cx="50" cy="50" r="35" fill="white" stroke="#e5e7eb" strokeWidth="1" />
                {/* Compass needle */}
                <g className="animate-pulse">
                  {/* North needle (red) */}
                  <polygon points="50,15 55,45 50,40 45,45" fill="#dc2626" />
                  {/* South needle (blue) */}
                  <polygon points="50,85 45,55 50,60 55,55" fill="#2563eb" />
                </g>
                {/* Center dot */}
                <circle cx="50" cy="50" r="3" fill="#1f2937" />
                {/* Cardinal directions */}
                <text x="50" y="10" textAnchor="middle" className="text-xs font-bold" fill="#1f2937">
                  N
                </text>
                <text x="90" y="55" textAnchor="middle" className="text-xs font-bold" fill="#1f2937">
                  E
                </text>
                <text x="50" y="95" textAnchor="middle" className="text-xs font-bold" fill="#1f2937">
                  S
                </text>
                <text x="10" y="55" textAnchor="middle" className="text-xs font-bold" fill="#1f2937">
                  W
                </text>
                <defs>
                  <linearGradient id="compassGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="50%" stopColor="#1d4ed8" />
                    <stop offset="100%" stopColor="#2563eb" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <h1 className="text-6xl font-bold">
              <span className="text-black">The </span>
              <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-700 bg-clip-text text-transparent">
                Melanin
              </span>{" "}
              <span className="bg-gradient-to-r from-blue-700 via-blue-600 to-blue-800 bg-clip-text text-transparent">
                Compass
              </span>
            </h1>
          </div>
          <p className="text-xl text-gray-600 mb-8">
            Navigate the world with confidence, celebrating our rich heritage and discovering destinations where melanin
            shines bright
          </p>
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span>Current 2025 content • Live RSS feeds • Fresh travel insights</span>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: "1s" }}></div>
          </div>
          {/* YOUR CONTENT FRESHNESS INDICATORS */}
          {sources && sources.length > 0 && (
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                <Zap className="h-3 w-3 mr-1" />
                {freshCount} Fresh Stories (2025)
              </Badge>
              <Badge className="bg-blue-50 text-blue-600 border-blue-200">
                <Rss className="h-3 w-3 mr-1" />
                {rss_sources || sources.length} Live Sources
              </Badge>
              <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                <Calendar className="h-3 w-3 mr-1" />
                Updated Every 15 Minutes
              </Badge>
            </div>
          )}
        </div>
      </section>

      {/* YOUR RSS STORIES SECTION - WITH BLUE ACCENTS */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-black flex items-center">
                <Zap className="h-8 w-8 text-blue-600 mr-3" />
                Latest 2025 Travel Updates
              </h2>
              <p className="text-gray-600 mt-2">Current information for making travel decisions right now</p>
            </div>
            <Badge className="bg-blue-100 text-blue-700 border-blue-200 px-4 py-2">
              <TrendingUp className="h-4 w-4 mr-2" />
              {freshCount} Fresh Stories
            </Badge>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Featured Fresh Story */}
            <div className="lg:col-span-2">
              {!loading && !error && freshStories.length > 0 ? (
                <div className="relative h-96 rounded-lg overflow-hidden">
                  <img
                    src={
                      freshStories[0].image ||
                      "/placeholder.svg?height=400&width=800&text=Black+Travelers+Tropical+Beach" ||
                      "/placeholder.svg"
                    }
                    alt={freshStories[0].title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.svg?height=400&width=800&text=Black+Travel+Story"
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  <div className="absolute inset-0 p-6 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div className="flex space-x-2">
                        <Badge className="bg-blue-500/30 text-blue-100 border-blue-400/50 backdrop-blur-sm">
                          <Zap className="h-3 w-3 mr-1" />
                          Fresh 2025 Content
                        </Badge>
                        <RSSAttributionBadge
                          source={freshStories[0].source}
                          rssSource={freshStories[0].rssSource}
                          attribution={freshStories[0].attribution}
                        />
                      </div>
                      <Badge className="bg-blue-600/20 text-blue-100 border-blue-400/30 backdrop-blur-sm">
                        Featured Story
                      </Badge>
                    </div>
                    <div>
                      <h1 className="text-3xl lg:text-4xl font-bold text-white mb-3">{freshStories[0].title}</h1>
                      <p className="text-white/90 text-lg mb-4 line-clamp-2">{freshStories[0].excerpt}</p>
                      <div className="flex items-center space-x-4">
                        <a
                          href={freshStories[0].link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-lg transition-colors"
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
                <div className="relative h-96 rounded-lg overflow-hidden bg-gray-200 animate-pulse">
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="h-8 bg-gray-300 rounded mb-4"></div>
                    <div className="h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  </div>
                </div>
              ) : (
                <a href="/melanin/stories/2025-black-travel-trends" className="block">
                  <div className="relative h-96 rounded-lg overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600">
                    <div className="absolute inset-0 p-6 flex flex-col justify-between">
                      <Badge className="bg-white/20 text-white border-white/30 self-start">Featured Editorial</Badge>
                      <div>
                        <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
                          2025 Black Travel Trends: Where Melanin Travelers Are Heading
                        </h1>
                        <p className="text-white/90 text-lg mb-4">
                          Discover the hottest destinations and travel trends for Black Americans in 2025.
                        </p>
                        <span className="inline-block bg-white text-blue-600 font-bold px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors">
                          Read Full Story →
                        </span>
                      </div>
                    </div>
                  </div>
                </a>
              )}
            </div>

            {/* Right Column - YOUR FRESH STORIES LIST */}
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-black">This Month's Updates</h3>
                  {lastUpdated && (
                    <div className="flex items-center text-xs text-gray-500 mt-1">
                      <Clock className="h-3 w-3 mr-1" />
                      Updated {new Date(lastUpdated).toLocaleTimeString()}
                    </div>
                  )}
                </div>
                <Button
                  onClick={refreshStories}
                  variant="ghost"
                  size="sm"
                  className="text-gray-500 hover:text-black"
                  disabled={loading}
                >
                  <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                </Button>
              </div>

              {loading && (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Fetching latest 2025 content...</p>
                </div>
              )}

              {error && (
                <div className="text-center py-8">
                  <p className="text-red-600 mb-4">{error}</p>
                  <Button
                    onClick={refreshStories}
                    variant="outline"
                    className="border-gray-300 text-black bg-transparent"
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
                      className="flex items-start space-x-4 group cursor-pointer border border-blue-200 rounded-lg p-3 hover:border-blue-400 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <Badge className="bg-blue-100 text-blue-700 border-blue-200 text-xs">
                            <Zap className="h-2 w-2 mr-1" />
                            Fresh
                          </Badge>
                          
                        </div>
                        <h3 className="text-sm font-semibold text-black group-hover:text-blue-600 transition-colors mb-1 line-clamp-2">
                          {story.title}
                        </h3>
                        <p className="text-xs text-gray-600 mb-2 line-clamp-2">{story.excerpt}</p>
                        <div className="flex items-center text-xs text-gray-500 mb-1">
                          <span>{story.source}</span>
                          <span className="mx-2">•</span>
                          <span className="text-blue-600">{story.publishedAt || story.published_at}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RSSAttributionBadge
                            source={story.source}
                            rssSource={story.rssSource}
                            attribution={story.attribution}
                          />
                          
                        </div>
                      </div>
                      <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <ExternalLink className="h-3 w-3 text-blue-600" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* YOUR EDITORIAL STORIES - SEPARATE SECTION */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-black mb-4">Black Travel Stories ✈️</h2>
            <p className="text-xl text-gray-600">Curated editorial content celebrating Black travel experiences</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {editorialStories.slice(0, 6).map((story, index) => (
              <a key={story.id} href={story.link}>
                <Card className="bg-white border-gray-200 overflow-hidden group hover:border-blue-300 transition-all shadow-sm hover:shadow-md h-full">
                  <div className="h-48 bg-gradient-to-br from-blue-500 to-blue-600 relative overflow-hidden">
                    <img
                      src={story.image || "/placeholder.svg"}
                      alt={story.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg?height=200&width=300&text=Story+Image"
                      }}
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-white/90 text-black border-0">{story.category}</Badge>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-black mb-2 group-hover:text-blue-600 transition-colors">
                      {story.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{story.description}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>By {story.author}</span>
                      <span>{story.readTime}</span>
                    </div>
                  </CardContent>
                </Card>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* YOUR RESTAURANTS SECTION */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-black">Black-Owned Restaurants 🍽️</h2>
            <a href="/melanin/restaurants">
              <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent">
                View All
              </Button>
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {blackOwnedRestaurants.slice(0, 8).map((restaurant, index) => (
              <a key={restaurant.id} href={restaurant.link}>
                <Card className="bg-white border-gray-200 overflow-hidden group hover:border-blue-300 transition-all shadow-sm hover:shadow-md h-full">
                  <div className="h-32 bg-gradient-to-br from-blue-500 to-blue-600 relative overflow-hidden">
                    <img
                      src="/placeholder.svg?height=128&width=200&text=Restaurant"
                      alt={restaurant.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-black mb-1 group-hover:text-blue-600 transition-colors">
                      {restaurant.name}
                    </h4>
                    <p className="text-sm text-gray-500 mb-2">{restaurant.location}</p>
                    <p className="text-xs text-gray-600 line-clamp-2">{restaurant.description}</p>
                    <Badge className="bg-blue-100 text-blue-700 border-blue-200 text-xs mt-2">
                      {restaurant.cuisine}
                    </Badge>
                  </CardContent>
                </Card>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* YOUR WINERIES SECTION */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-black mb-8 text-center">Black-Owned Wineries 🍷</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {blackOwnedWineries.slice(0, 8).map((winery, index) => (
              <a key={winery.id} href={winery.link}>
                <Card className="bg-white border-gray-200 overflow-hidden group hover:border-blue-300 transition-all shadow-sm hover:shadow-md h-full">
                  <div className="h-32 bg-gradient-to-br from-blue-500 to-blue-600"></div>
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-black mb-1 group-hover:text-blue-600 transition-colors">
                      {winery.name}
                    </h4>
                    <p className="text-sm text-gray-500 mb-2">{winery.location}</p>
                    <p className="text-xs text-gray-600 line-clamp-2 mb-2">{winery.description}</p>
                    <Badge className="bg-blue-100 text-blue-700 border-blue-200 text-xs">{winery.specialty}</Badge>
                  </CardContent>
                </Card>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* YOUR OLDER STORIES SECTION */}
      {!loading && !error && olderStories.length > 0 && (
        <section className="py-16 bg-white border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-black">Archive Stories</h2>
                <p className="text-gray-600 mt-2">Previous travel content and historical perspectives</p>
              </div>
              <Badge className="bg-gray-100 text-gray-600 border-gray-200">{olderCount} Archive Stories</Badge>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {olderStories.slice(0, 9).map((story) => (
                <Card
                  key={story.id}
                  className="bg-white border-gray-200 overflow-hidden group hover:border-gray-300 transition-all opacity-75 shadow-sm"
                >
                  <div className="h-48 bg-gray-200 relative overflow-hidden">
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
                      <Badge className="bg-gray-100 text-gray-600 border-gray-200 text-xs">Archive</Badge>
                      <span className="text-xs text-gray-500">{story.publishedAt || story.published_at}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-black mb-2 group-hover:text-gray-600 transition-colors">
                      {story.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">{story.excerpt}</p>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-500">{story.source}</span>
                      <a
                        href={story.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-500 hover:text-black"
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

      {/* Newsletter Section - BLUE GRADIENT */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Stay Updated with Fresh 2025 Black Travel Content</h2>
          <p className="text-xl text-blue-100 mb-8">
            Get the latest travel updates, current destination info, and fresh insights delivered weekly for making
            informed travel decisions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              className="bg-white/10 border-white/20 text-white placeholder:text-white/70"
            />
            <Button className="bg-white text-blue-600 hover:bg-blue-50">Subscribe</Button>
          </div>
        </div>
      </section>
    </div>
  )
}