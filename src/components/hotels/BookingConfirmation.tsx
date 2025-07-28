import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { CheckCircle, Calendar, Users, MapPin, Loader2, AlertTriangle } from 'lucide-react';

interface BookingConfirmationProps {
  booking: any;
  hotel: any;
  isMultiRoom?: boolean;
  roomCount?: number;
  onCancelBooking?: () => void;
  onNewSearch?: () => void;
}

export function BookingConfirmation({ 
  booking, 
  hotel, 
  isMultiRoom = false,
  roomCount = 1,
  onCancelBooking,
  onNewSearch 
}: BookingConfirmationProps) {
  const [isCanceling, setIsCanceling] = useState(false);
  const { toast } = useToast();

  const orderId = booking.data?.order_id;
  const isTestBooking = orderId?.includes('test_hotel_do_not_book');

  const handleCancelBooking = async () => {
    if (!orderId) {
      toast({
        title: "Cannot Cancel",
        description: "No order ID found for this booking.",
        variant: "destructive",
      });
      return;
    }

    setIsCanceling(true);
    try {
      console.log(`🔄 Canceling ${isMultiRoom ? 'multi-room' : 'single'} booking:`, orderId);
      
      const { data, error } = await supabase.functions.invoke('ratehawk-hotel-cancel', {
        body: { order_id: orderId }
      });

      if (error) throw error;

      console.log('✅ Cancellation successful:', data);
      toast({
        title: "Booking Cancelled",
        description: isMultiRoom 
          ? `Your ${roomCount} room reservation has been cancelled. Refund: $${data.data?.refunded_amount?.amount || 0}`
          : `Your reservation has been cancelled. Refund: $${data.data?.refunded_amount?.amount || 0}`,
      });

      if (onCancelBooking) onCancelBooking();
    } catch (error) {
      console.error('❌ Cancellation failed:', error);
      toast({
        title: "Cancellation Failed",
        description: "There was an error cancelling your booking. Please contact support.",
        variant: "destructive",
      });
    } finally {
      setIsCanceling(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl text-green-600">
            {isMultiRoom ? 'Multi-Room Booking Confirmed!' : 'Booking Confirmed!'}
          </CardTitle>
          <p className="text-muted-foreground">
            Your {isMultiRoom ? `${roomCount} room ` : ''}reservation has been successfully processed
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Booking Details */}
          <div className="bg-muted/20 p-4 rounded-lg">
            <h3 className="font-semibold mb-3">Booking Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Order ID:</span>
                <span className="font-mono font-medium">{orderId}</span>
              </div>
              <div className="flex justify-between">
                <span>Confirmation:</span>
                <Badge variant="secondary">Instant Confirmed</Badge>
              </div>
              {isMultiRoom && (
                <div className="flex justify-between">
                  <span>Rooms:</span>
                  <span className="font-medium">{roomCount} rooms</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Total Amount:</span>
                <span className="font-medium">${booking.data?.final_price?.amount || 299}</span>
              </div>
            </div>
          </div>

          {/* Hotel Details */}
          <div className="space-y-3">
            <h3 className="font-semibold flex items-center">
              <MapPin className="w-4 h-4 mr-2" />
              Hotel Information
            </h3>
            <div className="space-y-2">
              <p className="font-medium">{hotel?.name || 'Grand Palace Hotel'}</p>
              <p className="text-sm text-muted-foreground">{hotel?.address || 'Paris, France'}</p>
            </div>
          </div>

          {/* Stay Details */}
          <div className="space-y-3">
            <h3 className="font-semibold flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              Stay Details
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Check-in</p>
                <p className="font-medium">Mar 15, 2024</p>
                <p className="text-xs text-muted-foreground">After 3:00 PM</p>
              </div>
              <div>
                <p className="text-muted-foreground">Check-out</p>
                <p className="font-medium">Mar 18, 2024</p>
                <p className="text-xs text-muted-foreground">Before 11:00 AM</p>
              </div>
            </div>
          </div>

          {/* Test Booking Warning */}
          {isTestBooking && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-yellow-800 font-medium">🧪 Test Booking</p>
                  <p className="text-yellow-700 text-sm mt-1">
                    This is a test booking for Ratehawk certification. 
                    {isMultiRoom && ` All ${roomCount} rooms`} will be cancelled automatically.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Next Steps */}
          <div className="space-y-3">
            <h3 className="font-semibold">Next Steps</h3>
            <ul className="text-sm space-y-2 text-muted-foreground">
              <li className="flex items-start">
                <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                Check your email for confirmation details
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                Save this confirmation for your records
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                {isMultiRoom ? 'Present confirmation at hotel for all rooms' : 'Present confirmation at hotel check-in'}
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={handleCancelBooking}
              disabled={isCanceling}
              className="flex-1"
            >
              {isCanceling && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {isCanceling ? 'Cancelling...' : 'Cancel Booking'}
            </Button>
            <Button
              onClick={onNewSearch}
              className="flex-1"
            >
              New Search
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}