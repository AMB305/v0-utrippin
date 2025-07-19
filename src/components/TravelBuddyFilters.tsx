import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Filter, X, MapPin, Users, Heart, DollarSign } from 'lucide-react';
import { format } from 'date-fns';
import { BrowseFilters } from '@/services/TravelBuddyService';
import { TripFilters } from '@/services/TripService';

interface TravelBuddyFiltersProps {
  onFiltersChange: (filters: BrowseFilters & TripFilters) => void;
  onLocationSuggestions?: (query: string) => Promise<string[]>;
  onDestinationSuggestions?: (query: string) => Promise<string[]>;
  className?: string;
}

const TRAVEL_STYLES = [
  'Adventure', 'Cultural', 'Relaxation', 'Food & Drink', 'Nightlife', 
  'Nature', 'Photography', 'Business', 'Backpacking', 'Luxury'
];

const TRIP_TYPES = [
  'City Break', 'Beach Holiday', 'Adventure Travel', 'Cultural Tour',
  'Food Tour', 'Wildlife Safari', 'Ski Trip', 'Road Trip', 'Backpacking'
];

const INTERESTS = [
  'Photography', 'Food', 'Art', 'Music', 'Sports', 'History', 'Nature',
  'Adventure', 'Culture', 'Technology', 'Fashion', 'Wellness'
];

