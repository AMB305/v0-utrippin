import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import ProductLayout from "@/components/ProductLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Package, Users, MapPin, Calendar, Star, CreditCard, CheckCircle, Shield, Info, Plane, Building2, Clock } from "lucide-react";

// Mock package data (in real app, this would come from API)
const mockPackage = {
  id: "1",
  title: "Tropical Paradise Getaway",
  destination: "Cancun, Mexico",
  images: ["/placeholder.svg"],
  duration: 7,
  packageType: "Flight + Hotel",
  hotel: {
    name: "Grand Resort Cancun",
    starRating: 5,
    rating: 9.2,
    reviewCount: 1247,
    amenities: ["All-inclusive", "Beachfront", "Spa", "5 Restaurants"]
  },
  flight: {
    outbound: {
      airline: "American Airlines",
      departure: "JFK 8:00 AM",
      arrival: "CUN 12:30 PM",
      duration: "4h 30m",
      stops: 0
    },
    return: {
      airline: "American Airlines", 
      departure: "CUN 2:15 PM",
      arrival: "JFK 8:45 PM",
      duration: "4h 30m",
      stops: 0
    }
  },
  inclusions: ["Round-trip flights", "7 nights hotel", "All meals", "Airport transfers"],
  originalPrice: 1299,
  discountedPrice: 899,
  savings: 400
};

