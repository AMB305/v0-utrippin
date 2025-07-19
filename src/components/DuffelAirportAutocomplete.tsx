import { useState, useEffect } from "react";
import axios from "axios";
import { Plane } from "lucide-react";

interface Airport {
  id: string;
  name: string;
  iata_code: string;
  city: { name: string };
  country: { name: string };
}

interface DuffelAirportAutocompleteProps {
  label: string;
  onSelect: (airport: Airport) => void;
  className?: string;
  placeholder?: string;
}

export default function DuffelAirportAutocomplete({ 
  label, 
  onSelect, 
  className = "",
  placeholder = "Search by airport or city"
}: DuffelAirportAutocompleteProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Airport[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAirports = async () => {
      if (query.length < 2) {
        setResults([]);
        return;
      }
      
      setLoading(true);
      try {
        // Use Supabase edge function for Duffel API calls to avoid CORS and secure the API key
        const response = await fetch('/api/duffel-airports', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ query }),
        });
        
        if (!response.ok) {
          throw new Error('API request failed');
        }
        
        const data = await response.json();
        setResults(data.data || []);
      } catch (err) {
        console.error("Duffel airport search failed", err);
        // Fallback to basic airports for demo
        const basicAirports = [
          {
            id: 'jfk',
            name: 'John F. Kennedy International Airport',
            iata_code: 'JFK',
            city: { name: 'New York' },
            country: { name: 'United States' }
          },
          {
            id: 'lax',
            name: 'Los Angeles International Airport', 
            iata_code: 'LAX',
            city: { name: 'Los Angeles' },
            country: { name: 'United States' }
          },
          {
            id: 'mia',
            name: 'Miami International Airport',
            iata_code: 'MIA', 
            city: { name: 'Miami' },
            country: { name: 'United States' }
          }
        ].filter(airport => 
          airport.name.toLowerCase().includes(query.toLowerCase()) ||
          airport.city.name.toLowerCase().includes(query.toLowerCase()) ||
          airport.iata_code.toLowerCase().includes(query.toLowerCase())
        );
        setResults(basicAirports);
      } finally {
        setLoading(false);
      }
    };
    
    const timeout = setTimeout(fetchAirports, 300);
    return () => clearTimeout(timeout);
  }, [query]);

  return (
    <div className={`relative w-full ${className}`}>
      <label className="block text-sm font-semibold mb-2 text-gray-700">{label}</label>
      <div className="relative">
        <Plane className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
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
          {results.map((airport) => (
            <li
              key={airport.id}
              onClick={() => {
                setQuery(`${airport.city.name} (${airport.iata_code})`);
                setResults([]);
                onSelect(airport);
              }}
              className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-medium text-gray-800">{airport.city.name}</span>
                  <span className="text-blue-600 ml-2">({airport.iata_code})</span>
                </div>
                <span className="text-sm text-gray-500">{airport.country.name}</span>
              </div>
              <div className="text-sm text-gray-500 truncate mt-1">{airport.name}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}