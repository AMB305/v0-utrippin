// DesktopTravelPlanner.tsx
import React, { useState } from 'react';
import { ChatContainer } from './custom/chat-container-desktop';
import { Timeline } from './ui/timeline';
import { GallerySection } from './custom/gallery-section';
import { ShareTripBar } from './custom/share-trip-bar';
import { KeilaHeader } from './custom/keila-header';
import { cn } from '@/lib/utils';

export default function DesktopTravelPlanner() {
  const [step, setStep] = useState<'prompt' | 'itinerary'>('prompt');

  const handleGenerateTrip = () => {
    setStep('itinerary'); // later this would trigger an actual AI API call
  };

  return (
    <div className="hidden lg:block bg-black text-white min-h-screen">
      <KeilaHeader />
      <div className="max-w-7xl mx-auto px-6 py-8">
        {step === 'prompt' ? (
          <div className="flex flex-col items-center text-center space-y-6 mt-32">
            {/* Glowing orb */}
            <div className="animate-pulse rounded-full w-24 h-24 bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-500 flex items-center justify-center shadow-xl">
              <span className="text-white text-4xl">+</span>
            </div>
            {/* Headline */}
            <h1 className="text-3xl font-bold">Ready to explore the world?</h1>
            <p className="text-zinc-400">Let's plan your dream trip! ✨</p>

            {/* Sample Prompt and Buttons */}
            <div className="w-full max-w-xl mt-4">
              <div className="bg-zinc-800 p-4 rounded-xl text-left shadow border border-zinc-700">
                <p className="text-sm text-white">
                  Plan a 6-day adventure trip to Barcelona for 3 friends in October. Include hiking in Montserrat,
                  a bike tour of the city, and a day for exploring Gothic Quarter. Budget-friendly options preferred.
                </p>
              </div>
              <div className="flex items-center justify-center mt-4 gap-4 flex-wrap">
                <button className="bg-zinc-800 rounded-full px-4 py-1 text-sm text-white border border-zinc-600">Create a new trip</button>
                <button className="bg-zinc-800 rounded-full px-4 py-1 text-sm text-white border border-zinc-600">Get inspired</button>
                <button className="bg-zinc-800 rounded-full px-4 py-1 text-sm text-white border border-zinc-600">Inspire me where to go</button>
                <button className="bg-zinc-800 rounded-full px-4 py-1 text-sm text-white border border-zinc-600">Solo trip</button>
                <button className="bg-zinc-800 rounded-full px-4 py-1 text-sm text-white border border-zinc-600">Partner</button>
                <button className="bg-zinc-800 rounded-full px-4 py-1 text-sm text-white border border-zinc-600">Family</button>
              </div>
              <div className="flex justify-center mt-6">
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
                  onClick={handleGenerateTrip}
                >
                  Let's Go →
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-6">
            {/* Left Column: Timeline + Gallery */}
            <div className="col-span-2 space-y-8">
              <Timeline />
              <GallerySection />
            </div>

            {/* Right Column: Share + Chat */}
            <div className="col-span-1">
              <ShareTripBar />
              <div className="mt-6 border border-white/10 rounded-xl p-4 bg-zinc-900 shadow-xl">
                <ChatContainer 
                  variant="desktop" 
                  enableReactions={true} 
                  enablePinning={true} 
                  enableSharing={true} 
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}