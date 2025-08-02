import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, DollarSign, Star, Sparkles } from 'lucide-react';
import { Recommendation } from '@/hooks/useRecommendations';
import { useBehaviorTracking } from '@/hooks/useBehaviorTracking';

interface RecommendationCardProps {
  recommendation: Recommendation;
  onSelect?: (recommendation: Recommendation) => void;
  compact?: boolean;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  recommendation,
  onSelect,
  compact = false
}) => {
  const { trackClick } = useBehaviorTracking();
  const { recommendation_data: data, confidence_score } = recommendation;

  const handleSelect = () => {
    trackClick('recommendation_select', {
      recommendation_id: recommendation.id,
      recommendation_type: recommendation.recommendation_type,
      confidence_score,
      title: data.title
    });
    onSelect?.(recommendation);
  };

  const getConfidenceColor = (score: number) => {
    if (score >= 0.8) return 'text-green-600 bg-green-50';
    if (score >= 0.6) return 'text-blue-600 bg-blue-50';
    if (score >= 0.4) return 'text-yellow-600 bg-yellow-50';
    return 'text-gray-600 bg-gray-50';
  };

  const formatMetadataValue = (key: string, value: any) => {
    switch (key) {
      case 'price_range':
        return value;
      case 'duration':
        return value;
      case 'best_time':
        return value;
      case 'activities':
        return Array.isArray(value) ? value.slice(0, 3).join(', ') : value;
      default:
        return String(value);
    }
  };

  const getMetadataIcon = (key: string) => {
    switch (key) {
      case 'location':
        return <MapPin className="h-3 w-3" />;
      case 'duration':
        return <Clock className="h-3 w-3" />;
      case 'price_range':
        return <DollarSign className="h-3 w-3" />;
      default:
        return null;
    }
  };

  if (compact) {
    return (
      <Card className="cursor-pointer hover:shadow-md transition-shadow bg-gradient-to-br from-background to-muted/20" 
            onClick={handleSelect}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="h-4 w-4 text-primary" />
                <h4 className="font-medium text-sm truncate">{data.title}</h4>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                {data.description}
              </p>
              {data.metadata?.location && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  <span>{data.metadata.location}</span>
                </div>
              )}
            </div>
            <Badge 
              variant="secondary" 
              className={`text-xs ${getConfidenceColor(confidence_score)}`}
            >
              <Star className="h-3 w-3 mr-1" />
              {Math.round(confidence_score * 100)}%
            </Badge>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 bg-gradient-to-br from-background to-muted/20 border-l-4 border-l-primary/30">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">{data.title}</CardTitle>
          </div>
          <Badge 
            variant="secondary" 
            className={`${getConfidenceColor(confidence_score)} font-medium`}
          >
            <Star className="h-3 w-3 mr-1" />
            {Math.round(confidence_score * 100)}% match
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-muted-foreground leading-relaxed">
          {data.description}
        </p>
        
        {data.reasoning && (
          <div className="bg-muted/50 rounded-lg p-3">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium">Why this matches:</span> {data.reasoning}
            </p>
          </div>
        )}
        
        {data.metadata && Object.keys(data.metadata).length > 0 && (
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(data.metadata)
              .slice(0, 4)
              .map(([key, value]) => (
                <div key={key} className="flex items-center gap-2 text-sm">
                  {getMetadataIcon(key)}
                  <span className="text-muted-foreground capitalize">
                    {key.replace('_', ' ')}:
                  </span>
                  <span className="font-medium">
                    {formatMetadataValue(key, value)}
                  </span>
                </div>
              ))}
          </div>
        )}
        
        <div className="flex justify-between items-center pt-2">
          <span className="text-xs text-muted-foreground">
            Generated {new Date(recommendation.generated_at).toLocaleDateString()}
          </span>
          <Button 
            onClick={handleSelect}
            size="sm"
            className="ml-auto"
          >
            Explore This
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
