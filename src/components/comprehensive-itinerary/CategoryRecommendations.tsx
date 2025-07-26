// src/components/comprehensive-itinerary/CategoryRecommendations.tsx

import React from 'react';
import { Star, MapPin, DollarSign, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CategoryRecommendation } from '@/lib/schemas';

interface CategoryRecommendationsProps {
  recommendations: CategoryRecommendation[];
}

export const CategoryRecommendations: React.FC<CategoryRecommendationsProps> = ({ 
  recommendations 
}) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Additional Recommendations</h2>
      
      {recommendations.map((category, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Star className="h-5 w-5 text-primary" />
              {category.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {category.items.map((item, itemIndex) => (
                <div 
                  key={itemIndex}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  {item.imageUrl && (
                    <div className="mb-3">
                      <img 
                        src={item.imageUrl} 
                        alt={item.name}
                        className="w-full h-32 object-cover rounded-md"
                      />
                    </div>
                  )}
                  
                  <h4 className="font-semibold mb-2">{item.name}</h4>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
                    {item.description}
                  </p>
                  
                  <div className="space-y-2">
                    {item.location && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {item.location}
                      </div>
                    )}
                    
                    {item.cost && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <DollarSign className="h-3 w-3" />
                        {item.cost}
                      </div>
                    )}
                    
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="w-full text-xs mt-2"
                      onClick={() => {
                        // Could integrate with booking system or external links
                        console.log('Learn more about:', item.name);
                      }}
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Learn More
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};