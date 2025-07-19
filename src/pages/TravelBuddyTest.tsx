import React, { useState } from 'react';
import { useBudgetTrips } from '@/hooks/useBudgetTrips';
import { useEvents } from '@/hooks/useEvents';
import { Plane, Users, Calendar, MapPin, Star, Filter } from 'lucide-react';

export default function TravelBuddyTest() {
  const [budget, setBudget] = useState(1500);
  const [groupSize, setGroupSize] = useState(2);

  const { trips, loading: loadingTrips } = useBudgetTrips(budget, groupSize);
  const { events, loading: loadingEvents } = useEvents();

  return (
    <div className="min-h-screen bg-utrippin-navy text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-utrippin-navy to-utrippin-muted px-8 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <Plane className="text-utrippin-orange w-8 h-8" />
            <h1 className="text-4xl font-bold">Find Your Travel Buddy</h1>
          </div>
          <p className="text-xl text-gray-300 mb-8">
            Discover amazing trips and events tailored to your budget and group size
          </p>

          {/* Controls */}
          <div className="bg-utrippin-muted rounded-xl p-6 flex flex-wrap gap-8 items-center">
            <div className="flex-1 min-w-64">
              <label className="flex items-center gap-2 mb-3 text-utrippin-orange font-semibold">
                <Filter className="w-4 h-4" />
                Budget: ${budget.toLocaleString()} USD
              </label>
              <input 
                type="range" 
                min={500} 
                max={10000} 
                step={100}
                value={budget}
                onChange={e => setBudget(Number(e.target.value))}
                className="w-full h-2 bg-utrippin-navy rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #fca311 0%, #fca311 ${((budget - 500) / (10000 - 500)) * 100}%, #0a1f44 ${((budget - 500) / (10000 - 500)) * 100}%, #0a1f44 100%)`
                }}
              />
              <div className="flex justify-between text-sm text-gray-400 mt-1">
                <span>$500</span>
                <span>$10,000</span>
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 mb-3 text-utrippin-orange font-semibold">
                <Users className="w-4 h-4" />
                Group Size
              </label>
              <select
                value={groupSize}
                onChange={e => setGroupSize(Number(e.target.value))}
                className="bg-utrippin-navy border-2 border-utrippin-orange rounded-lg px-4 py-2 text-white focus:outline-none focus:border-utrippin-blue transition-colors"
              >
                {[1,2,3,4,5,6,7,8].map(n => (
                  <option key={n} value={n}>{n} {n === 1 ? 'person' : 'people'}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-12">
        {/* Trips Section */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <MapPin className="text-utrippin-blue w-6 h-6" />
            <h2 className="text-3xl font-bold">Trips Matching Your Budget</h2>
          </div>
          
          {loadingTrips ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin-slow text-utrippin-blue">
                <Plane className="w-8 h-8" />
              </div>
              <span className="ml-3 text-utrippin-blue animate-pulse-slow">
                Finding perfect trips for you...
              </span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trips.map((trip) => (
                <div 
                  key={trip.id} 
                  className="bg-utrippin-muted rounded-xl overflow-hidden hover:scale-105 transition-transform duration-300 border border-utrippin-orange/20 hover:border-utrippin-orange/50"
                >
                  <div className="h-48 bg-gradient-to-br from-utrippin-blue/20 to-utrippin-orange/20 flex items-center justify-center">
                    <img 
                      src={trip.images[0]} 
                      alt={trip.destination}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 text-utrippin-orange">
                      {trip.destination}
                    </h3>
                    <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                      {trip.summary}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="text-utrippin-blue font-bold text-lg">
                        ${trip.totalCost.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-400">
                        {trip.duration} days
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-3">
                      {trip.activities.slice(0, 3).map((activity, idx) => (
                        <span 
                          key={idx}
                          className="text-xs bg-utrippin-navy px-2 py-1 rounded-full text-utrippin-orange"
                        >
                          {activity}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Events Section */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <Calendar className="text-utrippin-orange w-6 h-6" />
            <h2 className="text-3xl font-bold">Upcoming Festivals & Events</h2>
          </div>
          
          {loadingEvents ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-pulse-slow text-utrippin-orange">
                <Star className="w-8 h-8" />
              </div>
              <span className="ml-3 text-utrippin-orange animate-pulse-slow">
                Loading amazing events...
              </span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <div 
                  key={event.id} 
                  className="bg-utrippin-muted rounded-xl overflow-hidden hover:scale-105 transition-transform duration-300 border border-utrippin-blue/20 hover:border-utrippin-blue/50"
                >
                  <div className="h-40 bg-gradient-to-br from-utrippin-orange/20 to-utrippin-blue/20 flex items-center justify-center">
                    {event.image ? (
                      <img 
                        src={event.image} 
                        alt={event.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Star className="w-12 h-12 text-utrippin-orange" />
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-bold mb-1 text-utrippin-blue">
                      {event.name}
                    </h3>
                    <p className="text-sm text-gray-400 mb-2 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {event.location}
                    </p>
                    <p className="text-xs text-utrippin-orange mb-3 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(event.start_date).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                    <p className="text-sm text-gray-300 mb-4 line-clamp-2">
                      {event.description}
                    </p>
                    <div className="flex items-center justify-between">
                      {event.price && (
                        <div className="text-utrippin-orange font-semibold">
                          ${event.price}
                        </div>
                      )}
                      <div className="flex flex-wrap gap-1">
                        {event.tags.slice(0, 2).map((tag, idx) => (
                          <span 
                            key={idx}
                            className="text-xs bg-utrippin-navy px-2 py-1 rounded-full text-utrippin-blue"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Footer */}
      <div className="bg-utrippin-muted mt-16 py-8 px-8">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-400">
            ✈️ Discover your next adventure with Utrippin Travel Buddies
          </p>
        </div>
      </div>

      <style>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #fca311;
          cursor: pointer;
          border: 2px solid #0a1f44;
        }
        
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #fca311;
          cursor: pointer;
          border: 2px solid #0a1f44;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}