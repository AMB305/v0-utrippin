import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { MapPin, Calendar, ExternalLink, User, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

interface PublicTripData {
  trip_name: string;
  destination: string;
  summary: string;
  trip_data: any;
  created_at: string;
}

const PublicTripView: React.FC = () => {
  const { shareId } = useParams<{ shareId: string }>();
  const [searchParams] = useSearchParams();
  const isAgentView = searchParams.get('ref') === 'agent';
  const [trip, setTrip] = useState<PublicTripData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPublicTrip = async () => {
      if (!shareId) {
        setError('Invalid trip link');
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('saved_trips')
          .select('trip_name, destination, summary, trip_data, created_at')
          .eq('share_id', shareId)
          .eq('is_public', true)
          .single();

        if (error || !data) {
          setError('Trip not found or no longer public');
          return;
        }

        setTrip(data);
      } catch (err) {
        console.error('Error fetching public trip:', err);
        setError('Failed to load trip');
      } finally {
        setLoading(false);
      }
    };

    fetchPublicTrip();
  }, [shareId]);

  const getRatingStars = (rating?: number) => {
    if (!rating) return '';
    return '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading trip...</div>
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-2">Trip Not Found</h1>
          <p className="text-gray-400">{error || 'This trip is not available'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Agent Context Header */}
      {isAgentView && (
        <div className="bg-orange-900/20 border-b border-orange-700/30">
          <div className="max-w-6xl mx-auto px-4 py-6">
            <div className="flex items-center gap-3 mb-3">
              <User className="w-6 h-6 text-orange-400" />
              <h2 className="text-xl font-semibold text-orange-300">Booking Request from Client</h2>
            </div>
            <p className="text-orange-200 mb-4">
              A client has shared their travel itinerary with you for professional booking assistance. 
              Please review the complete trip details below and contact them directly to discuss arrangements.
            </p>
            <div className="flex items-center gap-2 text-orange-300">
              <Mail className="w-4 h-4" />
              <span className="text-sm">Contact client directly to discuss booking options</span>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2">{trip.trip_name}</h1>
            <div className="flex items-center justify-center gap-4 text-gray-400">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{trip.destination}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>Created {new Date(trip.created_at).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-500">
              {isAgentView ? 'Professional booking request via UTrippin.ai' : 'Public trip shared via UTrippin.ai'}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Trip Summary */}
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <h2 className="text-xl font-semibold mb-4">Trip Overview</h2>
            <p className="text-gray-300 leading-relaxed">
              {trip.trip_data?.response || trip.summary}
            </p>
          </div>

          {/* Trip Recommendations */}
          {trip.trip_data?.tripCards && trip.trip_data.tripCards.length > 0 && (
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <h2 className="text-xl font-semibold mb-4">Recommendations</h2>
              <div className="grid gap-4">
                {trip.trip_data.tripCards.map((card: any, index: number) => (
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
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CTA Section */}
          <div className={`rounded-xl p-6 text-center ${
            isAgentView 
              ? 'bg-gradient-to-r from-orange-600 to-red-600' 
              : 'bg-gradient-to-r from-blue-600 to-purple-600'
          }`}>
            {isAgentView ? (
              <>
                <h3 className="text-xl font-bold mb-2">Ready to Assist This Client?</h3>
                <p className="text-orange-100 mb-4">
                  This client is looking for professional travel booking assistance. Contact them directly to provide quotes and help with reservations.
                </p>
                <div className="text-orange-200 text-sm">
                  Professional travel agent services powered by UTrippin.ai
                </div>
              </>
            ) : (
              <>
                <h3 className="text-xl font-bold mb-2">Plan Your Own Amazing Trip</h3>
                <p className="text-blue-100 mb-4">
                  Create personalized itineraries like this one with our AI travel assistant
                </p>
                <Button 
                  onClick={() => window.open('/', '_blank')}
                  className="bg-white text-blue-600 hover:bg-gray-100"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Try UTrippin.ai
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicTripView;