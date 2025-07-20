
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Users, Heart, Star, Calendar, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { VecteezyImage } from "@/components/VecteezyImage";

const TravelBuddySection = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-lovable-mint/20 via-white to-lovable-coral/10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-lovable-warm-gray">
            Find Your Perfect Travel Buddy
          </h2>
          <p className="text-xl text-lovable-warm-gray max-w-2xl mx-auto">
            Connect with like-minded travelers and create unforgettable memories together
          </p>
        </div>

        {/* Featured Travel Buddies */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {[
            {
              name: "Sarah Chen",
              age: 28,
              location: "San Francisco",
              interests: ["Photography", "Hiking", "Local Cuisine"],
              rating: 4.9,
              trips: 12,
              image: "young woman photographer exploring beautiful destinations"
            },
            {
              name: "Marcus Johnson",
              age: 32,
              location: "New York",
              interests: ["Adventure", "Culture", "Nightlife"],
              rating: 4.8,
              trips: 18,
              image: "young man adventurer exploring cultural destinations"
            },
            {
              name: "Elena Rodriguez",
              age: 26,
              location: "Barcelona",
              interests: ["Art", "Architecture", "Food"],
              rating: 5.0,
              trips: 15,
              image: "young woman artist exploring architectural destinations"
            }
          ].map((buddy, index) => (
            <Card key={index} className="floating-card group hover:scale-105 transition-all duration-300">
              <CardContent className="p-6">
                <div className="relative mb-4">
                  <VecteezyImage 
                    destination={`${buddy.image} travel photography`}
                    description={buddy.image}
                    tags={['travel', 'photography', 'adventure', 'culture']}
                    alt={`${buddy.name} - Travel Buddy`}
                    className="w-20 h-20 rounded-full object-cover mx-auto border-4 border-white shadow-lg"
                  />
                  <div className="absolute -top-2 -right-2 bg-lovable-coral text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                    {buddy.trips}
                  </div>
                </div>
                
                <div className="text-center mb-4">
                  <h3 className="font-bold text-lg text-lovable-warm-gray">{buddy.name}</h3>
                  <p className="text-lovable-warm-gray/70 flex items-center justify-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {buddy.location} • {buddy.age}
                  </p>
                  <div className="flex items-center justify-center gap-1 mt-2">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{buddy.rating}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex flex-wrap gap-2 justify-center">
                    {buddy.interests.map((interest, i) => (
                      <span key={i} className="px-3 py-1 bg-lovable-mint/20 text-lovable-warm-gray/80 rounded-full text-sm">
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>

                <Button variant="travel-outline" className="w-full">
                  Connect
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* How It Works */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 mb-12 border border-white/20 shadow-soft">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4 text-lovable-warm-gray">How does it work</h3>
            <p className="text-lovable-warm-gray/70 max-w-2xl mx-auto">
              Connect with fellow travelers, share experiences, and create unforgettable memories together through our simple process
            </p>
          </div>
          
          <div className="flex items-center justify-center">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 max-w-5xl w-full">
              {[
                {
                  icon: Users,
                  step: "STEP 1",
                  title: "Create Your Profile",
                  description: "Share your travel style, interests, and upcoming trips to help us find your perfect match"
                },
                {
                  icon: Heart,
                  step: "STEP 2", 
                  title: "Find Matches",
                  description: "Our AI matches you with compatible travel buddies based on your preferences and travel goals"
                },
                {
                  icon: MessageCircle,
                  step: "STEP 3",
                  title: "Connect & Chat",
                  description: "Start conversations with potential travel buddies and get to know each other better"
                },
                {
                  icon: Calendar,
                  step: "STEP 4",
                  title: "Plan & Travel",
                  description: "Plan your adventure together and embark on unforgettable journeys with your new travel buddy"
                }
              ].map((step, index) => (
                <div key={index} className="flex flex-col items-center relative">
                  <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mb-6 shadow-lg">
                    <step.icon className="w-10 h-10 text-white" />
                  </div>
                  
                  <div className="text-center">
                    <div className="text-sm font-bold text-lovable-warm-gray/60 mb-2 tracking-wider">{step.step}</div>
                    <h4 className="font-bold text-lg mb-3 text-lovable-warm-gray">{step.title}</h4>
                    <p className="text-sm text-lovable-warm-gray/70 leading-relaxed">{step.description}</p>
                  </div>
                  
                  {/* Arrow between steps */}
                  {index < 3 && (
                    <div className="hidden md:block absolute top-10 -right-6 text-lovable-warm-gray/40">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-4 text-lovable-warm-gray">Ready to Find Your Travel Buddy?</h3>
          <p className="text-lovable-warm-gray mb-6">Join thousands of travelers already making connections</p>
          <div className="flex gap-4 justify-center">
            <Link to="/travel-buddies">
              <Button variant="hero" size="lg">
                Start Matching
              </Button>
            </Link>
            <Link to="/auth">
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TravelBuddySection;