const PackageBooking = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState<typeof mockPackage | null>(null);
  const [bookingData, setBookingData] = useState({
    primaryGuest: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      dateOfBirth: ""
    },
    travelers: [] as Array<{
      firstName: string;
      lastName: string;
      dateOfBirth: string;
      passportNumber: string;
    }>,
    roomRequests: "",
    dietaryRequests: "",
    addOns: {
      travelInsurance: false,
      airportLounge: false,
      extraBaggage: false,
      roomUpgrade: false
    }
  });

  const searchData = {
    origin: searchParams.get('origin') || '',
    destination: searchParams.get('destination') || '',
    departureDate: searchParams.get('departureDate') ? new Date(searchParams.get('departureDate')!) : null,
    returnDate: searchParams.get('returnDate') ? new Date(searchParams.get('returnDate')!) : null,
    travelers: {
      adults: parseInt(searchParams.get('adults') || '2'),
      children: parseInt(searchParams.get('children') || '0'),
      rooms: parseInt(searchParams.get('rooms') || '1')
    }
  };

  const getDurationInNights = () => {
    if (!searchData.departureDate || !searchData.returnDate) return selectedPackage?.duration || 7;
    const diffTime = searchData.returnDate.getTime() - searchData.departureDate.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const calculateTotalPrice = () => {
    if (!selectedPackage) return 0;
    let total = selectedPackage.discountedPrice * (searchData.travelers.adults + searchData.travelers.children);
    
    if (bookingData.addOns.travelInsurance) total += 89;
    if (bookingData.addOns.airportLounge) total += 120;
    if (bookingData.addOns.extraBaggage) total += 150;
    if (bookingData.addOns.roomUpgrade) total += 200;
    
    return total;
  };

  useEffect(() => {
    // Initialize travelers array based on search params
    const totalTravelers = searchData.travelers.adults + searchData.travelers.children;
    const travelers = Array.from({ length: totalTravelers }, () => ({
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      passportNumber: ""
    }));
    setBookingData(prev => ({ ...prev, travelers }));
  }, [searchData.travelers.adults, searchData.travelers.children]);

  useEffect(() => {
    // Simulate loading package details
    setTimeout(() => {
      setSelectedPackage(mockPackage);
      setLoading(false);
    }, 1000);
  }, []);

  const handleBooking = () => {
    // Simulate booking process
    console.log("Booking data:", { ...bookingData, package: selectedPackage, searchData });
    // In real app, this would submit to booking API
    navigate('/packages/confirmation');
  };

  const updateTraveler = (index: number, field: string, value: string) => {
    setBookingData(prev => ({
      ...prev,
      travelers: prev.travelers.map((traveler, i) => 
        i === index ? { ...traveler, [field]: value } : traveler
      )
    }));
  };

  const breadcrumbs = [
    { label: "Packages", href: "/packages" },
    { label: "Search Results", href: `/packages/results?${searchParams.toString()}` },
    { label: "Booking", isActive: true }
  ];

  if (loading) {
    return (
      <ProductLayout breadcrumbs={breadcrumbs}>
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your package details...</p>
        </div>
      </ProductLayout>
    );
  }

  if (!selectedPackage) {
    return (
      <ProductLayout breadcrumbs={breadcrumbs}>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Package Not Found</h1>
          <p className="text-muted-foreground mb-8">Sorry, we couldn't find the selected package.</p>
          <Button onClick={() => navigate('/packages')}>Search Again</Button>
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
            {/* Package Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Your Vacation Package
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-24 h-16 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                    <img
                      src={selectedPackage.images[0]}
                      alt={selectedPackage.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder.svg';
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">{selectedPackage.title}</h3>
                    <div className="flex items-center gap-2 text-muted-foreground mb-2">
                      <MapPin className="w-4 h-4" />
                      <span>{selectedPackage.destination}</span>
                      <span>•</span>
                      <span>{getDurationInNights()} nights</span>
                    </div>
                    <Badge variant="secondary">{selectedPackage.packageType}</Badge>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground line-through">
                      Was ${selectedPackage.originalPrice}
                    </div>
                    <div className="text-xl font-bold text-green-600">
                      ${selectedPackage.discountedPrice}
                    </div>
                    <div className="text-xs text-green-600">
                      Save ${selectedPackage.savings}!
                    </div>
                  </div>
                </div>

                {/* Flight & Hotel Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <Plane className="w-4 h-4" />
                      Flight Details
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <p className="font-medium">Outbound: {searchData.departureDate?.toLocaleDateString()}</p>
                        <p className="text-muted-foreground">
                          {selectedPackage.flight.outbound.departure} → {selectedPackage.flight.outbound.arrival}
                        </p>
                        <p className="text-muted-foreground">{selectedPackage.flight.outbound.airline}</p>
                      </div>
                      <div>
                        <p className="font-medium">Return: {searchData.returnDate?.toLocaleDateString()}</p>
                        <p className="text-muted-foreground">
                          {selectedPackage.flight.return.departure} → {selectedPackage.flight.return.arrival}
                        </p>
                        <p className="text-muted-foreground">{selectedPackage.flight.return.airline}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <Building2 className="w-4 h-4" />
                      Hotel Details
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <p className="font-medium">{selectedPackage.hotel.name}</p>
                        <div className="flex items-center gap-1">
                          {[...Array(selectedPackage.hotel.starRating)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-travel-gold text-travel-gold" />
                          ))}
                          <span className="ml-1">{selectedPackage.hotel.rating}/10</span>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {selectedPackage.hotel.amenities.map((amenity, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {amenity}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Primary Guest Information */}
            <Card>
              <CardHeader>
                <CardTitle>Primary Guest Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="primaryFirstName">First Name *</Label>
                    <Input
                      id="primaryFirstName"
                      value={bookingData.primaryGuest.firstName}
                      onChange={(e) => setBookingData(prev => ({ 
                        ...prev, 
                        primaryGuest: { ...prev.primaryGuest, firstName: e.target.value }
                      }))}
                      placeholder="Enter first name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="primaryLastName">Last Name *</Label>
                    <Input
                      id="primaryLastName"
                      value={bookingData.primaryGuest.lastName}
                      onChange={(e) => setBookingData(prev => ({ 
                        ...prev, 
                        primaryGuest: { ...prev.primaryGuest, lastName: e.target.value }
                      }))}
                      placeholder="Enter last name"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="primaryEmail">Email Address *</Label>
                    <Input
                      id="primaryEmail"
                      type="email"
                      value={bookingData.primaryGuest.email}
                      onChange={(e) => setBookingData(prev => ({ 
                        ...prev, 
                        primaryGuest: { ...prev.primaryGuest, email: e.target.value }
                      }))}
                      placeholder="Enter email address"
                    />
                  </div>
                  <div>
                    <Label htmlFor="primaryPhone">Phone Number *</Label>
                    <Input
                      id="primaryPhone"
                      value={bookingData.primaryGuest.phone}
                      onChange={(e) => setBookingData(prev => ({ 
                        ...prev, 
                        primaryGuest: { ...prev.primaryGuest, phone: e.target.value }
                      }))}
                      placeholder="Enter phone number"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Travelers Information */}
            {bookingData.travelers.map((traveler, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>Traveler #{index + 1}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`firstName-${index}`}>First Name *</Label>
                      <Input
                        id={`firstName-${index}`}
                        value={traveler.firstName}
                        onChange={(e) => updateTraveler(index, 'firstName', e.target.value)}
                        placeholder="Enter first name"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`lastName-${index}`}>Last Name *</Label>
                      <Input
                        id={`lastName-${index}`}
                        value={traveler.lastName}
                        onChange={(e) => updateTraveler(index, 'lastName', e.target.value)}
                        placeholder="Enter last name"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`dob-${index}`}>Date of Birth *</Label>
                      <Input
                        id={`dob-${index}`}
                        type="date"
                        value={traveler.dateOfBirth}
                        onChange={(e) => updateTraveler(index, 'dateOfBirth', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`passport-${index}`}>Passport Number</Label>
                      <Input
                        id={`passport-${index}`}
                        value={traveler.passportNumber}
                        onChange={(e) => updateTraveler(index, 'passportNumber', e.target.value)}
                        placeholder="Enter passport number"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Add-ons & Extras */}
            <Card>
              <CardHeader>
                <CardTitle>Add-ons & Extras</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="travelInsurance"
                        checked={bookingData.addOns.travelInsurance}
                        onCheckedChange={(checked) => setBookingData(prev => ({ 
                          ...prev, 
                          addOns: { ...prev.addOns, travelInsurance: checked as boolean }
                        }))}
                      />
                      <div>
                        <Label htmlFor="travelInsurance" className="font-medium cursor-pointer">Travel Insurance</Label>
                        <p className="text-sm text-muted-foreground">Comprehensive coverage for peace of mind</p>
                      </div>
                    </div>
                    <span className="font-medium">+$89</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="airportLounge"
                        checked={bookingData.addOns.airportLounge}
                        onCheckedChange={(checked) => setBookingData(prev => ({ 
                          ...prev, 
                          addOns: { ...prev.addOns, airportLounge: checked as boolean }
                        }))}
                      />
                      <div>
                        <Label htmlFor="airportLounge" className="font-medium cursor-pointer">Airport Lounge Access</Label>
                        <p className="text-sm text-muted-foreground">Premium lounge access at both airports</p>
                      </div>
                    </div>
                    <span className="font-medium">+$120</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="extraBaggage"
                        checked={bookingData.addOns.extraBaggage}
                        onCheckedChange={(checked) => setBookingData(prev => ({ 
                          ...prev, 
                          addOns: { ...prev.addOns, extraBaggage: checked as boolean }
                        }))}
                      />
                      <div>
                        <Label htmlFor="extraBaggage" className="font-medium cursor-pointer">Extra Baggage</Label>
                        <p className="text-sm text-muted-foreground">Additional 23kg checked bag</p>
                      </div>
                    </div>
                    <span className="font-medium">+$150</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="roomUpgrade"
                        checked={bookingData.addOns.roomUpgrade}
                        onCheckedChange={(checked) => setBookingData(prev => ({ 
                          ...prev, 
                          addOns: { ...prev.addOns, roomUpgrade: checked as boolean }
                        }))}
                      />
                      <div>
                        <Label htmlFor="roomUpgrade" className="font-medium cursor-pointer">Room Upgrade</Label>
                        <p className="text-sm text-muted-foreground">Upgrade to ocean view suite</p>
                      </div>
                    </div>
                    <span className="font-medium">+$200</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Special Requests */}
            <Card>
              <CardHeader>
                <CardTitle>Special Requests</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="roomRequests">Room Requests</Label>
                  <Textarea
                    id="roomRequests"
                    value={bookingData.roomRequests}
                    onChange={(e) => setBookingData(prev => ({ ...prev, roomRequests: e.target.value }))}
                    placeholder="Any special room requests (e.g., connecting rooms, high floor, etc.)"
                    rows={2}
                  />
                </div>
                
                <div>
                  <Label htmlFor="dietaryRequests">Dietary Requirements</Label>
                  <Textarea
                    id="dietaryRequests"
                    value={bookingData.dietaryRequests}
                    onChange={(e) => setBookingData(prev => ({ ...prev, dietaryRequests: e.target.value }))}
                    placeholder="Any dietary restrictions or special meal requests"
                    rows={2}
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
                    <span>Package price ({searchData.travelers.adults + searchData.travelers.children} travelers)</span>
                    <span>${selectedPackage.discountedPrice * (searchData.travelers.adults + searchData.travelers.children)}</span>
                  </div>
                  
                  {bookingData.addOns.travelInsurance && (
                    <div className="flex justify-between text-sm">
                      <span>Travel Insurance</span>
                      <span>+$89</span>
                    </div>
                  )}
                  
                  {bookingData.addOns.airportLounge && (
                    <div className="flex justify-between text-sm">
                      <span>Airport Lounge Access</span>
                      <span>+$120</span>
                    </div>
                  )}
                  
                  {bookingData.addOns.extraBaggage && (
                    <div className="flex justify-between text-sm">
                      <span>Extra Baggage</span>
                      <span>+$150</span>
                    </div>
                  )}
                  
                  {bookingData.addOns.roomUpgrade && (
                    <div className="flex justify-between text-sm">
                      <span>Room Upgrade</span>
                      <span>+$200</span>
                    </div>
                  )}
                </div>
                
                <Separator />
                
                <div className="bg-green-50 p-3 rounded-lg">
                  <div className="flex justify-between font-semibold text-green-700">
                    <span>You Save</span>
                    <span>${selectedPackage.savings * (searchData.travelers.adults + searchData.travelers.children)}</span>
                  </div>
                  <p className="text-xs text-green-600 mt-1">vs. booking separately</p>
                </div>
                
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>${calculateTotalPrice()}</span>
                </div>
                
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Free cancellation within 24h</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-blue-600" />
                    <span>Secure payment processing</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Info className="w-4 h-4 text-orange-600" />
                    <span>Instant confirmation</span>
                  </div>
                </div>
                
                <Button 
                  onClick={handleBooking}
                  className="w-full"
                  size="lg"
                  disabled={!bookingData.primaryGuest.firstName || !bookingData.primaryGuest.lastName || !bookingData.primaryGuest.email || !bookingData.primaryGuest.phone}
                >
                  Complete Booking
                </Button>
                
                <p className="text-xs text-muted-foreground text-center">
                  By booking, you agree to our terms and conditions
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProductLayout>
  );
};

export default PackageBooking;
