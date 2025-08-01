// RSS Feed aggregator for Melanin travel content
import axios from 'axios';

interface RSSSource {
  name: string;
  url: string;
  category: string;
  verified: boolean;
}

interface Story {
  id: string;
  title: string;
  excerpt: string;
  image?: string;
  source: string;
  publishedAt: string;
  rawPublishDate?: string;
  link: string;
  category?: string;
  verified?: boolean;
  rssSource?: boolean;
  attribution?: string;
  featured?: boolean;
  freshnessScore?: number;
  relevanceScore?: number;
  isFresh?: boolean;
  contentAge?: "fresh" | "older";
}

const RSS_SOURCES: RSSSource[] = [
  {
    name: "African Americans News",
    url: "https://africanamericans.einnews.com/all_rss",
    category: "news",
    verified: true,
  },
  {
    name: "RSS App Custom Feed", 
    url: "https://rss.app/feeds/v1.1/trxPdUVkAOVly9zJ.json",
    category: "lifestyle",
    verified: true,
  }
];

// Black American cultural keywords for filtering
const BLACK_CULTURE_KEYWORDS = [
  "african american", "black culture", "soul food", "hbcu", "black-owned",
  "black business", "black history", "harlem", "juneteenth", "kwanzaa",
  "negro leagues", "civil rights", "malcolm x", "martin luther king",
  "jazz", "blues", "hip hop", "rap", "r&b", "gospel", "spirituals",
  "black lives matter", "naacp", "moorish", "afrocentric", "diaspora"
];

// Travel-related keywords
const TRAVEL_KEYWORDS = [
  "travel", "destination", "hotel", "restaurant", "tourism", "vacation",
  "trip", "visit", "tour", "experience", "attraction", "landmark",
  "museum", "heritage", "historic", "cultural", "festival", "event"
];

// Keywords to exclude (common false positives)
const EXCLUSION_KEYWORDS = [
  "black friday", "black coffee", "black tea", "black market",
  "black hole", "black swan", "blackout", "black widow"
];

