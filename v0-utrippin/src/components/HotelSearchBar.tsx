import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Calendar as CalendarIcon, Users, Search } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface HotelSearchData {
  destination: string;
  checkInDate: Date | null;
  checkOutDate: Date | null;
  guests: {
    adults: number;
    children: number;
    rooms: number;
  };
}

interface HotelSearchBarProps {
  onSearch?: (searchData: HotelSearchData) => void;
  loading?: boolean;
  initialData?: Partial<HotelSearchData>;
  compact?: boolean;
}

const HotelSearchBar = ({ onSearch, loading = false, initialData, compact = false }: HotelSearchBarProps) => {
  const [searchData, setSearchData] = useState<HotelSearchData>({
    destination: initialData?.destination || "",
    checkInDate: initialData?.checkInDate || null,
    checkOutDate: initialData?.checkOutDate || null,
    guests: initialData?.guests || {
      adults: 2,
      children: 0,
      rooms: 1
    }
  });

  const handleSearch = () => {
    if (!searchData.destination || !searchData.checkInDate || !searchData.checkOutDate) {
      console.warn('Missing required fields for hotel search');
      return;
    }
    
    if (onSearch) {
      onSearch(searchData);
    } else {
      // Default navigation to hotel results
      const params = new URLSearchParams({
        destination: searchData.destination,
        checkin: searchData.checkInDate.toISOString().split('T')[0],
        checkout: searchData.checkOutDate.toISOString().split('T')[0],
        adults: searchData.guests.adults.toString(),
        children: searchData.guests.children.toString(),
        rooms: searchData.guests.rooms.toString()
      });
      
      window.location.href = `/hotel-results?${params.toString()}`;
    }
  };

  const updateGuests = (type: keyof typeof searchData.guests, value: number) => {
    setSearchData(prev => ({
      ...prev,
      guests: {
        ...prev.guests,
        [type]: Math.max(type === 'rooms' ? 1 : 0, value)
      }
    }));
  };

  const getGuestSummary = () => {
    const { adults, children, rooms } = searchData.guests;
    const totalGuests = adults + children;
    return `${totalGuests} guest${totalGuests > 1 ? 's' : ''}, ${rooms} room${rooms > 1 ? 's' : ''}`;
  };

  if (compact) {
    return (
      <div className="bg-white border-b border-gray-200 py-4 sticky top-16 z-40">
        <div className="container mx-auto px-4">
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                <div className="md:col-span-2">
                  <Label className="text-sm font-medium mb-2 block">Destination</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="City, hotel, or landmark"
                      value={searchData.destination}
                      onChange={(e) => setSearchData(prev => ({ ...prev, destination: e.target.value }))}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium mb-2 block">Check-in</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !searchData.checkInDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {searchData.checkInDate ? format(searchData.checkInDate, "MMM dd") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={searchData.checkInDate || undefined}
                        onSelect={(date) => setSearchData(prev => ({ ...prev, checkInDate: date || null }))}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <Label className="text-sm font-medium mb-2 block">Check-out</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !searchData.checkOutDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {searchData.checkOutDate ? format(searchData.checkOutDate, "MMM dd") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={searchData.checkOutDate || undefined}
                        onSelect={(date) => setSearchData(prev => ({ ...prev, checkOutDate: date || null }))}
                        disabled={(date) => date < new Date() || (searchData.checkInDate && date <= searchData.checkInDate)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <Button 
                    onClick={handleSearch}
                    disabled={loading}
                    className="w-full h-12 min-w-[140px]"
                    size="lg"
                  >
                    <Search className="w-4 h-4 mr-2" />
                    {loading ? "Searching..." : "Search Hotels"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <Card className="w-full max-w-7xl mx-auto shadow-lg">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
          {/* Destination */}
          <div className="lg:col-span-4">
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Where to?"
                value={searchData.destination}
                onChange={(e) => setSearchData(prev => ({ ...prev, destination: e.target.value }))}
                className="pl-10 h-16 text-base border-0 bg-muted/30 rounded-xl focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Combined Dates */}
          <div className="lg:col-span-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full h-16 justify-start text-left font-normal border-0 bg-muted/30 rounded-xl focus:ring-2 focus:ring-primary"
                >
                  <CalendarIcon className="mr-3 h-5 w-5 text-muted-foreground flex-shrink-0" />
                  <div className="flex flex-col items-start min-w-0 flex-1">
                    <span className="text-xs text-muted-foreground mb-1">Dates</span>
                    {searchData.checkInDate && searchData.checkOutDate ? (
                      <span className="text-sm font-medium truncate w-full">
                        {format(searchData.checkInDate, "MMM dd")} - {format(searchData.checkOutDate, "MMM dd, yyyy")}
                      </span>
                    ) : (
                      <span className="text-sm text-muted-foreground">Select dates</span>
                    )}
                  </div>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <div className="p-3">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Check-in</label>
                      <Calendar
                        mode="single"
                        selected={searchData.checkInDate || undefined}
                        onSelect={(date) => setSearchData(prev => ({ ...prev, checkInDate: date || null }))}
                        disabled={(date) => date < new Date()}
                        className="pointer-events-auto"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Check-out</label>
                      <Calendar
                        mode="single"
                        selected={searchData.checkOutDate || undefined}
                        onSelect={(date) => setSearchData(prev => ({ ...prev, checkOutDate: date || null }))}
                        disabled={(date) => date < new Date() || (searchData.checkInDate && date <= searchData.checkInDate)}
                        className="pointer-events-auto"
                      />
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* Travelers */}
          <div className="lg:col-span-3">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full h-16 justify-start text-left font-normal border-0 bg-muted/30 rounded-xl focus:ring-2 focus:ring-primary"
                >
                  <Users className="mr-3 h-5 w-5 text-muted-foreground flex-shrink-0" />
                  <div className="flex flex-col items-start min-w-0 flex-1">
                    <span className="text-xs text-muted-foreground mb-1">Travelers</span>
                    <span className="text-sm font-medium truncate w-full">{getGuestSummary()}</span>
                  </div>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80" align="start">
                <div className="space-y-4 p-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Adults</span>
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateGuests('adults', searchData.guests.adults - 1)}
                        disabled={searchData.guests.adults <= 1}
                      >
                        -
                      </Button>
                      <span className="w-8 text-center">{searchData.guests.adults}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateGuests('adults', searchData.guests.adults + 1)}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Children</span>
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateGuests('children', searchData.guests.children - 1)}
                        disabled={searchData.guests.children <= 0}
                      >
                        -
                      </Button>
                      <span className="w-8 text-center">{searchData.guests.children}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateGuests('children', searchData.guests.children + 1)}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Rooms</span>
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateGuests('rooms', searchData.guests.rooms - 1)}
                        disabled={searchData.guests.rooms <= 1}
                      >
                        -
                      </Button>
                      <span className="w-8 text-center">{searchData.guests.rooms}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateGuests('rooms', searchData.guests.rooms + 1)}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* Search Button */}
          <div className="lg:col-span-1">
            <Button 
              onClick={handleSearch}
              disabled={loading}
              className="w-full h-16 rounded-xl bg-primary hover:bg-primary-hover text-white font-semibold text-base px-8"
              size="lg"
            >
              <Search className="w-5 h-5 mr-2" />
              {loading ? "Searching..." : "Search"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HotelSearchBar;
