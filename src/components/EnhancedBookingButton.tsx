import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ExternalLink, Clock, Shield, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface EnhancedBookingButtonProps {
  bookingUrl: string;
  title: string;
  price?: string;
  provider?: string;
  className?: string;
  variant?: "default" | "outline" | "secondary";
  size?: "sm" | "lg" | "default";
}

export const EnhancedBookingButton: React.FC<EnhancedBookingButtonProps> = ({
  bookingUrl,
  title,
  price,
  provider,
  className = "",
  variant = "default",
  size = "default"
}) => {
  const [isClicked, setIsClicked] = useState(false);
  const { toast } = useToast();

  const handleBookingClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!bookingUrl || bookingUrl === '#') {
      toast({
        title: "Booking Unavailable",
        description: "This booking option is currently unavailable. Please try again later.",
        variant: "destructive"
      });
      return;
    }

    setIsClicked(true);
    
    // Analytics tracking
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'booking_click', {
        event_category: 'engagement',
        event_label: title,
        value: price ? parseFloat(price.replace(/[^\d.]/g, '')) : 0
      });
    }

    // Open booking URL
    try {
      window.open(bookingUrl, '_blank', 'noopener,noreferrer');
      
      toast({
        title: "Redirecting to Booking",
        description: `Opening ${provider || 'booking partner'} in a new tab...`,
        action: (
          <div className="flex items-center gap-1 text-green-600">
            <CheckCircle className="w-4 h-4" />
            <span>Secure</span>
          </div>
        )
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Unable to open booking page. Please try again.",
        variant: "destructive"
      });
    }

    // Reset clicked state
    setTimeout(() => setIsClicked(false), 2000);
  };

  const buttonText = isClicked ? "Opening..." : "Book Now";
  const buttonVariant = variant === "default" ? "default" : variant;

  return (
    <Button
      onClick={handleBookingClick}
      variant={buttonVariant}
      size={size}
      disabled={isClicked || !bookingUrl || bookingUrl === '#'}
      className={`
        ${className}
        ${isClicked ? 'bg-green-600 hover:bg-green-700' : 'bg-orange-500 hover:bg-orange-600'}
        text-white font-semibold transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        group relative overflow-hidden
      `}
    >
      <div className="flex items-center gap-2">
        {isClicked ? (
          <Clock className="w-4 h-4 animate-spin" />
        ) : (
          <ExternalLink className="w-4 h-4 group-hover:scale-110 transition-transform" />
        )}
        <span>{buttonText}</span>
        {price && !isClicked && (
          <span className="text-yellow-300 font-bold">{price}</span>
        )}
      </div>
      
      {/* Security indicator */}
      <div className="absolute top-1 right-1 opacity-70">
        <Shield className="w-3 h-3" />
      </div>
    </Button>
  );
};

export default EnhancedBookingButton;