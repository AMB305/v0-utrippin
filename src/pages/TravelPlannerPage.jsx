import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  MapPin, 
  Calendar, 
  Users, 
  Bookmark, 
  Plus,
  Plane,
  Hotel,
  Car,
  Camera,
  Settings,
  Share2,
  Download
} from 'lucide-react';
import Header from '../components/layout/header';
import Footer from '../components/layout/footer';
import SEOHead from '../components/common/seo-head';
import TravelBuddyFinder from '../components/travel/TravelBuddyFinder';
import SavedItineraries from '../components/travel/SavedItineraries';
import { useSupabase, travelDb } from '../hooks/useSupabase';

export default function TravelPlannerPage() {
  const { user } = useSupabase();
  const [userTrips, setUserTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('my-trips');

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    setLoading(true);
    try {
      // Get user profile
      const { data: profile } = await travelDb.getUserProfile(user.id);
      
      if (profile) {
        // Get user trips
        const { data: trips } = await travelDb.getUserTrips(profile.id);
        setUserTrips(trips || []);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBuddyRequest = (requestData) => {
    // Handle successful buddy request
    console.log('Buddy request sent:', requestData);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold text-[#003C8A] mb-4">Travel Planner</h1>
          <p className="text-gray-600 mb-8">Sign in to access your travel plans and find travel buddies</p>
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
        title="Travel Planner: Manage Trips & Find Travel Buddies | UTrippin" 
        description="Plan your trips, save itineraries, and connect with travel companions. Your personal travel planning dashboard."
      />
      
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#003C8A] mb-2">Travel Planner</h1>
          <p className="text-gray-600">Manage your trips, save itineraries, and connect with fellow travelers</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-2 border-gray-200">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <MapPin className="h-6 w-6 text-[#0068EF]" />
              </div>
              <div className="text-2xl font-bold text-[#003C8A]">{userTrips.length}</div>
              <div className="text-sm text-gray-600">Planned Trips</div>
            </CardContent>
          </Card>
          
          <Card className="border-2 border-gray-200">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-[#003C8A]">0</div>
              <div className="text-sm text-gray-600">Travel Buddies</div>
            </CardContent>
          </Card>
          
          <Card className="border-2 border-gray-200">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Bookmark className="h-6 w-6 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-[#003C8A]">0</div>
              <div className="text-sm text-gray-600">Saved Trips</div>
            </CardContent>
          </Card>
          
          <Card className="border-2 border-gray-200">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Camera className="h-6 w-6 text-orange-600" />
              </div>
              <div className="text-2xl font-bold text-[#003C8A]">0</div>
              <div className="text-sm text-gray-600">Completed</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-gray-100">
            <TabsTrigger value="my-trips" className="data-[state=active]:bg-white data-[state=active]:text-[#0068EF]">
              My Trips
            </TabsTrigger>
            <TabsTrigger value="find-buddies" className="data-[state=active]:bg-white data-[state=active]:text-[#0068EF]">
              Find Buddies
            </TabsTrigger>
            <TabsTrigger value="saved" className="data-[state=active]:bg-white data-[state=active]:text-[#0068EF]">
              Saved Trips
            </TabsTrigger>
            <TabsTrigger value="profile" className="data-[state=active]:bg-white data-[state=active]:text-[#0068EF]">
              Profile
            </TabsTrigger>
          </TabsList>

          <TabsContent value="my-trips" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-[#003C8A]">My Trips</h2>
              <Button className="bg-[#0068EF] hover:bg-[#0055A5]">
                <Plus className="h-4 w-4 mr-2" />
                Plan New Trip
              </Button>
            </div>

            {loading ? (
              <Card className="border-2 border-gray-200">
                <CardContent className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0068EF] mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading your trips...</p>
                </CardContent>
              </Card>
            ) : userTrips.length === 0 ? (
              <Card className="border-2 border-gray-200">
                <CardContent className="p-8 text-center">
                  <MapPin className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">No trips planned yet</h3>
                  <p className="text-gray-500 mb-4">
                    Start planning your next adventure with our AI travel assistant
                  </p>
                  <Button className="bg-[#0068EF] hover:bg-[#0055A5]">
                    <Plus className="h-4 w-4 mr-2" />
                    Plan Your First Trip
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userTrips.map((trip) => (
                  <Card key={trip.id} className="border-2 border-gray-200 hover:border-[#0068EF] transition-all hover:shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-bold text-lg text-[#003C8A] mb-1">{trip.title}</h3>
                          <div className="flex items-center text-sm text-gray-600">
                            <MapPin className="h-4 w-4 mr-1" />
                            <span>{trip.destination}</span>
                          </div>
                        </div>
                        <Badge className={`${
                          trip.status === 'planning' ? 'bg-blue-100 text-blue-800' :
                          trip.status === 'booked' ? 'bg-green-100 text-green-800' :
                          trip.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {trip.status}
                        </Badge>
                      </div>

                      <div className="space-y-2 mb-4">
                        {trip.start_date && trip.end_date && (
                          <div className="flex items-center text-sm">
                            <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                            <span>
                              {new Date(trip.start_date).toLocaleDateString()} - {new Date(trip.end_date).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                        
                        <div className="flex items-center text-sm">
                          <Users className="h-4 w-4 mr-2 text-gray-500" />
                          <span>{trip.trip_type || 'Solo'} trip</span>
                        </div>
                      </div>

                      {trip.ai_generated && (
                        <Badge variant="outline" className="mb-4 text-xs border-[#0068EF]/20 text-[#0068EF]">
                          AI Generated
                        </Badge>
                      )}

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1 border-[#0068EF] text-[#0068EF]">
                          View Details
                        </Button>
                        <Button variant="outline" size="sm" className="border-gray-300">
                          <Share2 className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="border-gray-300">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="find-buddies" className="space-y-6">
            <TravelBuddyFinder 
              userTripId={userTrips[0]?.id} 
              onBuddyRequest={handleBuddyRequest}
            />
          </TabsContent>

          <TabsContent value="saved" className="space-y-6">
            <SavedItineraries userId={user?.id} />
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <Card className="border-2 border-gray-200">
              <CardHeader>
                <CardTitle className="text-[#003C8A]">Travel Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Profile settings and travel preferences coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
}