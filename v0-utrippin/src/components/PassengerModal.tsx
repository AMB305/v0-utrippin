import { useState } from "react";
import { Minus, Plus, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface PassengerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (passengers: PassengerCount, cabinClass: string) => void;
  initialPassengers?: PassengerCount;
  initialCabinClass?: string;
}

interface PassengerCount {
  adults: number;
  children: number;
  infants: number;
}

const cabinClasses = [
  { value: "economy", label: "Economy" },
  { value: "premium_economy", label: "Premium Economy" },
  { value: "business", label: "Business" },
  { value: "first", label: "First" },
];

export default function PassengerModal({
  isOpen,
  onClose,
  onSelect,
  initialPassengers = { adults: 1, children: 0, infants: 0 },
  initialCabinClass = "economy"
}: PassengerModalProps) {
  const [passengers, setPassengers] = useState<PassengerCount>(initialPassengers);
  const [cabinClass, setCabinClass] = useState(initialCabinClass);

  const updatePassengerCount = (type: keyof PassengerCount, increment: boolean) => {
    setPassengers(prev => {
      const newCount = increment ? prev[type] + 1 : Math.max(0, prev[type] - 1);
      
      // Ensure at least 1 adult
      if (type === "adults" && newCount < 1) {
        return prev;
      }
      
      return { ...prev, [type]: newCount };
    });
  };

  const handleApply = () => {
    onSelect(passengers, cabinClass);
    onClose();
  };

  const totalPassengers = passengers.adults + passengers.children + passengers.infants;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Passengers & Class
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Passenger Counts */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Adults</div>
                <div className="text-sm text-muted-foreground">12+ years</div>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updatePassengerCount("adults", false)}
                  disabled={passengers.adults <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center">{passengers.adults}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updatePassengerCount("adults", true)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Children</div>
                <div className="text-sm text-muted-foreground">2-11 years</div>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updatePassengerCount("children", false)}
                  disabled={passengers.children <= 0}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center">{passengers.children}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updatePassengerCount("children", true)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Infants</div>
                <div className="text-sm text-muted-foreground">Under 2 years</div>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updatePassengerCount("infants", false)}
                  disabled={passengers.infants <= 0}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center">{passengers.infants}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updatePassengerCount("infants", true)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Cabin Class */}
          <div>
            <div className="font-medium mb-3">Cabin Class</div>
            <div className="grid grid-cols-2 gap-2">
              {cabinClasses.map((cabin) => (
                <Button
                  key={cabin.value}
                  variant={cabinClass === cabin.value ? "default" : "outline"}
                  onClick={() => setCabinClass(cabin.value)}
                  className="text-left justify-start"
                >
                  {cabin.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Apply Button */}
          <Button onClick={handleApply} className="w-full">
            Apply ({totalPassengers} passenger{totalPassengers !== 1 ? 's' : ''})
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
