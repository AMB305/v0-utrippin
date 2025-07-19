import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { HotelbedsMappingService } from "@/services/HotelbedsMappingService";
import { useAuth } from "@/hooks/useAuth";

interface BookingData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialRequests: string;
  arrivalTime: string;
  roomPreference: string;
}

interface Guest {
  roomId: number;
  type: 'AD' | 'CH';
  age?: number;
  name: string;
  surname: string;
}

export const useHotelBooking = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [rateCheckLoading, setRateCheckLoading] = useState(false);
  const [bookingData, setBookingData] = useState<BookingData>({
    firstName: "",
    lastName: "",
    email: user?.email || "",
    phone: "",
    specialRequests: "",
    arrivalTime: "",
    roomPreference: "no-preference"
  });

  const searchData = {
    destination: searchParams.get('destination') || '',
    checkInDate: searchParams.get('checkInDate') ? new Date(searchParams.get('checkInDate')!) : null,
    checkOutDate: searchParams.get('checkOutDate') ? new Date(searchParams.get('checkOutDate')!) : null,
    guests: {
      adults: parseInt(searchParams.get('adults') || '2'),
      children: parseInt(searchParams.get('children') || '0'),
      rooms: parseInt(searchParams.get('rooms') || '1')
    }
  };

  const hotelId = searchParams.get('hotelId');
  const rateKey = searchParams.get('rateKey');

  const validateBookingData = (): boolean => {
    if (!bookingData.firstName.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter your first name.",
        variant: "destructive",
      });
      return false;
    }

    if (!bookingData.lastName.trim()) {
      toast({
        title: "Missing Information", 
        description: "Please enter your last name.",
        variant: "destructive",
      });
      return false;
    }

    if (!bookingData.email.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return false;
    }

    if (!bookingData.phone.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter your phone number.",
        variant: "destructive",
      });
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(bookingData.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const checkRatesBeforeBooking = async (): Promise<boolean> => {
    if (!rateKey) {
      toast({
        title: "Rate Check Failed",
        description: "No rate information available. Please search again.",
        variant: "destructive",
      });
      return false;
    }

    setRateCheckLoading(true);
    try {
      const rateData = await HotelbedsMappingService.checkRates([rateKey]);
      
      if (rateData?.success && rateData.hotel) {
        toast({
          title: "Rate Confirmed",
          description: "Rate is still available and confirmed.",
        });
        return true;
      } else {
        toast({
          title: "Rate No Longer Available",
          description: "This rate is no longer available. Please search again.",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error('Rate check failed:', error);
      toast({
        title: "Rate Check Warning",
        description: "Unable to verify current rates. Proceeding with booking.",
        variant: "destructive",
      });
      return true; // Continue with booking even if rate check fails
    } finally {
      setRateCheckLoading(false);
    }
  };

  const createBooking = async (): Promise<void> => {
    if (!validateBookingData()) return;
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to complete your booking.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Check rates before booking
      const rateValid = await checkRatesBeforeBooking();
      if (!rateValid) {
        setLoading(false);
        return;
      }

      // Prepare booking data for Hotelbeds
      const guests: Guest[] = [];
      
      // Add adults
      for (let i = 0; i < searchData.guests.adults; i++) {
        guests.push({
          roomId: 1,
          type: 'AD',
          name: i === 0 ? bookingData.firstName : `Guest${i + 1}`,
          surname: i === 0 ? bookingData.lastName : 'Adult'
        });
      }

      // Add children if any
      for (let i = 0; i < searchData.guests.children; i++) {
        guests.push({
          roomId: 1,
          type: 'CH',
          age: 10, // Default age for children
          name: `Child${i + 1}`,
          surname: 'Child'
        });
      }

      const hotelbedsBookingData = {
        rateKey: rateKey!,
        holder: {
          name: bookingData.firstName,
          surname: bookingData.lastName,
          email: bookingData.email,
          phoneNumber: bookingData.phone
        },
        rooms: [{
          rateKey: rateKey!,
          paxes: guests
        }],
        clientReference: `UTRIPPIN-${Date.now()}-${user.id}`,
        language: 'ENG'
      };

      toast({
        title: "Processing Booking",
        description: "Please wait while we confirm your reservation...",
      });

      const result = await HotelbedsMappingService.createBooking(hotelbedsBookingData);

      if (result?.success && result.booking) {
        toast({
          title: "Booking Confirmed!",
          description: "Your hotel has been successfully booked.",
        });

        // Navigate to confirmation page with booking data
        const confirmationParams = new URLSearchParams({
          bookingId: result.localBookingId || 'unknown',
          hotelbedsReference: result.booking.reference || '',
          ...Object.fromEntries(searchParams.entries())
        });
        
        navigate(`/hotels/confirmation?${confirmationParams.toString()}`);
      } else {
        throw new Error('Booking creation failed');
      }

    } catch (error) {
      console.error('Booking failed:', error);
      toast({
        title: "Booking Failed",
        description: "Unable to complete your booking. Please try again or contact support.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getDurationInNights = () => {
    if (!searchData.checkInDate || !searchData.checkOutDate) return 1;
    const diffTime = searchData.checkOutDate.getTime() - searchData.checkInDate.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return {
    bookingData,
    setBookingData,
    searchData,
    hotelId,
    rateKey,
    loading,
    rateCheckLoading,
    createBooking,
    checkRatesBeforeBooking,
    getDurationInNights
  };
};