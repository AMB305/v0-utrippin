import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { BackToTop } from '@/components/BackToTop';
import { HotelDetailsModal } from '@/components/hotels/HotelDetailsModal';
import { HotelBookingForm } from '@/components/hotels/HotelBookingForm';
import { BookingConfirmation } from '@/components/hotels/BookingConfirmation';
import { RatehawkService } from '@/services/RatehawkService';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, MapPin, Star, Wifi, Car, Waves } from 'lucide-react';

type BookingStep = 'search' | 'details' | 'booking' | 'confirmation';

export default function HotelSearch() {
  const [searchParams] = useSearchParams();
  const [hotels, setHotels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedHotel, setSelectedHotel] = useState<any>(null);
  const [hotelDetails, setHotelDetails] = useState<any>(null);
  const [prebookData, setPrebookData] = useState<any>(null);
  const [bookingData, setBookingData] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState<BookingStep>('search');
  const { toast } = useToast();

  const searchData = {
    destination: searchParams.get('destination') || '',
    checkInDate: searchParams.get('checkInDate') || '',
    checkOutDate: searchParams.get('checkOutDate') || '',
    adults: parseInt(searchParams.get('adults') || '2'),
    children: parseInt(searchParams.get('children') || '0'),
    rooms: parseInt(searchParams.get('rooms') || '1')
  };

  const searchHotels = async () => {
    console.log('🔍 HOTEL SEARCH DEBUG - URL Params:', searchData);
    console.log('🔍 Current URL:', window.location.href);
    
    if (!searchData.destination || !searchData.checkInDate || !searchData.checkOutDate) {
      console.error('❌ Missing search parameters:', searchData);
      toast({
        title: "Missing Search Parameters",
        description: "Please provide destination and dates to search for hotels.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    try {
      console.log('🚀 Calling RatehawkService.searchHotels with:', {
        destination: searchData.destination,
        checkIn: searchData.checkInDate,
        checkOut: searchData.checkOutDate,
        adults: searchData.adults,
        children: [],
        language: "en",
        currency: "USD",
        residency: "US"
      });
      
      const result = await RatehawkService.searchHotels({
        destination: searchData.destination,
        checkIn: searchData.checkInDate,
        checkOut: searchData.checkOutDate,
        adults: searchData.adults,
        children: [],
        language: "en",
        currency: "USD",
        residency: "US"
      });

      console.log('✅ Raw API response:', result);

      if (!result || !result.hotels) {
        throw new Error('No hotels returned from API');
      }

      const transformedHotels = result.hotels.map(RatehawkService.transformHotelData);
      console.log('✅ Transformed hotels:', transformedHotels);
      setHotels(transformedHotels);
      
      toast({
        title: "Hotels Found",
        description: `Found ${transformedHotels.length} hotels in ${searchData.destination}`,
      });
    } catch (error) {
      console.error('❌ Hotel search error:', error);
      toast({
        title: "Search Error",
        description: `Unable to load hotels: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleHotelSelect = async (hotel: any) => {
    setSelectedHotel(hotel);
    setLoading(true);

    try {
      // Get hotel details
      const details = await RatehawkService.getHotelInfo(hotel.id);
      setHotelDetails(details);
      setCurrentStep('details');
    } catch (error) {
      console.error('Failed to load hotel details:', error);
      toast({
        title: "Error",
        description: "Failed to load hotel details. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBookHotel = async (hotel: any) => {
    setLoading(true);
    
    try {
      // Prebook the hotel
      const prebook = await RatehawkService.prebookHotel({
        hotelId: hotel.id,
        checkIn: searchData.checkInDate,
        checkOut: searchData.checkOutDate,
        adults: searchData.adults,
        children: []
      });

      setPrebookData(prebook);
      setCurrentStep('booking');
    } catch (error) {
      console.error('Prebook error:', error);
      toast({
        title: "Booking Error", 
        description: "Unable to proceed with booking. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBookingComplete = (booking: any) => {
    setBookingData(booking);
    setCurrentStep('confirmation');
  };

  const handleNewSearch = () => {
    setCurrentStep('search');
    setSelectedHotel(null);
    setHotelDetails(null);
    setPrebookData(null);
    setBookingData(null);
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const destination = params.get("destination");
    const checkInDate = params.get("checkInDate");
    const checkOutDate = params.get("checkOutDate");
    const adults = params.get("adults");
    const children = params.get("children");
    const rooms = params.get("rooms");

    console.log("🧪 HotelSearch URL params:", {
      destination,
      checkInDate,
      checkOutDate,
      adults,
      children,
      rooms,
      fullURL: window.location.href
    });

    console.log("🧪 HotelSearch searchData:", searchData);

    if (!destination || !checkInDate || !checkOutDate) {
      console.warn("❌ Missing required search parameters");
      setLoading(false);
      return;
    }

    console.log("✅ All required params present, calling searchHotels()");
    searchHotels();
  }, []);

  const renderContent = () => {
    if (loading && currentStep === 'search') {
      return (
        <div className="flex justify-center items-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin" />
          <span className="ml-2">Searching hotels...</span>
        </div>
      );
    }

    switch (currentStep) {
      case 'search':
        return (
          <div>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Hotels in {searchData.destination}
              </h1>
              <p className="text-gray-600">
                {searchData.checkInDate} → {searchData.checkOutDate} • 
                {searchData.adults + searchData.children} guests, {searchData.rooms} room{searchData.rooms > 1 ? 's' : ''}
              </p>
            </div>

            <div className="grid gap-6">
              {hotels.map((hotel) => (
                <Card key={hotel.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row">
                      {/* Hotel Image */}
                      <div className="md:w-80 h-64 md:h-auto">
                        <img
                          src={hotel.images[0] || '/placeholder-hotel.jpg'}
                          alt={hotel.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      {/* Hotel Details */}
                      <div className="flex-1 p-6">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-xl font-semibold text-gray-900">{hotel.name}</h3>
                              <div className="flex items-center">
                                {[...Array(hotel.starRating)].map((_, i) => (
                                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                ))}
                              </div>
                            </div>
                            
                            <div className="flex items-center text-gray-600 mb-3">
                              <MapPin className="w-4 h-4 mr-1" />
                              <span className="text-sm">{hotel.location}</span>
                            </div>

                            {/* Amenities Preview */}
                            <div className="flex items-center gap-4 mb-3">
                              {hotel.amenities.includes('wifi') && <Wifi className="w-4 h-4 text-green-600" />}
                              {hotel.amenities.includes('pool') && <Waves className="w-4 h-4 text-blue-600" />}
                              {hotel.amenities.includes('parking') && <Car className="w-4 h-4 text-gray-600" />}
                              <span className="text-sm text-gray-500">
                                +{hotel.amenities.length} amenities
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              {hotel.freeCancellation && (
                                <Badge variant="secondary">Free Cancellation</Badge>
                              )}
                              {hotel.breakfastIncluded && (
                                <Badge variant="outline">Breakfast Included</Badge>
                              )}
                            </div>
                          </div>

                          {/* Price and Book Button */}
                          <div className="text-right ml-6">
                            <div className="mb-4">
                              <p className="text-2xl font-bold text-primary">
                                {hotel.currency} {hotel.pricePerNight}
                              </p>
                              <p className="text-sm text-gray-600">per night</p>
                            </div>
                            
                            <Button
                              onClick={() => handleHotelSelect(hotel)}
                              className="w-full min-w-[120px]"
                            >
                              View Details
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {hotels.length === 0 && !loading && (
              <div className="text-center py-12">
                <p className="text-gray-600">No hotels found for your search criteria.</p>
              </div>
            )}
          </div>
        );

      case 'details':
        return (
          <HotelDetailsModal
            hotel={hotelDetails}
            isOpen={true}
            onClose={() => setCurrentStep('search')}
            onBook={handleBookHotel}
            checkIn={searchData.checkInDate}
            checkOut={searchData.checkOutDate}
            guests={`${searchData.adults + searchData.children} guests, ${searchData.rooms} room${searchData.rooms > 1 ? 's' : ''}`}
          />
        );

      case 'booking':
        return (
          <HotelBookingForm
            hotel={selectedHotel}
            prebookId={prebookData?.prebookId}
            onBookingComplete={handleBookingComplete}
            onBack={() => setCurrentStep('details')}
          />
        );

      case 'confirmation':
        return (
          <BookingConfirmation
            booking={bookingData}
            onNewSearch={handleNewSearch}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-6 py-8">
        {renderContent()}
      </div>
      
      <Footer />
      <BackToTop />
    </div>
  );
}