import { useState, useEffect } from 'react';
import { Plane, MapPin, Calendar, Users, ArrowLeftRight } from 'lucide-react';
import SimpleAirportAutocomplete from './SimpleAirportAutocomplete';
import InlineAirportDropdown from './InlineAirportDropdown';
import { DuffelAirport } from '@/lib/duffel';
import { useMediaQuery } from '@/hooks/useMediaQuery';
// Import custom icons
import hotelIcon from '@/assets/hotel-icon.png';
import flightIcon from '@/assets/flight-icon.png';
import carIcon from '@/assets/car-icon.png';
import packageIcon from '@/assets/package-icon.png';

interface PassengerCount {
  adults: number;
  children: number;
  infants: number;
}

export default function ExpediaWidget() {
  const [activeTab, setActiveTab] = useState("Flights");
  const [tripType, setTripType] = useState<'One-way' | 'Round-trip' | 'Multi-city'>('Round-trip');
  const [fromAirport, setFromAirport] = useState<DuffelAirport | null>(null);
  const [toAirport, setToAirport] = useState<DuffelAirport | null>(null);
  const [destination, setDestination] = useState("");
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [passengers, setPassengers] = useState<PassengerCount>({ adults: 1, children: 0, infants: 0 });
  const [cabinClass, setCabinClass] = useState<'Economy' | 'Premium Economy' | 'Business' | 'First'>('Economy');
  const [showPassengerDropdown, setShowPassengerDropdown] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');

  useEffect(() => {
    // GA4 tracking
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'widget_view', {
        event_category: 'expedia_widget',
        event_label: activeTab
      });
    }

    // Auto-fill default dates
    const today = new Date();
    const checkout = new Date(today);
    checkout.setDate(today.getDate() + 7);
    
    setCheckInDate(today.toISOString().split('T')[0]);
    setCheckOutDate(checkout.toISOString().split('T')[0]);
  }, [activeTab]);

  const handleSwapAirports = () => {
    const temp = fromAirport;
    setFromAirport(toAirport);
    setToAirport(temp);
  };

  const handlePassengerChange = (type: keyof PassengerCount, increment: boolean) => {
    setPassengers(prev => ({
      ...prev,
      [type]: increment 
        ? prev[type] + 1 
        : Math.max(0, prev[type] - 1)
    }));
  };

  const formatPassengerText = () => {
    const total = passengers.adults + passengers.children + passengers.infants;
    return `${total} passenger${total !== 1 ? 's' : ''}, ${cabinClass}`;
  };

  const handleFlightSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!fromAirport || !toAirport || !checkInDate) {
      alert('Please fill in all required fields');
      return;
    }

    // Validate round-trip requirements
    if (tripType === 'Round-trip' && !checkOutDate) {
      alert('Please select a return date for round-trip flights');
      return;
    }

    // Validate multi-city requirements
    if (tripType === 'Multi-city') {
      alert('Multi-city search will redirect to Expedia for advanced booking');
    }

    const formatDate = (dateStr: string) => {
      const date = new Date(dateStr);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}TANYT`;
    };

    const totalPassengers = passengers.adults + passengers.children + passengers.infants;
    const passengerParams = `adults:${passengers.adults},children:${passengers.children},infantinlap:${passengers.infants}`;
    
    // GA4 tracking
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'click', {
        event_category: 'Flights Search',
        event_label: `ExpediaWidget-${tripType}`,
        value: totalPassengers
      });
    }

    let expediaUrl = '';
    
    switch (tripType) {
      case 'Round-trip':
        expediaUrl = `https://www.expedia.com/Flights-Search?trip=roundtrip&leg1=from:${encodeURIComponent(fromAirport.iata_code)},to:${encodeURIComponent(toAirport.iata_code)},departure:${formatDate(checkInDate)}&leg2=from:${encodeURIComponent(toAirport.iata_code)},to:${encodeURIComponent(fromAirport.iata_code)},departure:${formatDate(checkOutDate)}&passengers=${passengerParams}&mode=search&affiliate=utrippin`;
        break;
      case 'One-way':
        expediaUrl = `https://www.expedia.com/Flights-Search?trip=oneway&leg1=from:${encodeURIComponent(fromAirport.iata_code)},to:${encodeURIComponent(toAirport.iata_code)},departure:${formatDate(checkInDate)}&passengers=${passengerParams}&mode=search&affiliate=utrippin`;
        break;
      case 'Multi-city':
        // For multi-city, redirect to general Expedia flight search page
        expediaUrl = `https://www.expedia.com/Flights-Search?trip=multi&leg1=from:${encodeURIComponent(fromAirport.iata_code)},to:${encodeURIComponent(toAirport.iata_code)},departure:${formatDate(checkInDate)}&passengers=${passengerParams}&mode=search&affiliate=utrippin`;
        break;
      default:
        expediaUrl = `https://www.expedia.com/Flights-Search?trip=oneway&leg1=from:${encodeURIComponent(fromAirport.iata_code)},to:${encodeURIComponent(toAirport.iata_code)},departure:${formatDate(checkInDate)}&passengers=${passengerParams}&mode=search&affiliate=utrippin`;
    }
    
    const finalUrl = `https://www.dpbolvw.net/click-101486313-15754452?url=${encodeURIComponent(expediaUrl)}`;
    window.open(finalUrl, '_blank');
  };

  const handleHotelSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!destination) {
      alert('Please enter a destination');
      return;
    }

    const expediaUrl = `https://www.expedia.com/Hotel-Search?destination=${encodeURIComponent(destination)}&startDate=${checkInDate}&endDate=${checkOutDate}&rooms=1&adults=1&affiliate_id=101486313`;
    const finalUrl = `https://www.dpbolvw.net/click-101486313-15754452?url=${encodeURIComponent(expediaUrl)}`;
    window.open(finalUrl, '_blank');
  };

  const handleGenericSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const finalUrl = `https://www.dpbolvw.net/click-101486313-15754452`;
    window.open(finalUrl, '_blank');
  };

  const renderFlightForm = () => (
    <form onSubmit={handleFlightSubmit} className="space-y-6">
      {/* Trip Type Tabs */}
      <div className="space-y-3">
        <div className="flex bg-blue-50 rounded-xl p-1">
          {(['One-way', 'Round-trip', 'Multi-city'] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => {
                setTripType(type);
                // Reset return date when switching away from round-trip
                if (type !== 'Round-trip') {
                  setCheckOutDate('');
                }
              }}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
                tripType === type
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'text-blue-700 hover:text-blue-900 hover:bg-blue-100'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
        
        {/* Trip Type Info */}
        {tripType === 'Multi-city' && (
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span className="text-xs text-blue-700">
                Multi-city bookings will be handled through Expedia's advanced search
              </span>
            </div>
          </div>
        )}
      </div>

      {/* From/To Section */}
      <div className="space-y-4">
        {/* From Field */}
        <div className="relative">
          <Plane className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
          {isMobile ? (
            <InlineAirportDropdown
              placeholder="From: Departure city"
              value={fromAirport}
              onChange={setFromAirport}
              inputClassName="pl-12 pr-4 py-4 w-full border border-gray-200 rounded-xl text-base bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none focus:bg-white"
            />
          ) : (
            <SimpleAirportAutocomplete
              placeholder="From: Departure city"
              value={fromAirport}
              onChange={setFromAirport}
              className="pl-12 pr-4 py-4 w-full border border-gray-200 rounded-xl text-base bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none focus:bg-white"
            />
          )}
        </div>

        {/* Swap Button */}
        <div className="flex justify-center">
          <button
            type="button"
            onClick={handleSwapAirports}
            className="p-2 bg-blue-100 hover:bg-blue-200 rounded-full transition-colors"
          >
            <ArrowLeftRight className="w-4 h-4 text-blue-600" />
          </button>
        </div>

        {/* To Field */}
        <div className="relative">
          <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
          {isMobile ? (
            <InlineAirportDropdown
              placeholder="To: Destination city"
              value={toAirport}
              onChange={setToAirport}
              inputClassName="pl-12 pr-4 py-4 w-full border border-gray-200 rounded-xl text-base bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none focus:bg-white"
            />
          ) : (
            <SimpleAirportAutocomplete
              placeholder="To: Destination city"
              value={toAirport}
              onChange={setToAirport}
              className="pl-12 pr-4 py-4 w-full border border-gray-200 rounded-xl text-base bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none focus:bg-white"
            />
          )}
        </div>
      </div>

      {/* Dates Section */}
      <div className="space-y-4">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
            <input
              type="date"
              value={checkInDate}
              onChange={(e) => setCheckInDate(e.target.value)}
              className="pl-10 pr-3 py-4 w-full border border-gray-200 rounded-xl text-sm bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none focus:bg-white"
              required
              placeholder="Departure date"
            />
            <label className="absolute -top-2 left-3 bg-white px-1 text-xs text-gray-500">Departure</label>
          </div>
          
          {tripType === 'Round-trip' && (
            <div className="relative flex-1">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
              <input
                type="date"
                value={checkOutDate}
                onChange={(e) => setCheckOutDate(e.target.value)}
                className="pl-10 pr-3 py-4 w-full border border-gray-200 rounded-xl text-sm bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none focus:bg-white"
                required
                placeholder="Return date"
              />
              <label className="absolute -top-2 left-3 bg-white px-1 text-xs text-gray-500">Return</label>
            </div>
          )}
        </div>
      </div>

      {/* Passengers Section */}
      <div className="relative">
        <Users className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
        <button
          type="button"
          onClick={() => setShowPassengerDropdown(!showPassengerDropdown)}
          className="w-full pl-12 pr-4 py-4 text-left border border-gray-200 rounded-xl text-base bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none focus:bg-white"
        >
          {formatPassengerText()}
        </button>
        
        {/* Passenger Dropdown */}
        {showPassengerDropdown && (
          <div className="absolute top-full left-0 right-0 bg-white rounded-xl shadow-lg border border-gray-200 p-4 z-20 mt-1">
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Passengers</h4>
              
              {/* Adults */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">Adults</div>
                  <div className="text-sm text-gray-500">12+ years</div>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={() => handlePassengerChange('adults', false)}
                    className="w-8 h-8 rounded-full bg-blue-100 hover:bg-blue-200 flex items-center justify-center"
                    disabled={passengers.adults <= 1}
                  >
                    <span className="text-blue-600 font-bold">-</span>
                  </button>
                  <span className="w-6 text-center font-medium">{passengers.adults}</span>
                  <button
                    type="button"
                    onClick={() => handlePassengerChange('adults', true)}
                    className="w-8 h-8 rounded-full bg-blue-100 hover:bg-blue-200 flex items-center justify-center"
                  >
                    <span className="text-blue-600 font-bold">+</span>
                  </button>
                </div>
              </div>

              {/* Children */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">Children</div>
                  <div className="text-sm text-gray-500">2-11 years</div>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={() => handlePassengerChange('children', false)}
                    className="w-8 h-8 rounded-full bg-blue-100 hover:bg-blue-200 flex items-center justify-center"
                    disabled={passengers.children <= 0}
                  >
                    <span className="text-blue-600 font-bold">-</span>
                  </button>
                  <span className="w-6 text-center font-medium">{passengers.children}</span>
                  <button
                    type="button"
                    onClick={() => handlePassengerChange('children', true)}
                    className="w-8 h-8 rounded-full bg-blue-100 hover:bg-blue-200 flex items-center justify-center"
                  >
                    <span className="text-blue-600 font-bold">+</span>
                  </button>
                </div>
              </div>

              {/* Infants */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">Infants (on lap)</div>
                  <div className="text-sm text-gray-500">0-2 years</div>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={() => handlePassengerChange('infants', false)}
                    className="w-8 h-8 rounded-full bg-blue-100 hover:bg-blue-200 flex items-center justify-center"
                    disabled={passengers.infants <= 0}
                  >
                    <span className="text-blue-600 font-bold">-</span>
                  </button>
                  <span className="w-6 text-center font-medium">{passengers.infants}</span>
                  <button
                    type="button"
                    onClick={() => handlePassengerChange('infants', true)}
                    className="w-8 h-8 rounded-full bg-blue-100 hover:bg-blue-200 flex items-center justify-center"
                  >
                    <span className="text-blue-600 font-bold">+</span>
                  </button>
                </div>
              </div>

              {/* Cabin Class */}
              <div className="pt-3 border-t border-gray-100">
                <div className="mb-2">
                  <div className="font-medium text-gray-900">Cabin Class</div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {(['Economy', 'Premium Economy', 'Business', 'First'] as const).map((cabin) => (
                    <button
                      key={cabin}
                      type="button"
                      onClick={() => setCabinClass(cabin)}
                      className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                        cabinClass === cabin
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {cabin}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowPassengerDropdown(false)}
                className="w-full mt-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Search Button */}
      <button 
        type="submit"
        className="w-full py-4 bg-[#1664ff] text-white font-semibold rounded-full text-lg hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
      >
        Search Flights
      </button>
      
      {/* Expedia Branding */}
      <div className="text-center text-xs text-gray-500 mt-4 pt-3 border-t border-gray-100">
        Powered by <span className="font-semibold">Expedia</span> — Official Utrippin Affiliate Partner
      </div>
    </form>
  );

  const renderHotelForm = () => (
    <form onSubmit={handleHotelSubmit} className="space-y-6">
      {/* Destination Field */}
      <div className="relative">
        <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
        <input
          type="text"
          placeholder="Where to?"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          className="pl-12 pr-4 py-5 w-full border border-gray-200 rounded-xl text-base bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none focus:bg-white"
          required
        />
      </div>

      {/* Dates */}
      <div className="flex gap-3">
        <div className="relative w-1/2">
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
          <input
            type="date"
            value={checkInDate}
            onChange={(e) => setCheckInDate(e.target.value)}
            className="pl-10 pr-3 py-5 w-full border border-gray-200 rounded-xl text-sm bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none focus:bg-white"
            required
          />
        </div>
        <div className="relative w-1/2">
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
          <input
            type="date"
            value={checkOutDate}
            onChange={(e) => setCheckOutDate(e.target.value)}
            className="pl-10 pr-3 py-5 w-full border border-gray-200 rounded-xl text-sm bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none focus:bg-white"
            required
          />
        </div>
      </div>

      {/* Search Button */}
      <button 
        type="submit"
        className="w-full py-5 bg-[#1664ff] text-white font-semibold rounded-full text-lg hover:bg-blue-700 transition mt-8"
      >
        Search
      </button>
      
      {/* Expedia Branding */}
      <div className="text-center text-xs text-gray-500 mt-4 pt-3 border-t border-gray-100">
        Powered by <span className="font-semibold">Expedia</span> — Official Utrippin Affiliate Partner
      </div>
    </form>
  );

  const renderGenericForm = () => (
    <form onSubmit={handleGenericSubmit} className="space-y-6">
      {/* Destination Field */}
      <div className="relative">
        <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
        <input
          type="text"
          placeholder="Search destination"
          className="pl-12 pr-4 py-5 w-full border border-gray-200 rounded-xl text-base bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none focus:bg-white"
          required
        />
      </div>

      {/* Dates */}
      <div className="flex gap-3">
        <div className="relative w-1/2">
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
          <input
            type="date"
            value={checkInDate}
            onChange={(e) => setCheckInDate(e.target.value)}
            className="pl-10 pr-3 py-5 w-full border border-gray-200 rounded-xl text-sm bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none focus:bg-white"
            required
          />
        </div>
        <div className="relative w-1/2">
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
          <input
            type="date"
            value={checkOutDate}
            onChange={(e) => setCheckOutDate(e.target.value)}
            className="pl-10 pr-3 py-5 w-full border border-gray-200 rounded-xl text-sm bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none focus:bg-white"
            required
          />
        </div>
      </div>

      {/* Search Button */}
      <button 
        type="submit"
        className="w-full py-5 bg-[#1664ff] text-white font-semibold rounded-full text-lg hover:bg-blue-700 transition mt-8"
      >
        Search {activeTab}
      </button>
      
      {/* Expedia Branding */}
      <div className="text-center text-xs text-gray-500 mt-4 pt-3 border-t border-gray-100">
        Powered by <span className="font-semibold">Expedia</span> — Official Utrippin Affiliate Partner
      </div>
    </form>
  );

  const forms = {
    Flights: renderFlightForm(),
    Stays: renderHotelForm(),
    Packages: renderGenericForm(),
    Cars: renderGenericForm(),
  };

  return (
    <div className="w-full max-w-md mx-auto p-8 bg-white rounded-xl shadow">
      {/* Form Content */}
      <div className="space-y-4">
        {forms[activeTab as keyof typeof forms]}
      </div>
      
      {/* CJ Affiliate Pixel */}
      <img src="https://www.lduhtrp.net/image-101486313-15754452" width="1" height="1" style={{border: 0}} alt="" />
    </div>
  );
}