import React, { useRef } from 'react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import html2canvas from 'html2canvas';
import Header from '../components/layout/header';
import Footer from '../components/layout/footer'; 
import Logo from '../components/ui/Logo';

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
          <Card ref={cardRef} className="w-full aspect-[1200/630] bg-gradient-to-br from-[#0068EF] to-[#0055A5] flex flex-col items-center justify-center p-12">
            <div className="flex items-center justify-center mb-12 transform scale-[3]">
              <Logo />
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
            Download Social Card Image
          </Button>
        </div>
        
        <div className="mt-8 p-6 bg-white rounded-lg shadow">
          <h3 className="text-xl font-bold mb-4 text-[#003C8A]">Instructions</h3>
          <ol className="list-decimal pl-5 space-y-2">
            <li>Click the "Download Social Card Image" button above to generate the image</li>
            <li>Upload the downloaded image to your server or hosting provider</li>
            <li>Make sure the image is accessible at <code className="bg-gray-100 px-2 py-1 rounded">https://utrippin.ai/utrippin_social_card.png</code></li>
            <li>The Open Graph and Twitter Card meta tags are already set up in the HTML</li>
          </ol>
          
          <div className="mt-6 p-4 bg-gray-100 rounded-lg">
            <h4 className="font-bold mb-2">Meta Tags Already Added:</h4>
            <pre className="text-xs overflow-x-auto">
{`<meta property="og:image" content="https://utrippin.ai/utrippin_social_card.png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:image" content="https://utrippin.ai/utrippin_social_card.png" />`}
            </pre>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}