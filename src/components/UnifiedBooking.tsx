import React, { useState } from 'react';
import { Calendar, Users, MapPin, Car, Package, Ship, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import FlightBookingForm from '@/components/FlightBookingForm';
import { buildHotelUrl, buildCarUrl, buildPackageUrl, buildCruiseUrl } from '@/utils/buildAffiliateUrl';

const tabs = [
  { name: 'Flights', emoji: '✈️', id: 'flights' },
  { name: 'Hotels', emoji: '🏨', id: 'hotels' },
  { name: 'Cars', emoji: '🚗', id: 'cars' },
  { name: 'Packages', emoji: '🧳', id: 'packages' },
  { name: 'Cruises', emoji: '🛳️', id: 'cruises' },
  { name: 'Travel Buddy', emoji: '🤖', id: 'ai' },
];

interface UnifiedBookingProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export default function UnifiedBooking({ activeTab, onTabChange }: UnifiedBookingProps) {
  const navigate = useNavigate();
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [location, setLocation] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [dropoffDate, setDropoffDate] = useState('');
  const [guests, setGuests] = useState(2);
  const [rooms, setRooms] = useState(1);
  const [travelers, setTravelers] = useState(2);
  const [packageType, setPackageType] = useState('Flight + Hotel');
  const [duration, setDuration] = useState('7');
  const [cabinType, setCabinType] = useState('Interior');

  const renderBookingForm = () => {
    switch (activeTab) {
      case 'flights':
        return <FlightBookingForm />;

      case 'hotels':
        return (
          <div className="space-y-4">
            <div className="space-y-3">
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-500 dark:text-slate-400" />
                <Input
                  placeholder="Where are you staying?"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="bg-gray-50 dark:bg-slate-700 border-gray-200 dark:border-slate-600 text-slate-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-slate-400 pl-10"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-600 dark:text-slate-400 mb-1 block">Check-in</label>
                <Input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="bg-gray-50 dark:bg-slate-700 border-gray-200 dark:border-slate-600 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600 dark:text-slate-400 mb-1 block">Check-out</label>
                <Input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="bg-gray-50 dark:bg-slate-700 border-gray-200 dark:border-slate-600 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-600 dark:text-slate-400 mb-1 block">Guests</label>
                <select 
                  value={guests} 
                  onChange={(e) => setGuests(Number(e.target.value))}
                  className="w-full p-3 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white"
                >
                  <option value={1}>1 guest</option>
                  <option value={2}>2 guests</option>
                  <option value={3}>3 guests</option>
                  <option value={4}>4 guests</option>
                  <option value={5}>5+ guests</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-600 dark:text-slate-400 mb-1 block">Rooms</label>
                <select 
                  value={rooms} 
                  onChange={(e) => setRooms(Number(e.target.value))}
                  className="w-full p-3 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white"
                >
                  <option value={1}>1 room</option>
                  <option value={2}>2 rooms</option>
                  <option value={3}>3 rooms</option>
                  <option value={4}>4+ rooms</option>
                </select>
              </div>
            </div>

            <Button 
              className="w-full bg-primary hover:bg-primary-hover text-primary-foreground py-3 rounded-lg font-semibold transition-colors"
              disabled={!location || !checkIn || !checkOut}
              onClick={() => {
                if (!location || !checkIn || !checkOut) return;
                
                const expediaUrl = buildHotelUrl({
                  destination: location,
                  startDate: checkIn,
                  endDate: checkOut,
                  rooms: rooms,
                  adults: guests
                });
                
                window.open(expediaUrl, '_blank');
              }}
            >
              Search Hotels
            </Button>
          </div>
        );

      case 'cars':
        return (
          <div className="space-y-4">
            <div className="space-y-3">
              <div className="relative">
                <Car className="absolute left-3 top-3 h-4 w-4 text-gray-500 dark:text-slate-400" />
                <Input
                  placeholder="Pick-up location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="bg-gray-50 dark:bg-slate-700 border-gray-200 dark:border-slate-600 text-slate-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-slate-400 pl-10"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-600 dark:text-slate-400 mb-1 block">Pick-up</label>
                <Input
                  type="datetime-local"
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  className="bg-gray-50 dark:bg-slate-700 border-gray-200 dark:border-slate-600 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600 dark:text-slate-400 mb-1 block">Drop-off</label>
                <Input
                  type="datetime-local"
                  value={dropoffDate}
                  onChange={(e) => setDropoffDate(e.target.value)}
                  className="bg-gray-50 dark:bg-slate-700 border-gray-200 dark:border-slate-600 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-600 dark:text-slate-400 mb-1 block">Car Type</label>
              <select className="w-full p-3 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white">
                <option>Economy</option>
                <option>Compact</option>
                <option>Mid-size</option>
                <option>Full-size</option>
                <option>Premium</option>
                <option>Luxury</option>
              </select>
            </div>

            <Button 
              className="w-full bg-primary hover:bg-primary-hover text-primary-foreground py-3 rounded-lg font-semibold transition-colors"
              disabled={!location || !pickupDate || !dropoffDate}
              onClick={() => {
                if (!location || !pickupDate || !dropoffDate) return;
                
                // Convert datetime-local to date format for affiliate URL
                const pickupDateStr = pickupDate.split('T')[0];
                const dropoffDateStr = dropoffDate.split('T')[0];
                
                const expediaUrl = buildCarUrl({
                  location: location,
                  pickupDate: pickupDateStr,
                  dropoffDate: dropoffDateStr
                });
                
                window.open(expediaUrl, '_blank');
              }}
            >
              Search Cars
            </Button>
          </div>
        );

      case 'packages':
        return (
          <div className="space-y-4">
            <div className="space-y-3">
              <div className="relative">
                <Package className="absolute left-3 top-3 h-4 w-4 text-gray-500 dark:text-slate-400" />
                <Input
                  placeholder="Destination"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="bg-gray-50 dark:bg-slate-700 border-gray-200 dark:border-slate-600 text-slate-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-slate-400 pl-10"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-600 dark:text-slate-400 mb-1 block">Departure</label>
                <Input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="bg-gray-50 dark:bg-slate-700 border-gray-200 dark:border-slate-600 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600 dark:text-slate-400 mb-1 block">Return</label>
                <Input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="bg-gray-50 dark:bg-slate-700 border-gray-200 dark:border-slate-600 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-600 dark:text-slate-400 mb-1 block">Travelers</label>
                <select 
                  value={travelers} 
                  onChange={(e) => setTravelers(Number(e.target.value))}
                  className="w-full p-3 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white"
                >
                  <option value={1}>1 traveler</option>
                  <option value={2}>2 travelers</option>
                  <option value={3}>3 travelers</option>
                  <option value={4}>4+ travelers</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-600 dark:text-slate-400 mb-1 block">Package Type</label>
                <select 
                  value={packageType} 
                  onChange={(e) => setPackageType(e.target.value)}
                  className="w-full p-3 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white"
                >
                  <option value="Flight + Hotel">Flight + Hotel</option>
                  <option value="Flight + Car">Flight + Car</option>
                  <option value="All Inclusive">All Inclusive</option>
                </select>
              </div>
            </div>

            <Button 
              className="w-full bg-primary hover:bg-primary-hover text-primary-foreground py-3 rounded-lg font-semibold transition-colors"
              disabled={!location || !checkIn || !checkOut}
              onClick={() => {
                if (!location || !checkIn || !checkOut) return;
                
                const expediaUrl = buildPackageUrl({
                  destination: location,
                  departDate: checkIn,
                  returnDate: checkOut,
                  travelers: travelers,
                  packageType: packageType
                });
                
                window.open(expediaUrl, '_blank');
              }}
            >
              Search Packages
            </Button>
          </div>
        );

      case 'cruises':
        return (
          <div className="space-y-4">
            <div className="space-y-3">
              <div className="relative">
                <Ship className="absolute left-3 top-3 h-4 w-4 text-gray-500 dark:text-slate-400" />
                <Input
                  placeholder="Departure port"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="bg-gray-50 dark:bg-slate-700 border-gray-200 dark:border-slate-600 text-slate-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-slate-400 pl-10"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-600 dark:text-slate-400 mb-1 block">Sail Date</label>
                <Input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="bg-gray-50 dark:bg-slate-700 border-gray-200 dark:border-slate-600 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600 dark:text-slate-400 mb-1 block">Duration</label>
                <select 
                  value={duration} 
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full p-3 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white"
                >
                  <option value="3">3-5 nights</option>
                  <option value="7">7 nights</option>
                  <option value="8">6-8 nights</option>
                  <option value="9">9+ nights</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-600 dark:text-slate-400 mb-1 block">Guests</label>
                <select 
                  value={guests} 
                  onChange={(e) => setGuests(Number(e.target.value))}
                  className="w-full p-3 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white"
                >
                  <option value={1}>1 guest</option>
                  <option value={2}>2 guests</option>
                  <option value={3}>3 guests</option>
                  <option value={4}>4+ guests</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-600 dark:text-slate-400 mb-1 block">Cabin Type</label>
                <select 
                  value={cabinType} 
                  onChange={(e) => setCabinType(e.target.value)}
                  className="w-full p-3 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white"
                >
                  <option value="Interior">Interior</option>
                  <option value="Ocean View">Ocean View</option>
                  <option value="Balcony">Balcony</option>
                  <option value="Suite">Suite</option>
                </select>
              </div>
            </div>

            <Button 
              className="w-full bg-primary hover:bg-primary-hover text-primary-foreground py-3 rounded-lg font-semibold transition-colors"
              disabled={!location || !checkIn}
              onClick={() => {
                if (!location || !checkIn) return;
                
                const expediaUrl = buildCruiseUrl({
                  departurePort: location,
                  sailDate: checkIn,
                  duration: duration,
                  guests: guests,
                  cabinType: cabinType
                });
                
                window.open(expediaUrl, '_blank');
              }}
            >
              Search Cruises
            </Button>
          </div>
        );

      case 'ai':
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <Bot className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">AI Travel Buddy</h3>
              <p className="text-gray-600 dark:text-slate-400 text-sm">Let AI help you plan your perfect trip</p>
            </div>

            <div className="space-y-3">
              <Input
                placeholder="Where would you like to go?"
                className="bg-gray-50 dark:bg-slate-700 border-gray-200 dark:border-slate-600 text-slate-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-slate-400"
              />
              <Input
                placeholder="What type of experience are you looking for?"
                className="bg-gray-50 dark:bg-slate-700 border-gray-200 dark:border-slate-600 text-slate-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-slate-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-600 dark:text-slate-400 mb-1 block">Budget Range</label>
                <select className="w-full p-3 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white">
                  <option>$500 - $1,000</option>
                  <option>$1,000 - $2,500</option>
                  <option>$2,500 - $5,000</option>
                  <option>$5,000+</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-600 dark:text-slate-400 mb-1 block">Duration</label>
                <select className="w-full p-3 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white">
                  <option>3-5 days</option>
                  <option>1 week</option>
                  <option>2 weeks</option>
                  <option>1 month+</option>
                </select>
              </div>
            </div>

            <Button 
              className="w-full bg-primary hover:bg-primary-hover text-primary-foreground py-3 rounded-lg font-semibold transition-colors"
              onClick={() => navigate('/ai-travel')}
            >
              Get AI Recommendations
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-t-3xl text-slate-900 dark:text-white overflow-hidden border border-gray-200 dark:border-slate-700">
      {/* Category Slider */}
      <div className="bg-gray-50 dark:bg-slate-900 px-4 pt-4 border-b border-gray-200 dark:border-slate-700">
        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center rounded-xl p-3 min-w-[80px] transition-all ${
                activeTab === tab.id
                  ? 'bg-accent text-accent-foreground shadow-md'
                  : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-600 border border-gray-200 dark:border-slate-600'
              }`}
            >
              <span className="text-2xl mb-1">{tab.emoji}</span>
              <span className="text-sm font-medium whitespace-nowrap">{tab.name}</span>
            </button>
          ))}
        </div>
        
        {/* Slider Dots */}
        <div className="flex justify-center gap-1 mt-3 pb-4">
          {tabs.map((_, index) => (
            <div 
              key={index} 
              className={`w-2 h-2 rounded-full transition-colors ${
                Math.floor(tabs.findIndex(tab => tab.id === activeTab) / 3) === Math.floor(index / 3)
                  ? 'bg-primary' 
                  : 'bg-gray-300 dark:bg-slate-600'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Booking Form */}
      <div className="p-6 bg-white dark:bg-slate-800">
        {renderBookingForm()}
      </div>

      {/* Expedia Attribution at bottom of widget */}
      <div className="px-6 pb-4 pt-2 bg-gray-50 dark:bg-slate-900 border-t border-gray-200 dark:border-slate-700">
        <p className="text-center text-xs text-gray-500 dark:text-slate-400">
          Powered by Expedia – Official Utrippin Affiliate Partner
        </p>
      </div>
    </div>
  );
}
