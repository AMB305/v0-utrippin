import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import ProductLayout from "@/components/ProductLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  CheckCircle, 
  Building2, 
  Calendar, 
  Users, 
  Mail, 
  Phone, 
  Download, 
  Star,
  MapPin,
  Loader2,
  FileText
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import HotelVoucher from "@/components/HotelVoucher";

// Mock booking data - in real implementation, this would come from API
const mockBookingDetails = {
  bookingReference: "HB-2024-001234",
  status: "confirmed",
  hotel: {
    name: "Grand Palace Hotel",
    starRating: 5,
    address: "123 Luxury Avenue, 1st Arrondissement, Paris, France",
    images: ["/placeholder.svg"]
  },
  checkIn: "2024-03-15",
  checkOut: "2024-03-18",
  guests: {
    adults: 2,
    children: 0,
    rooms: 1
  },
  totalAmount: 855,
  currency: "USD",
  guest: {
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1-555-123-4567"
  },
  amenities: ["Free WiFi", "Swimming Pool", "Fitness Center", "Spa", "Restaurant", "Free Parking"],
  freeCancellation: true,
  breakfastIncluded: true
};

const HotelBookingConfirmation = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [bookingDetails, setBookingDetails] = useState<typeof mockBookingDetails | null>(null);
  const [showVoucher, setShowVoucher] = useState(false);

  const bookingId = searchParams.get('bookingId');
  const hotelbedsReference = searchParams.get('hotelbedsReference');

  useEffect(() => {
    // In real implementation, fetch booking details from API using bookingId
    const fetchBookingDetails = async () => {
      try {
        // Simulate API call
        setTimeout(() => {
          setBookingDetails({
            ...mockBookingDetails,
            bookingReference: hotelbedsReference || mockBookingDetails.bookingReference
          });
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Failed to fetch booking details:', error);
        toast({
          title: "Error Loading Booking",
          description: "Unable to load booking details. Please contact support.",
          variant: "destructive",
        });
        setLoading(false);
      }
    };

    if (bookingId) {
      fetchBookingDetails();
    } else {
      setLoading(false);
    }
  }, [bookingId, hotelbedsReference, toast]);

  const calculateNights = () => {
    if (!bookingDetails) return 0;
    const checkIn = new Date(bookingDetails.checkIn);
    const checkOut = new Date(bookingDetails.checkOut);
    const diffTime = checkOut.getTime() - checkIn.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const downloadVoucher = () => {
    if (bookingDetails) {
      setShowVoucher(true);
    } else {
      toast({
        title: "Download Started",
        description: "Your booking voucher is being prepared for download.",
      });
    }
    // In real implementation, this would generate and download a PDF voucher
  };

  const breadcrumbs = [
    { label: "Hotels", href: "/hotels" },
    { label: "Booking Confirmation", isActive: true }
  ];

  if (loading) {
    return (
      <ProductLayout breadcrumbs={breadcrumbs}>
        <div className="container mx-auto px-4 py-16 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your booking confirmation...</p>
        </div>
      </ProductLayout>
    );
  }

  if (!bookingDetails) {
    return (
      <ProductLayout breadcrumbs={breadcrumbs}>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Booking Not Found</h1>
          <p className="text-muted-foreground mb-8">Sorry, we couldn't find your booking details.</p>
          <Button onClick={() => navigate('/hotels')}>Search Hotels</Button>
        </div>
      </ProductLayout>
    );
  }

  if (showVoucher && bookingDetails) {
    const voucherData = {
      bookingReference: bookingDetails.bookingReference,
      status: bookingDetails.status,
      hotel: {
        name: bookingDetails.hotel.name,
        starRating: bookingDetails.hotel.starRating,
        address: bookingDetails.hotel.address,
        images: bookingDetails.hotel.images
      },
      checkIn: bookingDetails.checkIn,
      checkOut: bookingDetails.checkOut,
      guests: bookingDetails.guests,
      totalAmount: bookingDetails.totalAmount,
      currency: bookingDetails.currency,
      guest: bookingDetails.guest,
      amenities: bookingDetails.amenities,
      freeCancellation: bookingDetails.freeCancellation,
      breakfastIncluded: bookingDetails.breakfastIncluded,
      createdAt: new Date().toISOString()
    };

    return (
      <ProductLayout breadcrumbs={breadcrumbs}>
        <div className="container mx-auto px-4 py-8">
          <div className="mb-4">
            <Button 
              variant="outline" 
              onClick={() => setShowVoucher(false)}
              className="mb-4"
            >
              ← Back to Confirmation
            </Button>
          </div>
          <HotelVoucher 
            voucherData={voucherData}
            onDownload={() => {
              toast({
                title: "Download Started",
                description: "Your voucher PDF is being generated.",
              });
            }}
            onEmail={() => {
              toast({
                title: "Email Sent", 
                description: "Voucher has been sent to your email.",
              });
            }}
          />
        </div>
      </ProductLayout>
    );
  }

  return (
    <ProductLayout breadcrumbs={breadcrumbs}>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Confirmation Header */}
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </div>
              <h1 className="text-3xl font-bold mb-2">Booking Confirmed!</h1>
              <p className="text-muted-foreground mb-4">
                Your hotel reservation has been successfully confirmed. 
                A confirmation email has been sent to {bookingDetails.guest.email}
              </p>
              <div className="flex justify-center gap-4">
                <Badge variant="secondary" className="text-lg py-2 px-4">
                  Booking Reference: {bookingDetails.bookingReference}
                </Badge>
                <Badge variant="outline" className="text-lg py-2 px-4 capitalize">
                  Status: {bookingDetails.status}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Hotel Details */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="w-5 h-5" />
                    Hotel Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start gap-4">
                    <div className="w-20 h-16 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                      <img
                        src={bookingDetails.hotel.images[0]}
                        alt={bookingDetails.hotel.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder.svg';
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{bookingDetails.hotel.name}</h3>
                      <div className="flex items-center gap-1 mt-1 mb-2">
                        {[...Array(bookingDetails.hotel.starRating)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-travel-gold text-travel-gold" />
                        ))}
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                        <span className="text-sm text-muted-foreground">{bookingDetails.hotel.address}</span>
                      </div>
                    </div>
                  </div>

                  <Separator className="my-4" />

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium mb-2">Included Amenities:</p>
                      <ul className="space-y-1">
                        {bookingDetails.amenities.slice(0, 4).map((amenity, index) => (
                          <li key={index} className="flex items-center gap-2 text-muted-foreground">
                            <CheckCircle className="w-3 h-3 text-green-600" />
                            {amenity}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="font-medium mb-2">Booking Benefits:</p>
                      <ul className="space-y-1">
                        {bookingDetails.freeCancellation && (
                          <li className="flex items-center gap-2 text-muted-foreground">
                            <CheckCircle className="w-3 h-3 text-green-600" />
                            Free cancellation
                          </li>
                        )}
                        {bookingDetails.breakfastIncluded && (
                          <li className="flex items-center gap-2 text-muted-foreground">
                            <CheckCircle className="w-3 h-3 text-green-600" />
                            Breakfast included
                          </li>
                        )}
                        <li className="flex items-center gap-2 text-muted-foreground">
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
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Check-in</Label>
                      <p className="font-semibold">{formatDate(bookingDetails.checkIn)}</p>
                      <p className="text-sm text-muted-foreground">After 3:00 PM</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Check-out</Label>
                      <p className="font-semibold">{formatDate(bookingDetails.checkOut)}</p>
                      <p className="text-sm text-muted-foreground">Before 11:00 AM</p>
                    </div>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Duration:</span> {calculateNights()} night{calculateNights() > 1 ? 's' : ''}
                    </div>
                    <div>
                      <span className="font-medium">Guests:</span> {bookingDetails.guests.adults + bookingDetails.guests.children} guest{bookingDetails.guests.adults + bookingDetails.guests.children > 1 ? 's' : ''} in {bookingDetails.guests.rooms} room{bookingDetails.guests.rooms > 1 ? 's' : ''}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Guest Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Guest Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">Primary Guest:</span>
                      <span>{bookingDetails.guest.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">Email:</span>
                      <span>{bookingDetails.guest.email}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">Phone:</span>
                      <span>{bookingDetails.guest.phone}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Booking Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-20">
                <CardHeader>
                  <CardTitle>Booking Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Room rate ({calculateNights()} nights)</span>
                      <span>${bookingDetails.totalAmount - Math.round(bookingDetails.totalAmount * 0.12)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Taxes & fees</span>
                      <span>${Math.round(bookingDetails.totalAmount * 0.12)}</span>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total Paid</span>
                    <span>${bookingDetails.totalAmount} {bookingDetails.currency}</span>
                  </div>
                  
                  <Button 
                    onClick={downloadVoucher}
                    className="w-full"
                    variant="outline"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    View Voucher
                  </Button>
                  
                  <Button 
                    onClick={() => navigate('/hotels')}
                    className="w-full"
                  >
                    Book Another Hotel
                  </Button>
                  
                  <div className="text-xs text-muted-foreground">
                    <p className="mb-2">
                      <strong>Important:</strong> Please present this confirmation or your ID at check-in.
                    </p>
                    <p>
                      For any changes or cancellations, please contact the hotel directly or reach out to our customer support.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </ProductLayout>
  );
};

function Label({ className, children, ...props }: any) {
  return <label className={className} {...props}>{children}</label>;
}

export default HotelBookingConfirmation;