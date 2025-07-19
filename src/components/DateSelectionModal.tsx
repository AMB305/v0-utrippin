import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { format } from "date-fns";

interface DateSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (dates: { departureDate: Date | undefined; returnDate: Date | undefined }) => void;
  departureDate?: Date;
  returnDate?: Date;
  tripType: 'round-trip' | 'one-way' | 'multi-city';
  title?: string;
}

export default function DateSelectionModal({ 
  isOpen, 
  onClose, 
  onSelect,
  departureDate,
  returnDate,
  tripType,
  title = "Select Flight Dates"
}: DateSelectionModalProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedStartDate, setSelectedStartDate] = useState<Date | undefined>(departureDate);
  const [selectedEndDate, setSelectedEndDate] = useState<Date | undefined>(returnDate);
  const [showReturnFlight, setShowReturnFlight] = useState(tripType === 'round-trip');

  // Reset selections when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedStartDate(departureDate);
      setSelectedEndDate(returnDate);
      setShowReturnFlight(tripType === 'round-trip');
      if (departureDate) {
        setCurrentMonth(new Date(departureDate.getFullYear(), departureDate.getMonth(), 1));
      } else {
        setCurrentMonth(new Date());
      }
    }
  }, [isOpen, departureDate, returnDate, tripType]);

  // Function to get days in a month
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const lastDay = new Date(year, month + 1, 0);
    const days = [];
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  // Function to generate leading empty cells for the calendar
  const getLeadingEmptyCells = (date: Date) => {
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const dayOfWeek = firstDayOfMonth.getDay(); // 0 for Sunday, 1 for Monday, etc.
    return Array(dayOfWeek).fill(null);
  };

  // Function to generate trailing empty cells
  const getTrailingEmptyCells = (date: Date) => {
    const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    const dayOfWeek = lastDayOfMonth.getDay(); // 0 for Sunday, 1 for Monday, etc.
    return Array(6 - dayOfWeek).fill(null); // 6 days in a week (0-6)
  };

  const handleDateSelect = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Don't allow past dates
    if (date < today) return;

    if (!showReturnFlight) {
      // One-way: just set departure
      setSelectedStartDate(date);
      setSelectedEndDate(undefined);
    } else {
      // Round trip logic
      if (!selectedStartDate || (selectedStartDate && selectedEndDate)) {
        setSelectedStartDate(date);
        setSelectedEndDate(undefined);
      } else if (date > selectedStartDate) {
        setSelectedEndDate(date);
      } else {
        setSelectedEndDate(selectedStartDate);
        setSelectedStartDate(date);
      }
    }
  };

  const handleReturnToggle = (enabled: boolean) => {
    setShowReturnFlight(enabled);
    if (!enabled) {
      setSelectedEndDate(undefined);
    }
  };

  const handleFinish = () => {
    onSelect({
      departureDate: selectedStartDate,
      returnDate: showReturnFlight ? selectedEndDate : undefined
    });
    onClose();
  };

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const renderMonth = (monthDate: Date) => {
    const days = getDaysInMonth(monthDate);
    const leadingEmptyCells = getLeadingEmptyCells(monthDate);
    const trailingEmptyCells = getTrailingEmptyCells(monthDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return (
      <div className="flex-1 min-w-[280px] sm:min-w-[300px] p-2 bg-white rounded-lg">
        <div className="text-center text-lg font-semibold text-gray-800 mb-4">
          {monthDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-sm font-medium text-gray-600 mb-2">
          {daysOfWeek.map((day) => (
            <div key={day} className="py-2">{day}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {leadingEmptyCells.map((_, i) => (
            <div key={`empty-leading-${i}`} className="py-2"></div>
          ))}
          {days.map((date) => {
            const isSelected = (selectedStartDate && date.toDateString() === selectedStartDate.toDateString()) ||
                               (selectedEndDate && date.toDateString() === selectedEndDate.toDateString());
            const isRange = selectedStartDate && selectedEndDate && date > selectedStartDate && date < selectedEndDate;
            const isToday = date.toDateString() === today.toDateString();
            const isPast = date < today;

            return (
              <button
                key={date.toISOString()}
                onClick={() => handleDateSelect(date)}
                disabled={isPast}
                className={`py-2 rounded-full text-center text-sm font-medium transition-colors duration-200
                  ${isSelected
                    ? 'bg-blue-600 text-white shadow-md'
                    : isRange
                      ? 'bg-blue-100 text-blue-800'
                      : isToday
                        ? 'border border-blue-500 text-blue-700'
                        : 'text-gray-800 hover:bg-gray-100'
                  }
                  ${isPast ? 'opacity-50 cursor-not-allowed text-gray-300' : ''}
                `}
              >
                {date.getDate()}
              </button>
            );
          })}
          {trailingEmptyCells.map((_, i) => (
            <div key={`empty-trailing-${i}`} className="py-2"></div>
          ))}
        </div>
      </div>
    );
  };

  const nextMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-2xl sm:max-w-md md:max-w-2xl lg:max-w-3xl xl:max-w-4xl max-h-[90vh] overflow-y-auto p-0 bg-background">
        <DialogHeader className="p-4 sm:p-6 pb-4 border-b border-border">
          <DialogTitle className="text-lg sm:text-xl font-semibold text-foreground">{title}</DialogTitle>
        </DialogHeader>

        <div className="p-4 sm:p-6">
          {/* Month Navigation */}
          <div className="flex justify-between items-center mb-4 sm:mb-6 px-2 sm:px-4">
            <button
              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}
              className="p-2 rounded-full hover:bg-accent transition-colors duration-200 flex-shrink-0"
            >
              <ChevronLeft size={20} className="sm:w-6 sm:h-6 text-muted-foreground" />
            </button>
            <div className="flex space-x-4 sm:space-x-8 overflow-x-auto scrollbar-hide flex-grow mx-2">
              {renderMonth(currentMonth)}
              <div className="hidden sm:block">
                {renderMonth(nextMonth)}
              </div>
            </div>
            <button
              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
              className="p-2 rounded-full hover:bg-accent transition-colors duration-200 flex-shrink-0"
            >
              <ChevronRight size={20} className="sm:w-6 sm:h-6 text-muted-foreground" />
            </button>
          </div>

          {/* Bottom controls */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-4 sm:pt-6 border-t border-border gap-4 sm:gap-0">
            {/* Return flight toggle */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <div className="flex items-center gap-2">
                <Switch
                  checked={showReturnFlight}
                  onCheckedChange={handleReturnToggle}
                  className="data-[state=checked]:bg-blue-600"
                />
                <span className="text-sm font-medium text-foreground">Return Flight</span>
              </div>
              
              {/* Selected dates display */}
              {selectedStartDate && (
                <div className="text-sm text-muted-foreground">
                  {format(selectedStartDate, 'EEE, d MMM')}
                  {selectedEndDate && ` - ${format(selectedEndDate, 'EEE, d MMM')}`}
                </div>
              )}
            </div>
            
            {/* Finish button */}
            <Button 
              onClick={handleFinish}
              className="w-full sm:w-auto px-6 sm:px-8 py-2 rounded-full font-medium"
              disabled={!selectedStartDate || (showReturnFlight && !selectedEndDate)}
            >
              Finish
            </Button>
          </div>
        </div>

        {/* Custom CSS for scrollbar hiding */}
        <style>{`
          .scrollbar-hide {
            -ms-overflow-style: none;  /* IE and Edge */
            scrollbar-width: none;  /* Firefox */
          }
          .scrollbar-hide::-webkit-scrollbar {
            display: none; /* Chrome, Safari, Opera*/
          }
        `}</style>
      </DialogContent>
    </Dialog>
  );
}