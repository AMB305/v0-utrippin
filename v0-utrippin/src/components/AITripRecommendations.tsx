import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, MapPin, Clock, DollarSign, Heart, Eye, Wand2 } from 'lucide-react';
import { useAIRecommendations } from '@/hooks/useAIRecommendations';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useAuth } from '@/hooks/useAuth';

export const AITripRecommendations = () => {
  const { 
    recommendations, 
    isLoading, 
    generateRecommendations, 
    fetchUserRecommendations,
    markAsViewed,
    saveRecommendation 
  } = useAIRecommendations();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchUserRecommendations();
    }
  }, [user]);

  const handleRecommendationClick = (recommendationId: string) => {
    markAsViewed(recommendationId);
  };

  if (!user) {
    return (
      <Card className="p-6 text-center">
        <div className="space-y-4">
          <Sparkles className="w-12 h-12 mx-auto text-primary" />
          <div>
            <h3 className="text-lg font-semibold">AI-Powered Trip Recommendations</h3>
            <p className="text-muted-foreground">
              Sign in to get personalized travel recommendations based on your preferences
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            AI Trip Recommendations
          </h2>
          <p className="text-muted-foreground">
            Personalized travel suggestions powered by AI
          </p>
        </div>
        <Button 
          onClick={generateRecommendations} 
          disabled={isLoading}
          className="gap-2"
        >
          <Wand2 className="w-4 h-4" />
          {isLoading ? 'Generating...' : 'Generate New'}
        </Button>
      </div>

      {isLoading && recommendations.length === 0 && (
        <div className="flex justify-center p-8">
          <LoadingSpinner />
        </div>
      )}

      {recommendations.length === 0 && !isLoading && (
        <Card className="p-8 text-center">
          <div className="space-y-4">
            <Sparkles className="w-16 h-16 mx-auto text-muted-foreground" />
            <div>
              <h3 className="text-lg font-semibold">No Recommendations Yet</h3>
              <p className="text-muted-foreground mb-4">
                Generate your first set of personalized travel recommendations
              </p>
              <Button onClick={generateRecommendations} className="gap-2">
                <Wand2 className="w-4 h-4" />
                Generate Recommendations
              </Button>
            </div>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.map((recommendation) => (
          <Card 
            key={recommendation.id} 
            className={`cursor-pointer transition-all hover:shadow-lg ${
              !recommendation.is_viewed ? 'ring-2 ring-primary/20' : ''
            }`}
            onClick={() => handleRecommendationClick(recommendation.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  {recommendation.destination}
                </CardTitle>
                <div className="flex gap-1">
                  {!recommendation.is_viewed && (
                    <Badge variant="secondary" className="text-xs">
                      <Eye className="w-3 h-3 mr-1" />
                      New
                    </Badge>
                  )}
                  {recommendation.is_saved && (
                    <Badge variant="outline" className="text-xs text-red-500">
                      <Heart className="w-3 h-3 mr-1 fill-current" />
                      Saved
                    </Badge>
                  )}
                </div>
              </div>
              <h3 className="text-sm font-medium text-muted-foreground">
                {recommendation.title}
              </h3>
            </CardHeader>

            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground line-clamp-3">
                {recommendation.description}
              </p>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  <span>${recommendation.estimated_budget}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span>{recommendation.duration_days} days</span>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium">Suggested Activities:</h4>
                <div className="flex flex-wrap gap-1">
                  {recommendation.activities.slice(0, 3).map((activity, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {activity}
                    </Badge>
                  ))}
                  {recommendation.activities.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{recommendation.activities.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-1">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-xs text-muted-foreground">
                    {Math.round(recommendation.confidence_score * 100)}% match
                  </span>
                </div>
                <Button
                  size="sm"
                  variant={recommendation.is_saved ? "outline" : "default"}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!recommendation.is_saved) {
                      saveRecommendation(recommendation.id);
                    }
                  }}
                  className="gap-1"
                >
                  <Heart className={`w-3 h-3 ${recommendation.is_saved ? 'fill-current text-red-500' : ''}`} />
                  {recommendation.is_saved ? 'Saved' : 'Save'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
