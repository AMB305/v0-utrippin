// src/components/comprehensive-itinerary/BookingModule.tsx

import React, { useState, useEffect } from 'react';
import { ExternalLink, Star, Plane, Hotel, Crown, DollarSign, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookingModule as BookingModuleType } from '@/lib/schemas';
import { useAuth } from '@/hooks/useAuth';
import { personalizationService } from '@/services/PersonalizationService';

interface BookingModuleProps {
  module: BookingModuleType;
  type: 'flights' | 'accommodations';
}

export const BookingModule: React.FC<BookingModuleProps> = ({ module, type }) => {
  const { user } = useAuth();
  const [isAgent, setIsAgent] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAgentStatus = async () => {
      if (user?.id) {
        try {
          const personalizationData = await personalizationService.getUserPersonalizationData(user.id);
          setIsAgent(personalizationData?.isAgent || false);
        } catch (error) {
          console.error('Error checking agent status:', error);
        }
      }
      setLoading(false);
    };

    checkAgentStatus();
  }, [user?.id]);

  const getIcon = () => {
    return type === 'flights' ? <Plane className="h-5 w-5" /> : <Hotel className="h-5 w-5" />;
  };

  const getColorClasses = () => {
    return type === 'flights' 
      ? 'from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
      : 'from-green-500 to-green-600 hover:from-green-600 hover:to-green-700';
  };

  const trackAgentClick = (itemName: string, linkType: 'booking' | 'agent') => {
    if (isAgent) {
      // Track agent clicks for analytics (could be enhanced with an API call)
      console.log(`Agent click tracked: ${itemName} - ${linkType} link`);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3">
            {getIcon()}
            {module.title}
          </CardTitle>
          {isAgent && (
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-amber-100 text-amber-800 border-amber-200">
                <Crown className="h-3 w-3 mr-1" />
                Agent
              </Badge>
              <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                <DollarSign className="h-3 w-3 mr-1" />
                Commission
              </Badge>
            </div>
          )}
        </div>
        {isAgent && (
          <p className="text-sm text-muted-foreground mt-2">
            These options include your affiliate tracking for commission earning.
          </p>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {module.items.map((item, index) => (
          <div 
            key={index}
            className="border rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h4 className="font-semibold text-lg">{item.name}</h4>
                {item.description && (
                  <p className="text-muted-foreground text-sm mt-1">{item.description}</p>
                )}
              </div>
              
              <div className="text-right ml-4">
                <div className="text-2xl font-bold text-primary">{item.price}</div>
                {item.rating && (
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm text-muted-foreground">{item.rating}</span>
                  </div>
                )}
              </div>
            </div>
            
            {item.amenities && item.amenities.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {item.amenities.map((amenity, idx) => (
                  <Badge key={idx} variant="secondary" className="text-xs">
                    {amenity}
                  </Badge>
                ))}
              </div>
            )}
            
            <div className="flex gap-3">
              <Button 
                className={`flex-1 bg-gradient-to-r ${getColorClasses()} text-white border-0 ${
                  isAgent ? 'ring-2 ring-amber-200 shadow-lg' : ''
                }`}
                onClick={() => {
                  trackAgentClick(item.name, 'booking');
                  window.open(item.bookingLink, '_blank');
                }}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                {isAgent ? 'Book & Earn Commission' : 'Book Now'}
                {isAgent && <DollarSign className="h-4 w-4 ml-2" />}
              </Button>
              
              {item.agentUrl && (
                <Button 
                  variant="outline"
                  onClick={() => {
                    trackAgentClick(item.name, 'agent');
                    window.open(item.agentUrl, '_blank');
                  }}
                  className="border-primary text-primary hover:bg-primary hover:text-white"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Agent View
                </Button>
              )}
              
              {isAgent && (
                <Badge 
                  variant="secondary" 
                  className="bg-amber-50 text-amber-700 border-amber-200 px-3 py-1 text-xs self-center"
                >
                  <Crown className="h-3 w-3 mr-1" />
                  Commission Enabled
                </Badge>
              )}
            </div>
          </div>
        ))}
        
        {module.defaultUrl && (
          <div className="text-center pt-4 border-t">
            <Button 
              variant="outline" 
              onClick={() => window.open(module.defaultUrl, '_blank')}
              className="text-sm"
            >
              View More Options
              <ExternalLink className="h-4 w-4 ml-2" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};