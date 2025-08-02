import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Users, ChevronDown, Bed } from 'lucide-react';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import heroImage from '@/assets/hero-hotels.jpg';

export default function HeroHotelWidget() {
  const navigate = useNavigate();
  const [destination, setDestination] = useState("");
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [rooms, setRooms] = useState(1);
  const [showGuestDropdown, setShowGuestDropdown] = useState(false);
  const guestRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery('(max-width: 768px)');

  useEffect(() => {
    // Auto-fill default dates
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    
    setCheckInDate(today.toISOString().split('T')[0]);
    setCheckOutDate(nextWeek.toISOString().split('T')[0]);

    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (guestRef.current && !guestRef.current.contains(event.target as Node)) {
        setShowGuestDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleHotelSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log('🚀 FORM SUBMIT DEBUG:', {
      destination,
      checkInDate,
      checkOutDate,
      adults,
      children,
      rooms
    });

    if (!destination) {
      alert("Please enter a destination.");
      return;
    }

    // Set default dates if not provided
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);

    const queryParams = new URLSearchParams({
      destination: destination,
      checkInDate: checkInDate || today.toISOString().split('T')[0],
      checkOutDate: checkOutDate || nextWeek.toISOString().split('T')[0],
      adults: adults.toString(),
      children: children.toString(),
      rooms: rooms.toString()
    });

    console.log("🚀 Redirecting with query:", queryParams.toString());

    // GA4 tracking
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'click', {
        event_category: 'Hotel Search',
        event_label: 'HeroHotelWidget',
        value: 1
      });
    }

    navigate(`/hotels/search?${queryParams.toString()}`);
  };

  return (
    <div className="relative h-screen w-full bg-black">
      {/* Background Image */}
      <img
        src={heroImage}
        alt="Luxury hotel resort"
        className="absolute inset-0 h-full w-full object-cover"
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col justify-center items-center text-center h-full px-6">
        <h1 className="text-white text-4xl md:text-6xl font-bold mb-8">
          Find Your Perfect Stay
        </h1>

        {/* Hotel Widget */}
        <div className="bg-white rounded-full shadow-2xl w-full max-w-6xl relative">
          <form onSubmit={handleHotelSubmit}>
            <div className="flex items-center">
              {/* Destination Field */}
              <div className="flex items-center px-6 py-4 border-r border-gray-200">
                <MapPin className="text-teal-500 w-5 h-5 mr-3 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Where are you going?"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="border-0 bg-transparent text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-0 text-base font-medium w-full min-w-[200px]"
                  required
                />
              </div>

              {/* Check-in Date */}
              <div className="flex items-center px-6 py-4 border-r border-gray-200">
                <Calendar className="text-teal-500 w-5 h-5 mr-3 flex-shrink-0" />
                <input
                  type="date"
                  value={checkInDate}
                  onChange={(e) => setCheckInDate(e.target.value)}
                  className="border-0 bg-transparent text-gray-700 focus:outline-none focus:ring-0 text-base font-medium"
                  required
                />
              </div>

              {/* Check-out Date */}
              <div className="flex items-center px-6 py-4 border-r border-gray-200">
                <Calendar className="text-teal-500 w-5 h-5 mr-3 flex-shrink-0" />
                <input
                  type="date"
                  value={checkOutDate}
                  onChange={(e) => setCheckOutDate(e.target.value)}
                  className="border-0 bg-transparent text-gray-700 focus:outline-none focus:ring-0 text-base font-medium"
                  required
                />
              </div>

              {/* Guests & Rooms */}
              <div className="flex items-center px-6 py-4 border-r border-gray-200 relative" ref={guestRef}>
                <Users className="text-teal-500 w-5 h-5 mr-3 flex-shrink-0" />
                <div 
                  className="flex items-center cursor-pointer text-gray-700 font-medium"
                  onClick={() => setShowGuestDropdown(!showGuestDropdown)}
                >
                  <span>
                    {adults + children} Guest{adults + children !== 1 ? 's' : ''}, {rooms} Room{rooms !== 1 ? 's' : ''}
                  </span>
                  <ChevronDown className="w-4 h-4 ml-2 text-gray-400" />
                </div>
                
                {/* Guest & Rooms Dropdown */}
                {showGuestDropdown && (
                  <div className="absolute top-full left-0 bg-white border border-gray-200 rounded-lg shadow-xl z-[9999] mt-2 p-4 w-[280px]">
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
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700 font-medium">Rooms</span>
                        <div className="flex items-center space-x-3">
                          <button
                            type="button"
                            onClick={() => setRooms(Math.max(1, rooms - 1))}
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                          >
                            -
                          </button>
                          <span className="w-8 text-center">{rooms}</span>
                          <button
                            type="button"
                            onClick={() => setRooms(Math.min(4, rooms + 1))}
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
