import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { RotateCcw } from "lucide-react";

interface CarFiltersProps {
  onFiltersChange?: (filters: CarFilters) => void;
}

interface CarFilters {
  priceRange: [number, number];
  carTypes: string[];
  fuelPolicy: string[];
  features: string[];
  rentalCompanies: string[];
  transmission: string[];
}

const CarFilters = ({ onFiltersChange }: CarFiltersProps) => {
  const [filters, setFilters] = useState<CarFilters>({
    priceRange: [20, 200],
    carTypes: [],
    fuelPolicy: [],
    features: [],
    rentalCompanies: [],
    transmission: []
  });

  const updateFilters = (newFilters: Partial<CarFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    if (onFiltersChange) {
      onFiltersChange(updatedFilters);
    }
  };

  const resetFilters = () => {
    const defaultFilters: CarFilters = {
      priceRange: [20, 200],
      carTypes: [],
      fuelPolicy: [],
      features: [],
      rentalCompanies: [],
      transmission: []
    };
    setFilters(defaultFilters);
    if (onFiltersChange) {
      onFiltersChange(defaultFilters);
    }
  };

  const handleCheckboxChange = (category: keyof CarFilters, value: string, checked: boolean) => {
    const currentValues = filters[category] as string[];
    const newValues = checked 
      ? [...currentValues, value]
      : currentValues.filter(item => item !== value);
    
    updateFilters({ [category]: newValues });
  };

  const getActiveFiltersCount = () => {
    return (
      filters.carTypes.length +
      filters.fuelPolicy.length +
      filters.features.length +
      filters.rentalCompanies.length +
      filters.transmission.length
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
          <CardTitle className="text-base">Price per Day</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Slider
            value={filters.priceRange}
            onValueChange={(value) => updateFilters({ priceRange: value as [number, number] })}
            max={300}
            min={20}
            step={10}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>${filters.priceRange[0]}</span>
            <span>${filters.priceRange[1]}+</span>
          </div>
        </CardContent>
      </Card>

      {/* Car Type */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Car Type</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { value: "economy", label: "Economy", count: 42 },
            { value: "compact", label: "Compact", count: 35 },
            { value: "midsize", label: "Mid-size", count: 28 },
            { value: "fullsize", label: "Full-size", count: 19 },
            { value: "suv", label: "SUV", count: 23 },
            { value: "luxury", label: "Luxury", count: 12 },
            { value: "convertible", label: "Convertible", count: 8 },
            { value: "van", label: "Van/Minivan", count: 15 }
          ].map((type) => (
            <div key={type.value} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={type.value}
                  checked={filters.carTypes.includes(type.value)}
                  onCheckedChange={(checked) => 
                    handleCheckboxChange('carTypes', type.value, checked as boolean)
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

      {/* Rental Companies */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Rental Companies</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { value: "hertz", label: "Hertz", count: 45 },
            { value: "avis", label: "Avis", count: 38 },
            { value: "enterprise", label: "Enterprise", count: 52 },
            { value: "budget", label: "Budget", count: 41 },
            { value: "alamo", label: "Alamo", count: 33 },
            { value: "national", label: "National", count: 29 },
            { value: "thrifty", label: "Thrifty", count: 25 },
            { value: "dollar", label: "Dollar", count: 31 }
          ].map((company) => (
            <div key={company.value} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={company.value}
                  checked={filters.rentalCompanies.includes(company.value)}
                  onCheckedChange={(checked) => 
                    handleCheckboxChange('rentalCompanies', company.value, checked as boolean)
                  }
                />
                <label htmlFor={company.value} className="text-sm font-medium cursor-pointer">
                  {company.label}
                </label>
              </div>
              <span className="text-xs text-muted-foreground">({company.count})</span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Transmission */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Transmission</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { value: "automatic", label: "Automatic", count: 156 },
            { value: "manual", label: "Manual", count: 43 }
          ].map((transmission) => (
            <div key={transmission.value} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={transmission.value}
                  checked={filters.transmission.includes(transmission.value)}
                  onCheckedChange={(checked) => 
                    handleCheckboxChange('transmission', transmission.value, checked as boolean)
                  }
                />
                <label htmlFor={transmission.value} className="text-sm font-medium cursor-pointer">
                  {transmission.label}
                </label>
              </div>
              <span className="text-xs text-muted-foreground">({transmission.count})</span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Features */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Features</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { value: "ac", label: "Air Conditioning", count: 145 },
            { value: "gps", label: "GPS Navigation", count: 89 },
            { value: "bluetooth", label: "Bluetooth", count: 112 },
            { value: "usb", label: "USB Ports", count: 98 },
            { value: "backup_camera", label: "Backup Camera", count: 76 },
            { value: "child_seat", label: "Child Seat Available", count: 54 }
          ].map((feature) => (
            <div key={feature.value} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={feature.value}
                  checked={filters.features.includes(feature.value)}
                  onCheckedChange={(checked) => 
                    handleCheckboxChange('features', feature.value, checked as boolean)
                  }
                />
                <label htmlFor={feature.value} className="text-sm font-medium cursor-pointer">
                  {feature.label}
                </label>
              </div>
              <span className="text-xs text-muted-foreground">({feature.count})</span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Fuel Policy */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Fuel Policy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { value: "full_to_full", label: "Full to Full", count: 123 },
            { value: "same_to_same", label: "Same to Same", count: 89 },
            { value: "pre_purchase", label: "Pre-purchase", count: 45 }
          ].map((policy) => (
            <div key={policy.value} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={policy.value}
                  checked={filters.fuelPolicy.includes(policy.value)}
                  onCheckedChange={(checked) => 
                    handleCheckboxChange('fuelPolicy', policy.value, checked as boolean)
                  }
                />
                <label htmlFor={policy.value} className="text-sm font-medium cursor-pointer">
                  {policy.label}
                </label>
              </div>
              <span className="text-xs text-muted-foreground">({policy.count})</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default CarFilters;