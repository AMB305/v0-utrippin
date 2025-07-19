import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

export interface ActiveFilter {
  type: string;
  label: string;
  value: any;
}

interface FilterChipsProps {
  activeFilters: ActiveFilter[];
  onRemoveFilter: (filter: ActiveFilter) => void;
  onClearAll: () => void;
}

export default function FilterChips({ activeFilters, onRemoveFilter, onClearAll }: FilterChipsProps) {
  if (activeFilters.length === 0) return null;

  return (
    <div className="flex items-center gap-2 mb-6 flex-wrap">
      <span className="text-sm text-muted-foreground mr-2">Active filters:</span>
      
      {activeFilters.map((filter, index) => (
        <Badge 
          key={`${filter.type}-${index}`}
          variant="secondary" 
          className="px-3 py-1 bg-primary/10 text-primary hover:bg-primary/20 cursor-pointer group transition-colors"
          onClick={() => onRemoveFilter(filter)}
        >
          {filter.label}
          <X className="w-3 h-3 ml-1 opacity-60 group-hover:opacity-100" />
        </Badge>
      ))}
      
      {activeFilters.length > 1 && (
        <button
          onClick={onClearAll}
          className="text-sm text-muted-foreground hover:text-foreground underline ml-2"
        >
          Clear all
        </button>
      )}
    </div>
  );
}