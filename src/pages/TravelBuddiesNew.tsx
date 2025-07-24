import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { 
  Search, MapPin, Heart, Filter, Share2, Settings, X, Star, 
  Zap, ArrowLeft, MessageCircle, User, Menu, Bot, Building, 
  Plane, Briefcase, Crown
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import SignUpWall from "@/components/SignUpWall";
import TravelBuddyMap from "@/components/custom/TravelBuddyMap";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

// Trip interface for the new layout
interface Trip {
  id: string;
  title: string;
  location: string;
  dates: string;
  description: string;
  author: {
    name: string;
    photo: string;
    verified: boolean;
  };
  likes: number;
  shares: number;
}

// Mock data for trips (matching the reference design)
const mockTrips: Trip[] = [
  {
    id: '1',
    title: 'Birthday trip',
    location: 'SAINT THOMAS',
    dates: 'Oct 7, 2026 - Oct 11, 2026 (flexible)',
    description: 'Would like to travel the islands',
    author: {
      name: 'Sarah',
      photo: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400',
      verified: false
    },
    likes: 12,
    shares: 3
  },
  {
    id: '2',
    title: 'Exploring',
    location: 'SAN JUAN',
    dates: 'Aug 7, 2025 - Aug 10, 2025 (flexible)',
    description: 'Hi there looking to meet new people to with in san juan puerto rico. Im going on a solo trip as of',
    author: {
      name: 'Mike',
      photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
      verified: false
    },
    likes: 8,
    shares: 5
  },
  {
    id: '3',
    title: 'A week in puerto rico!',
    location: 'SAN JUAN',
    dates: 'Mar 22, 2026 - Mar 29, 2026 (flexible)',
    description: 'Hello, I am 29 looking for a travel partner for PR in March 2026 :)',
    author: {
      name: 'Maria',
      photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
      verified: false
    },
    likes: 15,
    shares: 7
  },
  {
    id: '4',
    title: 'New year\'s eve cruise',
    location: 'PHILLIPSBURG',
    dates: 'Dec 27, 2026 - Jan 3, 2027',
    description: 'Looking for travel companions for an amazing NYE cruise experience',
    author: {
      name: 'David',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      verified: true
    },
    likes: 22,
    shares: 12
  },
  {
    id: '5',
    title: 'Punta cana solo trip',
    location: 'PUNTA CANA',
    dates: 'Jul 27, 2025 - Jul 30, 2025',
    description: 'Solo adventure in beautiful Punta Cana, looking for like-minded travelers',
    author: {
      name: 'Lisa',
      photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
      verified: false
    },
    likes: 9,
    shares: 4
  },
  {
    id: '6',
    title: 'Vacation',
    location: 'PUNTA CANA',
    dates: 'Aug 17, 2025 - Aug 23, 2025',
    description: 'Relaxing vacation in tropical paradise, open to meeting new people',
    author: {
      name: 'Alex',
      photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400',
      verified: false
    },
    likes: 18,
    shares: 6
  }
];

const TravelBuddiesNew = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'trips' | 'locals' | 'nearby' | 'blog'>('trips');
  const [searchQuery, setSearchQuery] = useState('U.S. Virgin Islands');
  const [currentBuddyIndex, setCurrentBuddyIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const touchEndRef = useRef<{ x: number; y: number } | null>(null);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // If user is not logged in, show sign up wall
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <SignUpWall
          isOpen={true}
          onClose={() => {}}
          triggerSource="travel-buddies"
        />
      </div>
    );
  }

  const handleSwipeLeft = () => {
    if (currentBuddyIndex < mockTrips.length - 1) {
      setCurrentBuddyIndex(currentBuddyIndex + 1);
    } else {
      setCurrentBuddyIndex(0); // Loop back to start
    }
  };

  const handleSwipeRight = () => {
    if (currentBuddyIndex < mockTrips.length - 1) {
      setCurrentBuddyIndex(currentBuddyIndex + 1);
    } else {
      setCurrentBuddyIndex(0); // Loop back to start
    }
  };

  const handleSwipeUp = () => {
    // Skip current profile without liking
    if (currentBuddyIndex < mockTrips.length - 1) {
      setCurrentBuddyIndex(currentBuddyIndex + 1);
    } else {
      setCurrentBuddyIndex(0); // Loop back to start
    }
  };

  const handleSwipeBack = () => {
    if (currentBuddyIndex > 0) {
      setCurrentBuddyIndex(currentBuddyIndex - 1);
    } else {
      setCurrentBuddyIndex(mockTrips.length - 1); // Go to last profile
    }
  };

  // Touch handlers for swipe gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    
    touchEndRef.current = {
      x: e.changedTouches[0].clientX,
      y: e.changedTouches[0].clientY
    };

    const deltaX = touchEndRef.current.x - touchStartRef.current.x;
    const deltaY = touchEndRef.current.y - touchStartRef.current.y;
    const threshold = 50;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // Horizontal swipe
      if (deltaX > threshold) {
        handleSwipeBack(); // Swipe right to go back
      } else if (deltaX < -threshold) {
        handleSwipeLeft(); // Swipe left to pass
      }
    } else {
      // Vertical swipe
      if (deltaY < -threshold) {
        handleSwipeUp(); // Swipe up to dismiss
      }
    }

    touchStartRef.current = null;
    touchEndRef.current = null;
  };

  const handleConnect = (tripId: string) => {
    console.log('Connecting to trip:', tripId);
  };

  const handleLike = (tripId: string) => {
    console.log('Liking trip:', tripId);
  };

  const handleShare = (tripId: string) => {
    console.log('Sharing trip:', tripId);
  };

  // Mobile Layout - Tinder-style interface
  if (isMobile) {
    const currentTrip = mockTrips[currentBuddyIndex];
    if (!currentTrip) {
      // Reset to first profile if we've gone through all
      setCurrentBuddyIndex(0);
      return null;
    }

    return (
      <div className="min-h-screen bg-black text-white relative overflow-hidden">
        {/* Hamburger Menu */}
        <div className="absolute top-4 left-4 z-20">
          <Sheet>
            <SheetTrigger asChild>
              <button className="w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center">
                <Menu className="w-5 h-5 text-white" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] bg-black border-gray-800 text-white">
              <SheetHeader>
                <SheetTitle className="text-white">Navigation</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col space-y-4 pt-4">
                <Button variant="ghost" className="justify-start text-white hover:bg-gray-800" onClick={() => window.location.href = "/travel-buddies"}>
                  <Heart className="w-4 h-4 mr-2" />
                  Discover
                </Button>
                <Button variant="ghost" className="justify-start text-white hover:bg-gray-800" onClick={() => window.location.href = "/ai-travel"}>
                  <Bot className="w-4 h-4 mr-2" />
                  Keila AI
                </Button>
                <Button variant="ghost" className="justify-start text-white hover:bg-gray-800" onClick={() => window.location.href = "/hotels"}>
                  <Building className="w-4 h-4 mr-2" />
                  Stays
                </Button>
                <Button variant="ghost" className="justify-start text-white hover:bg-gray-800" onClick={() => window.location.href = "/flights"}>
                  <Plane className="w-4 h-4 mr-2" />
                  Flights
                </Button>
                <Button variant="ghost" className="justify-start text-white hover:bg-gray-800" onClick={() => window.location.href = "/my-trips"}>
                  <Briefcase className="w-4 h-4 mr-2" />
                  My Trips
                </Button>
                <Button variant="ghost" className="justify-start text-white hover:bg-gray-800" onClick={() => window.location.href = "/premium"}>
                  <Crown className="w-4 h-4 mr-2" />
                  Get Unlimited
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between p-4 z-10 relative">
          <div className="flex items-center gap-2 ml-12">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">U</span>
            </div>
            <span className="text-white font-semibold">utrippin</span>
          </div>
          <div className="flex items-center gap-3">
            <Settings className="w-6 h-6 text-white" />
            <div className="w-6 h-6 text-white">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 6h10l-2 6-2-2-2 2L7 6z"/>
                <path d="M4 10h3l2 6 2-2 2 2 2-6h3l-4 10H8l-4-10z"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Match Percentage */}
        <div className="absolute top-16 right-4 z-10">
          <div className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
            {Math.floor(Math.random() * 20) + 80}% Match
          </div>
        </div>

        {/* Profile Card with Touch Handlers */}
        <div 
          className="absolute inset-4 top-20 bottom-32 rounded-2xl overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div 
            className="w-full h-full bg-cover bg-center relative"
            style={{
              backgroundImage: `linear-gradient(to bottom, transparent 60%, rgba(0,0,0,0.8) 100%), url('${currentTrip.author.photo}')`
            }}
          >
            {/* Profile Info */}
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <h2 className="text-4xl font-bold mb-2">{currentTrip.author.name}, {Math.floor(Math.random() * 15) + 22}</h2>
              <p className="text-gray-200 mb-3 leading-relaxed">
                {currentTrip.description}
              </p>
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-4 h-4" />
                <span className="text-gray-300">{currentTrip.location}</span>
              </div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-gray-300 text-sm">{currentTrip.dates}</span>
              </div>
              <div className="flex gap-2 flex-wrap">
                <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm">Travel</span>
                <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm">Adventure</span>
                <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm">Explorer</span>
                {currentTrip.author.verified && (
                  <span className="bg-green-500/30 backdrop-blur-sm px-3 py-1 rounded-full text-sm flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    Verified
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="absolute bottom-20 left-0 right-0 flex justify-center items-center gap-4 px-8">
          <button 
            onClick={handleSwipeLeft}
            className="w-14 h-14 bg-gray-800/80 backdrop-blur-sm rounded-full flex items-center justify-center border border-gray-600 hover:bg-gray-700/80 transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-yellow-500" />
          </button>
          <button 
            onClick={handleSwipeLeft}
            className="w-14 h-14 bg-gray-800/80 backdrop-blur-sm rounded-full flex items-center justify-center border border-gray-600 hover:bg-gray-700/80 transition-colors"
          >
            <X className="w-6 h-6 text-red-500" />
          </button>
          <button 
            onClick={handleSwipeRight}
            className="w-14 h-14 bg-gray-800/80 backdrop-blur-sm rounded-full flex items-center justify-center border border-gray-600 hover:bg-gray-700/80 transition-colors"
          >
            <Star className="w-6 h-6 text-blue-400" />
          </button>
          <button 
            onClick={() => {
              handleConnect(currentTrip.id);
              handleSwipeRight();
            }}
            className="w-14 h-14 bg-gray-800/80 backdrop-blur-sm rounded-full flex items-center justify-center border border-gray-600 hover:bg-gray-700/80 transition-colors"
          >
            <Heart className="w-6 h-6 text-green-500" />
          </button>
          <button 
            onClick={handleSwipeRight}
            className="w-14 h-14 bg-gray-800/80 backdrop-blur-sm rounded-full flex items-center justify-center border border-gray-600 hover:bg-gray-700/80 transition-colors"
          >
            <Zap className="w-6 h-6 text-purple-500" />
          </button>
        </div>

        {/* Profile Counter */}
        <div className="absolute bottom-36 left-1/2 transform -translate-x-1/2 z-10">
          <div className="flex gap-1">
            {mockTrips.map((_, index) => (
              <div 
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === currentBuddyIndex ? 'bg-white' : 'bg-white/30'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="absolute bottom-0 left-0 right-0 bg-black/90 backdrop-blur-sm border-t border-gray-800">
          <div className="flex justify-around items-center py-3">
            <button className="p-3">
              <div className="w-6 h-6 text-red-500">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
                </svg>
              </div>
            </button>
            <button className="p-3">
              <div className="w-6 h-6 text-gray-400">
                <div className="grid grid-cols-2 gap-1">
                  <div className="w-2 h-2 bg-current rounded-full"></div>
                  <div className="w-2 h-2 bg-current rounded-full"></div>
                  <div className="w-2 h-2 bg-current rounded-full"></div>
                  <div className="w-2 h-2 bg-current rounded-full"></div>
                </div>
              </div>
            </button>
            <button className="p-3">
              <Star className="w-6 h-6 text-gray-400" />
            </button>
            <button className="p-3">
              <MessageCircle className="w-6 h-6 text-gray-400" />
            </button>
            <button className="p-3">
              <User className="w-6 h-6 text-gray-400" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Desktop layout matching the reference image
  const DesktopLayout = () => (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              
              {/* Search Bar */}
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search destinations..."
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
            
            {/* Navigation Tabs */}
            <div className="flex items-center gap-6 mt-4">
              <Button
                variant={activeTab === 'trips' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab('trips')}
                className={activeTab === 'trips' ? 'bg-red-100 text-red-700' : ''}
              >
                <MapPin className="w-4 h-4 mr-2" />
                Trips
              </Button>
              <Button
                variant={activeTab === 'locals' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab('locals')}
                className={activeTab === 'locals' ? 'bg-red-100 text-red-700' : ''}
              >
                <Heart className="w-4 h-4 mr-2" />
                Locals
              </Button>
              <Button
                variant={activeTab === 'nearby' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab('nearby')}
                className={activeTab === 'nearby' ? 'bg-red-100 text-red-700' : ''}
              >
                <Search className="w-4 h-4 mr-2" />
                Nearby
              </Button>
              <Button
                variant={activeTab === 'blog' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab('blog')}
                className={activeTab === 'blog' ? 'bg-red-100 text-red-700' : ''}
              >
                Blog
              </Button>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
              <Button className="bg-green-600 hover:bg-green-700 text-white" size="sm">
                Get Verified
              </Button>
            </div>
          </header>

          {/* Main Content Area */}
          <div className="flex-1 flex">
            {/* Content Area */}
            <div className="flex-1 p-6">
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  Trips to {searchQuery}
                  <Button className="ml-4 bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-1">
                    Start Your Trip
                  </Button>
                </h1>
              </div>

              {/* Trip Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockTrips.map((trip) => (
                  <Card key={trip.id} className="bg-white shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-0">
                      <div className="relative">
                        <img 
                          src={trip.author.photo} 
                          alt={trip.title}
                          className="w-full h-48 object-cover rounded-t-lg"
                        />
                        <div className="absolute top-3 right-3 flex gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="bg-white/80 hover:bg-white/90 p-2"
                            onClick={() => handleLike(trip.id)}
                          >
                            <Heart className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="bg-white/80 hover:bg-white/90 p-2"
                            onClick={() => handleShare(trip.id)}
                          >
                            <Share2 className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        {/* Badge with location */}
                        <div className="absolute bottom-3 left-3">
                          <Badge className="bg-red-600 text-white">
                            <MapPin className="w-3 h-3 mr-1" />
                            {trip.location}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="p-4">
                        <h3 className="font-semibold text-lg mb-2">{trip.title}</h3>
                        <p className="text-sm text-gray-600 mb-3">{trip.dates}</p>
                        <p className="text-sm text-gray-700 mb-4 line-clamp-3">{trip.description}</p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <img 
                              src={trip.author.photo} 
                              alt={trip.author.name}
                              className="w-6 h-6 rounded-full"
                            />
                            <span className="text-sm font-medium">{trip.author.name}</span>
                            {trip.author.verified && (
                              <Badge className="bg-green-600 text-white text-xs px-2 py-0">
                                Verified
                              </Badge>
                            )}
                          </div>
                          <Button 
                            className="bg-red-600 hover:bg-red-700 text-white"
                            size="sm"
                            onClick={() => handleConnect(trip.id)}
                          >
                            Connect
                          </Button>
                        </div>
                        
                        <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
                          <Button variant="ghost" size="sm" className="text-gray-500">
                            Connect
                          </Button>
                          <Button variant="ghost" size="sm" className="text-gray-500">
                            Details
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Map Sidebar */}
            <div className="w-96 bg-white border-l border-gray-200">
              <TravelBuddyMap 
                buddies={mockTrips.map((trip, index) => ({
                  id: trip.id,
                  name: trip.author.name,
                  avatarUrl: trip.author.photo,
                  coords: { 
                    lat: 18.3358 + (index * 0.1), 
                    lng: -64.8963 + (index * 0.1) 
                  },
                  isOnline: index % 2 === 0
                }))}
                onPinClick={(tripId) => console.log('Pin clicked:', tripId)}
              />
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );

  return <DesktopLayout />;
};

export default TravelBuddiesNew;