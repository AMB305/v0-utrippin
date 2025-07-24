import React from 'react';
import { Sparkles, MapPin, CalendarDays } from 'lucide-react';

const featuredTrips = [
  {
    title: 'Cancun Getaway',
    location: 'Cancun, Mexico',
    date: 'Aug 1–4',
    highlights: ['Beaches', 'Clubs', 'Snorkeling'],
    emoji: '🌴'
  },
  {
    title: 'Cultural Tokyo',
    location: 'Tokyo, Japan',
    date: 'Sep 10–15',
    highlights: ['Parks', 'Karaoke', 'Sushi Night'],
    emoji: '🎌'
  },
  {
    title: 'Family Fun in Orlando',
    location: 'Orlando, FL',
    date: 'Oct 20–25',
    highlights: ['Theme Parks', 'Walkability', 'Kid-Friendly'],
    emoji: '🎢'
  },
  {
    title: 'Paris by Night',
    location: 'Paris, France',
    date: 'Nov 5–10',
    highlights: ['Romance', 'Wine', 'Night Walks'],
    emoji: '🗼'
  },
];

export default function FeaturedTripCards() {
  return (
    <div className="bg-background text-foreground py-12 px-4">
      <h2 className="text-2xl font-bold text-center mb-8">
        <Sparkles className="inline mr-2 text-primary" /> Featured Trip Ideas
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {featuredTrips.map((trip, idx) => (
          <div key={idx} className="bg-card rounded-xl p-6 shadow-md border hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
            <div className="text-3xl mb-3">{trip.emoji}</div>
            <h3 className="text-xl font-semibold mb-2">{trip.title}</h3>
            <div className="flex items-center text-muted-foreground text-sm mb-1">
              <MapPin className="w-4 h-4 mr-1" /> {trip.location}
            </div>
            <div className="flex items-center text-muted-foreground text-sm mb-3">
              <CalendarDays className="w-4 h-4 mr-1" /> {trip.date}
            </div>
            <ul className="text-sm text-foreground list-disc list-inside">
              {trip.highlights.map((h, i) => (
                <li key={i}>{h}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}