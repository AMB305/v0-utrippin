import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, RotateCcw } from "lucide-react";

interface HotelFiltersProps {
  onFiltersChange?: (filters: HotelFilters) => void;
}

interface HotelFilters {
  priceRange: [number, number];
  starRating: number[];
  propertyTypes: string[];
  amenities: string[];
  hotelChains: string[];
  districts: string[];
  guestRating: number;
}

const HotelFilters = ({ onFiltersChange }: HotelFiltersProps) => {
  const [filters, setFilters] = useState<HotelFilters>({
    priceRange: [50, 500],
    starRating: [],
    propertyTypes: [],
    amenities: [],
    hotelChains: [],
    districts: [],
    guestRating: 0
  });

  const updateFilters = (newFilters: Partial<HotelFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    if (onFiltersChange) {
      onFiltersChange(updatedFilters);
    }
  };

  const resetFilters = () => {
    const defaultFilters: HotelFilters = {
      priceRange: [50, 500],
      starRating: [],
      propertyTypes: [],
      amenities: [],
      hotelChains: [],
      districts: [],
      guestRating: 0
    };
    setFilters(defaultFilters);
    if (onFiltersChange) {
      onFiltersChange(defaultFilters);
    }
  };

  const handleCheckboxChange = (category: keyof HotelFilters, value: string | number, checked: boolean) => {
    const currentValues = filters[category] as (string | number)[];
    const newValues = checked 
      ? [...currentValues, value]
      : currentValues.filter(item => item !== value);
    
    updateFilters({ [category]: newValues });
  };

  const getActiveFiltersCount = () => {
    return (
      filters.starRating.length +
      filters.propertyTypes.length +
      filters.amenities.length +
      filters.hotelChains.length +
      filters.districts.length +
      (filters.guestRating > 0 ? 1 : 0)
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
          <CardTitle className="text-base">Price per Night</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Slider
            value={filters.priceRange}
            onValueChange={(value) => updateFilters({ priceRange: value as [number, number] })}
            max={1000}
            min={25}
            step={25}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>${filters.priceRange[0]}</span>
            <span>${filters.priceRange[1]}+</span>
          </div>
        </CardContent>
      </Card>

      {/* Star Rating */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Star Rating</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[5, 4, 3, 2, 1].map((stars) => (
            <div key={stars} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`stars-${stars}`}
                  checked={filters.starRating.includes(stars)}
                  onCheckedChange={(checked) => 
                    handleCheckboxChange('starRating', stars, checked as boolean)
                  }
                />
                <label htmlFor={`stars-${stars}`} className="flex items-center gap-1 cursor-pointer">
                  {[...Array(stars)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-travel-gold text-travel-gold" />
                  ))}
                  <span className="text-sm ml-1">{stars} star{stars > 1 ? 's' : ''}</span>
                </label>
              </div>
              <span className="text-xs text-muted-foreground">
                ({stars === 5 ? 23 : stars === 4 ? 45 : stars === 3 ? 67 : stars === 2 ? 34 : 12})
              </span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Guest Rating */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Guest Rating</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { value: 9, label: "Excellent: 9+" },
            { value: 8, label: "Very Good: 8+" },
            { value: 7, label: "Good: 7+" },
            { value: 6, label: "Pleasant: 6+" }
          ].map((rating) => (
            <div key={rating.value} className="flex items-center space-x-2">
              <Checkbox
                id={`rating-${rating.value}`}
                checked={filters.guestRating >= rating.value}
                onCheckedChange={(checked) => 
                  updateFilters({ guestRating: checked ? rating.value : 0 })
                }
              />
              <label htmlFor={`rating-${rating.value}`} className="text-sm font-medium cursor-pointer">
                {rating.label}
              </label>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Property Type */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Property Type</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { value: "hotel", label: "Hotel", count: 156 },
            { value: "resort", label: "Resort", count: 89 },
            { value: "apartment", label: "Apartment", count: 234 },
            { value: "villa", label: "Villa", count: 67 },
            { value: "hostel", label: "Hostel", count: 45 },
            { value: "bnb", label: "Bed & Breakfast", count: 123 }
          ].map((type) => (
            <div key={type.value} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={type.value}
                  checked={filters.propertyTypes.includes(type.value)}
                  onCheckedChange={(checked) => 
                    handleCheckboxChange('propertyTypes', type.value, checked as boolean)
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

      {/* Hotel Chains */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Hotel Chains</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { value: "marriott", label: "Marriott", count: 34 },
            { value: "hilton", label: "Hilton", count: 28 },
            { value: "hyatt", label: "Hyatt", count: 19 },
            { value: "ihg", label: "IHG", count: 42 },
            { value: "accor", label: "Accor", count: 31 },
            { value: "wyndham", label: "Wyndham", count: 25 }
          ].map((chain) => (
            <div key={chain.value} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={chain.value}
                  checked={filters.hotelChains.includes(chain.value)}
                  onCheckedChange={(checked) => 
                    handleCheckboxChange('hotelChains', chain.value, checked as boolean)
                  }
                />
                <label htmlFor={chain.value} className="text-sm font-medium cursor-pointer">
                  {chain.label}
                </label>
              </div>
              <span className="text-xs text-muted-foreground">({chain.count})</span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Amenities */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Amenities</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { value: "wifi", label: "Free WiFi", count: 189 },
            { value: "pool", label: "Swimming Pool", count: 145 },
            { value: "gym", label: "Fitness Center", count: 167 },
            { value: "spa", label: "Spa", count: 98 },
            { value: "restaurant", label: "Restaurant", count: 156 },
            { value: "parking", label: "Free Parking", count: 134 },
            { value: "breakfast", label: "Free Breakfast", count: 112 },
            { value: "pets", label: "Pet Friendly", count: 67 }
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

      {/* Districts/Areas */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Districts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { value: "downtown", label: "Downtown", count: 78 },
            { value: "beach", label: "Beach Area", count: 56 },
            { value: "airport", label: "Near Airport", count: 34 },
            { value: "historic", label: "Historic District", count: 45 },
            { value: "shopping", label: "Shopping District", count: 67 },
            { value: "business", label: "Business District", count: 89 }
          ].map((district) => (
            <div key={district.value} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={district.value}
                  checked={filters.districts.includes(district.value)}
                  onCheckedChange={(checked) => 
                    handleCheckboxChange('districts', district.value, checked as boolean)
                  }
                />
                <label htmlFor={district.value} className="text-sm font-medium cursor-pointer">
                  {district.label}
                </label>
              </div>
              <span className="text-xs text-muted-foreground">({district.count})</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default HotelFilters;