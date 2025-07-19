import { useState, useRef, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Plane } from 'lucide-react';

interface Airport {
  iata_code: string;
  name: string;
  city: string;
  country: string;
}

interface AirportAutocompleteProps {
  name: string;
  placeholder: string;
  value: string;
  onChange: (value: string, iataCode: string) => void;
  className?: string;
  required?: boolean;
}

export default function AirportAutocomplete({ 
  name, 
  placeholder, 
  value, 
  onChange, 
  className = "",
  required = false 
}: AirportAutocompleteProps) {
  const [airports, setAirports] = useState<Airport[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const searchAirports = async (query: string) => {
    console.log(`🔍 Frontend: Starting search for "${query}"`)
    
    if (query.length < 2) {
      console.log('❌ Frontend: Query too short, clearing results')
      setAirports([]);
      setShowDropdown(false);
      return;
    }

    setLoading(true);
    console.log('⏳ Frontend: Setting loading to true')
    
    try {
      console.log('🚀 Frontend: Calling supabase function...')
      
      const { data, error } = await supabase.functions.invoke('airport-search', {
        body: { query }
      });

      console.log('📥 Frontend: Function response received:', { data, error })

      if (error) {
        console.error('❌ Frontend: Supabase function error:', error);
        // Fallback to basic airports for testing
        const basicAirports = getBasicAirportsFallback(query);
        setAirports(basicAirports);
        setShowDropdown(basicAirports.length > 0);
      } else {
        console.log('✅ Frontend: Success, setting airports:', data?.airports?.length || 0)
        setAirports(data.airports || []);
        setShowDropdown(true);
        setSelectedIndex(-1);
      }
    } catch (error) {
      console.error('💥 Frontend: Catch block error:', error);
      // Fallback to basic airports
      const basicAirports = getBasicAirportsFallback(query);
      setAirports(basicAirports);
      setShowDropdown(basicAirports.length > 0);
    } finally {
      console.log('🏁 Frontend: Setting loading to false')
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue, '');
    searchAirports(newValue);
  };

  const handleSelectAirport = (airport: Airport) => {
    const displayValue = `${airport.city} (${airport.iata_code})`;
    onChange(displayValue, airport.iata_code);
    setShowDropdown(false);
    setAirports([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown || airports.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < airports.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleSelectAirport(airports[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowDropdown(false);
        setSelectedIndex(-1);
        break;
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Basic fallback airports for testing
  const getBasicAirportsFallback = (query: string): Airport[] => {
    const basicAirports = [
      { iata_code: 'JFK', name: 'John F. Kennedy International Airport', city: 'New York', country: 'United States' },
      { iata_code: 'LAX', name: 'Los Angeles International Airport', city: 'Los Angeles', country: 'United States' },
      { iata_code: 'MIA', name: 'Miami International Airport', city: 'Miami', country: 'United States' },
      { iata_code: 'ORD', name: 'O\'Hare International Airport', city: 'Chicago', country: 'United States' },
      { iata_code: 'LHR', name: 'Heathrow Airport', city: 'London', country: 'United Kingdom' },
      { iata_code: 'CDG', name: 'Charles de Gaulle Airport', city: 'Paris', country: 'France' },
    ];
    
    const queryLower = query.toLowerCase();
    return basicAirports.filter(airport => 
      airport.city.toLowerCase().includes(queryLower) ||
      airport.name.toLowerCase().includes(queryLower) ||
      airport.iata_code.toLowerCase().includes(queryLower)
    );
  };

  return (
    <div className="relative">
      <div className="relative">
        <Plane className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          ref={inputRef}
          name={name}
          type="text"
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`pl-10 ${className}`}
          required={required}
          autoComplete="off"
        />
        {loading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>
      
      {showDropdown && airports.length > 0 && (
        <div 
          ref={dropdownRef}
          className="absolute z-[100] w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto"
        >
          {airports.map((airport, index) => (
            <div
              key={airport.iata_code}
              className={`px-4 py-2 cursor-pointer hover:bg-blue-50 ${
                index === selectedIndex ? 'bg-blue-50' : ''
              }`}
              onClick={() => handleSelectAirport(airport)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-medium">{airport.city}</span>
                  <span className="text-gray-500 ml-2">({airport.iata_code})</span>
                </div>
                <span className="text-sm text-gray-400">{airport.country}</span>
              </div>
              <div className="text-sm text-gray-500 truncate">{airport.name}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}