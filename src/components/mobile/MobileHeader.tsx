import { Bell, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface MobileHeaderProps {
  location?: string;
  showNotificationBadge?: boolean;
}

export function MobileHeader({ 
  location = "Miami Beach, Florida",
  showNotificationBadge = true 
}: MobileHeaderProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-mobile-section-bg">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-full bg-mobile-primary-teal flex items-center justify-center">
          <User className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="text-mobile-text-secondary text-sm">Current location</p>
          <p className="text-mobile-text-primary font-medium">{location}</p>
        </div>
      </div>
      
      <div className="relative">
        <Bell className="w-6 h-6 text-mobile-text-primary" />
        {showNotificationBadge && (
          <Badge 
            variant="secondary" 
            className="absolute -top-2 -right-2 w-5 h-5 p-0 flex items-center justify-center bg-yellow-500 text-black text-xs"
          >
            !
          </Badge>
        )}
      </div>
    </div>
  );
}