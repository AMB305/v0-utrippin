import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Calendar, Clock, AlertTriangle, CheckCircle } from "lucide-react";

interface CancellationPolicy {
  amount: string;
  from: string;
  currency?: string;
}

interface HotelCancellationPolicyProps {
  policies?: CancellationPolicy[];
  freeCancellation?: boolean;
  checkInDate?: Date;
  className?: string;
}

const HotelCancellationPolicy = ({ 
  policies, 
  freeCancellation = false, 
  checkInDate,
  className 
}: HotelCancellationPolicyProps) => {
  
  const formatCancellationDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }),
      time: date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short'
      })
    };
  };

  const getCancellationDeadline = () => {
    if (!checkInDate) return null;
    const deadline = new Date(checkInDate);
    deadline.setDate(deadline.getDate() - 1);
    deadline.setHours(23, 59, 0, 0);
    return deadline;
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Calendar className="w-4 h-4" />
          Cancellation Policy
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {freeCancellation ? (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              <div className="space-y-1">
                <p className="font-medium">Free Cancellation Available</p>
                {checkInDate && (
                  <p className="text-sm">
                    Cancel until {getCancellationDeadline()?.toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'long', 
                      day: 'numeric'
                    })} at 11:59 PM without penalty
                  </p>
                )}
              </div>
            </AlertDescription>
          </Alert>
        ) : (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <p className="font-medium">Non-refundable Rate</p>
              <p className="text-sm">No cancellation or changes permitted</p>
            </AlertDescription>
          </Alert>
        )}

        {policies && policies.length > 0 && (
          <div className="space-y-2">
            <h5 className="font-medium text-sm">Cancellation Fees:</h5>
            {policies.map((policy, index) => {
              const { date, time } = formatCancellationDate(policy.from);
              return (
                <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-3 h-3" />
                      <span>From {date}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{time}</p>
                  </div>
                  <Badge variant="outline">
                    {policy.currency || '$'}{policy.amount} fee
                  </Badge>
                </div>
              );
            })}
          </div>
        )}

        <Alert className="border-blue-200 bg-blue-50">
          <AlertTriangle className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800 text-sm">
            <p className="font-medium">Important Notice</p>
            <p>
              Cancellation times are based on the destination's local time zone, 
              not your local time. Please consider time zone differences when cancelling.
            </p>
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};

export default HotelCancellationPolicy;