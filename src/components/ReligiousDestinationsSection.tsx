import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDestinations } from '@/hooks/useDestinations';
import { ReligionTravelCards } from './ReligionTravelCards';

const ReligiousDestinationsSection: React.FC = () => {
  const { destinations, loading, fetchDestinations } = useDestinations();

  useEffect(() => {
    // First try to fetch religious destinations from database
    fetchDestinations('Religious');
  }, []);

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-semibold mb-6 text-center">
        Religious & Spiritual Destinations
      </h2>
      
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
        </div>
      ) : destinations.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {destinations.map((dest) => (
            <Link to={`/destinations/${dest.slug}`} key={dest.id}>
              <div className="bg-slate-800/50 border border-blue-500/20 rounded-2xl overflow-hidden shadow-xl hover:shadow-blue-500/30 transition duration-300 h-64 relative group">
                {dest.img && (
                  <img
                    src={dest.img}
                    alt={dest.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.currentTarget.src = `https://images.unsplash.com/photo-1549144511-f099e773c147?w=400&h=300&fit=crop`;
                    }}
                  />
                )}
                <div className="absolute inset-0 bg-black/50"></div>
                <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-4">
                  <h3 className="text-white text-2xl font-bold mb-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] tracking-wide">
                    {dest.name}
                  </h3>
                  <p className="text-white text-sm font-medium tracking-[0.2em] uppercase opacity-95 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                    {dest.country}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        // Fallback to hardcoded cards if no database destinations
        <ReligionTravelCards />
      )}
    </section>
  );
};

export default ReligiousDestinationsSection;