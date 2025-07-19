import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plane, Hotel, MapPin, Star, Clock, Users, Camera, Utensils, CheckCircle, AlertCircle, DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import travelBuddy1 from "@/assets/travel-buddy-1.jpg";

const TravelTips = () => {
  const navigate = useNavigate();

  const essentialTips = [
    {
      title: "Documentation & Visas",
      description: "Always check visa requirements 3+ months before travel. Ensure your passport is valid for at least 6 months beyond your return date.",
      icon: CheckCircle,
      category: "Before You Go"
    },
    {
      title: "Travel Insurance",
      description: "Don't skip travel insurance. It covers medical emergencies, trip cancellations, and lost luggage. Compare policies to find the best coverage.",
      icon: AlertCircle,
      category: "Safety"
    },
    {
      title: "Notify Your Bank",
      description: "Tell your bank about your travel plans to avoid card blocks. Consider getting a travel-friendly credit card with no foreign transaction fees.",
      icon: DollarSign,
      category: "Money"
    },
    {
      title: "Pack Smart",
      description: "Pack light with versatile clothing. Roll clothes instead of folding to save space. Always pack essentials in your carry-on.",
      icon: CheckCircle,
      category: "Packing"
    },
    {
      title: "Research Local Customs",
      description: "Learn basic phrases, tipping etiquette, and cultural norms. This shows respect and can enhance your travel experience.",
      icon: Users,
      category: "Culture"
    },
    {
      title: "Stay Connected",
      description: "Download offline maps, translation apps, and check international roaming rates. Consider buying a local SIM card for longer stays.",
      icon: Camera,
      category: "Technology"
    }
  ];

  const packingEssentials = [
    "Valid passport & travel documents",
    "Travel insurance papers",
    "Emergency contact information",
    "Copies of important documents (stored separately)",
    "Prescription medications in original bottles",
    "Universal power adapter",
    "Portable charger/power bank",
    "First aid kit basics",
    "Comfortable walking shoes",
    "Weather-appropriate clothing"
  ];

  const budgetTips = [
    {
      tip: "Book flights on Tuesday-Thursday",
      savings: "Up to 20% cheaper"
    },
    {
      tip: "Use incognito mode when searching flights",
      savings: "Avoid price tracking"
    },
    {
      tip: "Stay in hostels or Airbnb",
      savings: "50-70% on accommodation"
    },
    {
      tip: "Eat like a local",
      savings: "Authentic & affordable meals"
    },
    {
      tip: "Use public transportation",
      savings: "Major savings on city travel"
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
        title="Essential Travel Tips for First-Time International Travelers | UTrippin"
        description="Master international travel with expert tips on documentation, packing, budgeting, and cultural preparation. Your complete guide to stress-free travel."
        keywords="travel tips, international travel, first time travel, travel guide, travel advice"
        canonical="https://utrippin.ai/travel-tips"
      />
      <Header />
      
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative h-[60vh] min-h-[400px] overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={travelBuddy1}
              alt="Traveler with backpack exploring a scenic destination"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60" />
          </div>
          
          <div className="relative z-10 h-full flex items-center justify-center">
            <div className="container mx-auto px-4 text-center text-white">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Essential Travel Tips for International Adventures
              </h1>
              <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto leading-relaxed">
                Master the art of international travel with our comprehensive guide. From documentation to cultural etiquette, we'll help you navigate your first international trip with confidence.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="gap-2" onClick={handleFindFlights}>
                  <Plane className="w-4 h-4" />
                  Find International Flights
                </Button>
                <Button variant="secondary" size="lg" className="gap-2" onClick={handleBookHotels}>
                  <Hotel className="w-4 h-4" />
                  Book Your Stay
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Essential Tips Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              🌍 Essential Travel Tips
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {essentialTips.map((tip, index) => {
                const IconComponent = tip.icon;
                return (
                  <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <IconComponent className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-lg">{tip.title}</h3>
                          <Badge variant="outline" className="text-xs">
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

        {/* Packing Essentials */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              🎒 International Travel Packing Checklist
            </h2>
            
            <div className="max-w-4xl mx-auto">
              <Card className="p-8">
                <h3 className="text-xl font-semibold mb-6 text-center">Never Leave Home Without These</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {packingEssentials.map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Budget Tips */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              💰 Money-Saving Travel Hacks
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {budgetTips.map((tip, index) => (
                <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow">
                  <DollarSign className="w-8 h-8 mx-auto mb-4 text-green-600" />
                  <h3 className="font-semibold mb-2">{tip.tip}</h3>
                  <Badge className="bg-green-100 text-green-800">
                    {tip.savings}
                  </Badge>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Safety Tips */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              🛡️ Safety & Security Tips
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-orange-500" />
                  Before You Travel
                </h3>
                <ul className="space-y-2 text-sm">
                  <li>• Register with your embassy if traveling to high-risk areas</li>
                  <li>• Share your itinerary with family/friends</li>
                  <li>• Research common scams in your destination</li>
                  <li>• Get necessary vaccinations</li>
                  <li>• Check current political/weather conditions</li>
                </ul>
              </Card>

              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  While Traveling
                </h3>
                <ul className="space-y-2 text-sm">
                  <li>• Keep copies of documents in separate bags</li>
                  <li>• Use hotel safes for valuables</li>
                  <li>• Stay aware of your surroundings</li>
                  <li>• Don't flash expensive items</li>
                  <li>• Trust your instincts about people/situations</li>
                </ul>
              </Card>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Plan Your First International Trip?</h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto">
              Use UTrippin to find the best flights and accommodations for your adventure. Start planning your dream international getaway today.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="secondary" size="lg" onClick={handleFindFlights} className="gap-2">
                <Plane className="w-4 h-4" />
                Search International Flights
              </Button>
              <Button variant="outline" size="lg" onClick={handleBookHotels} className="gap-2 border-white text-white hover:bg-white hover:text-primary">
                <Hotel className="w-4 h-4" />
                Find Hotels Worldwide
              </Button>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
};

export default TravelTips;