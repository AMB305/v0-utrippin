import { useState, useEffect, useRef } from 'react';
import { MapPin, Calendar, Users, ChevronDown, Clock } from 'lucide-react';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import heroImage from '@/assets/hero-cars.jpg';

export default function HeroCarWidget() {
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropoffLocation, setDropoffLocation] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [dropoffDate, setDropoffDate] = useState("");
  const [pickupTime, setPickupTime] = useState("10:00");
  const [dropoffTime, setDropoffTime] = useState("10:00");
  const [driverAge, setDriverAge] = useState("30-65");
  const [showDriverDropdown, setShowDriverDropdown] = useState(false);
  const [differentDropoff, setDifferentDropoff] = useState(false);
  const driverRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery('(max-width: 768px)');

  useEffect(() => {
    // Auto-fill default dates
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const threeDaysLater = new Date(tomorrow);
    threeDaysLater.setDate(tomorrow.getDate() + 3);
    
    setPickupDate(tomorrow.toISOString().split('T')[0]);
    setDropoffDate(threeDaysLater.toISOString().split('T')[0]);

    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (driverRef.current && !driverRef.current.contains(event.target as Node)) {
        setShowDriverDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCarSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!pickupLocation) {
      alert('Please enter a pickup location');
      return;
    }

    // GA4 tracking
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'click', {
        event_category: 'Car Search',
        event_label: 'HeroCarWidget',
        value: 1
      });
    }

    // Build new Expedia affiliate URL with all required parameters
    const url = new URL('https://www.expedia.com/Car-Search');
    url.searchParams.set('locn', pickupLocation);
    url.searchParams.set('startDate', pickupDate);
    url.searchParams.set('startTime', pickupTime);
    url.searchParams.set('endDate', dropoffDate);
    url.searchParams.set('endTime', dropoffTime);
    url.searchParams.set('age', driverAge);
    
    // Add different drop-off location if selected
    if (differentDropoff && dropoffLocation) {
      url.searchParams.set('dropLocn', dropoffLocation);
    }
    
    // Add all required affiliate parameters
    url.searchParams.set('partnerref', '1100lBkVXSGk');
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

  const ageRanges = [
    "25-29",
    "30-65",
    "66-75"
  ];

  return (
    <div className="relative h-screen w-full bg-black">
      {/* Background Image */}
      <img
        src={heroImage}
        alt="Scenic car journey"
        className="absolute inset-0 h-full w-full object-cover"
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col justify-center items-center text-center h-full px-6">
        <h1 className="text-white text-4xl md:text-6xl font-bold mb-8">
          Hit the Road
        </h1>

        {/* Different Dropoff Toggle */}
        <div className="flex justify-start w-full max-w-6xl mb-0">
          <div className="flex bg-white rounded-t-xl shadow-lg overflow-hidden">
            <label className="flex items-center gap-2 px-6 py-3 cursor-pointer hover:bg-gray-50">
              <input
                type="checkbox"
                checked={differentDropoff}
                onChange={(e) => setDifferentDropoff(e.target.checked)}
                className="w-4 h-4 text-teal-500 focus:ring-teal-400"
              />
              <span className="text-sm font-medium text-gray-700">
                Different drop-off location
              </span>
            </label>
          </div>
        </div>

        {/* Car Widget */}
        <div className="bg-white rounded-b-full rounded-tr-full shadow-2xl w-full max-w-6xl relative">
          <form onSubmit={handleCarSubmit}>
            <div className="flex items-center">
              {/* Pickup Location */}
              <div className="flex items-center px-6 py-4 border-r border-gray-200">
                <MapPin className="text-teal-500 w-5 h-5 mr-3 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Pickup location"
                  value={pickupLocation}
                  onChange={(e) => setPickupLocation(e.target.value)}
                  className="border-0 bg-transparent text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-0 text-base font-medium w-full min-w-[150px]"
                  required
                />
              </div>

              {/* Dropoff Location (if different) */}
              {differentDropoff && (
                <div className="flex items-center px-6 py-4 border-r border-gray-200">
                  <MapPin className="text-teal-500 w-5 h-5 mr-3 flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="Drop-off location"
                    value={dropoffLocation}
                    onChange={(e) => setDropoffLocation(e.target.value)}
                    className="border-0 bg-transparent text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-0 text-base font-medium w-full min-w-[150px]"
                    required={differentDropoff}
                  />
                </div>
              )}

              {/* Pickup Date & Time */}
              <div className="flex items-center px-6 py-4 border-r border-gray-200">
                <Calendar className="text-teal-500 w-5 h-5 mr-3 flex-shrink-0" />
                <div className="flex items-center space-x-2">
                  <input
                    type="date"
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    className="border-0 bg-transparent text-gray-700 focus:outline-none focus:ring-0 text-sm font-medium"
                    required
                  />
                  <Clock className="text-gray-400 w-4 h-4" />
                  <input
                    type="time"
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                    className="border-0 bg-transparent text-gray-700 focus:outline-none focus:ring-0 text-sm font-medium"
                    required
                  />
                </div>
              </div>

              {/* Dropoff Date & Time */}
              <div className="flex items-center px-6 py-4 border-r border-gray-200">
                <Calendar className="text-teal-500 w-5 h-5 mr-3 flex-shrink-0" />
                <div className="flex items-center space-x-2">
                  <input
                    type="date"
                    value={dropoffDate}
                    onChange={(e) => setDropoffDate(e.target.value)}
                    className="border-0 bg-transparent text-gray-700 focus:outline-none focus:ring-0 text-sm font-medium"
                    required
                  />
                  <Clock className="text-gray-400 w-4 h-4" />
                  <input
                    type="time"
                    value={dropoffTime}
                    onChange={(e) => setDropoffTime(e.target.value)}
                    className="border-0 bg-transparent text-gray-700 focus:outline-none focus:ring-0 text-sm font-medium"
                    required
                  />
                </div>
              </div>

              {/* Driver Age */}
              <div className="flex items-center px-6 py-4 border-r border-gray-200 relative" ref={driverRef}>
                <Users className="text-teal-500 w-5 h-5 mr-3 flex-shrink-0" />
                <div 
                  className="flex items-center cursor-pointer text-gray-700 font-medium"
                  onClick={() => setShowDriverDropdown(!showDriverDropdown)}
                >
                  <span>Age {driverAge}</span>
                  <ChevronDown className="w-4 h-4 ml-2 text-gray-400" />
                </div>
                
                {/* Driver Age Dropdown */}
                {showDriverDropdown && (
                  <div className="absolute top-full left-0 bg-white border border-gray-200 rounded-lg shadow-xl z-[9999] mt-2 p-2 w-[140px]">
                    {ageRanges.map((age) => (
                      <button
                        key={age}
                        type="button"
                        onClick={() => {
                          setDriverAge(age);
                          setShowDriverDropdown(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-50 ${
                          driverAge === age ? 'bg-teal-50 text-teal-700 font-medium' : 'text-gray-700'
                        }`}
                      >
                        {age} years
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Search Button */}
              <button 
                type="submit"
                className="bg-[#00ccb8] hover:bg-[#00b2a3] text-white font-semibold px-6 py-2 text-base transition-colors duration-200 rounded-r-full flex items-center justify-center h-full"
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