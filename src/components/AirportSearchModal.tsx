import { useState, useEffect, useRef } from "react";
import { Plane, X, Search } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { duffelClient, DuffelAirport } from "@/lib/duffel";
import { cn } from "@/lib/utils";

interface AirportSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (airport: DuffelAirport) => void;
  title?: string;
  placeholder?: string;
}

export default function AirportSearchModal({ 
  isOpen, 
  onClose, 
  onSelect,
  title = "Please select an airport",
  placeholder = "Search airports or cities"
}: AirportSearchModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<DuffelAirport[]>([]);
  const [loading, setLoading] = useState(false);
  const searchTimeout = useRef<NodeJS.Timeout>();
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Search for airports
  useEffect(() => {
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    if (searchQuery.length >= 2) {
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
  }, [searchQuery]);

  // Handle airport selection
  const handleAirportSelect = (airport: DuffelAirport) => {
    onSelect(airport);
    onClose();
    setSearchQuery("");
    setSearchResults([]);
  };

  // Reset when modal closes
  const handleClose = () => {
    onClose();
    setSearchQuery("");
    setSearchResults([]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] p-0">
        <DialogHeader className="p-6 pb-4 border-b">
          <DialogTitle className="text-lg font-medium">{title}</DialogTitle>
        </DialogHeader>

        <div className="p-6 pt-4">
          {/* Search Input */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              ref={inputRef}
              placeholder={placeholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-lg"
              autoComplete="off"
            />
          </div>

          {/* Search Results */}
          <div className="max-h-[400px] overflow-y-auto">
            {loading && (
              <div className="flex items-center justify-center py-8 text-muted-foreground">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mr-3"></div>
                Searching airports...
              </div>
            )}

            {!loading && searchQuery.length >= 2 && searchResults.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No airports found for "{searchQuery}"
              </div>
            )}

            {!loading && searchResults.length > 0 && (
              <div className="space-y-1">
                {searchResults.map((airport) => (
                  <div
                    key={airport.id}
                    className="flex items-center p-4 hover:bg-accent cursor-pointer rounded-lg transition-colors group"
                    onClick={() => handleAirportSelect(airport)}
                  >
                    <div className="flex items-center justify-center w-8 h-8 rounded bg-blue-100 mr-4">
                      <Plane className="h-4 w-4 text-blue-600" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3">
                        <div className="font-medium text-base">
                          {airport.city_name}
                        </div>
                        <div className="px-2 py-1 bg-blue-600 text-white text-sm font-medium rounded">
                          {airport.iata_code}
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {airport.name}
                      </div>
                      <div className="text-xs text-muted-foreground/70 mt-0.5">
                        {airport.country_name || 'Unknown Country'}
                      </div>
                    </div>

                    {/* Country Flag Placeholder */}
                    <div className="w-6 h-4 bg-gray-200 rounded-sm flex-shrink-0 ml-4">
                      <span className="text-xs">🇺🇸</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {searchQuery.length < 2 && (
              <div className="text-center py-8 text-muted-foreground">
                Type at least 2 characters to search for airports
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}