function calculateFreshnessScore(pubDate: string): number {
  const now = new Date();
  const publishDate = new Date(pubDate);
  const diffTime = Math.abs(now.getTime() - publishDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  // 2025 content gets bonus points
  if (publishDate.getFullYear() === 2025) {
    // Current month gets highest score
    if (publishDate.getMonth() === now.getMonth()) return 100;
    // This year but not current month
    return 80;
  }
  
  // 2024 content gets medium score
  if (publishDate.getFullYear() === 2024) return 60;
  
  // Older content gets lower scores
  if (diffDays <= 30) return 40;
  if (diffDays <= 90) return 20;
  return 10;
}

function calculateRelevanceScore(title: string, excerpt: string): number {
  const content = (title + " " + excerpt).toLowerCase();
  let score = 0;
  
  // Check for exclusion keywords first
  for (const keyword of EXCLUSION_KEYWORDS) {
    if (content.includes(keyword)) return 0;
  }
  
  // Score for Black culture keywords
  for (const keyword of BLACK_CULTURE_KEYWORDS) {
    if (content.includes(keyword)) score += 30;
  }
  
  // Score for travel keywords
  for (const keyword of TRAVEL_KEYWORDS) {
    if (content.includes(keyword)) score += 20;
  }
  
  // Bonus for both culture and travel
  const hasCulture = BLACK_CULTURE_KEYWORDS.some(kw => content.includes(kw));
  const hasTravel = TRAVEL_KEYWORDS.some(kw => content.includes(kw));
  if (hasCulture && hasTravel) score += 50;
  
  return Math.min(score, 100);
}

function cleanHTML(text: string): string {
  return text
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/&[a-zA-Z0-9#]+;/g, '') // Remove HTML entities
    .trim();
}

function generatePlaceholderImage(title: string): string {
  const keywords = ["travel", "culture", "heritage", "tourism", "destination"];
  const keyword = keywords[Math.floor(Math.random() * keywords.length)];
  return `https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?auto=format&fit=crop&w=800&q=80&${keyword}`;
}

async function fetchRSSFeed(source: RSSSource): Promise<Story[]> {
  try {
    const response = await axios.get(source.url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Utrippin RSS Reader 1.0'
      }
    });

    let items: any[] = [];
    
    // Handle JSON format (RSS App feeds)
    if (source.url.includes('rss.app') && response.data.items) {
      items = response.data.items;
    }
    // Handle XML format - would need XML parser for production
    else {
      // For now, return empty array for XML feeds
      // In production, you'd parse XML here
      return [];
    }

    const stories: Story[] = [];
    
    for (const item of items.slice(0, 50)) { // Limit to 50 items per source
      const title = item.title || '';
      const excerpt = cleanHTML(item.content_html || item.summary || item.description || '');
      const pubDate = item.date_published || item.pubDate || new Date().toISOString();
      
      // Calculate scores
      const relevanceScore = calculateRelevanceScore(title, excerpt);
      if (relevanceScore < 20) continue; // Skip irrelevant content
      
      const freshnessScore = calculateFreshnessScore(pubDate);
      const publishDate = new Date(pubDate);
      const isFresh = publishDate.getFullYear() === 2025;
      
      const story: Story = {
        id: `rss-${source.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title: title.substring(0, 150),
        excerpt: excerpt.substring(0, 300),
        image: item.image || generatePlaceholderImage(title),
        source: source.name,
        publishedAt: pubDate,
        rawPublishDate: pubDate,
        link: item.url || item.link || '#',
        category: source.category,
        verified: source.verified,
        rssSource: true,
        attribution: source.name,
        featured: false,
        freshnessScore,
        relevanceScore,
        isFresh,
        contentAge: isFresh ? "fresh" : "older"
      };
      
      stories.push(story);
    }
    
    return stories;
  } catch (error) {
    console.error(`Error fetching RSS from ${source.name}:`, error);
    return [];
  }
}

export async function getMelaninStoriesFromRSS() {
  const allStories: Story[] = [];
  
  // Fetch from all RSS sources
  const fetchPromises = RSS_SOURCES.map(source => fetchRSSFeed(source));
  const results = await Promise.allSettled(fetchPromises);
  
  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      allStories.push(...result.value);
    } else {
      console.error(`Failed to fetch from ${RSS_SOURCES[index].name}:`, result.reason);
    }
  });
  
  // Remove duplicates by title similarity
  const uniqueStories = allStories.filter((story, index, arr) => {
    const normalizedTitle = story.title.toLowerCase().replace(/[^\w\s]/g, '');
    return !arr.slice(0, index).some(existing => {
      const existingTitle = existing.title.toLowerCase().replace(/[^\w\s]/g, '');
      return normalizedTitle.includes(existingTitle) || existingTitle.includes(normalizedTitle);
    });
  });
  
  // Split into fresh and older stories
  const freshStories = uniqueStories
    .filter(story => story.isFresh)
    .sort((a, b) => {
      // Featured stories first
      if (a.featured !== b.featured) return a.featured ? -1 : 1;
      // Then by combined score
      const scoreA = (a.freshnessScore || 0) + (a.relevanceScore || 0);
      const scoreB = (b.freshnessScore || 0) + (b.relevanceScore || 0);
      return scoreB - scoreA;
    });
  
  const olderStories = uniqueStories
    .filter(story => !story.isFresh)
    .sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0));
  
  const allSorted = [...freshStories, ...olderStories];
  
  return {
    stories: allSorted,
    freshStories,
    olderStories,
    lastUpdated: new Date().toISOString(),
    sources: [...new Set(allStories.map(s => s.source))],
    totalFound: allStories.length,
    freshCount: freshStories.length,
    olderCount: olderStories.length,
    rss_sources: RSS_SOURCES.length
  };
}