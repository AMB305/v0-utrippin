import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MapPin, Calendar, Share, Heart, Edit3 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ShareTripDialog } from '@/components/ShareTripDialog';

interface TripData {
  response?: string;
  tripCards?: Array<{
    type: 'hotel' | 'flight' | 'activity';
    title: string;
    description: string;
    price?: string;
    rating?: number;
    duration?: string;
  }>;
  recommendations?: {
    flights?: string;
    hotels?: string;
  };
  mapLocation?: string;
  quickReplies?: string[];
  [key: string]: any; // Allow additional properties
}

interface SavedTrip {
  id: string;
  trip_name: string;
  destination: string;
  summary: string;
  trip_data: TripData | any; // More flexible type
  created_at: string;
  image_url?: string;
  is_favorite: boolean;
}

export const TripBoard: React.FC = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [trip, setTrip] = useState<SavedTrip | null>(null);
  const [loading, setLoading] = useState(true);
  const [showShareDialog, setShowShareDialog] = useState(false);

  useEffect(() => {
    const fetchTrip = async () => {
      if (!tripId) {
        navigate('/my-trips');
        return;
      }

      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          toast({
            title: "Authentication required",
            description: "Please sign in to view your trips",
            variant: "destructive",
          });
          navigate('/');
          return;
        }

        const { data, error } = await supabase
          .from('saved_trips')
          .select('*')
          .eq('id', tripId)
          .eq('user_id', user.id)
          .single();

        if (error) {
          console.error('Error fetching trip:', error);
          toast({
            title: "Trip not found",
            description: "The requested trip could not be found.",
            variant: "destructive",
          });
          navigate('/my-trips');
          return;
        }

        setTrip(data);
      } catch (error) {
        console.error('Error fetching trip:', error);
        toast({
          title: "Error",
          description: "Failed to load trip data.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTrip();
  }, [tripId, navigate, toast]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getRatingStars = (rating?: number) => {
    if (!rating) return '';
    return '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading your trip...</div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Trip not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-black/90 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/my-trips')}
                className="text-white hover:bg-gray-800"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold">{trip.trip_name}</h1>
                <div className="flex items-center gap-4 text-gray-400 text-sm">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{trip.destination}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>Created {formatDate(trip.created_at)}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                <Edit3 className="w-4 h-4 mr-1" />
                Edit
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="border-gray-700 text-gray-300 hover:bg-gray-800"
                onClick={() => setShowShareDialog(true)}
              >
                <Share className="w-4 h-4 mr-1" />
                Share
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="border-orange-500 text-orange-400 hover:bg-orange-500/10 hover:text-orange-300"
                onClick={() => {
                  toast({
                    title: "Connect with Travel Agent",
                    description: "Feature coming soon! Get personalized assistance with your trip.",
                  });
                }}
              >
                <Share className="w-4 h-4 mr-1" />
                Share with Travel Agent
              </Button>
              <Button variant="outline" size="sm" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                <Heart className={`w-4 h-4 mr-1 ${trip.is_favorite ? 'fill-red-500 text-red-500' : ''}`} />
                {trip.is_favorite ? 'Favorited' : 'Favorite'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Trip Summary */}
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <h2 className="text-xl font-semibold mb-4">Trip Overview</h2>
              <p className="text-gray-300 leading-relaxed">
                {trip.trip_data?.response || trip.summary}
              </p>
            </div>

            {/* Trip Cards */}
            {trip.trip_data?.tripCards && trip.trip_data.tripCards.length > 0 && (
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                <h2 className="text-xl font-semibold mb-4">Recommendations</h2>
                <div className="grid gap-4">
                  {trip.trip_data.tripCards.map((card, index) => (
                    <div key={index} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-lg">{card.title}</h3>
                        <span className="text-xs bg-blue-600 px-2 py-1 rounded capitalize">
                          {card.type}
                        </span>
                      </div>
                      
                      <p className="text-gray-300 text-sm mb-3 whitespace-pre-line">
                        {card.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm">
                          {card.price && (
                            <span className="text-green-400 font-semibold">{card.price}</span>
                          )}
                          {card.rating && (
                            <span className="text-yellow-400">
                              {getRatingStars(card.rating)} ({card.rating})
                            </span>
                          )}
                          {card.duration && (
                            <span className="text-gray-400">{card.duration}</span>
                          )}
                        </div>
                        
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                          Book Now
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Actions */}
            {trip.trip_data?.quickReplies && trip.trip_data.quickReplies.length > 0 && (
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
                <div className="flex flex-wrap gap-2">
                  {trip.trip_data.quickReplies.map((reply, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="border-gray-700 text-gray-300 hover:bg-gray-800"
                    >
                      {reply}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Map Placeholder */}
            {trip.trip_data?.mapLocation && (
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                <h3 className="text-lg font-semibold mb-4">Location</h3>
                <div className="bg-gray-800 rounded-lg h-48 flex items-center justify-center">
                  <div className="text-center text-gray-400">
                    <MapPin className="w-8 h-8 mx-auto mb-2" />
                    <p className="text-sm">{trip.trip_data.mapLocation}</p>
                    <p className="text-xs">Map integration coming soon</p>
                  </div>
                </div>
              </div>
            )}

            {/* Booking Links */}
            {trip.trip_data?.recommendations && (
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                <h3 className="text-lg font-semibold mb-4">Quick Booking</h3>
                <div className="space-y-3">
                  {trip.trip_data.recommendations.flights && (
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      ✈️ {trip.trip_data.recommendations.flights}
                    </Button>
                  )}
                  {trip.trip_data.recommendations.hotels && (
                    <Button className="w-full bg-green-600 hover:bg-green-700">
                      🏨 {trip.trip_data.recommendations.hotels}
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* Notes Section */}
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <h3 className="text-lg font-semibold mb-4">Notes</h3>
              <textarea
                placeholder="Add your travel notes here..."
                className="w-full h-32 bg-gray-800 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 resize-none"
              />
              <Button size="sm" className="mt-3 bg-blue-600 hover:bg-blue-700">
                Save Notes
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Share Dialog */}
      {trip && (
        <ShareTripDialog
          open={showShareDialog}
          onOpenChange={setShowShareDialog}
          tripId={trip.id}
          tripName={trip.trip_name}
        />
      )}
    </div>
  );
};

export default TripBoard;