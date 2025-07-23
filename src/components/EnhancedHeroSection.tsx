import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";

const EnhancedHeroSection = () => {
  const navigate = useNavigate();
  
  // Video URLs for rotation
  const videoUrls = [
    "https://utrippin.s3.us-east-2.amazonaws.com/famous-white-houses-in-fira-santorini-island-gree-2023-11-27-05-01-35-utc.mp4",
    "https://utrippin.s3.us-east-2.amazonaws.com/herd-of-elephants-approaching-a-waterhole-bank-in-2025-04-25-17-59-46-utc.mp4",
    "https://utrippin.s3.us-east-2.amazonaws.com/high-angle-footage-of-times-square-at-night-4k-2025-06-09-04-38-32-utc+(1).mp4",
    "https://utrippin.s3.us-east-2.amazonaws.com/tropical-rainforest-sea-beach-serene-cloudy-sky-tr-2024-02-12-19-16-44-utc+(2).mp4",
    "https://utrippin.s3.us-east-2.amazonaws.com/aerial-view-reveal-epic-white-water-rafting-in-cos-2023-11-27-04-54-26-utc.mp4",
    "https://utrippin.s3.us-east-2.amazonaws.com/an-asian-woman-on-a-swing-on-the-beach-in-phuket-t-2024-02-12-20-30-43-utc.mp4"
  ];
  
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [nextVideoIndex, setNextVideoIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      
      setTimeout(() => {
        setCurrentVideoIndex(nextVideoIndex);
        setNextVideoIndex((nextVideoIndex + 1) % videoUrls.length);
        setIsTransitioning(false);
      }, 500); // Half second crossfade
    }, 3500); // 3.5 seconds between transitions
    
    return () => clearInterval(interval);
  }, [nextVideoIndex, videoUrls.length]);

  const handlePlanYourTrip = () => {
    console.log("🗺️ Plan Your Trip button clicked - navigating to /ai-travel");
    navigate('/ai-travel');
  };

  return (
    <div className="hero-section-set relative h-screen overflow-hidden hidden lg:block">
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
          />
        ))}
      </div>
      
      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
      <div className="absolute inset-0 bg-black/15" />
      
      {/* Centered content */}
      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="your-world-heading-style text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white mb-8 sm:mb-12 leading-tight tracking-wide text-center">
            YOUR WORLD<br />
            WITHIN REACH
          </h1>
          
          <button 
            onClick={handlePlanYourTrip}
            className="border-2 border-white bg-transparent text-white hover:bg-white hover:text-black px-8 py-3 text-sm font-medium tracking-widest uppercase transition-all duration-300"
          >
            Book Flight Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default EnhancedHeroSection;