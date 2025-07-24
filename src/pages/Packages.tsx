import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroPackageWidget from "@/components/HeroPackageWidget";
import { SEOHead } from "@/components/SEOHead";
import { generateBreadcrumbSchema, generateTravelServiceSchema } from "@/utils/structuredData";
import { BackToTop } from '@/components/BackToTop';

export default function Packages() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const breadcrumbs = generateBreadcrumbSchema([
    { name: "Home", url: "https://utrippin.ai" },
    { name: "Packages", url: "https://utrippin.ai/packages" }
  ]);

  const packageServiceSchema = generateTravelServiceSchema({
    name: "Travel Package Service",
    description: "Book vacation packages with flights, hotels, and more",
    provider: "Utrippin.ai",
    url: "https://utrippin.ai/packages"
  });

  return (
    <div className="min-h-screen bg-background">
      <SEOHead 
        title="Vacation Packages & Travel Deals | Utrippin.ai"
        description="Book amazing vacation packages with flights, hotels, and more. Find the best travel deals and save on your next getaway."
        canonical="https://utrippin.ai/packages"
        keywords="vacation packages, travel packages, flight hotel packages, all inclusive packages, travel deals"
        structuredData={{
          "@context": "https://schema.org",
          "@graph": [
            breadcrumbs,
            packageServiceSchema,
            {
              "@type": "WebPage",
              "@id": "https://utrippin.ai/packages#webpage",
              "url": "https://utrippin.ai/packages",
              "name": "Vacation Packages & Travel Deals | Utrippin.ai",
              "description": "Book amazing vacation packages with flights, hotels, and more. Find the best travel deals and save on your next getaway.",
              "inLanguage": "en-US"
            }
          ]
        }}
      />
      <Header />
      
      {/* Hero Section with Package Widget */}
      <HeroPackageWidget />
      
      {/* Clean white background for content below */}
      <div className="bg-white min-h-screen">
        {/* Main Content Container */}
        <div className="container mx-auto px-6 py-8">
          {/* Popular Package Destinations Section */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Popular vacation packages</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { 
                  name: 'Cancun', 
                  country: 'Mexico',
                  image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
                  price: 'from $599',
                  type: 'All Inclusive'
                },
                { 
                  name: 'Bali', 
                  country: 'Indonesia',
                  image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&h=300&fit=crop',
                  price: 'from $799',
                  type: 'Flight + Hotel'
                },
                { 
                  name: 'Hawaii', 
                  country: 'United States',
                  image: 'https://images.unsplash.com/photo-1542259009477-d625272157b7?w=400&h=300&fit=crop',
                  price: 'from $899',
                  type: 'Resort Package'
                },
                { 
                  name: 'Santorini', 
                  country: 'Greece',
                  image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&h=300&fit=crop',
                  price: 'from $1,099',
                  type: 'Luxury Package'
                },
                { 
                  name: 'Maldives', 
                  country: 'Maldives',
                  image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
                  price: 'from $1,499',
                  type: 'Overwater Villa'
                },
                { 
                  name: 'Costa Rica', 
                  country: 'Costa Rica',
                  image: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=400&h=300&fit=crop',
                  price: 'from $699',
                  type: 'Adventure Package'
                },
                { 
                  name: 'Iceland', 
                  country: 'Iceland',
                  image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
                  price: 'from $999',
                  type: 'Northern Lights'
                },
                { 
                  name: 'Tahiti', 
                  country: 'French Polynesia',
                  image: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=400&h=300&fit=crop',
                  price: 'from $1,299',
                  type: 'Romantic Package'
                }
              ].map((destination, index) => (
                <div key={index} className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer">
                  <img 
                    src={destination.image} 
                    alt={`${destination.name} vacation package`}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 text-lg">{destination.name}</h3>
                    <p className="text-gray-500 text-sm">{destination.country}</p>
                    <p className="text-teal-600 text-sm font-medium">{destination.type}</p>
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