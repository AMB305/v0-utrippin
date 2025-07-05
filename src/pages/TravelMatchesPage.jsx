import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { 
  Users, 
  MessageCircle, 
  MapPin, 
  Calendar,
  Heart,
  Star,
  Clock,
  Send
} from 'lucide-react';
import Header from '../components/layout/header';
import Footer from '../components/layout/footer';
import SEOHead from '../components/common/seo-head';
import { useSupabase } from '../hooks/useSupabase';

export default function TravelMatchesPage() {
  const { user, supabase } = useSupabase();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchMatches();
    }
  }, [user]);

  async function fetchMatches() {
    setLoading(true);
    try {
      const { data, error } = await supabase.rpc('get_user_matches', {
        user_email: user.email
      });
      
      if (error) {
        console.error('Error fetching matches:', error);
      } else {
        setMatches(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold text-[#003C8A] mb-4">Your Travel Matches</h1>
          <p className="text-gray-600 mb-8">Sign in to see your travel buddy matches</p>
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
        title="Your Travel Matches: Connect with Travel Buddies | UTrippin" 
        description="View and chat with your travel buddy matches. Start planning amazing trips together."
      />
      
      <Header />
      
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#003C8A] mb-2">Your Travel Matches</h1>
          <p className="text-gray-600">Connect with fellow travelers who liked you back!</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-2 border-gray-200 text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Heart className="h-6 w-6 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-[#003C8A]">{matches.length}</div>
              <div className="text-sm text-gray-600">Total Matches</div>
            </CardContent>
          </Card>
          
          <Card className="border-2 border-gray-200 text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <MessageCircle className="h-6 w-6 text-[#0068EF]" />
              </div>
              <div className="text-2xl font-bold text-[#003C8A]">
                {matches.filter(m => m.days_since_match <= 7).length}
              </div>
              <div className="text-sm text-gray-600">New This Week</div>
            </CardContent>
          </Card>
          
          <Card className="border-2 border-gray-200 text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Star className="h-6 w-6 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-[#003C8A]">
                {matches.filter(m => m.days_since_match <= 1).length}
              </div>
              <div className="text-sm text-gray-600">Fresh Matches</div>
            </CardContent>
          </Card>
        </div>

        {loading ? (
          <Card className="border-2 border-gray-200">
            <CardContent className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0068EF] mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your matches...</p>
            </CardContent>
          </Card>
        ) : matches.length === 0 ? (
          <Card className="border-2 border-gray-200">
            <CardContent className="p-8 text-center">
              <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No matches yet</h3>
              <p className="text-gray-500 mb-4">
                Start swiping to find travel buddies who share your interests!
              </p>
              <Button className="bg-[#0068EF] hover:bg-[#0055A5]">
                <Heart className="h-4 w-4 mr-2" />
                Start Swiping
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matches.map((match) => (
              <Card key={match.match_id} className="overflow-hidden border-2 border-gray-200 hover:border-[#0068EF] transition-all hover:shadow-lg">
                <div className="relative">
                  {match.matched_user_photo ? (
                    <img
                      src={match.matched_user_photo}
                      alt={match.matched_user_email}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <Users className="h-12 w-12 text-white" />
                    </div>
                  )}
                  
                  {/* Match Badge */}
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-green-600 text-white">
                      <Heart className="h-3 w-3 mr-1" />
                      Match
                    </Badge>
                  </div>

                  {/* Days Since Match */}
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-white/90 text-gray-800">
                      {match.days_since_match === 0 ? 'Today' : 
                       match.days_since_match === 1 ? 'Yesterday' : 
                       `${match.days_since_match} days ago`}
                    </Badge>
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <div className="mb-4">
                    <h3 className="font-bold text-lg text-[#003C8A] mb-2">
                      {match.matched_user_email?.split('@')[0] || 'Travel Buddy'}
                    </h3>
                    
                    {match.matched_user_location && (
                      <div className="flex items-center text-sm text-gray-600 mb-2">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>{match.matched_user_location}</span>
                      </div>
                    )}

                    {match.matched_user_age && (
                      <div className="flex items-center text-sm text-gray-600 mb-3">
                        <Users className="h-4 w-4 mr-1" />
                        <span>{match.matched_user_age} years old</span>
                      </div>
                    )}

                    <div className="flex items-center text-sm text-gray-500 mb-4">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>Matched on {new Date(match.matched_on).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 border-[#0068EF] text-[#0068EF] hover:bg-blue-50"
                    >
                      View Profile
                    </Button>
                    <Button 
                      size="sm" 
                      className="flex-1 bg-[#0068EF] hover:bg-[#0055A5]"
                    >
                      <MessageCircle className="h-4 w-4 mr-1" />
                      Chat
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Call to Action */}
        {matches.length > 0 && (
          <div className="text-center mt-12">
            <Card className="max-w-2xl mx-auto border-2 border-[#0068EF]/20 bg-blue-50">
              <CardContent className="p-8">
                <h3 className="text-xl font-bold text-[#003C8A] mb-4">Ready for More Adventures?</h3>
                <p className="text-gray-600 mb-6">
                  Keep swiping to find more travel companions who share your wanderlust!
                </p>
                <Button className="bg-[#0068EF] hover:bg-[#0055A5]">
                  <Heart className="h-4 w-4 mr-2" />
                  Find More Buddies
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