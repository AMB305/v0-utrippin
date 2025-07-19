import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductLayout from "@/components/ProductLayout";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Users, Shield, Clock, MessageCircle, CheckCircle, Ship, MapPin, Calendar, Utensils, Waves, Camera, Music, Heart } from "lucide-react";

const Cruises = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  return (
    <>
      <SEOHead 
        title="Luxury Cruise Deals & Ocean Voyages | Utrippin.ai"
        description="Discover amazing cruise deals and luxury ocean voyages. Book Caribbean, Mediterranean, Alaska cruises and more. Compare prices from top cruise lines and sail away on your dream vacation."
        canonical="https://utrippin.ai/cruises"
        keywords="cruise deals, luxury cruises, Caribbean cruises, Mediterranean cruises, cruise booking, ocean voyages"
        structuredData={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "TravelAgency",
              "name": "Utrippin.ai Cruise Service",
              "description": "Premium cruise booking service offering luxury ocean voyages and cruise deals worldwide",
              "url": "https://utrippin.ai/cruises",
              "serviceType": "Cruise Booking"
            },
            {
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Home",
                  "item": "https://utrippin.ai"
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "Cruises",
                  "item": "https://utrippin.ai/cruises"
                }
              ]
            },
            {
              "@type": "WebPage",
              "@id": "https://utrippin.ai/cruises#webpage",
              "url": "https://utrippin.ai/cruises",
              "name": "Luxury Cruise Deals & Ocean Voyages | Utrippin.ai",
              "description": "Discover amazing cruise deals and luxury ocean voyages. Book Caribbean, Mediterranean, Alaska cruises and more.",
              "inLanguage": "en-US"
            }
          ]
        }}
      />
    <ProductLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Set Sail on Your Dream Cruise
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Discover the world's oceans with luxury cruise lines and unforgettable experiences
            </p>
            
            {/* Search Section */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mt-8">
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">Destination</label>
                  <select className="w-full p-3 rounded-lg border border-white/20 bg-white/20 text-white">
                    <option value="">Select destination</option>
                    <option value="caribbean">Caribbean</option>
                    <option value="mediterranean">Mediterranean</option>
                    <option value="alaska">Alaska</option>
                    <option value="northern-lights">Northern Lights</option>
                  </select>
                </div>
                <div>
                  <label className="block text-white text-sm font-medium mb-2">Duration</label>
                  <select className="w-full p-3 rounded-lg border border-white/20 bg-white/20 text-white">
                    <option value="">Any duration</option>
                    <option value="3-5">3-5 days</option>
                    <option value="6-9">6-9 days</option>
                    <option value="10-14">10-14 days</option>
                    <option value="15+">15+ days</option>
                  </select>
                </div>
                <div>
                  <label className="block text-white text-sm font-medium mb-2">Month</label>
                  <select className="w-full p-3 rounded-lg border border-white/20 bg-white/20 text-white">
                    <option value="">Departure month</option>
                    <option value="january">January</option>
                    <option value="february">February</option>
                    <option value="march">March</option>
                    <option value="april">April</option>
                  </select>
                </div>
              </div>
              <Button 
                className="w-full mt-4 bg-travel-gold hover:bg-travel-gold/90 text-travel-navy font-semibold"
                disabled={loading}
              >
                {loading ? "Searching..." : "Search Cruises"}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="py-16 bg-travel-light">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Popular Cruise Destinations</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore breathtaking destinations with world-class cruise lines
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              { 
                destination: "Caribbean", 
                description: "Tropical paradise islands", 
                ships: "50+ ships", 
                price: "from $399/person", 
                image: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=800&q=80",
                duration: "7-14 days"
              },
              { 
                destination: "Mediterranean", 
                description: "Historic ports & culture", 
                ships: "40+ ships", 
                price: "from $599/person", 
                image: "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?auto=format&fit=crop&w=800&q=80",
                duration: "10-12 days"
              },
              { 
                destination: "Alaska", 
                description: "Glaciers & wildlife", 
                ships: "25+ ships", 
                price: "from $799/person", 
                image: "https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=800&q=80",
                duration: "7-10 days"
              },
              { 
                destination: "Northern Lights", 
                description: "Arctic wilderness & aurora", 
                ships: "15+ ships", 
                price: "from $1,299/person", 
                image: "https://images.unsplash.com/photo-1466721591366-2d5fba72006d?auto=format&fit=crop&w=800&q=80",
                duration: "10-14 days"
              }
            ].map((destination, index) => (
              <Card key={index} className="hover:shadow-soft transition-shadow duration-300 cursor-pointer">
                <CardContent className="p-0">
                  <div className="h-48 bg-muted rounded-t-lg overflow-hidden">
                    <img 
                      src={destination.image} 
                      alt={destination.destination}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder.svg';
                      }}
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-1">{destination.destination}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{destination.description}</p>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs text-muted-foreground">{destination.ships}</span>
                      <span className="text-sm font-semibold text-primary">{destination.price}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3">{destination.duration}</p>
                    <Button variant="outline" size="sm" className="w-full">
                      View Cruises
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Cruise Types */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Choose Your Cruise Experience</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From luxury voyages to family adventures, find the perfect cruise for your style
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              { 
                type: "Luxury Cruises", 
                description: "Premium suites & service", 
                price: "from $1,299/person", 
                features: ["Butler service", "Fine dining", "Spa treatments"],
                icon: <Star className="w-8 h-8" />
              },
              { 
                type: "Family Cruises", 
                description: "Fun for all ages", 
                price: "from $499/person", 
                features: ["Kids clubs", "Water slides", "Family shows"],
                icon: <Users className="w-8 h-8" />
              },
              { 
                type: "Adventure Cruises", 
                description: "Exploration & discovery", 
                price: "from $899/person", 
                features: ["Expedition guides", "Zodiac boats", "Wildlife viewing"],
                icon: <Camera className="w-8 h-8" />
              },
              { 
                type: "River Cruises", 
                description: "Intimate waterway journeys", 
                price: "from $1,599/person", 
                features: ["Scenic routes", "Cultural immersion", "Small ships"],
                icon: <Waves className="w-8 h-8" />
              }
            ].map((cruise, index) => (
              <Card key={index} className="hover:shadow-soft transition-all duration-300 cursor-pointer hover:scale-105">
                <CardContent className="p-6 text-center">
                  <div className="text-primary mb-4 flex justify-center">
                    {cruise.icon}
                  </div>
                  <h3 className="font-semibold text-xl mb-2">{cruise.type}</h3>
                  <p className="text-muted-foreground text-sm mb-3">{cruise.description}</p>
                  <p className="font-semibold text-primary mb-4">{cruise.price}</p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    {cruise.features.map((feature, featureIndex) => (
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

      {/* Why Choose Cruises */}
      <section className="py-16 bg-gradient-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Why Choose UTrippin for Cruises?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Expert cruise planning with unbeatable value and service
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: <Ship className="w-12 h-12 text-primary" />,
                title: "Best Cruise Deals",
                description: "Exclusive rates and cabin upgrades"
              },
              {
                icon: <Shield className="w-12 h-12 text-primary" />,
                title: "Price Protection",
                description: "Best price guarantee on all cruises"
              },
              {
                icon: <Clock className="w-12 h-12 text-primary" />,
                title: "Expert Support",
                description: "Cruise specialists available 24/7"
              },
              {
                icon: <Heart className="w-12 h-12 text-primary" />,
                title: "Personalized Service",
                description: "Tailored recommendations for you"
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

      {/* Featured Cruises */}
      <section className="py-16 bg-travel-light">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Featured Cruise Deals</h2>
            <p className="text-muted-foreground">Limited time offers on popular cruise itineraries</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              {
                title: "Caribbean Explorer",
                cruise_line: "Royal Caribbean",
                duration: "7 nights",
                ship: "Oasis of the Seas",
                departure: "Miami",
                originalPrice: "$1,299",
                salePrice: "$899",
                savings: "$400"
              },
              {
                title: "Mediterranean Odyssey",
                cruise_line: "Norwegian",
                duration: "10 nights",
                ship: "Epic",
                departure: "Barcelona",
                originalPrice: "$1,899",
                salePrice: "$1,399",
                savings: "$500"
              },
              {
                title: "Alaska Wilderness",
                cruise_line: "Princess",
                duration: "7 nights",
                ship: "Crown Princess",
                departure: "Seattle",
                originalPrice: "$1,599",
                salePrice: "$1,199",
                savings: "$400"
              }
            ].map((cruise, index) => (
              <Card key={index} className="hover:shadow-soft transition-shadow duration-300 cursor-pointer">
                <CardContent className="p-6">
                  <div className="text-center space-y-3">
                    <Badge className="bg-red-600 text-white">LIMITED TIME</Badge>
                    <h3 className="font-semibold text-lg">{cruise.title}</h3>
                    <p className="text-muted-foreground text-sm">{cruise.cruise_line} • {cruise.ship}</p>
                    <p className="text-muted-foreground text-sm">{cruise.duration} from {cruise.departure}</p>
                    
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground line-through">
                        Was {cruise.originalPrice}
                      </div>
                      <div className="text-2xl font-bold text-green-600">
                        {cruise.salePrice}
                      </div>
                      <div className="text-sm font-semibold text-red-600">
                        Save {cruise.savings}!
                      </div>
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
            <h2 className="text-3xl font-bold text-foreground mb-4">What Our Cruisers Say</h2>
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-travel-gold text-travel-gold" />
                ))}
              </div>
              <span className="text-muted-foreground">4.9/5 from 15,000+ cruise bookings</span>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              {
                name: "Robert & Linda Smith",
                cruise: "Caribbean Explorer",
                rating: 5,
                comment: "Amazing 7-day cruise! The ship was spectacular and the service was top-notch. Already booking our next cruise!"
              },
              {
                name: "Jennifer Adams", 
                cruise: "Mediterranean Odyssey",
                rating: 5,
                comment: "UTrippin found us the perfect Mediterranean cruise. The ports were beautiful and the onboard experience was unforgettable."
              },
              {
                name: "Mike & Susan Johnson",
                cruise: "Alaska Wilderness",
                rating: 5,
                comment: "Seeing glaciers and wildlife from the ship was breathtaking. UTrippin's cruise expertise made planning so easy."
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
                      <p className="text-muted-foreground text-xs">{review.cruise}</p>
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
    </>
  );
};

export default Cruises;