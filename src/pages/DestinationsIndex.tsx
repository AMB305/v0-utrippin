import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { SEOHead } from "@/components/SEOHead";

interface Destination {
  id: string;
  slug: string;
  name: string;
  category: string;
  description: string;
  country: string;
  img: string;
  featured: boolean;
}

const DestinationsIndex: React.FC = () => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDestinations() {
      try {
        console.log('Fetching destinations...');
        
        const { data, error: fetchError } = await supabase
          .from('destinations')
          .select('id, slug, name, category, description, country, img, featured')
          .order('featured', { ascending: false })
          .order('name');

        if (fetchError) {
          console.error('Database error:', fetchError);
          throw fetchError;
        }

        console.log('Fetched destinations:', data);
        setDestinations(data || []);
      } catch (err) {
        console.error("Failed to load destinations", err);
        setError(err instanceof Error ? err.message : 'Failed to fetch destinations');
      } finally {
        setLoading(false);
      }
    }
    
    fetchDestinations();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <LoadingSpinner />
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">Error Loading Destinations</h1>
          <p className="text-muted-foreground mb-8">{error}</p>
          <Link 
            to="/" 
            className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Return Home
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <SEOHead 
        title="Explore Amazing Destinations | Utrippin.ai"
        description="Discover incredible travel destinations around the world. Find detailed guides, weather information, activities, and travel tips for your next adventure."
        keywords="travel destinations, vacation spots, travel guides, tourism, holiday destinations"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": "Travel Destinations",
          "description": "Explore amazing travel destinations with detailed guides and information",
          "url": "https://utrippin.ai/destinations"
        }}
      />
      <div className="min-h-screen bg-background">
        <Header />
        
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Explore Amazing Destinations
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover incredible places around the world with detailed guides, weather information, 
              and insider tips for your perfect getaway.
            </p>
          </div>
        </div>

        {/* Destinations Grid */}
        <div className="container mx-auto px-4 py-12">
          {destinations.length === 0 ? (
            <div className="text-center py-16">
              <h2 className="text-2xl font-semibold text-foreground mb-4">No destinations found</h2>
              <p className="text-muted-foreground">Check back soon for amazing travel destinations!</p>
            </div>
          ) : (
            <>
              {/* Featured Destinations */}
              {destinations.some(d => d.featured) && (
                <div className="mb-12">
                  <h2 className="text-3xl font-bold text-foreground mb-8">Featured Destinations</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {destinations
                      .filter(dest => dest.featured)
                      .map((dest) => (
                        <Link 
                          to={`/destinations/${dest.slug}`} 
                          key={dest.id}
                          className="group block"
                        >
                          <div className="rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden bg-card border border-border group-hover:scale-105">
                            <div className="relative">
                              <img
                                src={dest.img || `https://placehold.co/400x250/10B981/FFFFFF?text=${encodeURIComponent(dest.name)}`}
                                alt={dest.name}
                                className="w-full h-48 object-cover"
                                loading="lazy"
                              />
                              <div className="absolute top-3 left-3">
                                <span className="bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs font-medium">
                                  Featured
                                </span>
                              </div>
                            </div>
                            <div className="p-4">
                              <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                                {dest.name}
                              </h3>
                              <p className="text-muted-foreground text-sm mt-1 mb-2">
                                {dest.country}
                              </p>
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {dest.description}
                              </p>
                              {dest.category && (
                                <div className="mt-3">
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                                    {dest.category}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </Link>
                      ))}
                  </div>
                </div>
              )}

              {/* All Destinations */}
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-8">
                  {destinations.some(d => d.featured) ? 'More Destinations' : 'All Destinations'}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {destinations
                    .filter(dest => !dest.featured)
                    .map((dest) => (
                      <Link 
                        to={`/destinations/${dest.slug}`} 
                        key={dest.id}
                        className="group block"
                      >
                        <div className="rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden bg-card border border-border group-hover:scale-105">
                          <img
                            src={dest.img || `https://placehold.co/300x200/10B981/FFFFFF?text=${encodeURIComponent(dest.name)}`}
                            alt={dest.name}
                            className="w-full h-40 object-cover"
                            loading="lazy"
                          />
                          <div className="p-4">
                            <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                              {dest.name}
                            </h3>
                            <p className="text-muted-foreground text-sm mt-1 mb-2">
                              {dest.country}
                            </p>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {dest.description}
                            </p>
                            {dest.category && (
                              <div className="mt-3">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                                  {dest.category}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </Link>
                    ))}
                </div>
              </div>
            </>
          )}
        </div>

        <Footer />
      </div>
    </>
  );
};

export default DestinationsIndex;