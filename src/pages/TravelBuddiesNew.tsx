import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Search, MapPin, Heart, MessageCircle, Star, Filter, Settings,
  ArrowLeft, MoreHorizontal, Send, Camera, Plus, X, Check
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { ChatContainer } from "@/components/custom/ChatContainer";
import SignUpWall from "@/components/SignUpWall";
import TravelBuddyCard from "@/components/custom/TravelBuddyCard";

// Travel buddy profile interface
interface TravelBuddy {
  id: string;
  name: string;
  age: number;
  location: string;
  bio: string;
  interests: string[];
  travel_style: string;
  photo_url: string;
  looking_for: 'buddy' | 'group' | 'solo';
  upcoming_trips: string[];
  distance?: string;
  compatibility?: number;
}

// Mock data for travel buddies
const mockTravelBuddies: TravelBuddy[] = [
  {
    id: '1',
    name: 'Alex',
    age: 25,
    location: 'San Francisco, CA',
    bio: 'Adventure seeker looking for travel companions to explore Southeast Asia. Love hiking, street food, and meeting locals.',
    interests: ['Hiking', 'Photography', 'Food', 'Culture'],
    travel_style: 'Backpacker',
    photo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    looking_for: 'buddy',
    upcoming_trips: ['Thailand', 'Vietnam', 'Cambodia'],
    distance: '2 miles',
    compatibility: 92
  },
  {
    id: '2',
    name: 'Maria',
    age: 28,
    location: 'New York, NY',
    bio: 'Digital nomad planning a 3-month European tour. Looking for fellow remote workers to share experiences.',
    interests: ['Art', 'Museums', 'Coffee', 'Architecture'],
    travel_style: 'Cultural Explorer',
    photo_url: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400',
    looking_for: 'group',
    upcoming_trips: ['Barcelona', 'Amsterdam', 'Berlin'],
    distance: '5 miles',
    compatibility: 88
  },
  {
    id: '3',
    name: 'James',
    age: 32,
    location: 'London, UK',
    bio: 'Experienced solo traveler open to sharing adventures. Love off-the-beaten-path destinations.',
    interests: ['Adventure', 'Nature', 'Wildlife', 'Photography'],
    travel_style: 'Adventure Seeker',
    photo_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
    looking_for: 'buddy',
    upcoming_trips: ['Patagonia', 'Iceland', 'Nepal'],
    distance: '12 miles',
    compatibility: 85
  }
];

