import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RefreshCw, Sparkles, TrendingUp, Clock, MapPin } from 'lucide-react';
import { useRecommendations } from '@/hooks/useRecommendations';
import { RecommendationCard } from './RecommendationCard';
import { Skeleton } from '@/components/ui/skeleton';

interface RecommendationsPanelProps {
  className?: string;
  onRecommendationSelect?: (recommendation: any) => void;
}

export const RecommendationsPanel: React.FC<RecommendationsPanelProps> = ({
  className = '',
  onRecommendationSelect
}) => {
  const [activeTab, setActiveTab] = useState<'destination' | 'activity' | 'budget'>('destination');
  
  const destinationRecs = useRecommendations({ type: 'destination' });
  const activityRecs = useRecommendations({ type: 'activity' });
  const budgetRecs = useRecommendations({ type: 'budget' });

  const getCurrentRecommendations = () => {
    switch (activeTab) {
      case 'destination':
        return destinationRecs;
      case 'activity':
        return activityRecs;
      case 'budget':
        return budgetRecs;
      default:
        return destinationRecs;
    }
  };

  const currentRecs = getCurrentRecommendations();
  const topRecommendations = currentRecs.getTopRecommendations(3);

  const handleRefresh = () => {
    currentRecs.refreshRecommendations();
  };

  const LoadingSkeleton = () => (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <Card key={i}>
          <CardContent className="p-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-2/3" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-20" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <Card className={`bg-gradient-to-br from-background to-primary/5 ${className}`}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">AI Recommendations</CardTitle>
            {currentRecs.lastUpdated && (
              <Badge variant="outline" className="text-xs">
                <Clock className="h-3 w-3 mr-1" />
                {currentRecs.lastUpdated.toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </Badge>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={currentRecs.loading}
            className="shrink-0"
          >
            <RefreshCw className={`h-4 w-4 ${currentRecs.loading ? 'animate-spin' : ''}`} />
            <span className="ml-2">Refresh</span>
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Personalized suggestions based on your travel preferences and behavior
        </p>
      </CardHeader>

      <CardContent>
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="destination" className="text-xs">
              <MapPin className="h-3 w-3 mr-1" />
              Places
            </TabsTrigger>
            <TabsTrigger value="activity" className="text-xs">
              <TrendingUp className="h-3 w-3 mr-1" />
              Activities
            </TabsTrigger>
            <TabsTrigger value="budget" className="text-xs">
              <Sparkles className="h-3 w-3 mr-1" />
              Budget
            </TabsTrigger>
          </TabsList>

          <TabsContent value="destination" className="mt-0">
            {destinationRecs.loading && <LoadingSkeleton />}
            {destinationRecs.error && (
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-sm text-muted-foreground">
                    Unable to load recommendations. {destinationRecs.error}
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => destinationRecs.refreshRecommendations()}
                    className="mt-2"
                  >
                    Try Again
                  </Button>
                </CardContent>
              </Card>
            )}
            {!destinationRecs.loading && !destinationRecs.error && (
              <div className="space-y-3">
                {topRecommendations.length === 0 ? (
                  <Card>
                    <CardContent className="p-4 text-center">
                      <Sparkles className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        Start exploring to get personalized recommendations!
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  topRecommendations.map((rec) => (
                    <RecommendationCard
                      key={rec.id}
                      recommendation={rec}
                      onSelect={onRecommendationSelect}
                      compact
                    />
                  ))
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="activity" className="mt-0">
            {activityRecs.loading && <LoadingSkeleton />}
            {activityRecs.error && (
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-sm text-muted-foreground">
                    Unable to load activity recommendations. {activityRecs.error}
                  </p>
                </CardContent>
              </Card>
            )}
            {!activityRecs.loading && !activityRecs.error && (
              <div className="space-y-3">
                {activityRecs.getTopRecommendations(3).map((rec) => (
                  <RecommendationCard
                    key={rec.id}
                    recommendation={rec}
                    onSelect={onRecommendationSelect}
                    compact
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="budget" className="mt-0">
            {budgetRecs.loading && <LoadingSkeleton />}
            {budgetRecs.error && (
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-sm text-muted-foreground">
                    Unable to load budget recommendations. {budgetRecs.error}
                  </p>
                </CardContent>
              </Card>
            )}
            {!budgetRecs.loading && !budgetRecs.error && (
              <div className="space-y-3">
                {budgetRecs.getTopRecommendations(3).map((rec) => (
                  <RecommendationCard
                    key={rec.id}
                    recommendation={rec}
                    onSelect={onRecommendationSelect}
                    compact
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};