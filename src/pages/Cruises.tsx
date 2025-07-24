import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroCruiseWidget from "@/components/HeroCruiseWidget";
import { SEOHead } from "@/components/SEOHead";
import { generateBreadcrumbSchema, generateTravelServiceSchema } from "@/utils/structuredData";
import { BackToTop } from '@/components/BackToTop';

export default function Cruises() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const breadcrumbs = generateBreadcrumbSchema([
    { name: "Home", url: "https://utrippin.ai" },
    { name: "Cruises", url: "https://utrippin.ai/cruises" }
  ]);

  const cruiseServiceSchema = generateTravelServiceSchema({
    name: "Cruise Booking Service", 
    description: "Book luxury cruises and ocean voyages with AI-powered search",
    provider: "Utrippin.ai",
    url: "https://utrippin.ai/cruises"
  });

  return (
    <div className="min-h-screen bg-background">
      <SEOHead 
        title="Luxury Cruise Deals & Ocean Voyages | Utrippin.ai"
        description="Discover amazing cruise deals and luxury ocean voyages. Book Caribbean, Mediterranean, Alaska cruises and more. Compare prices from top cruise lines."
        canonical="https://utrippin.ai/cruises"
        keywords="cruise deals, luxury cruises, Caribbean cruises, Mediterranean cruises, cruise booking, ocean voyages"
        structuredData={{
          "@context": "https://schema.org",
          "@graph": [
            breadcrumbs,
            cruiseServiceSchema,
            {
              "@type": "WebPage",
              "@id": "https://utrippin.ai/cruises#webpage",
              "url": "https://utrippin.ai/cruises",
              "name": "Luxury Cruise Deals & Ocean Voyages | Utrippin.ai",
              "description": "Discover amazing cruise deals and luxury ocean voyages. Book Caribbean, Mediterranean, Alaska cruises and more. Compare prices from top cruise lines.",
              "inLanguage": "en-US"
            }
          ]
        }}
      />
      <Header />
      
      {/* Hero Section with Cruise Widget */}
      <HeroCruiseWidget />
      
      {/* Clean white background for content below */}
      <div className="bg-white min-h-screen">
        {/* Main Content Container */}
        <div className="container mx-auto px-6 py-8">
          {/* Popular Cruise Routes Section */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Popular cruise destinations</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { 
                  name: 'Caribbean', 
                  description: 'Tropical islands & beaches',
                  image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
                  price: 'from $299/person',
                  duration: '7 nights'
                },
                { 
                  name: 'Mediterranean', 
                  description: 'Historic ports & culture',
                  image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&h=300&fit=crop',
                  price: 'from $699/person',
                  duration: '10 nights'
                },
                { 
                  name: 'Alaska', 
                  description: 'Glaciers & wildlife',
                  image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
                  price: 'from $899/person',
                  duration: '7 nights'
                },
                { 
                  name: 'Northern Europe', 
                  description: 'Fjords & capitals',
                  image: 'https://images.unsplash.com/photo-1503570625739-6c34eb93a1bc?w=400&h=300&fit=crop',
                  price: 'from $1,199/person',
                  duration: '12 nights'
                },
                { 
                  name: 'Asia', 
                  description: 'Culture & temples',
                  image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=300&fit=crop',
                  price: 'from $799/person',
                  duration: '9 nights'
                },
                { 
                  name: 'South America', 
                  description: 'Amazon & coasts',
                  image: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=400&h=300&fit=crop',
                  price: 'from $1,099/person',
                  duration: '14 nights'
                },
                { 
                  name: 'Transatlantic', 
                  description: 'Ocean crossing',
                  image: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=400&h=300&fit=crop',
                  price: 'from $599/person',
                  duration: '8 nights'
                },
                { 
                  name: 'Hawaii', 
                  description: 'Island hopping',
                  image: 'https://images.unsplash.com/photo-1542259009477-d625272157b7?w=400&h=300&fit=crop',
                  price: 'from $999/person',
                  duration: '10 nights'
                }
              ].map((destination, index) => (
                <div key={index} className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer">
                  <img 
                    src={destination.image} 
                    alt={`${destination.name} cruise destination`}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 text-lg">{destination.name}</h3>
                    <p className="text-gray-500 text-sm">{destination.description}</p>
                    <p className="text-teal-600 text-sm font-medium">{destination.duration}</p>
                    <p className="text-blue-600 font-medium mt-2">{destination.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
      <BackToTop />
    </div>
  );
}