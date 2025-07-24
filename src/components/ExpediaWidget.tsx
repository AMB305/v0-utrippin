import { useState, useEffect } from 'react';
import { Plane, MapPin, Calendar, Users, ArrowLeftRight } from 'lucide-react';
import SimpleAirportAutocomplete from './SimpleAirportAutocomplete';
import InlineAirportDropdown from './InlineAirportDropdown';
import { DuffelAirport } from '@/lib/duffel';
import { useMediaQuery } from '@/hooks/useMediaQuery';

export default function ExpediaWidget() {
  const [tripType, setTripType] = useState("round-trip");
  const [fromAirport, setFromAirport] = useState<DuffelAirport | null>(null);
  const [toAirport, setToAirport] = useState<DuffelAirport | null>(null);
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [passengers, setPassengers] = useState(1);
  const [cabinClass, setCabinClass] = useState("Economy");
  const isMobile = useMediaQuery('(max-width: 768px)');

  useEffect(() => {
    // GA4 tracking
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'widget_view', {
        event_category: 'expedia_widget',
        event_label: 'flights'
      });
    }

    // Auto-fill default dates
    const today = new Date();
    const returnDate = new Date(today);
    returnDate.setDate(today.getDate() + 7);
    
    setCheckInDate(today.toISOString().split('T')[0]);
    setCheckOutDate(returnDate.toISOString().split('T')[0]);
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
    
    // GA4 tracking
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'click', {
        event_category: 'Flights Search',
        event_label: 'ExpediaWidget',
        value: 1
      });
    }

    let expediaUrl = '';
    if (tripType === 'round-trip' && checkOutDate) {
      expediaUrl = `https://www.expedia.com/Flights-Search?trip=roundtrip&leg1=from:${encodeURIComponent(fromAirport.iata_code)},to:${encodeURIComponent(toAirport.iata_code)},departure:${formatDate(checkInDate)}&leg2=from:${encodeURIComponent(toAirport.iata_code)},to:${encodeURIComponent(fromAirport.iata_code)},departure:${formatDate(checkOutDate)}&passengers=adults:${passengers}&mode=search&affiliate=utrippin`;
    } else {
      expediaUrl = `https://www.expedia.com/Flights-Search?trip=oneway&leg1=from:${encodeURIComponent(fromAirport.iata_code)},to:${encodeURIComponent(toAirport.iata_code)},departure:${formatDate(checkInDate)}&passengers=adults:${passengers}&mode=search&affiliate=utrippin`;
    }
    
    const finalUrl = `https://www.dpbolvw.net/click-101486313-15754452?url=${encodeURIComponent(expediaUrl)}`;
    window.open(finalUrl, '_blank');
  };

  const swapAirports = () => {
    setFromAirport(toAirport);
    setToAirport(fromAirport);
  };

  const renderFlightForm = () => (
    <div className="bg-white rounded-2xl shadow-lg p-8 max-w-7xl mx-auto border border-gray-100">
      {/* Trip Type Selection */}
      <div className="flex gap-8 mb-8">
        {[
          { value: 'one-way', label: 'One way' },
          { value: 'round-trip', label: 'Round trip' },
          { value: 'multi-city', label: 'Multi-city' }
        ].map((type) => (
          <label key={type.value} className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name="tripType"
              value={type.value}
              checked={tripType === type.value}
              onChange={(e) => setTripType(e.target.value)}
              className="w-5 h-5 text-blue-600 focus:ring-blue-500 focus:ring-2"
            />
            <span className="text-base font-medium text-gray-700">
              {type.label}
            </span>
          </label>
        ))}
      </div>

      <form onSubmit={handleFlightSubmit}>
        {/* Main Search Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end mb-6">
          {/* From Airport */}
          <div className="lg:col-span-3">
            <label className="block text-sm font-semibold text-gray-900 mb-3">From</label>
            <div className="relative">
              <Plane className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
              {isMobile ? (
                <InlineAirportDropdown
                  placeholder="Departure"
                  value={fromAirport}
                  onChange={setFromAirport}
                  inputClassName="pl-12 pr-4 py-4 w-full border-2 border-gray-200 rounded-xl text-base bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none hover:border-gray-300 transition-colors"
                />
              ) : (
                <SimpleAirportAutocomplete
                  placeholder="Departure"
                  value={fromAirport}
                  onChange={setFromAirport}
                  className="pl-12 pr-4 py-4 w-full border-2 border-gray-200 rounded-xl text-base bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none hover:border-gray-300 transition-colors"
                />
              )}
            </div>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center lg:col-span-1">
            <button
              type="button"
              onClick={swapAirports}
              className="p-3 rounded-full border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 bg-white"
            >
              <ArrowLeftRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* To Airport */}
          <div className="lg:col-span-3">
            <label className="block text-sm font-semibold text-gray-900 mb-3">To</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
              {isMobile ? (
                <InlineAirportDropdown
                  placeholder="Destination"
                  value={toAirport}
                  onChange={setToAirport}
                  inputClassName="pl-12 pr-4 py-4 w-full border-2 border-gray-200 rounded-xl text-base bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none hover:border-gray-300 transition-colors"
                />
              ) : (
                <SimpleAirportAutocomplete
                  placeholder="Destination"
                  value={toAirport}
                  onChange={setToAirport}
                  className="pl-12 pr-4 py-4 w-full border-2 border-gray-200 rounded-xl text-base bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none hover:border-gray-300 transition-colors"
                />
              )}
            </div>
          </div>

          {/* Departure Date */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-semibold text-gray-900 mb-3">Departure</label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
              <input
                type="date"
                value={checkInDate}
                onChange={(e) => setCheckInDate(e.target.value)}
                className="pl-12 pr-4 py-4 w-full border-2 border-gray-200 rounded-xl text-base bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none hover:border-gray-300 transition-colors"
                required
              />
            </div>
          </div>

          {/* Return Date */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-semibold text-gray-900 mb-3">Return</label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
              <input
                type="date"
                value={checkOutDate}
                onChange={(e) => setCheckOutDate(e.target.value)}
                disabled={tripType === 'one-way'}
                className={`pl-12 pr-4 py-4 w-full border-2 border-gray-200 rounded-xl text-base bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none hover:border-gray-300 transition-colors ${
                  tripType === 'one-way' ? 'opacity-50 cursor-not-allowed bg-gray-50' : ''
                }`}
                required={tripType === 'round-trip'}
              />
            </div>
          </div>

          {/* Search Button */}
          <div className="lg:col-span-1">
            <button 
              type="submit"
              className="w-full py-4 bg-blue-600 text-white font-semibold rounded-xl text-base hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Search flights
            </button>
          </div>
        </div>

        {/* Second Row - Passenger and Class Selection */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Passengers */}
          <div className="lg:col-span-3">
            <label className="block text-sm font-semibold text-gray-900 mb-3">Passengers</label>
            <div className="relative">
              <Users className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
              <select
                value={passengers}
                onChange={(e) => setPassengers(Number(e.target.value))}
                className="pl-12 pr-8 py-4 w-full border-2 border-gray-200 rounded-xl text-base bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none hover:border-gray-300 transition-colors appearance-none cursor-pointer"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                  <option key={num} value={num}>{num} {num === 1 ? 'Passenger' : 'Passengers'}</option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Cabin Class */}
          <div className="lg:col-span-3">
            <label className="block text-sm font-semibold text-gray-900 mb-3">Class</label>
            <div className="relative">
              <select
                value={cabinClass}
                onChange={(e) => setCabinClass(e.target.value)}
                className="pl-4 pr-8 py-4 w-full border-2 border-gray-200 rounded-xl text-base bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none hover:border-gray-300 transition-colors appearance-none cursor-pointer"
              >
                <option value="Economy">Economy</option>
                <option value="Premium Economy">Premium Economy</option>
                <option value="Business">Business</option>
                <option value="First">First Class</option>
              </select>
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </form>
      
      {/* Expedia Branding */}
      <div className="text-center text-xs text-gray-500 mt-6 pt-4 border-t border-gray-100">
        Powered by <span className="font-semibold text-blue-600">Expedia</span> — Official Partner
      </div>
    </div>
  );



  return (
    <div className="w-full">
      {renderFlightForm()}
      
      {/* CJ Affiliate Pixel */}
      <img src="https://www.lduhtrp.net/image-101486313-15754452" width="1" height="1" style={{border: 0}} alt="" />
    </div>
  );
}