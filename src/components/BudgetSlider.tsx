import React from "react";
import { Slider } from "@/components/ui/slider";
import { Loader2 } from "lucide-react";

interface BudgetSliderProps {
  budget: number;
  onBudgetChange: (value: number) => void;
  min?: number;
  max?: number;
  isDebouncing?: boolean;
}

export const BudgetSlider: React.FC<BudgetSliderProps> = ({
  budget,
  onBudgetChange,
  min = 100,
  max = 1000000,
  isDebouncing = false
}) => {
  const handleValueChange = (values: number[]) => {
    onBudgetChange(values[0]);
  };

  const formatBudget = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}k`;
    }
    return `$${value.toLocaleString()}`;
  };

  const getStepSize = (value: number) => {
    if (value >= 100000) return 10000;
    if (value >= 50000) return 5000;
    if (value >= 10000) return 1000;
    if (value >= 500) return 250;
    if (value >= 200) return 25;
    return 10;
  };

  const getBudgetMessage = (value: number) => {
    if (value < 200) {
      return "Perfect for a nice staycation day";
    } else if (value < 500) {
      return "Vacation mode unlocked! Hotel stays possible";
    } else {
      return "Full vacation packages with flights available";
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      <div className="flex justify-between items-center" style={{color: '#0f2948'}}>
        <label className="text-sm font-medium" style={{color: '#0f2948'}}>
          Budget Range
        </label>
        <div className="flex items-center gap-2">
          {isDebouncing && (
            <Loader2 className="h-4 w-4 animate-spin text-ai-travel-button" />
          )}
          <span className="text-lg font-semibold text-ai-travel-button">
            {formatBudget(budget)}
          </span>
        </div>
      </div>
      
      <div className="px-2">
        <Slider
          value={[budget]}
          onValueChange={handleValueChange}
          max={max}
          min={min}
          step={getStepSize(budget)}
          className="w-full"
        />
      </div>
      
      <div className="text-center">
        <p className="text-xs text-ai-travel-button/70 font-medium">
          {getBudgetMessage(budget)}
        </p>
      </div>
      
      <div className="flex justify-between text-xs text-white/60">
        <span style={{color: '#0f2948'}}>{formatBudget(min)}</span>
        <span style={{color: '#0f2948'}}>{formatBudget(max)}</span>
      </div>
    </div>
  );
};
