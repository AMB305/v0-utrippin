import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { LoadingStates } from '@/components/LoadingStates';
import { CalendarDays, MapPin, Clock, DollarSign, Download, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';

interface Booking {
  id: string;
  type: string;
  status: string;
  payment_status: string;
  total_price: number;
  created_at: string;
  details: any;
}

const Bookings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'flight' | 'hotel' | 'car' | 'package'>('all');

  useEffect(() => {
    if (user) {
      loadBookings();
    }
  }, [user]);

  const loadBookings = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBookings(data || []);
    } catch (error: any) {
      toast({
        title: "Error loading bookings",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const refreshBookings = async () => {
    setRefreshing(true);
    await loadBookings();
    setRefreshing(false);
    toast({
      title: "Bookings refreshed",
      description: "Your booking information has been updated.",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredBookings = filter === 'all' 
    ? bookings 
    : bookings.filter(booking => booking.type === filter);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <LoadingStates.PageSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold">My Bookings</h1>
              <p className="text-muted-foreground">Manage and view your travel bookings</p>
            </div>
            <Button
              onClick={refreshBookings}
              disabled={refreshing}
              variant="outline"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            {['all', 'flight', 'hotel', 'car', 'package'].map((filterType) => (
              <Button
                key={filterType}
                variant={filter === filterType ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(filterType as any)}
                className="capitalize"
              >
                {filterType === 'all' ? 'All Bookings' : `${filterType}s`}
              </Button>
            ))}
          </div>

          {/* Bookings List */}
          {filteredBookings.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <CalendarDays className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No bookings found</h3>
                <p className="text-muted-foreground">
                  {filter === 'all' 
                    ? "You haven't made any bookings yet." 
                    : `No ${filter} bookings found.`}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredBookings.map((booking) => (
                <Card key={booking.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                      <div>
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <span className="capitalize">{booking.type} Booking</span>
                          <Badge 
                            className={getStatusColor(booking.status)}
                            variant="secondary"
                          >
                            {booking.status}
                          </Badge>
                        </CardTitle>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                          <Clock className="w-4 h-4" />
                          <span>Booked on {format(new Date(booking.created_at), 'MMM dd, yyyy')}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">${booking.total_price}</div>
                        <Badge 
                          className={getPaymentStatusColor(booking.payment_status)}
                          variant="secondary"
                        >
                          {booking.payment_status}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* Booking Details */}
                    {booking.details && (
                      <div className="space-y-3">
                        {booking.details.destination && (
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-muted-foreground" />
                            <span>{booking.details.destination}</span>
                          </div>
                        )}
                        {booking.details.dates && (
                          <div className="flex items-center gap-2">
                            <CalendarDays className="w-4 h-4 text-muted-foreground" />
                            <span>{booking.details.dates}</span>
                          </div>
                        )}
                        {booking.details.passengers && (
                          <div className="text-sm text-muted-foreground">
                            {booking.details.passengers} passenger(s)
                          </div>
                        )}
                        {booking.details.confirmation_number && (
                          <div className="text-sm">
                            <span className="font-medium">Confirmation: </span>
                            <span className="font-mono">{booking.details.confirmation_number}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2 mt-4">
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Download Receipt
                      </Button>
                      {booking.status === 'confirmed' && (
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      )}
                      {booking.status === 'pending' && booking.payment_status === 'pending' && (
                        <Button size="sm">
                          Complete Payment
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Bookings;