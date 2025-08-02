import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { duffelClient, DuffelAirport, formatPrice } from "@/lib/duffel";
import { cn } from "@/lib/utils";

interface PriceCalendarProps {
  origin?: DuffelAirport[];
  destination?: DuffelAirport[];
  onDateSelect?: (date: Date) => void;
  className?: string;
}

interface PriceData {
  date: string;
  price: string;
  currency: string;
}

interface CalendarDay {
  date: Date;
  price?: string;
  priceLevel: 'low' | 'medium' | 'high';
  isCurrentMonth: boolean;
  isToday: boolean;
  isWeekend: boolean;
}

export default function PriceCalendar({ 
  origin, 
  destination, 
  onDateSelect,
  className 
}: PriceCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [priceData, setPriceData] = useState<PriceData[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  useEffect(() => {
    if (origin?.length && destination?.length) {
      fetchPriceData();
    }
  }, [origin, destination, currentMonth]);

  const fetchPriceData = async () => {
    if (!origin?.length || !destination?.length) return;

    setLoading(true);
    try {
      // Use the first selected airport for pricing
      const originCode = origin[0].iata_code;
      const destinationCode = destination[0].iata_code;
      
      const result = await duffelClient.getPriceCalendar(
        originCode,
        destinationCode,
        currentMonth
      );
      setPriceData(result.data);
    } catch (error) {
      console.error('Error fetching price data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPriceLevel = (price: string): 'low' | 'medium' | 'high' => {
    const numPrice = parseFloat(price);
    if (numPrice < 300) return 'low';
    if (numPrice < 500) return 'medium';
    return 'high';
  };

  const generateCalendarDays = (): CalendarDay[] => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days: CalendarDay[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < 42; i++) { // 6 weeks * 7 days
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      const dateStr = date.toISOString().split('T')[0];
      const priceInfo = priceData.find(p => p.date === dateStr);
      
      days.push({
        date: new Date(date),
        price: priceInfo?.price,
        priceLevel: priceInfo ? getPriceLevel(priceInfo.price) : 'medium',
        isCurrentMonth: date.getMonth() === month,
        isToday: date.getTime() === today.getTime(),
        isWeekend: date.getDay() === 0 || date.getDay() === 6
      });
    }

    return days;
  };

  const handleDateClick = (day: CalendarDay) => {
    if (!day.isCurrentMonth || day.date < new Date()) return;
    
    setSelectedDate(day.date);
    onDateSelect?.(day.date);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(currentMonth.getMonth() + (direction === 'next' ? 1 : -1));
    setCurrentMonth(newMonth);
  };

  const calendarDays = generateCalendarDays();

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Best Travel Dates
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth('prev')}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="font-medium min-w-[120px] text-center">
              {months[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth('next')}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Price Legend */}
        <div className="flex items-center gap-4 text-sm pt-2">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
            <span>Under $300</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-orange-500 rounded-sm"></div>
            <span>$300-$500</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-500 rounded-sm"></div>
            <span>Over $500</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        {!origin?.length || !destination?.length ? (
          <div className="text-center py-8 text-muted-foreground">
            Select origin and destination to view pricing calendar
          </div>
        ) : (
          <>
            {/* Weekday Headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {weekdays.map((day) => (
                <div key={day} className="text-center text-sm font-medium text-muted-foreground p-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day, index) => {
                const isPast = day.date < new Date();
                const isSelected = selectedDate && day.date.getTime() === selectedDate.getTime();
                
                return (
                  <div
                    key={index}
                    className={cn(
                      "relative p-2 text-center text-sm border rounded cursor-pointer transition-colors",
                      {
                        // Date text styling
                        "text-muted-foreground": !day.isCurrentMonth,
                        "font-semibold": day.isToday,
                        "opacity-50 cursor-not-allowed": isPast,
                        
                        // Background colors based on price
                        "bg-green-100 hover:bg-green-200": day.isCurrentMonth && day.price && day.priceLevel === 'low' && !isPast,
                        "bg-orange-100 hover:bg-orange-200": day.isCurrentMonth && day.price && day.priceLevel === 'medium' && !isPast,
                        "bg-red-100 hover:bg-red-200": day.isCurrentMonth && day.price && day.priceLevel === 'high' && !isPast,
                        "bg-muted hover:bg-accent": day.isCurrentMonth && !day.price && !isPast,
                        
                        // Selection styling
                        "ring-2 ring-primary": isSelected,
                        
                        // Today styling
                        "ring-1 ring-blue-500": day.isToday && !isSelected,
                      }
                    )}
                    onClick={() => handleDateClick(day)}
                  >
                    <div className="font-medium">{day.date.getDate()}</div>
                    {day.price && day.isCurrentMonth && (
                      <div className="text-xs font-semibold mt-1">
                        ${day.price}+
                      </div>
                    )}
                    {loading && day.isCurrentMonth && (
                      <div className="text-xs text-muted-foreground mt-1">...</div>
                    )}
                  </div>
                );
              })}
            </div>

            {loading && (
              <div className="text-center py-4 text-sm text-muted-foreground">
                Loading prices...
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
