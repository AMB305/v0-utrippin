"use client"

import { useState, useEffect } from "react"

interface Story {
  id: string
  title: string
  excerpt: string
  image?: string
  source: string
  publishedAt: string
  rawPublishDate?: string
  link: string
  category?: string
  verified?: boolean
  rssSource?: boolean
  attribution?: string
  featured?: boolean
  freshnessScore?: number
  relevanceScore?: number
  isFresh?: boolean
  contentAge?: "fresh" | "older"
}

interface StoriesResponse {
  stories: Story[]
  freshStories: Story[]
  olderStories: Story[]
  lastUpdated: string
  sources: string[]
  totalFound: number
  freshCount: number
  olderCount: number
  rss_sources: number
}

// Mock data for demonstration
const MOCK_STORIES: Story[] = [
  {
    id: "fresh-1",
    title: "New 'Safe Travels' App Launches for Black Travelers Worldwide",
    excerpt:
      "A comprehensive safety app providing real-time information, community reviews, and emergency contacts specifically designed for Black travelers.",
    image: "/images/vecteezy/travel-default.jpg",
    source: "Utrippin Editorial",
    publishedAt: "2 hours ago",
    rawPublishDate: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    link: "/melanin/stories/black-travel-safety-app-2025",
    category: "technology",
    verified: true,
    rssSource: false,
    attribution: "Original Utrippin content",
    relevanceScore: 95,
    freshnessScore: 98,
    isFresh: true,
    contentAge: "fresh",
  },
  {
    id: "fresh-2",
    title: "Black-Owned Airline Announces New Caribbean Routes",
    excerpt:
      "A minority-owned airline is expanding service to popular Caribbean destinations, offering competitive rates and cultural experiences.",
    image: "/images/vecteezy/caribbean-beach-paradise.jpg",
    source: "Travel News Network",
    publishedAt: "5 hours ago",
    rawPublishDate: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    link: "/melanin/stories/black-owned-airline-caribbean-routes",
    category: "business",
    verified: true,
    rssSource: true,
    attribution: "Content via RSS feed",
    relevanceScore: 88,
    freshnessScore: 95,
    isFresh: true,
    contentAge: "fresh",
  },
  {
    id: "fresh-3",
    title: "Three Black-Owned Soul Food Restaurants Earn First Michelin Stars",
    excerpt:
      "Historic achievement as traditional soul food establishments in Atlanta, New Orleans, and Chicago receive prestigious Michelin recognition.",
    image: "/images/vecteezy/food-drink-rome.jpg",
    source: "Culinary Heritage",
    publishedAt: "1 day ago",
    rawPublishDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    link: "/melanin/stories/soul-food-michelin-stars-2025",
    category: "food",
    verified: true,
    rssSource: true,
    attribution: "Content via RSS feed",
    relevanceScore: 92,
    freshnessScore: 85,
    isFresh: true,
    contentAge: "fresh",
  },
  {
    id: "archive-1",
    title: "Heritage Tourism Boom: Ghana and Senegal See Record Visitors",
    excerpt:
      "African countries are experiencing unprecedented interest from Black American travelers seeking to connect with their roots.",
    image: "/images/vecteezy/destination-default.jpg",
    source: "Heritage Travel Weekly",
    publishedAt: "2 weeks ago",
    rawPublishDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    link: "/melanin/stories/heritage-tourism-boom-2025",
    category: "heritage",
    verified: true,
    rssSource: true,
    attribution: "Content via RSS feed",
    relevanceScore: 85,
    freshnessScore: 40,
    isFresh: false,
    contentAge: "older",
  },
  {
    id: "archive-2",
    title: "The Great Migration Routes: A Modern Pilgrimage",
    excerpt:
      "Following the historical paths of the Great Migration, modern travelers are discovering stories of resilience and hope.",
    image: "/images/vecteezy/arts-culture-kyoto.jpg",
    source: "Historical Journeys",
    publishedAt: "3 weeks ago",
    rawPublishDate: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
    link: "/melanin/stories/great-migration-routes",
    category: "history",
    verified: true,
    rssSource: false,
    attribution: "Community contribution",
    relevanceScore: 78,
    freshnessScore: 25,
    isFresh: false,
    contentAge: "older",
  },
]

export function useFreshStories() {
  const [stories, setStories] = useState<Story[]>([])
  const [freshStories, setFreshStories] = useState<Story[]>([])
  const [olderStories, setOlderStories] = useState<Story[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)
  const [sources, setSources] = useState<string[]>([])
  const [totalFound, setTotalFound] = useState<number>(0)
  const [freshCount, setFreshCount] = useState<number>(0)
  const [olderCount, setOlderCount] = useState<number>(0)
  const [rss_sources, setRssources] = useState<number>(0)

  const fetchStories = async () => {
    try {
      setLoading(true)
      setError(null)

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const allStories = MOCK_STORIES
      const fresh = allStories.filter((story) => story.isFresh)
      const older = allStories.filter((story) => !story.isFresh)
      const uniqueSources = [...new Set(allStories.map((s) => s.source))]

      setStories(allStories)
      setFreshStories(fresh)
      setOlderStories(older)
      setLastUpdated(new Date().toISOString())
      setSources(uniqueSources)
      setTotalFound(allStories.length)
      setFreshCount(fresh.length)
      setOlderCount(older.length)
      setRssources(2)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      console.error("Error fetching stories:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStories()

    // Auto-refresh every 15 minutes for fresh content
    const interval = setInterval(fetchStories, 15 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const refreshStories = () => {
    fetchStories()
  }

  return {
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
  }
}
