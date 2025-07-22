import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HotelRecommendationCard } from './HotelRecommendationCard';
import { type TravelResponse } from '@/hooks/useExpediaIntegration';

interface EnhancedTravelResponseProps {
  response: TravelResponse;
  onFollowUpClick: (question: string) => void;
  destination?: string;
}

export const EnhancedTravelResponse: React.FC<EnhancedTravelResponseProps> = ({
  response,
  onFollowUpClick,
  destination
}) => {
  return (
    <div className="space-y-4">
      {/* Title and Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{response.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{response.summary}</p>
        </CardContent>
      </Card>

      {/* Recommendations by Category */}
      {response.recommendations.map((category, categoryIndex) => (
        <Card key={categoryIndex}>
          <CardHeader>
            <CardTitle className="text-base">{category.category_name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {category.places.map((place, placeIndex) => (
                <HotelRecommendationCard
                  key={placeIndex}
                  place={place}
                  destination={destination}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Follow-up Questions */}
      {response.follow_up_questions && response.follow_up_questions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Continue the conversation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {response.follow_up_questions.map((question, questionIndex) => (
                <Button
                  key={questionIndex}
                  variant="outline"
                  size="sm"
                  onClick={() => onFollowUpClick(question)}
                  className="text-xs"
                >
                  {question}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};