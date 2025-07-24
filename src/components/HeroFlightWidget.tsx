import { useState, useEffect, useRef } from 'react';
import { Plane, MapPin, Calendar, Users, ChevronDown } from 'lucide-react';
import SimpleAirportAutocomplete from './SimpleAirportAutocomplete';
import InlineAirportDropdown from './InlineAirportDropdown';
import { DuffelAirport } from '@/lib/duffel';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import heroImage from '@/assets/hero-header-06.jpg';

export default function HeroFlightWidget() {
  const [tripType, setTripType] = useState("round-trip");
  const [fromAirport, setFromAirport] = useState<DuffelAirport | null>(null);
  const [toAirport, setToAirport] = useState<DuffelAirport | null>(null);
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [cabinClass, setCabinClass] = useState("Economy");
  const [showPassengerDropdown, setShowPassengerDropdown] = useState(false);
  const [showCabinDropdown, setShowCabinDropdown] = useState(false);
  const passengerRef = useRef<HTMLDivElement>(null);
  const cabinRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery('(max-width: 768px)');

  useEffect(() => {
    // GA4 tracking
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'widget_view', {
        event_category: 'hero_flight_widget',
        event_label: 'flights'
      });
    }

    // Auto-fill default dates
    const today = new Date();
    const returnDate = new Date(today);
    returnDate.setDate(today.getDate() + 7);
    
    setCheckInDate(today.toISOString().split('T')[0]);
    setCheckOutDate(returnDate.toISOString().split('T')[0]);

    // Close dropdowns when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (passengerRef.current && !passengerRef.current.contains(event.target as Node)) {
        setShowPassengerDropdown(false);
      }
      if (cabinRef.current && !cabinRef.current.contains(event.target as Node)) {
        setShowCabinDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleFlightSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!fromAirport || !toAirport) {
      alert('Please select departure and destination airports');
      return;
    }

    const formatDate = (dateStr: string) => {
      const date = new Date(dateStr);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}TANYT`;
    };
    
    const totalPassengers = adults + children;
    // GA4 tracking
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'click', {
        event_category: 'Hero Flights Search',
        event_label: 'HeroFlightWidget',
        value: 1
      });
    }

    let expediaUrl = '';
    if (tripType === 'round-trip' && checkOutDate) {
      expediaUrl = `https://www.expedia.com/Flights-Search?trip=roundtrip&leg1=from:${encodeURIComponent(fromAirport.iata_code)},to:${encodeURIComponent(toAirport.iata_code)},departure:${formatDate(checkInDate)}&leg2=from:${encodeURIComponent(toAirport.iata_code)},to:${encodeURIComponent(fromAirport.iata_code)},departure:${formatDate(checkOutDate)}&passengers=adults:${adults},children:${children}&mode=search&affiliate=utrippin`;
    } else {
      expediaUrl = `https://www.expedia.com/Flights-Search?trip=oneway&leg1=from:${encodeURIComponent(fromAirport.iata_code)},to:${encodeURIComponent(toAirport.iata_code)},departure:${formatDate(checkInDate)}&passengers=adults:${adults},children:${children}&mode=search&affiliate=utrippin`;
    }
    
    const finalUrl = `https://www.dpbolvw.net/click-101486313-15754452?url=${encodeURIComponent(expediaUrl)}`;
    window.open(finalUrl, '_blank');
  };

  return (
    <div className="relative h-screen w-full bg-black">
      {/* Background Image */}
      <img
        src={heroImage}
        alt="Los Angeles landscape"
        className="absolute inset-0 h-full w-full object-cover"
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col justify-center items-center text-center h-full px-6">
        <h1 className="text-white text-4xl md:text-6xl font-bold mb-8">
          Discover Your World
        </h1>

        {/* Trip Type and Cabin Class Selection - Above the pill, connected to top */}
        <div className="flex justify-start w-full max-w-6xl mb-0 space-x-4">
          {/* Trip Type Selection */}
          <div className="flex bg-white rounded-t-xl shadow-lg overflow-hidden">
            {[
              { value: 'one-way', label: 'One way' },
              { value: 'round-trip', label: 'Round trip' }
            ].map((type) => (
              <label key={type.value} className="flex items-center gap-2 px-6 py-3 cursor-pointer border-r border-gray-200 last:border-r-0 hover:bg-gray-50">
                <input
                  type="radio"
                  name="tripType"
                  value={type.value}
                  checked={tripType === type.value}
                  onChange={(e) => setTripType(e.target.value)}
                  className="w-4 h-4 text-teal-500 focus:ring-teal-400"
                />
                <span className="text-sm font-medium text-gray-700">
                  {type.label}
                </span>
              </label>
            ))}
          </div>

          {/* Cabin Class Selection */}
          <div className="relative" ref={cabinRef}>
            <div 
              className="flex items-center gap-2 px-6 py-3 bg-white rounded-t-xl shadow-lg cursor-pointer hover:bg-gray-50"
              onClick={() => setShowCabinDropdown(!showCabinDropdown)}
            >
              <span className="text-sm font-medium text-gray-700">{cabinClass}</span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </div>
            
            {/* Cabin Class Dropdown */}
            {showCabinDropdown && (
              <div className="absolute top-full left-0 bg-white border border-gray-200 rounded-lg shadow-xl z-[9999] mt-2 p-2 w-[180px]">
                {[
                  'Economy',
                  'Premium Economy', 
                  'Business',
                  'First Class'
                ].map((cabin) => (
                  <button
                    key={cabin}
                    type="button"
                    onClick={() => {
                      setCabinClass(cabin);
                      setShowCabinDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-50 ${
                      cabinClass === cabin ? 'bg-teal-50 text-teal-700 font-medium' : 'text-gray-700'
                    }`}
                  >
                    {cabin}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Flight Widget */}
        <div className="bg-white rounded-b-full rounded-tr-full shadow-2xl w-full max-w-6xl relative">
          <form onSubmit={handleFlightSubmit}>
            <div className="flex items-center">
              {/* From Field */}
              <div className="flex items-center px-6 py-4 border-r border-gray-200">
                <MapPin className="text-teal-500 w-5 h-5 mr-3 flex-shrink-0" />
                <div className="min-w-0">
                  {isMobile ? (
                    <InlineAirportDropdown
                      placeholder="USA"
                      value={fromAirport}
                      onChange={setFromAirport}
                      inputClassName="border-0 bg-transparent text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-0 text-base font-medium w-full"
                    />
                  ) : (
                    <SimpleAirportAutocomplete
                      placeholder="USA"
                      value={fromAirport}
                      onChange={setFromAirport}
                      className="border-0 bg-transparent text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-0 text-base font-medium w-full"
                    />
                  )}
                </div>
              </div>

              {/* To Field */}
              <div className="flex items-center px-6 py-4 border-r border-gray-200">
                <MapPin className="text-teal-500 w-5 h-5 mr-3 flex-shrink-0" />
                <div className="min-w-0">
                  {isMobile ? (
                    <InlineAirportDropdown
                      placeholder="Los Angeles"
                      value={toAirport}
                      onChange={setToAirport}
                      inputClassName="border-0 bg-transparent text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-0 text-base font-medium w-full"
                    />
                  ) : (
                    <SimpleAirportAutocomplete
                      placeholder="Los Angeles"
                      value={toAirport}
                      onChange={setToAirport}
                      className="border-0 bg-transparent text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-0 text-base font-medium w-full"
                    />
                  )}
                </div>
              </div>

              {/* Date Range */}
              <div className="flex items-center px-6 py-4 border-r border-gray-200">
                <Calendar className="text-teal-500 w-5 h-5 mr-3 flex-shrink-0" />
                <div className="flex items-center space-x-2">
                  <input
                    type="date"
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    className="border-0 bg-transparent text-gray-700 focus:outline-none focus:ring-0 text-base font-medium"
                    required
                  />
                  {tripType === 'round-trip' && (
                    <>
                      <span className="text-gray-400">-</span>
                      <input
                        type="date"
                        value={checkOutDate}
                        onChange={(e) => setCheckOutDate(e.target.value)}
                        className="border-0 bg-transparent text-gray-700 focus:outline-none focus:ring-0 text-base font-medium"
                        required
                      />
                    </>
                  )}
                </div>
              </div>

              {/* Passengers */}
              <div className="flex items-center px-6 py-4 border-r border-gray-200 relative" ref={passengerRef}>
                <Users className="text-teal-500 w-5 h-5 mr-3 flex-shrink-0" />
                <div 
                  className="flex items-center cursor-pointer text-gray-700 font-medium"
                  onClick={() => {
                    console.log('Passenger dropdown clicked');
                    setShowPassengerDropdown(!showPassengerDropdown);
                  }}
                >
                  <span>
                    {adults + children < 10 ? `0${adults + children}` : adults + children} {adults + children === 1 ? 'Adult' : 'Adults'}
                  </span>
                  <ChevronDown className="w-4 h-4 ml-2 text-gray-400" />
                </div>
                
                {/* Passenger Dropdown */}
                {showPassengerDropdown && (
                  <div className="absolute top-full left-0 bg-white border border-gray-200 rounded-lg shadow-xl z-[9999] mt-2 p-4 w-[220px]">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700 font-medium">Adults</span>
                        <div className="flex items-center space-x-3">
                          <button
                            type="button"
                            onClick={() => setAdults(Math.max(1, adults - 1))}
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                          >
                            -
                          </button>
                          <span className="w-8 text-center">{adults}</span>
                          <button
                            type="button"
                            onClick={() => setAdults(Math.min(6, adults + 1))}
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700 font-medium">Children</span>
                        <div className="flex items-center space-x-3">
                          <button
                            type="button"
                            onClick={() => setChildren(Math.max(0, children - 1))}
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                          >
                            -
                          </button>
                          <span className="w-8 text-center">{children}</span>
                          <button
                            type="button"
                            onClick={() => setChildren(Math.min(4, children + 1))}
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Search Button */}
              <button 
                type="submit"
                className="bg-teal-500 hover:bg-teal-600 text-white font-bold px-8 py-4 text-base transition-colors duration-200 rounded-r-full"
              >
                SEARCH
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* CJ Affiliate Pixel */}
      <img src="https://www.lduhtrp.net/image-101486313-15754452" width="1" height="1" style={{border: 0}} alt="" />
    </div>
  );
}