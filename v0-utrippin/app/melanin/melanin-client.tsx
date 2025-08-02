"use client"

import { useState } from "react"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import {
  Search,
  MapPin,
  Star,
  Clock,
  Heart,
  Share2,
  Compass,
  Camera,
  Utensils,
  TrendingUp,
  RefreshCw,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useFreshStories } from "@/hooks/useFreshStories"
import { StoryVerificationBadge } from "@/components/StoryVerificationBadge"
import { RelevanceScoreBadge } from "@/components/RelevanceScoreBadge"
import { RSSAttributionBadge } from "@/components/RSSAttributionBadge"

export function MelaninClient() {
  const [activeTab, setActiveTab] = useState("stories")
  const [searchQuery, setSearchQuery] = useState("")
  const {
    stories,
    freshStories,
    olderStories,
    loading,
    error,
    refreshStories,
    lastUpdated,
    sources,
    freshCount,
    olderCount,
  } = useFreshStories()

  const destinations = [
    {
      id: 1,
      name: "Ghana - Accra",
      image: "/images/vecteezy/destination-default.jpg",
      description:
        "Explore the vibrant capital and connect with your African heritage through historical sites and cultural experiences.",
      rating: 4.8,
      reviews: 234,
      category: "Heritage",
      highlights: ["Cape Coast Castle", "Kwame Nkrumah Memorial", "Makola Market"],
    },
    {
      id: 2,
      name: "New Orleans, Louisiana",
      image: "/images/vecteezy/festivals-events-new-orleans.jpg",
      description: "Immerse yourself in the birthplace of jazz, Creole culture, and rich African American history.",
      rating: 4.7,
      reviews: 456,
      category: "Culture",
      highlights: ["French Quarter", "Jazz Clubs", "Creole Cuisine"],
    },
    {
      id: 3,
      name: "Harlem, New York",
      image: "/images/vecteezy/arts-culture-kyoto.jpg",
      description: "Walk through the heart of the Harlem Renaissance and experience contemporary Black culture.",
      rating: 4.6,
      reviews: 189,
      category: "History",
      highlights: ["Apollo Theater", "Marcus Garvey Park", "Soul Food Restaurants"],
    },
    {
      id: 4,
      name: "Salvador, Brazil",
      image: "/images/vecteezy/caribbean-beach-paradise.jpg",
      description:
        "Discover Afro-Brazilian culture in this colorful city with rich traditions and stunning architecture.",
      rating: 4.9,
      reviews: 312,
      category: "Culture",
      highlights: ["Pelourinho", "Capoeira Shows", "Bahian Cuisine"],
    },
  ]

  const restaurants = [
    {
      id: 1,
      name: "Sylvia's Restaurant",
      location: "Harlem, New York",
      image: "/images/vecteezy/food-drink-rome.jpg",
      cuisine: "Soul Food",
      rating: 4.5,
      priceRange: "$$",
      description: "The Queen of Soul Food since 1962, serving authentic Southern comfort food in the heart of Harlem.",
      specialties: ["Fried Chicken", "Mac & Cheese", "Cornbread"],
    },
    {
      id: 2,
      name: "Kiki's Chicken & Waffles",
      location: "Chicago, Illinois",
      image: "/images/vecteezy/food-drink-rome.jpg",
      cuisine: "Southern",
      rating: 4.7,
      priceRange: "$$$",
      description: "Modern twist on classic Southern dishes with a focus on locally sourced ingredients.",
      specialties: ["Chicken & Waffles", "Shrimp & Grits", "Peach Cobbler"],
    },
    {
      id: 3,
      name: "The Grey",
      location: "Savannah, Georgia",
      image: "/images/vecteezy/food-drink-rome.jpg",
      cuisine: "Contemporary Southern",
      rating: 4.8,
      priceRange: "$$$$",
      description:
        "Award-winning restaurant in a restored Greyhound bus terminal, celebrating Southern culinary traditions.",
      specialties: ["Oysters", "Country Ham", "Seasonal Vegetables"],
    },
  ]

  const filteredStories = stories.filter(
    (story) =>
      story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.excerpt.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`
    return date.toLocaleDateString()
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/african-american-travel-culture.jpg"
            alt="Melanin Compass Hero"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
        </div>

        <div className="relative z-10 text-white max-w-4xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-6">
            <Compass className="h-12 w-12 text-blavity-gold mr-4" />
            <h1 className="text-5xl md:text-6xl font-bold">Melanin Compass</h1>
          </div>
          <p className="text-xl md:text-2xl mb-8 text-gray-200">
            Your guide to culturally rich destinations, Black-owned businesses, and heritage experiences around the
            world.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Badge className="bg-blavity-gold text-black text-lg px-4 py-2">Cultural Heritage</Badge>
            <Badge className="bg-blavity-coral text-white text-lg px-4 py-2">Black-Owned Businesses</Badge>
            <Badge className="bg-travel-blue text-white text-lg px-4 py-2">Community Stories</Badge>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="stories" className="flex items-center gap-2">
                <Camera className="h-4 w-4" />
                Stories ({stories.length})
              </TabsTrigger>
              <TabsTrigger value="destinations" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Destinations ({destinations.length})
              </TabsTrigger>
              <TabsTrigger value="restaurants" className="flex items-center gap-2">
                <Utensils className="h-4 w-4" />
                Restaurants ({restaurants.length})
              </TabsTrigger>
            </TabsList>

            {/* Stories Tab */}
            <TabsContent value="stories" className="space-y-8">
              {/* Search and Filters */}
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex-1 max-w-md">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Search stories..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-sm text-muted-foreground">
                    {freshCount} fresh • {olderCount} archived
                  </div>
                  <Button variant="outline" size="sm" onClick={refreshStories} disabled={loading}>
                    <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                    Refresh
                  </Button>
                </div>
              </div>

              {/* Fresh Stories Section */}
              {freshStories.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-6">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                    <h2 className="text-2xl font-bold">Fresh Stories</h2>
                    <Badge className="bg-green-500/20 text-green-600">{freshCount} new</Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {freshStories.slice(0, 6).map((story) => (
                      <Card
                        key={story.id}
                        className="group overflow-hidden hover:shadow-lg transition-all duration-300"
                      >
                        <div className="relative h-48 overflow-hidden">
                          <Image
                            src={story.image || "/images/vecteezy/travel-default.jpg"}
                            alt={story.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                            <StoryVerificationBadge verified={story.verified} source={story.source} />
                            <RelevanceScoreBadge score={story.relevanceScore} />
                          </div>
                        </div>
                        <CardContent className="p-6">
                          <h3 className="font-bold text-lg mb-2 line-clamp-2">{story.title}</h3>
                          <p className="text-muted-foreground mb-4 line-clamp-3">{story.excerpt}</p>

                          <div className="flex items-center justify-between mb-4">
                            <RSSAttributionBadge
                              source={story.source}
                              rssSource={story.rssSource}
                              attribution={story.attribution}
                            />
                            <span className="text-sm text-muted-foreground">{formatTimeAgo(story.publishedAt)}</span>
                          </div>

                          <div className="flex items-center justify-between">
                            <Link
                              href={story.link}
                              className="text-travel-blue hover:text-travel-blue/80 font-semibold"
                            >
                              Read More →
                            </Link>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm">
                                <Heart className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Share2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Older Stories Section */}
              {olderStories.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-6">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <h2 className="text-2xl font-bold">Archive</h2>
                    <Badge variant="outline">{olderCount} stories</Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {olderStories.slice(0, 9).map((story) => (
                      <Card
                        key={story.id}
                        className="group overflow-hidden hover:shadow-lg transition-all duration-300"
                      >
                        <div className="relative h-48 overflow-hidden">
                          <Image
                            src={story.image || "/images/vecteezy/travel-default.jpg"}
                            alt={story.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                            <StoryVerificationBadge verified={story.verified} source={story.source} />
                            <RelevanceScoreBadge score={story.relevanceScore} />
                          </div>
                        </div>
                        <CardContent className="p-6">
                          <h3 className="font-bold text-lg mb-2 line-clamp-2">{story.title}</h3>
                          <p className="text-muted-foreground mb-4 line-clamp-3">{story.excerpt}</p>

                          <div className="flex items-center justify-between mb-4">
                            <RSSAttributionBadge
                              source={story.source}
                              rssSource={story.rssSource}
                              attribution={story.attribution}
                            />
                            <span className="text-sm text-muted-foreground">{formatTimeAgo(story.publishedAt)}</span>
                          </div>

                          <div className="flex items-center justify-between">
                            <Link
                              href={story.link}
                              className="text-travel-blue hover:text-travel-blue/80 font-semibold"
                            >
                              Read More →
                            </Link>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm">
                                <Heart className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Share2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Loading State */}
              {loading && (
                <div className="text-center py-12">
                  <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
                  <p className="text-muted-foreground">Loading fresh stories...</p>
                </div>
              )}

              {/* Error State */}
              {error && (
                <div className="text-center py-12">
                  <p className="text-red-500 mb-4">Error loading stories: {error}</p>
                  <Button onClick={refreshStories}>Try Again</Button>
                </div>
              )}

              {/* Empty State */}
              {!loading && !error && filteredStories.length === 0 && (
                <div className="text-center py-12">
                  <Camera className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">No stories found</h3>
                  <p className="text-muted-foreground">Try adjusting your search terms.</p>
                </div>
              )}
            </TabsContent>

            {/* Destinations Tab */}
            <TabsContent value="destinations" className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {destinations.map((destination) => (
                  <Card
                    key={destination.id}
                    className="group overflow-hidden hover:shadow-xl transition-all duration-300"
                  >
                    <div className="relative h-64 overflow-hidden">
                      <Image
                        src={destination.image || "/placeholder.svg"}
                        alt={destination.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-blavity-gold text-black font-semibold">{destination.category}</Badge>
                      </div>
                      <div className="absolute top-4 right-4">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30"
                        >
                          <Heart className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-2xl font-bold mb-2">{destination.name}</h3>
                      <p className="text-muted-foreground mb-4">{destination.description}</p>

                      <div className="flex items-center gap-2 mb-4">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="ml-1 font-semibold">{destination.rating}</span>
                        </div>
                        <span className="text-muted-foreground">({destination.reviews} reviews)</span>
                      </div>

                      <div className="mb-4">
                        <h4 className="font-semibold mb-2">Highlights:</h4>
                        <div className="flex flex-wrap gap-2">
                          {destination.highlights.map((highlight) => (
                            <Badge key={highlight} variant="outline" className="text-xs">
                              {highlight}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <Button className="w-full bg-travel-blue hover:bg-travel-blue/90">Explore Destination</Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Restaurants Tab */}
            <TabsContent value="restaurants" className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {restaurants.map((restaurant) => (
                  <Card
                    key={restaurant.id}
                    className="group overflow-hidden hover:shadow-xl transition-all duration-300"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={restaurant.image || "/placeholder.svg"}
                        alt={restaurant.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-blavity-coral text-white font-semibold">{restaurant.cuisine}</Badge>
                      </div>
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-black/50 text-white">{restaurant.priceRange}</Badge>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold mb-1">{restaurant.name}</h3>
                      <p className="text-muted-foreground text-sm mb-3 flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {restaurant.location}
                      </p>

                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="ml-1 font-semibold">{restaurant.rating}</span>
                        </div>
                        <span className="text-muted-foreground text-sm">• {restaurant.cuisine}</span>
                      </div>

                      <p className="text-muted-foreground text-sm mb-4">{restaurant.description}</p>

                      <div className="mb-4">
                        <h4 className="font-semibold text-sm mb-2">Specialties:</h4>
                        <div className="flex flex-wrap gap-1">
                          {restaurant.specialties.map((specialty) => (
                            <Badge key={specialty} variant="outline" className="text-xs">
                              {specialty}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <Button className="w-full bg-blavity-gold text-black hover:bg-blavity-gold/90">View Menu</Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <Footer />
    </div>
  )
}
