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
          booking_id: booking.booking_id,
          reason: "Test booking cancellation for Ratehawk certification"
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      setIsCancelled(true);
      toast({
        title: "Booking Cancelled",
        description: `Cancellation ID: ${data.cancellation_id}. Refund: ${data.refund_amount.currency} ${data.refund_amount.amount}`,
      });

      // Log cancellation for certification tracking
      console.log('✅ RATEHAWK CERTIFICATION - Booking cancelled:', {
        booking_id: booking.booking_id,
        cancellation_id: data.cancellation_id,
        refund_amount: data.refund_amount
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
            Confirmation Number: <span className="font-bold">{booking.confirmation_number}</span>
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Hotel Information */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Hotel Details</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium">{booking.hotel_info.name}</h4>
              <div className="flex items-center text-gray-600 mt-1">
                <MapPin className="w-4 h-4 mr-1" />
                <span className="text-sm">{booking.hotel_info.address}</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">Phone: {booking.hotel_info.phone}</p>
            </div>
          </div>

          {/* Guest Information */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Guest Information</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="font-medium">
                {booking.guest_info.first_name} {booking.guest_info.last_name}
              </p>
              <p className="text-sm text-gray-600">{booking.guest_info.email}</p>
            </div>
          </div>

          {/* Booking Details */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Booking Details</h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2 text-gray-600" />
                <span className="text-sm">
                  {booking.booking_details.check_in} → {booking.booking_details.check_out}
                </span>
              </div>
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-2 text-gray-600" />
                <span className="text-sm">
                  {booking.booking_details.guests} guests
                </span>
              </div>
              <p className="text-sm">Room: {booking.booking_details.room_type}</p>
            </div>
          </div>

          {/* Payment Information */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Payment Summary</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span>Total Amount:</span>
                <span className="font-bold text-lg">
                  {booking.total_amount.currency} {booking.total_amount.amount}
                </span>
              </div>
              {booking.cancellation_policy.is_free_cancellation && (
                <Badge variant="secondary" className="mt-2">
                  Free Cancellation until {booking.cancellation_policy.cancellation_deadline}
                </Badge>
              )}
            </div>
          </div>

          {/* Test Booking Notice */}
          {booking.status === 'confirmed_test' && (
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
            
            {!isCancelled && booking.cancellation_policy.is_free_cancellation && (
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
            Booking ID: {booking.booking_id} | Status: {isCancelled ? 'Cancelled' : booking.status}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}