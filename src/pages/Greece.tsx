import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plane, Hotel, MapPin, Star, Clock, Users, Utensils, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import heroSantorini from "@/assets/hero-santorini.jpg";
import greeceSantorini from "@/assets/greece-santorini.jpg";
import greeceAthens from "@/assets/greece-athens.jpg";
import greeceMykonos from "@/assets/greece-mykonos.jpg";
import greeceFood from "@/assets/greece-food.jpg";
import greeceFamilyBeach from "@/assets/greece-family-beach.jpg";
import hotelCanavesOia from "@/assets/hotel-canaves-oia-suites.jpg";
import hotelElectraMetropolis from "@/assets/hotel-electra-metropolis.jpg";
import hotelMykonosBlu from "@/assets/hotel-mykonos-blu.jpg";
import hotelDomesZeen from "@/assets/hotel-domes-zeen.jpg";

const Greece = () => {
  const navigate = useNavigate();

  const touristDestinationSchema = {
    "@context": "https://schema.org",
    "@type": "TouristDestination",
    "name": "Greece",
    "alternateName": ["Santorini", "Athens", "Mykonos", "Greek Islands"],
    "description": "Plan your dream Greece vacation with Utrippin. Discover Santorini sunsets, Athens history, Mykonos beaches and secure top hotels and flights with our official Expedia tools.",
    "image": [
      "https://utrippin.ai/src/assets/greece-santorini.jpg",
      "https://utrippin.ai/src/assets/greece-athens.jpg",
      "https://utrippin.ai/src/assets/greece-mykonos.jpg"
    ],
    "url": "https://utrippin.ai/greece"
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [{
      "@type": "Question",
      "name": "When is the best time to visit Greece?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The best time to visit Greece is from April to June and September to October, offering mild weather and fewer crowds."
      }
    },
    {
      "@type": "Question",
      "name": "What are the top destinations in Greece?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Popular destinations include Santorini for sunsets and caldera views, Athens for ancient sites, Mykonos for nightlife, and Crete for beaches and local culture."
      }
    },
    {
      "@type": "Question",
      "name": "How do I book hotels in Greece with Utrippin?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Use Utrippin's official Expedia-powered booking tools to search and secure the best hotels and flights, all tracked to ensure exclusive deals."
      }
    }]
  };

  const destinations = [
    {
      name: "Santorini",
      subtitle: "Postcard-Perfect Sunsets",
      description: "Famous for its whitewashed buildings and blue-domed churches, Santorini is a must-see. Explore the charming towns of Oia and Fira perched on volcanic cliffs, watch jaw-dropping sunsets over the Aegean Sea, and discover black-sand beaches like Kamari. Santorini is also renowned for boutique cave hotels and infinity pools with spectacular views.",
      image: greeceSantorini,
      alt: "Iconic blue-domed churches and white houses overlooking the caldera in Santorini, Greece at sunset"
    },
    {
      name: "Athens",
      subtitle: "Where Ancient Meets Modern",
      description: "Home to the legendary Acropolis, Athens is the beating heart of Greece. Walk through Plaka's narrow alleys, dine at rooftop restaurants with Parthenon views, and dive into a nightlife that pulses into the early hours. Athens blends 5,000 years of history with a youthful creative energy.",
      image: greeceAthens,
      alt: "View of the Acropolis and Parthenon ruins on a sunny day in Athens, Greece"
    },
    {
      name: "Mykonos",
      subtitle: "The Glamorous Island",
      description: "Known for luxury stays and lively beach clubs, Mykonos draws jet-setters from around the world. Relax at Psarou Beach by day, then dance under the stars at iconic spots like Cavo Paradiso.",
      image: greeceMykonos,
      alt: "Relaxing beach scene with sun loungers and turquoise water on Mykonos island, Greece"
    }
  ];

  const hotels = [
    {
      name: "Canaves Oia Suites",
      location: "Santorini",
      description: "Cave-style luxury suites with panoramic caldera views.",
      features: ["Infinity Pool", "Caldera Views", "Luxury Suites"],
      image: hotelCanavesOia,
      alt: "Luxury cave-style hotel suite in Santorini with panoramic caldera views and infinity pool"
    },
    {
      name: "Electra Metropolis",
      location: "Athens",
      description: "Elegant city hotel with rooftop pool & Acropolis views.",
      features: ["Rooftop Pool", "City Center", "Historic Views"],
      image: hotelElectraMetropolis,
      alt: "Elegant city hotel in Athens with rooftop pool and Acropolis views"
    },
    {
      name: "Mykonos Blu",
      location: "Mykonos",
      description: "Boho-chic bungalows on Psarou Beach.",
      features: ["Beach Access", "Luxury Bungalows", "Spa Services"],
      image: hotelMykonosBlu,
      alt: "Boho-chic luxury bungalows on pristine beach in Mykonos"
    },
    {
      name: "Domes Zeen",
      location: "Crete",
      description: "Secluded retreats for couples & families, blending luxury with nature.",
      features: ["Family Friendly", "Private Villas", "Natural Setting"],
      image: hotelDomesZeen,
      alt: "Secluded luxury retreat in Crete blending with natural landscape"
    }
  ];

  const foods = [
    {
      name: "Moussaka",
      description: "Layers of eggplant, minced meat & béchamel.",
      type: "Main Course"
    },
    {
      name: "Souvlaki & Gyros",
      description: "Greece's beloved grilled meats wrapped in pita.",
      type: "Street Food"
    },
    {
      name: "Greek Salad",
      description: "Feta, olives, fresh tomatoes & olive oil.",
      type: "Appetizer"
    },
    {
      name: "Baklava",
      description: "Honey-soaked pastry with nuts.",
      type: "Dessert"
    },
    {
      name: "Local Wine & Ouzo",
      description: "Sip Assyrtiko from Santorini or try anise-flavored ouzo by the sea.",
      type: "Drinks"
    }
  ];

  const handleFindFlights = () => {
    navigate('/flights?destination=Greece&airportCode=ATH');
    // Scroll to top after navigation
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  const handleBookHotels = () => {
    window.open('https://www.expedia.com/Hotel-Search?destination=Greece&rooms=1&adults=2&camref=1101l5dQSW', '_blank');
  };

  return (
    <>
      <SEOHead
        title="Greece Travel Guide 2025 | Best Places to Visit, Stay & Explore | Utrippin"
        description="Plan your dream trip to Greece with Utrippin. Discover top destinations like Santorini, Athens & Mykonos, find hotel deals, local tips & book your next adventure today."
        keywords="Greece travel, Santorini hotels, Athens tours, Greek islands, Utrippin Expedia, book Greece vacation"
        canonical="https://utrippin.ai/greece"
        ogImage="/src/assets/greece-hero.jpg"
        structuredData={[touristDestinationSchema, faqSchema]}
      />
      <Header />
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={heroSantorini}
              alt="Stunning panoramic view of Greek islands with white villages on clifftops overlooking the deep blue Aegean Sea"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/50" />
          </div>
          
          <div className="relative z-10 h-full flex items-center justify-center">
            <div className="container mx-auto px-4 text-center text-white">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Experience Greece: Your Ultimate Travel Guide
              </h1>
              <p className="text-lg md:text-xl mb-8 max-w-4xl mx-auto leading-relaxed">
                From the iconic whitewashed cliffs of Santorini to the vibrant streets of Athens, Greece is a timeless destination that blends ancient history with sun-soaked island life. Whether you're chasing romantic sunsets, exploring centuries-old ruins, or simply indulging in world-class Mediterranean cuisine, Greece offers an unforgettable experience. Let Utrippin guide you through the best places to visit, where to stay, and how to book your perfect Greek getaway.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="gap-2" onClick={handleFindFlights}>
                  <Plane className="w-4 h-4" />
                  Find Flights to Greece
                </Button>
                <Button variant="secondary" size="lg" className="gap-2 bg-white/10 backdrop-blur-sm text-white border-white/30 hover:bg-white hover:text-primary" onClick={handleBookHotels}>
                  <Hotel className="w-4 h-4" />
                  Book Your Stay
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Where to Go Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              🏝 Where to Go in Greece
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {destinations.map((destination, index) => (
                <Card key={index} className="overflow-hidden group hover:shadow-lg transition-shadow">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={destination.image}
                      alt={destination.alt}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{destination.name}</h3>
                    <p className="text-sm text-muted-foreground font-medium mb-3">{destination.subtitle}</p>
                    <p className="text-sm leading-relaxed">{destination.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-12 bg-muted/50 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Crete & Beyond</h3>
              <p className="text-sm leading-relaxed">
                Crete, Greece's largest island, mixes rugged mountain villages, world-class hiking (like the Samaria Gorge), and pristine beaches. Don't miss Chania's Venetian harbor or trying raki with locals. Other gems include Naxos for local life and Rhodes for medieval castles.
              </p>
            </div>
          </div>
        </section>

        {/* Top Hotels Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-6">
              🏨 Top Hotels in Greece
            </h2>
            <p className="text-center text-muted-foreground mb-12 max-w-3xl mx-auto">
              Whether you're looking for a cliffside suite with a private plunge pool in Santorini or a chic boutique hotel in Athens, Greece offers accommodations to match every dream.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {hotels.map((hotel, index) => (
                <Card key={index} className="overflow-hidden group hover:shadow-lg transition-shadow">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={hotel.image}
                      alt={hotel.alt}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">{hotel.name}</h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {hotel.location}
                        </p>
                      </div>
                      <Badge variant="secondary">
                        <Star className="w-3 h-3 mr-1" />
                        Luxury
                      </Badge>
                    </div>
                    <p className="text-sm mb-4">{hotel.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {hotel.features.map((feature, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-4">
                ✨ Use Utrippin's exclusive Expedia hotel search to compare stays and secure the best rates.
              </p>
              <Button size="lg" onClick={handleBookHotels} className="gap-2">
                <Hotel className="w-4 h-4" />
                Search Hotels in Greece
              </Button>
            </div>
          </div>
        </section>

        {/* Food & Drinks Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              🍽 Must-Try Greek Foods & Drinks
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <img
                  src={greeceFood}
                  alt="Traditional Greek dishes including moussaka, Greek salad with feta and olives, souvlaki, and baklava served on a rustic wooden table"
                  className="w-full h-80 object-cover rounded-lg shadow-lg"
                />
              </div>
              
              <div className="space-y-4">
                {foods.map((food, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{food.name}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{food.description}</p>
                      </div>
                      <Badge variant="secondary" className="ml-4">
                        <Utensils className="w-3 h-3 mr-1" />
                        {food.type}
                      </Badge>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Best Time to Visit */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              📅 Best Time to Visit Greece
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="p-6 text-center">
                <Calendar className="w-8 h-8 mx-auto mb-4 text-primary" />
                <h3 className="font-semibold text-lg mb-2">April - June & September - October</h3>
                <Badge className="mb-3">Ideal</Badge>
                <p className="text-sm text-muted-foreground">Pleasant weather, fewer crowds, and good hotel deals.</p>
              </Card>
              
              <Card className="p-6 text-center">
                <Calendar className="w-8 h-8 mx-auto mb-4 text-orange-500" />
                <h3 className="font-semibold text-lg mb-2">July & August</h3>
                <Badge variant="secondary" className="mb-3">Peak Season</Badge>
                <p className="text-sm text-muted-foreground">Bustling with energy but also higher prices.</p>
              </Card>
              
              <Card className="p-6 text-center">
                <Calendar className="w-8 h-8 mx-auto mb-4 text-blue-500" />
                <h3 className="font-semibold text-lg mb-2">November - March</h3>
                <Badge variant="outline" className="mb-3">Quiet Season</Badge>
                <p className="text-sm text-muted-foreground">Quieter, great for city trips like Athens.</p>
              </Card>
            </div>
          </div>
        </section>

        {/* Family Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">Perfect for Families</h2>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Greece offers incredible experiences for families, from exploring ancient ruins that bring history to life to enjoying pristine beaches perfect for children. Many hotels offer family-friendly amenities and activities.
                </p>
                <div className="flex items-center gap-4">
                  <Users className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium">Family-friendly accommodations available</span>
                </div>
              </div>
              
              <div>
                <img
                  src={greeceFamilyBeach}
                  alt="Family with kids enjoying a sandy beach on a sunny day in Greece"
                  className="w-full h-80 object-cover rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Booking CTA Section */}
        <section className="py-16 bg-primary/5">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              ✈️ Book Your Greece Adventure with Utrippin
            </h2>
            <p className="text-lg mb-8 max-w-3xl mx-auto">
              Ready to discover Greece? Use our official Utrippin hotel & flight finder powered by Expedia to plan your trip to Santorini, Athens, Mykonos and beyond. Our booking tools are tracked and optimized, so every reservation supports Utrippin's mission to bring you the best travel tools and guides.
            </p>
            
            <div className="bg-background rounded-lg p-8 max-w-2xl mx-auto mb-8">
              <h3 className="text-xl font-semibold mb-4">⭐ Why Book with Utrippin?</h3>
              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✅</span>
                  <span>Official Expedia partner for secure bookings</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✅</span>
                  <span>Price tracking & top hotel deals</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✅</span>
                  <span>Inspiring travel ideas, itineraries & local guides</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✅</span>
                  <span>Always commission-optimized to keep Utrippin growing</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={handleFindFlights} className="gap-2">
                <Plane className="w-4 h-4" />
                Find Flights to Greece
              </Button>
              <Button variant="outline" size="lg" onClick={handleBookHotels} className="gap-2">
                <Hotel className="w-4 h-4" />
                Book Hotels in Greece
              </Button>
            </div>
            
            <p className="text-sm text-muted-foreground mt-8">
              Ready to explore Greece? Start by booking your hotel or finding flights — all with exclusive deals through our official Utrippin partners.
            </p>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default Greece;