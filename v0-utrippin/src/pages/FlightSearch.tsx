import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import EnhancedFlightSearchBar from "@/components/EnhancedFlightSearchBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Plane, Clock, Shield, Users, CheckCircle, Star, MessageCircle } from "lucide-react";

const FlightSearch = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSearch = async (searchData: any) => {
    setLoading(true);
    // Simulate search delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Navigate to results with search parameters
    const searchParams = new URLSearchParams({
      origin: JSON.stringify(searchData.origin),
      destination: JSON.stringify(searchData.destination),
      departureDate: searchData.departureDate.toISOString(),
      returnDate: searchData.returnDate?.toISOString() || '',
      passengers: JSON.stringify(searchData.passengers),
      tripType: searchData.tripType,
      cabinClass: searchData.cabinClass
    });
    
    navigate(`/flights/results?${searchParams.toString()}`);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero py-4">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1920&h=1080&fit=crop&crop=center" 
            alt="Beautiful airplane in sky"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-overlay"></div>
        </div>
        
        <div className="relative container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <Badge className="mb-3 bg-travel-gold/20 text-travel-gold border-travel-gold">
              ✈️ Find Your Perfect Flight
            </Badge>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 animate-fade-in">
              Discover Amazing Flight Deals
            </h1>
            <p className="text-base text-white/90 mb-4 animate-slide-up">
              Search millions of flights from 500+ airlines. Best prices guaranteed.
            </p>
            
            {/* Enhanced Search Bar */}
            <div className="animate-scale-in">
              <EnhancedFlightSearchBar onSearch={handleSearch} loading={loading} />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-12 bg-travel-light">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">How It Works</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Book your perfect flight in just three simple steps
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="text-center group">
              <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-smooth">
                <Plane className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-4">1. Search</h3>
              <p className="text-muted-foreground">Enter your travel details and let us find the best flights for you</p>
            </div>
            
            <div className="text-center group">
              <div className="bg-accent/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-accent/20 transition-smooth">
                <Clock className="w-10 h-10 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-4">2. Compare</h3>
              <p className="text-muted-foreground">Compare prices, times, and airlines to find your perfect match</p>
            </div>
            
            <div className="text-center group">
              <div className="bg-travel-gold/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-travel-gold/20 transition-smooth">
                <Shield className="w-10 h-10 text-travel-gold" />
              </div>
              <h3 className="text-xl font-semibold mb-4">3. Book</h3>
              <p className="text-muted-foreground">Secure booking with 24/7 customer support and flexible options</p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Popular Destinations</h2>
            <p className="text-muted-foreground text-lg">Explore the world's most loved travel destinations</p>
          </div>
          
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[
              { city: "New York", image: "photo-1496442226666-8d4d0e62e6e9", price: "From $299" },
              { city: "London", image: "photo-1513635269975-59663e0ac1ad", price: "From $499" },
              { city: "Tokyo", image: "photo-1540959733332-eab4deabeeaf", price: "From $899" },
              { city: "Paris", image: "photo-1502602898536-47ad22581b52", price: "From $599" },
              { city: "Sydney", image: "photo-1506905925346-21bda4d32df4", price: "From $1,299" },
              { city: "Dubai", image: "photo-1512453979798-5ea266f8880c", price: "From $799" },
              { city: "Rome", image: "photo-1515542622106-78bda8ba0e5b", price: "From $649" },
              { city: "Barcelona", image: "photo-1539037116277-4db20889f2d4", price: "From $549" }
            ].map((destination, index) => (
              <Card key={index} className="group cursor-pointer hover:shadow-medium transition-all duration-300 overflow-hidden">
                <div className="relative">
                  <img 
                    src={`https://images.unsplash.com/${destination.image}?w=400&h=240&fit=crop&crop=center`}
                    alt={destination.city}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute bottom-4 left-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="font-semibold">{destination.price}</p>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    {destination.city}
                  </h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Explore Stays in Popular Destinations */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-foreground mb-2">Explore stays in popular destinations</h2>
          <p className="text-muted-foreground mb-8">Average prices based on current calendar month</p>
          
          {/* Category Tabs */}
          <div className="flex gap-8 mb-8 border-b">
            <button className="pb-3 px-1 border-b-2 border-primary text-primary font-medium">
              Beach
            </button>
            <button className="pb-3 px-1 text-muted-foreground hover:text-foreground transition-colors">
              Culture
            </button>
            <button className="pb-3 px-1 text-muted-foreground hover:text-foreground transition-colors">
              Ski
            </button>
            <button className="pb-3 px-1 text-muted-foreground hover:text-foreground transition-colors">
              Family
            </button>
            <button className="pb-3 px-1 text-muted-foreground hover:text-foreground transition-colors">
              Wellness and Relaxation
            </button>
          </div>

          {/* Destinations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 relative">
            {[
              {
                name: 'St. John',
                location: 'U.S. Virgin Islands',
                price: '$459',
                image: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=300&h=200&fit=crop&crop=center'
              },
              {
                name: 'San Juan',
                location: 'Puerto Rico',
                price: '$185',
                image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=300&h=200&fit=crop&crop=center'
              },
              {
                name: 'Christiansted',
                location: 'St. Croix Island, U.S. Virgin Islands',
                price: '$384',
                image: 'https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?w=300&h=200&fit=crop&crop=center'
              },
              {
                name: 'Punta Cana',
                location: 'La Altagracia, Dominican Republic',
                price: '$297',
                image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=300&h=200&fit=crop&crop=center'
              },
              {
                name: 'Roatan',
                location: 'Bay Islands, Honduras',
                price: '$178',
                image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=300&h=200&fit=crop&crop=center'
              }
            ].map((destination, index) => (
              <div key={index} className="group cursor-pointer">
                <div className="relative overflow-hidden rounded-lg mb-3">
                  <img 
                    src={destination.image} 
                    alt={destination.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground text-lg">{destination.name}</h3>
                  <p className="text-muted-foreground text-sm mb-2">{destination.location}</p>
                  <div>
                    <span className="text-2xl font-bold text-foreground">{destination.price}</span>
                    <span className="text-muted-foreground text-sm ml-1">avg. nightly price</span>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Navigation Arrow */}
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 -mr-6">
              <button className="w-12 h-12 rounded-full bg-card border shadow-sm flex items-center justify-center hover:bg-accent transition-colors">
                <svg className="w-5 h-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">What Our Customers Say</h2>
            <p className="text-muted-foreground text-lg">Over 1 million happy travelers and counting</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                name: "Sarah Johnson",
                location: "New York",
                rating: 5,
                comment: "Found the perfect flight to Paris at an amazing price. The booking process was so smooth!"
              },
              {
                name: "Mike Chen",
                location: "San Francisco", 
                rating: 5,
                comment: "Customer service was excellent when I needed to change my flight. Highly recommend!"
              },
              {
                name: "Emma Wilson",
                location: "London",
                rating: 5,
                comment: "Best flight booking experience I've ever had. Great prices and easy to use!"
              }
            ].map((testimonial, index) => (
              <Card key={index} className="hover:shadow-medium transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-travel-gold text-travel-gold" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 italic">"{testimonial.comment}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{testimonial.name}</p>
                      <p className="text-muted-foreground text-xs">{testimonial.location}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-travel-light">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground text-lg">Get answers to common questions about flight booking</p>
          </div>
          
          <div className="max-w-3xl mx-auto space-y-6">
            {[
              {
                question: "How far in advance should I book my flight?",
                answer: "For the best prices, we recommend booking 6-8 weeks in advance for domestic flights and 8-12 weeks for international flights."
              },
              {
                question: "Can I cancel or change my booking?",
                answer: "Yes, most bookings can be changed or cancelled. Fees may apply depending on the airline's policy and fare type."
              },
              {
                question: "Is it safe to book flights online?",
                answer: "Absolutely! We use industry-standard encryption to protect your personal and payment information."
              },
              {
                question: "Do you offer travel insurance?",
                answer: "Yes, we offer comprehensive travel insurance options during the booking process to protect your trip."
              }
            ].map((faq, index) => (
              <Card key={index} className="hover:shadow-soft transition-shadow duration-300">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-foreground mb-3 flex items-center gap-3">
                    <MessageCircle className="w-5 h-5 text-primary" />
                    {faq.question}
                  </h3>
                  <p className="text-muted-foreground pl-8">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-hero text-center relative overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1920&h=600&fit=crop&crop=center"
            alt="Travel destination"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-overlay"></div>
        </div>
        
        <div className="relative container mx-auto px-4">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Start Your Journey?</h2>
          <p className="text-white/90 text-xl mb-8 max-w-2xl mx-auto">
            Join millions of travelers who trust us to find their perfect flights
          </p>
          <Button 
            size="lg" 
            className="bg-travel-gold hover:bg-travel-gold/90 text-travel-navy font-semibold px-8 py-4 text-lg shadow-large"
            onClick={() => document.querySelector('.enhanced-flight-search')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Search Flights Now
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FlightSearch;
