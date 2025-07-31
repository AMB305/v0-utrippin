import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sun, Cloud, CloudRain } from 'lucide-react';

interface MonthData {
  month: string;
  temp: string;
  aqi: string;
  icon: 'sun' | 'cloud' | 'cloud-rain';
  highlight?: boolean;
}

interface WeatherStripProps {
  destination: string;
  monthsData: MonthData[];
  bestTimeToVisit: string;
  className?: string;
}

const WeatherIcon: React.FC<{ icon: string; className?: string }> = ({ icon, className = "" }) => {
  const iconProps = { size: 24, className: `my-1 md:my-2 ${className}` };
  
  switch (icon) {
    case 'sun':
      return <Sun {...iconProps} className={`text-yellow-500 ${iconProps.className}`} />;
    case 'cloud':
      return <Cloud {...iconProps} className={`text-gray-400 ${iconProps.className}`} />;
    case 'cloud-rain':
      return <CloudRain {...iconProps} className={`text-blue-500 ${iconProps.className}`} />;
    default:
      return <Sun {...iconProps} className={`text-yellow-500 ${iconProps.className}`} />;
  }
};

export const WeatherStrip: React.FC<WeatherStripProps> = ({ 
  destination, 
  monthsData, 
  bestTimeToVisit,
  className = ""
}) => {
  return (
    <Card className={`rounded-2xl shadow-md p-6 mb-10 ${className}`}>
      <CardContent className="p-0">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl md:text-2xl font-bold">Weather in {destination}</h2>
          <Button className="rounded-full text-xs md:text-sm px-4 py-1 h-auto bg-green-100 text-green-700 hover:bg-green-200">
            Best time to visit: {bestTimeToVisit}
          </Button>
        </div>
        <div className="grid grid-cols-6 md:grid-cols-12 gap-4 text-center">
          {monthsData.map(({ month, temp, aqi, icon, highlight }) => (
            <div
              key={month}
              className={`flex flex-col items-center p-2 rounded-xl transition-all ${
                highlight ? 'bg-green-50 ring-2 ring-green-200' : ''
              }`}
            >
              <span className="text-lg font-semibold">{month}</span>
              <WeatherIcon icon={icon} />
              <span className="text-sm font-medium">{temp}</span>
              <span 
                className="text-xs text-white px-2 py-1 rounded-full mt-1" 
                style={{ backgroundColor: '#20A865' }}
              >
                AQI {aqi}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};