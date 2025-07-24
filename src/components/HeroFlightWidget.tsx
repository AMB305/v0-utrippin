import { useState, useEffect } from 'react';
import { Plane, MapPin, Calendar, Users } from 'lucide-react';
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

        {/* Flight Widget */}
        <div className="bg-white rounded-full shadow-2xl w-full max-w-6xl overflow-hidden">
          <form onSubmit={handleFlightSubmit}>
            <div className="flex items-center">
              {/* Trip Type Toggle - Hidden for cleaner look, defaulting to round-trip */}
              
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
                  <span className="text-gray-400">-</span>
                  <input
                    type="date"
                    value={checkOutDate}
                    onChange={(e) => setCheckOutDate(e.target.value)}
                    className="border-0 bg-transparent text-gray-700 focus:outline-none focus:ring-0 text-base font-medium"
                    required
                  />
                </div>
              </div>

              {/* Passengers */}
              <div className="flex items-center px-6 py-4 border-r border-gray-200">
                <Users className="text-teal-500 w-5 h-5 mr-3 flex-shrink-0" />
                <div className="text-gray-700 font-medium">
                  {adults + children === 1 ? `0${adults + children} Adult` : `0${adults + children} Adults`}
                  {/* Hidden selects for functionality */}
                  <select
                    value={adults}
                    onChange={(e) => setAdults(Number(e.target.value))}
                    className="sr-only"
                  >
                    {[1, 2, 3, 4, 5, 6].map(num => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                  <select
                    value={children}
                    onChange={(e) => setChildren(Number(e.target.value))}
                    className="sr-only"
                  >
                    {[0, 1, 2, 3, 4].map(num => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                </div>
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