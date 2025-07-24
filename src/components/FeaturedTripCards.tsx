import React from 'react';
import { MapPin, Plane, Hotel, Calendar, Star } from 'lucide-react';

const featuredTrips = [
  {
    title: 'Cancun Adventure',
    location: 'Cancun, Mexico',
    dates: 'Aug 1–4',
    highlights: ['Beaches', 'Nightlife', 'All-Inclusive Resorts'],
    rating: 4.8,
  },
  {
    title: 'Barcelona Explorer',
    location: 'Barcelona, Spain',
    dates: 'Oct 10–16',
    highlights: ['Gothic Quarter', 'Montserrat Hike', 'Bike Tours'],
    rating: 4.9,
  },
  {
    title: 'Family Trip to Orlando',
    location: 'Orlando, Florida',
    dates: 'Sept 5–9',
    highlights: ['Disney World', 'Universal Studios', 'Water Parks'],
    rating: 4.7,
  },
];

export default function FeaturedTripCards() {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-10">
      <h2 className="text-foreground text-2xl font-bold mb-6">🌟 Featured Trips You Might Love</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredTrips.map((trip, idx) => (
          <div
            key={idx}
            className="bg-card rounded-xl p-6 shadow-md border hover:shadow-xl transition duration-300 hover:scale-[1.02]"
          >
            <div className="flex items-center gap-2 text-primary text-sm font-medium mb-1">
              <MapPin size={16} /> {trip.location}
            </div>
            <h3 className="text-xl text-foreground font-semibold mb-2">{trip.title}</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
              <Calendar size={16} /> {trip.dates}
            </div>
            <ul className="text-sm text-foreground mb-4 list-disc list-inside">
              {trip.highlights.map((point, i) => (
                <li key={i}>{point}</li>
              ))}
            </ul>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1 text-secondary text-sm">
                <Star size={14} /> {trip.rating.toFixed(1)}
              </span>
              <button className="bg-primary hover:bg-primary/90 text-primary-foreground text-sm px-4 py-2 rounded-lg font-medium transition-colors">
                Book Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}