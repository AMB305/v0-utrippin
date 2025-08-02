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
import { Car, Users, MapPin, Calendar, Clock, Shield, CreditCard, CheckCircle, Star, Info } from "lucide-react";

// Mock car data (in real app, this would come from API)
const mockCar = {
  id: "1",
  name: "Toyota Corolla",
  category: "Economy",
  image: "/placeholder.svg",
  company: "Hertz",
  rating: 4.2,
  reviewCount: 156,
  features: ["AC", "Bluetooth", "USB"],
  passengers: 5,
  bags: 2,
  transmission: "automatic",
  fuelType: "gasoline",
  pricePerDay: 35,
  location: "LAX Airport"
};

const CarBooking = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [selectedCar, setSelectedCar] = useState<typeof mockCar | null>(null);
  const [bookingData, setBookingData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    licenseNumber: "",
    addInsurance: false,
    addGPS: false,
    addChildSeat: false
  });

  const searchData = {
    pickupLocation: searchParams.get('pickupLocation') || '',
    dropoffLocation: searchParams.get('dropoffLocation') || '',
    pickupDate: searchParams.get('pickupDate') ? new Date(searchParams.get('pickupDate')!) : null,
    dropoffDate: searchParams.get('dropoffDate') ? new Date(searchParams.get('dropoffDate')!) : null,
    pickupTime: searchParams.get('pickupTime') || '10:00',
    dropoffTime: searchParams.get('dropoffTime') || '10:00'
  };

  const getDurationInDays = () => {
    if (!searchData.pickupDate || !searchData.dropoffDate) return 1;
    const diffTime = searchData.dropoffDate.getTime() - searchData.pickupDate.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const calculateTotalPrice = () => {
    if (!selectedCar) return 0;
    const days = getDurationInDays();
    let total = selectedCar.pricePerDay * days;
    
    if (bookingData.addInsurance) total += 15 * days;
    if (bookingData.addGPS) total += 8 * days;
    if (bookingData.addChildSeat) total += 5 * days;
    
    return total;
  };

  useEffect(() => {
    // Simulate loading car details
    setTimeout(() => {
      setSelectedCar(mockCar);
      setLoading(false);
    }, 1000);
  }, []);

  const handleBooking = () => {
    // Simulate booking process
    console.log("Booking data:", { ...bookingData, car: selectedCar, searchData });
    // In real app, this would submit to booking API
    navigate('/cars/confirmation');
  };

  const breadcrumbs = [
    { label: "Cars", href: "/cars" },
    { label: "Search Results", href: `/cars/results?${searchParams.toString()}` },
    { label: "Booking", isActive: true }
  ];

  if (loading) {
    return (
      <ProductLayout breadcrumbs={breadcrumbs}>
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your rental details...</p>
        </div>
      </ProductLayout>
    );
  }

  if (!selectedCar) {
    return (
      <ProductLayout breadcrumbs={breadcrumbs}>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Car Not Found</h1>
          <p className="text-muted-foreground mb-8">Sorry, we couldn't find the selected car.</p>
          <Button onClick={() => navigate('/cars')}>Search Again</Button>
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
            {/* Car Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Car className="w-5 h-5" />
                  Your Rental Car
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-24 h-16 bg-muted rounded-lg flex items-center justify-center">
                    <img
                      src={selectedCar.image}
                      alt={selectedCar.name}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder.svg';
                      }}
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{selectedCar.name}</h3>
                    <p className="text-muted-foreground">{selectedCar.category}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline">{selectedCar.company}</Badge>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-travel-gold text-travel-gold" />
                        <span className="text-sm">{selectedCar.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span>{selectedCar.passengers} passengers</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>{selectedCar.bags} bags</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span>{selectedCar.location}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Rental Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Rental Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Pick-up</Label>
                    <div className="mt-1 space-y-1">
                      <p className="font-medium">{searchData.pickupLocation}</p>
                      <p className="text-sm text-muted-foreground">
                        {searchData.pickupDate?.toLocaleDateString()} at {searchData.pickupTime}
                      </p>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Drop-off</Label>
                    <div className="mt-1 space-y-1">
                      <p className="font-medium">{searchData.dropoffLocation || searchData.pickupLocation}</p>
                      <p className="text-sm text-muted-foreground">
                        {searchData.dropoffDate?.toLocaleDateString()} at {searchData.dropoffTime}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-muted p-3 rounded-lg">
                  <p className="text-sm">
                    <span className="font-medium">Rental Duration:</span> {getDurationInDays()} day{getDurationInDays() > 1 ? 's' : ''}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Driver Information */}
            <Card>
              <CardHeader>
                <CardTitle>Driver Information</CardTitle>
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
                    <Label htmlFor="email">Email *</Label>
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
                
                <div>
                  <Label htmlFor="license">Driver's License Number *</Label>
                  <Input
                    id="license"
                    value={bookingData.licenseNumber}
                    onChange={(e) => setBookingData(prev => ({ ...prev, licenseNumber: e.target.value }))}
                    placeholder="Enter license number"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Add-ons */}
            <Card>
              <CardHeader>
                <CardTitle>Add-ons & Extras</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="insurance"
                        checked={bookingData.addInsurance}
                        onCheckedChange={(checked) => setBookingData(prev => ({ ...prev, addInsurance: checked as boolean }))}
                      />
                      <div>
                        <Label htmlFor="insurance" className="font-medium cursor-pointer">Full Coverage Insurance</Label>
                        <p className="text-sm text-muted-foreground">Zero deductible protection</p>
                      </div>
                    </div>
                    <span className="font-medium">+$15/day</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="gps"
                        checked={bookingData.addGPS}
                        onCheckedChange={(checked) => setBookingData(prev => ({ ...prev, addGPS: checked as boolean }))}
                      />
                      <div>
                        <Label htmlFor="gps" className="font-medium cursor-pointer">GPS Navigation</Label>
                        <p className="text-sm text-muted-foreground">Turn-by-turn directions</p>
                      </div>
                    </div>
                    <span className="font-medium">+$8/day</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="childSeat"
                        checked={bookingData.addChildSeat}
                        onCheckedChange={(checked) => setBookingData(prev => ({ ...prev, addChildSeat: checked as boolean }))}
                      />
                      <div>
                        <Label htmlFor="childSeat" className="font-medium cursor-pointer">Child Safety Seat</Label>
                        <p className="text-sm text-muted-foreground">Age 2-4 years</p>
                      </div>
                    </div>
                    <span className="font-medium">+$5/day</span>
                  </div>
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
                    <span>Car rental ({getDurationInDays()} days)</span>
                    <span>${selectedCar.pricePerDay * getDurationInDays()}</span>
                  </div>
                  
                  {bookingData.addInsurance && (
                    <div className="flex justify-between text-sm">
                      <span>Insurance ({getDurationInDays()} days)</span>
                      <span>+${15 * getDurationInDays()}</span>
                    </div>
                  )}
                  
                  {bookingData.addGPS && (
                    <div className="flex justify-between text-sm">
                      <span>GPS ({getDurationInDays()} days)</span>
                      <span>+${8 * getDurationInDays()}</span>
                    </div>
                  )}
                  
                  {bookingData.addChildSeat && (
                    <div className="flex justify-between text-sm">
                      <span>Child seat ({getDurationInDays()} days)</span>
                      <span>+${5 * getDurationInDays()}</span>
                    </div>
                  )}
                </div>
                
                <Separator />
                
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>${calculateTotalPrice()}</span>
                </div>
                
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Free cancellation up to 24h</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-blue-600" />
                    <span>Secure payment processing</span>
                  </div>
                </div>
                
                <Button 
                  onClick={handleBooking}
                  className="w-full"
                  size="lg"
                  disabled={!bookingData.firstName || !bookingData.lastName || !bookingData.email || !bookingData.phone || !bookingData.licenseNumber}
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

export default CarBooking;
