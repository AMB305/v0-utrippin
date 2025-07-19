import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users, Heart, Coffee, Plane, Camera, ExternalLink, Clock, Rss, RefreshCw } from "lucide-react";
import { SEOHead } from "@/components/SEOHead";
import { StoryCard } from "@/components/StoryCard";
import { TrendingSidebar } from "@/components/TrendingSidebar";
import { CategoryStrip } from "@/components/CategoryStrip";
import { EditorialGrid } from "@/components/EditorialGrid";
import { NewsletterSection } from "@/components/NewsletterSection";
import ProductLayout from "@/components/ProductLayout";
import { useFreshStories } from "@/hooks/useFreshStories";
import melaninStories from "@/data/melaninStories.json";

export default function Melanin() {
  const { stories, loading, error, refreshStories } = useFreshStories();
  
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
        <div className="min-h-screen bg-blavity-white">
          {/* Hero Feature Section - Dynamic Featured Story */}
          <section className="bg-white py-12">
            <div className="max-w-7xl mx-auto px-4">
              {!loading && !error && stories.length > 0 ? (
                <div className="relative h-[50vh] md:h-[60vh] bg-gray-100 rounded-3xl overflow-hidden shadow-xl">
                  <img 
                    src={stories[0].image || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800'} 
                    alt={stories[0].title} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 text-white">
                    <Badge className="mb-4 bg-yellow-400 text-black font-bold uppercase text-sm tracking-wide px-4 py-2">
                      Featured Story
                    </Badge>
                    <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
                      {stories[0].title}
                    </h1>
                    <p className="text-lg md:text-xl text-gray-200 mb-6 max-w-3xl">
                      {stories[0].excerpt}
                    </p>
                    <a 
                      href={stories[0].link}
                      target="_blank"
                      rel="noopener noreferrer" 
                      className="inline-block bg-yellow-400 text-black font-bold px-8 py-4 rounded-lg hover:bg-orange-500 hover:text-white transition-colors duration-200 text-lg"
                    >
                      Read via {stories[0].source} →
                    </a>
                  </div>
                </div>
              ) : (
                <div className="relative h-[50vh] md:h-[60vh] bg-gray-100 rounded-3xl overflow-hidden shadow-xl flex items-center justify-center">
                  <div className="text-center">
                    <h1 className="text-3xl md:text-5xl font-bold mb-4 text-gray-800">
                      Black Travel Hub
                    </h1>
                    <p className="text-lg md:text-xl text-gray-600 mb-6">
                      Fresh travel stories and inspiration, updated daily
                    </p>
                    {loading && (
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Dynamic Stories Section - Black Travel News */}
          <section className="bg-white py-16">
            <div className="max-w-7xl mx-auto px-4">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-black mb-2">
                    Black Travel News & Stories 📰
                  </h2>
                  <p className="text-lg text-gray-600">
                    Fresh travel stories and news updated daily
                  </p>
                </div>
                <Button 
                  onClick={refreshStories} 
                  variant="outline" 
                  size="sm"
                  className="flex items-center gap-2"
                  disabled={loading}
                >
                  <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </div>
              
              {loading && (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading fresh stories...</p>
                </div>
              )}
              
              {error && (
                <div className="text-center py-12">
                  <p className="text-red-600 mb-4">{error}</p>
                  <Button onClick={refreshStories} variant="outline">
                    Try Again
                  </Button>
                </div>
              )}
              
              {!loading && !error && (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {stories.slice(0, 6).map((story) => (
                    <StoryCard 
                      key={story.id} 
                      story={story} 
                      size="medium" 
                      backgroundColor="white" 
                    />
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Editorial Grid - Black Background */}
          <EditorialGrid 
            title="Black Travel Stories ✈️" 
            items={melaninStories.editorialStories} 
          />

          {/* More Stories Section - Light Background */}
          <section className="bg-gray-50 py-16">
            <div className="max-w-7xl mx-auto px-4">
              <h2 className="text-3xl md:text-4xl font-bold text-black mb-4 text-center">
                More Black Travel Stories
              </h2>
              <p className="text-lg text-gray-600 mb-12 text-center max-w-3xl mx-auto">
                Discover more inspiring travel stories from the Black community
              </p>
              {!loading && !error && stories.length > 6 && (
                <div className="grid md:grid-cols-3 gap-6">
                  {stories.slice(6, 12).map((story) => (
                    <StoryCard 
                      key={story.id} 
                      story={story} 
                      size="medium" 
                      backgroundColor="white" 
                    />
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Black-Owned Restaurants Category Strip - Black Background */}
          <CategoryStrip 
            title="Black-Owned Restaurants 🍽️" 
            items={melaninStories.blackOwnedRestaurants}
            backgroundColor="black"
          />

          {/* Black-Owned Wineries Category Strip - White Background */}
          <CategoryStrip 
            title="Black-Owned Wineries 🍷" 
            items={melaninStories.blackOwnedWineries}
            backgroundColor="white"
          />

          {/* Featured Travel Tips Section - White Background */}
          <section className="bg-white py-16">
            <div className="max-w-7xl mx-auto px-4">
              <h2 className="text-3xl md:text-4xl font-bold text-black mb-4 text-center">
                Featured Travel Tips & Destinations
              </h2>
              <p className="text-lg text-gray-600 mb-12 text-center max-w-3xl mx-auto">
                Essential travel advice and destination guides for Black travelers
              </p>
              {!loading && !error && stories.length > 12 && (
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {stories.slice(12, 16).map((story) => (
                    <StoryCard 
                      key={story.id} 
                      story={story} 
                      size="small" 
                      backgroundColor="white" 
                    />
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Newsletter Section - Yellow Background */}
          <NewsletterSection />
        </div>
      </ProductLayout>
    </>
  );
}