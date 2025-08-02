import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { BookingConfirmation } from '@/components/hotels/BookingConfirmation';
import ProductLayout from '@/components/ProductLayout';
import { Loader2 } from 'lucide-react';

const HotelBookingConfirmation = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const bookingId = searchParams.get('bookingId');
  const hotelId = searchParams.get('hotelId');
  
  // Debug URL parameters
  console.log('🔍 URL Parameters:', {
    bookingId,
    hotelId,
    allParams: Object.fromEntries(searchParams.entries())
  });

  // Mock booking data based on URL parameters
  const mockBooking = {
    data: {
      order_id: bookingId || `ord_${Date.now()}_test`,
      final_price: {
        amount: 245,
        currency: 'USD'
      },
      total_price: {
        amount: 245,
        currency: 'USD'
      },
      confirmation_number: 'CNF' + Date.now(),
      hotel_id: hotelId || 'test_hotel_do_not_book',
      check_in: '2025-07-25',
      check_out: '2025-08-01'
    }
  };
  
  console.log('📋 Mock Booking Data:', mockBooking);

  // Mock hotel data
  const mockHotel = {
    hotel_id: hotelId || 'test_hotel_do_not_book',
    name: hotelId?.includes('test_hotel_do_not_book') 
      ? 'Test Hotel Do Not Book - Certification Test'
      : 'Grand Palace Hotel',
    address: hotelId?.includes('test_hotel_do_not_book')
      ? '123 Test Street, Miami, FL'
      : 'Paris, France'
  };

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleCancelBooking = () => {
    // Navigate back to hotel search after cancellation
    navigate('/hotels');
  };

  const handleNewSearch = () => {
    navigate('/hotels');
  };

  const breadcrumbs = [
    { label: "Hotels", href: "/hotels" },
    { label: "Booking Confirmation", isActive: true }
  ];

  if (loading) {
    return (
      <ProductLayout breadcrumbs={breadcrumbs}>
        <div className="container mx-auto px-4 py-16 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your booking confirmation...</p>
        </div>
      </ProductLayout>
    );
  }

  return (
    <ProductLayout breadcrumbs={breadcrumbs}>
      <BookingConfirmation
        booking={mockBooking}
        hotel={mockHotel}
        onCancelBooking={handleCancelBooking}
        onNewSearch={handleNewSearch}
      />
    </ProductLayout>
  );
};

export default HotelBookingConfirmation;
