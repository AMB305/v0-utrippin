import React from "react";
import { Minus, Plus, Users } from "lucide-react";

interface GroupSelectorProps {
  groupSize: number;
  onGroupSizeChange: (size: number) => void;
  min?: number;
  max?: number;
}

export const GroupSelector: React.FC<GroupSelectorProps> = ({
  groupSize,
  onGroupSizeChange,
  min = 1,
  max = 8
}) => {
  const handleDecrease = () => {
    if (groupSize > min) {
      onGroupSizeChange(groupSize - 1);
    }
  };

  const handleIncrease = () => {
    if (groupSize < max) {
      onGroupSizeChange(groupSize + 1);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2 text-white/80">
        <Users className="w-4 h-4" />
        <span className="text-sm font-medium">Group Size</span>
      </div>
      
      <div className="flex items-center gap-2 bg-slate-700/50 border border-slate-600 rounded-lg">
        <button
          onClick={handleDecrease}
          disabled={groupSize <= min}
          className="p-2 hover:bg-slate-600/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-l-lg"
        >
          <Minus className="w-4 h-4 text-white" />
        </button>
        
        <div className="px-3 py-2 min-w-[3rem] text-center">
          <span className="text-white font-semibold">{groupSize}</span>
        </div>
        
        <button
          onClick={handleIncrease}
          disabled={groupSize >= max}
          className="p-2 hover:bg-slate-600/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-r-lg"
        >
          <Plus className="w-4 h-4 text-white" />
        </button>
      </div>
    </div>
  );
};