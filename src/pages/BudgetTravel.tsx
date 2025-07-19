import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plane, Hotel, MapPin, Star, Clock, Users, Camera, Utensils, DollarSign, Wallet, CreditCard, PiggyBank } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import budgetTravel from "@/assets/budget-travel.jpg";

const BudgetTravel = () => {
  const navigate = useNavigate();

  const budgetStrategies = [
    {
      title: "Travel During Off-Peak Season",
      description: "Save 40-60% on flights and hotels by avoiding peak tourist seasons. Research shoulder seasons for the best balance of weather and savings.",
      savings: "40-60% savings",
      icon: DollarSign,
      category: "Timing"
    },
    {
      title: "Use Budget Airlines Strategically",
      description: "Book budget carriers for short flights, but factor in baggage fees. Sometimes full-service airlines are cheaper when you include extras.",
      savings: "30-50% on flights",
      icon: Plane,
      category: "Flights"
    },
    {
      title: "Stay in Hostels & Guesthouses",
      description: "Hostels aren't just for young backpackers. Many offer private rooms and are great for meeting fellow travelers.",
      savings: "50-70% on accommodation",
      icon: Hotel,
      category: "Accommodation"
    },
    {
      title: "Cook Your Own Meals",
      description: "Stay in places with kitchens and shop at local markets. Even cooking just breakfast can save significantly.",
      savings: "40-60% on food",
      icon: Utensils,
      category: "Food"
    },
    {
      title: "Use Public Transportation",
      description: "Research day passes and tourist cards. Many cities offer unlimited transport plus museum entries for great value.",
      savings: "70-80% vs taxis",
      icon: MapPin,
      category: "Transport"
    },
    {
      title: "Travel Slowly",
      description: "Staying longer in fewer places reduces transport costs and often qualifies for weekly/monthly accommodation discounts.",
      savings: "20-40% overall",
      icon: Clock,
      category: "Planning"
    }
  ];

  const moneyTips = [
    {
      tip: "Use travel credit cards with no foreign fees",
      impact: "Save 2-3% on all purchases abroad"
    },
    {
      tip: "Withdraw cash from ATMs, avoid exchange bureaus",
      impact: "Better exchange rates, lower fees"
    },
    {
      tip: "Book flights on Tuesday/Wednesday",
      impact: "Airlines often release deals mid-week"
    },
    {
      tip: "Clear browser cookies when searching flights",
      impact: "Avoid dynamic pricing increases"
    },
    {
      tip: "Use apps like Rome2Rio for transport comparison",
      impact: "Find cheapest routes between cities"
    },
    {
      tip: "Look for free walking tours (tip-based)",
      impact: "Learn about the city for almost free"
    }
  ];

  const budgetDestinations = [
    {
      country: "Thailand",
      dailyBudget: "$25-35",
      highlights: "Street food, temples, beaches",
      bestFor: "First-time budget travelers"
    },
    {
      country: "Vietnam",
      dailyBudget: "$20-30",
      highlights: "Pho, Ha Long Bay, motorbikes",
      bestFor: "Food lovers"
    },
    {
      country: "Guatemala",
      dailyBudget: "$25-40",
      highlights: "Volcanoes, Mayan ruins, lakes",
      bestFor: "Adventure seekers"
    },
    {
      country: "Eastern Europe",
      dailyBudget: "$30-50",
      highlights: "History, architecture, nightlife",
      bestFor: "Culture enthusiasts"
    },
    {
      country: "India",
      dailyBudget: "$15-25",
      highlights: "Diverse culture, incredible food",
      bestFor: "Cultural immersion"
    },
    {
      country: "Bolivia",
      dailyBudget: "$20-35",
      highlights: "Salt flats, mountains, indigenous culture",
      bestFor: "Unique landscapes"
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
        title="How to Travel the World on a Budget: 15 Money-Saving Strategies | UTrippin"
        description="Learn proven strategies to explore amazing destinations without breaking the bank. Complete guide to budget travel, cheap flights, and affordable accommodations."
        keywords="budget travel, cheap flights, budget destinations, travel on a budget, backpacking"
        canonical="https://utrippin.ai/budget-travel"
      />
      <Header />
      
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative h-[60vh] min-h-[400px] overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={budgetTravel}
              alt="Budget traveler with backpack overlooking a beautiful mountain landscape"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60" />
          </div>
          
          <div className="relative z-10 h-full flex items-center justify-center">
            <div className="container mx-auto px-4 text-center text-white">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Travel the World on a Budget
              </h1>
              <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto leading-relaxed">
                Discover how to explore amazing destinations without breaking the bank. From finding cheap flights to scoring budget accommodations, these proven strategies will help you travel more for less.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="gap-2" onClick={handleFindFlights}>
                  <Plane className="w-4 h-4" />
                  Find Cheap Flights
                </Button>
                <Button variant="secondary" size="lg" className="gap-2" onClick={handleBookHotels}>
                  <Hotel className="w-4 h-4" />
                  Budget Accommodations
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Money-Saving Strategies */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              💰 15 Money-Saving Travel Strategies
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {budgetStrategies.map((strategy, index) => {
                const IconComponent = strategy.icon;
                return (
                  <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <IconComponent className="w-6 h-6 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-lg">{strategy.title}</h3>
                          <Badge variant="outline" className="text-xs ml-2">
                            {strategy.category}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                          {strategy.description}
                        </p>
                        <Badge className="bg-green-100 text-green-800 text-xs">
                          {strategy.savings}
                        </Badge>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Quick Money Tips */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              🏦 Smart Money Management Tips
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
              {moneyTips.map((tip, index) => (
                <Card key={index} className="p-6 flex items-start gap-4 hover:shadow-lg transition-shadow">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <CreditCard className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">{tip.tip}</h3>
                    <p className="text-sm text-muted-foreground">{tip.impact}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Budget Destinations */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              🌍 Top Budget-Friendly Destinations
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {budgetDestinations.map((destination, index) => (
                <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl">{destination.country}</CardTitle>
                      <Badge className="bg-green-100 text-green-800">
                        {destination.dailyBudget}/day
                      </Badge>
                    </div>
                    <CardDescription>{destination.highlights}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-orange-500" />
                      <span className="text-sm font-medium">Best for: {destination.bestFor}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Budget Planning Guide */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              📊 Daily Budget Breakdown Guide
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              <Card className="p-6 text-center">
                <PiggyBank className="w-12 h-12 mx-auto mb-4 text-green-600" />
                <h3 className="text-xl font-semibold mb-4">Backpacker Budget</h3>
                <div className="text-3xl font-bold text-green-600 mb-4">$25-40/day</div>
                <ul className="text-sm space-y-2">
                  <li>• Hostel dorms</li>
                  <li>• Street food & cooking</li>
                  <li>• Public transport</li>
                  <li>• Free activities</li>
                </ul>
              </Card>

              <Card className="p-6 text-center border-2 border-primary">
                <Wallet className="w-12 h-12 mx-auto mb-4 text-blue-600" />
                <h3 className="text-xl font-semibold mb-4">Mid-Range Budget</h3>
                <div className="text-3xl font-bold text-blue-600 mb-4">$50-100/day</div>
                <ul className="text-sm space-y-2">
                  <li>• Private hostel rooms</li>
                  <li>• Mix of restaurants</li>
                  <li>• Some taxis/tours</li>
                  <li>• Paid attractions</li>
                </ul>
              </Card>

              <Card className="p-6 text-center">
                <CreditCard className="w-12 h-12 mx-auto mb-4 text-purple-600" />
                <h3 className="text-xl font-semibold mb-4">Comfort Budget</h3>
                <div className="text-3xl font-bold text-purple-600 mb-4">$100+/day</div>
                <ul className="text-sm space-y-2">
                  <li>• Hotels & nice B&Bs</li>
                  <li>• Restaurant meals</li>
                  <li>• Private transport</li>
                  <li>• Premium experiences</li>
                </ul>
              </Card>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Start Your Budget Adventure Today</h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto">
              Ready to explore the world without emptying your wallet? Use UTrippin to find the best deals on flights and budget-friendly accommodations.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="secondary" size="lg" onClick={handleFindFlights} className="gap-2">
                <Plane className="w-4 h-4" />
                Find Cheap Flights
              </Button>
              <Button variant="outline" size="lg" onClick={handleBookHotels} className="gap-2 border-white text-white hover:bg-white hover:text-primary">
                <Hotel className="w-4 h-4" />
                Budget Hotels & Hostels
              </Button>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
};

export default BudgetTravel;