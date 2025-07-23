import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plane, Share2, X, Hotel, Car, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import UnifiedBookingSheet from '@/components/UnifiedBookingSheet';

const SwipeToTravelHero = () => {
  const navigate = useNavigate();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [activeBookingType, setActiveBookingType] = useState('flights');

  // Video URLs for background
  const videoUrls = [
    "https://utrippin.s3.us-east-2.amazonaws.com/famous-white-houses-in-fira-santorini-island-gree-2023-11-27-05-01-35-utc.mp4",
    "https://utrippin.s3.us-east-2.amazonaws.com/herd-of-elephants-approaching-a-waterhole-bank-in-2025-04-25-17-59-46-utc.mp4",
    "https://utrippin.s3.us-east-2.amazonaws.com/high-angle-footage-of-times-square-at-night-4k-2025-06-09-04-38-32-utc+(1).mp4",
    "https://utrippin.s3.us-east-2.amazonaws.com/tropical-rainforest-sea-beach-serene-cloudy-sky-tr-2024-02-12-19-16-44-utc+(2).mp4"
  ];

  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  // Video rotation effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentVideoIndex((prev) => (prev + 1) % videoUrls.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [videoUrls.length]);

  const handleBookingClick = (type: string) => {
    setActiveBookingType(type);
    setSheetOpen(true);
  };

  const handleFlightsClick = () => handleBookingClick('flights');

  const handleShareClick = async () => {
    const shareData = {
      title: 'Utrippin - Put the World in Your Hands',
      text: 'Find extraordinary deals for every budget. Travel more, spend less, experience everything.',
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback to copying link
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      } catch (err) {
        alert(`Copy link: ${window.location.href}`);
      }
    }
  };


  return (
    <div className="lg:hidden relative h-screen w-full overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0">
        {videoUrls.map((url, index) => (
          <video
            key={index}
            src={url}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
              index === currentVideoIndex ? 'opacity-100' : 'opacity-0'
            }`}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          />
        ))}
      </div>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      <div className="absolute inset-0 bg-black/30" />

      {/* Sticky Compact Action Rail */}
      <div className="fixed top-1/2 right-2 transform -translate-y-1/2 z-10">
        <div className="flex flex-col gap-2.5">
          {/* Flights FAB - Primary */}
          <button
            onClick={handleFlightsClick}
            className="w-[52px] h-[52px] rounded-full bg-gradient-to-br from-[#00aaff] to-[#6f7bff] backdrop-blur-sm flex items-center justify-center text-white transition-all duration-300 hover:from-[rgba(0,122,255,0.85)] hover:to-[rgba(111,123,255,0.85)] hover:scale-105"
            aria-label="Book Flights"
          >
            <Plane className="w-[22px] h-[22px]" />
          </button>

          {/* Hotels FAB */}
          <button
            onClick={() => handleBookingClick('hotels')}
            className="w-[52px] h-[52px] rounded-full bg-black/45 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white transition-all duration-300 hover:bg-[rgba(0,122,255,0.55)] hover:scale-105"
            aria-label="Book Hotels"
          >
            <Hotel className="w-[22px] h-[22px]" />
          </button>

          {/* Cars FAB */}
          <button
            onClick={() => handleBookingClick('cars')}
            className="w-[52px] h-[52px] rounded-full bg-black/45 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white transition-all duration-300 hover:bg-[rgba(0,122,255,0.55)] hover:scale-105"
            aria-label="Rent Cars"
          >
            <Car className="w-[22px] h-[22px]" />
          </button>

          {/* AI Travel FAB */}
          <button
            onClick={() => handleBookingClick('ai')}
            className="w-[52px] h-[52px] rounded-full bg-black/45 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white transition-all duration-300 hover:bg-[rgba(0,122,255,0.55)] hover:scale-105"
            aria-label="AI Travel"
          >
            <Brain className="w-[22px] h-[22px]" />
          </button>

          {/* Share FAB */}
          <button
            onClick={handleShareClick}
            className="w-[52px] h-[52px] rounded-full bg-black/45 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white transition-all duration-300 hover:bg-[rgba(0,122,255,0.55)] hover:scale-105"
            aria-label="Share"
          >
            <Share2 className="w-[22px] h-[22px]" />
          </button>
        </div>
      </div>

      {/* Unified Booking Sheet */}
      <UnifiedBookingSheet 
        isOpen={sheetOpen}
        onClose={() => setSheetOpen(false)}
        initialTab={activeBookingType}
      />
    </div>
  );
};

export default SwipeToTravelHero;