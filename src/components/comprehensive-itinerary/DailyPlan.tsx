// src/components/comprehensive-itinerary/DailyPlan.tsx

import React from 'react';
import { DayPlan } from '@/lib/schemas';
import { DayCard } from './DayCard';

interface DailyPlanProps {
  days: DayPlan[];
}

export const DailyPlan: React.FC<DailyPlanProps> = ({ days }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-6">Daily Itinerary</h2>
      
      <div className="space-y-4">
        {days.map((day, index) => (
          <DayCard 
            key={day.day} 
            day={day} 
            defaultExpanded={index === 0} // Expand first day by default
          />
        ))}
      </div>
    </div>
  );
};