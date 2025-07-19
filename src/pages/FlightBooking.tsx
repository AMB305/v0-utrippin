import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { duffelClient, DuffelOffer, formatPrice } from "@/lib/duffel";
import { supabase } from "@/integrations/supabase/client";
import { calculateTotalWithFee } from "@/utils/calculateTotalWithFee";
import { Plane, Users, CreditCard, Shield, Clock, Star, MessageCircle, CheckCircle, Info, Luggage } from "lucide-react";
import { SeatSelection } from "@/components/SeatSelection";
import { BaggageSelection } from "@/components/BaggageSelection";
import { DuffelSeat } from "@/lib/duffel";
import { FlightDetailsCard } from "@/components/FlightDetailsCard";
import { FareSelection } from "@/components/FareSelection";
import { FareOption } from "@/components/ui/fare-card";
import { extractFlightData, extractBaggageInfo, extractRefundPolicy, formatPrice as formatCurrency } from "@/utils/flightDataHelpers";

const FlightBooking = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [selectedOffer, setSelectedOffer] = useState<DuffelOffer | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingStep, setBookingStep] = useState(1);
  const [lastSearchParams, setLastSearchParams] = useState<any>({});
  const [priceSummary, setPriceSummary] = useState<any>({});
  const [selectedSeats, setSelectedSeats] = useState<DuffelSeat[]>([]);
  const [selectedBaggage, setSelectedBaggage] = useState<Array<{ type: string; quantity: number; price: number }>>([]);
  const [seatPrice, setSeatPrice] = useState(0);
  const [baggagePrice, setBaggagePrice] = useState(0);
  const [selectedFare, setSelectedFare] = useState<FareOption | null>(null);
  const [passengerData, setPassengerData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    title: 'mr'
  });

  const offerId = searchParams.get('offerId');

  useEffect(() => {
    // 🔥 FIXED: Load selected offer and search params from localStorage
    const savedOffer = localStorage.getItem("selectedOffer");
    const savedSearchParams = localStorage.getItem("lastSearchParams");
    
    if (savedOffer) {
      try {
        const parsedOffer = JSON.parse(savedOffer);
        const parsedSearchParams = savedSearchParams ? JSON.parse(savedSearchParams) : {};
        
        console.log('✅ Loaded selected offer from localStorage:', parsedOffer);
        console.log('✅ Loaded search params from localStorage:', parsedSearchParams);
        
        setSelectedOffer(parsedOffer);
        setLastSearchParams(parsedSearchParams);
        
        // Calculate total with 12% markup fee
        const baseAmount = parseFloat(parsedOffer.total_amount);
        const fee = +(baseAmount * 0.12).toFixed(2);
        const total = +(baseAmount + fee).toFixed(2);
        
        setPriceSummary({
          baseAmount,
          fee,
          total,
          breakdown: {
            flightPrice: `$${baseAmount.toFixed(2)}`,
            ourFee: `$${fee.toFixed(2)}`,
            total: `$${total.toFixed(2)}`
          }
        });
        
        setLoading(false);
      } catch (error) {
        console.error('❌ Error parsing saved offer:', error);
        setLoading(false);
      }
    } else {
      console.warn('⚠️ No offer found in localStorage, redirecting to flights');
      navigate('/flights');
    }
  }, [navigate]);

  const handlePassengerDataChange = (field: string, value: string) => {
    setPassengerData(prev => ({ ...prev, [field]: value }));
  };

  const handleBackToResults = () => {
    // Build search URL with saved parameters
    const params = new URLSearchParams();
    Object.entries(lastSearchParams).forEach(([key, value]) => {
      if (value) params.set(key, String(value));
    });
    
    console.log('🔙 Navigating back to results with params:', lastSearchParams);
    navigate(`/flights/results?${params.toString()}`);
  };

  const handleBookingSubmit = async () => {
    setLoading(true);
    
    try {
      // Create Stripe checkout session and process payment
      const { data, error } = await supabase.functions.invoke('create-flight-booking', {
        body: {
          offerId: selectedOffer?.id,
          passengerData,
          totalPrice: priceSummary.total
        }
      });

      if (error) throw error;

      // Redirect to Stripe checkout in a new tab
      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Booking error:', error);
      // Handle error - could show toast notification
    } finally {
      setLoading(false);
    }
  };

  if (loading && !selectedOffer) {
    return (
      <div className="min-h-screen bg-background">
      <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your flight details...</p>
        </div>
      </div>
    );
  }

  if (!selectedOffer) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Flight Not Found</h1>
          <p className="text-muted-foreground mb-8">Sorry, we couldn't find the selected flight.</p>
          <Button onClick={() => navigate('/flights')}>Search New Flights</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Breadcrumb */}
      <div className="border-b bg-travel-light py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/flights">Flights</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink 
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handleBackToResults();
                    }}
                  >
                    Results
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Booking</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            
            <Button 
              variant="outline" 
              onClick={handleBackToResults}
              className="text-blue-600 border-blue-600 hover:bg-blue-50"
            >
              ← Back to Results
            </Button>
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="bg-gradient-card py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-4 max-w-4xl mx-auto">
            <div className={`flex items-center gap-2 ${bookingStep >= 1 ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${bookingStep >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                1
              </div>
              <span className="font-medium hidden sm:block">Flight Details</span>
            </div>
            
            <div className={`w-8 h-0.5 ${bookingStep >= 2 ? 'bg-primary' : 'bg-muted'}`}></div>
            
            <div className={`flex items-center gap-2 ${bookingStep >= 2 ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${bookingStep >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                2
              </div>
              <span className="font-medium hidden sm:block">Extras</span>
            </div>
            
            <div className={`w-8 h-0.5 ${bookingStep >= 3 ? 'bg-primary' : 'bg-muted'}`}></div>
            
            <div className={`flex items-center gap-2 ${bookingStep >= 3 ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${bookingStep >= 3 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                3
              </div>
              <span className="font-medium hidden sm:block">Passenger Info</span>
            </div>
            
            <div className={`w-8 h-0.5 ${bookingStep >= 4 ? 'bg-primary' : 'bg-muted'}`}></div>
            
            <div className={`flex items-center gap-2 ${bookingStep >= 4 ? 'text-travel-gold' : 'text-muted-foreground'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${bookingStep >= 4 ? 'bg-travel-gold text-travel-navy' : 'bg-muted text-muted-foreground'}`}>
                {bookingStep >= 4 ? <CheckCircle className="w-4 h-4" /> : '4'}
              </div>
              <span className="font-medium hidden sm:block">Confirmation</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            
            {bookingStep === 1 && (
              <div className="space-y-6">
                {/* Flight Details Cards */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                    <Plane className="w-5 h-5 text-primary" />
                    Flight Details
                  </h2>
                  
                  {selectedOffer.slices.map((slice, sliceIndex) => {
                    const flightData = extractFlightData(slice, sliceIndex);
                    return (
                      <FlightDetailsCard
                        key={slice.id}
                        flight={flightData}
                        type={sliceIndex === 0 ? "departure" : "return"}
                      />
                    );
                  })}
                </div>

                {/* Fare Selection */}
                <FareSelection 
                  offer={selectedOffer}
                  onFareSelected={(fareId, fareData) => {
                    setSelectedFare(fareData);
                    // Update price summary with fare selection
                    const farePrice = parseFloat(fareData.price.replace(/[^0-9.-]+/g, ""));
                    const fee = +(farePrice * 0.12).toFixed(2);
                    const total = +(farePrice + fee).toFixed(2);
                    
                    setPriceSummary({
                      baseAmount: farePrice,
                      fee,
                      total,
                      breakdown: {
                        flightPrice: `$${farePrice.toFixed(2)}`,
                        ourFee: `$${fee.toFixed(2)}`,
                        total: `$${total.toFixed(2)}`
                      }
                    });
                  }}
                />

                {/* Baggage Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Luggage className="w-5 h-5 text-primary" />
                      Baggage Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {(() => {
                      const baggageInfo = extractBaggageInfo(selectedOffer);
                      return (
                        <div className="space-y-4">
                          <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <h4 className="font-medium text-foreground">Included Baggage</h4>
                              <div className="space-y-1 text-sm text-muted-foreground">
                                <p>✓ {baggageInfo.included.carryOn}</p>
                                <p>✓ {baggageInfo.included.checked}</p>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <h4 className="font-medium text-foreground">Additional Baggage</h4>
                              <div className="space-y-1 text-sm text-muted-foreground">
                                {baggageInfo.available.map((bag, index) => (
                                  <p key={index}>{bag.type}: {bag.price}</p>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </CardContent>
                </Card>
                  
                <div className="flex justify-end">
                  <Button onClick={() => setBookingStep(2)} className="px-8">
                    Continue to Extras
                  </Button>
                </div>
              </div>
            )}

            {bookingStep === 2 && (
              <div className="space-y-6">
                <SeatSelection 
                  offerId={selectedOffer.id}
                  passengerCount={1}
                  onSeatsSelected={(seats, price) => {
                    setSelectedSeats(seats);
                    setSeatPrice(price);
                    setBookingStep(3); // Advance to passenger info step
                  }}
                />
                
                <BaggageSelection 
                  onBaggageSelected={(baggage, price) => {
                    setSelectedBaggage(baggage);
                    setBaggagePrice(price);
                  }}
                />
                
                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setBookingStep(1)}>
                    Back to Flight Details
                  </Button>
                  <Button onClick={() => setBookingStep(3)}>
                    Continue to Passenger Info
                  </Button>
                </div>
              </div>
            )}

            {bookingStep === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    Passenger Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title">Title</Label>
                      <Select value={passengerData.title} onValueChange={(value) => handlePassengerDataChange('title', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mr">Mr.</SelectItem>
                          <SelectItem value="mrs">Mrs.</SelectItem>
                          <SelectItem value="ms">Ms.</SelectItem>
                          <SelectItem value="dr">Dr.</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input 
                        id="firstName"
                        value={passengerData.firstName}
                        onChange={(e) => handlePassengerDataChange('firstName', e.target.value)}
                        placeholder="John"
                      />
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input 
                        id="lastName"
                        value={passengerData.lastName}
                        onChange={(e) => handlePassengerDataChange('lastName', e.target.value)}
                        placeholder="Doe"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="dateOfBirth">Date of Birth</Label>
                      <Input 
                        id="dateOfBirth"
                        type="date"
                        value={passengerData.dateOfBirth}
                        onChange={(e) => handlePassengerDataChange('dateOfBirth', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email"
                        type="email"
                        value={passengerData.email}
                        onChange={(e) => handlePassengerDataChange('email', e.target.value)}
                        placeholder="john@example.com"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input 
                        id="phone"
                        value={passengerData.phone}
                        onChange={(e) => handlePassengerDataChange('phone', e.target.value)}
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setBookingStep(2)}>
                      Back to Extras
                    </Button>
                    <Button onClick={handleBookingSubmit} disabled={loading}>
                      {loading ? 'Processing...' : 'Complete Booking'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {bookingStep === 4 && (
              <Card className="text-center">
                <CardContent className="py-12">
                  <div className="w-16 h-16 bg-travel-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-8 h-8 text-travel-gold" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground mb-4">Booking Confirmed!</h2>
                  <p className="text-muted-foreground mb-6">
                    Your flight has been successfully booked. Confirmation details have been sent to your email.
                  </p>
                  <div className="bg-travel-light rounded-lg p-4 mb-6">
                    <p className="text-sm text-muted-foreground mb-2">Booking Reference</p>
                    <p className="text-xl font-bold text-primary">ABC123XYZ</p>
                  </div>
                  <div className="flex gap-4 justify-center">
                    <Button onClick={() => navigate('/flights')}>
                      Book Another Flight
                    </Button>
                    <Button variant="outline">
                      View Booking Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Price Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-primary" />
                  Price Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Flight Price</span>
                  <span className="font-semibold">{priceSummary.breakdown?.flightPrice || '$0.00'}</span>
                </div>
                 <div className="flex justify-between">
                   <span>Booking Fee</span>
                   <span className="font-semibold">{priceSummary.breakdown?.ourFee || '$0.00'}</span>
                 </div>
                 {seatPrice > 0 && (
                   <div className="flex justify-between">
                     <span>Seat Selection</span>
                     <span className="font-semibold">${seatPrice.toFixed(2)}</span>
                   </div>
                 )}
                 {baggagePrice > 0 && (
                   <div className="flex justify-between">
                     <span>Extra Baggage</span>
                     <span className="font-semibold">${baggagePrice.toFixed(2)}</span>
                   </div>
                 )}
                 <Separator />
                 <div className="flex justify-between text-lg font-bold text-blue-600">
                   <span>Total</span>
                   <span>${((priceSummary.total || 0) + seatPrice + baggagePrice).toFixed(2)}</span>
                 </div>
                
                 <div className="bg-travel-light rounded-lg p-3 mt-4">
                   <div className="flex items-center gap-2 mb-2">
                     <Info className="w-4 h-4 text-primary" />
                     <span className="text-sm font-medium">Price Includes:</span>
                   </div>
                   <ul className="text-xs text-muted-foreground space-y-1">
                     <li>• All taxes and airline fees</li>
                     <li>• Seat selection (at check-in)</li>
                     <li>• 24/7 customer support</li>
                     {selectedFare && (
                       <li>• {selectedFare.name} fare benefits</li>
                     )}
                   </ul>
                 </div>

                 {/* Refund Policy */}
                 {selectedOffer && (
                   <div className="bg-muted/50 rounded-lg p-3 mt-4">
                     <div className="flex items-center gap-2 mb-2">
                       <Shield className="w-4 h-4 text-primary" />
                       <span className="text-sm font-medium">Refund Policy:</span>
                     </div>
                     {(() => {
                       const refundPolicy = extractRefundPolicy(selectedOffer);
                       return (
                         <div className="text-xs text-muted-foreground space-y-1">
                           <p>{refundPolicy.details}</p>
                           {refundPolicy.deadlines.change && (
                             <p>Changes: {refundPolicy.deadlines.change}</p>
                           )}
                         </div>
                       );
                     })()}
                   </div>
                 )}
              </CardContent>
            </Card>

            {/* Security Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-travel-gold" />
                  Secure Booking
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-travel-gold" />
                  <span>SSL encrypted payment</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-travel-gold" />
                  <span>24/7 customer support</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-travel-gold" />
                  <span>Free cancellation (24h)</span>
                </div>
              </CardContent>
            </Card>

            {/* Recent Reviews */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-travel-gold" />
                  Recent Reviews
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { name: "Sarah M.", rating: 5, comment: "Smooth booking process, great flight!" },
                  { name: "Mike R.", rating: 5, comment: "Excellent customer service and fair prices." }
                ].map((review, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">{review.name}</span>
                      <div className="flex items-center">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-travel-gold text-travel-gold" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground italic">"{review.comment}"</p>
                    {index === 0 && <Separator />}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default FlightBooking;