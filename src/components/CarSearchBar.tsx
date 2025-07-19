import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Calendar as CalendarIcon, Clock, Search } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface CarSearchData {
  pickupLocation: string;
  dropoffLocation: string;
  pickupDate: Date | null;
  dropoffDate: Date | null;
  pickupTime: string;
  dropoffTime: string;
  driverAge: string;
}

interface CarSearchBarProps {
  onSearch?: (searchData: CarSearchData) => void;
  loading?: boolean;
  initialData?: Partial<CarSearchData>;
  compact?: boolean;
}

const CarSearchBar = ({ onSearch, loading = false, initialData, compact = false }: CarSearchBarProps) => {
  const [searchData, setSearchData] = useState<CarSearchData>({
    pickupLocation: initialData?.pickupLocation || "",
    dropoffLocation: initialData?.dropoffLocation || "",
    pickupDate: initialData?.pickupDate || null,
    dropoffDate: initialData?.dropoffDate || null,
    pickupTime: initialData?.pickupTime || "10:00",
    dropoffTime: initialData?.dropoffTime || "10:00",
    driverAge: initialData?.driverAge || "25-69"
  });

  const handleSearch = () => {
    if (onSearch) {
      onSearch(searchData);
    }
  };

  const timeOptions = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, '0');
    return `${hour}:00`;
  });

  if (compact) {
    return (
      <div className="bg-white border-b border-gray-200 py-4 sticky top-16 z-40">
        <div className="container mx-auto px-4">
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
                <div className="md:col-span-2">
                  <Label className="text-sm font-medium mb-2 block">Pick-up Location</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Airport, city, or hotel"
                      value={searchData.pickupLocation}
                      onChange={(e) => setSearchData(prev => ({ ...prev, pickupLocation: e.target.value }))}
                      className="w-full py-3 px-4 pl-10 h-12 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <Label className="text-sm font-medium mb-2 block">Drop-off Location</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Same as pick-up"
                      value={searchData.dropoffLocation}
                      onChange={(e) => setSearchData(prev => ({ ...prev, dropoffLocation: e.target.value }))}
                      className="w-full py-3 px-4 pl-10 h-12 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium mb-2 block">Pick-up Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal h-12 py-3 px-4 rounded-lg",
                          !searchData.pickupDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {searchData.pickupDate ? format(searchData.pickupDate, "MMM dd") : <span className="hidden sm:inline">Select date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={searchData.pickupDate || undefined}
                        onSelect={(date) => setSearchData(prev => ({ ...prev, pickupDate: date || null }))}
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
                    {loading ? "Searching..." : "Search Cars"}
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
    <Card className="max-w-7xl mx-auto shadow-lg">
      <CardContent className="p-8">
        {/* Desktop Layout */}
        <div className="hidden lg:block">
          {/* Main Form Row */}
          <div className="grid grid-cols-5 gap-6 items-end">
            {/* Pick-up Location */}
            <div className="col-span-1">
              <Label className="text-sm font-medium mb-3 block text-foreground">Pick-up Location</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Airport, city, or hotel"
                  value={searchData.pickupLocation}
                  onChange={(e) => setSearchData(prev => ({ ...prev, pickupLocation: e.target.value }))}
                  className="w-full py-3 px-4 pl-10 h-12 rounded-xl border-2 focus:border-primary"
                />
              </div>
            </div>

            {/* Drop-off Location */}
            <div className="col-span-1">
              <Label className="text-sm font-medium mb-3 block text-foreground">Drop-off Location</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Same as pick-up"
                  value={searchData.dropoffLocation}
                  onChange={(e) => setSearchData(prev => ({ ...prev, dropoffLocation: e.target.value }))}
                  className="w-full py-3 px-4 pl-10 h-12 rounded-xl border-2 focus:border-primary"
                />
              </div>
            </div>

            {/* Pick-up Date */}
            <div className="col-span-1">
              <Label className="text-sm font-medium mb-3 block text-foreground">Pick-up Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal h-12 py-3 px-4 rounded-xl border-2 hover:border-primary",
                      !searchData.pickupDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {searchData.pickupDate ? format(searchData.pickupDate, "MMM dd") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={searchData.pickupDate || undefined}
                    onSelect={(date) => setSearchData(prev => ({ ...prev, pickupDate: date || null }))}
                    disabled={(date) => date < new Date()}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Drop-off Date */}
            <div className="col-span-1">
              <Label className="text-sm font-medium mb-3 block text-foreground">Drop-off Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal h-12 py-3 px-4 rounded-xl border-2 hover:border-primary",
                      !searchData.dropoffDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {searchData.dropoffDate ? format(searchData.dropoffDate, "MMM dd") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={searchData.dropoffDate || undefined}
                    onSelect={(date) => setSearchData(prev => ({ ...prev, dropoffDate: date || null }))}
                    disabled={(date) => date < new Date()}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Driver Age */}
            <div className="col-span-1">
              <Label className="text-sm font-medium mb-3 block text-foreground">Driver Age</Label>
              <Select value={searchData.driverAge} onValueChange={(value) => setSearchData(prev => ({ ...prev, driverAge: value }))}>
                <SelectTrigger className="h-12 py-3 px-4 rounded-xl border-2 hover:border-primary">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="18-24">18-24</SelectItem>
                  <SelectItem value="25-69">25-69</SelectItem>
                  <SelectItem value="70+">70+</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Time Selectors Row with Search Button */}
          <div className="grid grid-cols-5 gap-6 mt-6">
            <div></div> {/* Empty space for Pick-up Location column */}
            <div></div> {/* Empty space for Drop-off Location column */}
            
            {/* Pick-up Time */}
            <div>
              <Label className="text-xs text-muted-foreground mb-2 block">Pick-up Time</Label>
              <Select value={searchData.pickupTime} onValueChange={(value) => setSearchData(prev => ({ ...prev, pickupTime: value }))}>
                <SelectTrigger className="h-10 rounded-lg">
                  <Clock className="w-3 h-3 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timeOptions.map((time) => (
                    <SelectItem key={time} value={time}>{time}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Drop-off Time */}
            <div>
              <Label className="text-xs text-muted-foreground mb-2 block">Drop-off Time</Label>
              <Select value={searchData.dropoffTime} onValueChange={(value) => setSearchData(prev => ({ ...prev, dropoffTime: value }))}>
                <SelectTrigger className="h-10 rounded-lg">
                  <Clock className="w-3 h-3 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timeOptions.map((time) => (
                    <SelectItem key={time} value={time}>{time}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Search Button */}
            <div className="flex items-end">
              <Button 
                onClick={handleSearch}
                disabled={loading}
                className="w-full h-10 px-6 rounded-xl bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white font-medium"
              >
                <Search className="w-4 h-4 mr-2" />
                {loading ? "Searching..." : "Search"}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Layout - Keep existing mobile layout unchanged */}
        <div className="lg:hidden">
          <div className="grid grid-cols-1 gap-4 items-end">
            {/* Pick-up Location */}
            <div>
              <Label className="text-sm font-medium mb-2 block">Pick-up Location</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Airport, city, or hotel"
                  value={searchData.pickupLocation}
                  onChange={(e) => setSearchData(prev => ({ ...prev, pickupLocation: e.target.value }))}
                  className="w-full py-3 px-4 pl-10 h-12 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {/* Drop-off Location */}
            <div>
              <Label className="text-sm font-medium mb-2 block">Drop-off Location</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Same as pick-up"
                  value={searchData.dropoffLocation}
                  onChange={(e) => setSearchData(prev => ({ ...prev, dropoffLocation: e.target.value }))}
                  className="w-full py-3 px-4 pl-10 h-12 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {/* Pick-up Date */}
            <div>
              <Label className="text-sm font-medium mb-2 block">Pick-up Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal h-12 py-3 px-4 rounded-lg",
                      !searchData.pickupDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {searchData.pickupDate ? format(searchData.pickupDate, "MMM dd") : <span className="hidden sm:inline">Select date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={searchData.pickupDate || undefined}
                    onSelect={(date) => setSearchData(prev => ({ ...prev, pickupDate: date || null }))}
                    disabled={(date) => date < new Date()}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Drop-off Date */}
            <div>
              <Label className="text-sm font-medium mb-2 block">Drop-off Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal h-12 py-3 px-4 rounded-lg",
                      !searchData.dropoffDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {searchData.dropoffDate ? format(searchData.dropoffDate, "MMM dd") : <span className="hidden sm:inline">Select date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={searchData.dropoffDate || undefined}
                    onSelect={(date) => setSearchData(prev => ({ ...prev, dropoffDate: date || null }))}
                    disabled={(date) => date < new Date()}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Driver Age */}
            <div>
              <Label className="text-sm font-medium mb-2 block">Driver Age</Label>
              <Select value={searchData.driverAge} onValueChange={(value) => setSearchData(prev => ({ ...prev, driverAge: value }))}>
                <SelectTrigger className="h-12 py-3 px-4 rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="18-24">18-24</SelectItem>
                  <SelectItem value="25-69">25-69</SelectItem>
                  <SelectItem value="70+">70+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Search Button */}
            <div>
              <Button 
                onClick={handleSearch}
                disabled={loading}
                className="w-full"
                size="lg"
              >
                <Search className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">{loading ? "Searching..." : "Search"}</span>
                <span className="sm:hidden">{loading ? "..." : ""}</span>
              </Button>
            </div>
          </div>

          {/* Mobile Time Selectors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">Pick-up Time</Label>
              <Select value={searchData.pickupTime} onValueChange={(value) => setSearchData(prev => ({ ...prev, pickupTime: value }))}>
                <SelectTrigger className="h-8">
                  <Clock className="w-3 h-3 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timeOptions.map((time) => (
                    <SelectItem key={time} value={time}>{time}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">Drop-off Time</Label>
              <Select value={searchData.dropoffTime} onValueChange={(value) => setSearchData(prev => ({ ...prev, dropoffTime: value }))}>
                <SelectTrigger className="h-8">
                  <Clock className="w-3 h-3 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timeOptions.map((time) => (
                    <SelectItem key={time} value={time}>{time}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CarSearchBar;