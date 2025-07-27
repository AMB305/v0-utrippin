import React from 'react';
import { Percent, Calendar, TrendingUp, MapPin, Award } from 'lucide-react';

const navItems = [
  { icon: Percent, label: 'Deals', key: 'deals' },
  { icon: Calendar, label: 'Events', key: 'events' },
  { icon: TrendingUp, label: 'Trending', key: 'trending' },
  { icon: MapPin, label: 'Trip.Planner', key: 'planner' },
  { icon: Award, label: 'Top Picks', key: 'top-picks' }
];

export const MobileTravelNavigation: React.FC = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-mobile-card-bg border-t border-mobile-border-color z-30">
      <div className="flex justify-around items-center py-2">
        {navItems.map((item) => (
          <button
            key={item.key}
            className="flex flex-col items-center p-2 touch-target-44 text-mobile-text-secondary hover:text-mobile-primary-teal transition-colors"
          >
            <item.icon className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};