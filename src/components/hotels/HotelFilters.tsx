import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { 
  Hotel, 
  Home, 
  Building, 
  TreePine, 
  Waves, 
  Crown,
  Star,
  Wifi,
  Car,
  Dumbbell,
  Coffee,
  Utensils,
  Bath,
  Tv,
  Wind
} from 'lucide-react';

interface FilterState {
  propertyTypes: string[];
  priceRange: [number, number];
  starRating: number[];
  amenities: string[];
}

interface HotelFiltersProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  onApply: () => void;
  onReset: () => void;
  className?: string;
}

const PROPERTY_TYPES = [
  { id: 'hotel', label: 'Hotel', icon: Hotel },
  { id: 'resort', label: 'Resort', icon: Waves },
  { id: 'villa', label: 'Villa', icon: Home },
  { id: 'apartment', label: 'Apartment', icon: Building },
  { id: 'boutique', label: 'Boutique Hotel', icon: Crown },
  { id: 'lodge', label: 'Lodge', icon: TreePine },
];

const STAR_RATINGS = [1, 2, 3, 4, 5];

const AMENITIES = [
  { id: 'wifi', label: 'Free WiFi', icon: Wifi },
  { id: 'parking', label: 'Parking', icon: Car },
  { id: 'gym', label: 'Fitness Center', icon: Dumbbell },
  { id: 'pool', label: 'Swimming Pool', icon: Waves },
  { id: 'spa', label: 'Spa & Wellness', icon: Bath },
  { id: 'restaurant', label: 'Restaurant', icon: Utensils },
  { id: 'bar', label: 'Bar/Lounge', icon: Coffee },
  { id: 'tv', label: 'Cable TV', icon: Tv },
  { id: 'ac', label: 'Air Conditioning', icon: Wind },
];

export function HotelFilters({ filters, onChange, onApply, onReset, className }: HotelFiltersProps) {
  const updatePropertyTypes = (typeId: string, checked: boolean) => {
    const newTypes = checked
      ? [...filters.propertyTypes, typeId]
      : filters.propertyTypes.filter(t => t !== typeId);
    onChange({ ...filters, propertyTypes: newTypes });
  };

  const updateStarRating = (rating: number, checked: boolean) => {
    const newRatings = checked
      ? [...filters.starRating, rating]
      : filters.starRating.filter(r => r !== rating);
    onChange({ ...filters, starRating: newRatings });
  };

  const updateAmenities = (amenityId: string, checked: boolean) => {
    const newAmenities = checked
      ? [...filters.amenities, amenityId]
      : filters.amenities.filter(a => a !== amenityId);
    onChange({ ...filters, amenities: newAmenities });
  };

  const updatePriceRange = (value: number[]) => {
    onChange({ ...filters, priceRange: [value[0], value[1]] });
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between text-lg">
          Refine Your Search
          <Button variant="ghost" size="sm" onClick={onReset}>
            Reset
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Property Type */}
        <div>
          <h3 className="font-semibold mb-3">Property Type</h3>
          <div className="grid grid-cols-2 gap-2">
            {PROPERTY_TYPES.map((type) => {
              const IconComponent = type.icon;
              return (
                <div key={type.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={type.id}
                    checked={filters.propertyTypes.includes(type.id)}
                    onCheckedChange={(checked) => updatePropertyTypes(type.id, checked as boolean)}
                  />
                  <label
                    htmlFor={type.id}
                    className="flex items-center space-x-1 text-sm cursor-pointer"
                  >
                    <IconComponent className="h-4 w-4" />
                    <span>{type.label}</span>
                  </label>
                </div>
              );
            })}
          </div>
        </div>

        {/* Price Range */}
        <div>
          <h3 className="font-semibold mb-3">Price Range (per night)</h3>
          <div className="px-2">
            <Slider
              value={filters.priceRange}
              onValueChange={updatePriceRange}
              max={1000}
              min={0}
              step={10}
              className="mb-2"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>${filters.priceRange[0]}</span>
              <span>${filters.priceRange[1]}+</span>
            </div>
          </div>
        </div>

        {/* Star Rating */}
        <div>
          <h3 className="font-semibold mb-3">Star Rating</h3>
          <div className="flex flex-wrap gap-2">
            {STAR_RATINGS.map((rating) => (
              <div key={rating} className="flex items-center space-x-1">
                <Checkbox
                  id={`star-${rating}`}
                  checked={filters.starRating.includes(rating)}
                  onCheckedChange={(checked) => updateStarRating(rating, checked as boolean)}
                />
                <label
                  htmlFor={`star-${rating}`}
                  className="flex items-center space-x-1 text-sm cursor-pointer"
                >
                  <span>{rating}</span>
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Amenities */}
        <div>
          <h3 className="font-semibold mb-3">Amenities</h3>
          <div className="grid grid-cols-1 gap-2">
            {AMENITIES.map((amenity) => {
              const IconComponent = amenity.icon;
              return (
                <div key={amenity.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={amenity.id}
                    checked={filters.amenities.includes(amenity.id)}
                    onCheckedChange={(checked) => updateAmenities(amenity.id, checked as boolean)}
                  />
                  <label
                    htmlFor={amenity.id}
                    className="flex items-center space-x-2 text-sm cursor-pointer"
                  >
                    <IconComponent className="h-4 w-4" />
                    <span>{amenity.label}</span>
                  </label>
                </div>
              );
            })}
          </div>
        </div>

        {/* Apply Button */}
        <Button onClick={onApply} className="w-full">
          Apply Filters
        </Button>
      </CardContent>
    </Card>
  );
}