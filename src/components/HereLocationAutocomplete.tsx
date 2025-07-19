import { useState, useEffect } from "react";
import { MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Location {
  id: string;
  address: {
    label: string;
    city?: string;
    state?: string;
    country?: string;
  };
  position?: {
    lat: number;
    lng: number;
  };
}

interface HereLocationAutocompleteProps {
  label: string;
  onSelect: (location: Location) => void;
  className?: string;
  placeholder?: string;
}

export default function HereLocationAutocomplete({ 
  label, 
  onSelect, 
  className = "",
  placeholder = "Search for a city or hotel"
}: HereLocationAutocompleteProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchLocations = async () => {
      if (query.length < 2) {
        setResults([]);
        return;
      }
      
      setLoading(true);
      try {
        // Use Supabase edge function for HERE API calls
        const { data, error } = await supabase.functions.invoke('here-locations', {
          body: { query }
        });
        
        if (error) {
          throw new Error(error.message);
        }
        
        setResults(data.results || []);
      } catch (err) {
        console.error("HERE location search failed", err);
        // Fallback to diverse global locations for demo
        const basicLocations = [
          {
            id: 'orlando',
            address: { 
              label: 'Orlando, Florida, United States',
              city: 'Orlando',
              state: 'Florida',
              country: 'United States'
            }
          },
          {
            id: 'miami',
            address: { 
              label: 'Miami, Florida, United States',
              city: 'Miami', 
              state: 'Florida',
              country: 'United States'
            }
          },
          {
            id: 'nyc',
            address: { 
              label: 'New York, New York, United States',
              city: 'New York',
              state: 'New York', 
              country: 'United States'
            }
          },
          {
            id: 'la',
            address: { 
              label: 'Los Angeles, California, United States',
              city: 'Los Angeles',
              state: 'California',
              country: 'United States'
            }
          },
          {
            id: 'london',
            address: { 
              label: 'London, England, United Kingdom',
              city: 'London',
              state: 'England',
              country: 'United Kingdom'
            }
          },
          {
            id: 'paris',
            address: { 
              label: 'Paris, Île-de-France, France',
              city: 'Paris',
              state: 'Île-de-France',
              country: 'France'
            }
          },
          {
            id: 'tokyo',
            address: { 
              label: 'Tokyo, Tokyo Prefecture, Japan',
              city: 'Tokyo',
              state: 'Tokyo Prefecture',
              country: 'Japan'
            }
          },
          {
            id: 'dubai',
            address: { 
              label: 'Dubai, Dubai Emirate, United Arab Emirates',
              city: 'Dubai',
              state: 'Dubai Emirate',
              country: 'United Arab Emirates'
            }
          }
        ].filter(location => 
          location.address.label.toLowerCase().includes(query.toLowerCase())
        );
        setResults(basicLocations);
      } finally {
        setLoading(false);
      }
    };
    
    const timeout = setTimeout(fetchLocations, 300);
    return () => clearTimeout(timeout);
  }, [query]);

  return (
    <div className={`relative w-full ${className}`}>
      <label className="block text-sm font-semibold mb-2 text-gray-700">{label}</label>
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          className="w-full pl-10 pr-3 py-3 bg-gray-100 rounded-lg outline-none text-gray-800 placeholder-gray-500 focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
        />
        {loading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>
      
      {results.length > 0 && (
        <ul className="absolute bg-white shadow-lg border border-gray-200 w-full max-h-64 overflow-y-auto z-50 rounded-lg mt-1">
          {results.map((location) => (
            <li
              key={location.id}
              onClick={() => {
                setQuery(location.address.label);
                setResults([]);
                onSelect(location);
              }}
              className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
            >
              <div className="flex items-center">
                <MapPin className="w-4 h-4 text-blue-600 mr-3 flex-shrink-0" />
                <span className="text-gray-800">{location.address.label}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}