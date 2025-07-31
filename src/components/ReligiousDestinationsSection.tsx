import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDestinations } from '@/hooks/useDestinations';
import { ReligionTravelCards } from './ReligionTravelCards';

const ReligiousDestinationsSection: React.FC = () => {
  const { destinations, loading, fetchDestinations } = useDestinations();

  useEffect(() => {
    console.log('🔍 ReligiousDestinationsSection: Starting to fetch religious destinations');
    // First try to fetch religious destinations from database
    fetchDestinations('Religious');
  }, []);

  console.log('🏛️ ReligiousDestinationsSection: Current state:', { 
    destinationsCount: destinations.length, 
    loading, 
    destinations: destinations.slice(0, 3) // Log first 3 for debugging
  });

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-semibold mb-6 text-center">
        Religious & Spiritual Destinations
      </h2>
      
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* Get hardcoded cards and populate with database data when available */}
          {[
            { title: "Vatican City", location: "Vatican City", imageUrl: "https://images.unsplash.com/photo-1539650116574-75c0c6d73042?w=400&h=300&fit=crop", slug: "vatican-city" },
            { title: "Mecca", location: "Saudi Arabia", imageUrl: "https://images.unsplash.com/photo-1564769662080-ec2544481688?w=400&h=300&fit=crop", slug: "mecca" },
            { title: "Haridwar", location: "India", imageUrl: "https://images.unsplash.com/photo-1566552881560-0be862a7c445?w=400&h=300&fit=crop", slug: "haridwar" },
            { title: "Bodh Gaya", location: "India", imageUrl: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=400&h=300&fit=crop", slug: "bodh-gaya" },
            { title: "Amritsar", location: "India", imageUrl: "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=400&h=300&fit=crop", slug: "amritsar" },
            { title: "Jerusalem", location: "Israel", imageUrl: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=300&fit=crop", slug: "jerusalem" },
            { title: "Varanasi", location: "India", imageUrl: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=400&h=300&fit=crop", slug: "varanasi" },
            { title: "Lumbini", location: "Nepal", imageUrl: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=400&h=300&fit=crop", slug: "lumbini" },
            { title: "Paro", location: "Bhutan", imageUrl: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=300&fit=crop", slug: "paro" },
            { title: "Tirupati", location: "India", imageUrl: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=400&h=300&fit=crop", slug: "tirupati" },
            { title: "Mount Kailash", location: "Tibet", imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop", slug: "mount-kailash" },
            { title: "Kyoto", location: "Japan", imageUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&h=300&fit=crop", slug: "kyoto" }
          ].map((card, i) => {
            // Try to find corresponding database destination
            const dbDestination = destinations.find(dest => 
              dest.name.toLowerCase().includes(card.title.toLowerCase()) ||
              card.title.toLowerCase().includes(dest.name.toLowerCase())
            );
            
            const destData = dbDestination || {
              name: card.title,
              country: card.location,
              img: card.imageUrl,
              slug: card.slug
            };
            
            return (
              <Link 
                to={`/destinations/${destData.slug}`} 
                key={i}
                onClick={() => console.log('🔗 Clicking destination:', destData)}
              >
                <div className="relative rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group h-64">
                  <div className="absolute inset-0">
                    <img
                      src={destData.img || card.imageUrl}
                      alt={destData.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.src = `https://images.unsplash.com/photo-1549144511-f099e773c147?w=400&h=300&fit=crop`;
                      }}
                    />
                    <div className="absolute inset-0 bg-black/50"></div>
                  </div>
                  
                  <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-4">
                    <h3 className="text-white text-2xl font-bold mb-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] tracking-wide">
                      {destData.name}
                    </h3>
                    <p className="text-white text-sm font-medium tracking-[0.2em] uppercase opacity-95 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                      {destData.country}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default ReligiousDestinationsSection;