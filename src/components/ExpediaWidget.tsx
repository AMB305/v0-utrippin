import { useState, useEffect } from 'react';
import { Plane, MapPin, Calendar, Users, ArrowLeftRight, Globe } from 'lucide-react';
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
    <div className="glass-card rounded-2xl p-6 max-w-5xl mx-auto backdrop-blur-md">
      {/* Search Form - Horizontal Layout */}
      <form onSubmit={handleFlightSubmit} className="flex flex-wrap items-center gap-4">
        {/* From Field */}
        <div className="relative flex-1 min-w-[200px]">
          <div className="relative">
            <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 h-4 w-4" />
            {isMobile ? (
              <InlineAirportDropdown
                placeholder="USA"
                value={fromAirport}
                onChange={setFromAirport}
                inputClassName="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:ring-2 focus:ring-white/30 focus:border-white/40 backdrop-blur-sm"
              />
            ) : (
              <SimpleAirportAutocomplete
                placeholder="USA"
                value={fromAirport}
                onChange={setFromAirport}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:ring-2 focus:ring-white/30 focus:border-white/40 backdrop-blur-sm"
              />
            )}
          </div>
        </div>

        {/* To Field */}
        <div className="relative flex-1 min-w-[200px]">
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 h-4 w-4" />
            {isMobile ? (
              <InlineAirportDropdown
                placeholder="Los Angeles"
                value={toAirport}
                onChange={setToAirport}
                inputClassName="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:ring-2 focus:ring-white/30 focus:border-white/40 backdrop-blur-sm"
              />
            ) : (
              <SimpleAirportAutocomplete
                placeholder="Los Angeles"
                value={toAirport}
                onChange={setToAirport}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:ring-2 focus:ring-white/30 focus:border-white/40 backdrop-blur-sm"
              />
            )}
          </div>
        </div>

        {/* Date Range */}
        <div className="relative min-w-[180px]">
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 h-4 w-4" />
            <input
              type="date"
              value={checkInDate}
              onChange={(e) => setCheckInDate(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:ring-2 focus:ring-white/30 focus:border-white/40 backdrop-blur-sm [color-scheme:dark]"
              required
            />
          </div>
        </div>

        <div className="text-white/60 text-sm">-</div>

        <div className="relative min-w-[180px]">
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 h-4 w-4" />
            <input
              type="date"
              value={checkOutDate}
              onChange={(e) => setCheckOutDate(e.target.value)}
              disabled={tripType === 'one-way'}
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:ring-2 focus:ring-white/30 focus:border-white/40 backdrop-blur-sm disabled:bg-white/5 disabled:text-white/40 [color-scheme:dark]"
              required={tripType === 'round-trip'}
            />
          </div>
        </div>

        {/* Passengers */}
        <div className="relative min-w-[150px]">
          <div className="relative">
            <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 h-4 w-4" />
            <select
              value={passengers}
              onChange={(e) => setPassengers(Number(e.target.value))}
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-white/30 focus:border-white/40 backdrop-blur-sm appearance-none cursor-pointer"
            >
              {[1, 2, 3, 4, 5, 6].map(num => (
                <option key={num} value={num} className="bg-gray-800 text-white">
                  {num < 10 ? '0' : ''}{num} Adult{num !== 1 ? 's' : ''}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Search Button */}
        <button
          type="submit"
          className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-8 rounded-lg transition-colors min-w-[120px] text-sm uppercase tracking-wider"
        >
          SEARCH
        </button>
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