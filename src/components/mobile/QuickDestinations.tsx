import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

interface QuickDestinationsProps {
  destinations?: string[];
}

export function QuickDestinations({ 
  destinations = ['Roma', 'Berlin', 'New York', 'Paris', 'Tokyo', 'London'] 
}: QuickDestinationsProps) {
  const navigate = useNavigate();

  const handleDestinationClick = (destination: string) => {
    const searchData = {
      destination,
      checkInDate: format(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
      checkOutDate: format(new Date(Date.now() + 9 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
      adults: '2',
      children: '0',
      rooms: '1'
    };
    
    const params = new URLSearchParams(searchData);
    navigate(`/hotels/search?${params.toString()}`);
  };

  return (
    <div className="p-4">
      <h3 className="text-mobile-text-primary font-semibold mb-3">Popular Destinations</h3>
      <div className="flex space-x-3 overflow-x-auto no-scrollbar">
        {destinations.map((destination) => (
          <button
            key={destination}
            onClick={() => handleDestinationClick(destination)}
            className="flex-shrink-0 px-4 py-2 bg-mobile-primary-teal/20 border border-mobile-primary-teal text-mobile-primary-teal rounded-xl text-sm font-medium hover:bg-mobile-primary-teal hover:text-white transition-all"
          >
            {destination}
          </button>
        ))}
      </div>
    </div>
  );
}