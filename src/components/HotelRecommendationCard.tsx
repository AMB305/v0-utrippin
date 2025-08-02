import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, MapPin, ExternalLink, Loader2 } from 'lucide-react';
import { useExpediaIntegration, type ExpediaHotelData } from '@/hooks/useExpediaIntegration';

interface Place {
  name: string;
  description: string;
  type: 'hotel' | 'restaurant' | 'activity' | 'destination';
}

interface HotelRecommendationCardProps {
  place: Place;
  destination?: string;
}

export const HotelRecommendationCard: React.FC<HotelRecommendationCardProps> = ({
  place,
  destination
}) => {
  const [expediaData, setExpediaData] = useState<ExpediaHotelData | null>(null);
  const { fetchExpediaHotelData, isHotelLoading } = useExpediaIntegration();

  useEffect(() => {
    if (place.type === 'hotel') {
      fetchExpediaHotelData(place.name, destination)
        .then(setExpediaData)
        .catch(console.error);
    }
  }, [place.name, place.type, destination]);

  if (place.type !== 'hotel') {
    return (
      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="p-4">
          <h4 className="font-semibold text-sm mb-2">{place.name}</h4>
          <p className="text-xs text-muted-foreground">{place.description}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="p-4 pb-2">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-sm font-semibold mb-1">{place.name}</CardTitle>
            {expediaData?.rating && (
              <div className="flex items-center gap-1 mb-2">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs font-medium">{expediaData.rating}</span>
              </div>
            )}
          </div>
          {expediaData?.imageUrl && (
            <img 
              src={expediaData.imageUrl} 
              alt={place.name}
              className="w-16 h-12 rounded object-cover ml-2"
            />
          )}
        </div>
      </CardHeader>
      
      <CardContent className="p-4 pt-0">
        <p className="text-xs text-muted-foreground mb-3">{place.description}</p>
        
        {expediaData?.price && (
          <div className="mb-3">
            <p className="text-xs font-medium text-primary">{expediaData.price}</p>
          </div>
        )}
        
        <div className="flex flex-col gap-2">
          {isHotelLoading(place.name) ? (
            <Button disabled size="sm" className="w-full">
              <Loader2 className="w-3 h-3 mr-2 animate-spin" />
              Loading rates...
            </Button>
          ) : expediaData?.bookingUrl ? (
            <Button 
              size="sm" 
              className="w-full"
              onClick={() => window.open(expediaData.bookingUrl, '_blank')}
            >
              <ExternalLink className="w-3 h-3 mr-2" />
              Book on Expedia
            </Button>
          ) : (
            <Button 
              size="sm" 
              variant="outline" 
              className="w-full"
              onClick={() => {
                const fallbackUrl = `https://www.expedia.com/Hotel-Search?destination=${encodeURIComponent(place.name)}&clickref=1110l15dQSW&camref=1110l15dQSW`;
                window.open(fallbackUrl, '_blank');
              }}
            >
              <ExternalLink className="w-3 h-3 mr-2" />
              Search on Expedia
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
