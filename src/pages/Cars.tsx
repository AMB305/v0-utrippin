import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductLayout from "@/components/ProductLayout";
import CarSearchBar from "@/components/CarSearchBar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Users, Shield, Clock, MessageCircle, CheckCircle, Car, MapPin, Zap } from "lucide-react";
import { SEOHead } from "@/components/SEOHead";
import { generateBreadcrumbSchema, generateTravelServiceSchema } from "@/utils/structuredData";

interface CarSearchData {
  pickupLocation: string;
  dropoffLocation: string;
  pickupDate: Date | null;
  dropoffDate: Date | null;
  pickupTime: string;
  dropoffTime: string;
  driverAge: string;
}

const Cars = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSearch = async (searchData: CarSearchData) => {
    if (!searchData.pickupLocation || !searchData.pickupDate || !searchData.dropoffDate) {
      return;
    }

    setLoading(true);
    
    // Simulate search delay
    setTimeout(() => {
      const searchParams = new URLSearchParams({
        pickupLocation: searchData.pickupLocation,
        dropoffLocation: searchData.dropoffLocation || searchData.pickupLocation,
        pickupDate: searchData.pickupDate!.toISOString(),
        dropoffDate: searchData.dropoffDate!.toISOString(),
        pickupTime: searchData.pickupTime,
        dropoffTime: searchData.dropoffTime,
        driverAge: searchData.driverAge
      });
      
      navigate(`/cars/results?${searchParams.toString()}`);
      setLoading(false);
    }, 1000);
  };

  const breadcrumbs = generateBreadcrumbSchema([
    { name: "Home", url: "https://utrippin.ai" },
    { name: "Cars", url: "https://utrippin.ai/cars" }
  ]);

  const carServiceSchema = generateTravelServiceSchema({
    name: "Car Rental Service",
    description: "Rent cars easily. Find deals on car rentals worldwide.",
    provider: "Utrippin.ai",
    url: "https://utrippin.ai/cars"
  });

  return (
    <ProductLayout>
      <SEOHead 
        title="Cheap Car Rentals & Airport Cars | Utrippin.ai"
        description="Rent cars easily. Find deals on economy, luxury, SUV and electric car rentals worldwide. Compare prices from top rental companies."
        canonical="https://utrippin.ai/cars"
        keywords="car rental, cheap car rentals, airport car rental, car hire, rent a car"
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
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Book Car Rentals
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Compare prices from top rental companies and book with confidence
            </p>
            
            {/* Search Bar */}
            <div className="mt-8 font-inherit">
              <CarSearchBar onSearch={handleSearch} loading={loading} />
            </div>
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="py-16 bg-travel-light">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Popular Car Rental Destinations</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore top destinations and find the perfect rental car for your journey
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              { city: "Los Angeles", airport: "LAX", cars: "500+ cars", price: "from $25/day", image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80" },
              { city: "New York", airport: "JFK", cars: "400+ cars", price: "from $35/day", image: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=800&q=80" },
              { city: "Miami", airport: "MIA", cars: "350+ cars", price: "from $30/day", image: "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?auto=format&fit=crop&w=800&q=80" },
              { city: "Las Vegas", airport: "LAS", cars: "300+ cars", price: "from $22/day", image: "https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=800&q=80" }
            ].map((destination, index) => (
              <Card key={index} className="hover:shadow-soft transition-shadow duration-300 cursor-pointer">
                <CardContent className="p-0">
                  <div className="h-32 bg-muted rounded-t-lg flex items-center justify-center overflow-hidden">
                    <img 
                      src={destination.image} 
                      alt={destination.city}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder.svg';
                      }}
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-1">{destination.city}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{destination.airport}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">{destination.cars}</span>
                      <span className="text-sm font-semibold text-primary">{destination.price}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Car Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Choose Your Perfect Ride</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From economy to luxury, find the right car for every occasion and budget
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              { 
                type: "Economy", 
                description: "Great for city trips", 
                price: "from $20/day", 
                features: ["Fuel efficient", "Easy parking", "Budget friendly"],
                image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80"
              },
              { 
                type: "SUV", 
                description: "Perfect for families", 
                price: "from $45/day", 
                features: ["Spacious", "All terrain", "7+ seats"],
                image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=800&q=80"
              },
              { 
                type: "Luxury", 
                description: "Premium experience", 
                price: "from $80/day", 
                features: ["Premium interior", "Advanced tech", "Prestige brands"],
                image: "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80"
              },
              { 
                type: "Electric", 
                description: "Eco-friendly choice", 
                price: "from $55/day", 
                features: ["Zero emissions", "Quiet ride", "Tech forward"],
                image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=800&q=80"
              }
            ].map((category, index) => (
              <Card key={index} className="hover:shadow-soft transition-all duration-300 cursor-pointer hover:scale-105">
                <CardContent className="p-0">
                  <div className="h-40 bg-muted rounded-t-lg overflow-hidden">
                    <img 
                      src={category.image} 
                      alt={category.type}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder.svg';
                      }}
                    />
                  </div>
                  <div className="p-6 text-center">
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
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-gradient-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Why Rent With UTrippin?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We make car rental simple, affordable, and reliable
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: <Shield className="w-12 h-12 text-primary" />,
                title: "Best Price Guarantee",
                description: "We'll match any lower price you find"
              },
              {
                icon: <Clock className="w-12 h-12 text-primary" />,
                title: "24/7 Support",
                description: "Get help anytime, anywhere"
              },
              {
                icon: <CheckCircle className="w-12 h-12 text-primary" />,
                title: "Free Cancellation",
                description: "Cancel up to 24 hours before pickup"
              },
              {
                icon: <MapPin className="w-12 h-12 text-primary" />,
                title: "Global Coverage",
                description: "Cars available in 180+ countries"
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

      {/* Customer Reviews */}
      <section className="py-16 bg-travel-light">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">What Our Customers Say</h2>
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-travel-gold text-travel-gold" />
                ))}
              </div>
              <span className="text-muted-foreground">4.8/5 from 8,500+ reviews</span>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              {
                name: "Sarah Johnson",
                location: "Los Angeles",
                rating: 5,
                comment: "Amazing service! Got a great SUV for our family vacation. The booking process was seamless."
              },
              {
                name: "Michael Chen", 
                location: "Miami",
                rating: 5,
                comment: "Best car rental experience I've had. Great prices and the car was exactly as described."
              },
              {
                name: "Emma Davis",
                location: "New York",
                rating: 5,
                comment: "Super convenient pickup and drop-off. Will definitely use UTrippin for future rentals."
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
                      <p className="text-muted-foreground text-xs">{review.location}</p>
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

export default Cars;