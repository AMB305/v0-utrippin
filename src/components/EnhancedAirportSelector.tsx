import { useState, useEffect, useRef } from "react";
import { Check, ChevronDown, MapPin, Plane } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { duffelClient, DuffelAirport } from "@/lib/duffel";
import { cn } from "@/lib/utils";

interface EnhancedAirportSelectorProps {
  placeholder?: string;
  value?: DuffelAirport[];
  onChange?: (airports: DuffelAirport[]) => void;
  className?: string;
}

interface AirportGroup {
  cityName: string;
  countryName: string;
  airports: DuffelAirport[];
}

export default function EnhancedAirportSelector({ 
  placeholder = "Search airports or cities", 
  value = [], 
  onChange,
  className 
}: EnhancedAirportSelectorProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<DuffelAirport[]>([]);
  const [loading, setLoading] = useState(false);
  const [includeNearby, setIncludeNearby] = useState(false);
  const [nearbyRadius, setNearbyRadius] = useState(50);
  const [selectedAirports, setSelectedAirports] = useState<DuffelAirport[]>(value);
  const searchTimeout = useRef<NodeJS.Timeout>();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setSelectedAirports(value);
  }, [value]);

  useEffect(() => {
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    if (searchQuery.length >= 2) {
      searchTimeout.current = setTimeout(async () => {
        setLoading(true);
        try {
          const results = await duffelClient.searchAirports(searchQuery);
          setSearchResults(results.data || []);
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
  }, [searchQuery]);

  const groupAirportsByCity = (airports: DuffelAirport[]): AirportGroup[] => {
    const groups = airports.reduce((acc, airport) => {
      const key = `${airport.city_name}-${airport.country_name}`;
      if (!acc[key]) {
        acc[key] = {
          cityName: airport.city_name,
          countryName: airport.country_name,
          airports: []
        };
      }
      acc[key].airports.push(airport);
      return acc;
    }, {} as Record<string, AirportGroup>);

    return Object.values(groups).sort((a, b) => a.cityName.localeCompare(b.cityName));
  };

  const handleAirportSelect = async (airport: DuffelAirport) => {
    // For single selection, clear search and close dropdown
    setSearchQuery(`${airport.city_name} (${airport.iata_code}) - ${airport.name}`);
    setSelectedAirports([airport]);
    onChange?.([airport]);
    setOpen(false);
  };

  const handleAirportToggle = async (airport: DuffelAirport) => {
    let newSelection = [...selectedAirports];
    const isSelected = selectedAirports.find(a => a.id === airport.id);

    if (isSelected) {
      newSelection = newSelection.filter(a => a.id !== airport.id);
    } else {
      newSelection.push(airport);
      
      // If include nearby is enabled, add nearby airports
      if (includeNearby) {
        try {
          const nearbyResult = await duffelClient.getNearbyAirports(airport.id, nearbyRadius);
          const nearbyAirports = nearbyResult.data.filter(nearby => 
            !newSelection.find(selected => selected.id === nearby.id)
          );
          newSelection.push(...nearbyAirports);
        } catch (error) {
          console.error('Error fetching nearby airports:', error);
        }
      }
    }

    setSelectedAirports(newSelection);
    onChange?.(newSelection);
  };

  const handleCityToggle = async (group: AirportGroup) => {
    const allSelected = group.airports.every(airport => 
      selectedAirports.find(a => a.id === airport.id)
    );

    if (allSelected) {
      // Deselect all airports in this city
      const newSelection = selectedAirports.filter(selected => 
        !group.airports.find(airport => airport.id === selected.id)
      );
      setSelectedAirports(newSelection);
      onChange?.(newSelection);
    } else {
      // Select all airports in this city
      let newSelection = [...selectedAirports];
      for (const airport of group.airports) {
        if (!newSelection.find(a => a.id === airport.id)) {
          newSelection.push(airport);
        }
      }
      setSelectedAirports(newSelection);
      onChange?.(newSelection);
    }
  };

  const removeAirport = (airportId: string) => {
    const newSelection = selectedAirports.filter(a => a.id !== airportId);
    setSelectedAirports(newSelection);
    onChange?.(newSelection);
  };

  const airportGroups = groupAirportsByCity(searchResults);

  return (
    <div className={cn("relative w-full", className)}>
      <Input
        ref={inputRef}
        placeholder={placeholder}
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
          setOpen(e.target.value.length >= 2);
        }}
        onFocus={() => {
          if (searchQuery.length >= 2) {
            setOpen(true);
          }
        }}
        onBlur={() => {
          // Delay closing to allow clicking on suggestions
          setTimeout(() => setOpen(false), 200);
        }}
        className="w-full"
      />
      
      {open && searchResults.length > 0 && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-background border border-border rounded-md shadow-lg max-h-96 overflow-y-auto">
          {airportGroups.map((group) => (
            <div key={`${group.cityName}-${group.countryName}`} className="border-b last:border-b-0">
              {group.airports.map((airport) => (
                <div
                  key={airport.id}
                  className="flex items-center p-3 hover:bg-accent cursor-pointer"
                  onClick={() => handleAirportSelect(airport)}
                >
                  <div className="flex items-center space-x-3 flex-1">
                    <Plane className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium">
                        {airport.city_name} ({airport.iata_code}) - {airport.name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {airport.country_name}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
      
      {open && loading && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-background border border-border rounded-md shadow-lg p-4">
          <div className="text-center text-sm text-muted-foreground">
            Searching airports...
          </div>
        </div>
      )}
      
      {open && searchQuery.length >= 2 && !loading && searchResults.length === 0 && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-background border border-border rounded-md shadow-lg p-4">
          <div className="text-center text-sm text-muted-foreground">
            No airports found for "{searchQuery}"
          </div>
        </div>
      )}
    </div>
  );
}