const TravelBuddiesNew = () => {
  const { user } = useAuth();
  const [activeView, setActiveView] = useState<'discover' | 'matches' | 'chat' | 'profile'>('discover');
  const [selectedBuddy, setSelectedBuddy] = useState<TravelBuddy | null>(null);
  const [currentBuddyIndex, setCurrentBuddyIndex] = useState(0);
  const [showSignupWall, setShowSignupWall] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    looking_for: 'all',
    age_range: [18, 65],
    distance: 50,
    travel_style: 'all'
  });

  const currentBuddy = mockTravelBuddies[currentBuddyIndex];

  const handleLike = () => {
    if (!user) {
      setShowSignupWall(true);
      return;
    }
    // TODO: Implement like logic
    nextBuddy();
  };

  const handlePass = () => {
    nextBuddy();
  };

  const nextBuddy = () => {
    setCurrentBuddyIndex((prev) => (prev + 1) % mockTravelBuddies.length);
  };

  const handleMessage = (buddy: TravelBuddy) => {
    if (!user) {
      setShowSignupWall(true);
      return;
    }
    setSelectedBuddy(buddy);
    setActiveView('chat');
  };

  // Desktop header component
  const DesktopHeader = () => (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-yellow-500 flex items-center justify-center">
          <span className="text-white font-bold text-lg">T</span>
        </div>
        <h1 className="text-2xl font-bold text-white">Travel Buddies</h1>
      </div>
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => setActiveView('profile')}>
          <Settings className="w-4 h-4" />
        </Button>
        {user && (
          <Avatar className="w-8 h-8">
            <AvatarImage src={user.user_metadata?.avatar_url} />
            <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
        )}
      </div>
    </div>
  );

  // Mobile header component
  const MobileHeader = () => (
    <div className="flex items-center justify-between p-4 border-b border-gray-800">
      {activeView !== 'discover' && (
        <Button variant="ghost" size="sm" onClick={() => setActiveView('discover')}>
          <ArrowLeft className="w-5 h-5 text-white" />
        </Button>
      )}
      <h1 className="text-lg font-semibold text-white">
        {activeView === 'discover' && 'Discover'}
        {activeView === 'matches' && 'Matches'}
        {activeView === 'chat' && selectedBuddy?.name}
        {activeView === 'profile' && 'Profile'}
      </h1>
      <Button variant="ghost" size="sm">
        <MoreHorizontal className="w-5 h-5 text-white" />
      </Button>
    </div>
  );

  // Discovery view with swipeable cards
  const DiscoveryView = () => (
    <div className="min-h-screen bg-backgroundDark flex items-center justify-center p-4">
      {currentBuddy && (
        <TravelBuddyCard
          user={{
            id: currentBuddy.id,
            name: currentBuddy.name,
            age: currentBuddy.age,
            photo: currentBuddy.photo_url,
            match: currentBuddy.compatibility || 0,
            location: currentBuddy.location,
            bio: currentBuddy.bio,
            tags: [...currentBuddy.interests, currentBuddy.travel_style]
          }}
          onLike={handleLike}
          onDislike={handlePass}
          onChat={() => handleMessage(currentBuddy)}
        />
      )}
    </div>
  );

  // Matches view
  const MatchesView = () => (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold text-white mb-4">Your Matches</h2>
      {mockTravelBuddies.slice(0, 3).map((buddy) => (
        <Card key={buddy.id} className="bg-gray-800 border-gray-700" onClick={() => handleMessage(buddy)}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Avatar className="w-12 h-12">
                <AvatarImage src={buddy.photo_url} />
                <AvatarFallback>{buddy.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="text-white font-semibold">{buddy.name}</h3>
                <p className="text-gray-400 text-sm">{buddy.location}</p>
              </div>
              <div className="text-right">
                <Badge className="bg-orange-500 text-white text-xs">
                  {buddy.compatibility}%
                </Badge>
                <p className="text-gray-400 text-xs mt-1">{buddy.distance}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  // Chat view
  const ChatView = () => {
    if (!user) {
      return (
        <div className="h-full flex items-center justify-center">
          <div className="text-center text-gray-400">
            <p>Please sign in to start chatting with travel buddies</p>
          </div>
        </div>
      );
    }

    if (!selectedBuddy) {
      return (
        <div className="h-full flex items-center justify-center">
          <div className="text-center text-gray-400">
            <p>Select a travel buddy to start chatting</p>
          </div>
        </div>
      );
    }

    return (
      <div className="h-full flex flex-col">
        <ChatContainer
          userId={user.id}
          buddyId={selectedBuddy.id}
          variant="mobile"
          enableReactions={true}
          enablePinning={true}
          enableSharing={true}
        />
      </div>
    );
  };

  // Profile view
  const ProfileView = () => (
    <div className="p-4 space-y-6">
      <div className="text-center">
        <Avatar className="w-24 h-24 mx-auto mb-4">
          <AvatarImage src={user?.user_metadata?.avatar_url} />
          <AvatarFallback className="text-2xl">
            {user?.email?.charAt(0).toUpperCase() || 'U'}
          </AvatarFallback>
        </Avatar>
        <h2 className="text-xl font-bold text-white">Your Profile</h2>
        <p className="text-gray-400">Complete your profile to find better matches</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Looking For
          </label>
          <div className="flex gap-2">
            <Badge className="bg-orange-500 text-white">Travel Buddy</Badge>
            <Badge variant="outline" className="border-gray-700 text-gray-300">Join Group</Badge>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Travel Style
          </label>
          <Badge variant="outline" className="border-orange-500 text-orange-400">
            Adventure Seeker
          </Badge>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Interests
          </label>
          <div className="flex flex-wrap gap-2">
            {['Photography', 'Hiking', 'Food', 'Culture', 'Art'].map((interest) => (
              <Badge key={interest} variant="secondary" className="text-xs">
                {interest}
              </Badge>
            ))}
          </div>
        </div>

        <Button className="w-full bg-orange-500 hover:bg-orange-600">
          Edit Profile
        </Button>
      </div>
    </div>
  );

  // Bottom navigation for mobile
  const BottomNav = () => (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800">
      <div className="flex">
        <Button
          variant="ghost"
          className={`flex-1 p-4 rounded-none ${activeView === 'discover' ? 'text-orange-500' : 'text-gray-400'}`}
          onClick={() => setActiveView('discover')}
        >
          <div className="flex flex-col items-center gap-1">
            <Search className="w-5 h-5" />
            <span className="text-xs">Discover</span>
          </div>
        </Button>
        
        <Button
          variant="ghost"
          className={`flex-1 p-4 rounded-none ${activeView === 'matches' ? 'text-orange-500' : 'text-gray-400'}`}
          onClick={() => setActiveView('matches')}
        >
          <div className="flex flex-col items-center gap-1">
            <Heart className="w-5 h-5" />
            <span className="text-xs">Matches</span>
          </div>
        </Button>
        
        <Button
          variant="ghost"
          className={`flex-1 p-4 rounded-none ${activeView === 'chat' ? 'text-orange-500' : 'text-gray-400'}`}
          onClick={() => setActiveView('chat')}
        >
          <div className="flex flex-col items-center gap-1">
            <MessageCircle className="w-5 h-5" />
            <span className="text-xs">Chat</span>
          </div>
        </Button>
        
        <Button
          variant="ghost"
          className={`flex-1 p-4 rounded-none ${activeView === 'profile' ? 'text-orange-500' : 'text-gray-400'}`}
          onClick={() => setActiveView('profile')}
        >
          <div className="flex flex-col items-center gap-1">
            <Settings className="w-5 h-5" />
            <span className="text-xs">Profile</span>
          </div>
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-backgroundDark">
      {/* Desktop Layout - Show only the TravelBuddyCard */}
      <div className="hidden md:block">
        <DiscoveryView />
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden h-screen flex flex-col bg-backgroundDark">
        <MobileHeader />
        
        <div className="flex-1 overflow-hidden">
          {activeView === 'discover' && <DiscoveryView />}
          {activeView === 'matches' && <MatchesView />}
          {activeView === 'chat' && <ChatView />}
          {activeView === 'profile' && <ProfileView />}
        </div>

        <BottomNav />
      </div>

      {/* Sign up wall */}
      <SignUpWall
        isOpen={showSignupWall}
        onClose={() => setShowSignupWall(false)}
        triggerSource="travel-buddies"
      />
    </div>
  );
};

export default TravelBuddiesNew;