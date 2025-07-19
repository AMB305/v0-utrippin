import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Heart, 
  MapPin, 
  Star, 
  Globe, 
  Calendar,
  MessageCircle,
  User,
  Languages,
  DollarSign,
  Users
} from 'lucide-react';
import { TravelBuddyMatch } from '@/hooks/useSmartMatching';

interface SmartMatchCardProps {
  match: TravelBuddyMatch;
  onLike?: (userId: string) => void;
  onMessage?: (userId: string) => void;
  onViewProfile?: (userId: string) => void;
  loading?: boolean;
}

const getQualityColor = (quality: string) => {
  switch (quality) {
    case 'Excellent': return 'bg-emerald-500';
    case 'Good': return 'bg-blue-500';
    case 'Fair': return 'bg-yellow-500';
    default: return 'bg-gray-500';
  }
};

const getFactorIcon = (type: string) => {
  switch (type) {
    case 'destinations': return <Globe className="w-3 h-3" />;
    case 'interests': return <Heart className="w-3 h-3" />;
    case 'languages': return <Languages className="w-3 h-3" />;
    case 'age': return <User className="w-3 h-3" />;
    case 'travel_style': return <Star className="w-3 h-3" />;
    case 'budget': return <DollarSign className="w-3 h-3" />;
    case 'location': return <MapPin className="w-3 h-3" />;
    case 'travel_pace': return <Calendar className="w-3 h-3" />;
    case 'group_size': return <Users className="w-3 h-3" />;
    default: return <Star className="w-3 h-3" />;
  }
};

export const SmartMatchCard: React.FC<SmartMatchCardProps> = ({
  match,
  onLike,
  onMessage,
  onViewProfile,
  loading = false
}) => {
  const displayName = match.buddy_email?.split('@')[0] || 'Travel Buddy';
  const initials = displayName.slice(0, 2).toUpperCase();

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 animate-fade-in group">
      <CardHeader className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="w-12 h-12">
              <AvatarImage src={match.buddy_photo} alt={displayName} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {initials}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <h3 className="font-semibold text-base truncate">{displayName}</h3>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="w-3 h-3" />
                <span className="truncate">{match.buddy_location || 'Location not specified'}</span>
              </div>
              {match.buddy_age && (
                <p className="text-sm text-muted-foreground">{match.buddy_age} years old</p>
              )}
            </div>
          </div>

          <div className="flex flex-col items-end space-y-1">
            <Badge 
              variant="secondary" 
              className={`${getQualityColor(match.matchQuality)} text-white text-xs px-2 py-1`}
            >
              {match.matchPercentage}% Match
            </Badge>
            <span className="text-xs font-medium text-muted-foreground">
              {match.matchQuality}
            </span>
          </div>
        </div>

        <div className="mt-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium">Compatibility</span>
            <span className="text-xs text-muted-foreground">{match.matchPercentage}%</span>
          </div>
          <Progress value={match.matchPercentage} className="h-2" />
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-0 space-y-4">
        {/* Bio */}
        {match.buddy_bio && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {match.buddy_bio}
          </p>
        )}

        {/* Travel Style */}
        {match.buddy_travel_style && (
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Travel Style:</span>
            <Badge variant="outline" className="text-xs">
              {match.buddy_travel_style}
            </Badge>
          </div>
        )}

        {/* Top Compatibility Factors */}
        {match.compatibilityFactors.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <Heart className="w-4 h-4 text-primary" />
              Why you match:
            </h4>
            <div className="space-y-1">
              {match.compatibilityFactors.slice(0, 3).map((factor, index) => (
                <div key={index} className="flex items-center gap-2 text-xs">
                  <div className="text-primary">
                    {getFactorIcon(factor.type)}
                  </div>
                  <span className="text-muted-foreground truncate">
                    {factor.description}
                  </span>
                  <Badge variant="secondary" className="text-xs px-1 py-0 ml-auto">
                    {Math.round(factor.score * 100)}%
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Common Interests */}
        {match.topCommonInterests.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Shared Interests:</h4>
            <div className="flex flex-wrap gap-1">
              {match.topCommonInterests.map((interest, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {interest}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Common Destinations */}
        {match.topCommonDestinations.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Dream Destinations:</h4>
            <div className="flex flex-wrap gap-1">
              {match.topCommonDestinations.map((destination, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  <Globe className="w-3 h-3 mr-1" />
                  {destination}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Languages */}
        {match.buddy_languages && match.buddy_languages.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <Languages className="w-4 h-4" />
              Languages:
            </h4>
            <div className="flex flex-wrap gap-1">
              {match.buddy_languages.slice(0, 3).map((language, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {language}
                </Badge>
              ))}
              {match.buddy_languages.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{match.buddy_languages.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onViewProfile?.(match.buddy_user_id)}
            disabled={loading}
          >
            <User className="w-4 h-4 mr-2" />
            View Profile
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onMessage?.(match.buddy_user_id)}
            disabled={loading}
          >
            <MessageCircle className="w-4 h-4" />
          </Button>
          
          <Button
            size="sm"
            onClick={() => onLike?.(match.buddy_user_id)}
            disabled={loading}
            className="hover-scale"
          >
            <Heart className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};