import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
import { useVideoConfig } from "@/hooks/useVideoConfig";

const EnhancedHeroSection = () => {
  const navigate = useNavigate();
  const { videos: videoUrls, loading: videosLoading } = useVideoConfig('desktop');
  
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [nextVideoIndex, setNextVideoIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  
  useEffect(() => {
    // Don't start interval until videos are loaded
    if (videosLoading || videoUrls.length === 0) return;
    
    const interval = setInterval(() => {
      setIsTransitioning(true);
      
      setTimeout(() => {
        setCurrentVideoIndex(nextVideoIndex);
        setNextVideoIndex((nextVideoIndex + 1) % videoUrls.length);
        setIsTransitioning(false);
      }, 500); // Half second crossfade
    }, 3500); // 3.5 seconds between transitions
    
    return () => clearInterval(interval);
  }, [nextVideoIndex, videoUrls.length, videosLoading]);

  const handlePlanYourTrip = () => {
    console.log("🗺️ Book Now button clicked - navigating to /flights");
    navigate('/flights');
  };

  // Show the full component with fallback background while videos load
  if (videosLoading || videoUrls.length === 0) {
    return (
      <div className="hero-section-set relative h-screen overflow-hidden hidden lg:block bg-black">
        {/* Solid black background during loading */}
        <div className="absolute inset-0 bg-black" />
        
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        <div className="absolute inset-0 bg-black/15" />
        
        {/* Centered content - same as loaded state */}
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="text-center text-white px-4 max-w-4xl mx-auto">
            <h1 className="font-montserrat font-medium mb-8 sm:mb-12 leading-tight tracking-wide text-center" style={{ color: 'white', background: 'none', WebkitTextFillColor: 'white', backgroundClip: 'unset', fontSize: '20pt' }}>
              YOUR WORLD<br />
              WITHIN REACH
            </h1>
            
            <button 
              onClick={handlePlanYourTrip}
              className="border-2 border-white bg-transparent text-white hover:bg-white hover:text-black px-8 py-3 text-sm font-medium tracking-widest uppercase transition-all duration-300"
            >
              Book Now
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="hero-section-set relative h-screen overflow-hidden hidden lg:block bg-black">
      {/* Solid black background to prevent flashing */}
      <div className="absolute inset-0 bg-black" />
      
      {/* Rotating background videos */}
      <div className="absolute inset-0">
        {videoUrls.map((url, index) => (
          <video
            key={index}
            ref={(el) => (videoRefs.current[index] = el)}
            src={url}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
              index === currentVideoIndex 
                ? 'opacity-100' 
                : index === nextVideoIndex && isTransitioning
                ? 'opacity-100'
                : 'opacity-0'
            }`}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            onError={(e) => {
              console.error(`❌ Video failed to load: ${url}`);
              console.log(`This is video #${index + 1} in the rotation`);
            }}
            onLoadStart={() => {
              console.log(`📹 Started loading video #${index + 1}: ${url}`);
            }}
          />
        ))}
      </div>
      
      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
      <div className="absolute inset-0 bg-black/15" />
      
      {/* Centered content */}
      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="font-montserrat font-medium mb-8 sm:mb-12 leading-tight tracking-wide text-center" style={{ color: 'white', background: 'none', WebkitTextFillColor: 'white', backgroundClip: 'unset', fontSize: '20pt' }}>
            YOUR WORLD<br />
            WITHIN REACH
          </h1>
          
          <button 
            onClick={handlePlanYourTrip}
            className="border-2 border-white bg-transparent text-white hover:bg-white hover:text-black px-8 py-3 text-sm font-medium tracking-widest uppercase transition-all duration-300"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default EnhancedHeroSection;