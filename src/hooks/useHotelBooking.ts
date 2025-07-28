import { useState } from 'react';

export const useHotelBooking = () => {
  const [bookingData, setBookingData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    arrivalTime: '',
    roomPreference: '',
    specialRequests: ''
  });
  const [searchData, setSearchData] = useState({
    destination: '',
    checkInDate: '',
    checkOutDate: '',
    adults: 1,
    children: 0,
    rooms: 1
  });
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

  const populateSearchDataFromUrl = (searchParams: URLSearchParams) => {
    const newSearchData = {
      destination: searchParams.get('destination') || '',
      checkInDate: searchParams.get('checkInDate') || '',
      checkOutDate: searchParams.get('checkOutDate') || '',
      adults: parseInt(searchParams.get('adults') || '1'),
      children: parseInt(searchParams.get('children') || '0'),
      rooms: parseInt(searchParams.get('rooms') || '1')
    };
    setSearchData(newSearchData);
    
    // Also set the hotel ID
    const urlHotelId = searchParams.get('hotelId');
    if (urlHotelId) {
      setHotelId(urlHotelId);
    }
    
    console.log('🔄 Search data populated from URL:', newSearchData);
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
    setSearchData,
    hotelId,
    setHotelId,
    rateKey,
    setRateKey,
    loading,
    rateCheckLoading,
    createBooking,
    checkRatesBeforeBooking,
    getDurationInNights,
    populateSearchDataFromUrl
  };
};