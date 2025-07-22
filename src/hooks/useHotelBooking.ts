import { useState } from 'react';

export const useHotelBooking = () => {
  const [bookingData, setBookingData] = useState(null);
  const [searchData, setSearchData] = useState(null);
  const [hotelId, setHotelId] = useState(null);
  const [rateKey, setRateKey] = useState(null);
  const [loading, setLoading] = useState(false);
  const [rateCheckLoading, setRateCheckLoading] = useState(false);

  const createBooking = async (bookingData: any) => {
    setLoading(true);
    try {
      // Placeholder implementation
      console.log('Creating booking:', bookingData);
      return { success: true };
    } catch (error) {
      console.error('Booking error:', error);
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const checkRatesBeforeBooking = async () => {
    setRateCheckLoading(true);
    try {
      // Placeholder implementation
      console.log('Checking rates');
      return { success: true };
    } catch (error) {
      console.error('Rate check error:', error);
      return { success: false, error };
    } finally {
      setRateCheckLoading(false);
    }
  };

  const getDurationInNights = (checkIn?: string | Date, checkOut?: string | Date) => {
    // Use provided dates or searchData
    const startDate = checkIn || searchData?.checkInDate;
    const endDate = checkOut || searchData?.checkOutDate;
    
    if (!startDate || !endDate) return 0;
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
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