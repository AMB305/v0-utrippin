import React from 'react';
import { ChatContainer } from './custom/chat-container';
import { Timeline } from './ui/timeline';
import { GallerySection } from './custom/gallery-section';
import { ShareTripBar } from './custom/share-trip-bar';
import { KeilaHeader } from './custom/keila-header';

export default function DesktopTravelPlanner() {
  return (
    <div className="hidden lg:block bg-black text-white min-h-screen">
      <KeilaHeader />
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-3 gap-6">
          {/* Left Column: Itinerary + Photos */}
          <div className="col-span-2 space-y-8">
            <Timeline />
            <GallerySection />
          </div>

          {/* Right Column: AI Chat & Share */}
          <div className="col-span-1">
            <ShareTripBar />
            <div className="mt-6 border border-white/10 rounded-xl p-4 bg-zinc-900 shadow-xl">
              <ChatContainer 
                variant="desktop" 
                enableReactions={true} 
                enablePinning={true} 
                enableSharing={true} 
                messages={[]}
                containerRef={React.createRef()}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}