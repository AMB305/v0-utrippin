import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Heart, X, MapPin, Calendar, Users, Star, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import travelBuddy1 from "@/assets/travel-buddy-1.jpg";
import travelBuddy2 from "@/assets/travel-buddy-2.jpg";
import travelBuddy3 from "@/assets/travel-buddy-3.jpg";
import travelBuddy4 from "@/assets/travel-buddy-4.jpg";
import travelBuddy5 from "@/assets/travel-buddy-5.jpg";

const travelProfiles = [
  {
    id: 1,
    name: "Sarah & Friends",
    age: 25,
    type: "Group",
    location: "Bangkok, Thailand",
    destination: "Southeast Asia Tour",
    dates: "March 15-30, 2024",
    members: 4,
    rating: 4.9,
    image: travelBuddy1,
    bio: "Adventure-loving group looking for fellow travelers to explore temples, street food, and beaches across Thailand, Vietnam, and Cambodia!",
    interests: ["Street Food", "Temples", "Beaches", "Photography"],
    tripStyle: "Adventure & Culture"
  },
  {
    id: 2,
    name: "Emma",
    age: 28,
    type: "Solo",
    location: "Berlin, Germany",
    destination: "European Backpacking",
    dates: "April 10-25, 2024",
    members: 1,
    rating: 4.8,
    image: travelBuddy2,
    bio: "Solo female traveler exploring ancient ruins and hidden gems. Love history, architecture, and meeting locals. Looking for travel companions!",
    interests: ["History", "Architecture", "Local Culture", "Museums"],
    tripStyle: "Cultural Exploration"
  },
  {
    id: 3,
    name: "Jake",
    age: 24,
    type: "Solo",
    location: "Denver, Colorado",
    destination: "Patagonia Hiking",
    dates: "May 5-20, 2024",
    members: 1,
    rating: 4.7,
    image: travelBuddy3,
    bio: "Mountain enthusiast seeking hiking buddies for Patagonia adventure. Experienced in multi-day treks and wilderness camping.",
    interests: ["Hiking", "Camping", "Photography", "Wildlife"],
    tripStyle: "Adventure & Nature"
  },
  {
    id: 4,
    name: "Travel Squad",
    age: 26,
    type: "Group",
    location: "Sydney, Australia",
    destination: "Japan Cultural Tour",
    dates: "Cherry Blossom Season",
    members: 3,
    rating: 4.9,
    image: travelBuddy4,
    bio: "Friendly group planning an amazing Japan trip during cherry blossom season. We love anime, traditional culture, and amazing food!",
    interests: ["Anime", "Traditional Culture", "Food", "Festivals"],
    tripStyle: "Cultural Immersion"
  },
  {
    id: 5,
    name: "Alex & Jordan",
    age: 30,
    type: "Couple",
    location: "Toronto, Canada",
    destination: "Iceland Adventure",
    dates: "June 1-14, 2024",
    members: 2,
    rating: 4.8,
    image: travelBuddy5,
    bio: "Adventurous couple looking for other nature lovers to explore Iceland's waterfalls, glaciers, and Northern Lights together!",
    interests: ["Nature", "Photography", "Northern Lights", "Hot Springs"],
    tripStyle: "Nature & Adventure"
  }
];

const TravelBuddy = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const currentProfile = travelProfiles[currentIndex];

  const handleSwipe = (direction: 'left' | 'right') => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setSwipeDirection(direction);
    
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % travelProfiles.length);
      setIsAnimating(false);
      setSwipeDirection(null);
    }, 300);
  };

  const handleLike = () => handleSwipe('right');
  const handlePass = () => handleSwipe('left');

  if (!currentProfile) return null;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8 max-w-md">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" asChild>
            <Link to="/" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
          </Button>
          <h1 className="text-xl font-bold text-foreground">Travel Buddy</h1>
          <div className="w-16" /> {/* Spacer */}
        </div>

        <div className="relative">
          <div
            ref={cardRef}
            className={`relative bg-card rounded-2xl overflow-hidden shadow-large transition-all duration-300 ${
              isAnimating && swipeDirection === 'left' ? 'animate-swipe-left' : ''
            } ${
              isAnimating && swipeDirection === 'right' ? 'animate-swipe-right' : ''
            } ${!isAnimating ? 'animate-scale-in' : ''}`}
          >
            <div className="relative aspect-[3/4]">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${currentProfile.image})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                <div className="flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium">
                  <Star className="w-4 h-4 fill-current text-travel-gold" />
                  <span>{currentProfile.rating}</span>
                </div>
                <div className="px-3 py-1 bg-primary/90 backdrop-blur-sm rounded-full text-white text-sm font-medium">
                  {currentProfile.type}
                </div>
              </div>

              <div className="absolute bottom-6 left-6 right-6 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-2xl font-bold">{currentProfile.name}</h2>
                  <span className="text-lg">{currentProfile.age}</span>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{currentProfile.destination}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">{currentProfile.dates}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span className="text-sm">{currentProfile.members} {currentProfile.members === 1 ? 'Traveler' : 'Travelers'}</span>
                  </div>
                </div>

                <p className="text-white/90 text-sm mb-4 leading-relaxed">
                  {currentProfile.bio}
                </p>

                <div className="mb-4">
                  <div className="text-xs text-white/70 mb-2">INTERESTS</div>
                  <div className="flex flex-wrap gap-2">
                    {currentProfile.interests.map((interest) => (
                      <span
                        key={interest}
                        className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs text-white"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-xs text-white/70 mb-1">TRIP STYLE</div>
                  <div className="text-sm font-medium text-travel-gold">
                    {currentProfile.tripStyle}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-6 mt-8">
            <Button
              variant="outline"
              size="icon"
              className="w-16 h-16 rounded-full border-2 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground shadow-medium"
              onClick={handlePass}
              disabled={isAnimating}
            >
              <X className="w-8 h-8" />
            </Button>
            
            <Button
              variant="outline"
              size="icon"
              className="w-12 h-12 rounded-full border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              disabled={isAnimating}
            >
              <MessageCircle className="w-5 h-5" />
            </Button>
            
            <Button
              variant="outline"
              size="icon"
              className="w-16 h-16 rounded-full border-2 border-travel-gold text-travel-gold hover:bg-travel-gold hover:text-travel-navy shadow-medium"
              onClick={handleLike}
              disabled={isAnimating}
            >
              <Heart className="w-8 h-8" />
            </Button>
          </div>

          <div className="flex justify-center mt-6 gap-2">
            {travelProfiles.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="mt-8 p-4 bg-gradient-card rounded-xl">
          <div className="text-center">
            <h3 className="font-semibold text-foreground mb-2">
              Swipe right to like, left to pass
            </h3>
            <p className="text-muted-foreground text-sm">
              Find your perfect travel companion and start planning amazing adventures together!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TravelBuddy;
