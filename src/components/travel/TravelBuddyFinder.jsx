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
  Send
} from 'lucide-react';
import { travelDb } from '../../hooks/useSupabase';

export default function TravelBuddyFinder({ userTripId, onBuddyRequest }) {
  const [buddies, setBuddies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBuddy, setSelectedBuddy] = useState(null);
  const [message, setMessage] = useState('');
  const [sendingRequest, setSendingRequest] = useState(false);

  useEffect(() => {
    if (userTripId) {
      loadTravelBuddies();
    }
  }, [userTripId]);

  const loadTravelBuddies = async () => {
    setLoading(true);
    try {
      const { data, error } = await travelDb.findTravelBuddies(userTripId);
      if (error) throw error;
      setBuddies(data || []);
    } catch (error) {
      console.error('Error loading travel buddies:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendBuddyRequest = async (buddyUserId, buddyTripId) => {
    setSendingRequest(true);
    try {
      const { data, error } = await travelDb.sendBuddyRequest({
        from_user_id: userTripId, // This should be the current user's ID
        to_user_id: buddyUserId,
        trip_id: buddyTripId,
        message: message || 'Hi! I\'d love to travel together. Let\'s explore this destination!'
      });
      
      if (error) throw error;
      
      // Success feedback
      if (onBuddyRequest) {
        onBuddyRequest(data);
      }
      
      setSelectedBuddy(null);
      setMessage('');
      
      // Remove the buddy from the list since request was sent
      setBuddies(prev => prev.filter(b => b.buddy_user_id !== buddyUserId));
      
    } catch (error) {
      console.error('Error sending buddy request:', error);
    } finally {
      setSendingRequest(false);
    }
  };

  const filteredBuddies = buddies.filter(buddy =>
    buddy.buddy_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    buddy.buddy_destination.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <div className="flex gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name or destination..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="border-[#0068EF] text-[#0068EF]">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
          <p className="text-sm text-gray-600">
            Found {filteredBuddies.length} potential travel companions with similar destinations and dates
          </p>
        </CardContent>
      </Card>

      {/* Buddy List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBuddies.map((buddy) => (
          <Card key={buddy.buddy_user_id} className="border-2 border-gray-200 hover:border-[#0068EF] transition-all hover:shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {buddy.buddy_name.charAt(0)}
                  </div>
                  <div className="ml-3">
                    <h3 className="font-semibold text-[#003C8A]">{buddy.buddy_name}</h3>
                    <div className="flex items-center text-sm text-gray-600">
                      <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                      <span>{buddy.match_score ? (buddy.match_score * 100).toFixed(0) : 85}% match</span>
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
                <div className="flex items-center text-sm">
                  <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="font-medium">{buddy.buddy_destination}</span>
                </div>
                
                {buddy.common_dates > 0 && (
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                    <span>{buddy.common_dates} overlapping days</span>
                  </div>
                )}

                <div className="flex items-center text-sm">
                  <Globe className="h-4 w-4 mr-2 text-gray-500" />
                  <span>Similar travel style</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1 mb-4">
                <Badge variant="secondary" className="text-xs bg-blue-50 text-[#0068EF]">
                  Photography
                </Badge>
                <Badge variant="secondary" className="text-xs bg-green-50 text-green-600">
                  Food lover
                </Badge>
                <Badge variant="secondary" className="text-xs bg-purple-50 text-purple-600">
                  Culture
                </Badge>
              </div>

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
                  onClick={() => sendBuddyRequest(buddy.buddy_user_id, buddy.buddy_trip_id)}
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
              Try adjusting your trip dates or making your trip public to find more potential companions.
            </p>
            <Button variant="outline" className="border-[#0068EF] text-[#0068EF]">
              Update Trip Settings
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Message Modal */}
      {selectedBuddy && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageCircle className="mr-2 h-5 w-5" />
                Connect with {selectedBuddy.buddy_name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="font-medium">{selectedBuddy.buddy_destination}</span>
                </div>
                <div className="flex items-center">
                  <Star className="h-4 w-4 mr-2 text-yellow-500" />
                  <span className="text-sm">{(selectedBuddy.match_score * 100).toFixed(0)}% compatibility</span>
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
                  onClick={() => sendBuddyRequest(selectedBuddy.buddy_user_id, selectedBuddy.buddy_trip_id)}
                  disabled={sendingRequest}
                >
                  {sendingRequest ? 'Sending...' : 'Send Request'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}