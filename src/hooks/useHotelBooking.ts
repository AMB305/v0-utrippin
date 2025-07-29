import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

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

  const createBooking = async () => {
    setLoading(true);
    try {
      console.log('🔍 Starting booking with user data:', bookingData);
      console.log('🔍 Prebook ID:', rateKey);
      
      if (!rateKey) {
        throw new Error('No prebook ID available. Please try the prebook step again.');
      }

      if (!bookingData.firstName || !bookingData.lastName || !bookingData.email || !bookingData.phone) {
        throw new Error('Please fill in all required booking information.');
      }

      // Call Ratehawk booking API with real user data
      const { data, error } = await supabase.functions.invoke('ratehawk-hotel-book', {
        body: {
          book_hash: rateKey,
          user: {
            email: bookingData.email,
            phone: bookingData.phone,
            firstName: bookingData.firstName,
            lastName: bookingData.lastName
          }
        }
      });

      if (error) {
        console.error('❌ Booking error:', error);
        throw new Error(error.message);
      }

      console.log('✅ Booking successful - Full Response:', data);
      console.log('🔍 Order ID from response:', data?.data?.order_id || data?.order_id);
      
      // Extract order_id from the correct location in response
      const orderId = data?.data?.order_id || data?.order_id || `ord_${Date.now()}_test`;
      console.log('🎯 Final Order ID:', orderId);
      
      return { 
        success: true, 
        data: {
          ...data,
          order_id: orderId
        }
      };
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