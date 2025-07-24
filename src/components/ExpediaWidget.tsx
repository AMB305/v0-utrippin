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

    const expediaUrl = `https://www.expedia.com/Flights-Search?trip=roundtrip&leg1=from:${encodeURIComponent(fromAirport.iata_code)},to:${encodeURIComponent(toAirport.iata_code)},departure:${formatDate(checkInDate)}&leg2=from:${encodeURIComponent(toAirport.iata_code)},to:${encodeURIComponent(fromAirport.iata_code)},departure:${formatDate(checkOutDate)}&passengers=adults:1&mode=search&affiliate=utrippin`;
    
    const finalUrl = `https://www.dpbolvw.net/click-101486313-15754452?url=${encodeURIComponent(expediaUrl)}`;
    window.open(finalUrl, '_blank');
  };


  const swapAirports = () => {
    setFromAirport(toAirport);
    setToAirport(fromAirport);
  };

  const renderFlightForm = () => (
    <div className="bg-white rounded-2xl shadow-xl p-6 max-w-6xl mx-auto">
      {/* Trip Type Selection */}
      <div className="flex gap-6 mb-6">
        {['round-trip', 'one-way', 'multi-destination'].map((type) => (
          <label key={type} className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="tripType"
              value={type}
              checked={tripType === type}
              onChange={(e) => setTripType(e.target.value)}
              className="w-4 h-4 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700 capitalize">
              {type.replace('-', ' ')}
            </span>
          </label>
        ))}
      </div>

      <form onSubmit={handleFlightSubmit}>
        {/* Main Search Row */}
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 items-end mb-6">
          {/* From Airport */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
            <div className="relative">
              <Plane className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
              {isMobile ? (
                <InlineAirportDropdown
                  placeholder="Departure airport"
                  value={fromAirport}
                  onChange={setFromAirport}
                  inputClassName="pl-10 pr-4 py-4 w-full border border-gray-300 rounded-lg text-base bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                />
              ) : (
                <SimpleAirportAutocomplete
                  placeholder="Departure airport"
                  value={fromAirport}
                  onChange={setFromAirport}
                  className="pl-10 pr-4 py-4 w-full border border-gray-300 rounded-lg text-base bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                />
              )}
            </div>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center lg:col-span-1">
            <button
              type="button"
              onClick={swapAirports}
              className="p-2 rounded-full border border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <ArrowLeftRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* To Airport */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
              {isMobile ? (
                <InlineAirportDropdown
                  placeholder="Destination airport"
                  value={toAirport}
                  onChange={setToAirport}
                  inputClassName="pl-10 pr-4 py-4 w-full border border-gray-300 rounded-lg text-base bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                />
              ) : (
                <SimpleAirportAutocomplete
                  placeholder="Destination airport"
                  value={toAirport}
                  onChange={setToAirport}
                  className="pl-10 pr-4 py-4 w-full border border-gray-300 rounded-lg text-base bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                />
              )}
            </div>
          </div>

          {/* Search Button */}
          <div className="lg:col-span-1">
            <button 
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg text-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg"
            >
              Find Your Flight
            </button>
          </div>
        </div>

        {/* Date and Passenger Row */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
          {/* Departure Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Departure</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
              <input
                type="date"
                value={checkInDate}
                onChange={(e) => setCheckInDate(e.target.value)}
                className="pl-10 pr-3 py-4 w-full border border-gray-300 rounded-lg text-base bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Return Date */}
          {tripType === 'round-trip' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Return</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
                <input
                  type="date"
                  value={checkOutDate}
                  onChange={(e) => setCheckOutDate(e.target.value)}
                  className="pl-10 pr-3 py-4 w-full border border-gray-300 rounded-lg text-base bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>
            </div>
          )}

          {/* Passengers */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Passengers</label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
              <select
                value={passengers}
                onChange={(e) => setPassengers(Number(e.target.value))}
                className="pl-10 pr-3 py-4 w-full border border-gray-300 rounded-lg text-base bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none appearance-none"
              >
                {[1, 2, 3, 4, 5, 6].map(num => (
                  <option key={num} value={num}>{num} {num === 1 ? 'Adult' : 'Adults'}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Cabin Class */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Cabin</label>
            <select
              value={cabinClass}
              onChange={(e) => setCabinClass(e.target.value)}
              className="px-3 py-4 w-full border border-gray-300 rounded-lg text-base bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none appearance-none"
            >
              <option value="Economy">Economy</option>
              <option value="Premium Economy">Premium Economy</option>
              <option value="Business">Business</option>
              <option value="First">First</option>
            </select>
          </div>
        </div>

        {/* Bundle Options */}
        <div className="border-t border-gray-200 pt-4">
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 text-green-600 focus:ring-green-500 rounded" />
              <span className="text-sm text-green-600 font-medium">+ Add hotel</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 text-green-600 focus:ring-green-500 rounded" />
              <span className="text-sm text-green-600 font-medium">+ Add car</span>
            </label>
          </div>
        </div>
      </form>
      
      {/* Expedia Branding */}
      <div className="text-center text-xs text-gray-500 mt-4 pt-3 border-t border-gray-100">
        Powered by <span className="font-semibold">Expedia</span> — Official Utrippin Affiliate Partner
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