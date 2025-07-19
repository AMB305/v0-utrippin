import React, { useState } from "react";
import { Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FavoriteButtonProps {
  destinationName: string;
  className?: string;
}

export const FavoriteButton = ({ destinationName, className = "" }: FavoriteButtonProps) => {
  const [isFavorite, setIsFavorite] = useState(() => {
    const favorites = JSON.parse(localStorage.getItem('favoriteDestinations') || '[]');
    return favorites.includes(destinationName);
  });
  const { toast } = useToast();

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    const favorites = JSON.parse(localStorage.getItem('favoriteDestinations') || '[]');
    let newFavorites;
    
    if (isFavorite) {
      newFavorites = favorites.filter((name: string) => name !== destinationName);
      toast({
        title: "Removed from favorites",
        description: `${destinationName} has been removed from your wishlist.`,
      });
    } else {
      newFavorites = [...favorites, destinationName];
      toast({
        title: "Added to favorites",
        description: `${destinationName} has been added to your wishlist.`,
      });
    }
    
    localStorage.setItem('favoriteDestinations', JSON.stringify(newFavorites));
    setIsFavorite(!isFavorite);
  };

  return (
    <button
      onClick={toggleFavorite}
      className={`p-2 rounded-full backdrop-blur-sm transition-all duration-300 ${
        isFavorite 
          ? 'bg-red-500/80 text-white hover:bg-red-400/80' 
          : 'bg-black/40 text-white hover:bg-black/60'
      } ${className}`}
    >
      <Heart 
        className={`w-4 h-4 transition-all duration-300 ${
          isFavorite ? 'fill-current' : ''
        }`} 
      />
    </button>
  );
};