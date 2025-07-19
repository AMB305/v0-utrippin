import React, { useState } from 'react';
import { Calendar, Users, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SimpleAirportAutocomplete from '@/components/SimpleAirportAutocomplete';
import DateSelectionModal from '@/components/DateSelectionModal';
import PassengerModal from '@/components/PassengerModal';
import { DuffelAirport } from '@/lib/duffel';
import { format } from 'date-fns';

const tabs = [
  { name: 'Flights', emoji: '✈️', id: 'flights' },
  { name: 'Hotels', emoji: '🏨', id: 'hotels' },
  { name: 'Cars', emoji: '🚗', id: 'cars' },
  { name: 'Packages', emoji: '🧳', id: 'packages' },
  { name: 'Cruises', emoji: '🛳️', id: 'cruises' },
  { name: 'Travel Buddy', emoji: '🤖', id: 'ai' },
];

interface MobileFlightSearchProps {
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
}

interface PassengerCount {
  adults: number;
  children: number;
  infants: number;
}

export default function MobileFlightSearch({ 
  activeTab = 'flights', 
  onTabChange 
}: MobileFlightSearchProps) {
  const [origin, setOrigin] = useState<DuffelAirport | null>(null);
  const [destination, setDestination] = useState<DuffelAirport | null>(null);
  const [departureDate, setDepartureDate] = useState<Date | undefined>();
  const [returnDate, setReturnDate] = useState<Date | undefined>();
  const [passengers, setPassengers] = useState<PassengerCount>({ adults: 1, children: 0, infants: 0 });
  const [cabinClass, setCabinClass] = useState('economy');
  const [tripType, setTripType] = useState<'round-trip' | 'one-way'>('round-trip');
  
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [isPassengerModalOpen, setIsPassengerModalOpen] = useState(false);

  const handleSwapAirports = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };

  const handleDateSelect = (dates: { departureDate: Date | undefined; returnDate: Date | undefined }) => {
    setDepartureDate(dates.departureDate);
    setReturnDate(dates.returnDate);
  };

  const handlePassengerSelect = (passengerCount: PassengerCount, selectedCabinClass: string) => {
    setPassengers(passengerCount);
    setCabinClass(selectedCabinClass);
  };

  const formatPassengerText = () => {
    const total = passengers.adults + passengers.children + passengers.infants;
    return `${total} passenger${total !== 1 ? 's' : ''} • ${cabinClass.charAt(0).toUpperCase() + cabinClass.slice(1)}`;
  };

  const isSearchReady = origin && destination && departureDate;

  return (
    <div className="bg-slate-800 rounded-2xl mt-6 text-white overflow-hidden">
      {/* Category Slider */}
      <div className="bg-slate-900 p-4">
        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange?.(tab.id)}
              className={`flex flex-col items-center justify-center rounded-xl p-3 min-w-[80px] transition-all ${
                activeTab === tab.id
                  ? 'bg-pink-600 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              <span className="text-xl mb-1">{tab.emoji}</span>
              <span className="text-xs font-medium whitespace-nowrap">{tab.name}</span>
            </button>
          ))}
        </div>
        
        {/* Slider Dots */}
        <div className="flex justify-center gap-1 mt-3">
          {tabs.map((_, index) => (
            <div 
              key={index} 
              className={`w-2 h-2 rounded-full transition-colors ${
                Math.floor(tabs.findIndex(tab => tab.id === activeTab) / 3) === Math.floor(index / 3)
                  ? 'bg-pink-400' 
                  : 'bg-slate-600'
              }`} 
            />
          ))}
        </div>
      </div>

      {/* Flight Search Form - Only show when Flights tab is active */}
      {activeTab === 'flights' ? (
        <div className="p-6">
          <div className="space-y-4">
        {/* Trip Type Toggle */}
        <div className="flex bg-slate-700 rounded-lg p-1">
          <button
            onClick={() => setTripType('round-trip')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              tripType === 'round-trip' 
                ? 'bg-white text-slate-800' 
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Round trip
          </button>
          <button
            onClick={() => setTripType('one-way')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              tripType === 'one-way' 
                ? 'bg-white text-slate-800' 
                : 'text-slate-300 hover:text-white'
            }`}
          >
            One way
          </button>
        </div>

        {/* Airport Selection */}
        <div className="space-y-3">
          <div className="relative">
            <SimpleAirportAutocomplete
              placeholder="From"
              value={origin}
              onChange={setOrigin}
              className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
            />
            
            {/* Swap Button */}
            <button
              onClick={handleSwapAirports}
              className="absolute right-12 top-1/2 -translate-y-1/2 bg-slate-600 hover:bg-slate-500 rounded-full p-2 transition-colors"
            >
              <ArrowUpDown className="h-4 w-4 text-white" />
            </button>
          </div>
          
          <SimpleAirportAutocomplete
            placeholder="To"
            value={destination}
            onChange={setDestination}
            className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
          />
        </div>

        {/* Date and Passenger Selection */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setIsDateModalOpen(true)}
            className="bg-slate-700 border border-slate-600 rounded-lg p-3 text-left hover:bg-slate-600 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-slate-400" />
              <div>
                <div className="text-xs text-slate-400 mb-1">Dates</div>
                <div className="text-sm">
                  {departureDate ? format(departureDate, 'MMM d') : 'Select'}
                  {returnDate && tripType === 'round-trip' && ` - ${format(returnDate, 'MMM d')}`}
                </div>
              </div>
            </div>
          </button>

          <button
            onClick={() => setIsPassengerModalOpen(true)}
            className="bg-slate-700 border border-slate-600 rounded-lg p-3 text-left hover:bg-slate-600 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Users className="h-4 w-4 text-slate-400 flex-shrink-0" />
              <div className="min-w-0">
                <div className="text-xs text-slate-400 mb-1">Travelers</div>
                <div className="text-sm truncate">{formatPassengerText()}</div>
              </div>
            </div>
          </button>
        </div>

        {/* Search Button */}
        <Button 
          className="w-full bg-pink-600 hover:bg-pink-700 text-white py-3 rounded-lg font-semibold"
          disabled={!isSearchReady}
        >
          Search Flights
        </Button>
          </div>
        </div>
      ) : (
        <div className="p-12 text-center">
          <div className="text-6xl mb-4">
            {tabs.find(tab => tab.id === activeTab)?.emoji}
          </div>
          <p className="text-slate-300 text-lg font-medium mb-2">
            {tabs.find(tab => tab.id === activeTab)?.name}
          </p>
          <p className="text-slate-400">
            Booking coming soon
          </p>
        </div>
      )}

      {/* Expedia Attribution at bottom of widget */}
      <div className="px-6 pb-4 pt-2 bg-slate-900 border-t border-slate-700">
        <p className="text-center text-xs text-slate-400">
          Powered by Expedia – Official Utrippin Affiliate Partner
        </p>
      </div>

      {/* Date Selection Modal */}
      <DateSelectionModal
        isOpen={isDateModalOpen}
        onClose={() => setIsDateModalOpen(false)}
        onSelect={handleDateSelect}
        departureDate={departureDate}
        returnDate={returnDate}
        tripType={tripType}
        title="Select Flight Dates"
      />

      {/* Passenger Modal */}
      <PassengerModal
        isOpen={isPassengerModalOpen}
        onClose={() => setIsPassengerModalOpen(false)}
        onSelect={handlePassengerSelect}
        initialPassengers={passengers}
        initialCabinClass={cabinClass}
      />
    </div>
  );
}