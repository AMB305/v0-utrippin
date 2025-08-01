import React, { useState, useEffect } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ExternalLink, Clock, User, Star, CheckCircle } from 'lucide-react'
import { StoryVerificationBadge } from '@/components/StoryVerificationBadge'
import { RelevanceScoreBadge } from '@/components/RelevanceScoreBadge'

// Your own curated content sources - legal and ethical
const UTRIPPIN_CONTENT_SOURCES = [
  {
    name: "Utrippin Community",
    category: "user-generated",
    description: "Stories from your own users",
  },
  {
    name: "Utrippin Editorial",
    category: "original-content",
    description: "Your own editorial content",
  },
  {
    name: "Partner Publications",
    category: "partnerships",
    description: "Content from official partnerships",
  },
]

// Legitimate RSS feeds for Black travel and lifestyle content
const RSS_SOURCES = [
  {
    name: "African Americans News",
    url: "https://africanamericans.einnews.com/all_rss",
    category: "news",
    verified: true,
    description: "African American news and updates",
    type: "xml",
  },
  {
    name: "RSS App Custom Feed",
    url: "https://rss.app/feeds/v1.1/trxPdUVkAOVly9zJ.json",
    category: "lifestyle",
    verified: true,
    description: "Curated Black lifestyle content",
    type: "json",
  },
]

// Add some editorial content to supplement RSS feeds with current dates
async function getEditorialContent(): Promise<any[]> {
  const currentDate = new Date().toISOString()
  const yesterdayDate = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()

  return [
    {
      id: "utrippin-editorial-featured-2025",
      title: "2025 Black Travel Trends: Where Melanin Travelers Are Heading This Year",
      excerpt:
        "Discover the hottest destinations and travel trends for Black Americans in 2025, from luxury heritage tours to sustainable travel experiences.",
      image: "/placeholder.svg?height=400&width=600&text=2025+Black+Travel+Trends",
      source: "Utrippin Editorial",
      publishedAt: "2 hours ago",
      rawPublishDate: currentDate,
      link: "/melanin/stories/2025-black-travel-trends",
      category: "editorial",
      verified: true,
      featured: true,
      attribution: "Original Utrippin content",
      relevanceScore: 50,
      freshnessScore: 100,
      isFresh: true,
      contentAge: "fresh",
    },
    {
      id: "utrippin-community-spotlight-2025",
      title: "January 2025: New Black-Owned Hotels Opening This Month",
      excerpt:
        "Meet the Black American entrepreneurs launching luxury hotels and boutique accommodations across the US and Caribbean this month.",
      image: "/placeholder.svg?height=400&width=600&text=New+Black+Owned+Hotels+2025",
      source: "Utrippin Community",
      publishedAt: "1 day ago",
      rawPublishDate: yesterdayDate,
      link: "/melanin/stories/new-black-owned-hotels-january-2025",
      category: "business",
      verified: true,
      attribution: "Utrippin community feature",
      relevanceScore: 45,
      freshnessScore: 95,
      isFresh: true,
      contentAge: "fresh",
    },
    {
      id: "heritage-tourism-boom-2025",
      title: "Heritage Tourism Boom: Ghana and Senegal See Record Visitors",
      excerpt:
        "African countries are experiencing unprecedented interest from Black American travelers seeking to connect with their roots.",
      image: "/placeholder.svg?height=400&width=600&text=Heritage+Tourism+Africa",
      source: "Utrippin Editorial",
      publishedAt: "3 days ago",
      rawPublishDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      link: "/melanin/stories/heritage-tourism-boom-2025",
      category: "heritage",
      verified: true,
      attribution: "Original Utrippin content",
      relevanceScore: 48,
      freshnessScore: 90,
      isFresh: true,
      contentAge: "fresh",
    },
  ]
}

