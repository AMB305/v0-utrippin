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
  const [passengers, setPassengers] = useState(1);
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
      expediaUrl = `https://www.expedia.com/Flights-Search?trip=roundtrip&leg1=from:${encodeURIComponent(fromAirport.iata_code)},to:${encodeURIComponent(toAirport.iata_code)},departure:${formatDate(checkInDate)}&leg2=from:${encodeURIComponent(toAirport.iata_code)},to:${encodeURIComponent(fromAirport.iata_code)},departure:${formatDate(checkOutDate)}&passengers=adults:${passengers}&mode=search&affiliate=utrippin`;
    } else {
      expediaUrl = `https://www.expedia.com/Flights-Search?trip=oneway&leg1=from:${encodeURIComponent(fromAirport.iata_code)},to:${encodeURIComponent(toAirport.iata_code)},departure:${formatDate(checkInDate)}&passengers=adults:${passengers}&mode=search&affiliate=utrippin`;
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
        <h2 className="text-white text-lg tracking-wide uppercase mb-2">Atmosphere of Los Angeles Country</h2>
        <h1 className="text-white text-4xl md:text-6xl font-bold mb-8">
          Discover <br /> 
          <span className="text-teal-400">Adventure & Action in Travel</span>
        </h1>

        {/* Flight Widget */}
        <div className="bg-white/90 backdrop-blur-lg rounded-full px-6 py-4 w-full max-w-6xl">
          <form onSubmit={handleFlightSubmit}>
            <div className="flex flex-wrap justify-center items-center gap-4">
              {/* Trip Type Toggle */}
              <div className="flex gap-4 mr-4">
                {[
                  { value: 'one-way', label: 'One way' },
                  { value: 'round-trip', label: 'Round trip' }
                ].map((type) => (
                  <label key={type.value} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="tripType"
                      value={type.value}
                      checked={tripType === type.value}
                      onChange={(e) => setTripType(e.target.value)}
                      className="w-3 h-3 text-teal-500 focus:ring-teal-400"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      {type.label}
                    </span>
                  </label>
                ))}
              </div>

              {/* Origin */}
              <div className="relative min-w-[140px]">
                <Plane className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
                {isMobile ? (
                  <InlineAirportDropdown
                    placeholder="From"
                    value={fromAirport}
                    onChange={setFromAirport}
                    inputClassName="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-full text-sm bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none"
                  />
                ) : (
                  <SimpleAirportAutocomplete
                    placeholder="From"
                    value={fromAirport}
                    onChange={setFromAirport}
                    className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-full text-sm bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none"
                  />
                )}
              </div>

              {/* Destination */}
              <div className="relative min-w-[140px]">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
                {isMobile ? (
                  <InlineAirportDropdown
                    placeholder="To"
                    value={toAirport}
                    onChange={setToAirport}
                    inputClassName="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-full text-sm bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none"
                  />
                ) : (
                  <SimpleAirportAutocomplete
                    placeholder="To"
                    value={toAirport}
                    onChange={setToAirport}
                    className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-full text-sm bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none"
                  />
                )}
              </div>

              {/* Departure Date */}
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
                <input
                  type="date"
                  value={checkInDate}
                  onChange={(e) => setCheckInDate(e.target.value)}
                  className="pl-10 pr-3 py-3 border border-gray-300 rounded-full text-sm bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none"
                  required
                />
              </div>

              {/* Return Date */}
              {tripType === 'round-trip' && (
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
                  <input
                    type="date"
                    value={checkOutDate}
                    onChange={(e) => setCheckOutDate(e.target.value)}
                    className="pl-10 pr-3 py-3 border border-gray-300 rounded-full text-sm bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none"
                    required
                  />
                </div>
              )}

              {/* Adults */}
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
                <select
                  value={passengers}
                  onChange={(e) => setPassengers(Number(e.target.value))}
                  className="pl-10 pr-8 py-3 border border-gray-300 rounded-full text-sm bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none appearance-none cursor-pointer"
                >
                  {[1, 2, 3, 4, 5, 6].map(num => (
                    <option key={num} value={num}>{num} Adult{num !== 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>

              {/* Search Button */}
              <button 
                type="submit"
                className="bg-teal-500 hover:bg-teal-600 text-white font-bold px-8 py-3 rounded-full transition-colors duration-200"
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