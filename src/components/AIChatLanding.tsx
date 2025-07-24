import React from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, MapPin, Clock, Users } from 'lucide-react';

interface AIChatLandingProps {
  onSignIn: () => void;
}

export default function AIChatLanding({ onSignIn }: AIChatLandingProps) {
  const featuredDestinations = [
    {
      name: "Santorini, Greece",
      duration: "5 days",
      travelers: "2-4 people",
      image: "https://images.unsplash.com/photo-1469474968028-56623f02e429",
      description: "Stunning sunsets and white-washed villages"
    },
    {
      name: "Tokyo, Japan", 
      duration: "7 days",
      travelers: "1-3 people",
      image: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21",
      description: "Modern culture meets ancient traditions"
    },
    {
      name: "Safari Adventure",
      duration: "6 days", 
      travelers: "2-6 people",
      image: "https://images.unsplash.com/photo-1466721591366-2d5fba72006d",
      description: "Wildlife encounters in natural habitat"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10 text-foreground relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-2 h-2 bg-primary/30 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-1 h-1 bg-secondary/40 rounded-full animate-ping"></div>
        <div className="absolute bottom-40 left-1/4 w-1.5 h-1.5 bg-primary/20 rounded-full animate-pulse animation-delay-1000"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-secondary/30 rounded-full animate-ping animation-delay-2000"></div>
        <Sparkles className="absolute top-16 right-16 w-4 h-4 text-primary/20 animate-pulse animation-delay-500" />
        <Sparkles className="absolute bottom-20 left-16 w-3 h-3 text-secondary/30 animate-ping animation-delay-1500" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center px-4 py-10 min-h-screen">
      {/* Greeting Header */}
      <div className="text-center mb-10 animate-fade-in">
        <div className="text-sm text-primary font-semibold flex items-center justify-center gap-2">
          Hi there! I'm Keila 
          <span className="inline-block animate-bounce animation-delay-300">👋</span>
          <Sparkles className="w-3 h-3 text-primary animate-pulse animation-delay-700" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mt-2">
          Ready to explore the world?
        </h1>
        <p className="text-muted-foreground mt-2">Let's plan your dream trip with AI ✨</p>
      </div>

      {/* Prompt Example */}
      <div className="bg-card rounded-xl p-4 max-w-lg text-center mb-6 shadow-md border">
        <p className="text-sm text-muted-foreground italic">
          Plan a 6-day adventure trip to Barcelona for 3 friends in October. Include hiking in Montserrat, a bike tour of the city, and a day for exploring Gothic Quarter. Budget-friendly options preferred.
        </p>
      </div>

      {/* Trip Style Buttons */}
      <div className="flex flex-wrap gap-2 justify-center mb-6">
        {['Create a new trip', 'Get inspired', 'Inspire me where to go', 'Solo trip', 'Partner', 'Family'].map((label, i) => (
          <Button key={i} variant="outline" className="text-sm">
            {label}
          </Button>
        ))}
      </div>

      {/* CTA Button */}
      <Button className="bg-primary hover:bg-primary/90 px-6 py-2 text-primary-foreground rounded-full text-lg shadow-lg mb-10">
        Let's Go ➝
      </Button>

      {/* Locked Input Placeholder */}
      <div className="bg-card p-6 rounded-xl max-w-xl w-full text-center border">
        <p className="text-muted-foreground text-sm">🔒 Please sign in to plan your dream trip with Keila</p>
        <Button onClick={onSignIn} className="mt-4 bg-secondary hover:bg-secondary/90 text-secondary-foreground px-4 py-2 rounded-full">
          Sign In
        </Button>
      </div>

      {/* Sample preview card */}
      <div className="mt-12 text-center text-sm text-muted-foreground">
        Want to see what Keila can do? Check out a sample 5-day trip to Cancun 👉 <a href="#" className="text-primary underline hover:text-primary/80">View Example</a>
      </div>
      </div>

      {/* Featured Destinations Section */}
      <div className="relative z-10 px-4 py-16 bg-card/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Featured Destinations</h2>
            <p className="text-muted-foreground">Popular trips planned by Keila</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredDestinations.map((destination, index) => (
              <div key={index} className="bg-card rounded-xl overflow-hidden shadow-lg border hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group">
                <div className="aspect-video overflow-hidden">
                  <img 
                    src={destination.image} 
                    alt={destination.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{destination.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{destination.description}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {destination.duration}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {destination.travelers}
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-3 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <MapPin className="w-3 h-3 mr-1" />
                    Explore Trip
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}