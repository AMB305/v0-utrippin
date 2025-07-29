import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plane, Share2, X, Hotel, Car, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import UnifiedBookingSheet from '@/components/UnifiedBookingSheet';
import { useVideoConfig } from '@/hooks/useVideoConfig';

const SwipeToTravelHero = () => {
  const navigate = useNavigate();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [activeBookingType, setActiveBookingType] = useState('flights');
  const { videos: videoUrls, loading: videosLoading } = useVideoConfig('mobile');

  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  // Video rotation effect
  useEffect(() => {
    // Don't start interval until videos are loaded
    if (videosLoading || videoUrls.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentVideoIndex((prev) => (prev + 1) % videoUrls.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [videoUrls.length, videosLoading]);

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


  // Show loading state or don't render until videos are loaded
  if (videosLoading || videoUrls.length === 0) {
    return (
      <div className="lg:hidden relative h-screen w-full overflow-hidden bg-black">
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute inset-0 bg-black/30" />

        {/* Centered content */}
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="text-center text-white px-4 max-w-4xl mx-auto">
            <h1 className="font-montserrat font-medium mb-8 leading-tight tracking-wide text-center" style={{ color: 'white', fontSize: '16pt' }}>
              YOUR WORLD<br />
              WITHIN REACH
            </h1>
            <button 
              onClick={handleFlightsClick}
              className="border-2 border-white bg-transparent text-white hover:bg-white hover:text-black px-6 py-2 text-xs font-medium tracking-widest uppercase transition-all duration-300"
            >
              Book Now
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="lg:hidden relative h-screen w-full overflow-hidden bg-black">
      {/* Solid black background to prevent flashing */}
      <div className="absolute inset-0 bg-black" />
      
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
            onError={(e) => {
              console.error(`❌ Mobile video failed to load: ${url}`);
              console.log(`This is mobile video #${index + 1} in the rotation`);
            }}
            onLoadStart={() => {
              console.log(`📱 Started loading mobile video #${index + 1}: ${url}`);
            }}
          />
        ))}
      </div>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      <div className="absolute inset-0 bg-black/30" />

      {/* Centered content */}
      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="font-montserrat font-medium mb-8 leading-tight tracking-wide text-center" style={{ color: 'white', background: 'none', WebkitTextFillColor: 'white', backgroundClip: 'unset', fontSize: '16pt' }}>
            YOUR WORLD<br />
            WITHIN REACH
          </h1>
          
          <button 
            onClick={handleFlightsClick}
            className="border-2 border-white bg-transparent text-white hover:bg-white hover:text-black px-6 py-2 text-xs font-medium tracking-widest uppercase transition-all duration-300"
          >
            Book Now
          </button>
        </div>
      </div>

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