const TravelBuddyFilters: React.FC<TravelBuddyFiltersProps> = ({
  onFiltersChange,
  onLocationSuggestions,
  onDestinationSuggestions,
  className = ''
}) => {
  const [filters, setFilters] = useState<BrowseFilters & TripFilters>({});
  const [isExpanded, setIsExpanded] = useState(false);
  const [locationSuggestions, setLocationSuggestions] = useState<string[]>([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  const updateFilters = (newFilters: Partial<BrowseFilters & TripFilters>) => {
    const updated = { ...filters, ...newFilters };
    setFilters(updated);
    onFiltersChange(updated);
  };

  const handleLocationSearch = async (query: string) => {
    if (query && onLocationSuggestions) {
      const suggestions = await onLocationSuggestions(query);
      setLocationSuggestions(suggestions);
    }
  };

  const handleDestinationSearch = async (query: string) => {
    if (query && onDestinationSuggestions) {
      const suggestions = await onDestinationSuggestions(query);
      setDestinationSuggestions(suggestions);
    }
  };

  const toggleInterest = (interest: string) => {
    const current = filters.interests || [];
    const updated = current.includes(interest)
      ? current.filter(i => i !== interest)
      : [...current, interest];
    updateFilters({ interests: updated });
  };

  const toggleTravelStyle = (style: string) => {
    const current = filters.travelStyle || [];
    const updated = current.includes(style)
      ? current.filter(s => s !== style)
      : [...current, style];
    updateFilters({ travelStyle: updated });
  };

  const toggleTripType = (type: string) => {
    const current = filters.tripType || [];
    const updated = current.includes(type)
      ? current.filter(t => t !== type)
      : [...current, type];
    updateFilters({ tripType: updated });
  };

  const clearFilters = () => {
    setFilters({});
    setStartDate(undefined);
    setEndDate(undefined);
    onFiltersChange({});
  };

  const activeFiltersCount = Object.keys(filters).filter(key => {
    const value = filters[key as keyof typeof filters];
    return value && (Array.isArray(value) ? value.length > 0 : true);
  }).length;

  useEffect(() => {
    if (startDate && endDate) {
      updateFilters({
        startDate: format(startDate, 'yyyy-MM-dd'),
        endDate: format(endDate, 'yyyy-MM-dd'),
        availableDates: [format(startDate, 'yyyy-MM-dd'), format(endDate, 'yyyy-MM-dd')]
      });
    }
  }, [startDate, endDate]);

  return (
    <Card className={`bg-background/95 backdrop-blur-md border-border ${className}`}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-primary" />
            Filters
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeFiltersCount}
              </Badge>
            )}
          </CardTitle>
          <div className="flex gap-2">
            {activeFiltersCount > 0 && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear all
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? 'Less' : 'More'} filters
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Quick Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Location */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Location
            </Label>
            <div className="relative">
              <Input
                placeholder="Current location..."
                value={filters.location || ''}
                onChange={(e) => {
                  updateFilters({ location: e.target.value });
                  handleLocationSearch(e.target.value);
                }}
              />
              {locationSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-background border border-border rounded-md mt-1 z-50 max-h-40 overflow-y-auto shadow-lg">
                  {locationSuggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      className="w-full text-left px-3 py-2 hover:bg-muted transition-colors"
                      onClick={() => {
                        updateFilters({ location: suggestion });
                        setLocationSuggestions([]);
                      }}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Destination */}
          <div className="space-y-2">
            <Label>Destination</Label>
            <div className="relative">
              <Input
                placeholder="Where to go..."
                value={filters.destination || ''}
                onChange={(e) => {
                  updateFilters({ destination: e.target.value });
                  handleDestinationSearch(e.target.value);
                }}
              />
              {destinationSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-background border border-border rounded-md mt-1 z-50 max-h-40 overflow-y-auto shadow-lg">
                  {destinationSuggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      className="w-full text-left px-3 py-2 hover:bg-muted transition-colors"
                      onClick={() => {
                        updateFilters({ destination: suggestion });
                        setDestinationSuggestions([]);
                      }}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Group Size */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Group Size
            </Label>
            <Select value={filters.groupSize || 'any'} onValueChange={(value) => updateFilters({ groupSize: value === 'any' ? undefined : value })}>
              <SelectTrigger>
                <SelectValue placeholder="Any size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any size</SelectItem>
                <SelectItem value="solo">Solo (1 person)</SelectItem>
                <SelectItem value="small">Small (2-4 people)</SelectItem>
                <SelectItem value="medium">Medium (5-8 people)</SelectItem>
                <SelectItem value="large">Large (9+ people)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Date Range */}
        <div className="space-y-3">
          <Label>Travel Dates</Label>
          <div className="flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="flex-1 justify-start text-left">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, 'MMM dd, yyyy') : 'Start date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="flex-1 justify-start text-left">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, 'MMM dd, yyyy') : 'End date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Expanded Filters */}
        {isExpanded && (
          <>
            {/* Age Range */}
            <div className="space-y-3">
              <Label>Age Range</Label>
              <div className="px-3">
                <Slider
                  defaultValue={[18, 65]}
                  max={80}
                  min={18}
                  step={1}
                  value={filters.ageRange || [18, 65]}
                  onValueChange={(value) => updateFilters({ ageRange: value as [number, number] })}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground mt-1">
                  <span>{filters.ageRange?.[0] || 18}</span>
                  <span>{filters.ageRange?.[1] || 65}</span>
                </div>
              </div>
            </div>

            {/* Budget Range */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Budget Range (USD)
              </Label>
              <div className="px-3">
                <Slider
                  defaultValue={[0, 5000]}
                  max={10000}
                  min={0}
                  step={100}
                  value={filters.budget || [0, 5000]}
                  onValueChange={(value) => updateFilters({ budget: value as [number, number] })}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground mt-1">
                  <span>${filters.budget?.[0] || 0}</span>
                  <span>${filters.budget?.[1] || 5000}</span>
                </div>
              </div>
            </div>

            {/* Travel Styles */}
            <div className="space-y-3">
              <Label>Travel Style</Label>
              <div className="flex flex-wrap gap-2">
                {TRAVEL_STYLES.map((style) => (
                  <Badge
                    key={style}
                    variant={filters.travelStyle?.includes(style) ? "default" : "outline"}
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                    onClick={() => toggleTravelStyle(style)}
                  >
                    {style}
                    {filters.travelStyle?.includes(style) && (
                      <X className="w-3 h-3 ml-1" />
                    )}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Trip Types */}
            <div className="space-y-3">
              <Label>Trip Type</Label>
              <div className="flex flex-wrap gap-2">
                {TRIP_TYPES.map((type) => (
                  <Badge
                    key={type}
                    variant={filters.tripType?.includes(type) ? "default" : "outline"}
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                    onClick={() => toggleTripType(type)}
                  >
                    {type}
                    {filters.tripType?.includes(type) && (
                      <X className="w-3 h-3 ml-1" />
                    )}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Interests */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <Heart className="w-4 h-4" />
                Interests
              </Label>
              <div className="flex flex-wrap gap-2">
                {INTERESTS.map((interest) => (
                  <Badge
                    key={interest}
                    variant={filters.interests?.includes(interest) ? "default" : "outline"}
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                    onClick={() => toggleInterest(interest)}
                  >
                    {interest}
                    {filters.interests?.includes(interest) && (
                      <X className="w-3 h-3 ml-1" />
                    )}
                  </Badge>
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default TravelBuddyFilters;