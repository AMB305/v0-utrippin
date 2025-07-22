import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Search, Filter, Grid, List } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { TripCard } from '@/components/TripCard';

interface SavedTrip {
  id: string;
  trip_name: string;
  destination: string;
  summary: string;
  created_at: string;
  image_url?: string;
  is_favorite: boolean;
}

export const MyTrips: React.FC = () => {
  const [trips, setTrips] = useState<SavedTrip[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrips = async () => {
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
          .select('id, trip_name, destination, summary, created_at, image_url, is_favorite')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching trips:', error);
          toast({
            title: "Error loading trips",
            description: "Failed to load your saved trips. Please try again.",
            variant: "destructive",
          });
          return;
        }

        setTrips(data || []);
      } catch (error) {
        console.error('Error fetching trips:', error);
        toast({
          title: "Error",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, [toast, navigate]);

  const filteredTrips = trips.filter(trip =>
    trip.trip_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    trip.destination.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading your trips...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold">My Trips</h1>
              <p className="text-gray-400 mt-2">
                {trips.length === 0 
                  ? "No saved trips yet. Start planning your next adventure!" 
                  : `${trips.length} saved trip${trips.length !== 1 ? 's' : ''}`
                }
              </p>
            </div>
            
            <Button
              onClick={() => navigate('/ai-travel')}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Trip
            </Button>
          </div>

          {/* Search and Filters */}
          {trips.length > 0 && (
            <div className="flex items-center gap-4 mb-6">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search trips..."
                  className="pl-10 bg-gray-900 border-gray-700 text-white placeholder-gray-500"
                />
              </div>
              
              <Button
                variant="outline"
                size="sm"
                className="border-gray-700 text-gray-300 hover:bg-gray-800"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              
              <div className="flex items-center border border-gray-700 rounded-lg">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className={`border-0 rounded-r-none ${
                    viewMode === 'grid' 
                      ? 'bg-gray-700 text-white' 
                      : 'text-gray-400 hover:bg-gray-800'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className={`border-0 rounded-l-none ${
                    viewMode === 'list' 
                      ? 'bg-gray-700 text-white' 
                      : 'text-gray-400 hover:bg-gray-800'
                  }`}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {filteredTrips.length === 0 ? (
          <div className="text-center py-16">
            {searchQuery ? (
              <div>
                <Search className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-300 mb-2">
                  No trips found
                </h3>
                <p className="text-gray-500 mb-6">
                  No trips match your search "{searchQuery}"
                </p>
                <Button
                  onClick={() => setSearchQuery('')}
                  variant="outline"
                  className="border-gray-700 text-gray-300 hover:bg-gray-800"
                >
                  Clear search
                </Button>
              </div>
            ) : (
              <div>
                <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Plus className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-300 mb-2">
                  Start Your First Trip
                </h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                  Chat with Keila to plan your perfect trip and save it to your trip board for easy access.
                </p>
                <Button
                  onClick={() => navigate('/ai-travel')}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Plan Your First Trip
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className={
            viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              : 'space-y-4'
          }>
            {filteredTrips.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTrips;