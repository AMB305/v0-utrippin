import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plane, Hotel, MapPin, Star, Clock, Users, Camera, Utensils, Baby, Heart, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import familyFriendly from "@/assets/family-friendly.jpg";

const FamilyTravel = () => {
  const navigate = useNavigate();

  const familyTips = [
    {
      title: "Choose Family-Friendly Destinations",
      description: "Look for places with good healthcare, safe environments, and plenty of activities for kids. Countries like Japan, Singapore, and parts of Europe are excellent for families.",
      icon: MapPin,
      category: "Planning"
    },
    {
      title: "Book Direct Flights When Possible",
      description: "Minimize travel stress by booking non-stop flights. If layovers are necessary, allow extra time for bathroom breaks and entertainment.",
      icon: Plane,
      category: "Flights"
    },
    {
      title: "Pack Smart for Kids",
      description: "Bring entertainment, snacks, and comfort items. Pack a first-aid kit and any necessary medications. Consider packing cubes to keep things organized.",
      icon: Baby,
      category: "Packing"
    },
    {
      title: "Choose Accommodations Wisely",
      description: "Look for hotels with family rooms, pools, and kid-friendly amenities. Consider vacation rentals for kitchen access and more space.",
      icon: Hotel,
      category: "Accommodation"
    },
    {
      title: "Plan Kid-Friendly Activities",
      description: "Research parks, museums with interactive exhibits, and outdoor activities. Many cities offer special family passes for attractions.",
      icon: Users,
      category: "Activities"
    },
    {
      title: "Maintain Routines",
      description: "Try to stick to regular meal and sleep times when possible. This helps prevent meltdowns and keeps everyone happier.",
      icon: Clock,
      category: "Wellness"
    }
  ];

  const ageSpecificTips = [
    {
      age: "Babies (0-2 years)",
      tips: [
        "Bring enough diapers and formula for delays",
        "Request bassinet seats on long flights",
        "Pack familiar foods and comfort items",
        "Consider travel insurance for medical needs"
      ],
      icon: Baby
    },
    {
      age: "Toddlers (2-5 years)",
      tips: [
        "Bring tablets with downloaded content",
        "Pack plenty of snacks and small toys",
        "Use a travel stroller for easy navigation",
        "Plan for frequent bathroom breaks"
      ],
      icon: Heart
    },
    {
      age: "School Age (6-12 years)",
      tips: [
        "Involve them in trip planning",
        "Give them their own camera or journal",
        "Plan educational but fun activities",
        "Allow some downtime for rest"
      ],
      icon: Camera
    },
    {
      age: "Teenagers (13+ years)",
      tips: [
        "Let them help choose destinations",
        "Ensure WiFi access for staying connected",
        "Mix adventure with relaxation",
        "Give them some independence within safe limits"
      ],
      icon: Users
    }
  ];

  const familyDestinations = [
    {
      destination: "Orlando, Florida",
      highlights: "Disney World, Universal Studios, family resorts",
      bestFor: "Theme park lovers",
      ageRange: "All ages",
      tips: "Book park tickets in advance, use mobile ordering for meals"
    },
    {
      destination: "Tokyo, Japan",
      highlights: "Clean, safe, amazing food, kid-friendly culture",
      bestFor: "Cultural immersion",
      ageRange: "3+ years",
      tips: "Get a JR Pass, visit during cherry blossom season"
    },
    {
      destination: "Costa Rica",
      highlights: "Wildlife, beaches, adventure activities",
      bestFor: "Nature lovers",
      ageRange: "6+ years",
      tips: "Book eco-lodges, bring insect repellent"
    },
    {
      destination: "London, England",
      highlights: "Museums, parks, royal attractions",
      bestFor: "History buffs",
      ageRange: "All ages",
      tips: "Use public transport, many museums are free"
    },
    {
      destination: "Bali, Indonesia",
      highlights: "Beautiful beaches, family resorts, culture",
      bestFor: "Beach relaxation",
      ageRange: "All ages",
      tips: "Stay in Sanur or Nusa Dua for families"
    },
    {
      destination: "Iceland",
      highlights: "Natural wonders, safe environment, unique experiences",
      bestFor: "Adventure seekers",
      ageRange: "8+ years",
      tips: "Rent a car, pack warm clothes year-round"
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
        title="Family Travel Made Easy: Tips for Traveling with Kids | UTrippin"
        description="Make family vacations stress-free with our comprehensive guide to traveling with children. Tips for flights, accommodations, and kid-friendly destinations."
        keywords="family travel, traveling with kids, family vacation, kid-friendly destinations"
        canonical="https://utrippin.ai/family-travel"
      />
      <Header />
      
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative h-[60vh] min-h-[400px] overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={familyFriendly}
              alt="Happy family with children enjoying vacation together on a beautiful beach"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60" />
          </div>
          
          <div className="relative z-10 h-full flex items-center justify-center">
            <div className="container mx-auto px-4 text-center text-white">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Family Travel Made Easy
              </h1>
              <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto leading-relaxed">
                Create unforgettable memories with your loved ones. Our comprehensive guide helps you plan stress-free family vacations with tips for every age group and destination.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="gap-2" onClick={handleFindFlights}>
                  <Plane className="w-4 h-4" />
                  Find Family Flights
                </Button>
                <Button variant="secondary" size="lg" className="gap-2" onClick={handleBookHotels}>
                  <Hotel className="w-4 h-4" />
                  Family Hotels
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Essential Family Travel Tips */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              👨‍👩‍👧‍👦 Essential Family Travel Tips
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {familyTips.map((tip, index) => {
                const IconComponent = tip.icon;
                return (
                  <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <IconComponent className="w-6 h-6 text-blue-600" />
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

        {/* Age-Specific Tips */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              🎯 Age-Specific Travel Tips
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {ageSpecificTips.map((ageGroup, index) => {
                const IconComponent = ageGroup.icon;
                return (
                  <Card key={index} className="p-6">
                    <CardHeader className="pb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <IconComponent className="w-6 h-6 text-purple-600" />
                        </div>
                        <CardTitle className="text-xl">{ageGroup.age}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <ul className="space-y-2">
                        {ageGroup.tips.map((tip, tipIndex) => (
                          <li key={tipIndex} className="flex items-start gap-2 text-sm">
                            <div className="w-1.5 h-1.5 bg-purple-600 rounded-full mt-2 flex-shrink-0" />
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Family-Friendly Destinations */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              🌍 Top Family-Friendly Destinations
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {familyDestinations.map((destination, index) => (
                <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl">{destination.destination}</CardTitle>
                      <Badge variant="secondary">{destination.ageRange}</Badge>
                    </div>
                    <CardDescription>{destination.highlights}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-orange-500" />
                        <span className="text-sm font-medium">Best for: {destination.bestFor}</span>
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

        {/* Packing Checklist */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              🎒 Family Travel Packing Checklist
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-500" />
                  Essentials & Safety
                </h3>
                <ul className="space-y-2 text-sm">
                  <li>• Passports and travel documents</li>
                  <li>• Travel insurance information</li>
                  <li>• Emergency contact list</li>
                  <li>• First aid kit and medications</li>
                  <li>• Copies of important documents</li>
                  <li>• Child identification (wristbands/cards)</li>
                </ul>
              </Card>

              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-red-500" />
                  Comfort & Entertainment
                </h3>
                <ul className="space-y-2 text-sm">
                  <li>• Favorite stuffed animals/blankets</li>
                  <li>• Tablets with downloaded content</li>
                  <li>• Headphones (child-safe volume)</li>
                  <li>• Books and travel games</li>
                  <li>• Small new toys for surprises</li>
                  <li>• Snacks and familiar foods</li>
                </ul>
              </Card>

              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Baby className="w-5 h-5 text-blue-500" />
                  Baby/Toddler Specific
                </h3>
                <ul className="space-y-2 text-sm">
                  <li>• Diapers and wipes (extra supply)</li>
                  <li>• Formula and baby food</li>
                  <li>• Bottles and sippy cups</li>
                  <li>• Portable changing pad</li>
                  <li>• Lightweight stroller</li>
                  <li>• Baby carrier for crowded areas</li>
                </ul>
              </Card>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Plan Your Family Adventure?</h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto">
              Create lasting memories with your family. Use UTrippin to find family-friendly flights and accommodations that cater to travelers of all ages.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="secondary" size="lg" onClick={handleFindFlights} className="gap-2">
                <Plane className="w-4 h-4" />
                Search Family Flights
              </Button>
              <Button variant="outline" size="lg" onClick={handleBookHotels} className="gap-2 border-white text-white hover:bg-white hover:text-primary">
                <Hotel className="w-4 h-4" />
                Find Family Hotels
              </Button>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
};

export default FamilyTravel;