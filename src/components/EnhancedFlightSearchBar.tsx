import { useState, useEffect } from "react";
import { Calendar, MapPin, Users, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import EnhancedAirportSelector from "./EnhancedAirportSelector";
import PriceCalendar from "./PriceCalendar";
import { DuffelAirport } from "@/lib/duffel";
import { format } from "date-fns";
import { flightSearchSchema } from "@/lib/validation";
import { useToast } from "@/hooks/use-toast";

interface PassengerCount {
  adults: number;
  children: number;
  infants: number;
}

interface SearchData {
  origin: DuffelAirport[];
  destination: DuffelAirport[];
  departureDate: Date | undefined;
  returnDate: Date | undefined;
  passengers: PassengerCount;
  tripType: 'round-trip' | 'one-way';
  cabinClass: 'economy' | 'premium_economy' | 'business' | 'first';
  directFlightsOnly: boolean;
}

interface EnhancedFlightSearchBarProps {
  onSearch: (data: SearchData) => void;
  loading?: boolean;
  defaultOrigin?: string;
  defaultDestination?: string;
  defaultTripType?: string;
  defaultPassengers?: string;
}

export default function EnhancedFlightSearchBar({ 
  onSearch, 
  loading, 
  defaultOrigin, 
  defaultDestination, 
  defaultTripType, 
  defaultPassengers 
}: EnhancedFlightSearchBarProps) {
  const [searchData, setSearchData] = useState<SearchData>({
    origin: [],
    destination: [],
    departureDate: undefined,
    returnDate: undefined,
    passengers: { adults: 1, children: 0, infants: 0 },
    tripType: 'round-trip',
    cabinClass: 'economy',
    directFlightsOnly: false
  });

  // Effect to handle defaultDestination if provided
  useEffect(() => {
    if (defaultDestination) {
      // Just use the destination name in the placeholder - user will search for airports
      // We'll show it in the UI as a helpful hint
    }
  }, [defaultDestination]);

  const [showPriceCalendar, setShowPriceCalendar] = useState(false);

  const updatePassengers = (type: keyof PassengerCount, value: number) => {
    setSearchData(prev => ({
      ...prev,
      passengers: { ...prev.passengers, [type]: Math.max(0, value) }
    }));
  };

  const totalPassengers = searchData.passengers.adults + searchData.passengers.children + searchData.passengers.infants;

  const { toast } = useToast();

  const handleSearch = () => {
    try {
      // Basic validation before schema validation
      if (!searchData.origin.length || !searchData.destination.length || !searchData.departureDate) {
        toast({
          title: "Missing required fields",
          description: "Please fill in all required search criteria.",
          variant: "destructive",
        });
        return;
      }

      // Additional business logic validation
      if (searchData.tripType === 'round-trip' && !searchData.returnDate) {
        toast({
          title: "Return date required",
          description: "Please select a return date for round-trip flights.",
          variant: "destructive",
        });
        return;
      }

      const totalPassengers = searchData.passengers.adults + searchData.passengers.children + searchData.passengers.infants;
      if (totalPassengers > 9) {
        toast({
          title: "Too many passengers",
          description: "Maximum 9 passengers allowed per booking.",
          variant: "destructive",
        });
        return;
      }

      // Validate search data with schema (relaxed)
      const validationResult = flightSearchSchema.safeParse(searchData);
      if (!validationResult.success) {
        toast({
          title: "Invalid search data",
          description: validationResult.error.issues[0]?.message || "Please check your search criteria.",
          variant: "destructive",
        });
        return;
      }

      onSearch(searchData);
    } catch (error: any) {
      toast({
        title: "Search error",
        description: "An error occurred while processing your search.",
        variant: "destructive",
      });
    }
  };

  const isSearchValid = searchData.origin.length > 0 && 
                       searchData.destination.length > 0 && 
                       searchData.departureDate &&
                       (searchData.tripType === 'one-way' || searchData.returnDate);

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          {/* Trip Type Selection */}
          <div className="flex gap-4 mb-6">
            <Button
              variant={searchData.tripType === 'round-trip' ? 'default' : 'outline'}
              onClick={() => setSearchData(prev => ({ ...prev, tripType: 'round-trip' }))}
            >
              Round trip
            </Button>
            <Button
              variant={searchData.tripType === 'one-way' ? 'default' : 'outline'}
              onClick={() => setSearchData(prev => ({ ...prev, tripType: 'one-way' }))}
            >
              One way
            </Button>
          </div>

          {/* Main Search Fields */}
          <div className="grid lg:grid-cols-2 gap-6 mb-4">
            {/* Origin */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                From
              </label>
              <EnhancedAirportSelector
                placeholder="Select departure airport(s)"
                value={searchData.origin}
                onChange={(airports) => setSearchData(prev => ({ ...prev, origin: airports }))}
              />
            </div>

            {/* Destination */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                To
              </label>
              <EnhancedAirportSelector
                placeholder={defaultDestination ? `Search airports near ${defaultDestination}` : "Select destination airport(s)"}
                value={searchData.destination}
                onChange={(airports) => setSearchData(prev => ({ ...prev, destination: airports }))}
              />
            </div>
          </div>

          {/* Date and Passenger Selection */}
          <div className="grid lg:grid-cols-4 gap-4 mb-4">
            {/* Departure Date */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Departure</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    <Calendar className="mr-2 h-4 w-4" />
                    {searchData.departureDate ? format(searchData.departureDate, 'MMM dd') : 'Select date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={searchData.departureDate}
                    onSelect={(date) => setSearchData(prev => ({ ...prev, departureDate: date }))}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Return Date */}
            {searchData.tripType === 'round-trip' && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Return</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                      <Calendar className="mr-2 h-4 w-4" />
                      {searchData.returnDate ? format(searchData.returnDate, 'MMM dd') : 'Select date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={searchData.returnDate}
                      onSelect={(date) => setSearchData(prev => ({ ...prev, returnDate: date }))}
                      disabled={(date) => date < (searchData.departureDate || new Date())}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            )}

            {/* Passengers */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Passengers</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="mr-2 h-4 w-4" />
                    {totalPassengers} passenger{totalPassengers !== 1 ? 's' : ''}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="space-y-4">
                    {/* Adults */}
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Adults</div>
                        <div className="text-sm text-muted-foreground">Age 18+</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updatePassengers('adults', searchData.passengers.adults - 1)}
                          disabled={searchData.passengers.adults <= 1}
                        >
                          -
                        </Button>
                        <span className="w-8 text-center">{searchData.passengers.adults}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updatePassengers('adults', searchData.passengers.adults + 1)}
                        >
                          +
                        </Button>
                      </div>
                    </div>
                    
                    {/* Children */}
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Children</div>
                        <div className="text-sm text-muted-foreground">Age 2-17</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updatePassengers('children', searchData.passengers.children - 1)}
                          disabled={searchData.passengers.children <= 0}
                        >
                          -
                        </Button>
                        <span className="w-8 text-center">{searchData.passengers.children}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updatePassengers('children', searchData.passengers.children + 1)}
                        >
                          +
                        </Button>
                      </div>
                    </div>

                    {/* Infants */}
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Infants</div>
                        <div className="text-sm text-muted-foreground">Under 2</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updatePassengers('infants', searchData.passengers.infants - 1)}
                          disabled={searchData.passengers.infants <= 0}
                        >
                          -
                        </Button>
                        <span className="w-8 text-center">{searchData.passengers.infants}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updatePassengers('infants', searchData.passengers.infants + 1)}
                        >
                          +
                        </Button>
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            {/* Cabin Class */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Class</label>
              <Select 
                value={searchData.cabinClass}
                onValueChange={(value: any) => setSearchData(prev => ({ ...prev, cabinClass: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="economy">Economy</SelectItem>
                  <SelectItem value="premium_economy">Premium Economy</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="first">First Class</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Options */}
          <div className="flex items-center gap-6 mb-6">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="direct"
                checked={searchData.directFlightsOnly}
                onCheckedChange={(checked) => setSearchData(prev => ({ ...prev, directFlightsOnly: checked as boolean }))}
              />
              <label htmlFor="direct" className="text-sm">Direct flights only</label>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPriceCalendar(!showPriceCalendar)}
              className="ml-auto"
            >
              <Calendar className="mr-2 h-4 w-4" />
              {showPriceCalendar ? 'Hide' : 'Show'} Price Calendar
            </Button>
          </div>

          {/* Search Button */}
          <Button 
            onClick={handleSearch}
            disabled={!isSearchValid || loading}
            className="w-full"
            size="lg"
          >
            {loading ? 'Searching...' : 'Search Flights'}
          </Button>
        </CardContent>
      </Card>

      {/* Price Calendar */}
      {showPriceCalendar && (
        <PriceCalendar
          origin={searchData.origin}
          destination={searchData.destination}
          onDateSelect={(date) => setSearchData(prev => ({ ...prev, departureDate: date }))}
        />
      )}
    </div>
  );
}