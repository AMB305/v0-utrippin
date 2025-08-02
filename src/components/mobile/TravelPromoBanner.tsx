import React from 'react';
import { Gift, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const TravelPromoBanner: React.FC = () => {
  return (
    <div className="px-4 py-6">
      <div className="bg-gradient-to-r from-mobile-primary-teal to-travel-blue rounded-xl p-4 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-2 right-2 w-8 h-8 border border-white rounded-full" />
          <div className="absolute bottom-2 left-2 w-6 h-6 border border-white rounded-full" />
          <div className="absolute top-1/2 left-1/4 w-4 h-4 bg-white rounded-full" />
        </div>

        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Gift className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold text-sm mb-1">New User Discounts Available</h3>
              <p className="text-white/80 text-xs">Save up to 25% on your first booking</p>
            </div>
          </div>
          
          <Button
            size="sm"
            className="bg-white text-mobile-primary-teal hover:bg-white/90 font-medium px-4 py-2"
          >
            Claim All
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
};
