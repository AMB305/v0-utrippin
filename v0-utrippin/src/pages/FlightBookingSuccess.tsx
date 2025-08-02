import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle, Download, Mail, Plane } from "lucide-react";

const FlightBookingSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [bookingData, setBookingData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const sessionId = searchParams.get('session_id');
  const offerId = searchParams.get('offer_id');

  useEffect(() => {
    if (sessionId && offerId) {
      verifyPayment();
    }
  }, [sessionId, offerId]);

  const verifyPayment = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('verify-flight-payment', {
        body: {
          sessionId,
          offerId
        }
      });

      if (error) throw error;

      setBookingData(data);
    } catch (error) {
      console.error('Payment verification error:', error);
      setError('Failed to verify payment. Please contact support.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4 text-destructive">Payment Verification Failed</h1>
          <p className="text-muted-foreground mb-8">{error}</p>
          <Button onClick={() => navigate('/flights')}>Return to Flight Search</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Success Header */}
          <Card className="text-center">
            <CardContent className="py-12">
              <div className="w-16 h-16 bg-travel-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-travel-gold" />
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-4">Booking Confirmed!</h1>
              <p className="text-muted-foreground mb-6">
                Your flight has been successfully booked. Confirmation details have been sent to your email.
              </p>
              
              {bookingData?.booking_reference && (
                <div className="bg-travel-light rounded-lg p-4 mb-6 inline-block">
                  <p className="text-sm text-muted-foreground mb-2">Booking Reference</p>
                  <p className="text-2xl font-bold text-primary">{bookingData.booking_reference}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Flight Details */}
          {bookingData?.order && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plane className="w-5 h-5 text-primary" />
                  Flight Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {bookingData.order.slices?.map((slice: any, index: number) => (
                  <div key={slice.id} className="space-y-4">
                    <h3 className="font-semibold">
                      {index === 0 ? 'Outbound Flight' : 'Return Flight'}
                    </h3>
                    {slice.segments?.map((segment: any) => (
                      <div key={segment.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                              <Plane className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-semibold">{segment.marketing_carrier?.name || 'Airline'}</p>
                              <p className="text-sm text-muted-foreground">
                                {segment.marketing_carrier?.iata_code} • {segment.aircraft?.name}
                              </p>
                            </div>
                          </div>
                          <Badge variant="secondary">Economy</Badge>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div>
                            <p className="text-2xl font-bold">
                              {new Date(segment.departing_at).toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </p>
                            <p className="text-sm text-muted-foreground">{segment.origin.iata_code}</p>
                            <p className="text-xs text-muted-foreground">{segment.origin.city_name}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(segment.departing_at).toLocaleDateString()}
                            </p>
                          </div>
                          
                          <div className="flex flex-col items-center justify-center">
                            <div className="w-full h-0.5 bg-muted relative">
                              <Plane className="w-4 h-4 text-muted-foreground absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-background" />
                            </div>
                            <p className="text-xs text-muted-foreground mt-2">{segment.duration}</p>
                          </div>
                          
                          <div>
                            <p className="text-2xl font-bold">
                              {new Date(segment.arriving_at).toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </p>
                            <p className="text-sm text-muted-foreground">{segment.destination.iata_code}</p>
                            <p className="text-xs text-muted-foreground">{segment.destination.city_name}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(segment.arriving_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Passenger Details */}
          {bookingData?.order?.passengers && (
            <Card>
              <CardHeader>
                <CardTitle>Passenger Information</CardTitle>
              </CardHeader>
              <CardContent>
                {bookingData.order.passengers.map((passenger: any, index: number) => (
                  <div key={passenger.id} className="flex justify-between items-center py-2">
                    <span className="font-medium">
                      {passenger.given_name} {passenger.family_name}
                    </span>
                    <Badge variant="outline">{passenger.type}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => navigate('/flights')} className="px-8">
              Book Another Flight
            </Button>
            <Button variant="outline" className="px-8">
              <Download className="w-4 h-4 mr-2" />
              Download Ticket
            </Button>
            <Button variant="outline" className="px-8">
              <Mail className="w-4 h-4 mr-2" />
              Email Confirmation
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default FlightBookingSuccess;
