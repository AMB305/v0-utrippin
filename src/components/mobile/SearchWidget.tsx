import { useState } from 'react';
import { MapPin, Calendar, Users, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DateRangePicker } from '@/components/hotels/DateRangePicker';
import { GuestRoomSelector } from '@/components/hotels/GuestRoomSelector';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

interface SearchWidgetProps {
  onSearch?: (searchData: any) => void;
}

export function SearchWidget({ onSearch }: SearchWidgetProps) {
  const navigate = useNavigate();
  const [destination, setDestination] = useState('');
  const [activePropertyType, setActivePropertyType] = useState('Hotel');
  const [dateRange, setDateRange] = useState({
    checkIn: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    checkOut: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000)
  });
  const [guestConfig, setGuestConfig] = useState({
    adults: 2,
    children: [],
    rooms: 1
  });
  
  const propertyTypes = ['Hotel', 'Villa', 'House', 'Apartment'];
  
  const handleSearch = () => {
    const searchData = {
      destination,
      checkInDate: dateRange.checkIn?.toISOString().split('T')[0] || format(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
      checkOutDate: dateRange.checkOut?.toISOString().split('T')[0] || format(new Date(Date.now() + 9 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
      adults: guestConfig.adults.toString(),
      children: guestConfig.children.length.toString(),
      rooms: guestConfig.rooms.toString()
    };
    
    if (destination) {
      const params = new URLSearchParams(searchData);
      navigate(`/hotels/search?${params.toString()}`);
    }
    
    onSearch?.(searchData);
  };

  return (
    <div className="p-4 bg-mobile-section-bg">
      {/* Property Type Filter */}
      <div className="flex space-x-2 mb-4">
        {propertyTypes.map((type) => (
          <button
            key={type}
            onClick={() => setActivePropertyType(type)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activePropertyType === type
                ? 'bg-mobile-primary-teal text-white'
                : 'bg-mobile-dark-grey text-mobile-text-secondary border border-mobile-border-color'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Search Input */}
      <div className="relative mb-4">
        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-mobile-text-secondary" />
        <Input
          placeholder="Enter Your Destination"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          className="pl-12 bg-mobile-dark-grey border-mobile-border-color text-mobile-text-primary placeholder:text-mobile-text-secondary"
        />
      </div>

      {/* Date and Guest Selection */}
      <div className="space-y-3 mb-4">
        <DateRangePicker
          value={dateRange}
          onChange={setDateRange}
          className="w-full bg-mobile-dark-grey border-mobile-border-color text-mobile-text-primary"
        />
        <GuestRoomSelector
          value={guestConfig}
          onChange={setGuestConfig}
          className="w-full bg-mobile-dark-grey border-mobile-border-color text-mobile-text-primary"
        />
        <Button 
          variant="outline"
          className="w-full bg-mobile-dark-grey border-mobile-border-color text-mobile-text-primary hover:bg-mobile-primary-teal/20"
        >
          <Play className="w-4 h-4 mr-2" />
          Take a tour
        </Button>
      </div>

      {/* Search Button */}
      <Button 
        onClick={handleSearch}
        className="w-full teal-button"
        disabled={!destination.trim()}
      >
        Search Hotels
      </Button>
    </div>
  );
}