import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { AITravelSelectorMobile } from '@/components/AITravelSelectorMobile';

interface UnifiedBookingSheetProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab: string;
}

const UnifiedBookingSheet: React.FC<UnifiedBookingSheetProps> = ({ isOpen, onClose, initialTab }) => {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Book Your Trip</SheetTitle>
        </SheetHeader>
        <div className="py-4">
          {initialTab === 'ai' ? (
            <AITravelSelectorMobile />
          ) : (
            <p>Booking form for {initialTab} coming soon...</p>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default UnifiedBookingSheet;