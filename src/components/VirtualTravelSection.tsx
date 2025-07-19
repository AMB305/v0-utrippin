import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Navigation } from 'lucide-react';
import { getFeaturedDestinations, VirtualDestination } from '@/data/virtualDestinations';
import { VecteezyImage } from '@/components/VecteezyImage';

const VirtualTravelSection: React.FC = () => {
  const [destinations, setDestinations] = useState<VirtualDestination[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDestinations = () => {
      console.log('🚀 Loading virtual destinations...');
      const featuredDestinations = getFeaturedDestinations();
      setDestinations(featuredDestinations);
      setLoading(false);
      console.log('✅ Virtual destinations loaded');
    };

    loadDestinations();
  }, []);

  return (
    <section className="relative bg-[#091B36] text-white py-12">
      {/* Faint globe background */}
      <div 
        className="absolute inset-0 bg-center bg-no-repeat opacity-5 pointer-events-none"
        style={{ 
          backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(`
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
              <circle cx="100" cy="100" r="80" fill="none" stroke="white" stroke-width="0.5"/>
              <path d="M20 100 Q100 50 180 100 Q100 150 20 100" fill="none" stroke="white" stroke-width="0.5"/>
              <path d="M100 20 Q150 100 100 180 Q50 100 100 20" fill="none" stroke="white" stroke-width="0.5"/>
              <circle cx="100" cy="60" r="2" fill="white" opacity="0.3"/>
              <circle cx="140" cy="80" r="1.5" fill="white" opacity="0.3"/>
              <circle cx="60" cy="120" r="1.5" fill="white" opacity="0.3"/>
              <circle cx="120" cy="140" r="2" fill="white" opacity="0.3"/>
            </svg>
          `)}")`
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">
            🌍 Travel the world virtually
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Explore iconic destinations from your home with our virtual tours powered by Google Earth
          </p>
        </div>

        {loading && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[...Array(3)].map((_, idx) => (
                <div key={idx} className="bg-gray-900 rounded-lg overflow-hidden">
                  <Skeleton className="h-52 w-full bg-gray-800" />
                  <div className="p-4 space-y-2">
                    <Skeleton className="h-6 w-3/4 bg-gray-800" />
                    <Skeleton className="h-4 w-1/2 bg-gray-800" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!loading && destinations.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
              {destinations.slice(0, 3).map((dest, idx) => (
                <div 
                  key={idx} 
                  className="bg-gray-900 rounded-lg overflow-hidden shadow-lg hover:shadow-orange-500/20 transition-all duration-300 group"
                >
                  <div className="relative overflow-hidden">
                    <VecteezyImage
                      destination={dest.name}
                      description={`${dest.name} landmark travel destination virtual tour`}
                      tags={[dest.name.toLowerCase(), dest.location.toLowerCase(), 'landmark', 'travel', 'destination']}
                      className="h-52 w-full group-hover:scale-105 transition-transform duration-300"
                      alt={`${dest.name} - ${dest.location}`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  </div>
                  <div className="p-4">
                    <h3 className="text-xl font-bold mb-1">{dest.name}</h3>
                    <p className="text-sm text-gray-300 mb-3">{dest.location}</p>
                    <a
                      href={dest.earthLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
                    >
                      <Navigation className="w-4 h-4" />
                      View in 3D
                    </a>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center">
              <Link to="/virtual-tour">
                <Button className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold shadow-lg transition-all duration-300 hover:shadow-orange-500/20">
                  View More Destinations
                </Button>
              </Link>
            </div>
          </>
        )}

        {!loading && destinations.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-400">No destinations available at the moment.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default VirtualTravelSection;