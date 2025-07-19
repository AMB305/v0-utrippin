import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import ProductLayout from "@/components/ProductLayout";
import PackageSearchBar from "@/components/PackageSearchBar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Users, Shield, Clock, MessageCircle, CheckCircle, Package, MapPin, Plane, Building2, Palmtree, Mountain, Camera, Utensils } from "lucide-react";
import { SEOHead } from "@/components/SEOHead";
import { generateBreadcrumbSchema, generateTravelServiceSchema } from "@/utils/structuredData";

interface PackageSearchData {
  tripType: "roundtrip" | "multicity";
  origin: string;
  destination: string;
  departureDate: Date | null;
  returnDate: Date | null;
  travelers: {
    adults: number;
    children: number;
    rooms: number;
  };
  duration: string;
  packageType: string;
}

const Packages = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);

  // Get initial data from URL parameters  
  const initialData = {
    packageType: searchParams.get('category') || 'any'
  };

  const handleSearch = async (searchData: PackageSearchData) => {
    if (!searchData.origin || !searchData.destination || !searchData.departureDate) {
      return;
    }

    setLoading(true);
    
    // Simulate search delay
    setTimeout(() => {
      const searchParams = new URLSearchParams({
        tripType: searchData.tripType,
        origin: searchData.origin,
        destination: searchData.destination,
        departureDate: searchData.departureDate!.toISOString(),
        returnDate: searchData.returnDate?.toISOString() || '',
        adults: searchData.travelers.adults.toString(),
        children: searchData.travelers.children.toString(),
        rooms: searchData.travelers.rooms.toString(),
        duration: searchData.duration,
        packageType: searchData.packageType
      });
      
      navigate(`/packages/results?${searchParams.toString()}`);
      setLoading(false);
    }, 1000);
  };

  const breadcrumbs = generateBreadcrumbSchema([
    { name: "Home", url: "https://utrippin.ai" },
    { name: "Packages", url: "https://utrippin.ai/packages" }
  ]);

  const packageServiceSchema = generateTravelServiceSchema({
    name: "Vacation Package Service",
    description: "Bundle flights, hotels, cars & save on vacation packages",
    provider: "Utrippin.ai",
    url: "https://utrippin.ai/packages"
  });

  return (
    <ProductLayout>
      <SEOHead 
        title="Vacation Packages & All-Inclusive Deals | Utrippin.ai"
        description="Bundle flights, hotels, cars & save on vacation packages. Find all-inclusive deals and custom travel packages worldwide."
        canonical="https://utrippin.ai/packages"
        keywords="vacation packages, all inclusive deals, travel packages, flight hotel bundles"
        structuredData={{
          "@context": "https://schema.org",
          "@graph": [
            breadcrumbs,
            packageServiceSchema,
            {
              "@type": "WebPage",
              "@id": "https://utrippin.ai/packages#webpage",
              "url": "https://utrippin.ai/packages",
              "name": "Vacation Packages & All-Inclusive Deals | Utrippin.ai",
              "description": "Bundle flights, hotels, cars & save on vacation packages. Find all-inclusive deals and custom travel packages worldwide.",
              "inLanguage": "en-US"
            }
          ]
        }}
      />
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Explore Vacation Packages
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Book flight + hotel together and save up to $500 on your dream vacation
            </p>
            
            {/* Search Bar */}
            <div className="mt-8">
              <PackageSearchBar onSearch={handleSearch} loading={loading} />
            </div>
          </div>
        </div>
      </section>

      {/* Popular Package Destinations */}
      <section className="py-16 bg-travel-light">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Popular Vacation Packages</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover amazing deals on flight + hotel packages to the world's most beautiful destinations
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              { 
                destination: "Cancun", 
                country: "Mexico", 
                packages: "50+ packages", 
                price: "from $599/person", 
                image: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=800&q=80",
                savings: "Save up to $300"
              },
              { 
                destination: "Bali", 
                country: "Indonesia", 
                packages: "35+ packages", 
                price: "from $899/person", 
                image: "https://images.unsplash.com/photo-1466721591366-2d5fba72006d?auto=format&fit=crop&w=800&q=80",
                savings: "Save up to $400"
              },
              { 
                destination: "Paris", 
                country: "France", 
                packages: "60+ packages", 
                price: "from $749/person", 
                image: "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?auto=format&fit=crop&w=800&q=80",
                savings: "Save up to $350"
              },
              { 
                destination: "Dubai", 
                country: "UAE", 
                packages: "40+ packages", 
                price: "from $1,099/person", 
                image: "https://images.unsplash.com/photo-1452378174528-3090a4bba7b2?auto=format&fit=crop&w=800&q=80",
                savings: "Save up to $500"
              }
            ].map((destination, index) => (
              <Card key={index} className="hover:shadow-soft transition-shadow duration-300 cursor-pointer">
                <CardContent className="p-0">
                  <div className="h-48 bg-muted rounded-t-lg flex items-center justify-center overflow-hidden relative">
                    <img 
                      src={destination.image} 
                      alt={destination.destination}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder.svg';
                      }}
                    />
                    <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-semibold">
                      {destination.savings}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-1">{destination.destination}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{destination.country}</p>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs text-muted-foreground">{destination.packages}</span>
                      <span className="text-sm font-semibold text-primary">{destination.price}</span>
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      View Packages
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Package Types */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Choose Your Perfect Package</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From beach getaways to city adventures, find the perfect vacation package for every type of traveler
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              { 
                type: "Beach Escapes", 
                description: "Tropical paradise awaits", 
                price: "from $599/person", 
                features: ["Beachfront hotels", "All-inclusive options", "Water activities"],
                icon: <Palmtree className="w-8 h-8" />
              },
              { 
                type: "City Breaks", 
                description: "Urban adventures & culture", 
                price: "from $649/person", 
                features: ["Downtown hotels", "City tours", "Cultural experiences"],
                icon: <Building2 className="w-8 h-8" />
              },
              { 
                type: "Adventure Tours", 
                description: "Thrilling outdoor experiences", 
                price: "from $799/person", 
                features: ["Adventure activities", "Nature lodges", "Expert guides"],
                icon: <Mountain className="w-8 h-8" />
              },
              { 
                type: "Cultural Journeys", 
                description: "Immersive cultural experiences", 
                price: "from $899/person", 
                features: ["Historical sites", "Local cuisine", "Cultural guides"],
                icon: <Camera className="w-8 h-8" />
              }
            ].map((category, index) => (
              <Card key={index} className="hover:shadow-soft transition-all duration-300 cursor-pointer hover:scale-105">
                <CardContent className="p-6 text-center">
                  <div className="text-primary mb-4 flex justify-center">
                    {category.icon}
                  </div>
                  <h3 className="font-semibold text-xl mb-2">{category.type}</h3>
                  <p className="text-muted-foreground text-sm mb-3">{category.description}</p>
                  <p className="font-semibold text-primary mb-4">{category.price}</p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    {category.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center justify-center gap-1">
                        <CheckCircle className="w-3 h-3 text-green-600" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Package Benefits */}
      <section className="py-16 bg-gradient-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Why Book Packages With UTrippin?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Save more, stress less with our expertly curated vacation packages
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: <Package className="w-12 h-12 text-primary" />,
                title: "Bundle & Save",
                description: "Save up to $500 when you book flight + hotel together"
              },
              {
                icon: <Shield className="w-12 h-12 text-primary" />,
                title: "Price Protection",
                description: "Best price guarantee on all vacation packages"
              },
              {
                icon: <Clock className="w-12 h-12 text-primary" />,
                title: "24/7 Support",
                description: "Expert travel support throughout your journey"
              },
              {
                icon: <CheckCircle className="w-12 h-12 text-primary" />,
                title: "Instant Confirmation",
                description: "Get your complete package confirmed instantly"
              }
            ].map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="mb-4 flex justify-center">
                  {benefit.icon}
                </div>
                <h3 className="font-semibold text-lg mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground text-sm">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Deals */}
      <section className="py-16 bg-travel-light">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Today's Featured Deals</h2>
            <p className="text-muted-foreground">Limited time offers on popular vacation packages</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              {
                destination: "Maldives All-Inclusive",
                duration: "7 nights",
                originalPrice: "$2,999",
                salePrice: "$1,999",
                savings: "$1,000",
                hotel: "5-star overwater villa",
                includes: ["Flights", "All meals", "Spa credits"]
              },
              {
                destination: "European Grand Tour",
                duration: "10 nights",
                originalPrice: "$3,499",
                salePrice: "$2,299",
                savings: "$1,200",
                hotel: "4-star city center hotels",
                includes: ["Flights", "Hotels", "Rail passes"]
              },
              {
                destination: "Costa Rica Adventure",
                duration: "8 nights",
                originalPrice: "$1,899",
                salePrice: "$1,299",
                savings: "$600",
                hotel: "Eco-lodge & beach resort",
                includes: ["Flights", "Tours", "Transfers"]
              }
            ].map((deal, index) => (
              <Card key={index} className="hover:shadow-soft transition-shadow duration-300 cursor-pointer">
                <CardContent className="p-6">
                  <div className="text-center space-y-3">
                    <Badge className="bg-red-600 text-white">LIMITED TIME</Badge>
                    <h3 className="font-semibold text-lg">{deal.destination}</h3>
                    <p className="text-muted-foreground text-sm">{deal.duration} • {deal.hotel}</p>
                    
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground line-through">
                        Was {deal.originalPrice}
                      </div>
                      <div className="text-2xl font-bold text-green-600">
                        {deal.salePrice}
                      </div>
                      <div className="text-sm font-semibold text-red-600">
                        Save {deal.savings}!
                      </div>
                    </div>
                    
                    <div className="space-y-1 text-xs text-muted-foreground">
                      {deal.includes.map((include, includeIndex) => (
                        <div key={includeIndex} className="flex items-center justify-center gap-1">
                          <CheckCircle className="w-3 h-3 text-green-600" />
                          {include}
                        </div>
                      ))}
                    </div>
                    
                    <Button className="w-full" variant="default">
                      Book Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Reviews */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">What Our Travelers Say</h2>
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-travel-gold text-travel-gold" />
                ))}
              </div>
              <span className="text-muted-foreground">4.9/5 from 25,000+ package bookings</span>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              {
                name: "Jessica Wong",
                destination: "Bali Package",
                rating: 5,
                comment: "Incredible value! Saved over $400 compared to booking separately. Everything was perfectly organized."
              },
              {
                name: "Mark Thompson", 
                destination: "Paris City Break",
                rating: 5,
                comment: "The hotel location was perfect and flights were smooth. UTrippin made it so easy to plan our anniversary trip."
              },
              {
                name: "Ana Martinez",
                destination: "Costa Rica Adventure",
                rating: 5,
                comment: "Amazing experience from start to finish. The adventure activities were thrilling and the eco-lodge was beautiful!"
              }
            ].map((review, index) => (
              <Card key={index} className="hover:shadow-soft transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-travel-gold text-travel-gold" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 italic text-sm">"{review.comment}"</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-sm">{review.name}</p>
                      <p className="text-muted-foreground text-xs">{review.destination}</p>
                    </div>
                    <MessageCircle className="w-4 h-4 text-primary opacity-50" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </ProductLayout>
  );
};

export default Packages;