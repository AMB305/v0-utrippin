import * as React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Wifi, Utensils, Luggage, RefreshCw } from "lucide-react";

export interface FareOption {
  id: string;
  name: string;
  description: string;
  price: string;
  originalPrice?: string;
  savings?: string;
  included: string[];
  excluded?: string[];
  popular?: boolean;
}

interface FareCardProps {
  fare: FareOption;
  selected: boolean;
  onSelect: (fareId: string) => void;
  className?: string;
}

const FareCard = React.forwardRef<HTMLDivElement, FareCardProps>(
  ({ fare, selected, onSelect, className }, ref) => {
    const iconMap: Record<string, React.ReactNode> = {
      "Carry-on bag": <Luggage className="w-4 h-4" />,
      "Checked bag": <Luggage className="w-4 h-4" />,
      "Seat selection": <RefreshCw className="w-4 h-4" />,
      "Wi-Fi": <Wifi className="w-4 h-4" />,
      "Meals": <Utensils className="w-4 h-4" />,
      "Changes allowed": <RefreshCw className="w-4 h-4" />,
      "Refundable": <RefreshCw className="w-4 h-4" />
    };

    return (
      <Card
        ref={ref}
        className={cn(
          "relative cursor-pointer transition-all duration-200 hover:shadow-md",
          selected 
            ? "ring-2 ring-primary border-primary bg-primary/5" 
            : "border-border hover:border-primary/50",
          fare.popular && "border-travel-gold ring-1 ring-travel-gold",
          className
        )}
        onClick={() => onSelect(fare.id)}
      >
        {fare.popular && (
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <span className="bg-travel-gold text-travel-navy px-3 py-1 rounded-full text-xs font-semibold">
              MOST POPULAR
            </span>
          </div>
        )}
        
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Header */}
            <div className="text-center">
              <h3 className="text-lg font-semibold text-foreground">{fare.name}</h3>
              <p className="text-sm text-muted-foreground">{fare.description}</p>
            </div>
            
            {/* Price */}
            <div className="text-center space-y-1">
              <div className="flex items-center justify-center gap-2">
                <span className="text-2xl font-bold text-foreground">{fare.price}</span>
                {fare.originalPrice && (
                  <span className="text-sm text-muted-foreground line-through">
                    {fare.originalPrice}
                  </span>
                )}
              </div>
              {fare.savings && (
                <p className="text-sm text-green-600 font-medium">Save {fare.savings}</p>
              )}
            </div>
            
            {/* Included Features */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-foreground">Included:</h4>
              <ul className="space-y-1">
                {fare.included.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span className="text-muted-foreground">{feature}</span>
                    {iconMap[feature] && (
                      <span className="ml-auto text-muted-foreground">
                        {iconMap[feature]}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Excluded Features (if any) */}
            {fare.excluded && fare.excluded.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">Not included:</h4>
                <ul className="space-y-1">
                  {fare.excluded.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="w-4 h-4 text-center">–</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Selection Indicator */}
            {selected && (
              <div className="flex items-center justify-center gap-2 text-primary font-medium">
                <Check className="w-4 h-4" />
                <span className="text-sm">Selected</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }
);

FareCard.displayName = "FareCard";

export { FareCard };