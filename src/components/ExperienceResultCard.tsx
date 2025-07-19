import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Clock, Users, Heart, Award, Camera, CheckCircle } from "lucide-react";

interface ExperienceResult {
  id: string;
  title: string;
  location: string;
  images: string[];
  rating: number;
  reviewCount: number;
  duration: string;
  groupSize: string;
  category: string;
  difficulty: string;
  highlights: string[];
  included: string[];
  languages: string[];
  price: number;
  originalPrice?: number;
  currency: string;
  discount?: number;
  availability: string;
  instantConfirmation: boolean;
  freeCancellation: boolean;
  badge?: string;
  provider: string;
}

interface ExperienceResultCardProps {
  experience: ExperienceResult;
  onSelect: (experience: ExperienceResult) => void;
  selected?: boolean;
}

const ExperienceResultCard = ({ experience, onSelect, selected = false }: ExperienceResultCardProps) => {
  const getRatingColor = () => {
    if (experience.rating >= 4.5) return "text-green-600 bg-green-50";
    if (experience.rating >= 4.0) return "text-blue-600 bg-blue-50";
    if (experience.rating >= 3.5) return "text-orange-600 bg-orange-50";
    return "text-gray-600 bg-gray-50";
  };

  const getDifficultyColor = () => {
    switch (experience.difficulty.toLowerCase()) {
      case "easy":
        return "text-green-600 bg-green-50";
      case "moderate":
        return "text-yellow-600 bg-yellow-50";
      case "challenging":
        return "text-orange-600 bg-orange-50";
      case "expert":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <Card className={`hover:shadow-soft transition-all duration-300 cursor-pointer ${selected ? 'ring-2 ring-primary' : ''}`}>
      <CardContent className="p-0">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          {/* Experience Images */}
          <div className="lg:col-span-4">
            <div className="relative h-64 lg:h-56">
              <img
                src={experience.images[0]}
                alt={experience.title}
                className="w-full h-full object-cover rounded-l-lg"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder.svg';
                }}
              />
              
              {experience.badge && (
                <Badge className="absolute top-2 left-2 bg-travel-gold text-travel-navy">
                  {experience.badge}
                </Badge>
              )}
              
              {experience.discount && (
                <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-semibold">
                  {experience.discount}% OFF
                </div>
              )}
              
              <Button
                variant="ghost"
                size="icon"
                className="absolute bottom-2 right-2 bg-white/80 hover:bg-white"
              >
                <Heart className="w-4 h-4" />
              </Button>
              
              {experience.images.length > 1 && (
                <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                  <Camera className="w-3 h-3" />
                  +{experience.images.length - 1}
                </div>
              )}
            </div>
          </div>

          {/* Experience Details */}
          <div className="lg:col-span-8 p-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-full">
              {/* Main Info */}
              <div className="lg:col-span-8">
                <div className="space-y-3">
                  {/* Title & Category */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1 pr-4">{experience.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <MapPin className="w-4 h-4" />
                        <span>{experience.location}</span>
                        <span>•</span>
                        <span>{experience.provider}</span>
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {experience.category}
                    </Badge>
                  </div>

                  {/* Rating & Duration */}
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <div className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getRatingColor()}`}>
                        <Star className="w-3 h-3 mr-1 fill-current" />
                        {experience.rating}
                      </div>
                      <span className="text-muted-foreground">({experience.reviewCount} reviews)</span>
                    </div>
                    
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>{experience.duration}</span>
                    </div>
                    
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Users className="w-4 h-4" />
                      <span>{experience.groupSize}</span>
                    </div>
                    
                    <div className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor()}`}>
                      {experience.difficulty}
                    </div>
                  </div>

                  {/* Highlights */}
                  <div>
                    <div className="flex flex-wrap gap-2">
                      {experience.highlights.slice(0, 3).map((highlight, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {highlight}
                        </Badge>
                      ))}
                      {experience.highlights.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{experience.highlights.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* What's Included */}
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">What's included:</p>
                    <div className="flex flex-wrap gap-1">
                      {experience.included.slice(0, 3).map((item, index) => (
                        <span key={index} className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          {item}
                        </span>
                      ))}
                      {experience.included.length > 3 && (
                        <span className="text-xs text-muted-foreground">
                          +{experience.included.length - 3} more included
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Languages & Availability */}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div>
                      <span className="font-medium">Languages:</span> {experience.languages.slice(0, 2).join(', ')}
                      {experience.languages.length > 2 && ` +${experience.languages.length - 2}`}
                    </div>
                    <div>
                      <span className="font-medium">Availability:</span> {experience.availability}
                    </div>
                  </div>

                  {/* Benefits */}
                  <div className="flex flex-wrap gap-2">
                    {experience.instantConfirmation && (
                      <Badge variant="outline" className="text-xs text-blue-600 border-blue-200">
                        Instant confirmation
                      </Badge>
                    )}
                    {experience.freeCancellation && (
                      <Badge variant="outline" className="text-xs text-green-600 border-green-200">
                        Free cancellation
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Price & Action */}
              <div className="lg:col-span-4 flex flex-col justify-between">
                <div className="text-right space-y-2">
                  {experience.originalPrice && experience.originalPrice > experience.price && (
                    <div className="text-sm text-muted-foreground line-through">
                      {experience.currency}{experience.originalPrice}
                    </div>
                  )}
                  
                  <div>
                    <div className="text-xs text-muted-foreground">From</div>
                    <div className="text-2xl font-bold">
                      {experience.currency}{experience.price}
                    </div>
                    <div className="text-xs text-muted-foreground">per person</div>
                  </div>
                  
                  {experience.originalPrice && experience.originalPrice > experience.price && (
                    <div className="text-xs text-green-600 font-medium">
                      Save {experience.currency}{experience.originalPrice - experience.price}
                    </div>
                  )}
                </div>
                
                <Button 
                  onClick={() => onSelect(experience)}
                  className="w-full mt-4 bg-orange-500 hover:bg-orange-600 text-white"
                  variant={selected ? "default" : "default"}
                  size="lg"
                >
                  {selected ? "✓ Selected" : "Book Experience"}
                </Button>
                
                <p className="text-xs text-muted-foreground text-center mt-2">
                  Reserve now, pay later
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExperienceResultCard;