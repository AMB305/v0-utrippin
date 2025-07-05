import React, { useRef, useEffect } from 'react';
import SocialCardLogo from '../components/ui/SocialCardLogo';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import html2canvas from 'html2canvas';

export default function SocialCardGenerator() {
  const cardRef = useRef(null);

  const generateImage = async () => {
    if (cardRef.current) {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2, // Higher scale for better quality
        backgroundColor: null,
        logging: false,
        useCORS: true
      });
      
      const image = canvas.toDataURL('image/png');
      
      // Create download link
      const link = document.createElement('a');
      link.href = image;
      link.download = 'UTrippin_Social_Card_BlueBG_1200x630.png';
      link.click();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-8 text-[#003C8A]">Social Card Generator</h1>
      
      <div className="mb-8 w-full max-w-[1200px]">
        <Card 
          ref={cardRef} 
          className="w-full aspect-[1200/630] bg-gradient-to-br from-[#0068EF] to-[#0055A5] flex flex-col items-center justify-center p-12"
        >
          <div className="mb-8">
            <SocialCardLogo />
          </div>
          
          <h2 className="text-5xl md:text-6xl font-bold text-white text-center mb-6">
            Your AI Travel Buddy
          </h2>
          
          <p className="text-2xl text-blue-100 text-center max-w-2xl">
            Compare flights, hotels, cars & even find travel buddies.
          </p>
        </Card>
      </div>
      
      <Button onClick={generateImage} className="bg-[#0068EF] hover:bg-[#0055A5]">
        Download Social Card
      </Button>
      
      <div className="mt-8 text-gray-600 text-sm">
        <p>This tool generates a 1200×630 image optimized for social media sharing.</p>
        <p>The image will be saved to your downloads folder.</p>
      </div>
    </div>
  );
}