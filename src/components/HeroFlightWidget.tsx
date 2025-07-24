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
        <div className="bg-white/95 backdrop-blur-lg rounded-3xl px-8 py-6 w-full max-w-7xl shadow-2xl">
          <form onSubmit={handleFlightSubmit}>
            {/* Trip Type Toggle */}
            <div className="flex gap-6 mb-6">
              {[
                { value: 'one-way', label: 'One way' },
                { value: 'round-trip', label: 'Round trip' }
              ].map((type) => (
                <label key={type.value} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="tripType"
                    value={type.value}
                    checked={tripType === type.value}
                    onChange={(e) => setTripType(e.target.value)}
                    className="w-4 h-4 text-teal-500 focus:ring-teal-400"
                  />
                  <span className="text-base font-medium text-gray-700">
                    {type.label}
                  </span>
                </label>
              ))}
            </div>

            {/* Single Row Layout */}
            <div className="flex flex-col lg:flex-row gap-4 items-end">
              {/* From Field */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-600 mb-2">From</label>
                <div className="relative">
                  <Plane className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
                  <MapPin className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
                  {isMobile ? (
                    <InlineAirportDropdown
                      placeholder="Departure"
                      value={fromAirport}
                      onChange={setFromAirport}
                      inputClassName="pl-12 pr-12 py-4 w-full border border-gray-300 rounded-xl text-base bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none"
                    />
                  ) : (
                    <SimpleAirportAutocomplete
                      placeholder="Departure"
                      value={fromAirport}
                      onChange={setFromAirport}
                      className="pl-12 pr-12 py-4 w-full border border-gray-300 rounded-xl text-base bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none"
                    />
                  )}
                </div>
              </div>

              {/* To Field */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-600 mb-2">To</label>
                <div className="relative">
                  <Plane className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
                  <MapPin className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
                  {isMobile ? (
                    <InlineAirportDropdown
                      placeholder="Destination"
                      value={toAirport}
                      onChange={setToAirport}
                      inputClassName="pl-12 pr-12 py-4 w-full border border-gray-300 rounded-xl text-base bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none"
                    />
                  ) : (
                    <SimpleAirportAutocomplete
                      placeholder="Destination"
                      value={toAirport}
                      onChange={setToAirport}
                      className="pl-12 pr-12 py-4 w-full border border-gray-300 rounded-xl text-base bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none"
                    />
                  )}
                </div>
              </div>

              {/* Departure Date */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-600 mb-2">Departure</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
                  <input
                    type="date"
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    className="pl-12 pr-4 py-4 w-full border border-gray-300 rounded-xl text-base bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              {/* Return Date */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-600 mb-2">Return</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
                  <input
                    type="date"
                    value={checkOutDate}
                    onChange={(e) => setCheckOutDate(e.target.value)}
                    disabled={tripType === 'one-way'}
                    className={`pl-12 pr-4 py-4 w-full border border-gray-300 rounded-xl text-base focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none ${
                      tripType === 'one-way' ? 'bg-gray-100 cursor-not-allowed text-gray-400' : 'bg-white'
                    }`}
                    placeholder={tripType === 'one-way' ? 'One way' : ''}
                    required={tripType === 'round-trip'}
                  />
                </div>
              </div>

              {/* Passengers */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-600 mb-2">Passengers</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
                    <select
                      value={adults}
                      onChange={(e) => setAdults(Number(e.target.value))}
                      className="pl-10 pr-3 py-4 w-full border border-gray-300 rounded-xl text-sm bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none appearance-none cursor-pointer"
                    >
                      {[1, 2, 3, 4, 5, 6].map(num => (
                        <option key={num} value={num}>{num} Ad</option>
                      ))}
                    </select>
                  </div>
                  <div className="relative flex-1">
                    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
                    <select
                      value={children}
                      onChange={(e) => setChildren(Number(e.target.value))}
                      className="pl-10 pr-3 py-4 w-full border border-gray-300 rounded-xl text-sm bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none appearance-none cursor-pointer"
                    >
                      {[0, 1, 2, 3, 4].map(num => (
                        <option key={num} value={num}>{num} Ch</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Search Button Row */}
            <div className="mt-6">
              <button 
                type="submit"
                className="bg-teal-500 hover:bg-teal-600 text-white font-bold px-12 py-4 rounded-xl text-lg transition-colors duration-200 shadow-lg"
              >
                Search
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