// Mock function with FIXED internal routes instead of example.com
async function fetchFromRSSSourcesMock(): Promise<any[]> {
  return [
    {
      id: "rss-black-travel-safety-2025",
      title: "New 'Safe Travels' App Launches for Black Travelers Worldwide",
      excerpt:
        "A comprehensive safety app providing real-time information, community reviews, and emergency contacts specifically designed for Black travelers.",
      image: "/placeholder.svg?height=400&width=600&text=Travel+Safety+App",
      source: "African Americans News",
      publishedAt: "5 hours ago",
      rawPublishDate: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      link: "/melanin/stories/black-travel-safety-app-2025",
      category: "technology",
      verified: true,
      rssSource: true,
      attribution: "Content via African Americans News RSS feed",
      relevanceScore: 35,
      freshnessScore: 98,
      isFresh: true,
      contentAge: "fresh",
    },
    {
      id: "rss-black-owned-airline-2025",
      title: "Black-Owned Airline Announces New Caribbean Routes",
      excerpt:
        "A minority-owned airline is expanding service to popular Caribbean destinations, offering competitive rates and cultural experiences.",
      image: "/placeholder.svg?height=400&width=600&text=Black+Owned+Airline",
      source: "RSS App Custom Feed",
      publishedAt: "1 day ago",
      rawPublishDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      link: "/melanin/stories/black-owned-airline-caribbean-routes",
      category: "business",
      verified: true,
      rssSource: true,
      attribution: "Content via RSS App Custom Feed",
      relevanceScore: 42,
      freshnessScore: 95,
      isFresh: true,
      contentAge: "fresh",
    },
    {
      id: "rss-soul-food-michelin-2025",
      title: "Three Black-Owned Soul Food Restaurants Earn First Michelin Stars",
      excerpt:
        "Historic achievement as traditional soul food establishments in Atlanta, New Orleans, and Chicago receive prestigious Michelin recognition.",
      image: "/placeholder.svg?height=400&width=600&text=Soul+Food+Michelin+Stars",
      source: "African Americans News",
      publishedAt: "2 days ago",
      rawPublishDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      link: "/melanin/stories/soul-food-michelin-stars-2025",
      category: "food",
      verified: true,
      rssSource: true,
      attribution: "Content via African Americans News RSS feed",
      relevanceScore: 40,
      freshnessScore: 92,
      isFresh: true,
      contentAge: "fresh",
    },
  ]
}

export default function Melanin() {
  const [stories, setStories] = useState<any[]>([])
  const [freshStories, setFreshStories] = useState<any[]>([])
  const [olderStories, setOlderStories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStories() {
      try {
        console.log("Starting to fetch current Black American travel content for 2025...")

        // Fetch from RSS sources and add editorial content
        const [rssStories, editorialStories] = await Promise.all([fetchFromRSSSourcesMock(), getEditorialContent()])

        // Combine all stories
        const allStories = [...editorialStories, ...rssStories]

        // Remove duplicates
        const uniqueStories = allStories.filter(
          (story, index, self) =>
            index === self.findIndex((s) => s.title.toLowerCase().trim() === story.title.toLowerCase().trim()),
        )

        // Separate fresh vs older content
        const freshStoriesData = uniqueStories.filter((story) => story.isFresh)
        const olderStoriesData = uniqueStories.filter((story) => !story.isFresh)

        // Sort fresh stories by freshness score + relevance
        const sortedFreshStories = freshStoriesData.sort((a, b) => {
          // Featured content first
          if (a.featured && !b.featured) return -1
          if (!a.featured && b.featured) return 1

          // Then by combined freshness + relevance score
          const aScore = (a.freshnessScore || 0) + (a.relevanceScore || 0)
          const bScore = (b.freshnessScore || 0) + (b.relevanceScore || 0)

          if (aScore !== bScore) {
            return bScore - aScore
          }

          // Finally by source priority
          if (a.source === "Utrippin Editorial" && b.source !== "Utrippin Editorial") return -1
          if (b.source === "Utrippin Editorial" && a.source !== "Utrippin Editorial") return 1

          return 0
        })

        // Sort older stories by relevance only
        const sortedOlderStories = olderStoriesData.sort((a, b) => {
          if (a.relevanceScore && b.relevanceScore) {
            return b.relevanceScore - a.relevanceScore
          }
          return 0
        })

        // Combine with fresh stories first
        const finalStories = [...sortedFreshStories, ...sortedOlderStories]

        console.log(`Successfully aggregated ${freshStoriesData.length} fresh stories and ${olderStoriesData.length} older stories`)

        setStories(finalStories.slice(0, 30))
        setFreshStories(sortedFreshStories.slice(0, 15))
        setOlderStories(sortedOlderStories.slice(0, 15))
      } catch (error) {
        console.error("Error fetching melanin stories:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStories()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading Black Travel Stories...</div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary/10 to-secondary/10 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-4">
              Melanin Compass
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Discover authentic Black travel stories, experiences, and destinations from verified sources
            </p>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              {freshStories.length} Fresh Stories Available
            </Badge>
          </div>
        </div>
      </section>

      {/* Stories Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {stories.map((story) => (
              <Card key={story.id} className="hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img
                    src={story.image}
                    alt={story.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <div className="absolute top-2 left-2 flex gap-2">
                    <StoryVerificationBadge verified={story.verified} />
                    <RelevanceScoreBadge score={story.relevanceScore} />
                  </div>
                </div>
                
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">{story.category}</Badge>
                    {story.featured && <Badge variant="default">Featured</Badge>}
                  </div>
                  <CardTitle className="line-clamp-2">{story.title}</CardTitle>
                  <CardDescription className="line-clamp-3">{story.excerpt}</CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>{story.source}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{story.publishedAt}</span>
                    </div>
                  </div>
                  
                  <Button asChild className="w-full">
                    <a href={story.link} target="_blank" rel="noopener noreferrer">
                      Read Story
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </a>
                  </Button>
                  
                  {story.attribution && (
                    <p className="text-xs text-muted-foreground mt-2 text-center">
                      {story.attribution}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}