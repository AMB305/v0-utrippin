import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Download, 
  Printer, 
  Mail, 
  Building2, 
  Calendar, 
  Users, 
  Phone, 
  MapPin,
  Star,
  CheckCircle,
  Clock,
  CreditCard
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface VoucherData {
  bookingReference: string;
  status: string;
  hotel: {
    name: string;
    starRating: number;
    address: string;
    phone?: string;
    images: string[];
  };
  checkIn: string;
  checkOut: string;
  guests: {
    adults: number;
    children: number;
    rooms: number;
  };
  totalAmount: number;
  currency: string;
  guest: {
    name: string;
    email: string;
    phone: string;
  };
  amenities: string[];
  freeCancellation: boolean;
  breakfastIncluded: boolean;
  specialRequests?: string;
  clientReference?: string;
  createdAt?: string;
}

interface HotelVoucherProps {
  voucherData: VoucherData;
  onDownload?: () => void;
  onPrint?: () => void;
  onEmail?: () => void;
}

const HotelVoucher = ({ voucherData, onDownload, onPrint, onEmail }: HotelVoucherProps) => {
  const { toast } = useToast();

  const calculateNights = () => {
    const checkIn = new Date(voucherData.checkIn);
    const checkOut = new Date(voucherData.checkOut);
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

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDownload = () => {
    if (onDownload) {
      onDownload();
    } else {
      toast({
        title: "Download Started",
        description: "Your voucher is being prepared for download.",
      });
    }
  };

  const handlePrint = () => {
    if (onPrint) {
      onPrint();
    } else {
      window.print();
    }
  };

  const handleEmail = () => {
    if (onEmail) {
      onEmail();
    } else {
      toast({
        title: "Email Sent",
        description: "Voucher has been sent to your email address.",
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white">
      {/* Voucher Header */}
      <div className="print:hidden mb-4 flex gap-2">
        <Button onClick={handleDownload} variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Download PDF
        </Button>
        <Button onClick={handlePrint} variant="outline">
          <Printer className="w-4 h-4 mr-2" />
          Print
        </Button>
        <Button onClick={handleEmail} variant="outline">
          <Mail className="w-4 h-4 mr-2" />
          Email
        </Button>
      </div>

      {/* Voucher Content */}
      <Card className="border-2">
        <CardHeader className="text-center border-b bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
              <Building2 className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-blue-900">Hotel Booking Voucher</CardTitle>
          <div className="flex justify-center gap-4 mt-4">
            <Badge variant="outline" className="text-lg py-1 px-3">
              Ref: {voucherData.bookingReference}
            </Badge>
            <Badge variant="default" className="text-lg py-1 px-3 capitalize">
              {voucherData.status}
            </Badge>
          </div>
          {voucherData.clientReference && (
            <p className="text-sm text-muted-foreground mt-2">
              Client Reference: {voucherData.clientReference}
            </p>
          )}
        </CardHeader>

        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Hotel Information */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Hotel Information
              </h3>
              
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-lg">{voucherData.hotel.name}</h4>
                  <div className="flex items-center gap-1 mt-1">
                    {[...Array(voucherData.hotel.starRating)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    ))}
                    <span className="text-sm text-muted-foreground ml-1">
                      ({voucherData.hotel.starRating} Star Hotel)
                    </span>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <span className="text-sm">{voucherData.hotel.address}</span>
                </div>
                
                {voucherData.hotel.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{voucherData.hotel.phone}</span>
                  </div>
                )}
                
                <div className="mt-4">
                  <h5 className="font-medium mb-2">Included Amenities:</h5>
                  <div className="grid grid-cols-2 gap-1">
                    {voucherData.amenities.slice(0, 6).map((amenity, index) => (
                      <div key={index} className="flex items-center gap-1 text-sm">
                        <CheckCircle className="w-3 h-3 text-green-600" />
                        {amenity}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Details */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Booking Details
              </h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Check-in</label>
                    <p className="font-medium">{formatDate(voucherData.checkIn)}</p>
                    <p className="text-sm text-muted-foreground">After 3:00 PM</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Check-out</label>
                    <p className="font-medium">{formatDate(voucherData.checkOut)}</p>
                    <p className="text-sm text-muted-foreground">Before 11:00 AM</p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Duration:</span> {calculateNights()} night{calculateNights() > 1 ? 's' : ''}
                  </div>
                  <div>
                    <span className="font-medium">Guests:</span> {voucherData.guests.adults + voucherData.guests.children} in {voucherData.guests.rooms} room{voucherData.guests.rooms > 1 ? 's' : ''}
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h5 className="font-medium mb-2">Booking Benefits:</h5>
                  <div className="space-y-1">
                    {voucherData.freeCancellation && (
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-3 h-3 text-green-600" />
                        Free cancellation until 24h before check-in
                      </div>
                    )}
                    {voucherData.breakfastIncluded && (
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-3 h-3 text-green-600" />
                        Breakfast included
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-3 h-3 text-green-600" />
                      Instant confirmation
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Guest Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Users className="w-5 h-5" />
                Guest Information
              </h3>
              
              <div className="space-y-2">
                <div>
                  <span className="font-medium">Primary Guest:</span> {voucherData.guest.name}
                </div>
                <div>
                  <span className="font-medium">Email:</span> {voucherData.guest.email}
                </div>
                <div>
                  <span className="font-medium">Phone:</span> {voucherData.guest.phone}
                </div>
              </div>
              
              {voucherData.specialRequests && (
                <div className="mt-4">
                  <h5 className="font-medium mb-2">Special Requests:</h5>
                  <p className="text-sm text-muted-foreground bg-gray-50 p-2 rounded">
                    {voucherData.specialRequests}
                  </p>
                </div>
              )}
            </div>

            {/* Payment Information */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Payment Summary
              </h3>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Room rate ({calculateNights()} nights)</span>
                  <span>{voucherData.currency} {Math.round(voucherData.totalAmount * 0.88)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Taxes & fees</span>
                  <span>{voucherData.currency} {Math.round(voucherData.totalAmount * 0.12)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total Paid</span>
                  <span>{voucherData.currency} {voucherData.totalAmount}</span>
                </div>
              </div>
              
              {voucherData.createdAt && (
                <div className="mt-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Booked on: {formatDate(voucherData.createdAt)} at {formatTime(voucherData.createdAt)}
                  </div>
                </div>
              )}
            </div>
          </div>

          <Separator className="my-6" />

          {/* Important Information */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-3 text-blue-900">Important Information</h3>
            <div className="space-y-2 text-sm text-blue-800">
              <p>• Please present this voucher and a valid photo ID at check-in</p>
              <p>• Check-in time is after 3:00 PM, check-out is before 11:00 AM</p>
              <p>• For any changes or cancellations, please contact the hotel directly</p>
              <p>• Keep this voucher for your records and tax purposes</p>
              {voucherData.freeCancellation && (
                <p>• Free cancellation is available until 24 hours before check-in</p>
              )}
            </div>
          </div>

          {/* Footer - Hotelbeds Compliance */}
          <div className="text-center mt-6 pt-4 border-t text-sm text-muted-foreground">
            <p className="font-medium">UTRIPPIN Travel Platform</p>
            <p>Payable through UTRIPPIN, acting as agent for the service operating company, details of which can be provided upon request.</p>
            <p>VAT: GB123456789 | Reference: {voucherData.bookingReference}</p>
            <p className="mt-2">For support, contact us at support@utrippin.com</p>
            {voucherData.createdAt && (
              <p className="mt-1">Generated on: {new Date().toLocaleDateString()}</p>
            )}
            <div className="mt-4 pt-2 border-t" data-hotelbeds-attribution>
              <p className="text-xs text-muted-foreground">
                Powered by Hotelbeds • Hotels content provided by Hotelbeds Group
              </p>
              <p className="text-xs text-muted-foreground">
                © {new Date().getFullYear()} Hotelbeds Group. All rights reserved.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HotelVoucher;
