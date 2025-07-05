import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  Bookmark, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Users, 
  Star,
  Eye,
  Share2,
  Download,
  Trash2,
  Heart
} from 'lucide-react';
import { travelDb } from '../../hooks/useSupabase';

export default function SavedItineraries({ userId }) {
  const [savedTrips, setSavedTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      loadSavedItineraries();
    }
  }, [userId]);

  const loadSavedItineraries = async () => {
    setLoading(true);
    try {
      const { data, error } = await travelDb.getSavedItineraries(userId);
      if (error) throw error;
      setSavedTrips(data || []);
    } catch (error) {
      console.error('Error loading saved itineraries:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeSavedItinerary = async (savedId) => {
    try {
      const { error } = await supabase
        .from('saved_itineraries')
        .delete()
        .eq('id', savedId);
      
      if (error) throw error;
      
      setSavedTrips(prev => prev.filter(item => item.id !== savedId));
    } catch (error) {
      console.error('Error removing saved itinerary:', error);
    }
  };

  if (loading) {
    return (
      <Card className="border-2 border-gray-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0068EF]"></div>
            <span className="ml-3 text-gray-600">Loading saved itineraries...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (savedTrips.length === 0) {
    return (
      <Card className="border-2 border-gray-200">
        <CardContent className="p-8 text-center">
          <Bookmark className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No saved itineraries</h3>
          <p className="text-gray-500 mb-4">
            Start exploring and save interesting trips to build your travel inspiration collection.
          </p>
          <Button variant="outline" className="border-[#0068EF] text-[#0068EF]">
            Explore Public Trips
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[#003C8A]">Saved Itineraries</h2>
        <Badge variant="outline" className="text-[#0068EF] border-[#0068EF]">
          {savedTrips.length} saved
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {savedTrips.map((savedItem) => {
          const trip = savedItem.trip;
          const itinerary = trip.itinerary_json;
          
          return (
            <Card key={savedItem.id} className="border-2 border-gray-200 hover:border-[#0068EF] transition-all hover:shadow-lg overflow-hidden">
              <div className="relative">
                {/* Trip Image Placeholder */}
                <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <div className="text-center text-white">
                    <MapPin className="h-8 w-8 mx-auto mb-2" />
                    <h3 className="font-bold text-lg">{trip.destination}</h3>
                  </div>
                </div>
                
                <div className="absolute top-3 left-3">
                  <Badge className="bg-[#FF6200] text-white">
                    <Bookmark className="h-3 w-3 mr-1" />
                    Saved
                  </Badge>
                </div>
                
                <div className="absolute top-3 right-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-white/90 hover:bg-white border-red-300 text-red-600"
                    onClick={() => removeSavedItinerary(savedItem.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <CardContent className="p-6">
                <div className="mb-4">
                  <h3 className="font-bold text-lg text-[#003C8A] mb-2">{trip.title}</h3>
                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <Users className="h-4 w-4 mr-1" />
                    <span>by {trip.user?.name || 'Anonymous'}</span>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                    <span>
                      {trip.start_date && trip.end_date 
                        ? `${new Date(trip.start_date).toLocaleDateString()} - ${new Date(trip.end_date).toLocaleDateString()}`
                        : 'Flexible dates'
                      }
                    </span>
                  </div>
                  
                  {trip.budget && (
                    <div className="flex items-center text-sm">
                      <DollarSign className="h-4 w-4 mr-2 text-gray-500" />
                      <span>${trip.budget} {trip.currency || 'USD'}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center text-sm">
                    <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                    <span>{trip.duration_days || 0} days</span>
                  </div>
                </div>

                {itinerary && (
                  <div className="mb-4">
                    <div className="text-sm text-gray-600 mb-2">Highlights:</div>
                    <div className="flex flex-wrap gap-1">
                      {itinerary.days?.slice(0, 2).map((day, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs bg-blue-50 text-[#0068EF]">
                          {day.morning?.activity || `Day ${day.day}`}
                        </Badge>
                      ))}
                      {itinerary.days?.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{itinerary.days.length - 2} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                {savedItem.notes && (
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <div className="text-xs text-gray-500 mb-1">Your notes:</div>
                    <div className="text-sm">{savedItem.notes}</div>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 border-[#0068EF] text-[#0068EF] hover:bg-blue-50"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-gray-300 text-gray-600 hover:bg-gray-50"
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-gray-300 text-gray-600 hover:bg-gray-50"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}