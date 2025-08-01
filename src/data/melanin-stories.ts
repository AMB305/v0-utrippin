// Story interface
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

// Mock RSS stories data for React/Vite
const MOCK_RSS_STORIES: Story[] = [
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
  {
    id: "rss-heritage-tourism-boom-2025",
    title: "Heritage Tourism Boom: Ghana and Senegal See Record Visitors",
    excerpt:
      "African countries are experiencing unprecedented interest from Black American travelers seeking to connect with their roots.",
    image: "/placeholder.svg?height=400&width=600&text=Heritage+Tourism+Africa",
    source: "RSS App Custom Feed",
    publishedAt: "3 days ago",
    rawPublishDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    link: "/melanin/stories/heritage-tourism-boom-2025",
    category: "heritage",
    verified: true,
    rssSource: true,
    attribution: "Content via RSS App Custom Feed",
    relevanceScore: 48,
    freshnessScore: 90,
    isFresh: true,
    contentAge: "fresh",
  },
]

const EDITORIAL_STORIES: Story[] = [
  {
    id: "utrippin-editorial-featured-2025",
    title: "2025 Black Travel Trends: Where Melanin Travelers Are Heading This Year",
    excerpt:
      "Discover the hottest destinations and travel trends for Black Americans in 2025, from luxury heritage tours to sustainable travel experiences.",
    image: "/placeholder.svg?height=400&width=600&text=2025+Black+Travel+Trends",
    source: "Utrippin Editorial",
    publishedAt: "2 hours ago",
    rawPublishDate: new Date().toISOString(),
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
    rawPublishDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    link: "/melanin/stories/new-black-owned-hotels-january-2025",
    category: "business",
    verified: true,
    attribution: "Utrippin community feature",
    relevanceScore: 45,
    freshnessScore: 95,
    isFresh: true,
    contentAge: "fresh",
  },
]

export const getMelaninStories = (): StoriesResponse => {
  const allStories = [...EDITORIAL_STORIES, ...MOCK_RSS_STORIES]

  const freshStories = allStories.filter((story) => story.isFresh)
  const olderStories = allStories.filter((story) => !story.isFresh)

  const sortedFreshStories = freshStories.sort((a, b) => {
    if (a.featured && !b.featured) return -1
    if (!a.featured && b.featured) return 1

    const aScore = (a.freshnessScore || 0) + (a.relevanceScore || 0)
    const bScore = (b.freshnessScore || 0) + (b.relevanceScore || 0)

    return bScore - aScore
  })

  return {
    stories: allStories,
    freshStories: sortedFreshStories,
    olderStories,
    lastUpdated: new Date().toISOString(),
    sources: ["Utrippin Editorial", "African Americans News", "RSS App Custom Feed"],
    totalFound: allStories.length,
    freshCount: freshStories.length,
    olderCount: olderStories.length,
    rss_sources: 2,
  }
}