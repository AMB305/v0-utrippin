import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Search, ArrowLeftRight, Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { duffelClient, DuffelAirport } from "@/lib/duffel";

const FlightSearchBar = () => {
  const navigate = useNavigate();
  const [tripType, setTripType] = useState("Round-trip");
  const [bags, setBags] = useState("0 bags");
  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");
  const [fromAirport, setFromAirport] = useState<DuffelAirport | null>(null);
  const [toAirport, setToAirport] = useState<DuffelAirport | null>(null);
  const [departureDate, setDepartureDate] = useState<Date | undefined>(undefined);
  const [returnDate, setReturnDate] = useState<Date | undefined>(undefined);
  const [passengers, setPassengers] = useState("1 adult, Economy");
  const [activeField, setActiveField] = useState<string | null>(null);
  const [airportSearch, setAirportSearch] = useState({
    from: { open: false, results: [] as DuffelAirport[], loading: false },
    to: { open: false, results: [] as DuffelAirport[], loading: false }
  });

  // Airport search functionality
  const searchAirports = async (query: string, field: 'from' | 'to') => {
    if (query.length < 2) return;
    
    setAirportSearch(prev => ({
      ...prev,
      [field]: { ...prev[field], loading: true }
    }));
    
    try {
      const response = await duffelClient.searchAirports(query);
      setAirportSearch(prev => ({
        ...prev,
        [field]: { 
          ...prev[field], 
          results: response.data.slice(0, 8),
          loading: false 
        }
      }));
    } catch (error) {
      console.error('Airport search error:', error);
      setAirportSearch(prev => ({
        ...prev,
        [field]: { ...prev[field], results: [], loading: false }
      }));
    }
  };

  const handleAirportSelect = (airport: DuffelAirport, field: 'from' | 'to') => {
    if (field === 'from') {
      setFromAirport(airport);
      setFromLocation(`${airport.city_name} (${airport.iata_code})`);
    } else {
      setToAirport(airport);
      setToLocation(`${airport.city_name} (${airport.iata_code})`);
    }
    
    setAirportSearch(prev => ({
      ...prev,
      [field]: { ...prev[field], open: false }
    }));
  };

  const handleSearch = () => {
    if (!fromAirport || !toAirport || !departureDate) {
      // Show user-friendly error feedback
      console.warn('Missing required fields for flight search');
      return;
    }
    
    const params = new URLSearchParams({
      origin: fromAirport.iata_code,
      destination: toAirport.iata_code,
      departureDate: departureDate.toISOString().split('T')[0],
      tripType: tripType.toLowerCase().replace('-', '_'),
      passengers: passengers
    });
    
    if (tripType === 'Round-trip' && returnDate) {
      params.append('returnDate', returnDate.toISOString().split('T')[0]);
    }
    
    navigate(`/flight-results?${params.toString()}`);
  };

  const handleSwapLocations = () => {
    const tempAirport = fromAirport;
    const tempLocation = fromLocation;
    
    setFromAirport(toAirport);
    setFromLocation(toLocation);
    setToAirport(tempAirport);
    setToLocation(tempLocation);
  };

  return (
    <div className="bg-travel-light py-4">
      <div className="container mx-auto px-4">
        {/* Trip Type Selection with Radio Buttons */}
        <div className="flex items-center gap-6 mb-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="round-trip"
                name="tripType"
                value="Round-trip"
                checked={tripType === "Round-trip"}
                onChange={(e) => setTripType(e.target.value)}
                className="w-4 h-4 text-primary border-2 border-muted-foreground focus:ring-primary focus:ring-2"
              />
              <label htmlFor="round-trip" className="text-sm font-medium text-foreground cursor-pointer">
                Round-trip
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="one-way"
                name="tripType"
                value="One-way"
                checked={tripType === "One-way"}
                onChange={(e) => setTripType(e.target.value)}
                className="w-4 h-4 text-primary border-2 border-muted-foreground focus:ring-primary focus:ring-2"
              />
              <label htmlFor="one-way" className="text-sm font-medium text-foreground cursor-pointer">
                One-way
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="multi-city"
                name="tripType"
                value="Multi-city"
                checked={tripType === "Multi-city"}
                onChange={(e) => setTripType(e.target.value)}
                className="w-4 h-4 text-primary border-2 border-muted-foreground focus:ring-primary focus:ring-2"
              />
              <label htmlFor="multi-city" className="text-sm font-medium text-foreground cursor-pointer">
                Multi-city
              </label>
            </div>
          </div>

          <Select value={bags} onValueChange={setBags}>
            <SelectTrigger className="w-24 bg-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0 bags">0 bags</SelectItem>
              <SelectItem value="1 bag">1 bag</SelectItem>
              <SelectItem value="2 bags">2 bags</SelectItem>
              <SelectItem value="3+ bags">3+ bags</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Compact horizontal search bar */}
        <div className="bg-background rounded-lg shadow-soft border border-border flex items-center overflow-hidden">
          {/* From */}
          <div className={`flex-1 px-4 py-3 border-r border-border transition-colors duration-200 ${
            activeField === 'from' ? 'bg-primary/5' : 'hover:bg-muted/50'
          }`}>
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-muted-foreground" />
              <div className="flex-1">
                <label className="text-xs text-muted-foreground block mb-1">Departing from?</label>
                <Popover 
                  open={airportSearch.from.open} 
                  onOpenChange={(open) => setAirportSearch(prev => ({ ...prev, from: { ...prev.from, open } }))}
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      className="w-full justify-start p-0 h-auto font-medium bg-transparent hover:bg-transparent text-left"
                      onClick={() => setActiveField('from')}
                    >
                      {fromLocation || "City or airport"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-0" side="bottom" align="start">
                    <Command>
                      <CommandInput 
                        placeholder="Enter city or airport code..." 
                        onValueChange={(value) => {
                          setFromLocation(value);
                          searchAirports(value, 'from');
                        }}
                      />
                      <CommandList>
                        <CommandEmpty>
                          {airportSearch.from.loading ? "Searching..." : "No airports found."}
                        </CommandEmpty>
                        <CommandGroup>
                          {airportSearch.from.results.map((airport) => (
                            <CommandItem
                              key={airport.id}
                              onSelect={() => handleAirportSelect(airport, 'from')}
                            >
                              <div>
                                <div className="font-medium">{airport.city_name} ({airport.iata_code})</div>
                                <div className="text-sm text-muted-foreground">{airport.name}</div>
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>

          {/* Swap button */}
          <div className="px-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 rounded-full hover:bg-primary/10"
              onClick={handleSwapLocations}
            >
              <ArrowLeftRight className="w-4 h-4 text-primary" />
            </Button>
          </div>

          {/* To */}
          <div className={`flex-1 px-4 py-3 border-r border-border transition-colors duration-200 ${
            activeField === 'to' ? 'bg-primary/5' : 'hover:bg-muted/50'
          }`}>
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-muted-foreground" />
              <div className="flex-1">
                <label className="text-xs text-muted-foreground block mb-1">Going to?</label>
                <Popover 
                  open={airportSearch.to.open} 
                  onOpenChange={(open) => setAirportSearch(prev => ({ ...prev, to: { ...prev.to, open } }))}
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      className="w-full justify-start p-0 h-auto font-medium bg-transparent hover:bg-transparent text-left"
                      onClick={() => setActiveField('to')}
                    >
                      {toLocation || "City or airport"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-0" side="bottom" align="start">
                    <Command>
                      <CommandInput 
                        placeholder="Enter city or airport code..." 
                        onValueChange={(value) => {
                          setToLocation(value);
                          searchAirports(value, 'to');
                        }}
                      />
                      <CommandList>
                        <CommandEmpty>
                          {airportSearch.to.loading ? "Searching..." : "No airports found."}
                        </CommandEmpty>
                        <CommandGroup>
                          {airportSearch.to.results.map((airport) => (
                            <CommandItem
                              key={airport.id}
                              onSelect={() => handleAirportSelect(airport, 'to')}
                            >
                              <div>
                                <div className="font-medium">{airport.city_name} ({airport.iata_code})</div>
                                <div className="text-sm text-muted-foreground">{airport.name}</div>
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>

          {/* Departure Date */}
          <div className="px-4 py-3 border-r border-border min-w-0">
            <label className="text-xs text-muted-foreground block mb-1">Departure</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" className="p-0 h-auto font-medium bg-transparent hover:bg-transparent flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4" />
                  {departureDate ? format(departureDate, "MMM dd") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={departureDate}
                  onSelect={setDepartureDate}
                  disabled={(date) => date < new Date()}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Return Date (if round-trip) */}
          {tripType === 'Round-trip' && (
            <div className="px-4 py-3 border-r border-border min-w-0">
              <label className="text-xs text-muted-foreground block mb-1">Return</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" className="p-0 h-auto font-medium bg-transparent hover:bg-transparent flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4" />
                    {returnDate ? format(returnDate, "MMM dd") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={returnDate}
                    onSelect={setReturnDate}
                    disabled={(date) => date < (departureDate || new Date())}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}

          {/* Travelers */}
          <div className="px-4 py-3 border-r border-border min-w-0">
            <Select value={passengers} onValueChange={setPassengers}>
              <SelectTrigger className="border-0 p-0 h-auto bg-transparent focus:ring-0">
                <SelectValue className="text-sm font-medium" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1 adult, Economy">1 adult, Economy</SelectItem>
                <SelectItem value="2 adults, Economy">2 adults, Economy</SelectItem>
                <SelectItem value="1 adult, Business">1 adult, Business</SelectItem>
                <SelectItem value="2 adults, Business">2 adults, Business</SelectItem>
                <SelectItem value="Family (4), Economy">Family (4), Economy</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Search Button */}
          <div className="px-2">
            <Button 
              onClick={handleSearch}
              disabled={!fromAirport || !toAirport || !departureDate || (tripType === 'Round-trip' && !returnDate)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground h-12 w-12 rounded-lg transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
            >
              <Search className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightSearchBar;