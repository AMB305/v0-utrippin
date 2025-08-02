import React from 'react';

interface TimelineItem {
  time: string;
  title: string;
  description: string;
  location?: string;
}

const defaultItinerary: TimelineItem[] = [
  {
    time: "9:00 AM",
    title: "Breakfast at Local Café",
    description: "Start your day with authentic local cuisine",
    location: "Downtown District"
  },
  {
    time: "11:00 AM", 
    title: "City Walking Tour",
    description: "Explore historic landmarks and hidden gems",
    location: "Old Town"
  },
  {
    time: "2:00 PM",
    title: "Museum Visit",
    description: "Discover local art and culture",
    location: "Cultural Quarter"
  },
  {
    time: "6:00 PM",
    title: "Sunset Dinner",
    description: "Fine dining with panoramic city views",
    location: "Sky Terrace"
  }
];

export const Timeline = () => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-white">📅 Today's Itinerary</h2>
      <div className="space-y-4">
        {defaultItinerary.map((item, index) => (
          <div key={index} className="flex gap-4 p-4 bg-zinc-800 rounded-xl">
            <div className="text-teal-400 font-medium text-sm min-w-[60px]">
              {item.time}
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-white mb-1">{item.title}</h3>
              <p className="text-zinc-400 text-sm mb-1">{item.description}</p>
              {item.location && (
                <p className="text-zinc-500 text-xs">📍 {item.location}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
