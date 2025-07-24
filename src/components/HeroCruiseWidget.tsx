import { useState, useEffect, useRef } from 'react';
import { MapPin, Calendar, Users, ChevronDown, Anchor, Ship } from 'lucide-react';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import heroImage from '@/assets/hero-cruises.jpg';

export default function HeroCruiseWidget() {
  const [departurePort, setDeparturePort] = useState("");
  const [destination, setDestination] = useState("Caribbean");
  const [departureDate, setDepartureDate] = useState("");
  const [duration, setDuration] = useState("7 nights");
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [cabinType, setCabinType] = useState("Interior");
  const [showTravelersDropdown, setShowTravelersDropdown] = useState(false);
  const [showDestinationDropdown, setShowDestinationDropdown] = useState(false);
  const [showDurationDropdown, setShowDurationDropdown] = useState(false);
  const [showCabinDropdown, setShowCabinDropdown] = useState(false);
  const travelersRef = useRef<HTMLDivElement>(null);
  const destinationRef = useRef<HTMLDivElement>(null);
  const durationRef = useRef<HTMLDivElement>(null);
  const cabinRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery('(max-width: 768px)');

  useEffect(() => {
    // Auto-fill default dates
    const today = new Date();
    const nextMonth = new Date(today);
    nextMonth.setMonth(today.getMonth() + 2); // 2 months out for cruise planning
    
    setDepartureDate(nextMonth.toISOString().split('T')[0]);

    // Close dropdowns when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (travelersRef.current && !travelersRef.current.contains(event.target as Node)) {
        setShowTravelersDropdown(false);
      }
      if (destinationRef.current && !destinationRef.current.contains(event.target as Node)) {
        setShowDestinationDropdown(false);
      }
      if (durationRef.current && !durationRef.current.contains(event.target as Node)) {
        setShowDurationDropdown(false);
      }
      if (cabinRef.current && !cabinRef.current.contains(event.target as Node)) {
        setShowCabinDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCruiseSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!departurePort) {
      alert('Please enter a departure port');
      return;
    }

    // GA4 tracking
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'click', {
        event_category: 'Cruise Search',
        event_label: 'HeroCruiseWidget',
        value: 1
      });
    }

    // Build cruise search URL
    const cruiseUrl = `https://www.expedia.com/Cruises-Search?port=${encodeURIComponent(departurePort)}&destination=${encodeURIComponent(destination)}&date=${departureDate}&duration=${encodeURIComponent(duration)}&adults=${adults}&children=${children}&cabin=${encodeURIComponent(cabinType)}`;
    const finalUrl = `https://www.dpbolvw.net/click-101486313-15754452?url=${encodeURIComponent(cruiseUrl)}`;
    window.open(finalUrl, '_blank');
  };

  const destinations = [
    "Caribbean",
    "Mediterranean", 
    "Alaska",
    "Northern Europe",
    "Asia",
    "South America"
  ];

  const durations = [
    "3-5 nights",
    "6-8 nights", 
    "9-13 nights",
    "14+ nights"
  ];

  const cabinTypes = [
    "Interior",
    "Ocean View",
    "Balcony",
    "Suite"
  ];

  return (
    <div className="relative h-screen w-full bg-black">
      {/* Background Image */}
      <img
        src={heroImage}
        alt="Luxury cruise ship"
        className="absolute inset-0 h-full w-full object-cover"
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col justify-center items-center text-center h-full px-6">
        <h1 className="text-white text-4xl md:text-6xl font-bold mb-8">
          Set Sail in Style
        </h1>

        {/* Cruise Options Selection */}
        <div className="flex justify-start w-full max-w-6xl mb-0 space-x-4">
          {/* Destination */}
          <div className="relative" ref={destinationRef}>
            <div 
              className="flex items-center gap-2 px-6 py-3 bg-white rounded-t-xl shadow-lg cursor-pointer hover:bg-gray-50"
              onClick={() => setShowDestinationDropdown(!showDestinationDropdown)}
            >
              <Anchor className="w-4 h-4 text-teal-500" />
              <span className="text-sm font-medium text-gray-700">{destination}</span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </div>
            
            {showDestinationDropdown && (
              <div className="absolute top-full left-0 bg-white border border-gray-200 rounded-lg shadow-xl z-[9999] mt-2 p-2 w-[160px]">
                {destinations.map((dest) => (
                  <button
                    key={dest}
                    type="button"
                    onClick={() => {
                      setDestination(dest);
                      setShowDestinationDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-50 ${
                      destination === dest ? 'bg-teal-50 text-teal-700 font-medium' : 'text-gray-700'
                    }`}
                  >
                    {dest}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Duration */}
          <div className="relative" ref={durationRef}>
            <div 
              className="flex items-center gap-2 px-6 py-3 bg-white rounded-t-xl shadow-lg cursor-pointer hover:bg-gray-50"
              onClick={() => setShowDurationDropdown(!showDurationDropdown)}
            >
              <Calendar className="w-4 h-4 text-teal-500" />
              <span className="text-sm font-medium text-gray-700">{duration}</span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </div>
            
            {showDurationDropdown && (
              <div className="absolute top-full left-0 bg-white border border-gray-200 rounded-lg shadow-xl z-[9999] mt-2 p-2 w-[140px]">
                {durations.map((dur) => (
                  <button
                    key={dur}
                    type="button"
                    onClick={() => {
                      setDuration(dur);
                      setShowDurationDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-50 ${
                      duration === dur ? 'bg-teal-50 text-teal-700 font-medium' : 'text-gray-700'
                    }`}
                  >
                    {dur}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Cabin Type */}
          <div className="relative" ref={cabinRef}>
            <div 
              className="flex items-center gap-2 px-6 py-3 bg-white rounded-t-xl shadow-lg cursor-pointer hover:bg-gray-50"
              onClick={() => setShowCabinDropdown(!showCabinDropdown)}
            >
              <Ship className="w-4 h-4 text-teal-500" />
              <span className="text-sm font-medium text-gray-700">{cabinType}</span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </div>
            
            {showCabinDropdown && (
              <div className="absolute top-full left-0 bg-white border border-gray-200 rounded-lg shadow-xl z-[9999] mt-2 p-2 w-[140px]">
                {cabinTypes.map((cabin) => (
                  <button
                    key={cabin}
                    type="button"
                    onClick={() => {
                      setCabinType(cabin);
                      setShowCabinDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-50 ${
                      cabinType === cabin ? 'bg-teal-50 text-teal-700 font-medium' : 'text-gray-700'
                    }`}
                  >
                    {cabin}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Cruise Widget */}
        <div className="bg-white rounded-b-full rounded-tr-full shadow-2xl w-full max-w-6xl relative">
          <form onSubmit={handleCruiseSubmit}>
            <div className="flex items-center">
              {/* Departure Port */}
              <div className="flex items-center px-6 py-4 border-r border-gray-200">
                <MapPin className="text-teal-500 w-5 h-5 mr-3 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Departure port"
                  value={departurePort}
                  onChange={(e) => setDeparturePort(e.target.value)}
                  className="border-0 bg-transparent text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-0 text-base font-medium w-full min-w-[150px]"
                  required
                />
              </div>

              {/* Departure Date */}
              <div className="flex items-center px-6 py-4 border-r border-gray-200">
                <Calendar className="text-teal-500 w-5 h-5 mr-3 flex-shrink-0" />
                <input
                  type="date"
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                  className="border-0 bg-transparent text-gray-700 focus:outline-none focus:ring-0 text-base font-medium"
                  required
                />
              </div>

              {/* Travelers */}
              <div className="flex items-center px-6 py-4 border-r border-gray-200 relative" ref={travelersRef}>
                <Users className="text-teal-500 w-5 h-5 mr-3 flex-shrink-0" />
                <div 
                  className="flex items-center cursor-pointer text-gray-700 font-medium"
                  onClick={() => setShowTravelersDropdown(!showTravelersDropdown)}
                >
                  <span>
                    {adults + children} Guest{adults + children !== 1 ? 's' : ''}
                  </span>
                  <ChevronDown className="w-4 h-4 ml-2 text-gray-400" />
                </div>
                
                {/* Travelers Dropdown */}
                {showTravelersDropdown && (
                  <div className="absolute top-full left-0 bg-white border border-gray-200 rounded-lg shadow-xl z-[9999] mt-2 p-4 w-[240px]">
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
                            onClick={() => setAdults(Math.min(8, adults + 1))}
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
                            onClick={() => setChildren(Math.min(6, children + 1))}
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