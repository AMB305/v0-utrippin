import React, { useState, useEffect } from 'react';
import { X, Calendar, Users, Plane, ArrowLeftRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SimpleAirportAutocomplete from '@/components/SimpleAirportAutocomplete';
import { DuffelAirport } from '@/lib/duffel';
import { format } from 'date-fns';

interface MobileFlightPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PassengerCount {
  adults: number;
  children: number;
  infants: number;
}

export default function MobileFlightPopup({ isOpen, onClose }: MobileFlightPopupProps) {
  const [tripType, setTripType] = useState<'One-way' | 'Round-trip' | 'Multi-city'>('Round-trip');
  const [fromAirport, setFromAirport] = useState<DuffelAirport | null>(null);
  const [toAirport, setToAirport] = useState<DuffelAirport | null>(null);
  const [departureDate, setDepartureDate] = useState<string>('');
  const [returnDate, setReturnDate] = useState<string>('');
  const [passengers, setPassengers] = useState<PassengerCount>({ adults: 1, children: 0, infants: 0 });
  const [cabinClass, setCabinClass] = useState<'Economy' | 'Premium Economy' | 'Business' | 'First'>('Economy');
  const [showPassengerDropdown, setShowPassengerDropdown] = useState(false);
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [isSelectingReturnDate, setIsSelectingReturnDate] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  // Set default dates
  useEffect(() => {
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    
    setDepartureDate(today.toISOString().split('T')[0]);
    setReturnDate(nextWeek.toISOString().split('T')[0]);
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300); // Match animation duration
  };

  const handleSwapAirports = () => {
    const temp = fromAirport;
    setFromAirport(toAirport);
    setToAirport(temp);
  };

  const formatPassengerText = () => {
    const total = passengers.adults + passengers.children + passengers.infants;
    return `${total} Adult${total !== 1 ? 's' : ''}, ${passengers.children} Child${passengers.children !== 1 ? 'ren' : ''}, ${passengers.infants} Infant${passengers.infants !== 1 ? 's' : ''} (on lap)`;
  };

  const handlePassengerChange = (type: keyof PassengerCount, increment: boolean) => {
    setPassengers(prev => ({
      ...prev,
      [type]: increment 
        ? prev[type] + 1 
        : Math.max(0, prev[type] - 1)
    }));
  };

  const handleSearch = () => {
    if (!fromAirport || !toAirport || !departureDate) {
      alert('Please fill in all required fields');
      return;
    }

    // Validate round-trip requirements
    if (tripType === 'Round-trip' && !returnDate) {
      alert('Please select a return date for round-trip flights');
      return;
    }

    // Validate multi-city requirements
    if (tripType === 'Multi-city') {
      alert('Multi-city search will redirect to Expedia for advanced booking');
    }

    // Build Expedia URL
    const formatDate = (dateStr: string) => {
      const date = new Date(dateStr);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}TANYT`;
    };

    const totalPassengers = passengers.adults + passengers.children + passengers.infants;
    const passengerParams = `adults:${passengers.adults},children:${passengers.children},infantinlap:${passengers.infants}`;

    let expediaUrl = '';
    
    switch (tripType) {
      case 'Round-trip':
        expediaUrl = `https://www.expedia.com/Flights-Search?trip=roundtrip&leg1=from:${encodeURIComponent(fromAirport.iata_code)},to:${encodeURIComponent(toAirport.iata_code)},departure:${formatDate(departureDate)}&leg2=from:${encodeURIComponent(toAirport.iata_code)},to:${encodeURIComponent(fromAirport.iata_code)},departure:${formatDate(returnDate)}&passengers=${passengerParams}&mode=search&affiliate=utrippin`;
        break;
      case 'One-way':
        expediaUrl = `https://www.expedia.com/Flights-Search?trip=oneway&leg1=from:${encodeURIComponent(fromAirport.iata_code)},to:${encodeURIComponent(toAirport.iata_code)},departure:${formatDate(departureDate)}&passengers=${passengerParams}&mode=search&affiliate=utrippin`;
        break;
      case 'Multi-city':
        // For multi-city, redirect to general Expedia flight search page
        expediaUrl = `https://www.expedia.com/Flights-Search?trip=multi&leg1=from:${encodeURIComponent(fromAirport.iata_code)},to:${encodeURIComponent(toAirport.iata_code)},departure:${formatDate(departureDate)}&passengers=${passengerParams}&mode=search&affiliate=utrippin`;
        break;
      default:
        expediaUrl = `https://www.expedia.com/Flights-Search?trip=oneway&leg1=from:${encodeURIComponent(fromAirport.iata_code)},to:${encodeURIComponent(toAirport.iata_code)},departure:${formatDate(departureDate)}&passengers=${passengerParams}&mode=search&affiliate=utrippin`;
    }
    
    const finalUrl = `https://www.dpbolvw.net/click-101486313-15754452?url=${encodeURIComponent(expediaUrl)}`;
    window.open(finalUrl, '_blank');
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`mobile-flight-popup-backdrop fixed inset-0 bg-black/50 z-40 md:hidden ${isClosing ? 'animate-fade-out' : 'animate-fade-in'}`}
        onClick={handleClose}
      />
      
      {/* Popup */}
      <div className={`mobile-flight-popup fixed bottom-0 left-0 right-0 bg-gradient-to-br from-white to-blue-50 shadow-2xl z-50 md:hidden transform transition-transform duration-300 ease-out rounded-t-3xl border-t border-blue-100 ${isClosing ? 'animate-slide-down' : 'animate-slide-up'}`}>


        {/* Content */}
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          {/* Trip Type Tabs */}
          <div className="space-y-3 mb-6">
            <div className="flex bg-blue-50 rounded-2xl p-1">
              {(['One-way', 'Round-trip', 'Multi-city'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => {
                    setTripType(type);
                    // Reset return date when switching away from round-trip
                    if (type !== 'Round-trip') {
                      setReturnDate('');
                    }
                  }}
                  className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    tripType === type
                      ? 'text-white shadow-lg'
                      : 'text-blue-700 hover:text-blue-900 hover:bg-blue-100'
                  }`}
                  style={{
                    backgroundColor: tripType === type ? '#0068ef' : 'transparent',
                  }}
                >
                  {type}
                </button>
              ))}
            </div>
            
            {/* Trip Type Info */}
            {tripType === 'Multi-city' && (
              <div className="bg-blue-50 rounded-xl p-3">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-xs text-blue-700">
                    Multi-city bookings will be handled through Expedia's advanced search
                  </span>
                </div>
              </div>
            )}
          </div>



          {/* Main Search Form */}
          <div className="space-y-4">
            {/* From/To Card */}
            <div className="bg-white rounded-3xl p-5 relative">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Plane className="w-4 h-4 text-gray-400" />
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">From</span>
                  </div>
                  <SimpleAirportAutocomplete
                    placeholder="Dubai, UAE"
                    value={fromAirport}
                    onChange={setFromAirport}
                    className="w-full border-0 p-0 text-lg font-bold text-gray-900 bg-transparent focus:ring-0 placeholder:text-gray-400"
                  />
                </div>
                
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Plane className="w-4 h-4 text-gray-400 transform rotate-45" />
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">To</span>
                  </div>
                  <SimpleAirportAutocomplete
                    placeholder="New York, USA"
                    value={toAirport}
                    onChange={setToAirport}
                    className="w-full border-0 p-0 text-lg font-bold text-gray-900 bg-transparent focus:ring-0 placeholder:text-gray-400"
                  />
                </div>
              </div>
            </div>

            {/* Date and Passengers Card */}
            <div className="bg-white rounded-3xl p-5">
              <div className="space-y-4">
                {/* Date Section */}
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Date</span>
                  </div>
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        setIsSelectingReturnDate(false);
                        setIsDateModalOpen(true);
                      }}
                      className="w-full font-medium border-0 p-0 text-md text-gray-900 bg-transparent focus:ring-0 text-left"
                    >
                      {departureDate ? format(new Date(departureDate), 'dd/MM/yyyy') : '10 Sep 2024'}
                    </button>
                    
                    {tripType === 'Round-trip' && (
                      <div className="pt-2 border-t border-gray-100">
                        <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Return Date</div>
                        <button
                          onClick={() => {
                            setIsSelectingReturnDate(true);
                            setIsDateModalOpen(true);
                          }}
                          className="w-full font-medium border-0 p-0 text-md text-gray-900 bg-transparent focus:ring-0 text-left"
                        >
                          {returnDate ? format(new Date(returnDate), 'dd/MM/yyyy') : 'Select return date'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Passengers Section */}
                <div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Departure</span>
                      </div>
                      <button
                        onClick={() => setShowPassengerDropdown(!showPassengerDropdown)}
                        className="text-md font-medium text-gray-900 text-left"
                      >
                        {passengers.adults + passengers.children} Adult{passengers.adults + passengers.children !== 1 ? 's' : ''}, {passengers.children} Child{passengers.children !== 1 ? 'ren' : ''}
                      </button>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className="text-md font-medium text-gray-900">{passengers.adults + passengers.children}</span>
                      <button
                        onClick={() => setShowPassengerDropdown(!showPassengerDropdown)}
                        className="bg-purple-100 hover:bg-purple-200 rounded-full transition-colors"
                      >
                        <Users className="w-4 h-4 text-purple-600" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Search Button */}
            <Button
              onClick={handleSearch}
              className="w-full text-white py-6 rounded-3xl font-bold text-lg mt-6 shadow-lg hover:opacity-90 transition-opacity"
              style={{
                backgroundColor: '#0068ef'
              }}
            >
              Search Flights
            </Button>
          </div>

          {/* Expedia Attribution */}
          <div className="text-center text-xs text-gray-500 mt-6 pt-4">
            Powered by <span className="font-semibold text-blue-600">Expedia</span> — Official Utrippin Affiliate Partner
          </div>
        </div>

        {/* Passenger Dropdown */}
        {showPassengerDropdown && (
          <div className="absolute top-full left-0 right-0 bg-white rounded-b-3xl shadow-2xl p-6 z-60 mx-6">
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Select Passengers</h3>
              
              {/* Adults */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-gray-900">Adults</div>
                  <div className="text-sm text-gray-500">12+ years</div>
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handlePassengerChange('adults', false)}
                    className="w-10 h-10 rounded-full bg-blue-100 hover:bg-blue-200 flex items-center justify-center transition-colors"
                    disabled={passengers.adults <= 1}
                    style={{ backgroundColor: '#e7f3ff' }}
                  >
                    <span className="font-bold" style={{ color: '#0068ef' }}>-</span>
                  </button>
                  <span className="w-8 text-center font-bold text-lg">{passengers.adults}</span>
                  <button
                    onClick={() => handlePassengerChange('adults', true)}
                    className="w-10 h-10 rounded-full bg-blue-100 hover:bg-blue-200 flex items-center justify-center transition-colors"
                    style={{ backgroundColor: '#e7f3ff' }}
                  >
                    <span className="font-bold" style={{ color: '#0068ef' }}>+</span>
                  </button>
                </div>
              </div>

              {/* Children */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-gray-900">Children</div>
                  <div className="text-sm text-gray-500">2-11 years</div>
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handlePassengerChange('children', false)}
                    className="w-10 h-10 rounded-full bg-blue-100 hover:bg-blue-200 flex items-center justify-center transition-colors"
                    disabled={passengers.children <= 0}
                    style={{ backgroundColor: '#e7f3ff' }}
                  >
                    <span className="font-bold" style={{ color: '#0068ef' }}>-</span>
                  </button>
                  <span className="w-8 text-center font-bold text-lg">{passengers.children}</span>
                  <button
                    onClick={() => handlePassengerChange('children', true)}
                    className="w-10 h-10 rounded-full bg-blue-100 hover:bg-blue-200 flex items-center justify-center transition-colors"
                    style={{ backgroundColor: '#e7f3ff' }}
                  >
                    <span className="font-bold" style={{ color: '#0068ef' }}>+</span>
                  </button>
                </div>
              </div>

              {/* Infants */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-gray-900">Infants (on lap)</div>
                  <div className="text-sm text-gray-500">0-2 years</div>
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handlePassengerChange('infants', false)}
                    className="w-10 h-10 rounded-full bg-blue-100 hover:bg-blue-200 flex items-center justify-center transition-colors"
                    disabled={passengers.infants <= 0}
                    style={{ backgroundColor: '#e7f3ff' }}
                  >
                    <span className="font-bold" style={{ color: '#0068ef' }}>-</span>
                  </button>
                  <span className="w-8 text-center font-bold text-lg">{passengers.infants}</span>
                  <button
                    onClick={() => handlePassengerChange('infants', true)}
                    className="w-10 h-10 rounded-full bg-blue-100 hover:bg-blue-200 flex items-center justify-center transition-colors"
                    style={{ backgroundColor: '#e7f3ff' }}
                  >
                    <span className="font-bold" style={{ color: '#0068ef' }}>+</span>
                  </button>
                </div>
              </div>

              {/* Cabin Class */}
              <div className="pt-4 border-t border-gray-100">
                <div className="mb-3">
                  <div className="font-semibold text-gray-900">Cabin Class</div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {(['Economy', 'Premium Economy', 'Business', 'First'] as const).map((cabin) => (
                    <button
                      key={cabin}
                      onClick={() => setCabinClass(cabin)}
                      className={`py-3 px-4 rounded-xl text-sm font-semibold transition-all ${
                        cabinClass === cabin
                          ? 'text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      style={{
                        backgroundColor: cabinClass === cabin ? '#0068ef' : '',
                      }}
                    >
                      {cabin}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setShowPassengerDropdown(false)}
                className="w-full mt-6 py-4 text-white rounded-2xl font-bold hover:opacity-90 transition-opacity"
                style={{
                  backgroundColor: '#0068ef'
                }}
              >
                Done
              </button>
            </div>
          </div>
        )}

        {/* Date Picker Modal */}
        {isDateModalOpen && (
          <div className="absolute top-full left-0 right-0 bg-white rounded-b-3xl shadow-2xl p-6 z-60 mx-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">
                  {isSelectingReturnDate ? 'Select Return Date' : 'Select Departure Date'}
                </h3>
                <button
                  onClick={() => {
                    setIsDateModalOpen(false);
                    setIsSelectingReturnDate(false);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              
              {/* Calendar Grid */}
              <div className="space-y-4">
                {/* Month/Year Header */}
                <div className="flex items-center justify-between">
                  <button className="p-2 hover:bg-gray-100 rounded-full">
                    <span className="text-gray-600">‹</span>
                  </button>
                  <h4 className="text-lg font-semibold text-gray-900">September 2024</h4>
                  <button className="p-2 hover:bg-gray-100 rounded-full">
                    <span className="text-gray-600">›</span>
                  </button>
                </div>

                {/* Days of Week */}
                <div className="grid grid-cols-7 gap-1 text-center">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <div key={day} className="py-2 text-xs font-medium text-gray-500">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Days */}
                <div className="grid grid-cols-7 gap-1">
                  {/* Previous month days (grayed out) */}
                  {[31].map((day) => (
                    <button
                      key={`prev-${day}`}
                      className="h-10 w-10 text-sm text-gray-300 hover:bg-gray-50 rounded-lg"
                    >
                      {day}
                    </button>
                  ))}
                  
                  {/* Current month days */}
                  {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => {
                    const newDate = new Date(2024, 8, day); // September 2024
                    const dateString = newDate.toISOString().split('T')[0];
                    
                    const isSelected = isSelectingReturnDate 
                      ? returnDate === dateString
                      : departureDate === dateString;
                    const isToday = day === new Date().getDate();
                    
                    return (
                      <button
                        key={day}
                        onClick={() => {
                          if (isSelectingReturnDate) {
                            setReturnDate(dateString);
                          } else {
                            setDepartureDate(dateString);
                          }
                          setIsDateModalOpen(false);
                          setIsSelectingReturnDate(false);
                        }}
                        className={`h-10 w-10 text-sm rounded-lg transition-colors ${
                          isSelected
                            ? 'text-white font-semibold'
                            : isToday
                            ? 'bg-blue-100 font-medium'
                            : 'text-gray-700 hover:bg-blue-50'
                        }`}
                        style={{
                          backgroundColor: isSelected ? '#0068ef' : '',
                          color: isToday && !isSelected ? '#0068ef' : ''
                        }}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                onClick={() => {
                  setIsDateModalOpen(false);
                  setIsSelectingReturnDate(false);
                }}
                className="w-full mt-6 py-4 text-white rounded-2xl font-bold hover:opacity-90 transition-opacity"
                style={{
                  backgroundColor: '#0068ef'
                }}
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
} 