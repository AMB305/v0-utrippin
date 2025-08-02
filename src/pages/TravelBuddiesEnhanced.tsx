import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, MapPin, Calendar, Users, Heart, Star, Loader, MessageCircle, 
  Plane, Filter, Share2, UserPlus, Bell, Compass, Ticket, Globe,
  TrendingUp, Coffee, Camera, Music, Mountain, Utensils, PartyPopper,
  Sparkles, Award
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useBudgetTrips } from '@/hooks/useBudgetTrips';
import { useEvents } from '@/hooks/useEvents';
import { useTravelBuddyIntegration } from '@/hooks/useTravelBuddyIntegration';
import { useSmartMatching, MatchFilters } from '@/hooks/useSmartMatching';
import { TravelBuddyBookingWidget } from '@/components/TravelBuddyBookingWidget';
import { SmartMatchCard } from '@/components/SmartMatchCard';
import { SmartMatchFilters } from '@/components/SmartMatchFilters';
import EnhancedMessaging, { useEnhancedMessaging } from '@/components/EnhancedMessaging';
import { PremiumFeatureGate } from '@/components/PremiumFeatureGate';
import SignUpWall from '@/components/SignUpWall';
import { PexelsImage } from '@/components/PexelsImage';
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const TravelBuddiesEnhanced = () => {
  const { user, loading: authLoading } = useAuth();
  const { messages, removeMessage } = useEnhancedMessaging();
  
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("discover");
  const [budget, setBudget] = useState(2000);
  const [groupSize, setGroupSize] = useState(2);
  const [selectedInterest, setSelectedInterest] = useState("all");
  const [searchDestination, setSearchDestination] = useState("");
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [smartFilters, setSmartFilters] = useState<MatchFilters>({
    maxAgeDiff: 15,
    minScore: 0.3,
    limit: 20
  });

  const { trips, loading: loadingTrips } = useBudgetTrips(budget, groupSize);
  const { events, loading: loadingEvents } = useEvents();
  const { 
    joinEvent, 
    followUser, 
    shareTrip, 
    getFollowerCount, 
    isFollowing,
    loading: integrationLoading 
  } = useTravelBuddyIntegration();

  const {
    loading: matchingLoading,
    matches,
    matchingStats,
    findMatches,
    clearMatches
  } = useSmartMatching();

  // Mock users for travel buddy matching
  const mockTravelBuddies = [
    {
      id: '1',
      name: 'Sarah Chen',
      location: 'San Francisco, CA',
      age: 28,
      bio: '✈️ Digital nomad exploring the world one city at a time. Love coffee culture, photography, and hidden local gems!',
      interests: ['photography', 'coffee', 'culture', 'hiking'],
      travel_style: 'Adventure seeker',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400',
      verified: true,
      followers: 1240,
      upcoming_trip: 'Tokyo, Japan',
      last_active: '2 hours ago'
    },
    {
      id: '2',
      name: 'Marco Rodriguez',
      location: 'Barcelona, Spain',
      age: 32,
      bio: '🍷 Food & wine enthusiast seeking fellow foodies for culinary adventures. Currently planning European food tours!',
      interests: ['food', 'wine', 'culture', 'nightlife'],
      travel_style: 'Foodie explorer',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      verified: true,
      followers: 890,
      upcoming_trip: 'Rome, Italy',
      last_active: '1 hour ago'
    },
    {
      id: '3',
      name: 'Yuki Tanaka',
      location: 'Tokyo, Japan',
      age: 26,
      bio: '🎵 Music festival lover and backpacker. Always down for spontaneous adventures and making new friends worldwide!',
      interests: ['music', 'festivals', 'backpacking', 'adventure'],
      travel_style: 'Festival hopper',
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400',
      verified: false,
      followers: 567,
      upcoming_trip: 'Coachella, CA',
      last_active: '30 minutes ago'
    },
    {
      id: '4',
      name: 'Emma Wilson',
      location: 'London, UK',
      age: 29,
      bio: '🏔️ Mountain lover and wellness traveler. Seeking like-minded people for yoga retreats and nature escapes.',
      interests: ['wellness', 'yoga', 'mountains', 'nature'],
      travel_style: 'Wellness seeker',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
      verified: true,
      followers: 2100,
      upcoming_trip: 'Bali, Indonesia',
      last_active: 'Online now'
    }
  ];

  const handleSignUp = () => {
    if (!user) {
      setShowSignupModal(true);
      return;
    }
    // User is logged in, proceed with action
  };

  const getInterestIcon = (interest: string) => {
    const icons = {
      photography: Camera,
      coffee: Coffee,
      culture: Globe,
      hiking: Mountain,
      food: Utensils,
      wine: Utensils,
      nightlife: PartyPopper,
      music: Music,
      festivals: Ticket,
      backpacking: Plane,
      adventure: Compass,
      wellness: Heart,
      yoga: Heart,
      mountains: Mountain,
      nature: Mountain
    };
    const Icon = icons[interest] || Globe;
    return <Icon className="w-4 h-4" />;
  };

  const filteredBuddies = selectedInterest === "all" 
    ? mockTravelBuddies 
    : mockTravelBuddies.filter(buddy => 
        buddy.interests.includes(selectedInterest)
      );

  return (
    <div className="min-h-screen bg-utrippin-navy text-white">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-utrippin-navy via-utrippin-muted to-utrippin-navy overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-utrippin-blue/20 via-transparent to-transparent" />
        
        <div className="container mx-auto text-center max-w-6xl relative z-10">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            ✈️ Find Your Perfect<br />
            <span className="bg-gradient-to-r from-utrippin-blue to-utrippin-orange bg-clip-text text-transparent">
              Travel Companion
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto">
            🤝 Connect with fellow adventurers, join amazing trips, discover events worldwide, and create unforgettable memories together
          </p>

          {!user && (
            <div className="mb-12">
              <Button 
                onClick={() => navigate('/auth')}
                size="lg"
                className="bg-utrippin-orange hover:bg-utrippin-orange/90 text-utrippin-navy font-bold px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                🚀 Join Utrippin Community - It's Free!
              </Button>
              <p className="text-sm text-gray-400 mt-3">
                Join thousands of travelers finding their perfect companions
              </p>
            </div>
          )}

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto mb-12">
            <div className="text-center">
              <div className="text-2xl font-bold text-utrippin-orange">15K+</div>
              <div className="text-sm text-gray-400">Active Travelers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-utrippin-blue">500+</div>
              <div className="text-sm text-gray-400">Cities Connected</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-utrippin-orange">2.5K+</div>
              <div className="text-sm text-gray-400">Trips Planned</div>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <section className="sticky top-0 z-20 bg-utrippin-muted/95 backdrop-blur-sm border-b border-utrippin-orange/20">
        <div className="container mx-auto px-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5 max-w-3xl mx-auto bg-transparent">
              <TabsTrigger 
                value="discover" 
                className="data-[state=active]:bg-utrippin-orange data-[state=active]:text-utrippin-navy text-white font-semibold"
              >
                🧭 Discover
              </TabsTrigger>
              <TabsTrigger 
                value="buddies"
                className="data-[state=active]:bg-utrippin-blue data-[state=active]:text-white text-gray-300 font-semibold"
              >
                👥 Buddies
              </TabsTrigger>
              <TabsTrigger 
                value="messages"
                className="data-[state=active]:bg-utrippin-orange data-[state=active]:text-utrippin-navy text-white font-semibold"
              >
                💬 Messages
              </TabsTrigger>
              <TabsTrigger 
                value="trips"
                className="data-[state=active]:bg-utrippin-blue data-[state=active]:text-white text-gray-300 font-semibold"
              >
                ✈️ Trips
              </TabsTrigger>
              <TabsTrigger 
                value="events"
                className="data-[state=active]:bg-utrippin-orange data-[state=active]:text-utrippin-navy text-white font-semibold"
              >
                🎉 Events
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} className="w-full">
          
          {/* Discover Tab */}
          <TabsContent value="discover" className="space-y-8">
            {/* Search & Filters */}
            <Card className="bg-utrippin-muted border-utrippin-orange/20">
              <CardHeader>
                <CardTitle className="text-utrippin-orange flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  Find Your Adventure
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Input
                      placeholder="🗺️ Where do you want to go?"
                      value={searchDestination}
                      onChange={(e) => setSearchDestination(e.target.value)}
                      className="bg-utrippin-navy border-utrippin-orange/30 text-white placeholder-gray-400"
                    />
                  </div>
                  <Button className="bg-utrippin-orange hover:bg-utrippin-orange/90 text-utrippin-navy">
                    Search
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm text-utrippin-orange mb-2 block">💰 Budget: ${budget}</label>
                    <input
                      type="range"
                      min={500}
                      max={10000}
                      step={100}
                      value={budget}
                      onChange={(e) => setBudget(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-utrippin-orange mb-2 block">👥 Group Size</label>
                    <Select value={groupSize.toString()} onValueChange={(value) => setGroupSize(Number(value))}>
                      <SelectTrigger className="bg-utrippin-navy border-utrippin-orange/30">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-utrippin-muted border-utrippin-orange/30">
                        {[1,2,3,4,5,6,7,8].map(n => (
                          <SelectItem key={n} value={n.toString()}>{n} {n === 1 ? 'person' : 'people'}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm text-utrippin-orange mb-2 block">🎯 Interest</label>
                    <Select value={selectedInterest} onValueChange={setSelectedInterest}>
                      <SelectTrigger className="bg-utrippin-navy border-utrippin-orange/30">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-utrippin-muted border-utrippin-orange/30">
                        <SelectItem value="all">All Interests</SelectItem>
                        <SelectItem value="adventure">🏔️ Adventure</SelectItem>
                        <SelectItem value="culture">🏛️ Culture</SelectItem>
                        <SelectItem value="food">🍕 Food & Drink</SelectItem>
                        <SelectItem value="photography">📸 Photography</SelectItem>
                        <SelectItem value="music">🎵 Music & Festivals</SelectItem>
                        <SelectItem value="wellness">🧘 Wellness</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Trending Destinations */}
            <div>
              <h2 className="text-2xl font-bold mb-6 text-utrippin-orange flex items-center gap-2">
                <TrendingUp className="w-6 h-6" />
                🔥 Trending Destinations
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { name: 'Tokyo, Japan', tags: ['tokyo', 'japan', 'urban', 'neon'] },
                  { name: 'Bali, Indonesia', tags: ['bali', 'indonesia', 'tropical', 'beach'] },
                  { name: 'Paris, France', tags: ['paris', 'france', 'romantic', 'architecture'] },
                  { name: 'New York, USA', tags: ['new-york', 'usa', 'skyline', 'urban'] }
                ].map((destination, idx) => (
                  <Card key={idx} className="bg-utrippin-muted border-utrippin-blue/20 hover:border-utrippin-blue/50 transition-colors cursor-pointer overflow-hidden">
                    <div className="relative h-24">
                      <PexelsImage
                        destination={destination.name}
                        description={`Beautiful ${destination.name} cityscape`}
                        tags={destination.tags}
                        className="w-full h-full object-cover"
                        alt={destination.name}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-utrippin-navy/80 to-transparent" />
                    </div>
                    <CardContent className="p-3 relative -mt-8 z-10">
                      <h3 className="font-semibold text-white text-sm">{destination.name}</h3>
                      <p className="text-xs text-utrippin-orange mt-1">142 travelers interested</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Travel Buddies Tab - Smart Matching */}
          <TabsContent value="buddies" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-utrippin-orange flex items-center gap-2">
                  <Sparkles className="w-6 h-6" />
                  Smart Travel Buddy Matching
                </h2>
                <p className="text-gray-400 mt-1">AI-powered compatibility matching for your perfect travel companion</p>
              </div>
              {!user && (
                <Button 
                  onClick={() => navigate('/auth')}
                  className="bg-utrippin-blue hover:bg-utrippin-blue/90"
                >
                  Join to Connect
                </Button>
              )}
            </div>

            {user ? (
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Filters Sidebar */}
                <div className="lg:col-span-1">
                  <PremiumFeatureGate
                    feature="advanced_filters"
                    upgradeMessage="Unlock advanced filtering options to find the perfect travel buddies"
                    fallback={
                      <SmartMatchFilters
                        filters={{ maxAgeDiff: 15, minScore: 0.3, limit: 10 }}
                        onFiltersChange={() => {}}
                        onApply={() => {}}
                        onReset={() => {}}
                        loading={false}
                        resultsCount={0}
                      />
                    }
                  >
                    <SmartMatchFilters
                      filters={smartFilters}
                      onFiltersChange={setSmartFilters}
                      onApply={() => findMatches(user.id, smartFilters)}
                      onReset={() => {
                        setSmartFilters({ maxAgeDiff: 15, minScore: 0.3, limit: 20 });
                        clearMatches();
                      }}
                      loading={matchingLoading}
                      resultsCount={matchingStats?.totalCount}
                    />
                  </PremiumFeatureGate>

                  {/* Matching Stats */}
                  {matchingStats && (
                    <Card className="mt-4 bg-utrippin-muted border-utrippin-orange/20">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm text-utrippin-orange flex items-center gap-2">
                          <Award className="w-4 h-4" />
                          Matching Statistics
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Total Matches:</span>
                          <span className="text-white font-medium">{matchingStats.totalCount}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Avg. Compatibility:</span>
                          <span className="text-utrippin-orange font-medium">
                            {Math.round(matchingStats.averageScore * 100)}%
                          </span>
                        </div>
                        {matchingStats.filters.scoreRange && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Score Range:</span>
                            <span className="text-white font-medium">
                              {Math.round(matchingStats.filters.scoreRange.min * 100)}% - {Math.round(matchingStats.filters.scoreRange.max * 100)}%
                            </span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* Matches Grid */}
                <div className="lg:col-span-3">
                  {!matches.length && !matchingLoading ? (
                    <Card className="bg-utrippin-muted border-utrippin-orange/20 text-center p-8">
                      <div className="space-y-4">
                        <Sparkles className="w-12 h-12 text-utrippin-orange mx-auto" />
                        <h3 className="text-xl font-semibold text-white">Ready to Find Your Travel Buddy?</h3>
                        <p className="text-gray-400">Use our smart matching system to find compatible travel companions based on your preferences, interests, and travel style.</p>
                        <Button 
                          onClick={() => findMatches(user.id, smartFilters)}
                          className="bg-utrippin-orange hover:bg-utrippin-orange/90 text-utrippin-navy"
                          disabled={matchingLoading}
                        >
                          <Search className="w-4 h-4 mr-2" />
                          Start Smart Matching
                        </Button>
                      </div>
                    </Card>
                  ) : (
                    <div className="space-y-4">
                      {matchingLoading && (
                        <Card className="bg-utrippin-muted border-utrippin-orange/20 p-8 text-center">
                          <Loader className="w-8 h-8 animate-spin text-utrippin-orange mx-auto mb-4" />
                          <p className="text-white">Finding your perfect travel matches...</p>
                        </Card>
                      )}
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {matches.map((match) => (
                          <SmartMatchCard
                            key={match.buddy_user_id}
                            match={match}
                            onLike={(userId) => {
                              if (!user) {
                                setShowSignupModal(true);
                                return;
                              }
                              // Handle like logic
                            }}
                            onMessage={(userId) => {
                              if (!user) {
                                setShowSignupModal(true);
                                return;
                              }
                              // Handle message logic
                            }}
                            onViewProfile={(userId) => {
                              // Navigate to profile
                            }}
                            loading={integrationLoading}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <Card className="bg-utrippin-muted border-utrippin-orange/20 text-center p-12">
                <Users className="w-16 h-16 text-utrippin-orange mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">Join Utrippin to Find Travel Buddies</h3>
                <p className="text-gray-400 mb-6 max-w-md mx-auto">
                  Connect with like-minded travelers using our smart matching algorithm. Find your perfect travel companion today!
                </p>
                <Button 
                  onClick={() => navigate('/auth')}
                  className="bg-utrippin-orange hover:bg-utrippin-orange/90 text-utrippin-navy font-bold px-8 py-3"
                >
                  Sign Up for Free
                </Button>
              </Card>
            )}
          </TabsContent>

          {/* Messages Tab */}
          <TabsContent value="messages" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-utrippin-orange flex items-center gap-2">
                <MessageCircle className="w-6 h-6" />
                💬 Travel Buddy Messages
              </h2>
              <p className="text-gray-400">Connect and chat with your matched travel buddies</p>
            </div>

            {user ? (
              <EnhancedMessaging 
                messages={messages}
                onDismiss={removeMessage}
              />
            ) : (
              <Card className="bg-utrippin-muted border-utrippin-orange/20 text-center p-12">
                <MessageCircle className="w-16 h-16 text-utrippin-orange mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">Join to Start Messaging</h3>
                <p className="text-gray-400 mb-6 max-w-md mx-auto">
                  Connect with your travel buddy matches and start planning amazing adventures together!
                </p>
                <Button 
                  onClick={() => navigate('/auth')}
                  className="bg-utrippin-orange hover:bg-utrippin-orange/90 text-utrippin-navy font-bold px-8 py-3"
                >
                  Sign Up for Free
                </Button>
              </Card>
            )}
          </TabsContent>

          {/* Trips Tab */}
          <TabsContent value="trips" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-utrippin-orange">✈️ Available Trips</h2>
              {!user && (
                <Button 
                  onClick={() => navigate('/auth')}
                  className="bg-utrippin-blue hover:bg-utrippin-blue/90"
                >
                  Join to Book
                </Button>
              )}
            </div>

            {loadingTrips ? (
              <div className="flex items-center justify-center py-12">
                <Loader className="w-8 h-8 animate-spin text-utrippin-orange" />
                <span className="ml-3 text-utrippin-orange">Loading amazing trips...</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {trips.map((trip) => (
                  <Card key={trip.id} className="bg-utrippin-muted border-utrippin-blue/20 hover:border-utrippin-blue/50 transition-all duration-300 hover:scale-105">
                    <div className="h-48 bg-gradient-to-br from-utrippin-blue/20 to-utrippin-orange/20 flex items-center justify-center">
                      <PexelsImage
                        destination={trip.destination}
                        description={trip.summary}
                        tags={trip.activities}
                        className="w-full h-full object-cover"
                        alt={trip.destination}
                      />
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold mb-2 text-utrippin-orange">
                        {trip.destination}
                      </h3>
                      <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                        {trip.summary}
                      </p>
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-utrippin-blue font-bold text-lg">
                          ${trip.totalCost.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-400">
                          {trip.duration} days
                        </div>
                      </div>
                      <div className="flex gap-2 mb-4">
                        <Button 
                          size="sm" 
                          className="flex-1 bg-utrippin-orange hover:bg-utrippin-orange/90 text-utrippin-navy"
                          onClick={handleSignUp}
                        >
                          Join Trip
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="border-utrippin-blue text-utrippin-blue hover:bg-utrippin-blue hover:text-white"
                          onClick={handleSignUp}
                        >
                          <Share2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {trip.activities.slice(0, 3).map((activity, idx) => (
                          <Badge 
                            key={idx}
                            variant="secondary"
                            className="text-xs bg-utrippin-navy text-utrippin-orange border-utrippin-orange/30"
                          >
                            {activity}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-utrippin-orange">🎉 Upcoming Events & Festivals</h2>
              {!user && (
                <Button 
                  onClick={() => navigate('/auth')}
                  className="bg-utrippin-blue hover:bg-utrippin-blue/90"
                >
                  Join to Attend
                </Button>
              )}
            </div>

            {loadingEvents ? (
              <div className="flex items-center justify-center py-12">
                <Loader className="w-8 h-8 animate-spin text-utrippin-blue" />
                <span className="ml-3 text-utrippin-blue">Loading exciting events...</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event) => (
                  <Card key={event.id} className="bg-utrippin-muted border-utrippin-orange/20 hover:border-utrippin-orange/50 transition-all duration-300 hover:scale-105">
                    <div className="h-40 bg-gradient-to-br from-utrippin-orange/20 to-utrippin-blue/20 flex items-center justify-center">
                      <PexelsImage
                        destination={event.location}
                        description={event.description}
                        tags={[event.name, ...event.tags]}
                        className="w-full h-full object-cover"
                        alt={event.name}
                        fallbackImage={event.image}
                      />
                    </div>
                    <CardContent className="p-5">
                      <h3 className="text-lg font-bold mb-1 text-utrippin-blue">
                        {event.name}
                      </h3>
                      <p className="text-sm text-gray-400 mb-2 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {event.location}
                      </p>
                      <p className="text-xs text-utrippin-orange mb-3 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(event.start_date).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                      <p className="text-sm text-gray-300 mb-4 line-clamp-2">
                        {event.description}
                      </p>
                      <div className="flex items-center justify-between mb-4">
                        {event.price && (
                          <div className="text-utrippin-orange font-semibold">
                            ${event.price}
                          </div>
                        )}
                        <div className="text-xs text-gray-400">
                          🎫 23 attending
                        </div>
                      </div>
                      <div className="flex gap-2 mb-3">
                        <Button 
                          size="sm" 
                          className="flex-1 bg-utrippin-blue hover:bg-utrippin-blue/90"
                          onClick={handleSignUp}
                        >
                          I'm Going!
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="border-utrippin-orange text-utrippin-orange hover:bg-utrippin-orange hover:text-utrippin-navy"
                          onClick={handleSignUp}
                        >
                          <Bell className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {event.tags.slice(0, 2).map((tag, idx) => (
                          <Badge 
                            key={idx}
                            variant="secondary"
                            className="text-xs bg-utrippin-navy text-utrippin-blue border-utrippin-blue/30"
                          >
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Travel Buddy Booking Widget */}
      {activeTab === 'trips' && (
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-utrippin-orange mb-6 text-center">
              🚀 Plan Your Next Adventure
            </h2>
            <TravelBuddyBookingWidget
              onLookingForBuddies={(isLooking) => {
                if (isLooking) {
                  // Switch to buddies tab to show potential matches
                  setActiveTab('buddies');
                }
              }}
            />
          </div>
        </div>
      )}

      {/* Call to Action Section */}
      {!user && (
        <section className="bg-gradient-to-r from-utrippin-blue via-utrippin-muted to-utrippin-orange py-16 px-4">
          <div className="container mx-auto text-center max-w-4xl">
            <h2 className="text-4xl font-bold mb-6">
              🌟 Ready to Start Your Adventure?
            </h2>
            <p className="text-xl text-gray-200 mb-8">
              Join thousands of travelers finding their perfect companions and creating unforgettable memories worldwide!
            </p>
            <Button 
              onClick={() => navigate('/auth')}
              size="lg"
              className="bg-white hover:bg-gray-100 text-utrippin-navy font-bold px-12 py-4 text-xl rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              🚀 Start Your Journey - Free Forever!
            </Button>
            <p className="text-sm text-gray-300 mt-4">
              ✅ No credit card required • ✅ Join in 30 seconds • ✅ 15K+ verified travelers
            </p>
          </div>
        </section>
      )}

      <Footer />
      
      <style>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default TravelBuddiesEnhanced;
