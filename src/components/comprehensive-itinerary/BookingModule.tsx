// src/components/comprehensive-itinerary/BookingModule.tsx

import React from 'react';
import { ExternalLink, Star, Plane, Hotel } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookingModule as BookingModuleType } from '@/lib/schemas';

interface BookingModuleProps {
  module: BookingModuleType;
  type: 'flights' | 'accommodations';
}

export const BookingModule: React.FC<BookingModuleProps> = ({ module, type }) => {
  const getIcon = () => {
    return type === 'flights' ? <Plane className="h-5 w-5" /> : <Hotel className="h-5 w-5" />;
  };

  const getColorClasses = () => {
    return type === 'flights' 
      ? 'from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
      : 'from-green-500 to-green-600 hover:from-green-600 hover:to-green-700';
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          {getIcon()}
          {module.title}
        </CardTitle>
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
                className={`flex-1 bg-gradient-to-r ${getColorClasses()} text-white border-0`}
                onClick={() => window.open(item.bookingLink, '_blank')}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Book Now
              </Button>
              
              {item.agentUrl && (
                <Button 
                  variant="outline"
                  onClick={() => window.open(item.agentUrl, '_blank')}
                  className="border-primary text-primary hover:bg-primary hover:text-white"
                >
                  Agent Link
                </Button>
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