import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Calendar as CalendarIcon, Users, Search, Clock } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface ExperienceSearchData {
  location: string;
  date: Date | null;
  groupSize: number;
  category: string;
  duration: string;
  timeOfDay: string;
}

interface ExperienceSearchBarProps {
  onSearch?: (searchData: ExperienceSearchData) => void;
  loading?: boolean;
  initialData?: Partial<ExperienceSearchData>;
  compact?: boolean;
}

const ExperienceSearchBar = ({ onSearch, loading = false, initialData, compact = false }: ExperienceSearchBarProps) => {
  const [searchData, setSearchData] = useState<ExperienceSearchData>({
    location: initialData?.location || "",
    date: initialData?.date || null,
    groupSize: initialData?.groupSize || 2,
    category: initialData?.category || "any",
    duration: initialData?.duration || "any",
    timeOfDay: initialData?.timeOfDay || "any"
  });

  const handleSearch = () => {
    if (onSearch) {
      onSearch(searchData);
    } else {
      // Default search behavior - navigate to results
      const params = new URLSearchParams();
      if (searchData.location) params.set('location', searchData.location);
      if (searchData.date) params.set('date', searchData.date.toISOString());
      if (searchData.groupSize) params.set('groupSize', searchData.groupSize.toString());
      if (searchData.category && searchData.category !== 'any') params.set('category', searchData.category);
      
      window.location.href = `/experiences/results?${params.toString()}`;
    }
  };

  if (compact) {
    return (
      <div className="bg-white border-b border-gray-200 py-4 sticky top-16 z-40">
        <div className="container mx-auto px-4">
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                <div className="md:col-span-2">
                  <Label className="text-sm font-medium mb-2 block">Location</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Where do you want to explore?"
                      value={searchData.location}
                      onChange={(e) => setSearchData(prev => ({ ...prev, location: e.target.value }))}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium mb-2 block">Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !searchData.date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {searchData.date ? format(searchData.date, "MMM dd") : "Any date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={searchData.date || undefined}
                        onSelect={(date) => setSearchData(prev => ({ ...prev, date: date || null }))}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <Label className="text-sm font-medium mb-2 block">Group Size</Label>
                  <Select value={searchData.groupSize.toString()} onValueChange={(value) => setSearchData(prev => ({ ...prev, groupSize: parseInt(value) }))}>
                    <SelectTrigger>
                      <Users className="mr-2 h-4 w-4" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((size) => (
                        <SelectItem key={size} value={size.toString()}>
                          {size} {size === 1 ? 'person' : 'people'}
                        </SelectItem>
                      ))}
                      <SelectItem value="11">10+ people</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
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
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
          {/* Location */}
          <div className="lg:col-span-4">
            <Label className="text-sm font-medium mb-2 block">Where</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="City, attraction, or activity"
                value={searchData.location}
                onChange={(e) => setSearchData(prev => ({ ...prev, location: e.target.value }))}
                className="pl-10"
              />
            </div>
          </div>

          {/* Date */}
          <div className="lg:col-span-2">
            <Label className="text-sm font-medium mb-2 block">When</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !searchData.date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {searchData.date ? format(searchData.date, "MMM dd") : "Any date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={searchData.date || undefined}
                  onSelect={(date) => setSearchData(prev => ({ ...prev, date: date || null }))}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Group Size */}
          <div className="lg:col-span-2">
            <Label className="text-sm font-medium mb-2 block">Group Size</Label>
            <Select value={searchData.groupSize.toString()} onValueChange={(value) => setSearchData(prev => ({ ...prev, groupSize: parseInt(value) }))}>
              <SelectTrigger>
                <Users className="mr-2 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((size) => (
                  <SelectItem key={size} value={size.toString()}>
                    {size} {size === 1 ? 'person' : 'people'}
                  </SelectItem>
                ))}
                <SelectItem value="11">10+ people</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Category */}
          <div className="lg:col-span-2">
            <Label className="text-sm font-medium mb-2 block">Category</Label>
            <Select value={searchData.category} onValueChange={(value) => setSearchData(prev => ({ ...prev, category: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">All Categories</SelectItem>
                <SelectItem value="tours">Tours & Sightseeing</SelectItem>
                <SelectItem value="adventure">Adventure & Outdoor</SelectItem>
                <SelectItem value="cultural">Cultural Experiences</SelectItem>
                <SelectItem value="food">Food & Drink</SelectItem>
                <SelectItem value="entertainment">Entertainment</SelectItem>
                <SelectItem value="workshops">Classes & Workshops</SelectItem>
                <SelectItem value="nature">Nature & Wildlife</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Search Button */}
          <div className="lg:col-span-2">
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

        {/* Additional Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <Label className="text-sm font-medium mb-2 block">Duration</Label>
            <Select value={searchData.duration} onValueChange={(value) => setSearchData(prev => ({ ...prev, duration: value }))}>
              <SelectTrigger>
                <Clock className="mr-2 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any Duration</SelectItem>
                <SelectItem value="short">Up to 2 hours</SelectItem>
                <SelectItem value="half-day">Half Day (2-4 hours)</SelectItem>
                <SelectItem value="full-day">Full Day (4-8 hours)</SelectItem>
                <SelectItem value="multi-day">Multi-day</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm font-medium mb-2 block">Time of Day</Label>
            <Select value={searchData.timeOfDay} onValueChange={(value) => setSearchData(prev => ({ ...prev, timeOfDay: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any Time</SelectItem>
                <SelectItem value="morning">Morning</SelectItem>
                <SelectItem value="afternoon">Afternoon</SelectItem>
                <SelectItem value="evening">Evening</SelectItem>
                <SelectItem value="night">Night</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExperienceSearchBar;