import React, { useRef } from 'react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import html2canvas from 'html2canvas';
import Header from '../components/layout/header';
import Footer from '../components/layout/footer';

export default function SocialCardGenerator() {
  const cardRef = useRef(null);

  const generateImage = async () => {
    if (cardRef.current) {
      try {
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
        link.download = 'utrippin_social_card.png';
        link.click();
      } catch (error) {
        console.error('Error generating image:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8 text-[#003C8A]">Social Card Generator</h1>
        
        <div className="mb-8">
          <Card 
            ref={cardRef} 
            className="w-full aspect-[1200/630] bg-gradient-to-br from-[#0068EF] to-[#0055A5] flex flex-col items-center justify-center p-12"
          >
            {/* Logo */}
            <div className="flex items-center space-x-2 mb-8 scale-150">
              {["U", "T", "R", "I", "P", "P", "I", "N"].map((letter, idx) => (
                <div
                  key={idx}
                  className={`bg-[#0068EF] w-16 h-16 flex items-center justify-center rounded transition duration-300 ${
                    idx % 2 === 0 ? 'bg-[#0068EF]' : 'bg-[#0055A5]'
                  }`}
                  style={{
                    backgroundColor: idx < 4 
                      ? `rgba(0, ${104 - idx * 20}, ${239 - idx * 20}, 1)` 
                      : `rgba(0, ${104 - (7-idx) * 20}, ${239 - (7-idx) * 20}, 1)`
                  }}
                >
                  <span className="text-white font-bold text-3xl">
                    {letter}
                  </span>
                </div>
              ))}
            </div>
            
            <h2 className="text-5xl md:text-6xl font-bold text-white text-center mb-6">
              Your AI Travel Buddy
            </h2>
            
            <p className="text-2xl text-blue-100 text-center max-w-2xl">
              Compare Flights, Hotels, Cars and Travel Buddies!
            </p>
          </Card>
        </div>
        
        <div className="flex justify-center">
          <Button onClick={generateImage} className="bg-[#0068EF] hover:bg-[#0055A5]">
            Download Social Card
          </Button>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}