import React from "react";
import { Navigation } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";
import { VecteezyImage } from "@/components/VecteezyImage";

const destinations = [
  {
    name: "Times Square",
    location: "NYC, USA",
    funFact: "Hosts 1M people on New Year's Eve 🎉",
    searchQuery: "Times Square NYC bright lights billboard urban cityscape",
    featured: true,
    earthLink: "https://earth.google.com/web/search/Times+Square,+Manhattan,+NY,+USA/",
  },
  {
    name: "Grand Canyon",
    location: "South Rim, AZ",
    funFact: "277 miles long & 6 million visitors yearly 🏞️",
    searchQuery: "Grand Canyon Arizona red rock formations natural wonder landscape",
    featured: true,
    earthLink: "https://earth.google.com/web/search/Grand+Canyon,+Arizona,+USA/",
  },
  {
    name: "Golden Gate Bridge",
    location: "San Francisco, CA",
    funFact: "Painted 'International Orange' for fog visibility 🌁",
    searchQuery: "Golden Gate Bridge San Francisco orange suspension bridge fog",
    featured: true,
    earthLink: "https://earth.google.com/web/search/Golden+Gate+Bridge,+San+Francisco,+CA/",
  },
  {
    name: "Las Vegas Strip",
    location: "Las Vegas, NV",
    funFact: "15 of world's 25 largest hotels 🎰",
    searchQuery: "Las Vegas Strip neon lights casinos nightlife entertainment",
    featured: false,
    earthLink: "https://earth.google.com/web/search/Las+Vegas+Strip,+NV/",
  },
  {
    name: "Miami Beach",
    location: "South Beach, FL",
    funFact: "Famous Art Deco architecture & nightlife 🎨🌴",
    searchQuery: "Miami Beach art deco architecture ocean palm trees tropical",
    featured: false,
    earthLink: "https://earth.google.com/web/search/Miami+Beach,+FL/",
  },
  {
    name: "Yellowstone",
    location: "WY, USA",
    funFact: "World's 1st national park 🌋",
    searchQuery: "Yellowstone National Park geysers wildlife bison nature",
    featured: false,
    earthLink: "https://earth.google.com/web/search/Yellowstone+National+Park/",
  },
];

export default function VirtualTour() {

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEOHead 
        title="Virtual Travel Tours - Explore the World from Home | Utrippin.ai"
        description="Take virtual tours of famous destinations around the world. Explore iconic landmarks, cities, and natural wonders through immersive 3D experiences."
        keywords="virtual tours, travel from home, 3D destinations, virtual travel, explore world"
        ogImage="/social-card.jpg"
      />
      
      <Header />
      
      <main className="flex-1">
        <div className="relative bg-gradient-to-br from-primary via-primary-dark to-secondary text-foreground py-16 min-h-screen">
          {/* Faint globe background */}
          <div 
            className="absolute inset-0 bg-center bg-no-repeat opacity-5 pointer-events-none"
            style={{
              backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 100\'%3E%3Ccircle cx=\'50\' cy=\'50\' r=\'40\' fill=\'none\' stroke=\'white\' stroke-width=\'0.5\'/%3E%3Cpath d=\'M10 50h80M50 10v80\' stroke=\'white\' stroke-width=\'0.3\'/%3E%3Cpath d=\'M50 10c-22 0-40 18-40 40s18 40 40 40\' fill=\'none\' stroke=\'white\' stroke-width=\'0.3\'/%3E%3Cpath d=\'M50 10c22 0 40 18 40 40s-18 40-40 40\' fill=\'none\' stroke=\'white\' stroke-width=\'0.3\'/%3E%3C/svg%3E")',
              backgroundSize: '400px 400px'
            }}
          />
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Hero Section */}
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                🌎 Virtual Tours Around the World
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Explore famous landmarks, natural wonders, and iconic destinations through immersive virtual experiences
              </p>
            </div>

            {/* Destinations Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {destinations.map((dest, idx) => (
                <div 
                  key={idx} 
                  className="bg-card rounded-xl shadow-lg overflow-hidden hover:shadow-primary/20 hover:scale-105 transition-all duration-300 group"
                >
                  <div className="relative overflow-hidden">
                    <VecteezyImage
                      destination={dest.name}
                      description={dest.searchQuery}
                      tags={[dest.location, "landmark", "travel", "destination"]}
                      className="h-48 w-full group-hover:scale-110 transition-transform duration-500"
                      alt={`Virtual tour of ${dest.name}`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    {dest.featured && (
                      <div className="absolute top-3 right-3">
                        <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full font-semibold">
                          Featured
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h2 className="text-xl font-bold mb-1 text-card-foreground">{dest.name}</h2>
                    <p className="text-sm text-muted-foreground mb-2">{dest.location}</p>
                    <p className="text-sm italic mb-4 text-muted-foreground min-h-[40px]">{dest.funFact}</p>
                    <a
                      href={dest.earthLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 px-4 rounded-lg transition-colors w-full justify-center group-hover:shadow-lg"
                    >
                      <Navigation className="w-4 h-4" />
                      🚀 View in 3D
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* Call to Action */}
            <div className="text-center mt-16">
              <p className="text-muted-foreground mb-6">
                Ready to plan your real adventure? Start with AI-powered travel planning.
              </p>
              <a
                href="/ai-travel"
                className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Plan Your Trip with AI
              </a>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
