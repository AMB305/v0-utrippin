import React, { useState, useEffect } from "react";
import { Sparkles, TrendingUp, Heart } from "lucide-react";
import { DestinationCard } from "./DestinationCard";
import destinationsData from "@/data/destinations.json";

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

interface PersonalizedRecommendationsProps {
  onDestinationClick: (destination: Destination) => void;
}

export const PersonalizedRecommendations = ({ onDestinationClick }: PersonalizedRecommendationsProps) => {
  const [recommendations, setRecommendations] = useState<{
    trending: Destination[];
    forYou: Destination[];
    favorites: Destination[];
  }>({
    trending: [],
    forYou: [],
    favorites: []
  });

  useEffect(() => {
    const generateRecommendations = () => {
      // Get user's favorites and ratings for personalization
      const favorites = JSON.parse(localStorage.getItem('favoriteDestinations') || '[]');
      const ratings = JSON.parse(localStorage.getItem('destinationRatings') || '{}');
      const viewHistory = JSON.parse(localStorage.getItem('destinationViews') || '[]');
      
      // Trending destinations (simulate trending data)
      const trending = [...destinationsData]
        .sort(() => 0.5 - Math.random())
        .slice(0, 4);
      
      // Personalized "For You" recommendations based on user behavior
      const userPreferences = [];
      
      // Analyze favorite destinations for common tags
      const preferredTags = new Set<string>();
      favorites.forEach((favName: string) => {
        const dest = destinationsData.find(d => d.name === favName);
        if (dest) {
          dest.tags.forEach(tag => preferredTags.add(tag));
        }
      });
      
      // Find destinations with similar tags
      const forYou = destinationsData
        .filter(dest => !favorites.includes(dest.name))
        .filter(dest => dest.tags.some(tag => preferredTags.has(tag)))
        .sort(() => 0.5 - Math.random())
        .slice(0, 4);
      
      // If no personalization data, show random popular destinations
      const forYouFinal = forYou.length > 0 ? forYou : [...destinationsData]
        .sort(() => 0.5 - Math.random())
        .slice(0, 4);
      
      // Get favorite destinations
      const favoriteDestinations = destinationsData
        .filter(dest => favorites.includes(dest.name))
        .slice(0, 4);
      
      setRecommendations({
        trending,
        forYou: forYouFinal,
        favorites: favoriteDestinations
      });
    };

    generateRecommendations();
  }, []);

  const sections = [
    {
      title: "Trending Now",
      icon: <TrendingUp className="w-5 h-5 text-red-400" />,
      destinations: recommendations.trending,
      description: "Popular destinations everyone's talking about"
    },
    {
      title: "Recommended for You",
      icon: <Sparkles className="w-5 h-5 text-purple-400" />,
      destinations: recommendations.forYou,
      description: "Personalized picks based on your interests"
    }
  ];

  // Add favorites section only if user has favorites
  if (recommendations.favorites.length > 0) {
    sections.push({
      title: "Your Favorites",
      icon: <Heart className="w-5 h-5 text-pink-400" />,
      destinations: recommendations.favorites,
      description: "Destinations you've saved to your wishlist"
    });
  }

  return (
    <div className="space-y-12">
      {sections.map((section) => (
        <div key={section.title} className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-2 flex items-center justify-center gap-3">
              {section.icon}
              {section.title}
            </h2>
            <p className="text-slate-400">{section.description}</p>
          </div>
          
          {section.destinations.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {section.destinations.map((dest, idx) => (
                <div
                  key={idx}
                  className="animate-fade-in"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <DestinationCard 
                    destination={dest}
                    onClick={onDestinationClick}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-400">
              <p>Start exploring destinations to see personalized recommendations!</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
