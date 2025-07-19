import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Calendar as CalendarIcon, Users, Search, ArrowLeftRight } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface PackageSearchData {
  tripType: "roundtrip" | "multicity";
  origin: string;
  destination: string;
  departureDate: Date | null;
  returnDate: Date | null;
  travelers: {
    adults: number;
    children: number;
    rooms: number;
  };
  duration: string;
  packageType: string;
}

interface PackageSearchBarProps {
  onSearch?: (searchData: PackageSearchData) => void;
  loading?: boolean;
  initialData?: Partial<PackageSearchData>;
  compact?: boolean;
}

const PackageSearchBar = ({ onSearch, loading = false, initialData, compact = false }: PackageSearchBarProps) => {
  const [searchData, setSearchData] = useState<PackageSearchData>({
    tripType: initialData?.tripType || "roundtrip",
    origin: initialData?.origin || "",
    destination: initialData?.destination || "",
    departureDate: initialData?.departureDate || null,
    returnDate: initialData?.returnDate || null,
    travelers: initialData?.travelers || {
      adults: 2,
      children: 0,
      rooms: 1
    },
    duration: initialData?.duration || "any",
    packageType: initialData?.packageType || "flight-hotel"
  });

  const handleSearch = () => {
    if (onSearch) {
      onSearch(searchData);
    }
  };

  const updateTravelers = (type: keyof typeof searchData.travelers, value: number) => {
    setSearchData(prev => ({
      ...prev,
      travelers: {
        ...prev.travelers,
        [type]: Math.max(type === 'rooms' ? 1 : 0, value)
      }
    }));
  };

  const getTravelerSummary = () => {
    const { adults, children, rooms } = searchData.travelers;
    const totalTravelers = adults + children;
    return `${totalTravelers} traveler${totalTravelers > 1 ? 's' : ''}, ${rooms} room${rooms > 1 ? 's' : ''}`;
  };

  const swapLocations = () => {
    setSearchData(prev => ({
      ...prev,
      origin: prev.destination,
      destination: prev.origin
    }));
  };

  if (compact) {
    return (
      <div className="bg-white border-b border-gray-200 py-4 sticky top-16 z-40">
        <div className="container mx-auto px-4">
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
                <div className="md:col-span-2">
                  <Label className="text-sm font-medium mb-2 block">From</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Origin city"
                      value={searchData.origin}
                      onChange={(e) => setSearchData(prev => ({ ...prev, origin: e.target.value }))}
                      className="w-full py-3 px-4 pl-10 h-12 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <Label className="text-sm font-medium mb-2 block">To</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Destination city"
                      value={searchData.destination}
                      onChange={(e) => setSearchData(prev => ({ ...prev, destination: e.target.value }))}
                      className="w-full py-3 px-4 pl-10 h-12 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium mb-2 block">Departure</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal h-12 py-3 px-4 rounded-lg",
                          !searchData.departureDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {searchData.departureDate ? format(searchData.departureDate, "MMM dd") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={searchData.departureDate || undefined}
                        onSelect={(date) => setSearchData(prev => ({ ...prev, departureDate: date || null }))}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <Button 
                    onClick={handleSearch}
                    disabled={loading}
                    className="w-full"
                    size="lg"
                  >
                    <Search className="w-4 h-4 mr-2" />
                    {loading ? "Searching..." : "Search Packages"}
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
    <Card className="w-full max-w-6xl mx-auto">
      <CardContent className="p-6">
        <Tabs value={searchData.tripType} onValueChange={(value: any) => setSearchData(prev => ({ ...prev, tripType: value }))}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="roundtrip">Flight + Hotel</TabsTrigger>
            <TabsTrigger value="multicity">Multi-City Packages</TabsTrigger>
          </TabsList>
          
          <TabsContent value="roundtrip" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
              {/* Origin */}
              <div className="lg:col-span-3">
                <Label className="text-sm font-medium mb-2 block">From</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Origin city"
                    value={searchData.origin}
                    onChange={(e) => setSearchData(prev => ({ ...prev, origin: e.target.value }))}
                    className="w-full py-3 px-4 pl-10 h-12 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Swap Button */}
              <div className="lg:col-span-1 flex justify-center">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={swapLocations}
                  className="rounded-full h-12 w-12"
                >
                  <ArrowLeftRight className="h-4 w-4" />
                </Button>
              </div>

              {/* Destination */}
              <div className="lg:col-span-3">
                <Label className="text-sm font-medium mb-2 block">To</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Destination city"
                    value={searchData.destination}
                    onChange={(e) => setSearchData(prev => ({ ...prev, destination: e.target.value }))}
                    className="w-full py-3 px-4 pl-10 h-12 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Departure Date */}
              <div className="lg:col-span-2">
                <Label className="text-sm font-medium mb-2 block">Departure</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal h-12 py-3 px-4 rounded-lg",
                        !searchData.departureDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {searchData.departureDate ? format(searchData.departureDate, "MMM dd") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={searchData.departureDate || undefined}
                      onSelect={(date) => setSearchData(prev => ({ ...prev, departureDate: date || null }))}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Return Date */}
              <div className="lg:col-span-2">
                <Label className="text-sm font-medium mb-2 block">Return</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal h-12 py-3 px-4 rounded-lg",
                        !searchData.returnDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {searchData.returnDate ? format(searchData.returnDate, "MMM dd") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={searchData.returnDate || undefined}
                      onSelect={(date) => setSearchData(prev => ({ ...prev, returnDate: date || null }))}
                      disabled={(date) => date < new Date() || (searchData.departureDate && date <= searchData.departureDate)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Search Button */}
              <div className="lg:col-span-1">
                <Button 
                  onClick={handleSearch}
                  disabled={loading}
                  className="w-full"
                  size="lg"
                >
                  <Search className="w-4 h-4 mr-2" />
                  {loading ? "Searching..." : "Search"}
                </Button>
              </div>
            </div>

            {/* Additional Options */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div>
                  <Label className="text-sm font-medium mb-2 block">Travelers & Rooms</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal h-12 py-3 px-4 rounded-lg"
                      >
                        <Users className="mr-3 h-4 w-4 flex-shrink-0" />
                        <span className="truncate">{getTravelerSummary()}</span>
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
                              onClick={() => updateTravelers('adults', searchData.travelers.adults - 1)}
                              disabled={searchData.travelers.adults <= 1}
                            >
                              -
                            </Button>
                            <span className="w-8 text-center">{searchData.travelers.adults}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateTravelers('adults', searchData.travelers.adults + 1)}
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
                              onClick={() => updateTravelers('children', searchData.travelers.children - 1)}
                              disabled={searchData.travelers.children <= 0}
                            >
                              -
                            </Button>
                            <span className="w-8 text-center">{searchData.travelers.children}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateTravelers('children', searchData.travelers.children + 1)}
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
                              onClick={() => updateTravelers('rooms', searchData.travelers.rooms - 1)}
                              disabled={searchData.travelers.rooms <= 1}
                            >
                              -
                            </Button>
                            <span className="w-8 text-center">{searchData.travelers.rooms}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateTravelers('rooms', searchData.travelers.rooms + 1)}
                            >
                              +
                            </Button>
                          </div>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <Label className="text-sm font-medium mb-2 block">Trip Duration</Label>
                  <Select value={searchData.duration} onValueChange={(value) => setSearchData(prev => ({ ...prev, duration: value }))}>
                    <SelectTrigger className="h-12 py-3 px-4 rounded-lg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any Duration</SelectItem>
                      <SelectItem value="weekend">Weekend (2-3 nights)</SelectItem>
                      <SelectItem value="short">Short Trip (4-6 nights)</SelectItem>
                      <SelectItem value="week">1 Week (7-9 nights)</SelectItem>
                      <SelectItem value="extended">Extended (10+ nights)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium mb-2 block">Package Type</Label>
                  <Select value={searchData.packageType} onValueChange={(value) => setSearchData(prev => ({ ...prev, packageType: value }))}>
                    <SelectTrigger className="h-12 py-3 px-4 rounded-lg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="flight-hotel">Flight + Hotel</SelectItem>
                      <SelectItem value="flight-hotel-car">Flight + Hotel + Car</SelectItem>
                      <SelectItem value="all-inclusive">All-Inclusive Resort</SelectItem>
                      <SelectItem value="cruise">Cruise Package</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
            </div>
          </TabsContent>
          
          <TabsContent value="multicity" className="space-y-4">
            <div className="text-center py-8">
              <h3 className="text-lg font-semibold mb-2">Multi-City Packages</h3>
              <p className="text-muted-foreground mb-4">Plan your multi-destination adventure</p>
              <Button variant="outline">Coming Soon</Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PackageSearchBar;