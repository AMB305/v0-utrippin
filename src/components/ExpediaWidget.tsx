import { useState, useEffect } from 'react';
import { Plane, MapPin, Calendar } from 'lucide-react';
import SimpleAirportAutocomplete from './SimpleAirportAutocomplete';
import InlineAirportDropdown from './InlineAirportDropdown';
import { DuffelAirport } from '@/lib/duffel';
import { useMediaQuery } from '@/hooks/useMediaQuery';
// Import custom icons
import hotelIcon from '@/assets/hotel-icon.png';
import flightIcon from '@/assets/flight-icon.png';
import carIcon from '@/assets/car-icon.png';
import packageIcon from '@/assets/package-icon.png';

export default function ExpediaWidget() {
  const [activeTab, setActiveTab] = useState("Flights");
  const [fromAirport, setFromAirport] = useState<DuffelAirport | null>(null);
  const [toAirport, setToAirport] = useState<DuffelAirport | null>(null);
  const [destination, setDestination] = useState("");
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
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
    checkout.setDate(today.getDate() + 3);
    
    setCheckInDate(today.toISOString().split('T')[0]);
    setCheckOutDate(checkout.toISOString().split('T')[0]);
  }, [activeTab]);

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
      {/* From Field */}
      <div className="relative">
        <Plane className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
        {isMobile ? (
          <InlineAirportDropdown
            placeholder="Departure city or airport"
            value={fromAirport}
            onChange={setFromAirport}
            inputClassName="pl-12 pr-4 py-5 w-full border border-gray-200 rounded-xl text-base bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none focus:bg-white"
          />
        ) : (
          <SimpleAirportAutocomplete
            placeholder="Departure city or airport"
            value={fromAirport}
            onChange={setFromAirport}
            className="pl-12 pr-4 py-5 w-full border border-gray-200 rounded-xl text-base bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none focus:bg-white"
          />
        )}
      </div>

      {/* To Field */}
      <div className="relative">
        <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
        {isMobile ? (
          <InlineAirportDropdown
            placeholder="Destination city or airport"
            value={toAirport}
            onChange={setToAirport}
            inputClassName="pl-12 pr-4 py-5 w-full border border-gray-200 rounded-xl text-base bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none focus:bg-white"
          />
        ) : (
          <SimpleAirportAutocomplete
            placeholder="Destination city or airport"
            value={toAirport}
            onChange={setToAirport}
            className="pl-12 pr-4 py-5 w-full border border-gray-200 rounded-xl text-base bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none focus:bg-white"
          />
        )}
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