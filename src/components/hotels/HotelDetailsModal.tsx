import { useState } from 'react';
import { X, MapPin, Star, Wifi, Car, Coffee, Utensils, Dumbbell, Waves } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { HotelPolicyDisplay } from './HotelPolicyDisplay';

interface Hotel {
  id: string;
  name: string;
  address: string;
  star_rating: number;
  images: string[];
  amenities: {
    general: string[];
    room: string[];
    business: string[];
  };
  location: {
    latitude: number;
    longitude: number;
  };
  policies: {
    check_in: string;
    check_out: string;
    cancellation: string;
    metapolicy_struct?: any;
    metapolicy_extra_info?: any;
  };
  cancellation_penalties?: {
    policies?: Array<{
      charge_type: string;
      charge_amount: number;
      currency: string;
      from_date: string;
      to_date: string;
      description: string;
    }>;
  };
  taxes_and_fees?: Array<{
    name: string;
    amount: number;
    currency: string;
    included_by_supplier: boolean;
    per_night?: boolean;
    per_person?: boolean;
  }>;
  description: string;
  freeCancellation?: boolean;
  payAtProperty?: boolean;
  currency?: string;
}

interface HotelDetailsModalProps {
  hotel: Hotel | null;
  isOpen: boolean;
  onClose: () => void;
  onBook: (hotel: Hotel) => void;
  checkIn: string;
  checkOut: string;
  guests: string;
  searchData?: {
    rooms: number;
    adults: number;
    children: number;
  };
}

const amenityIcons: { [key: string]: React.ComponentType<any> } = {
  'Free WiFi': Wifi,
  'Swimming Pool': Waves,
  'Restaurant': Utensils,
  'Bar': Coffee,
  'Spa & Wellness Center': Waves,
  'Fitness Center': Dumbbell,
  'Business Center': Coffee,
  'Airport Shuttle': Car,
  'Parking': Car,
};

export function HotelDetailsModal({ 
  hotel, 
  isOpen, 
  onClose, 
  onBook, 
  checkIn, 
  checkOut, 
  guests,
  searchData
}: HotelDetailsModalProps) {
  const [selectedImage, setSelectedImage] = useState(0);

  if (!isOpen || !hotel) return null;

  const allAmenities = [
    ...(hotel.amenities?.general || []),
    ...(hotel.amenities?.room || []),
    ...(hotel.amenities?.business || [])
  ];

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{hotel.name}</h2>
            <div className="flex items-center mt-2">
              <div className="flex items-center">
                {[...Array(hotel.star_rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="ml-2 text-sm text-gray-600">{hotel.star_rating}-star hotel</span>
            </div>
            <div className="flex items-center mt-1 text-gray-600">
              <MapPin className="w-4 h-4 mr-1" />
              <span className="text-sm">{hotel.address}</span>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-6 h-6" />
          </Button>
        </div>

        {/* Images */}
        <div className="p-6">
          <div className="mb-4">
            <img
              src={hotel.images[selectedImage]}
              alt={hotel.name}
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {hotel.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`${hotel.name} ${index + 1}`}
                className={`w-20 h-20 object-cover rounded cursor-pointer ${
                  selectedImage === index ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setSelectedImage(index)}
              />
            ))}
          </div>
        </div>

        {/* Description */}
        <div className="px-6 pb-4">
          <h3 className="text-lg font-semibold mb-2">About this hotel</h3>
          <p className="text-gray-600">{hotel.description}</p>
        </div>

        {/* Amenities */}
        <div className="px-6 pb-4">
          <h3 className="text-lg font-semibold mb-3">Amenities</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {allAmenities.map((amenity, index) => {
              const IconComponent = amenityIcons[amenity];
              return (
                <div key={index} className="flex items-center space-x-2">
                  {IconComponent && <IconComponent className="w-4 h-4 text-primary" />}
                  <span className="text-sm text-gray-700">{amenity}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* RateHawk Policies Display */}
        <div className="px-6 pb-4">
          <HotelPolicyDisplay 
            policies={hotel.policies}
            taxes_and_fees={hotel.taxes_and_fees}
          />
        </div>

        {/* Booking Details */}
        <div className="px-6 pb-6 border-t bg-gray-50">
          <div className="pt-4">
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-sm text-gray-600">Your stay</p>
                <p className="font-medium">{checkIn} → {checkOut}</p>
                <p className="text-sm text-gray-600">{guests}</p>
              </div>
              <div className="text-right">
                {hotel.freeCancellation && (
                  <Badge variant="secondary" className="mb-2">Free Cancellation</Badge>
                )}
                {hotel.payAtProperty && (
                  <Badge variant="outline" className="mb-2 ml-1">Pay at Property</Badge>
                )}
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-primary">
                    ${((hotel as any).pricePerNight || 299)} {hotel.currency || 'USD'}
                  </p>
                  <p className="text-sm text-gray-600">per night</p>
                  
                  {/* Non-included fees display */}
                  {hotel.taxes_and_fees && hotel.taxes_and_fees.filter(fee => !fee.included_by_supplier).length > 0 && (
                    <div className="text-xs text-orange-600 mt-1">
                      <p className="font-medium">Additional fees (pay at hotel):</p>
                      {hotel.taxes_and_fees
                        .filter(fee => !fee.included_by_supplier)
                        .map((fee, index) => (
                          <p key={index}>
                            {fee.name}: ${fee.amount} {fee.currency}
                          </p>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <Button 
              onClick={() => onBook(hotel)} 
              className="w-full"
              size="lg"
            >
              Continue to Booking
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}