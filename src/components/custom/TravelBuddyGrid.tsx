import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Check } from 'lucide-react';

interface TravelBuddy {
  id: string;
  name: string;
  avatarUrl: string;
  location: string;
  isOnline: boolean;
  isVerified: boolean;
  connectStatus?: 'none' | 'pending' | 'connected';
}

interface TravelBuddyGridProps {
  buddies: TravelBuddy[];
  onConnect: (buddyId: string) => void;
  selectedBuddyId?: string;
}

const TravelBuddyGrid: React.FC<TravelBuddyGridProps> = ({ 
  buddies, 
  onConnect, 
  selectedBuddyId 
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {buddies.map((buddy) => (
        <div 
          key={buddy.id}
          className={`bg-white rounded-2xl p-4 shadow-soft grid grid-rows-[auto,1fr,auto] gap-2 hover-lift ${
            selectedBuddyId === buddy.id ? 'ring-2 ring-red-600' : ''
          }`}
        >
          <div className="relative mx-auto">
            <img 
              src={buddy.avatarUrl} 
              alt={buddy.name}
              className="w-24 h-24 rounded-full object-cover"
            />
            {buddy.isOnline && (
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-3 border-white"></div>
            )}
            {buddy.isVerified && (
              <Badge className="absolute -top-2 -right-2 bg-blue-600 text-white px-2 py-1 text-xs">
                <Check className="w-3 h-3 mr-1" />
                Verified
              </Badge>
            )}
          </div>
          
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-1">{buddy.name}</h3>
            <p className="text-sm text-gray-600 flex items-center justify-center gap-1">
              <MapPin className="w-4 h-4" />
              {buddy.location}
            </p>
            {buddy.isOnline && (
              <Badge className="mt-2 bg-green-100 text-green-800">
                Online now
              </Badge>
            )}
          </div>
          
          <Button 
            className={`w-full py-2 rounded-lg font-medium transition-colors ${
              buddy.connectStatus === 'pending' 
                ? 'bg-gray-400 text-white cursor-not-allowed' 
                : buddy.connectStatus === 'connected'
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-red-600 hover:bg-red-700 text-white'
            }`}
            onClick={() => onConnect(buddy.id)}
            disabled={buddy.connectStatus === 'pending'}
          >
            {buddy.connectStatus === 'pending' && 'Pending'}
            {buddy.connectStatus === 'connected' && 'Connected'}
            {!buddy.connectStatus && 'Connect'}
          </Button>
        </div>
      ))}
    </div>
  );
};

export default TravelBuddyGrid;