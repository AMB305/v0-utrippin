import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { CheckCircle, MapPin, Calendar, Users, Loader2 } from 'lucide-react';

interface BookingConfirmationProps {
  booking: any;
  onNewSearch: () => void;
}

export function BookingConfirmation({ booking, onNewSearch }: BookingConfirmationProps) {
  const [isCancelling, setIsCancelling] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false);
  const { toast } = useToast();

  const handleCancelBooking = async () => {
    setIsCancelling(true);

    try {
      const { data, error } = await supabase.functions.invoke('ratehawk-hotel-cancel', {
        body: {
          reservationId: booking.reservationId
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      setIsCancelled(true);
      toast({
        title: "Booking Cancelled",
        description: `Refund: ${data.refundedAmount.currency} ${data.refundedAmount.amount}`,
      });

      // Log cancellation for certification tracking
      console.log('✅ RATEHAWK CERTIFICATION - Booking cancelled:', {
        reservationId: booking.reservationId,
        refundedAmount: data.refundedAmount
      });

    } catch (error) {
      console.error('Cancellation error:', error);
      toast({
        title: "Cancellation Failed",
        description: "There was an error cancelling your booking. Please contact support.",
        variant: "destructive",
      });
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="w-16 h-16 text-green-600" />
          </div>
          <CardTitle className="text-2xl text-green-600">
            {isCancelled ? 'Booking Cancelled' : 'Booking Confirmed!'}
          </CardTitle>
          <p className="text-gray-600">
            Reservation ID: <span className="font-bold">{booking.reservationId}</span>
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Hotel Information */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Hotel Details</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium">{booking.hotelId === "test_hotel_do_not_book" ? "Mock Hotel Miami Beach" : "Hotel Name"}</h4>
              <div className="flex items-center text-gray-600 mt-1">
                <MapPin className="w-4 h-4 mr-1" />
                <span className="text-sm">123 Ocean Drive, Miami, FL</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">Phone: +1-305-555-HOTEL</p>
            </div>
          </div>

          {/* Guest Information */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Guest Information</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="font-medium">
                {booking.guestName}
              </p>
              <p className="text-sm text-gray-600">Guest Information</p>
            </div>
          </div>

          {/* Booking Details */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Booking Details</h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2 text-gray-600" />
                <span className="text-sm">
                  {booking.checkIn} → {booking.checkOut}
                </span>
              </div>
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-2 text-gray-600" />
                <span className="text-sm">
                  2 guests
                </span>
              </div>
              <p className="text-sm">Room: Deluxe Ocean View</p>
            </div>
          </div>

          {/* Payment Information */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Payment Summary</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span>Total Amount:</span>
                <span className="font-bold text-lg">
                  {booking.totalAmount.currency} {booking.totalAmount.amount}
                </span>
              </div>
              <Badge variant="secondary" className="mt-2">
                Free Cancellation
              </Badge>
            </div>
          </div>

          {/* Test Booking Notice */}
          {booking.hotelId === 'test_hotel_do_not_book' && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800 font-medium">🧪 Test Booking Notice</p>
              <p className="text-yellow-700 text-sm mt-1">
                This is a test booking for Ratehawk certification purposes. 
                You can cancel it below to complete the certification process.
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={onNewSearch}
              className="flex-1"
            >
              New Search
            </Button>
            
            {!isCancelled && (
              <Button
                variant="destructive"
                onClick={handleCancelBooking}
                disabled={isCancelling}
                className="flex-1"
              >
                {isCancelling && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {isCancelling ? 'Cancelling...' : 'Cancel Booking'}
              </Button>
            )}
          </div>

          {/* Booking Status */}
          <div className="text-center text-sm text-gray-500">
            Reservation ID: {booking.reservationId} | Status: {isCancelled ? 'Cancelled' : booking.status}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}