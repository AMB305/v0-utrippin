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
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 mb-8">
      {/* Trip Type Radio Buttons */}
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
              className="w-4 h-4 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-base font-medium text-gray-700">
              {type.label}
            </span>
          </label>
        ))}
      </div>

      <form onSubmit={handleFlightSubmit}>
        {/* Flight Search Fields */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-6">
          {/* From */}
          <div className="lg:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
            <div className="relative">
              <Plane className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
              {isMobile ? (
                <InlineAirportDropdown
                  placeholder="Departure"
                  value={fromAirport}
                  onChange={setFromAirport}
                  inputClassName="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                />
              ) : (
                <SimpleAirportAutocomplete
                  placeholder="Departure"
                  value={fromAirport}
                  onChange={setFromAirport}
                  className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                />
              )}
            </div>
          </div>

          {/* To */}
          <div className="lg:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
              {isMobile ? (
                <InlineAirportDropdown
                  placeholder="Destination"
                  value={toAirport}
                  onChange={setToAirport}
                  inputClassName="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                />
              ) : (
                <SimpleAirportAutocomplete
                  placeholder="Destination"
                  value={toAirport}
                  onChange={setToAirport}
                  className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                />
              )}
            </div>
          </div>

          {/* Departure Date */}
          <div className="lg:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Departure</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
              <input
                type="date"
                value={checkInDate}
                onChange={(e) => setCheckInDate(e.target.value)}
                className="pl-10 pr-3 py-3 w-full border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Return Date */}
          <div className="lg:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Return</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
              <input
                type="date"
                value={checkOutDate}
                onChange={(e) => setCheckOutDate(e.target.value)}
                disabled={tripType === 'one-way'}
                className={`pl-10 pr-3 py-3 w-full border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none ${
                  tripType === 'one-way' ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
                }`}
                required={tripType === 'round-trip'}
              />
            </div>
          </div>

          {/* Search Button */}
          <div className="lg:col-span-1">
            <label className="block text-sm font-medium text-transparent mb-2">Search</label>
            <button 
              type="submit"
              className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg text-sm hover:bg-blue-700 transition-colors duration-200"
            >
              Search flights
            </button>
          </div>
        </div>

        {/* Second Row - Passengers and Class */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {/* Passengers */}
          <div className="lg:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Passengers</label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
              <select
                value={passengers}
                onChange={(e) => setPassengers(Number(e.target.value))}
                className="pl-10 pr-8 py-3 w-full border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none appearance-none cursor-pointer"
              >
                {[1, 2, 3, 4, 5, 6].map(num => (
                  <option key={num} value={num}>{num} {num === 1 ? 'Passenger' : 'Passengers'}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Class */}
          <div className="lg:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Class</label>
            <select
              value={cabinClass}
              onChange={(e) => setCabinClass(e.target.value)}
              className="px-3 py-3 w-full border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none appearance-none cursor-pointer"
            >
              <option value="Economy">Economy</option>
              <option value="Premium Economy">Premium Economy</option>
              <option value="Business">Business</option>
              <option value="First">First Class</option>
            </select>
          </div>

          {/* Empty columns for spacing */}
          <div className="lg:col-span-3"></div>
        </div>
      </form>
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