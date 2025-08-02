"use client"
import { Header } from "./Header"
import { Footer } from "./Footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Star, Search, ArrowRight, Globe, Heart, Camera, Compass } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export function HomePage() {
  const featuredDestinations = [
    {
      id: 1,
      name: "Santorini, Greece",
      image: "/images/vecteezy/romantic-santorini-greece.jpg",
      rating: 4.9,
      reviews: 2847,
      price: "$299",
      category: "Romantic",
    },
    {
      id: 2,
      name: "Bali, Indonesia",
      image: "/images/vecteezy/inspired-getaways-bali.jpg",
      rating: 4.8,
      reviews: 1923,
      price: "$199",
      category: "Adventure",
    },
    {
      id: 3,
      name: "Tokyo, Japan",
      image: "/images/vecteezy/arts-culture-kyoto.jpg",
      rating: 4.7,
      reviews: 3156,
      price: "$399",
      category: "Culture",
    },
    {
      id: 4,
      name: "Maldives",
      image: "/images/maldives-beach.jpg",
      rating: 4.9,
      reviews: 1654,
      price: "$599",
      category: "Luxury",
    },
  ]

  const travelStories = [
    {
      id: 1,
      title: "Hidden Gems of Southeast Asia",
      excerpt: "Discover the untold stories of remote islands and ancient temples that most travelers never see.",
      image: "/images/vecteezy/travel-default.jpg",
      author: "Sarah Chen",
      readTime: "8 min read",
      category: "Adventure",
    },
    {
      id: 2,
      title: "Solo Female Travel: Safety Tips for 2025",
      excerpt: "Essential advice and resources for women traveling alone, from local experts worldwide.",
      image: "/images/vecteezy/travel-placeholder.jpg",
      author: "Maria Rodriguez",
      readTime: "12 min read",
      category: "Safety",
    },
    {
      id: 3,
      title: "Sustainable Tourism: Making a Difference",
      excerpt: "How conscious travelers are helping preserve destinations for future generations.",
      image: "/images/vecteezy/destination-default.jpg",
      author: "David Park",
      readTime: "6 min read",
      category: "Sustainability",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image src="/images/vecteezy/travel-default.jpg" alt="Travel Hero" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in-up">
            Your Next Adventure
            <span className="block text-travel-gold">Starts Here</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200 animate-fade-in-up animation-delay-200">
            Discover amazing destinations, plan perfect trips, and create unforgettable memories with AI-powered travel
            recommendations.
          </p>

          {/* Search Bar */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 max-w-2xl mx-auto mb-8 animate-fade-in-up animation-delay-400">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Where do you want to go?"
                  className="h-12 text-lg border-0 bg-transparent text-gray-800 placeholder:text-gray-500"
                />
              </div>
              <Button size="lg" className="h-12 px-8 bg-travel-blue hover:bg-travel-blue/90">
                <Search className="h-5 w-5 mr-2" />
                Explore
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4 animate-fade-in-up animation-delay-600">
            <Link href="/melanin">
              <Button variant="outline" size="lg" className="bg-white/20 border-white/30 text-white hover:bg-white/30">
                <Compass className="h-5 w-5 mr-2" />
                Melanin Compass
              </Button>
            </Link>
            <Link href="/destinations">
              <Button variant="outline" size="lg" className="bg-white/20 border-white/30 text-white hover:bg-white/30">
                <Globe className="h-5 w-5 mr-2" />
                Destinations
              </Button>
            </Link>
            <Link href="/stories">
              <Button variant="outline" size="lg" className="bg-white/20 border-white/30 text-white hover:bg-white/30">
                <Camera className="h-5 w-5 mr-2" />
                Travel Stories
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Featured Destinations</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Handpicked destinations that offer unforgettable experiences and breathtaking beauty.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredDestinations.map((destination) => (
              <Card
                key={destination.id}
                className="group overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105"
              >
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={destination.image || "/placeholder.svg"}
                    alt={destination.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-travel-gold text-black font-semibold">{destination.category}</Badge>
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
                  <h3 className="text-xl font-bold mb-2">{destination.name}</h3>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="ml-1 font-semibold">{destination.rating}</span>
                    </div>
                    <span className="text-muted-foreground">({destination.reviews} reviews)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-travel-blue">{destination.price}</span>
                    <Button size="sm">
                      View Details
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Travel Categories */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Explore by Interest</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Find your perfect travel style and discover destinations that match your interests.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {[
              { name: "Adventure", icon: "🏔️", count: "245 destinations" },
              { name: "Beach", icon: "🏖️", count: "189 destinations" },
              { name: "Culture", icon: "🏛️", count: "312 destinations" },
              { name: "Food", icon: "🍜", count: "156 destinations" },
              { name: "Luxury", icon: "✨", count: "98 destinations" },
              { name: "Budget", icon: "💰", count: "423 destinations" },
            ].map((category) => (
              <Card
                key={category.name}
                className="group cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-3">{category.icon}</div>
                  <h3 className="font-bold mb-1">{category.name}</h3>
                  <p className="text-sm text-muted-foreground">{category.count}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Travel Stories */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-16">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Travel Stories</h2>
              <p className="text-xl text-muted-foreground max-w-2xl">
                Get inspired by real travelers sharing their adventures, tips, and hidden discoveries.
              </p>
            </div>
            <Link href="/stories">
              <Button variant="outline" size="lg">
                View All Stories
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {travelStories.map((story) => (
              <Card key={story.id} className="group overflow-hidden hover:shadow-2xl transition-all duration-300">
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={story.image || "/placeholder.svg"}
                    alt={story.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-black/50 text-white">{story.category}</Badge>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-3 line-clamp-2">{story.title}</h3>
                  <p className="text-muted-foreground mb-4 line-clamp-3">{story.excerpt}</p>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>By {story.author}</span>
                    <span>{story.readTime}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 px-4 bg-travel-blue text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Stay Inspired</h2>
          <p className="text-xl mb-8 text-blue-100">
            Get weekly travel inspiration, exclusive deals, and insider tips delivered to your inbox.
          </p>

          <div className="flex flex-col md:flex-row gap-4 max-w-md mx-auto">
            <Input
              placeholder="Enter your email"
              className="h-12 bg-white/20 border-white/30 text-white placeholder:text-blue-100"
            />
            <Button size="lg" className="h-12 bg-travel-gold text-black hover:bg-travel-gold/90">
              Subscribe
            </Button>
          </div>

          <p className="text-sm text-blue-200 mt-4">
            Join 50,000+ travelers who trust Utrippin for their next adventure.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  )
}
