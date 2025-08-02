import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plane, Hotel, MapPin, Star, Clock, Users, Camera, Utensils, Shield, Heart, Compass } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import soloTravel from "@/assets/solo-travel.jpg";

const SoloTravel = () => {
  const navigate = useNavigate();

  const soloTips = [
    {
      title: "Research Your Destination Thoroughly",
      description: "Learn about local customs, safety concerns, and cultural norms. Join Facebook groups and forums for destination-specific advice from other solo travelers.",
      icon: Compass,
      category: "Planning"
    },
    {
      title: "Share Your Itinerary",
      description: "Always let someone know your travel plans. Share your accommodation details and check in regularly with family or friends back home.",
      icon: Shield,
      category: "Safety"
    },
    {
      title: "Stay in Social Accommodations",
      description: "Choose hostels, guesthouses, or hotels with common areas where you can meet other travelers. Many offer social events and group activities.",
      icon: Users,
      category: "Social"
    },
    {
      title: "Trust Your Instincts",
      description: "If something feels wrong, remove yourself from the situation. Your gut feeling is often right, especially in unfamiliar environments.",
      icon: Heart,
      category: "Safety"
    },
    {
      title: "Learn Basic Local Phrases",
      description: "Even basic greetings and 'thank you' in the local language can open doors and show respect for the culture you're visiting.",
      icon: MapPin,
      category: "Culture"
    },
    {
      title: "Document Your Journey",
      description: "Keep a travel journal or blog to reflect on your experiences. Photography is also a great way to remember your solo adventures.",
      icon: Camera,
      category: "Memory"
    }
  ];

  const safetyTips = [
    {
      category: "Accommodation Safety",
      tips: [
        "Read reviews from other solo travelers",
        "Choose well-lit areas near public transport",
        "Keep valuables in hotel safes",
        "Request rooms on higher floors"
      ]
    },
    {
      category: "Daily Safety Practices",
      tips: [
        "Avoid displaying expensive jewelry or electronics",
        "Keep copies of documents separate from originals",
        "Use ATMs inside banks or hotels when possible",
        "Don't reveal that you're traveling alone to strangers"
      ]
    },
    {
      category: "Communication & Check-ins",
      tips: [
        "Download offline maps and translation apps",
        "Keep emergency contacts easily accessible",
        "Check in with someone daily",
        "Know the local emergency numbers"
      ]
    }
  ];

  const soloDestinations = [
    {
      destination: "Japan",
      safety: "Excellent",
      highlights: "Safe, efficient transport, respectful culture",
      bestFor: "First-time solo travelers",
      difficulty: "Easy",
      tips: "Get a JR Pass, download Google Translate"
    },
    {
      destination: "New Zealand",
      safety: "Excellent",
      highlights: "Adventure activities, friendly locals, English-speaking",
      bestFor: "Adventure seekers",
      difficulty: "Easy",
      tips: "Rent a car for ultimate freedom"
    },
    {
      destination: "Portugal",
      safety: "Very Good",
      highlights: "Affordable, beautiful beaches, historic cities",
      bestFor: "Culture and relaxation",
      difficulty: "Easy",
      tips: "Try the pastéis de nata in every city"
    },
    {
      destination: "Thailand",
      safety: "Good",
      highlights: "Backpacker-friendly, amazing food, low cost",
      bestFor: "Budget travelers",
      difficulty: "Moderate",
      tips: "Start in touristy areas, then explore"
    },
    {
      destination: "Iceland",
      safety: "Excellent",
      highlights: "Natural wonders, safe environment, unique experiences",
      bestFor: "Nature lovers",
      difficulty: "Easy",
      tips: "Rent a car, pack warm clothes year-round"
    },
    {
      destination: "South Korea",
      safety: "Excellent",
      highlights: "Modern cities, rich culture, great food",
      bestFor: "Culture enthusiasts",
      difficulty: "Easy",
      tips: "Download Papago for translation"
    }
  ];

  const meetingPeople = [
    {
      method: "Stay in Hostels",
      description: "Common areas, shared kitchens, and organized events make it easy to meet fellow travelers.",
      icon: Hotel
    },
    {
      method: "Join Walking Tours",
      description: "Free walking tours are great for meeting people and learning about the destination.",
      icon: MapPin
    },
    {
      method: "Use Travel Apps",
      description: "Apps like Meetup, Travel Ladies, and Backpackr help connect solo travelers.",
      icon: Users
    },
    {
      method: "Take Classes",
      description: "Cooking classes, language lessons, or workshops are perfect for socializing.",
      icon: Utensils
    },
    {
      method: "Visit Co-working Spaces",
      description: "If you're a digital nomad, co-working spaces are ideal for meeting like-minded people.",
      icon: Camera
    },
    {
      method: "Eat at Bar Seating",
      description: "Sitting at the bar in restaurants often leads to conversations with locals and travelers.",
      icon: Heart
    }
  ];

  const handleFindFlights = () => {
    navigate('/flights');
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  const handleBookHotels = () => {
    navigate('/hotels');
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  return (
    <>
      <SEOHead
        title="Solo Travel Guide: Your Journey to Independence and Discovery | UTrippin"
        description="Embrace the freedom of solo travel with our comprehensive guide. Safety tips, best destinations, and advice for making the most of your solo adventures."
        keywords="solo travel, solo travel tips, safe solo destinations, solo travel guide"
        canonical="https://utrippin.ai/solo-travel"
      />
      <Header />
      
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative h-[60vh] min-h-[400px] overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={soloTravel}
              alt="Solo traveler with backpack standing on a mountain overlooking a stunning landscape"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60" />
          </div>
          
          <div className="relative z-10 h-full flex items-center justify-center">
            <div className="container mx-auto px-4 text-center text-white">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Solo Travel: Your Journey to Independence
              </h1>
              <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto leading-relaxed">
                Discover the world on your own terms. Solo travel offers unparalleled freedom, self-discovery, and the chance to create your perfect adventure. Learn how to travel safely and confidently alone.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="gap-2" onClick={handleFindFlights}>
                  <Plane className="w-4 h-4" />
                  Find Solo Flights
                </Button>
                <Button variant="secondary" size="lg" className="gap-2" onClick={handleBookHotels}>
                  <Hotel className="w-4 h-4" />
                  Solo-Friendly Hotels
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Essential Solo Travel Tips */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              🎒 Essential Solo Travel Tips
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {soloTips.map((tip, index) => {
                const IconComponent = tip.icon;
                return (
                  <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <IconComponent className="w-6 h-6 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-lg">{tip.title}</h3>
                          <Badge variant="outline" className="text-xs ml-2">
                            {tip.category}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {tip.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Safety Guidelines */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              🛡️ Solo Travel Safety Guidelines
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              {safetyTips.map((category, index) => (
                <Card key={index} className="p-6">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Shield className="w-5 h-5 text-orange-500" />
                      {category.category}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <ul className="space-y-2">
                      {category.tips.map((tip, tipIndex) => (
                        <li key={tipIndex} className="flex items-start gap-2 text-sm">
                          <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Best Solo Destinations */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              🌍 Best Solo Travel Destinations
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {soloDestinations.map((destination, index) => (
                <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl">{destination.destination}</CardTitle>
                      <Badge 
                        className={
                          destination.safety === "Excellent" ? "bg-green-100 text-green-800" :
                          destination.safety === "Very Good" ? "bg-blue-100 text-blue-800" :
                          "bg-yellow-100 text-yellow-800"
                        }
                      >
                        {destination.safety}
                      </Badge>
                    </div>
                    <CardDescription>{destination.highlights}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">Best for:</span>
                        <span>{destination.bestFor}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">Difficulty:</span>
                        <Badge variant="outline">{destination.difficulty}</Badge>
                      </div>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-xs font-medium text-muted-foreground mb-1">Pro Tip:</p>
                      <p className="text-sm">{destination.tips}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Meeting People While Solo */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              🤝 How to Meet People While Traveling Solo
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {meetingPeople.map((method, index) => {
                const IconComponent = method.icon;
                return (
                  <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow">
                    <div className="p-3 bg-blue-100 rounded-full w-fit mx-auto mb-4">
                      <IconComponent className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{method.method}</h3>
                    <p className="text-sm text-muted-foreground">{method.description}</p>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Benefits of Solo Travel */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              ✨ Why Choose Solo Travel?
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              <Card className="p-6 text-center">
                <Heart className="w-10 h-10 mx-auto mb-4 text-red-500" />
                <h3 className="font-semibold text-lg mb-2">Self-Discovery</h3>
                <p className="text-sm text-muted-foreground">Learn about yourself, your preferences, and build confidence.</p>
              </Card>

              <Card className="p-6 text-center">
                <Compass className="w-10 h-10 mx-auto mb-4 text-blue-500" />
                <h3 className="font-semibold text-lg mb-2">Complete Freedom</h3>
                <p className="text-sm text-muted-foreground">Go where you want, when you want, at your own pace.</p>
              </Card>

              <Card className="p-6 text-center">
                <Users className="w-10 h-10 mx-auto mb-4 text-green-500" />
                <h3 className="font-semibold text-lg mb-2">Meet New People</h3>
                <p className="text-sm text-muted-foreground">Solo travelers are more approachable and open to connections.</p>
              </Card>

              <Card className="p-6 text-center">
                <Star className="w-10 h-10 mx-auto mb-4 text-purple-500" />
                <h3 className="font-semibold text-lg mb-2">Personal Growth</h3>
                <p className="text-sm text-muted-foreground">Build resilience, independence, and problem-solving skills.</p>
              </Card>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Embark on Your Solo Adventure?</h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto">
              Take the leap into solo travel and discover the freedom of exploring the world on your own terms. Start planning your independent journey today.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="secondary" size="lg" onClick={handleFindFlights} className="gap-2">
                <Plane className="w-4 h-4" />
                Book Your Solo Flight
              </Button>
              <Button variant="outline" size="lg" onClick={handleBookHotels} className="gap-2 border-white text-white hover:bg-white hover:text-primary">
                <Hotel className="w-4 h-4" />
                Find Solo-Friendly Stays
              </Button>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
};

export default SoloTravel;
