import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroCarWidget from "@/components/HeroCarWidget";
import { SEOHead } from "@/components/SEOHead";
import { generateBreadcrumbSchema, generateTravelServiceSchema } from "@/utils/structuredData";
import { BackToTop } from '@/components/BackToTop';

export default function Cars() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const breadcrumbs = generateBreadcrumbSchema([
    { name: "Home", url: "https://utrippin.ai" },
    { name: "Cars", url: "https://utrippin.ai/cars" }
  ]);

  const carServiceSchema = generateTravelServiceSchema({
    name: "Car Rental Service",
    description: "Rent cars easily with AI-powered search and comparison",
    provider: "Utrippin.ai",
    url: "https://utrippin.ai/cars"
  });

  return (
    <div className="min-h-screen bg-background">
      <SEOHead 
        title="Cheap Car Rentals & Airport Cars | Utrippin.ai"
        description="Rent cars easily. Find deals on economy, luxury, SUV and electric car rentals worldwide. Compare prices from top rental companies."
        canonical="https://utrippin.ai/cars"
        keywords="car rental, cheap car rentals, airport car rental, luxury car rental, economy car rental"
        structuredData={{
          "@context": "https://schema.org",
          "@graph": [
            breadcrumbs,
            carServiceSchema,
            {
              "@type": "WebPage",
              "@id": "https://utrippin.ai/cars#webpage",
              "url": "https://utrippin.ai/cars",
              "name": "Cheap Car Rentals & Airport Cars | Utrippin.ai",
              "description": "Rent cars easily. Find deals on economy, luxury, SUV and electric car rentals worldwide. Compare prices from top rental companies.",
              "inLanguage": "en-US"
            }
          ]
        }}
      />
      <Header />
      
      {/* Hero Section with Car Widget */}
      <HeroCarWidget />
      
      {/* Clean white background for content below */}
      <div className="bg-white min-h-screen">
        {/* Main Content Container */}
        <div className="container mx-auto px-6 py-8">
          {/* Popular Car Rental Locations Section */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Popular car rental locations</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { 
                  city: "Los Angeles", 
                  airport: "LAX",
                  image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80",
                  cars: "500+ cars", 
                  price: "from $25/day"
                },
                { 
                  city: "New York", 
                  airport: "JFK",
                  image: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=800&q=80",
                  cars: "400+ cars", 
                  price: "from $35/day"
                },
                { 
                  city: "Miami", 
                  airport: "MIA",
                  image: "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?auto=format&fit=crop&w=800&q=80",
                  cars: "350+ cars", 
                  price: "from $30/day"
                },
                { 
                  city: "Las Vegas", 
                  airport: "LAS",
                  image: "https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=800&q=80",
                  cars: "300+ cars", 
                  price: "from $22/day"
                },
                { 
                  city: "Orlando", 
                  airport: "MCO",
                  image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80",
                  cars: "450+ cars", 
                  price: "from $28/day"
                },
                { 
                  city: "San Francisco", 
                  airport: "SFO",
                  image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80",
                  cars: "380+ cars", 
                  price: "from $40/day"
                },
                { 
                  city: "Chicago", 
                  airport: "ORD",
                  image: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=800&q=80",
                  cars: "320+ cars", 
                  price: "from $32/day"
                },
                { 
                  city: "Seattle", 
                  airport: "SEA",
                  image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80",
                  cars: "280+ cars", 
                  price: "from $38/day"
                }
              ].map((destination, index) => (
                <div key={index} className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer">
                  <img 
                    src={destination.image} 
                    alt={`${destination.city} car rental location`}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 text-lg">{destination.city}</h3>
                    <p className="text-gray-500 text-sm">{destination.airport}</p>
                    <p className="text-gray-600 text-sm">{destination.cars}</p>
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