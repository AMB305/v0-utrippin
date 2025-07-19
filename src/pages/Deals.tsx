import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import ProductLayout from "@/components/ProductLayout";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Users, Shield, Clock, MessageCircle, CheckCircle, Percent, MapPin, Calendar, Plane, Building2, Car, Ship, Camera } from "lucide-react";

const Deals = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || "all");

  const dealCategories = [
    { id: "all", name: "All Deals", icon: <Percent className="w-5 h-5" /> },
    { id: "flights", name: "Flight Deals", icon: <Plane className="w-5 h-5" /> },
    { id: "hotels", name: "Hotel Deals", icon: <Building2 className="w-5 h-5" /> },
    { id: "packages", name: "Package Deals", icon: <Star className="w-5 h-5" /> },
    { id: "cars", name: "Car Deals", icon: <Car className="w-5 h-5" /> },
    { id: "cruises", name: "Cruise Deals", icon: <Ship className="w-5 h-5" /> },
    { id: "experiences", name: "Experience Deals", icon: <Camera className="w-5 h-5" /> }
  ];

  return (
    <>
      <SEOHead 
        title="Best Travel Deals & Discounts | Utrippin.ai"
        description="Find amazing travel deals on flights, hotels, packages, cars and cruises. Save up to 70% on your next trip with exclusive discounts and limited-time offers from Utrippin.ai."
        canonical="https://utrippin.ai/deals"
        keywords="travel deals, flight discounts, hotel deals, vacation packages, travel discounts, cheap travel"
        structuredData={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebPage",
              "@id": "https://utrippin.ai/deals#webpage",
              "url": "https://utrippin.ai/deals",
              "name": "Best Travel Deals & Discounts | Utrippin.ai",
              "description": "Find amazing travel deals on flights, hotels, packages, cars and cruises. Save up to 70% on your next trip with exclusive discounts.",
              "inLanguage": "en-US"
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
                  "name": "Deals",
                  "item": "https://utrippin.ai/deals"
                }
              ]
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
              Unbeatable Travel Deals
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Save up to 70% on flights, hotels, packages, and more with our exclusive deals
            </p>
            
            {/* Deal Alert Signup */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mt-8">
              <h3 className="text-white text-lg font-semibold mb-4">Get Deal Alerts</h3>
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input 
                  type="email" 
                  placeholder="Enter your email"
                  className="flex-1 p-3 rounded-lg border border-white/20 bg-white/20 text-white placeholder:text-white/60"
                />
                <Button className="bg-travel-gold hover:bg-travel-gold/90 text-travel-navy font-semibold">
                  Subscribe
                </Button>
              </div>
              <p className="text-white/60 text-sm mt-2">Get notified about exclusive deals and flash sales</p>
            </div>
          </div>
        </div>
      </section>

      {/* Deal Categories */}
      <section className="py-8 bg-travel-light border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-2 justify-center">
            {dealCategories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className="flex items-center gap-2"
              >
                {category.icon}
                {category.name}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Flash Deals */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">⚡ Flash Deals - Limited Time</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Grab these incredible deals before they're gone! Limited quantities available.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              { 
                title: "Tokyo Round-trip", 
                type: "Flight Deal", 
                location: "New York ↔ Tokyo", 
                originalPrice: "$1,299", 
                salePrice: "$649",
                savings: "50% OFF",
                timeLeft: "2 hours left",
                image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80"
              },
              { 
                title: "Luxury Beach Resort", 
                type: "Hotel Deal", 
                location: "Cancun, Mexico", 
                originalPrice: "$899", 
                salePrice: "$299",
                savings: "67% OFF",
                timeLeft: "5 hours left",
                image: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=800&q=80"
              },
              { 
                title: "European Adventure", 
                type: "Package Deal", 
                location: "Paris + Rome", 
                originalPrice: "$2,499", 
                salePrice: "$1,299",
                savings: "48% OFF",
                timeLeft: "1 day left",
                image: "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?auto=format&fit=crop&w=800&q=80"
              },
              { 
                title: "Premium Car Rental", 
                type: "Car Deal", 
                location: "Los Angeles", 
                originalPrice: "$199", 
                salePrice: "$79",
                savings: "60% OFF",
                timeLeft: "3 hours left",
                image: "https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=800&q=80"
              }
            ].map((deal, index) => (
              <Card key={index} className="hover:shadow-soft transition-shadow duration-300 cursor-pointer relative overflow-hidden">
                <div className="absolute top-2 left-2 z-10">
                  <Badge className="bg-red-600 text-white animate-pulse">{deal.savings}</Badge>
                </div>
                <div className="absolute top-2 right-2 z-10">
                  <Badge variant="secondary" className="bg-black/50 text-white text-xs">
                    {deal.timeLeft}
                  </Badge>
                </div>
                <CardContent className="p-0">
                  <div className="h-32 bg-muted overflow-hidden">
                    <img 
                      src={deal.image} 
                      alt={deal.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder.svg';
                      }}
                    />
                  </div>
                  <div className="p-4">
                    <Badge variant="outline" className="mb-2 text-xs">{deal.type}</Badge>
                    <h3 className="font-semibold text-sm mb-1">{deal.title}</h3>
                    <p className="text-xs text-muted-foreground mb-3">{deal.location}</p>
                    <div className="space-y-1">
                      <div className="text-xs text-muted-foreground line-through">
                        Was {deal.originalPrice}
                      </div>
                      <div className="text-lg font-bold text-green-600">
                        {deal.salePrice}
                      </div>
                    </div>
                    <Button size="sm" className="w-full mt-3">
                      Book Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Deal Types */}
      <section className="py-16 bg-travel-light">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Browse Deals by Type</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Find the perfect deal for your next adventure
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              { 
                type: "Last Minute Deals", 
                description: "Spontaneous trips, big savings", 
                discount: "Up to 60% off", 
                count: "200+ deals",
                icon: <Clock className="w-8 h-8" />,
                color: "text-red-600"
              },
              { 
                type: "Early Bird Specials", 
                description: "Book ahead and save more", 
                discount: "Up to 40% off", 
                count: "150+ deals",
                icon: <Calendar className="w-8 h-8" />,
                color: "text-blue-600"
              },
              { 
                type: "Group Discounts", 
                description: "Save when traveling together", 
                discount: "Up to 25% off", 
                count: "80+ deals",
                icon: <Users className="w-8 h-8" />,
                color: "text-green-600"
              },
              { 
                type: "Seasonal Sales", 
                description: "Best deals for peak seasons", 
                discount: "Up to 50% off", 
                count: "300+ deals",
                icon: <Star className="w-8 h-8" />,
                color: "text-purple-600"
              },
              { 
                type: "Member Exclusives", 
                description: "Special rates for members", 
                discount: "Up to 35% off", 
                count: "120+ deals",
                icon: <Shield className="w-8 h-8" />,
                color: "text-travel-gold"
              },
              { 
                type: "Package Bundles", 
                description: "Flight + hotel combos", 
                discount: "Up to 45% off", 
                count: "180+ deals",
                icon: <Percent className="w-8 h-8" />,
                color: "text-orange-600"
              }
            ].map((dealType, index) => (
              <Card key={index} className="hover:shadow-soft transition-all duration-300 cursor-pointer hover:scale-105">
                <CardContent className="p-6 text-center">
                  <div className={`mb-4 flex justify-center ${dealType.color}`}>
                    {dealType.icon}
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{dealType.type}</h3>
                  <p className="text-muted-foreground text-sm mb-3">{dealType.description}</p>
                  <p className="font-semibold text-primary mb-2">{dealType.discount}</p>
                  <p className="text-xs text-muted-foreground mb-4">{dealType.count}</p>
                  <Button variant="outline" size="sm" className="w-full">
                    View Deals
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Destinations on Sale */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Destinations on Sale</h2>
            <p className="text-muted-foreground">Popular destinations with incredible savings right now</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              {
                destination: "Bali, Indonesia",
                packagePrice: "from $699",
                flightPrice: "from $449",
                hotelPrice: "from $89/night",
                savings: "Save up to $500",
                image: "https://images.unsplash.com/photo-1466721591366-2d5fba72006d?auto=format&fit=crop&w=800&q=80"
              },
              {
                destination: "Dubai, UAE",
                packagePrice: "from $899",
                flightPrice: "from $599",
                hotelPrice: "from $129/night",
                savings: "Save up to $400",
                image: "https://images.unsplash.com/photo-1452378174528-3090a4bba7b2?auto=format&fit=crop&w=800&q=80"
              },
              {
                destination: "Santorini, Greece",
                packagePrice: "from $1,199",
                flightPrice: "from $799",
                hotelPrice: "from $199/night",
                savings: "Save up to $600",
                image: "https://images.unsplash.com/photo-1469041797191-50ace28483c3?auto=format&fit=crop&w=800&q=80"
              },
              {
                destination: "Costa Rica",
                packagePrice: "from $799",
                flightPrice: "from $399",
                hotelPrice: "from $99/night",
                savings: "Save up to $350",
                image: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=800&q=80"
              }
            ].map((destination, index) => (
              <Card key={index} className="hover:shadow-soft transition-shadow duration-300 cursor-pointer">
                <CardContent className="p-0">
                  <div className="h-40 bg-muted rounded-t-lg overflow-hidden relative">
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
                    <h3 className="font-semibold text-sm mb-3">{destination.destination}</h3>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Packages:</span>
                        <span className="font-semibold">{destination.packagePrice}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Flights:</span>
                        <span className="font-semibold">{destination.flightPrice}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Hotels:</span>
                        <span className="font-semibold">{destination.hotelPrice}</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="w-full mt-3">
                      View All Deals
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Deal Guarantee */}
      <section className="py-16 bg-gradient-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Our Deal Guarantee</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We stand behind every deal with our comprehensive protection policies
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: <Shield className="w-12 h-12 text-primary" />,
                title: "Best Price Guarantee",
                description: "Find a lower price? We'll match it + give you $25 credit"
              },
              {
                icon: <Clock className="w-12 h-12 text-primary" />,
                title: "24-Hour Hold",
                description: "Reserve your deal for 24 hours risk-free"
              },
              {
                icon: <CheckCircle className="w-12 h-12 text-primary" />,
                title: "No Hidden Fees",
                description: "The price you see is the price you pay"
              },
              {
                icon: <Percent className="w-12 h-12 text-primary" />,
                title: "Verified Savings",
                description: "All discounts verified against regular prices"
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

      {/* Customer Success Stories */}
      <section className="py-16 bg-travel-light">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Deal Success Stories</h2>
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-travel-gold text-travel-gold" />
                ))}
              </div>
              <span className="text-muted-foreground">4.9/5 from deal hunters</span>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              {
                name: "Sarah Mitchell",
                deal: "Bali Package Deal",
                savings: "$650",
                rating: 5,
                comment: "Saved $650 on our Bali honeymoon! The deal included everything we wanted and the booking was seamless."
              },
              {
                name: "David Rodriguez", 
                deal: "Last Minute Flight to Tokyo",
                savings: "$800",
                rating: 5,
                comment: "Found an incredible last-minute flight deal to Tokyo. Saved $800 and had the trip of a lifetime!"
              },
              {
                name: "Emily Johnson",
                deal: "European Package",
                savings: "$1,200",
                rating: 5,
                comment: "The European package deal was amazing! Visited 4 countries and saved over $1,200. Highly recommend!"
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
                      <p className="text-muted-foreground text-xs">{review.deal}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600 text-sm">Saved {review.savings}</p>
                    </div>
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

export default Deals;