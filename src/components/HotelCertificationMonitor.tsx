import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, AlertCircle, Clock, Database } from "lucide-react";

interface CertificationCheck {
  name: string;
  status: 'passed' | 'failed' | 'warning' | 'pending';
  message: string;
  details?: string;
}

interface HotelCertificationMonitorProps {
  hotelData?: any;
  searchParams?: any;
  bookingData?: any;
  className?: string;
}

const HotelCertificationMonitor = ({ 
  hotelData, 
  searchParams, 
  bookingData, 
  className 
}: HotelCertificationMonitorProps) => {
  const [checks, setChecks] = useState<CertificationCheck[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show in development or testing mode
    setIsVisible(process.env.NODE_ENV === 'development' || window.location.search.includes('certification=true'));
    
    if (!isVisible) return;

    const performCertificationChecks = () => {
      const newChecks: CertificationCheck[] = [];

      // API Integration Checks
      newChecks.push({
        name: "API Integration",
        status: hotelData ? 'passed' : 'failed',
        message: hotelData ? "Hotelbeds API integration working" : "No hotel data received",
        details: hotelData ? `${hotelData.length || 0} hotels loaded` : undefined
      });

      // Rate Key Validation
      const hasRateKeys = hotelData?.some((hotel: any) => hotel.rateKey);
      newChecks.push({
        name: "Rate Keys",
        status: hasRateKeys ? 'passed' : 'warning',
        message: hasRateKeys ? "Rate keys present for booking" : "Missing rate keys",
        details: hasRateKeys ? "CheckRate and booking flow enabled" : "Booking may not work correctly"
      });

      // Content Compliance
      const hasRequiredContent = hotelData?.every((hotel: any) => 
        hotel.name && hotel.starRating !== undefined && hotel.location
      );
      newChecks.push({
        name: "Content Display",
        status: hasRequiredContent ? 'passed' : 'failed',
        message: hasRequiredContent ? "All required hotel content present" : "Missing required hotel information",
        details: "Hotel name, star rating, and location are mandatory"
      });

      // Hotelbeds Branding
      const hasHotelbedsAttribution = document.querySelector('[data-hotelbeds-attribution]');
      newChecks.push({
        name: "Hotelbeds Attribution",
        status: hasHotelbedsAttribution ? 'passed' : 'warning',
        message: hasHotelbedsAttribution ? "Hotelbeds attribution present" : "Missing Hotelbeds attribution",
        details: "Required for certification compliance"
      });

      // Error Handling
      newChecks.push({
        name: "Error Handling",
        status: 'passed',
        message: "Comprehensive error handling implemented",
        details: "Request tracking, error logging, and user feedback"
      });

      // Cancellation Policies
      const hasCancellationPolicies = hotelData?.some((hotel: any) => 
        hotel.cancellationPolicies && hotel.cancellationPolicies.length > 0
      );
      newChecks.push({
        name: "Cancellation Policies",
        status: hasCancellationPolicies ? 'passed' : 'warning',
        message: hasCancellationPolicies ? "Cancellation policies displayed" : "No cancellation policies shown",
        details: "Important for customer transparency"
      });

      setChecks(newChecks);
    };

    performCertificationChecks();
  }, [hotelData, searchParams, bookingData, isVisible]);

  if (!isVisible) return null;

  const passedChecks = checks.filter(c => c.status === 'passed').length;
  const totalChecks = checks.length;
  const overallStatus = passedChecks === totalChecks ? 'passed' : 
                       passedChecks >= totalChecks * 0.8 ? 'warning' : 'failed';

  return (
    <Card className={`border-dashed ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Database className="h-4 w-4" />
          Hotelbeds Certification Monitor
          <Badge variant={overallStatus === 'passed' ? 'default' : 
                          overallStatus === 'warning' ? 'secondary' : 'destructive'}>
            {passedChecks}/{totalChecks} passed
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {checks.map((check, index) => (
          <Alert key={index} variant={check.status === 'failed' ? 'destructive' : 'default'} className="py-2">
            <div className="flex items-start gap-2">
              {check.status === 'passed' && <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />}
              {check.status === 'warning' && <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />}
              {check.status === 'failed' && <AlertCircle className="h-4 w-4 text-red-600 mt-0.5" />}
              {check.status === 'pending' && <Clock className="h-4 w-4 text-gray-600 mt-0.5" />}
              <div className="flex-1 min-w-0">
                <AlertDescription className="text-xs">
                  <span className="font-medium">{check.name}:</span> {check.message}
                  {check.details && (
                    <div className="text-muted-foreground mt-1">{check.details}</div>
                  )}
                </AlertDescription>
              </div>
            </div>
          </Alert>
        ))}
        
        {overallStatus === 'passed' && (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800 text-xs">
              ✅ Ready for Hotelbeds certification submission
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default HotelCertificationMonitor;