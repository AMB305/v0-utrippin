import { useState, useEffect } from "react";
import { MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { DuffelAirport } from "@/lib/duffel";
import { cn } from "@/lib/utils";
import AirportSearchModal from "./AirportSearchModal";

interface SimpleAirportAutocompleteProps {
  placeholder?: string;
  value?: DuffelAirport | null;
  onChange?: (airport: DuffelAirport | null) => void;
  className?: string;
}

export default function SimpleAirportAutocomplete({ 
  placeholder = "Search airports or cities", 
  value, 
  onChange,
  className 
}: SimpleAirportAutocompleteProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [displayValue, setDisplayValue] = useState("");

  // Update display when value changes
  useEffect(() => {
    if (value) {
      setDisplayValue(`${value.city_name} (${value.iata_code})`);
    } else {
      setDisplayValue("");
    }
  }, [value]);

  // Handle input click/focus - open modal
  const handleInputClick = () => {
    setIsModalOpen(true);
  };

  // Handle airport selection from modal
  const handleAirportSelect = (airport: DuffelAirport) => {
    onChange?.(airport);
    setIsModalOpen(false);
  };

  // Handle input change (for typing directly)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setDisplayValue(query);
    
    // If user clears the input or changes it significantly, clear the selection
    if (value && query !== `${value.city_name} (${value.iata_code})`) {
      onChange?.(null);
    }
    
    // Open modal if user starts typing
    if (query.length >= 1) {
      setIsModalOpen(true);
    }
  };

  return (
    <>
      <div className={cn("relative w-full", className)}>
        <Input
          placeholder={placeholder}
          value={displayValue}
          onChange={handleInputChange}
          onClick={handleInputClick}
          onFocus={handleInputClick}
          className={cn(
            "w-full cursor-pointer",
            className
          )}
          readOnly={false}
          autoComplete="off"
          title={value ? `${value.city_name} (${value.iata_code}) - ${value.name}` : displayValue}
        />
        
        {/* Icon indicator */}
        <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
      </div>

      {/* Airport Search Modal */}
      <AirportSearchModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={handleAirportSelect}
        title="Please select an airport"
        placeholder={placeholder}
      />
    </>
  );
}
