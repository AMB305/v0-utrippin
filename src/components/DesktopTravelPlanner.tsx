// DesktopTravelPlanner.tsx
import React from 'react';
import { ChatContainer } from './custom/ChatContainer';

export default function DesktopTravelPlanner() {
  const userId = '00000000-0000-0000-0000-000000000001';
  const buddyId = '00000000-0000-0000-0000-000000000002'; // From connected Travel Buddy

  return (
    <div className="hidden lg:block bg-black min-h-screen text-white px-6 py-10">
      <header className="text-xl font-bold mb-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <img 
            src="/lovable-uploads/444cd76d-946f-4ff4-b428-91e07589acd6.png" 
            alt="Keila Bot" 
            className="w-8 h-8 animate-pulse"
          />
          <span className="text-gradient-keila text-lg font-bold">
            Hi there! I'm Keila
          </span>
        </div>
        <span className="text-sm text-gray-400">Plan. Share. Go.</span>
      </header>

      <main className="max-w-4xl mx-auto">
        <div className="text-center">
          <div className="mb-6">
            <div className="mx-auto mb-3 w-14 h-14 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white text-2xl shadow-lg">
              +
            </div>
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-yellow-400">
              Ready to explore the world?
            </h1>
            <p className="text-sm text-gray-400">Let's plan your dream trip! ✨</p>
          </div>

          <div className="bg-zinc-800 p-4 rounded-xl shadow-lg max-w-xl mx-auto text-sm text-white mb-6">
            Plan a 6-day adventure trip to Barcelona for 3 friends in October. Include hiking in Montserrat, a bike tour of the city, and a day for exploring Gothic Quarter. Budget-friendly options preferred.
          </div>

          <div className="flex flex-wrap gap-2 justify-center mb-8">
            <button className="rounded-full border border-zinc-700 px-3 py-1 text-sm">Create a new trip</button>
            <button className="rounded-full border border-zinc-700 px-3 py-1 text-sm">Get inspired</button>
            <button className="rounded-full border border-zinc-700 px-3 py-1 text-sm">Inspire me where to go</button>
            <button className="rounded-full border border-zinc-700 px-3 py-1 text-sm">Solo trip</button>
            <button className="rounded-full border border-zinc-700 px-3 py-1 text-sm">Partner</button>
            <button className="rounded-full border border-zinc-700 px-3 py-1 text-sm">Family</button>
          </div>

          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-medium">Let's Go →</button>
        </div>

        {/* Real-time Chat Integration */}
        <div className="mt-12">
          <ChatContainer
            userId={userId}
            buddyId={buddyId}
            variant="desktop"
            enableReactions={true}
            enablePinning={true}
            enableSharing={true}
          />
        </div>
      </main>
    </div>
  );
}