import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
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
  Download,
  Edit,
  Trash2,
  Globe,
  Heart,
  MessageCircle,
  Star,
  Clock,
  DollarSign,
  Filter,
  Search
} from 'lucide-react';
import Header from '../components/layout/header';
import Footer from '../components/layout/footer';
import SEOHead from '../components/common/seo-head';
import TravelBuddyFinder from '../components/travel/TravelBuddyFinder';
import SavedItineraries from '../components/travel/SavedItineraries';
import { useSupabase } from '../hooks/useSupabase';

export default function TravelPlannerPage() {
  const { user, supabase } = useSupabase();
  const [userTrips, setUserTrips] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('my-trips');
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    bio: '',
    location: '',
    age: '',
    travel_style: 'mid-range',
    interests: [],
    preferred_destinations: [],
    languages_spoken: []
  });

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    setLoading(true);
    try {
      // Get user profile
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('email', user.email)
        .single();
      
      if (profile) {
        setUserProfile(profile);
        setProfileForm({
          bio: profile.bio || '',
          location: profile.location || '',
          age: profile.age || '',
          travel_style: profile.travel_style || 'mid-range',
          interests: profile.interests || [],
          preferred_destinations: profile.preferred_destinations || [],
          languages_spoken: profile.languages_spoken || []
        });

        // Get user trips
        const { data: trips } = await supabase
          .from('trips')
          .select('*')
          .eq('user_id', profile.id)
          .order('created_at', { ascending: false });
        
        setUserTrips(trips || []);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async () => {
    if (!userProfile) return;

    try {
      const { error } = await supabase
        .from('users')
        .update({
          bio: profileForm.bio,
          location: profileForm.location,
          age: profileForm.age ? parseInt(profileForm.age) : null,
          travel_style: profileForm.travel_style,
          interests: profileForm.interests,
          preferred_destinations: profileForm.preferred_destinations,
          languages_spoken: profileForm.languages_spoken
        })
        .eq('id', userProfile.id);

      if (error) throw error;

      setEditingProfile(false);
      loadUserData(); // Refresh data
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleBuddyRequest = (requestData) => {
    console.log('Buddy request sent:', requestData);
  };

  const addInterest = (interest) => {
    if (interest && !profileForm.interests.includes(interest)) {
      setProfileForm(prev => ({
        ...prev,
        interests: [...prev.interests, interest]
      }));
    }
  };

  const removeInterest = (interest) => {
    setProfileForm(prev => ({
      ...prev,
      interests: prev.interests.filter(i => i !== interest)
    }));
  };

  const addDestination = (destination) => {
    if (destination && !profileForm.preferred_destinations.includes(destination)) {
      setProfileForm(prev => ({
        ...prev,
        preferred_destinations: [...prev.preferred_destinations, destination]
      }));
    }
  };

  const removeDestination = (destination) => {
    setProfileForm(prev => ({
      ...prev,
      preferred_destinations: prev.preferred_destinations.filter(d => d !== destination)
    }));
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
              <div className="text-2xl font-bold text-[#003C8A]">
                {userTrips.filter(t => t.status === 'completed').length}
              </div>
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

                        {trip.budget && (
                          <div className="flex items-center text-sm">
                            <DollarSign className="h-4 w-4 mr-2 text-gray-500" />
                            <span>${trip.budget} {trip.currency || 'USD'}</span>
                          </div>
                        )}
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
            <SavedItineraries userId={userProfile?.id} />
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <Card className="border-2 border-gray-200">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-[#003C8A]">Travel Profile</CardTitle>
                  <Button
                    variant="outline"
                    onClick={() => setEditingProfile(!editingProfile)}
                    className="border-[#0068EF] text-[#0068EF]"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    {editingProfile ? 'Cancel' : 'Edit Profile'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {editingProfile ? (
                  <div className="space-y-6">
                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          value={profileForm.location}
                          onChange={(e) => setProfileForm(prev => ({ ...prev, location: e.target.value }))}
                          placeholder="City, Country"
                        />
                      </div>
                      <div>
                        <Label htmlFor="age">Age</Label>
                        <Input
                          id="age"
                          type="number"
                          value={profileForm.age}
                          onChange={(e) => setProfileForm(prev => ({ ...prev, age: e.target.value }))}
                          placeholder="Your age"
                        />
                      </div>
                    </div>

                    {/* Bio */}
                    <div>
                      <Label htmlFor="bio">Bio</Label>
                      <textarea
                        id="bio"
                        value={profileForm.bio}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, bio: e.target.value }))}
                        placeholder="Tell other travelers about yourself..."
                        className="w-full p-3 border border-gray-300 rounded-lg resize-none"
                        rows={3}
                      />
                    </div>

                    {/* Travel Style */}
                    <div>
                      <Label htmlFor="travel_style">Travel Style</Label>
                      <select
                        id="travel_style"
                        value={profileForm.travel_style}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, travel_style: e.target.value }))}
                        className="w-full p-3 border border-gray-300 rounded-lg"
                      >
                        <option value="budget">Budget Traveler</option>
                        <option value="mid-range">Mid-range</option>
                        <option value="luxury">Luxury</option>
                        <option value="backpacker">Backpacker</option>
                        <option value="business">Business</option>
                      </select>
                    </div>

                    {/* Interests */}
                    <div>
                      <Label>Interests</Label>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {profileForm.interests.map((interest, idx) => (
                          <Badge key={idx} variant="secondary" className="bg-blue-50 text-[#0068EF]">
                            {interest}
                            <button
                              onClick={() => removeInterest(interest)}
                              className="ml-2 text-red-500 hover:text-red-700"
                            >
                              ×
                            </button>
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add an interest"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              addInterest(e.target.value);
                              e.target.value = '';
                            }
                          }}
                        />
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {['Photography', 'Food', 'Culture', 'Adventure', 'History', 'Nature', 'Nightlife', 'Art'].map(interest => (
                          <Button
                            key={interest}
                            variant="outline"
                            size="sm"
                            onClick={() => addInterest(interest)}
                            className="text-xs"
                          >
                            + {interest}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Preferred Destinations */}
                    <div>
                      <Label>Preferred Destinations</Label>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {profileForm.preferred_destinations.map((dest, idx) => (
                          <Badge key={idx} variant="secondary" className="bg-green-50 text-green-600">
                            {dest}
                            <button
                              onClick={() => removeDestination(dest)}
                              className="ml-2 text-red-500 hover:text-red-700"
                            >
                              ×
                            </button>
                          </Badge>
                        ))}
                      </div>
                      <Input
                        placeholder="Add a destination"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            addDestination(e.target.value);
                            e.target.value = '';
                          }
                        }}
                      />
                    </div>

                    {/* Save Button */}
                    <div className="flex gap-3">
                      <Button
                        onClick={handleProfileUpdate}
                        className="bg-[#0068EF] hover:bg-[#0055A5]"
                      >
                        Save Changes
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setEditingProfile(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Profile Display */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-semibold text-gray-700 mb-2">Basic Info</h3>
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                            <span>{userProfile?.location || 'Not specified'}</span>
                          </div>
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-2 text-gray-500" />
                            <span>{userProfile?.age ? `${userProfile.age} years old` : 'Age not specified'}</span>
                          </div>
                          <div className="flex items-center">
                            <Globe className="h-4 w-4 mr-2 text-gray-500" />
                            <span className="capitalize">{userProfile?.travel_style || 'Not specified'} traveler</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-semibold text-gray-700 mb-2">Bio</h3>
                        <p className="text-gray-600">
                          {userProfile?.bio || 'No bio added yet. Click edit to add your travel story!'}
                        </p>
                      </div>
                    </div>

                    {/* Interests */}
                    {userProfile?.interests && userProfile.interests.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-gray-700 mb-2">Interests</h3>
                        <div className="flex flex-wrap gap-2">
                          {userProfile.interests.map((interest, idx) => (
                            <Badge key={idx} variant="secondary" className="bg-blue-50 text-[#0068EF]">
                              {interest}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Preferred Destinations */}
                    {userProfile?.preferred_destinations && userProfile.preferred_destinations.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-gray-700 mb-2">Dream Destinations</h3>
                        <div className="flex flex-wrap gap-2">
                          {userProfile.preferred_destinations.map((dest, idx) => (
                            <Badge key={idx} variant="secondary" className="bg-green-50 text-green-600">
                              <Globe className="h-3 w-3 mr-1" />
                              {dest}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
}