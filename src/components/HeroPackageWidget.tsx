import { useState, useEffect, useRef } from 'react';
import { MapPin, Calendar, Users, ChevronDown, Plane, Building2, Car } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import heroImage from '@/assets/hero-packages.jpg';

export default function HeroPackageWidget() {
  // Component toggle state
  const [isFlight, setIsFlight] = useState(true);
  const [isStay, setIsStay] = useState(false);
  const [isCar, setIsCar] = useState(false);

  // Flight inputs
  const [leavingFrom, setLeavingFrom] = useState("");
  const [goingTo, setGoingTo] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [returnDate, setReturnDate] = useState("");

  // Car inputs
  const [pickupLocation, setPickupLocation] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [dropoffDate, setDropoffDate] = useState("");

  // Universal inputs
  const [adults, setAdults] = useState(2);
  const [rooms, setRooms] = useState(1);
  const [showTravelerDropdown, setShowTravelerDropdown] = useState(false);
  
  const travelerDropdownRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery('(max-width: 768px)');

  useEffect(() => {
    // Auto-fill default dates
    const today = new Date();
    const nextMonth = new Date(today);
    nextMonth.setMonth(today.getMonth() + 1);
    const returnDefault = new Date(nextMonth);
    returnDefault.setDate(nextMonth.getDate() + 7);
    
    setDepartureDate(nextMonth.toISOString().split('T')[0]);
    setReturnDate(returnDefault.toISOString().split('T')[0]);
    setPickupDate(nextMonth.toISOString().split('T')[0]);
    setDropoffDate(returnDefault.toISOString().split('T')[0]);

    // Load HERE API scripts for autocomplete
    const loadScript = (url: string) => {
      const script = document.createElement("script");
      script.src = url;
      script.async = true;
      document.body.appendChild(script);
    };

    loadScript("https://js.api.here.com/v3/3.1/mapsjs-core.js");
    loadScript("https://js.api.here.com/v3/3.1/mapsjs-service.js");

    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (travelerDropdownRef.current && !travelerDropdownRef.current.contains(event.target as Node)) {
        setShowTravelerDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleToggle = (type: 'flight' | 'stay' | 'car') => {
    if (type === 'stay') {
      if (!isStay) {
        // Auto-select flight when selecting stay
        setIsFlight(true);
      }
      setIsStay(!isStay);
    } else if (type === 'flight') {
      // Prevent deselecting flight if it would leave us with < 2 components
      const activeCount = [isFlight, isStay, isCar].filter(Boolean).length;
      if (isFlight && activeCount <= 2 && (isStay || isCar)) {
        return; // Don't allow deselection
      }
      setIsFlight(!isFlight);
    } else if (type === 'car') {
      setIsCar(!isCar);
    }
  };

  const getActiveComponentCount = () => {
    return [isFlight, isStay, isCar].filter(Boolean).length;
  };

  const isFormValid = () => {
    const activeCount = getActiveComponentCount();
    if (activeCount < 2) return false;

    // Check flight inputs if flight is selected
    if (isFlight && (!leavingFrom || !goingTo || !departureDate || !returnDate)) {
      return false;
    }

    // Check car inputs if car is selected
    if (isCar && (!pickupLocation || !pickupDate || !dropoffDate)) {
      return false;
    }

    return true;
  };

  const handlePackageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid()) {
      return;
    }

    // Track search event for analytics with enhanced GTM tracking
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'expedia_package_click', {
        event_category: 'Packages',
        event_label: 'Expedia Redirect',
        value: 1
      });
    }

    // Build Expedia packages URL
    const baseUrl = 'https://www.expedia.com/Packages-Search';
    const url = new URL(baseUrl);
    
    // Add trip type if flight is selected
    if (isFlight) {
      url.searchParams.set('trip', 'roundtrip');
      url.searchParams.set('leg1', `from:${leavingFrom},to:${goingTo},departure:${departureDate}`);
      url.searchParams.set('leg2', `from:${goingTo},to:${leavingFrom},departure:${returnDate}`);
      url.searchParams.set('passengers', `adults:${adults}`);
    }

    // Add hotel destination if stay is selected (use goingTo as default)
    if (isStay) {
      url.searchParams.set('hotel.destination', goingTo || leavingFrom);
    }

    // Add car details if car is selected
    if (isCar) {
      url.searchParams.set('car.pickupLocation', pickupLocation);
      url.searchParams.set('car.pickupDate', pickupDate);
      url.searchParams.set('car.dropoffDate', dropoffDate);
    }

    // Add rooms
    url.searchParams.set('rooms', rooms.toString());

    // Add affiliate parameters
    url.searchParams.set('siteid', '1');
    url.searchParams.set('langid', '1033');
    url.searchParams.set('clickref', '1100lBkVXSGk');
    url.searchParams.set('affcid', 'US.DIRECT.PHG.1100l402697.1100l68075');
    url.searchParams.set('ref_id', '1100lBkVXSGk');
    url.searchParams.set('my_ad', 'AFF.US.DIRECT.PHG.1100l402697.1100l68075');
    url.searchParams.set('afflid', '1100lBkVXSGk');
    url.searchParams.set('affdtl', 'PHG.1100lBkVXSGk.PZNccLk9hR');

    window.location.href = url.toString();
  };

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

        {/* Component Toggle Buttons */}
        <div className="flex justify-center gap-2 mb-4">
          <Button
            type="button"
            variant={isStay ? "default" : "outline"}
            onClick={() => handleToggle("stay")}
            className="flex items-center gap-2 bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <Building2 className="w-4 h-4" />
            Stay added
          </Button>
          <Button
            type="button"
            variant={isFlight ? "default" : "outline"}
            onClick={() => handleToggle("flight")}
            className="flex items-center gap-2 bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <Plane className="w-4 h-4" />
            Flight added
          </Button>
          <Button
            type="button"
            variant={isCar ? "default" : "outline"}
            onClick={() => handleToggle("car")}
            className="flex items-center gap-2 bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <Car className="w-4 h-4" />
            Car added
          </Button>
        </div>

        {/* Error message for insufficient components */}
        {getActiveComponentCount() < 2 && (
          <div className="text-yellow-300 text-sm mb-4">
            Select at least two components for a package search
          </div>
        )}

        {/* Package Widget */}
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl p-6">
          <form onSubmit={handlePackageSubmit} className="space-y-4">
            
            {/* Flight Inputs */}
            {isFlight && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2">
                  <MapPin className="text-teal-500 w-5 h-5 mr-2 flex-shrink-0" />
                  <Input
                    type="text"
                    placeholder="Leaving from"
                    value={leavingFrom}
                    onChange={(e) => setLeavingFrom(e.target.value)}
                    className="border-0 bg-transparent text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-0"
                    required
                  />
                </div>
                <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2">
                  <MapPin className="text-teal-500 w-5 h-5 mr-2 flex-shrink-0" />
                  <Input
                    type="text"
                    placeholder="Going to"
                    value={goingTo}
                    onChange={(e) => setGoingTo(e.target.value)}
                    className="border-0 bg-transparent text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-0"
                    required
                  />
                </div>
                <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2">
                  <Calendar className="text-teal-500 w-5 h-5 mr-2 flex-shrink-0" />
                  <Input
                    type="date"
                    value={departureDate}
                    onChange={(e) => setDepartureDate(e.target.value)}
                    className="border-0 bg-transparent text-gray-700 focus:outline-none focus:ring-0"
                    required
                  />
                </div>
                <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2">
                  <Calendar className="text-teal-500 w-5 h-5 mr-2 flex-shrink-0" />
                  <Input
                    type="date"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className="border-0 bg-transparent text-gray-700 focus:outline-none focus:ring-0"
                    required
                  />
                </div>
              </div>
            )}

            {/* Car Inputs */}
            {isCar && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2">
                  <Car className="text-teal-500 w-5 h-5 mr-2 flex-shrink-0" />
                  <Input
                    type="text"
                    placeholder="Car pickup location"
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    className="border-0 bg-transparent text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-0"
                    required
                  />
                </div>
                <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2">
                  <Calendar className="text-teal-500 w-5 h-5 mr-2 flex-shrink-0" />
                  <Input
                    type="date"
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    className="border-0 bg-transparent text-gray-700 focus:outline-none focus:ring-0"
                    required
                  />
                </div>
                <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2">
                  <Calendar className="text-teal-500 w-5 h-5 mr-2 flex-shrink-0" />
                  <Input
                    type="date"
                    value={dropoffDate}
                    onChange={(e) => setDropoffDate(e.target.value)}
                    className="border-0 bg-transparent text-gray-700 focus:outline-none focus:ring-0"
                    required
                  />
                </div>
              </div>
            )}

            {/* Travelers and Rooms */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Travelers */}
              <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2 relative" ref={travelerDropdownRef}>
                <Users className="text-teal-500 w-5 h-5 mr-2 flex-shrink-0" />
                <div 
                  className="flex items-center cursor-pointer text-gray-700 font-medium w-full justify-between"
                  onClick={() => setShowTravelerDropdown(!showTravelerDropdown)}
                >
                  <span>
                    {adults} Traveler{adults !== 1 ? 's' : ''}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </div>
                
                {/* Travelers Dropdown */}
                {showTravelerDropdown && (
                  <div className="absolute top-full left-0 bg-white border border-gray-200 rounded-lg shadow-xl z-[9999] mt-2 p-4 w-full">
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
                  </div>
                )}
              </div>

              {/* Rooms */}
              <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2">
                <Building2 className="text-teal-500 w-5 h-5 mr-2 flex-shrink-0" />
                <Input
                  type="number"
                  min="1"
                  max="8"
                  value={rooms}
                  onChange={(e) => setRooms(Number(e.target.value))}
                  className="border-0 bg-transparent text-gray-700 focus:outline-none focus:ring-0"
                />
                <span className="text-gray-500 text-sm ml-2">Room{rooms !== 1 ? 's' : ''}</span>
              </div>
            </div>

            {/* Search Button */}
            <Button 
              type="submit"
              disabled={!isFormValid()}
              className={`w-full py-4 text-lg font-semibold transition-colors duration-200 ${
                isFormValid() 
                  ? 'bg-[#00ccb8] hover:bg-[#00b2a3] text-white' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              SEARCH
            </Button>
          </form>
        </div>
      </div>

      {/* CJ Affiliate Pixel */}
      <img src="https://www.lduhtrp.net/image-101486313-15754452" width="1" height="1" style={{border: 0}} alt="" />
    </div>
  );
}