import { useState, useEffect, useRef } from "react";
import { Plane, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { duffelClient, DuffelAirport } from "@/lib/duffel";
import { cn } from "@/lib/utils";

interface InlineAirportDropdownProps {
  placeholder?: string;
  value?: DuffelAirport | null;
  onChange?: (airport: DuffelAirport | null) => void;
  className?: string;
  inputClassName?: string;
}

export default function InlineAirportDropdown({ 
  placeholder = "Search airports or cities", 
  value, 
  onChange,
  className,
  inputClassName 
}: InlineAirportDropdownProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<DuffelAirport[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const searchTimeout = useRef<NodeJS.Timeout>();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Update display when value changes
  useEffect(() => {
    if (value) {
      setSearchQuery(`${value.city_name} (${value.iata_code})`);
    }
  }, [value]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Search for airports
  useEffect(() => {
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    if (searchQuery.length >= 2 && !value) {
      searchTimeout.current = setTimeout(async () => {
        setLoading(true);
        try {
          const results = await duffelClient.searchAirports(searchQuery);
          const airportsData = Array.isArray(results) ? results : (results.data || []);
          setSearchResults(airportsData);
        } catch (error) {
          console.error('Error searching airports:', error);
          setSearchResults([]);
        } finally {
          setLoading(false);
        }
      }, 300);
    } else {
      setSearchResults([]);
    }

    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, [searchQuery, value]);

  // Handle input focus
  const handleInputFocus = () => {
    setIsDropdownOpen(true);
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (value && query !== `${value.city_name} (${value.iata_code})`) {
      onChange?.(null);
    }
    
    setIsDropdownOpen(query.length >= 1);
  };

  // Handle airport selection
  const handleAirportSelect = (airport: DuffelAirport) => {
    onChange?.(airport);
    setSearchQuery(`${airport.city_name} (${airport.iata_code})`);
    setIsDropdownOpen(false);
  };

  return (
    <div className={cn("relative w-full", className)} ref={dropdownRef}>
      <Input
        ref={inputRef}
        placeholder={placeholder}
        value={searchQuery}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        className={cn("w-full", inputClassName)}
        autoComplete="off"
        type="text"
      />
      
      {isDropdownOpen && (
        <div className="absolute z-50 left-0 right-0 mt-1 bg-white rounded-lg border shadow-lg max-h-72 overflow-y-auto">
          {loading && (
            <div className="flex items-center justify-center py-4 text-muted-foreground">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
              Searching...
            </div>
          )}

          {!loading && searchQuery.length >= 2 && searchResults.length === 0 && (
            <div className="text-center py-4 text-muted-foreground text-sm">
              No airports found
            </div>
          )}

          {!loading && searchResults.length > 0 && (
            <div className="py-1">
              {searchResults.map((airport) => (
                <div
                  key={airport.id}
                  className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleAirportSelect(airport)}
                >
                  <div className="flex items-center justify-center w-6 h-6 rounded bg-blue-100 mr-2">
                    <Plane className="h-3 w-3 text-blue-600" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center">
                      <div className="font-medium text-sm truncate">
                        {airport.city_name}
                      </div>
                      <div className="ml-1 px-1 py-0.5 bg-blue-600 text-white text-xs font-medium rounded">
                        {airport.iata_code}
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      {airport.name}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {searchQuery.length < 2 && (
            <div className="text-center py-4 text-muted-foreground text-sm">
              Type at least 2 characters to search
            </div>
          )}
        </div>
      )}
    </div>
  );
}
