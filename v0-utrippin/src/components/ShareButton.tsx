import React, { useState } from "react";
import { Share2, Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ShareButtonProps {
  destinationName: string;
  destinationSummary: string;
  className?: string;
}

export const ShareButton = ({ destinationName, destinationSummary, className = "" }: ShareButtonProps) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    const shareText = `Check out ${destinationName}! ${destinationSummary} - Discover more on Utrippin`;
    const shareUrl = `${window.location.origin}/explore?destination=${encodeURIComponent(destinationName)}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${destinationName} - Utrippin`,
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback to copying link
      const textToCopy = `${shareText}\n${shareUrl}`;
      try {
        await navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        
        toast({
          title: "Link copied!",
          description: "Share this destination with your friends.",
        });
      } catch (err) {
        console.error('Failed to copy text: ', err);
      }
    }
  };

  return (
    <button
      onClick={handleShare}
      className={`p-2 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-sm text-white transition-all duration-300 ${className}`}
    >
      {copied ? (
        <Check className="w-4 h-4 text-green-400" />
      ) : (
        <Share2 className="w-4 h-4" />
      )}
    </button>
  );
};
