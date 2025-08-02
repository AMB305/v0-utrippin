import React, { useState } from 'react';
import { format } from "date-fns";
import { Calendar as CalendarIcon, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DateRange {
  checkIn: Date | undefined;
  checkOut: Date | undefined;
}

interface DateRangePickerProps {
  value: DateRange;
  onChange: (dates: DateRange) => void;
  className?: string;
}

export function DateRangePicker({ value, onChange, className }: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleCheckInSelect = (date: Date | undefined) => {
    if (date) {
      onChange({
        checkIn: date,
        checkOut: value.checkOut && date >= value.checkOut ? undefined : value.checkOut
      });
    }
  };

  const handleCheckOutSelect = (date: Date | undefined) => {
    if (date && value.checkIn && date > value.checkIn) {
      onChange({
        checkIn: value.checkIn,
        checkOut: date
      });
      setIsOpen(false);
    }
  };

  const formatDateRange = () => {
    if (value.checkIn && value.checkOut) {
      return `${format(value.checkIn, "MMM dd")} - ${format(value.checkOut, "MMM dd, yyyy")}`;
    }
    if (value.checkIn) {
      return `${format(value.checkIn, "MMM dd, yyyy")} - Check-out`;
    }
    return "Check-in - Check-out";
  };

  const getNights = () => {
    if (value.checkIn && value.checkOut) {
      const diffTime = Math.abs(value.checkOut.getTime() - value.checkIn.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays === 1 ? "1 night" : `${diffDays} nights`;
    }
    return "";
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "justify-start text-left font-normal bg-muted/50 hover:bg-muted border-border",
            !value.checkIn && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 flex-shrink-0" />
          <div className="flex flex-col items-start">
            <span className="text-sm">{formatDateRange()}</span>
            {getNights() && (
              <span className="text-xs text-muted-foreground">{getNights()}</span>
            )}
          </div>
          <ChevronDown className="ml-auto h-4 w-4 flex-shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="flex">
          <div className="p-3 border-r">
            <div className="text-sm font-medium mb-2">Check-in</div>
            <Calendar
              mode="single"
              selected={value.checkIn}
              onSelect={handleCheckInSelect}
              disabled={(date) => date < new Date()}
              className="pointer-events-auto"
            />
          </div>
          <div className="p-3">
            <div className="text-sm font-medium mb-2">Check-out</div>
            <Calendar
              mode="single"
              selected={value.checkOut}
              onSelect={handleCheckOutSelect}
              disabled={(date) => 
                date < new Date() || 
                (value.checkIn ? date <= value.checkIn : true)
              }
              className="pointer-events-auto"
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
