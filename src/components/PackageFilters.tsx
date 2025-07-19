import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, RotateCcw } from "lucide-react";

interface PackageFiltersProps {
  onFiltersChange?: (filters: PackageFilters) => void;
}

interface PackageFilters {
  priceRange: [number, number];
  duration: string[];
  packageTypes: string[];
  hotelStarRating: number[];
  flightClass: string[];
  resortTypes: string[];
  amenities: string[];
  destinations: string[];
  departureAirports: string[];
}

const PackageFilters = ({ onFiltersChange }: PackageFiltersProps) => {
  const [filters, setFilters] = useState<PackageFilters>({
    priceRange: [500, 5000],
    duration: [],
    packageTypes: [],
    hotelStarRating: [],
    flightClass: [],
    resortTypes: [],
    amenities: [],
    destinations: [],
    departureAirports: []
  });

  const updateFilters = (newFilters: Partial<PackageFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    if (onFiltersChange) {
      onFiltersChange(updatedFilters);
    }
  };

  const resetFilters = () => {
    const defaultFilters: PackageFilters = {
      priceRange: [500, 5000],
      duration: [],
      packageTypes: [],
      hotelStarRating: [],
      flightClass: [],
      resortTypes: [],
      amenities: [],
      destinations: [],
      departureAirports: []
    };
    setFilters(defaultFilters);
    if (onFiltersChange) {
      onFiltersChange(defaultFilters);
    }
  };

  const handleCheckboxChange = (category: keyof PackageFilters, value: string | number, checked: boolean) => {
    const currentValues = filters[category] as (string | number)[];
    const newValues = checked 
      ? [...currentValues, value]
      : currentValues.filter(item => item !== value);
    
    updateFilters({ [category]: newValues });
  };

  const getActiveFiltersCount = () => {
    return (
      filters.duration.length +
      filters.packageTypes.length +
      filters.hotelStarRating.length +
      filters.flightClass.length +
      filters.resortTypes.length +
      filters.amenities.length +
      filters.destinations.length +
      filters.departureAirports.length
    );
  };

  return (
    <div className="space-y-6">
      {/* Filter Header */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Filters</CardTitle>
            <div className="flex items-center gap-2">
              {getActiveFiltersCount() > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {getActiveFiltersCount()} active
                </Badge>
              )}
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={resetFilters}
                className="text-xs h-8"
              >
                <RotateCcw className="w-3 h-3 mr-1" />
                Reset
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Price Range */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Total Package Price</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Slider
            value={filters.priceRange}
            onValueChange={(value) => updateFilters({ priceRange: value as [number, number] })}
            max={10000}
            min={200}
            step={100}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>${filters.priceRange[0]}</span>
            <span>${filters.priceRange[1]}+</span>
          </div>
        </CardContent>
      </Card>

      {/* Trip Duration */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Trip Duration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { value: "weekend", label: "Weekend (2-3 nights)", count: 45 },
            { value: "short", label: "Short Trip (4-6 nights)", count: 89 },
            { value: "week", label: "1 Week (7-9 nights)", count: 134 },
            { value: "extended", label: "Extended (10-14 nights)", count: 67 },
            { value: "long", label: "Long Stay (15+ nights)", count: 23 }
          ].map((duration) => (
            <div key={duration.value} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={duration.value}
                  checked={filters.duration.includes(duration.value)}
                  onCheckedChange={(checked) => 
                    handleCheckboxChange('duration', duration.value, checked as boolean)
                  }
                />
                <label htmlFor={duration.value} className="text-sm font-medium cursor-pointer">
                  {duration.label}
                </label>
              </div>
              <span className="text-xs text-muted-foreground">({duration.count})</span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Package Types */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Package Type</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { value: "flight-hotel", label: "Flight + Hotel", count: 234 },
            { value: "flight-hotel-car", label: "Flight + Hotel + Car", count: 156 },
            { value: "all-inclusive", label: "All-Inclusive Resort", count: 89 },
            { value: "cruise", label: "Cruise Package", count: 67 },
            { value: "adventure", label: "Adventure Package", count: 45 },
            { value: "family", label: "Family Package", count: 123 }
          ].map((type) => (
            <div key={type.value} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={type.value}
                  checked={filters.packageTypes.includes(type.value)}
                  onCheckedChange={(checked) => 
                    handleCheckboxChange('packageTypes', type.value, checked as boolean)
                  }
                />
                <label htmlFor={type.value} className="text-sm font-medium cursor-pointer">
                  {type.label}
                </label>
              </div>
              <span className="text-xs text-muted-foreground">({type.count})</span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Hotel Star Rating */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Hotel Star Rating</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[5, 4, 3, 2].map((stars) => (
            <div key={stars} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`package-stars-${stars}`}
                  checked={filters.hotelStarRating.includes(stars)}
                  onCheckedChange={(checked) => 
                    handleCheckboxChange('hotelStarRating', stars, checked as boolean)
                  }
                />
                <label htmlFor={`package-stars-${stars}`} className="flex items-center gap-1 cursor-pointer">
                  {[...Array(stars)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-travel-gold text-travel-gold" />
                  ))}
                  <span className="text-sm ml-1">{stars} star{stars > 1 ? 's' : ''} & up</span>
                </label>
              </div>
              <span className="text-xs text-muted-foreground">
                ({stars === 5 ? 34 : stars === 4 ? 78 : stars === 3 ? 123 : 89})
              </span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Flight Class */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Flight Class</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { value: "economy", label: "Economy", count: 267 },
            { value: "premium-economy", label: "Premium Economy", count: 89 },
            { value: "business", label: "Business", count: 45 },
            { value: "first", label: "First Class", count: 12 }
          ].map((flightClass) => (
            <div key={flightClass.value} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={flightClass.value}
                  checked={filters.flightClass.includes(flightClass.value)}
                  onCheckedChange={(checked) => 
                    handleCheckboxChange('flightClass', flightClass.value, checked as boolean)
                  }
                />
                <label htmlFor={flightClass.value} className="text-sm font-medium cursor-pointer">
                  {flightClass.label}
                </label>
              </div>
              <span className="text-xs text-muted-foreground">({flightClass.count})</span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Resort/Hotel Type */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Resort Type</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { value: "beach", label: "Beach Resort", count: 145 },
            { value: "city", label: "City Hotel", count: 234 },
            { value: "ski", label: "Ski Resort", count: 67 },
            { value: "spa", label: "Spa Resort", count: 89 },
            { value: "golf", label: "Golf Resort", count: 45 },
            { value: "family", label: "Family Resort", count: 123 }
          ].map((resort) => (
            <div key={resort.value} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={resort.value}
                  checked={filters.resortTypes.includes(resort.value)}
                  onCheckedChange={(checked) => 
                    handleCheckboxChange('resortTypes', resort.value, checked as boolean)
                  }
                />
                <label htmlFor={resort.value} className="text-sm font-medium cursor-pointer">
                  {resort.label}
                </label>
              </div>
              <span className="text-xs text-muted-foreground">({resort.count})</span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Amenities */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Amenities Included</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { value: "breakfast", label: "Breakfast Included", count: 189 },
            { value: "wifi", label: "Free WiFi", count: 245 },
            { value: "pool", label: "Pool Access", count: 156 },
            { value: "spa", label: "Spa Services", count: 89 },
            { value: "transfers", label: "Airport Transfers", count: 134 },
            { value: "activities", label: "Activities Included", count: 112 }
          ].map((amenity) => (
            <div key={amenity.value} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={amenity.value}
                  checked={filters.amenities.includes(amenity.value)}
                  onCheckedChange={(checked) => 
                    handleCheckboxChange('amenities', amenity.value, checked as boolean)
                  }
                />
                <label htmlFor={amenity.value} className="text-sm font-medium cursor-pointer">
                  {amenity.label}
                </label>
              </div>
              <span className="text-xs text-muted-foreground">({amenity.count})</span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Popular Destinations */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Popular Destinations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { value: "caribbean", label: "Caribbean", count: 89 },
            { value: "europe", label: "Europe", count: 145 },
            { value: "hawaii", label: "Hawaii", count: 67 },
            { value: "mexico", label: "Mexico", count: 123 },
            { value: "asia", label: "Asia", count: 98 },
            { value: "south-america", label: "South America", count: 56 }
          ].map((destination) => (
            <div key={destination.value} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={destination.value}
                  checked={filters.destinations.includes(destination.value)}
                  onCheckedChange={(checked) => 
                    handleCheckboxChange('destinations', destination.value, checked as boolean)
                  }
                />
                <label htmlFor={destination.value} className="text-sm font-medium cursor-pointer">
                  {destination.label}
                </label>
              </div>
              <span className="text-xs text-muted-foreground">({destination.count})</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default PackageFilters;