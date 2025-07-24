import { useState, useEffect, useRef } from 'react';
import { MapPin, Calendar, Users, ChevronDown, Package } from 'lucide-react';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import heroImage from '@/assets/hero-packages.jpg';

export default function HeroPackageWidget() {
  const [destination, setDestination] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [packageType, setPackageType] = useState("Flight + Hotel");
  const [showTravelersDropdown, setShowTravelersDropdown] = useState(false);
  const [showPackageDropdown, setShowPackageDropdown] = useState(false);
  const travelersRef = useRef<HTMLDivElement>(null);
  const packageRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery('(max-width: 768px)');

  useEffect(() => {
    // Auto-fill default dates
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 14); // 2 weeks for vacation packages
    
    setDepartureDate(today.toISOString().split('T')[0]);
    setReturnDate(nextWeek.toISOString().split('T')[0]);

    // Close dropdowns when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (travelersRef.current && !travelersRef.current.contains(event.target as Node)) {
        setShowTravelersDropdown(false);
      }
      if (packageRef.current && !packageRef.current.contains(event.target as Node)) {
        setShowPackageDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handlePackageSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!destination) {
      alert('Please enter a destination');
      return;
    }

    // GA4 tracking
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'click', {
        event_category: 'Package Search',
        event_label: 'HeroPackageWidget',
        value: 1
      });
    }

    // Build package search URL
    const packageUrl = `https://www.expedia.com/Packages-Search?destination=${encodeURIComponent(destination)}&startDate=${departureDate}&endDate=${returnDate}&adults=${adults}&children=${children}&packageType=${encodeURIComponent(packageType)}`;
    const finalUrl = `https://www.dpbolvw.net/click-101486313-15754452?url=${encodeURIComponent(packageUrl)}`;
    window.open(finalUrl, '_blank');
  };

  const packageTypes = [
    "Flight + Hotel",
    "Flight + Hotel + Car",
    "Hotel + Car",
    "All Inclusive"
  ];

  return (
    <div className="relative h-screen w-full bg-black">
      {/* Background Image */}
      <img
        src={heroImage}
        alt="Tropical vacation package"
        className="absolute inset-0 h-full w-full object-cover"
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col justify-center items-center text-center h-full px-6">
        <h1 className="text-white text-4xl md:text-6xl font-bold mb-8">
          Book Your Escape
        </h1>

        {/* Package Type Selection */}
        <div className="flex justify-start w-full max-w-6xl mb-0">
          <div className="relative" ref={packageRef}>
            <div 
              className="flex items-center gap-2 px-6 py-3 bg-white rounded-t-xl shadow-lg cursor-pointer hover:bg-gray-50"
              onClick={() => setShowPackageDropdown(!showPackageDropdown)}
            >
              <Package className="w-4 h-4 text-teal-500" />
              <span className="text-sm font-medium text-gray-700">{packageType}</span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </div>
            
            {/* Package Type Dropdown */}
            {showPackageDropdown && (
              <div className="absolute top-full left-0 bg-white border border-gray-200 rounded-lg shadow-xl z-[9999] mt-2 p-2 w-[200px]">
                {packageTypes.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => {
                      setPackageType(type);
                      setShowPackageDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-50 ${
                      packageType === type ? 'bg-teal-50 text-teal-700 font-medium' : 'text-gray-700'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Package Widget */}
        <div className="bg-white rounded-b-full rounded-tr-full shadow-2xl w-full max-w-6xl relative">
          <form onSubmit={handlePackageSubmit}>
            <div className="flex items-center">
              {/* Destination */}
              <div className="flex items-center px-6 py-4 border-r border-gray-200">
                <MapPin className="text-teal-500 w-5 h-5 mr-3 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Where do you want to go?"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="border-0 bg-transparent text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-0 text-base font-medium w-full min-w-[200px]"
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

              {/* Return Date */}
              <div className="flex items-center px-6 py-4 border-r border-gray-200">
                <Calendar className="text-teal-500 w-5 h-5 mr-3 flex-shrink-0" />
                <input
                  type="date"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
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
                    {adults + children} Traveler{adults + children !== 1 ? 's' : ''}
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