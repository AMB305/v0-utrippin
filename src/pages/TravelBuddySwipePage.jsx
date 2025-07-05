import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { 
  Heart, 
  X, 
  MapPin, 
  Users, 
  Sparkles,
  Camera,
  Globe,
  MessageCircle,
  Star
} from 'lucide-react';
import Header from '../components/layout/header';
import Footer from '../components/layout/footer';
import SEOHead from '../components/common/seo-head';
import { useSupabase } from '../hooks/useSupabase';

export default function TravelBuddySwipePage() {
  const { user, supabase } = useSupabase();
  const [buddies, setBuddies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMatch, setIsMatch] = useState(false);
  const [matchedUser, setMatchedUser] = useState(null);

  useEffect(() => {
    if (user) {
      fetchBuddies();
    }
  }, [user]);

  async function fetchBuddies() {
    setLoading(true);
    try {
      // Get current user's profile first
      const { data: userProfile } = await supabase
        .from('users')
        .select('id')
        .eq('email', user.email)
        .single();

      if (userProfile) {
        const { data, error } = await supabase.rpc('get_potential_travel_buddies', {
          current_user_id: userProfile.id,
          limit_count: 20
        });
        
        if (error) {
          console.error('Error fetching buddies:', error);
        } else {
          setBuddies(data || []);
        }
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSwipe(liked) {
    if (currentIndex >= buddies.length) return;
    
    const currentBuddy = buddies[currentIndex];
    
    try {
      const { data, error } = await supabase.rpc('record_swipe', {
        current_user_email: user.email,
        target_user_id: currentBuddy.user_id,
        is_like: liked
      });

      if (error) {
        console.error('Error recording swipe:', error);
        return;
      }

      // Check if it's a match
      if (data?.is_match && liked) {
        setMatchedUser(currentBuddy);
        setIsMatch(true);
        setTimeout(() => {
          setIsMatch(false);
          setMatchedUser(null);
        }, 3000);
      }

      // Move to next buddy
      setCurrentIndex(prev => prev + 1);
    } catch (error) {
      console.error('Error:', error);
    }
  }

  const currentBuddy = buddies[currentIndex];

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold text-[#003C8A] mb-4">Find Travel Buddies</h1>
          <p className="text-gray-600 mb-8">Sign in to start swiping and find your perfect travel companion</p>
          <Button className="bg-[#0068EF] hover:bg-[#0055A5]">
            Sign In
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SEOHead 
        title="Find Travel Buddies: Swipe & Match | UTrippin" 
        description="Discover travel companions who share your interests. Swipe to connect with fellow travelers worldwide."
      />
      
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#003C8A] mb-2">Find Your Travel Buddy</h1>
          <p className="text-gray-600">Swipe right to like, left to pass. Find your perfect travel companion!</p>
        </div>

        {loading ? (
          <Card className="max-w-md mx-auto border-2 border-gray-200">
            <CardContent className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0068EF] mx-auto mb-4"></div>
              <p className="text-gray-600">Finding travel buddies...</p>
            </CardContent>
          </Card>
        ) : currentIndex >= buddies.length ? (
          <Card className="max-w-md mx-auto border-2 border-gray-200">
            <CardContent className="p-8 text-center">
              <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No more travelers to show</h3>
              <p className="text-gray-500 mb-4">
                Come back later for more potential travel buddies!
              </p>
              <Button 
                onClick={() => {
                  setCurrentIndex(0);
                  fetchBuddies();
                }}
                className="bg-[#0068EF] hover:bg-[#0055A5]"
              >
                Refresh
              </Button>
            </CardContent>
          </Card>
        ) : currentBuddy ? (
          <div className="max-w-md mx-auto">
            <Card className="overflow-hidden border-2 border-gray-200 shadow-xl">
              {/* Profile Image */}
              <div className="relative h-96 bg-gradient-to-br from-blue-500 to-purple-600">
                {currentBuddy.user_photo ? (
                  <img
                    src={currentBuddy.user_photo}
                    alt={currentBuddy.user_email}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white">
                    <div className="text-center">
                      <Users className="h-16 w-16 mx-auto mb-4" />
                      <p className="text-lg font-semibold">
                        {currentBuddy.user_email?.split('@')[0] || 'Traveler'}
                      </p>
                    </div>
                  </div>
                )}
                
                {/* Compatibility Score */}
                <div className="absolute top-4 right-4">
                  <Badge className="bg-[#FF6200] text-white font-bold">
                    <Star className="h-3 w-3 mr-1" />
                    {Math.round(currentBuddy.compatibility_score * 100)}% Match
                  </Badge>
                </div>

                {/* Age Badge */}
                {currentBuddy.user_age && (
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-white/90 text-gray-800">
                      {currentBuddy.user_age} years old
                    </Badge>
                  </div>
                )}
              </div>

              <CardContent className="p-6">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-[#003C8A] mb-2">
                    {currentBuddy.user_email?.split('@')[0] || 'Fellow Traveler'}
                  </h3>
                  
                  {currentBuddy.user_location && (
                    <div className="flex items-center text-gray-600 mb-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span className="text-sm">{currentBuddy.user_location}</span>
                    </div>
                  )}

                  {currentBuddy.user_bio && (
                    <p className="text-gray-600 text-sm mb-3">{currentBuddy.user_bio}</p>
                  )}
                </div>

                {/* Travel Style */}
                {currentBuddy.travel_style && (
                  <div className="mb-4">
                    <Badge variant="outline" className="border-[#0068EF]/20 text-[#0068EF] capitalize">
                      {currentBuddy.travel_style} Traveler
                    </Badge>
                  </div>
                )}

                {/* Interests */}
                {currentBuddy.interests && currentBuddy.interests.length > 0 && (
                  <div className="mb-4">
                    <div className="text-sm font-medium text-gray-700 mb-2">Interests:</div>
                    <div className="flex flex-wrap gap-1">
                      {currentBuddy.interests.slice(0, 4).map((interest, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs bg-blue-50 text-[#0068EF]">
                          {interest}
                        </Badge>
                      ))}
                      {currentBuddy.interests.length > 4 && (
                        <Badge variant="outline" className="text-xs">
                          +{currentBuddy.interests.length - 4} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                {/* Preferred Destinations */}
                {currentBuddy.preferred_destinations && currentBuddy.preferred_destinations.length > 0 && (
                  <div className="mb-6">
                    <div className="text-sm font-medium text-gray-700 mb-2">Wants to visit:</div>
                    <div className="flex flex-wrap gap-1">
                      {currentBuddy.preferred_destinations.slice(0, 3).map((dest, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs bg-green-50 text-green-600">
                          <Globe className="h-3 w-3 mr-1" />
                          {dest}
                        </Badge>
                      ))}
                      {currentBuddy.preferred_destinations.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{currentBuddy.preferred_destinations.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <Button
                    onClick={() => handleSwipe(false)}
                    variant="outline"
                    className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
                    size="lg"
                  >
                    <X className="h-5 w-5 mr-2" />
                    Pass
                  </Button>
                  <Button
                    onClick={() => handleSwipe(true)}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                    size="lg"
                  >
                    <Heart className="h-5 w-5 mr-2" />
                    Like
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Progress Indicator */}
            <div className="mt-4 text-center text-sm text-gray-500">
              {currentIndex + 1} of {buddies.length} travelers
            </div>
          </div>
        ) : null}

        {/* Match Modal */}
        {isMatch && matchedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <Card className="max-w-sm w-full border-2 border-green-400 shadow-2xl">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-green-600 mb-2">It's a Match! 🎉</h3>
                <p className="text-gray-600 mb-4">
                  You and {matchedUser.user_email?.split('@')[0]} liked each other!
                </p>
                <Button className="bg-green-600 hover:bg-green-700 text-white">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Start Chatting
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}