import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { 
  Users, 
  MapPin, 
  Calendar, 
  Star, 
  MessageCircle, 
  Heart,
  Search,
  Filter,
  Globe,
  Clock,
  DollarSign,
  Send,
  X,
  Sparkles
} from 'lucide-react';
import { useSupabase } from '../../hooks/useSupabase';

export default function TravelBuddyFinder({ userTripId, onBuddyRequest }) {
  const { user, supabase } = useSupabase();
  const [buddies, setBuddies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBuddy, setSelectedBuddy] = useState(null);
  const [message, setMessage] = useState('');
  const [sendingRequest, setSendingRequest] = useState(false);
  const [filters, setFilters] = useState({
    travelStyle: 'all',
    ageRange: 'all',
    destination: ''
  });

  useEffect(() => {
    if (user) {
      loadTravelBuddies();
    }
  }, [user]);

  const loadTravelBuddies = async () => {
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
        
        if (error) throw error;
        setBuddies(data || []);
      }
    } catch (error) {
      console.error('Error loading travel buddies:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendBuddyRequest = async (buddyUserId, buddyTripId) => {
    setSendingRequest(true);
    try {
      // Get current user profile
      const { data: userProfile } = await supabase
        .from('users')
        .select('id')
        .eq('email', user.email)
        .single();

      if (userProfile) {
        const { data, error } = await supabase
          .from('buddy_requests')
          .insert({
            from_user_id: userProfile.id,
            to_user_id: buddyUserId,
            trip_id: buddyTripId || userTripId,
            message: message || 'Hi! I\'d love to travel together. Let\'s explore this destination!'
          })
          .select()
          .single();
        
        if (error) throw error;
        
        // Success feedback
        if (onBuddyRequest) {
          onBuddyRequest(data);
        }
        
        setSelectedBuddy(null);
        setMessage('');
        
        // Remove the buddy from the list since request was sent
        setBuddies(prev => prev.filter(b => b.user_id !== buddyUserId));
      }
    } catch (error) {
      console.error('Error sending buddy request:', error);
    } finally {
      setSendingRequest(false);
    }
  };

  const filteredBuddies = buddies.filter(buddy => {
    const matchesSearch = buddy.user_email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         buddy.user_location?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTravelStyle = filters.travelStyle === 'all' || buddy.travel_style === filters.travelStyle;
    
    const matchesAge = filters.ageRange === 'all' || 
                      (filters.ageRange === '18-25' && buddy.user_age >= 18 && buddy.user_age <= 25) ||
                      (filters.ageRange === '26-35' && buddy.user_age >= 26 && buddy.user_age <= 35) ||
                      (filters.ageRange === '36-50' && buddy.user_age >= 36 && buddy.user_age <= 50) ||
                      (filters.ageRange === '50+' && buddy.user_age > 50);

    return matchesSearch && matchesTravelStyle && matchesAge;
  });

  if (loading) {
    return (
      <Card className="border-2 border-gray-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0068EF]"></div>
            <span className="ml-3 text-gray-600">Finding travel buddies...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <Card className="border-2 border-[#0068EF]/20 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center text-[#003C8A]">
            <Users className="mr-2 h-5 w-5" />
            Find Travel Buddies
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name, location, or interests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Travel Style</label>
                <select
                  value={filters.travelStyle}
                  onChange={(e) => setFilters(prev => ({ ...prev, travelStyle: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="all">All Styles</option>
                  <option value="budget">Budget</option>
                  <option value="mid-range">Mid-range</option>
                  <option value="luxury">Luxury</option>
                  <option value="backpacker">Backpacker</option>
                  <option value="business">Business</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Age Range</label>
                <select
                  value={filters.ageRange}
                  onChange={(e) => setFilters(prev => ({ ...prev, ageRange: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="all">All Ages</option>
                  <option value="18-25">18-25</option>
                  <option value="26-35">26-35</option>
                  <option value="36-50">36-50</option>
                  <option value="50+">50+</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
                <Input
                  placeholder="Filter by destination"
                  value={filters.destination}
                  onChange={(e) => setFilters(prev => ({ ...prev, destination: e.target.value }))}
                />
              </div>
            </div>

            <p className="text-sm text-gray-600">
              Found {filteredBuddies.length} potential travel companions
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Buddy List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBuddies.map((buddy) => (
          <Card key={buddy.user_id} className="border-2 border-gray-200 hover:border-[#0068EF] transition-all hover:shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {buddy.user_email?.charAt(0)?.toUpperCase() || 'T'}
                  </div>
                  <div className="ml-3">
                    <h3 className="font-semibold text-[#003C8A]">
                      {buddy.user_email?.split('@')[0] || 'Traveler'}
                    </h3>
                    <div className="flex items-center text-sm text-gray-600">
                      <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                      <span>{buddy.compatibility_score ? (buddy.compatibility_score * 100).toFixed(0) : 85}% match</span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-[#0068EF] text-[#0068EF] hover:bg-blue-50"
                >
                  <Heart className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-3 mb-4">
                {buddy.user_location && (
                  <div className="flex items-center text-sm">
                    <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="font-medium">{buddy.user_location}</span>
                  </div>
                )}
                
                {buddy.user_age && (
                  <div className="flex items-center text-sm">
                    <Users className="h-4 w-4 mr-2 text-gray-500" />
                    <span>{buddy.user_age} years old</span>
                  </div>
                )}

                {buddy.travel_style && (
                  <div className="flex items-center text-sm">
                    <Globe className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="capitalize">{buddy.travel_style} traveler</span>
                  </div>
                )}

                {buddy.user_bio && (
                  <p className="text-sm text-gray-600 line-clamp-2">{buddy.user_bio}</p>
                )}
              </div>

              {/* Interests */}
              {buddy.interests && buddy.interests.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-4">
                  {buddy.interests.slice(0, 3).map((interest, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs bg-blue-50 text-[#0068EF]">
                      {interest}
                    </Badge>
                  ))}
                  {buddy.interests.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{buddy.interests.length - 3} more
                    </Badge>
                  )}
                </div>
              )}

              {/* Preferred Destinations */}
              {buddy.preferred_destinations && buddy.preferred_destinations.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-4">
                  {buddy.preferred_destinations.slice(0, 2).map((dest, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs bg-green-50 text-green-600">
                      <Globe className="h-3 w-3 mr-1" />
                      {dest}
                    </Badge>
                  ))}
                  {buddy.preferred_destinations.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{buddy.preferred_destinations.length - 2} more
                    </Badge>
                  )}
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 border-[#0068EF] text-[#0068EF] hover:bg-blue-50"
                  onClick={() => setSelectedBuddy(buddy)}
                >
                  <MessageCircle className="h-4 w-4 mr-1" />
                  Connect
                </Button>
                <Button
                  size="sm"
                  className="bg-[#0068EF] hover:bg-[#0055A5]"
                  onClick={() => sendBuddyRequest(buddy.user_id, null)}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredBuddies.length === 0 && !loading && (
        <Card className="border-2 border-gray-200">
          <CardContent className="p-8 text-center">
            <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No travel buddies found</h3>
            <p className="text-gray-500 mb-4">
              Try adjusting your search filters or check back later for new travelers.
            </p>
            <Button 
              variant="outline" 
              className="border-[#0068EF] text-[#0068EF]"
              onClick={() => {
                setSearchQuery('');
                setFilters({ travelStyle: 'all', ageRange: 'all', destination: '' });
              }}
            >
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Message Modal */}
      {selectedBuddy && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center">
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Connect with {selectedBuddy.user_email?.split('@')[0]}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedBuddy(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold mr-3">
                    {selectedBuddy.user_email?.charAt(0)?.toUpperCase()}
                  </div>
                  <div>
                    <div className="font-medium">{selectedBuddy.user_email?.split('@')[0]}</div>
                    <div className="text-sm text-gray-600">{selectedBuddy.user_location}</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <Star className="h-4 w-4 mr-2 text-yellow-500" />
                  <span className="text-sm">{(selectedBuddy.compatibility_score * 100).toFixed(0)}% compatibility</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Message (optional)</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Hi! I'd love to travel together. Let's explore this destination!"
                  className="w-full p-3 border border-gray-300 rounded-lg resize-none"
                  rows={3}
                />
              </div>
              
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setSelectedBuddy(null)}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-[#0068EF] hover:bg-[#0055A5]"
                  onClick={() => sendBuddyRequest(selectedBuddy.user_id, null)}
                  disabled={sendingRequest}
                >
                  {sendingRequest ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send Request
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}