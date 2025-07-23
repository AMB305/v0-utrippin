import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import familyImage from '@/assets/family-travel.jpg';
import couplesImage from '@/assets/couples-travel.jpg';
import groupsImage from '@/assets/groups-travel.jpg';
import honeymoonImage from '@/assets/honeymoon-travel.jpg';
import soloImage from '@/assets/solo-travel.jpg';

const StartJourney: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'BY TRAVELLER' | 'MOST POPULAR' | 'BY MONTH' | 'IN THE SPOTLIGHT'>('BY TRAVELLER');

  const travelerTypes = [
    { title: 'FAMILY', image: familyImage, link: '/family-travel' },
    { title: 'COUPLES', image: couplesImage, link: '/deals' },
    { title: 'GROUPS', image: groupsImage, link: '/deals' },
    { title: 'HONEYMOON', image: honeymoonImage, link: '/deals' },
    { title: 'SOLO', image: soloImage, link: '/solo-travel' }
  ];

  const popularDestinations = [
    { title: 'ROME', image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&h=1200&fit=crop', link: '/destinations/rome' },
    { title: 'MIAMI', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=1200&fit=crop', link: '/destinations/miami' },
    { title: 'KENYA', image: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800&h=1200&fit=crop', link: '/destinations/kenya' },
    { title: 'JAPAN', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&h=1200&fit=crop', link: '/destinations/japan' }
  ];

  const monthlyDestinations = [
    { title: 'JANUARY', image: 'https://images.unsplash.com/photo-1483921020237-2ff51e8e4b22?w=400&h=600&fit=crop', link: '/deals?month=january' },
    { title: 'FEBRUARY', image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=600&fit=crop', link: '/deals?month=february' },
    { title: 'MARCH', image: 'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=400&h=600&fit=crop', link: '/deals?month=march' },
    { title: 'APRIL', image: 'https://images.unsplash.com/photo-1464822759844-d150baec0494?w=400&h=600&fit=crop', link: '/deals?month=april' },
    { title: 'MAY', image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=600&fit=crop', link: '/deals?month=may' },
    { title: 'JUNE', image: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=400&h=600&fit=crop', link: '/deals?month=june' },
    { title: 'JULY', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop', link: '/deals?month=july' },
    { title: 'AUGUST', image: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400&h=600&fit=crop', link: '/deals?month=august' },
    { title: 'SEPTEMBER', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop', link: '/deals?month=september' },
    { title: 'OCTOBER', image: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=400&h=600&fit=crop', link: '/deals?month=october' },
    { title: 'NOVEMBER', image: 'https://images.unsplash.com/photo-1464822759844-d150baec0494?w=400&h=600&fit=crop', link: '/deals?month=november' },
    { title: 'DECEMBER', image: 'https://images.unsplash.com/photo-1483921020237-2ff51e8e4b22?w=400&h=600&fit=crop', link: '/deals?month=december' }
  ];

  const spotlightEvents = [
    {
      title: 'Edinburgh Festival Fringe',
      subtitle: 'Edinburgh, Scotland',
      date: 'Jul 30 - Aug 28',
      image: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=600&h=800&fit=crop',
      link: '/events/edinburgh-fringe'
    },
    {
      title: 'Lollapalooza',
      subtitle: 'Grant Park, Chicago, USA',
      date: 'Jul 31 - Aug 3',
      image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=800&fit=crop',
      link: '/events/lollapalooza'
    },
    {
      title: 'Bristol International Balloon Fiesta',
      subtitle: 'Bristol, UK',
      date: 'Aug 6 - Aug 9',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=800&fit=crop',
      link: '/events/bristol-balloon-fiesta'
    }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'BY TRAVELLER':
        return (
          <div className="grid grid-cols-5 gap-4 mb-8">
            {travelerTypes.map((type, index) => (
              <Link 
                key={index}
                to={type.link}
                className="relative h-96 bg-cover bg-center group cursor-pointer block"
                style={{ backgroundImage: `url('${type.image}')` }}
              >
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors"></div>
                <div className="absolute inset-0 flex items-center justify-center text-white">
                  <h3 className="text-2xl font-bold !text-white !text-2xl text-center" style={{ color: 'white !important', fontSize: '1.5rem !important', fontWeight: 'bold !important' }}>{type.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        );

      case 'MOST POPULAR':
        return (
          <div className="grid grid-cols-4 gap-4 mb-8">
            {popularDestinations.map((destination, index) => (
              <Link 
                key={index}
                to={destination.link}
                className="relative h-96 bg-cover bg-center group cursor-pointer block rounded-lg overflow-hidden"
                style={{ backgroundImage: `url('${destination.image}')` }}
              >
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors"></div>
                <div className="absolute bottom-6 left-6 text-white">
                  <h3 className="text-2xl font-bold !text-white !text-2xl" style={{ color: 'white !important', fontSize: '1.5rem !important', fontWeight: 'bold !important' }}>{destination.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        );

      case 'BY MONTH':
        return (
          <div className="grid grid-cols-6 gap-4 mb-8">
            {monthlyDestinations.map((month, index) => (
              <Link 
                key={index}
                to={month.link}
                className="relative h-64 bg-cover bg-center group cursor-pointer block rounded-lg overflow-hidden"
                style={{ backgroundImage: `url('${month.image}')` }}
              >
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors"></div>
                <div className="absolute bottom-6 left-6 text-white">
                  <h3 className="text-2xl font-bold !text-white !text-2xl" style={{ color: 'white !important', fontSize: '1.5rem !important', fontWeight: 'bold !important' }}>{month.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        );

      case 'IN THE SPOTLIGHT':
        return (
          <div className="grid grid-cols-3 gap-6 mb-8">
            {spotlightEvents.map((event, index) => (
              <Link 
                key={index}
                to={event.link}
                className="relative h-96 bg-cover bg-center group cursor-pointer block rounded-lg overflow-hidden"
                style={{ backgroundImage: `url('${event.image}')` }}
              >
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors"></div>
                <div className="absolute bottom-6 left-6 text-white">
                  <h3 className="text-2xl font-bold !text-white !text-2xl" style={{ color: 'white !important', fontSize: '1.5rem !important', fontWeight: 'bold !important' }}>{event.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <section className="py-8 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-center mb-8 text-gray-900">START YOUR JOURNEY</h2>
        
        <div className="flex justify-center mb-12">
          <div className="flex space-x-8 text-sm">
            {(['BY TRAVELLER', 'MOST POPULAR', 'BY MONTH', 'IN THE SPOTLIGHT'] as const).map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-2 font-medium transition-colors ${
                  activeTab === tab 
                    ? 'text-red-500 border-b-2 border-red-500' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {renderContent()}

        <div className="text-center">
          <Link 
            to="/deals"
            className="bg-black text-white px-8 py-3 text-sm font-medium tracking-wider hover:bg-gray-800 transition-colors inline-block"
          >
            VIEW MORE
          </Link>
        </div>
      </div>
    </section>
  );
};

export default StartJourney;