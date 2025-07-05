import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { 
  Heart, 
  X, 
  MapPin, 
  Users, 
  Sparkles,
  MessageCircle,
  Star
} from 'lucide-react';
import Header from '../components/layout/header';
import Footer from '../components/layout/footer';
import SEOHead from '../components/common/seo-head';
import { useSupabase } from '../hooks/useSupabase';

export default function TravelBuddy() {
  const { user, supabase } = useSupabase();
  const [profiles, setProfiles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showMatch, setShowMatch] = useState(false);
  const [matchedProfile, setMatchedProfile] = useState(null);

  useEffect(() => {
    if (user) {
      fetchProfiles();
    }
  }, [user]);

  async function fetchProfiles() {
    setLoading(true);
    try {
      // First get the current user's profile
      const { data: userProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', user.email)
        .single();
      
      if (!userProfile) {
        // Create a profile if it doesn't exist
        const { data: newProfile, error: profileError } = await supabase
          .from('profiles')
          .insert({
            username: user.email,
            avatar_url: user.user_metadata?.avatar_url || null,
            bio: 'Travel enthusiast'
          })
          .select()
          .single();
          
        if (profileError) throw profileError;
      }
      
      // Get potential matches
      const { data, error } = await supabase.rpc('get_potential_travel_buddies', {
        current_user: userProfile?.id || newProfile?.id
      });
      
      if (error) throw error;
      setProfiles(data || []);
    } catch (error) {
      console.error('Error fetching profiles:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSwipe(liked) {
    if (currentIndex >= profiles.length) return;
    
    try {
      // Get current user profile
      const { data: userProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', user.email)
        .single();
      
      if (!userProfile) return;
      
      // Record the swipe
      await supabase.rpc('record_swipe', {
        swiper: userProfile.id,
        swiped: profiles[currentIndex].id,
        liked: liked
      });
      
      // Check if it's a match
      if (liked) {
        const { data: matchCheck } = await supabase
          .from('travel_matches')
          .select('id')
          .or(`user1_id.eq.${userProfile.id},user2_id.eq.${userProfile.id}`)
          .or(`user1_id.eq.${profiles[currentIndex].id},user2_id.eq.${profiles[currentIndex].id}`)
          .maybeSingle();
        
        if (matchCheck) {
          setMatchedProfile(profiles[currentIndex]);
          setShowMatch(true);
          setTimeout(() => setShowMatch(false), 3000);
        }
      }
      
      // Move to next profile
      setCurrentIndex(prev => prev + 1);
    } catch (error) {
      console.error('Error recording swipe:', error);
    }
  }

  function handleRefresh() {
    setCurrentIndex(0);
    fetchProfiles();
  }

  const currentProfile = profiles[currentIndex];

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
        ) : currentIndex >= profiles.length ? (
          <Card className="max-w-md mx-auto border-2 border-gray-200">
            <CardContent className="p-8 text-center">
              <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No more travelers to show</h3>
              <p className="text-gray-500 mb-4">
                Come back later for more potential travel buddies!
              </p>
              <Button 
                onClick={handleRefresh}
                className="bg-[#0068EF] hover:bg-[#0055A5]"
              >
                Refresh
              </Button>
            </CardContent>
          </Card>
        ) : currentProfile ? (
          <div className="max-w-md mx-auto">
            <Card className="overflow-hidden border-2 border-gray-200 shadow-xl">
              {/* Profile Image */}
              <div className="relative h-96 bg-gradient-to-br from-blue-500 to-purple-600">
                {currentProfile.avatar_url ? (
                  <img
                    src={currentProfile.avatar_url}
                    alt={currentProfile.username}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white">
                    <div className="text-center">
                      <Users className="h-16 w-16 mx-auto mb-4" />
                      <p className="text-lg font-semibold">
                        {currentProfile.username?.split('@')[0] || 'Traveler'}
                      </p>
                    </div>
                  </div>
                )}
                
                {/* Compatibility Score */}
                <div className="absolute top-4 right-4">
                  <Badge className="bg-[#FF6200] text-white font-bold">
                    <Star className="h-3 w-3 mr-1" />
                    85% Match
                  </Badge>
                </div>
              </div>

              <CardContent className="p-6">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-[#003C8A] mb-2">
                    {currentProfile.username?.split('@')[0] || 'Fellow Traveler'}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-3">{currentProfile.bio}</p>
                </div>

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
              {currentIndex + 1} of {profiles.length} travelers
            </div>
          </div>
        ) : null}

        {/* Match Modal */}
        {showMatch && matchedProfile && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <Card className="max-w-sm w-full border-2 border-green-400 shadow-2xl">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-green-600 mb-2">It's a Match! 🎉</h3>
                <p className="text-gray-600 mb-4">
                  You and {matchedProfile.username?.split('@')[0]} liked each other!
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