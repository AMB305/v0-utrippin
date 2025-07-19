import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, RotateCcw } from "lucide-react";

interface ExperienceFiltersProps {
  onFiltersChange?: (filters: ExperienceFilters) => void;
}

interface ExperienceFilters {
  priceRange: [number, number];
  categories: string[];
  duration: string[];
  timeOfDay: string[];
  difficulty: string[];
  groupSize: string[];
  languages: string[];
  features: string[];
  rating: number;
  accessibility: string[];
}

const ExperienceFilters = ({ onFiltersChange }: ExperienceFiltersProps) => {
  const [filters, setFilters] = useState<ExperienceFilters>({
    priceRange: [10, 300],
    categories: [],
    duration: [],
    timeOfDay: [],
    difficulty: [],
    groupSize: [],
    languages: [],
    features: [],
    rating: 0,
    accessibility: []
  });

  const updateFilters = (newFilters: Partial<ExperienceFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    if (onFiltersChange) {
      onFiltersChange(updatedFilters);
    }
  };

  const resetFilters = () => {
    const defaultFilters: ExperienceFilters = {
      priceRange: [10, 300],
      categories: [],
      duration: [],
      timeOfDay: [],
      difficulty: [],
      groupSize: [],
      languages: [],
      features: [],
      rating: 0,
      accessibility: []
    };
    setFilters(defaultFilters);
    if (onFiltersChange) {
      onFiltersChange(defaultFilters);
    }
  };

  const handleCheckboxChange = (category: keyof ExperienceFilters, value: string, checked: boolean) => {
    const currentValues = filters[category] as string[];
    const newValues = checked 
      ? [...currentValues, value]
      : currentValues.filter(item => item !== value);
    
    updateFilters({ [category]: newValues });
  };

  const getActiveFiltersCount = () => {
    return (
      filters.categories.length +
      filters.duration.length +
      filters.timeOfDay.length +
      filters.difficulty.length +
      filters.groupSize.length +
      filters.languages.length +
      filters.features.length +
      filters.accessibility.length +
      (filters.rating > 0 ? 1 : 0)
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
          <CardTitle className="text-base">Price Range</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Slider
            value={filters.priceRange}
            onValueChange={(value) => updateFilters({ priceRange: value as [number, number] })}
            max={500}
            min={5}
            step={5}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>${filters.priceRange[0]}</span>
            <span>${filters.priceRange[1]}+</span>
          </div>
        </CardContent>
      </Card>

      {/* Rating */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Minimum Rating</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { value: 4.5, label: "Excellent: 4.5+" },
            { value: 4.0, label: "Very Good: 4.0+" },
            { value: 3.5, label: "Good: 3.5+" },
            { value: 3.0, label: "Average: 3.0+" }
          ].map((rating) => (
            <div key={rating.value} className="flex items-center space-x-2">
              <Checkbox
                id={`rating-${rating.value}`}
                checked={filters.rating >= rating.value}
                onCheckedChange={(checked) => 
                  updateFilters({ rating: checked ? rating.value : 0 })
                }
              />
              <label htmlFor={`rating-${rating.value}`} className="text-sm font-medium cursor-pointer flex items-center gap-1">
                <Star className="w-3 h-3 fill-travel-gold text-travel-gold" />
                {rating.label}
              </label>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Categories */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Categories</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { value: "tours", label: "Tours & Sightseeing", count: 234 },
            { value: "adventure", label: "Adventure & Outdoor", count: 189 },
            { value: "cultural", label: "Cultural Experiences", count: 156 },
            { value: "food", label: "Food & Drink", count: 145 },
            { value: "entertainment", label: "Entertainment", count: 123 },
            { value: "workshops", label: "Classes & Workshops", count: 89 },
            { value: "nature", label: "Nature & Wildlife", count: 167 },
            { value: "water", label: "Water Activities", count: 98 }
          ].map((category) => (
            <div key={category.value} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={category.value}
                  checked={filters.categories.includes(category.value)}
                  onCheckedChange={(checked) => 
                    handleCheckboxChange('categories', category.value, checked as boolean)
                  }
                />
                <label htmlFor={category.value} className="text-sm font-medium cursor-pointer">
                  {category.label}
                </label>
              </div>
              <span className="text-xs text-muted-foreground">({category.count})</span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Duration */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Duration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { value: "short", label: "Up to 2 hours", count: 145 },
            { value: "half-day", label: "Half Day (2-4 hours)", count: 189 },
            { value: "full-day", label: "Full Day (4-8 hours)", count: 123 },
            { value: "multi-day", label: "Multi-day", count: 67 }
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

      {/* Time of Day */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Time of Day</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { value: "morning", label: "Morning", count: 156 },
            { value: "afternoon", label: "Afternoon", count: 189 },
            { value: "evening", label: "Evening", count: 123 },
            { value: "night", label: "Night", count: 89 }
          ].map((time) => (
            <div key={time.value} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={time.value}
                  checked={filters.timeOfDay.includes(time.value)}
                  onCheckedChange={(checked) => 
                    handleCheckboxChange('timeOfDay', time.value, checked as boolean)
                  }
                />
                <label htmlFor={time.value} className="text-sm font-medium cursor-pointer">
                  {time.label}
                </label>
              </div>
              <span className="text-xs text-muted-foreground">({time.count})</span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Difficulty Level */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Difficulty Level</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { value: "easy", label: "Easy", count: 189 },
            { value: "moderate", label: "Moderate", count: 145 },
            { value: "challenging", label: "Challenging", count: 78 },
            { value: "expert", label: "Expert", count: 34 }
          ].map((difficulty) => (
            <div key={difficulty.value} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={difficulty.value}
                  checked={filters.difficulty.includes(difficulty.value)}
                  onCheckedChange={(checked) => 
                    handleCheckboxChange('difficulty', difficulty.value, checked as boolean)
                  }
                />
                <label htmlFor={difficulty.value} className="text-sm font-medium cursor-pointer">
                  {difficulty.label}
                </label>
              </div>
              <span className="text-xs text-muted-foreground">({difficulty.count})</span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Group Size */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Group Size</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { value: "private", label: "Private Tour", count: 89 },
            { value: "small", label: "Small Group (2-8 people)", count: 156 },
            { value: "medium", label: "Medium Group (9-15 people)", count: 123 },
            { value: "large", label: "Large Group (16+ people)", count: 78 }
          ].map((size) => (
            <div key={size.value} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={size.value}
                  checked={filters.groupSize.includes(size.value)}
                  onCheckedChange={(checked) => 
                    handleCheckboxChange('groupSize', size.value, checked as boolean)
                  }
                />
                <label htmlFor={size.value} className="text-sm font-medium cursor-pointer">
                  {size.label}
                </label>
              </div>
              <span className="text-xs text-muted-foreground">({size.count})</span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Languages */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Languages</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { value: "english", label: "English", count: 298 },
            { value: "spanish", label: "Spanish", count: 156 },
            { value: "french", label: "French", count: 123 },
            { value: "german", label: "German", count: 89 },
            { value: "italian", label: "Italian", count: 67 },
            { value: "portuguese", label: "Portuguese", count: 45 }
          ].map((language) => (
            <div key={language.value} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={language.value}
                  checked={filters.languages.includes(language.value)}
                  onCheckedChange={(checked) => 
                    handleCheckboxChange('languages', language.value, checked as boolean)
                  }
                />
                <label htmlFor={language.value} className="text-sm font-medium cursor-pointer">
                  {language.label}
                </label>
              </div>
              <span className="text-xs text-muted-foreground">({language.count})</span>
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
            { value: "skip-line", label: "Skip the Line", count: 145 },
            { value: "guide", label: "Professional Guide", count: 234 },
            { value: "transport", label: "Transportation Included", count: 189 },
            { value: "meals", label: "Meals Included", count: 123 },
            { value: "photos", label: "Photo Service", count: 89 },
            { value: "equipment", label: "Equipment Provided", count: 167 }
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

      {/* Accessibility */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Accessibility</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { value: "wheelchair", label: "Wheelchair Accessible", count: 89 },
            { value: "mobility", label: "Limited Mobility Friendly", count: 123 },
            { value: "visual", label: "Visual Impairment Friendly", count: 45 },
            { value: "hearing", label: "Hearing Impairment Friendly", count: 67 }
          ].map((accessibility) => (
            <div key={accessibility.value} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={accessibility.value}
                  checked={filters.accessibility.includes(accessibility.value)}
                  onCheckedChange={(checked) => 
                    handleCheckboxChange('accessibility', accessibility.value, checked as boolean)
                  }
                />
                <label htmlFor={accessibility.value} className="text-sm font-medium cursor-pointer">
                  {accessibility.label}
                </label>
              </div>
              <span className="text-xs text-muted-foreground">({accessibility.count})</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default ExperienceFilters;