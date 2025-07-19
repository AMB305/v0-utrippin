import React, { useState } from 'react';
import { Calendar, Users, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SimpleAirportAutocomplete from '@/components/SimpleAirportAutocomplete';
import DateSelectionModal from '@/components/DateSelectionModal';
import PassengerModal from '@/components/PassengerModal';
import { DuffelAirport } from '@/lib/duffel';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { buildFlightUrl } from '@/utils/buildAffiliateUrl';

interface PassengerCount {
  adults: number;
  children: number;
  infants: number;
}

export default function FlightBookingForm() {
  const navigate = useNavigate();
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

  const handleSearch = () => {
    if (!isSearchReady) return;
    
    // Format dates for affiliate URL builder
    const departureDateStr = departureDate.toISOString().split('T')[0];
    const returnDateStr = tripType === 'round-trip' && returnDate ? returnDate.toISOString().split('T')[0] : undefined;
    
    // Use the proper affiliate URL builder
    const expediaUrl = buildFlightUrl({
      origin: origin.iata_code,
      destination: destination.iata_code,
      departDate: departureDateStr,
      returnDate: returnDateStr,
      adults: passengers.adults + passengers.children // Include children as adults for Expedia
    });
    
    // Open Expedia in new tab
    window.open(expediaUrl, '_blank');
  };

  return (
    <div className="space-y-4">
      {/* Trip Type Toggle */}
      <div className="flex bg-gray-200 dark:bg-slate-700 rounded-lg p-1">
        <button
          onClick={() => setTripType('round-trip')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            tripType === 'round-trip' 
              ? 'bg-white text-slate-800 shadow-sm' 
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white'
          }`}
        >
          Round trip
        </button>
        <button
          onClick={() => setTripType('one-way')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            tripType === 'one-way' 
              ? 'bg-white text-slate-800 shadow-sm' 
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white'
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
            className="bg-gray-50 dark:bg-slate-700 border-gray-200 dark:border-slate-600 text-slate-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-slate-400"
          />
          
          {/* Swap Button */}
          <button
            onClick={handleSwapAirports}
            className="absolute right-12 top-1/2 -translate-y-1/2 bg-gray-200 dark:bg-slate-600 hover:bg-gray-300 dark:hover:bg-slate-500 rounded-full p-2 transition-colors"
          >
            <ArrowUpDown className="h-4 w-4 text-slate-600 dark:text-white" />
          </button>
        </div>
        
        <SimpleAirportAutocomplete
          placeholder="To"
          value={destination}
          onChange={setDestination}
          className="bg-gray-50 dark:bg-slate-700 border-gray-200 dark:border-slate-600 text-slate-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-slate-400"
        />
      </div>

      {/* Date and Passenger Selection */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => setIsDateModalOpen(true)}
          className="bg-gray-100 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg p-3 text-left hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
        >
            <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500 dark:text-slate-400" />
            <div>
              <div className="text-xs text-gray-500 dark:text-slate-400 mb-1">Dates</div>
              <div className="text-sm text-slate-900 dark:text-white">
                {departureDate ? format(departureDate, 'MMM d') : 'Select'}
                {returnDate && tripType === 'round-trip' && ` - ${format(returnDate, 'MMM d')}`}
              </div>
            </div>
          </div>
        </button>

        <button
          onClick={() => setIsPassengerModalOpen(true)}
          className="bg-gray-100 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg p-3 text-left hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
        >
            <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-gray-500 dark:text-slate-400" />
            <div>
              <div className="text-xs text-gray-500 dark:text-slate-400 mb-1">Travelers</div>
              <div className="text-sm text-slate-900 dark:text-white">{formatPassengerText()}</div>
            </div>
          </div>
        </button>
      </div>

      {/* Search Button */}
      <Button 
        className="w-full bg-primary hover:bg-primary-hover text-primary-foreground py-3 rounded-lg font-semibold transition-colors"
        disabled={!isSearchReady}
        onClick={handleSearch}
      >
        Search Flights
      </Button>

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