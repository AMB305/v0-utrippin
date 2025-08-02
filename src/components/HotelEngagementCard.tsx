import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Share2, Star, Users, MapPin } from "lucide-react";
import { toast } from "sonner";

interface HotelEngagementCardProps {
  title: string;
  price: string;
  url: string;
  image: string;
  rating: number;
  reviews: number;
  badges: string[];
}

export function HotelEngagementCard({ title, price, url, image, rating, reviews, badges }: HotelEngagementCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(Math.floor(Math.random() * 50) + 10);

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isLiked) {
      setIsLiked(true);
      setLikes(prev => prev + 1);
      toast.success("Added to your favorites!");
    } else {
      setIsLiked(false);
      setLikes(prev => prev - 1);
      toast.success("Removed from favorites");
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (navigator.share) {
      navigator.share({
        title: title,
        text: `Check out this amazing hotel: ${title}`,
        url: url,
      });
    } else {
      navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard!");
    }
  };

  const handleBooking = () => {
    // Track engagement
    toast.success("Redirecting to booking...");
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
      <div className="relative">
        <img
          src={image}
          alt={title}
          className="w-full h-64 object-cover transition duration-500 group-hover:brightness-110"
        />
        
        {/* Engagement overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-300">
          <div className="absolute bottom-4 left-4 right-4">
            <Button 
              onClick={handleBooking}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
            >
              View Deal & Book Now
            </Button>
          </div>
        </div>

        {/* Action buttons */}
        <div className="absolute top-4 right-4 flex gap-2">
          <Button
            size="sm"
            variant="secondary"
            className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
            onClick={handleLike}
          >
            <Heart 
              className={`h-4 w-4 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} 
            />
          </Button>
          <Button
            size="sm"
            variant="secondary"
            className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
            onClick={handleShare}
          >
            <Share2 className="h-4 w-4 text-gray-600" />
          </Button>
        </div>

        {/* Rating badge */}
        <div className="absolute top-4 left-4">
          <Badge variant="secondary" className="bg-white/90 text-gray-800">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
            {rating}
          </Badge>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <div className="space-y-2">
          <h3 className="font-bold text-lg leading-tight line-clamp-2">{title}</h3>
          
          {/* Badges */}
          <div className="flex flex-wrap gap-1">
            {badges.slice(0, 2).map((badge, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {badge}
              </Badge>
            ))}
          </div>
        </div>

        {/* Price and stats */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xl font-bold text-primary">{price}</p>
            <p className="text-sm text-muted-foreground">per night</p>
          </div>
          
          <div className="text-right space-y-1">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Users className="h-3 w-3" />
              <span>{reviews} reviews</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Heart className="h-3 w-3" />
              <span>{likes} likes</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
