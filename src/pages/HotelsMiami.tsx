import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, Star, ExternalLink } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { miamiHotels, createMiamiHotelsSchema } from "@/data/miamiHotels";
import { supabase } from "@/integrations/supabase/client";

const generateMapUrl = (lat: number, lng: number, token?: string) => {
  if (!token) {
    return `https://via.placeholder.com/400x200/f3f4f6/6b7280?text=Map+Loading...`;
  }
  return `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/${lng},${lat},15/400x200?access_token=${token}`;
};

export default function HotelsMiami() {
  const [mapboxToken, setMapboxToken] = useState<string | null>(null);
  
  useEffect(() => {
    const getMapboxToken = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('get-mapbox-token');
        if (data?.token) {
          setMapboxToken(data.token);
        }
      } catch (error) {
        console.log('Mapbox token not configured yet');
      }
    };
    
    getMapboxToken();
  }, []);

  const pageTitle = "Book Miami Hotels & Resorts | UTrippin.ai";
  const pageDescription = "Discover the best hotels in Miami with UTrippin. Browse top 25 hotels with maps, photos & location highlights. Ready to book with secure Expedia links.";

  return (
    <>
      <Header />
      <SEOHead
        title={pageTitle}
        description={pageDescription}
        canonical="https://utrippin.ai/hotels/miami"
        ogImage="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=630&fit=crop"
        keywords="Miami hotels, South Beach hotels, Miami Beach resorts, Florida hotels, oceanfront hotels"
        structuredData={createMiamiHotelsSchema()}
      />

      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-b from-primary/10 to-background py-16">
          <div className="max-w-7xl mx-auto px-4">
            {/* Breadcrumbs */}
            <nav className="mb-6" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-2 text-sm text-muted-foreground">
                <li><Link to="/" className="hover:text-foreground">Home</Link></li>
                <li>/</li>
                <li><Link to="/hotels" className="hover:text-foreground">Hotels</Link></li>
                <li>/</li>
                <li className="text-foreground font-medium">Miami</li>
              </ol>
            </nav>

            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                Top Hotels in Miami
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
                Ready for sun, beaches and unforgettable nightlife? Discover Miami's best hotels hand-picked by UTrippin. 
                See each hotel on the map, check nearby attractions and book securely via Expedia with your trip already pre-filled.
              </p>
              
              <div className="flex flex-wrap justify-center gap-3">
                <Badge variant="secondary" className="px-4 py-2">
                  <MapPin className="w-4 h-4 mr-2" />
                  25+ Premium Hotels
                </Badge>
                <Badge variant="secondary" className="px-4 py-2">
                  <Star className="w-4 h-4 mr-2" />
                  Verified Reviews
                </Badge>
                <Badge variant="secondary" className="px-4 py-2">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Secure Booking
                </Badge>
              </div>
            </div>
          </div>
        </section>

        {/* Hotels Grid */}
        <section className="max-w-7xl mx-auto py-12 px-4">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-4">Hotels in Miami</h2>
            <p className="text-muted-foreground">
              From luxury resorts in South Beach to family-friendly hotels in Sunny Isles, 
              find the perfect Miami accommodation for your stay.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {miamiHotels.map((hotel) => (
              <Card key={hotel.id} className="group overflow-hidden hover:shadow-lg transition-all duration-300 border border-border/50">
                {/* Hotel Image */}
                <div className="relative overflow-hidden">
                  <img
                    src={hotel.image}
                    alt={`${hotel.name} hotel in Miami`}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  {hotel.rating && (
                    <div className="absolute top-3 right-3 bg-background/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{hotel.rating}</span>
                    </div>
                  )}
                  {hotel.neighborhood && (
                    <div className="absolute bottom-3 left-3">
                      <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm">
                        {hotel.neighborhood}
                      </Badge>
                    </div>
                  )}
                </div>

                <CardContent className="p-6">
                  {/* Hotel Info */}
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {hotel.name}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                      {hotel.description}
                    </p>
                    {hotel.priceRange && (
                      <p className="text-sm font-semibold text-foreground">
                        {hotel.priceRange} per night
                      </p>
                    )}
                  </div>

                  {/* Map */}
                  <div className="mb-4">
                    <img
                      src={generateMapUrl(hotel.coordinates.lat, hotel.coordinates.lng, mapboxToken || undefined)}
                      alt={`Map location of ${hotel.name}`}
                      className="w-full h-32 object-cover rounded-md border border-border"
                      loading="lazy"
                      onError={(e) => {
                        // Fallback to a placeholder if Mapbox fails
                        e.currentTarget.src = `https://via.placeholder.com/400x200/f3f4f6/6b7280?text=Map+Location`;
                      }}
                    />
                  </div>

                  {/* Booking Button */}
                  <a
                    href={hotel.expediaLink}
                    target="_blank"
                    rel="noopener nofollow"
                    className="inline-flex items-center justify-center w-full bg-primary text-primary-foreground px-4 py-3 rounded-md hover:bg-primary/90 transition-colors font-medium"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Ready to Book
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Quick Miami Guide */}
        <section className="bg-muted/30 py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Miami Travel Guide</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Make the most of your Miami stay with insider tips and local recommendations.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="p-6 text-center">
                <h3 className="text-xl font-bold text-foreground mb-3">Best Areas</h3>
                <p className="text-muted-foreground text-sm">
                  South Beach for nightlife, Mid-Beach for luxury, Bal Harbour for shopping, 
                  and Sunny Isles Beach for families.
                </p>
              </Card>

              <Card className="p-6 text-center">
                <h3 className="text-xl font-bold text-foreground mb-3">Best Time to Visit</h3>
                <p className="text-muted-foreground text-sm">
                  December to April offers perfect weather. Summer is hot and humid but offers 
                  better hotel deals and fewer crowds.
                </p>
              </Card>

              <Card className="p-6 text-center">
                <h3 className="text-xl font-bold text-foreground mb-3">Getting Around</h3>
                <p className="text-muted-foreground text-sm">
                  Most hotels offer shuttle services. The Miami Beach Trolley is free, 
                  and rideshare services are widely available.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* Disclaimer */}
        <section className="max-w-7xl mx-auto py-8 px-4">
          <div className="text-center">
            <p className="text-xs text-muted-foreground leading-relaxed max-w-4xl mx-auto">
              Prices shown may vary based on travel dates and availability. UTrippin is a participant in affiliate programs 
              with Expedia and earns commissions on bookings made through these links. Maps provided by Mapbox. 
              Hotel ratings are indicative and may vary. Please verify current rates and availability directly with the hotel or booking platform.
            </p>
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
}