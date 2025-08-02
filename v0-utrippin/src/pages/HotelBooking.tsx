import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import ProductLayout from "@/components/ProductLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2, Calendar, Star, CreditCard, CheckCircle, Shield, Info, MapPin, Loader2, RefreshCw } from "lucide-react";
import { useHotelBooking } from "@/hooks/useHotelBooking";
import { useToast } from "@/hooks/use-toast";
import { MultiRoomBookingForm } from "@/components/hotels/MultiRoomBookingForm";
import { supabase } from "@/integrations/supabase/client";

// Hotel data interface for real API data
interface Hotel {
  id: string;
  hotel_id: string;
  name: string;
  star_rating: number;
  images: string[];
  location?: string;
  address: string;
  description?: string;
  amenities?: {
    general?: string[];
    room?: string[];
    business?: string[];
  };
  rates?: Array<{
    book_hash: string;
    room_name: string;
    price: {
      amount: number;
      currency: string;
    };
    payment_type: string;
    cancellation_info?: {
      free_cancellation_before?: string;
    };
  }>;
  policies?: {
    cancellation?: string;
    check_in?: string;
    check_out?: string;
  };
}

const HotelBooking = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [hotelLoading, setHotelLoading] = useState(true);
  const [prebookId, setPrebookId] = useState<string | null>(null);
  const [isMultiRoom, setIsMultiRoom] = useState(false);
  
  // Add prebook functionality
  const handlePrebook = async (hotel: any, multiRoom: boolean = false) => {
    setHotelLoading(true);
    try {
      const searchData = {
        adults: parseInt(searchParams.get('adults') || '2'),
        children: parseInt(searchParams.get('children') || '0'),
        rooms: parseInt(searchParams.get('rooms') || '1')
      };
      
      console.log('🧪 PREBOOK DEBUG:', {
        multiRoom,
        searchData,
        roomsParam: searchParams.get('rooms')
      });
      
      const mockBookHash = `bh-${Date.now()}-${hotel.id}`;
      
      // Create rooms array for multi-room bookings
      let roomsArray = undefined;
      if (multiRoom) {
        const totalAdults = searchData.adults;
        const totalRooms = searchData.rooms;
        const adultsPerRoom = Math.floor(totalAdults / totalRooms);
        const extraAdults = totalAdults % totalRooms;
        
        roomsArray = Array.from({ length: totalRooms }, (_, index) => ({
          adults: adultsPerRoom + (index < extraAdults ? 1 : 0),
          children: []
        }));
        
        console.log('🧪 Generated rooms array:', roomsArray);
      }
      
      const { data, error } = await supabase.functions.invoke('ratehawk-hotel-prebook', {
        body: { 
          book_hash: mockBookHash,
          rooms: roomsArray
        }
      });

      if (error) throw error;
      
      setRateKey(data.data.book_hash);
      setPrebookId(data.data.book_hash);
      console.log('✅ Prebook successful:', data.data.book_hash);
      
      toast({
        title: "Room Pre-booked",
        description: multiRoom ? `${searchData.rooms} rooms reserved for 30 minutes` : "Room reserved for 30 minutes",
      });
    } catch (error) {
      console.error('❌ Prebook failed:', error);
      toast({
        title: "Prebook Failed",
        description: "Could not reserve the room(s). Please try again.",
        variant: "destructive",
      });
    } finally {
      setHotelLoading(false);
    }
  };
  
  const {
    bookingData,
    setBookingData,
    searchData,
    hotelId,
    rateKey,
    setRateKey,
    loading,
    rateCheckLoading,
    createBooking,
    checkRatesBeforeBooking,
    getDurationInNights,
    populateSearchDataFromUrl
  } = useHotelBooking();

  // Function to fetch real hotel data
  const fetchHotelData = async (hotelId: string) => {
    try {
      setHotelLoading(true);
      
      const guests = [{
        adults: parseInt(searchParams.get('adults') || '2'),
        children: []
      }];
      
      const { data, error } = await supabase.functions.invoke('ratehawk-hotel-page', {
        body: {
          checkin: searchParams.get('checkInDate') || '',
          checkout: searchParams.get('checkOutDate') || '',
          hotel_id: hotelId,
          guests,
          currency: 'USD',
          language: 'en',
          residency: 'us'
        }
      });

      if (error) {
        console.error('❌ Hotel API error:', error);
        throw error;
      }

      if (data?.status === 'ok' && data?.data) {
        const hotelData = data.data;
        
        // Transform API response to match our Hotel interface
        const transformedHotel: Hotel = {
          id: hotelData.hotel_id,
          hotel_id: hotelData.hotel_id,
          name: hotelData.name,
          star_rating: hotelData.star_rating || 4,
          images: hotelData.images || ['/placeholder.svg'],
          address: hotelData.address || '',
          description: hotelData.description,
          amenities: hotelData.amenities || {},
          rates: hotelData.rates || [],
          policies: hotelData.policies || {}
        };
        
        console.log('✅ Hotel data fetched:', transformedHotel);
        setSelectedHotel(transformedHotel);
        return transformedHotel;
      } else {
        throw new Error('Invalid hotel data received');
      }
    } catch (error) {
      console.error('❌ Failed to fetch hotel data:', error);
      toast({
        title: "Hotel Loading Failed",
        description: "Could not load hotel details. Please try again.",
        variant: "destructive",
      });
      return null;
    } finally {
      setHotelLoading(false);
    }
  };

  useEffect(() => {
    // Populate search data from URL parameters
    populateSearchDataFromUrl(searchParams);
    
    // Check if this is a multi-room booking FIRST
    const rooms = parseInt(searchParams.get('rooms') || '1');
    const multiRoom = rooms > 1;
    const urlHotelId = searchParams.get('hotelId');
    
    setIsMultiRoom(multiRoom);
    
    console.log('🏨 BOOKING PAGE DEBUG - URL Params:', {
      rooms,
      multiRoom,
      hotelId: urlHotelId,
      adults: searchParams.get('adults'),
      children: searchParams.get('children'),
      allParams: Object.fromEntries(searchParams.entries())
    });
    
    if (!urlHotelId) {
      console.error('❌ No hotel ID found in URL parameters');
      setHotelLoading(false);
      return;
    }
    
    // Fetch real hotel data and then prebook
    const loadHotelAndPrebook = async () => {
      const hotel = await fetchHotelData(urlHotelId);
      if (hotel) {
        handlePrebook(hotel, multiRoom);
      }
    };
    
    loadHotelAndPrebook();
  }, [searchParams]);

  const calculateTotalPrice = () => {
    if (!selectedHotel || !selectedHotel.rates?.[0]) return 0;
    const nights = getDurationInNights();
    const pricePerNight = selectedHotel.rates[0].price.amount;
    const basePrice = pricePerNight * nights * searchData.rooms;
    const taxes = basePrice * 0.12; // 12% taxes
    return basePrice + taxes;
  };

  const breadcrumbs = [
    { label: "Hotels", href: "/hotels" },
    { label: "Search Results", href: `/hotels/results?${searchParams.toString()}` },
    { label: "Booking", isActive: true }
  ];

  if (hotelLoading) {
    return (
      <ProductLayout breadcrumbs={breadcrumbs}>
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your hotel details...</p>
        </div>
      </ProductLayout>
    );
  }

  if (!selectedHotel) {
    return (
      <ProductLayout breadcrumbs={breadcrumbs}>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Hotel Not Found</h1>
          <p className="text-muted-foreground mb-8">Sorry, we couldn't find the selected hotel.</p>
          <Button onClick={() => navigate('/hotels')}>Search Again</Button>
        </div>
      </ProductLayout>
    );
  }

  return (
    <ProductLayout breadcrumbs={breadcrumbs}>
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hotel Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  Your Hotel
                  {rateKey && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={checkRatesBeforeBooking}
                      disabled={rateCheckLoading}
                      className="ml-auto"
                    >
                      {rateCheckLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      ) : (
                        <RefreshCw className="w-4 h-4 mr-2" />
                      )}
                      Check Current Rate
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-24 h-16 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                    <img
                      src={selectedHotel.images[0]}
                      alt={selectedHotel.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder.svg';
                      }}
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{selectedHotel.name}</h3>
                    <div className="flex items-center gap-1 mt-1">
                      {[...Array(selectedHotel.star_rating)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-travel-gold text-travel-gold" />
                      ))}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <MapPin className="w-3 h-3 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{selectedHotel.address}</span>
                    </div>
                    {selectedHotel.rates?.[0] && (
                      <div className="flex items-center gap-1 mt-1">
                        <span className="text-sm font-medium">${selectedHotel.rates[0].price.amount}/night</span>
                        <span className="text-sm text-muted-foreground">({selectedHotel.rates[0].room_name})</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1">
                    <p className="font-medium">Top Amenities:</p>
                    <ul className="text-muted-foreground space-y-1">
                      {selectedHotel.amenities?.general?.slice(0, 3).map((amenity, index) => (
                        <li key={index} className="flex items-center gap-1">
                          <CheckCircle className="w-3 h-3 text-green-600" />
                          {amenity}
                        </li>
                      )) || (
                        <li className="flex items-center gap-1">
                          <CheckCircle className="w-3 h-3 text-green-600" />
                          Standard hotel amenities
                        </li>
                      )}
                    </ul>
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium">Booking Benefits:</p>
                    <ul className="text-muted-foreground space-y-1">
                      {selectedHotel.rates?.[0]?.cancellation_info?.free_cancellation_before && (
                        <li className="flex items-center gap-1">
                          <CheckCircle className="w-3 h-3 text-green-600" />
                          Free cancellation
                        </li>
                      )}
                      {selectedHotel.policies?.cancellation && (
                        <li className="flex items-center gap-1">
                          <Info className="w-3 h-3 text-blue-600" />
                          {selectedHotel.policies.cancellation}
                        </li>
                      )}
                      <li className="flex items-center gap-1">
                        <CheckCircle className="w-3 h-3 text-green-600" />
                        Instant confirmation
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stay Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Stay Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Check-in</Label>
                    <div className="mt-1">
                      <p className="font-medium">{searchData.checkInDate ? new Date(searchData.checkInDate).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      }) : 'No check-in date selected'}</p>
                      <p className="text-sm text-muted-foreground">After 3:00 PM</p>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Check-out</Label>
                    <div className="mt-1">
                      <p className="font-medium">{searchData.checkOutDate ? new Date(searchData.checkOutDate).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      }) : 'No check-out date selected'}</p>
                      <p className="text-sm text-muted-foreground">Before 11:00 AM</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-muted p-3 rounded-lg">
                  <div className="flex items-center justify-between">
                    <p className="text-sm">
                      <span className="font-medium">Duration:</span> {getDurationInNights()} night{getDurationInNights() > 1 ? 's' : ''}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Guests:</span> {searchData.adults + searchData.children} guest{searchData.adults + searchData.children > 1 ? 's' : ''} in {searchData.rooms} room{searchData.rooms > 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Guest Information - Switch between single and multi-room forms */}
            {isMultiRoom && prebookId ? (
              <MultiRoomBookingForm
                hotel={selectedHotel}
                prebookId={prebookId}
                rooms={(() => {
                  const totalAdults = parseInt(searchParams.get('adults') || '4');
                  const totalRooms = parseInt(searchParams.get('rooms') || '2');
                  const adultsPerRoom = Math.floor(totalAdults / totalRooms);
                  const extraAdults = totalAdults % totalRooms;
                  
                  return Array.from({ length: totalRooms }, (_, index) => ({
                    adults: adultsPerRoom + (index < extraAdults ? 1 : 0),
                    children: []
                  }));
                })()}
                onBookingComplete={(booking) => {
                  toast({
                    title: "Booking Successful!",
                    description: `Your multi-room reservation has been confirmed. Order ID: ${booking.data?.order_id}`,
                  });
                  // Navigate to confirmation page with booking details
                  navigate(`/hotels/confirmation?bookingId=${booking.data?.order_id || 'unknown'}&hotelId=${selectedHotel.hotel_id}`);
                }}
                onBack={() => navigate('/hotels')}
              />
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Guest Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        value={bookingData.firstName}
                        onChange={(e) => setBookingData(prev => ({ ...prev, firstName: e.target.value }))}
                        placeholder="Enter first name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        value={bookingData.lastName}
                        onChange={(e) => setBookingData(prev => ({ ...prev, lastName: e.target.value }))}
                        placeholder="Enter last name"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={bookingData.email}
                        onChange={(e) => setBookingData(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="Enter email address"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        value={bookingData.phone}
                        onChange={(e) => setBookingData(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="Enter phone number"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Additional Preferences */}
            <Card>
              <CardHeader>
                <CardTitle>Additional Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="arrivalTime">Expected Arrival Time</Label>
                    <Select value={bookingData.arrivalTime} onValueChange={(value) => setBookingData(prev => ({ ...prev, arrivalTime: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select arrival time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="afternoon">Afternoon (12:00 - 6:00 PM)</SelectItem>
                        <SelectItem value="evening">Evening (6:00 - 9:00 PM)</SelectItem>
                        <SelectItem value="night">Night (9:00 PM - 12:00 AM)</SelectItem>
                        <SelectItem value="late">Late Night (After 12:00 AM)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="roomPreference">Room Preference</Label>
                    <Select value={bookingData.roomPreference} onValueChange={(value) => setBookingData(prev => ({ ...prev, roomPreference: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="no-preference">No Preference</SelectItem>
                        <SelectItem value="high-floor">High Floor</SelectItem>
                        <SelectItem value="quiet-room">Quiet Room</SelectItem>
                        <SelectItem value="city-view">City View</SelectItem>
                        <SelectItem value="near-elevator">Near Elevator</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="specialRequests">Special Requests</Label>
                  <Textarea
                    id="specialRequests"
                    value={bookingData.specialRequests}
                    onChange={(e) => setBookingData(prev => ({ ...prev, specialRequests: e.target.value }))}
                    placeholder="Any special requests or requirements..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Booking Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Room rate ({getDurationInNights()} nights)</span>
                    <span>${selectedHotel.rates?.[0] ? selectedHotel.rates[0].price.amount * getDurationInNights() * searchData.rooms : 0}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span>Taxes & fees</span>
                    <span>${selectedHotel.rates?.[0] ? Math.round(selectedHotel.rates[0].price.amount * getDurationInNights() * searchData.rooms * 0.12) : 0}</span>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>${Math.round(calculateTotalPrice())}</span>
                </div>
                
                <div className="space-y-2 text-sm text-muted-foreground">
                  {selectedHotel.rates?.[0]?.cancellation_info?.free_cancellation_before && (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Free cancellation until 24h before check-in</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-blue-600" />
                    <span>Secure payment processing</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Info className="w-4 h-4 text-orange-600" />
                    <span>Instant confirmation</span>
                  </div>
                </div>
                
                {!isMultiRoom && (
                  <Button 
                    onClick={async () => {
                      const result = await createBooking();
                      if (result.success) {
                        toast({
                          title: "Booking Successful!",
                          description: `Your reservation has been confirmed. Order ID: ${result.data?.order_id}`,
                        });
                        // Navigate to confirmation page with booking details
                        navigate(`/hotels/confirmation?bookingId=${result.data?.order_id || 'unknown'}&hotelId=${selectedHotel.hotel_id}`);
                      } else {
                        toast({
                          title: "Booking Failed",
                          description: result.error?.message || "Something went wrong. Please try again.",
                          variant: "destructive",
                        });
                      }
                    }}
                    className="w-full"
                    size="lg"
                    disabled={loading || !bookingData.firstName || !bookingData.lastName || !bookingData.email || !bookingData.phone}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processing Booking...
                      </>
                    ) : (
                      'Complete Booking'
                    )}
                  </Button>
                )}
                
                <p className="text-xs text-muted-foreground text-center">
                  By booking, you agree to our terms and conditions and the hotel's policies
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProductLayout>
  );
};

export default HotelBooking;
