import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MapPin, Calendar, Users, Heart, MessageCircle, Star, Bookmark, Clock, DollarSign } from 'lucide-react';
import { TravelBuddyProfile } from '@/services/TravelBuddyService';
import { PublicTrip } from '@/services/TripService';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { travelBuddyService } from '@/services/TravelBuddyService';

interface EnhancedTravelBuddyCardProps {
  traveler?: TravelBuddyProfile;
  trip?: PublicTrip;
  type: 'traveler' | 'trip' | 'group' | 'local' | 'story';
  onConnect?: () => void;
  onSave?: () => void;
  className?: string;
}

const EnhancedTravelBuddyCard: React.FC<EnhancedTravelBuddyCardProps> = ({
  traveler,
  trip,
  type,
  onConnect,
  onSave,
  className = ''
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = async () => {
    try {
      const id = traveler?.id || trip?.id || '';
      await travelBuddyService.saveToWishlist(user?.id || null, id, type);
      setIsSaved(true);
      
      toast({
        title: user ? "Saved to your wishlist" : "Saved locally",
        description: user 
          ? "You can find this in your saved items." 
          : "Sign up to sync your saves across devices.",
      });
      
      onSave?.();
    } catch (error) {
      toast({
        title: "Error saving item",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  const handleConnect = () => {
    onConnect?.();
  };

  const handleViewFullProfile = () => {
    if (!user) {
      onConnect?.();
      return;
    }
    setIsModalOpen(true);
  };

  // Render traveler card
  if (type === 'traveler' && traveler) {
    return (
      <>
        <Card className={`cursor-pointer hover:shadow-medium transition-all duration-300 ${className}`}>
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={traveler.profile_photo_url || ''} alt={traveler.email} />
                  <AvatarFallback>{traveler.email.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-semibold">{traveler.email.split('@')[0]}</h4>
                  {traveler.age && <p className="text-sm text-muted-foreground">Age {traveler.age}</p>}
                  {traveler.location && (
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {traveler.location}
                    </p>
                  )}
                </div>
              </div>
              {traveler.compatibility_score && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Star className="w-3 h-3" />
                  {Math.round(traveler.compatibility_score * 100)}%
                </Badge>
              )}
            </div>
          </CardHeader>
          
          <CardContent className="pt-0">
            {traveler.bio && (
              <p className="text-sm mb-3 line-clamp-2">{traveler.bio}</p>
            )}
            
            {/* Travel Style & Interests */}
            <div className="space-y-2 mb-4">
              {traveler.travel_style && (
                <Badge variant="outline" className="text-xs">
                  {traveler.travel_style}
                </Badge>
              )}
              {traveler.interests && traveler.interests.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {traveler.interests.slice(0, 3).map((interest, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {interest}
                    </Badge>
                  ))}
                  {traveler.interests.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{traveler.interests.length - 3}
                    </Badge>
                  )}
                </div>
              )}
            </div>

            {/* Preferred Destinations */}
            {traveler.preferred_destinations && traveler.preferred_destinations.length > 0 && (
              <div className="mb-4">
                <p className="text-xs text-muted-foreground mb-1">Wants to visit:</p>
                <div className="flex flex-wrap gap-1">
                  {traveler.preferred_destinations.slice(0, 2).map((dest, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {dest}
                    </Badge>
                  ))}
                  {traveler.preferred_destinations.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{traveler.preferred_destinations.length - 2}
                    </Badge>
                  )}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2">
              <Button size="sm" onClick={handleViewFullProfile} className="flex-1">
                {user ? 'View Profile' : 'Sign up to view'}
              </Button>
              <Button size="sm" variant="outline" onClick={handleSave}>
                <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Full Profile Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={traveler.profile_photo_url || ''} alt={traveler.email} />
                  <AvatarFallback>{traveler.email.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-2xl">{traveler.email.split('@')[0]}</h2>
                  {traveler.location && (
                    <p className="text-muted-foreground flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {traveler.location}
                    </p>
                  )}
                  {traveler.compatibility_score && (
                    <Badge variant="secondary" className="flex items-center gap-1 w-fit mt-1">
                      <Star className="w-3 h-3" />
                      {Math.round(traveler.compatibility_score * 100)}% compatible
                    </Badge>
                  )}
                </div>
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              {traveler.bio && (
                <div>
                  <h3 className="font-semibold mb-2">About</h3>
                  <p className="text-muted-foreground">{traveler.bio}</p>
                </div>
              )}

              {traveler.interests && traveler.interests.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Interests</h3>
                  <div className="flex flex-wrap gap-2">
                    {traveler.interests.map((interest, index) => (
                      <Badge key={index} variant="secondary">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {traveler.preferred_destinations && traveler.preferred_destinations.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Dream Destinations</h3>
                  <div className="flex flex-wrap gap-2">
                    {traveler.preferred_destinations.map((dest, index) => (
                      <Badge key={index} variant="outline">
                        {dest}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button onClick={handleConnect} className="flex-1">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
                <Button variant="outline" onClick={handleSave}>
                  <Heart className="w-4 h-4 mr-2" />
                  Save Profile
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  // Render trip card
  if (type === 'trip' && trip) {
    return (
      <>
        <Card className={`cursor-pointer hover:shadow-medium transition-all duration-300 ${className}`}>
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-semibold text-lg">{trip.title}</h4>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {trip.destination}
                  {trip.country && `, ${trip.country}`}
                </p>
              </div>
              {trip.spots_available !== undefined && (
                <Badge variant={trip.spots_available > 0 ? "default" : "secondary"}>
                  {trip.spots_available} spots left
                </Badge>
              )}
            </div>
          </CardHeader>
          
          <CardContent className="pt-0">
            {/* Trip Details */}
            <div className="space-y-2 mb-4">
              {trip.start_date && trip.end_date && (
                <p className="text-sm flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(trip.start_date).toLocaleDateString()} - {new Date(trip.end_date).toLocaleDateString()}
                </p>
              )}
              
              {trip.duration_days && (
                <p className="text-sm flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {trip.duration_days} days
                </p>
              )}

              {trip.budget && (
                <p className="text-sm flex items-center gap-1">
                  <DollarSign className="w-3 h-3" />
                  ${trip.budget} budget
                </p>
              )}

              {trip.max_buddies && (
                <p className="text-sm flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  Looking for {trip.max_buddies - (trip.participants_count || 0)} more travelers
                </p>
              )}
            </div>

            {/* Trip Type & Style */}
            {trip.trip_type && (
              <div className="mb-4">
                <Badge variant="outline" className="text-xs">
                  {trip.trip_type}
                </Badge>
              </div>
            )}

            {/* Organizer Info */}
            {trip.organizer && (
              <div className="flex items-center gap-2 mb-4 p-2 bg-muted/50 rounded-md">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={trip.organizer.profile_photo_url || ''} alt={trip.organizer.email} />
                  <AvatarFallback className="text-xs">
                    {trip.organizer.email.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">
                    Organized by {trip.organizer.email.split('@')[0]}
                  </p>
                  {trip.organizer.location && (
                    <p className="text-xs text-muted-foreground">
                      {trip.organizer.location}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2">
              <Button size="sm" onClick={handleViewFullProfile} className="flex-1">
                {user ? 'View Details' : 'Sign up to apply'}
              </Button>
              <Button size="sm" variant="outline" onClick={handleSave}>
                <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Trip Details Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{trip.title}</DialogTitle>
              <DialogDescription className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {trip.destination}{trip.country && `, ${trip.country}`}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Trip Overview */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Trip Details</h4>
                  <div className="space-y-1 text-sm">
                    {trip.start_date && trip.end_date && (
                      <p className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {new Date(trip.start_date).toLocaleDateString()} - {new Date(trip.end_date).toLocaleDateString()}
                      </p>
                    )}
                    {trip.duration_days && (
                      <p className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {trip.duration_days} days
                      </p>
                    )}
                    {trip.budget && (
                      <p className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        ${trip.budget} budget
                      </p>
                    )}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Group Info</h4>
                  <div className="space-y-1 text-sm">
                    <p className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      {trip.participants_count || 0} joined, {trip.spots_available} spots left
                    </p>
                  </div>
                </div>
              </div>

              {/* Organizer */}
              {trip.organizer && (
                <div>
                  <h4 className="font-semibold mb-2">Trip Organizer</h4>
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-md">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={trip.organizer.profile_photo_url || ''} alt={trip.organizer.email} />
                      <AvatarFallback>
                        {trip.organizer.email.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{trip.organizer.email.split('@')[0]}</p>
                      {trip.organizer.location && (
                        <p className="text-sm text-muted-foreground">{trip.organizer.location}</p>
                      )}
                      {trip.organizer.age && (
                        <p className="text-sm text-muted-foreground">Age {trip.organizer.age}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button onClick={handleConnect} className="flex-1">
                  Apply to Join Trip
                </Button>
                <Button variant="outline" onClick={handleSave}>
                  <Heart className="w-4 h-4 mr-2" />
                  Save Trip
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return null;
};

export default EnhancedTravelBuddyCard;