import { Badge } from "@/components/ui/badge";
import { Info, Wifi, WifiOff } from "lucide-react";

interface HotelResultsHeaderProps {
  title: string;
  subtitle: string;
  count: number;
  sortInfo: string;
  apiStatus?: 'live' | 'demo';
}

const HotelResultsHeader = ({ title, subtitle, count, sortInfo, apiStatus = 'demo' }: HotelResultsHeaderProps) => {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-2">
        <h1 className="text-2xl font-bold">{title}</h1>
        
        {/* API Status Indicator */}
        <Badge 
          variant={apiStatus === 'live' ? 'default' : 'secondary'}
          className="flex items-center gap-1"
        >
          {apiStatus === 'live' ? (
            <>
              <Wifi className="w-3 h-3" />
              Live API
            </>
          ) : (
            <>
              <WifiOff className="w-3 h-3" />
              Demo Mode
            </>
          )}
        </Badge>
      </div>
      
      <p className="text-muted-foreground mb-4">{subtitle}</p>
      
      {apiStatus === 'demo' && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4 p-3 bg-muted/50 rounded-lg">
          <Info className="w-4 h-4" />
          <span>
            Showing enhanced demo hotels with real images. Live Hotelbeds API integration coming soon.
          </span>
        </div>
      )}
      
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {count} hotel{count !== 1 ? 's' : ''} found
        </p>
        <p className="text-sm text-muted-foreground">{sortInfo}</p>
      </div>
    </div>
  );
};

export default HotelResultsHeader;