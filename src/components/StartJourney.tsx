import React from 'react';
import { Link } from 'react-router-dom';

const StartJourney: React.FC = () => {
  const travelerTypes = [
    {
      title: 'FAMILY',
      image: '/lovable-uploads/c339dff8-df47-4af7-a6be-7f7f7f6794cc.png',
      link: '/family-travel'
    },
    {
      title: 'COUPLES',
      image: '/lovable-uploads/c339dff8-df47-4af7-a6be-7f7f7f6794cc.png',
      link: '/deals'
    },
    {
      title: 'GROUPS',
      image: '/lovable-uploads/c339dff8-df47-4af7-a6be-7f7f7f6794cc.png',
      link: '/deals'
    },
    {
      title: 'HONEYMOON',
      image: '/lovable-uploads/c339dff8-df47-4af7-a6be-7f7f7f6794cc.png',
      link: '/deals'
    },
    {
      title: 'SOLO',
      image: '/lovable-uploads/c339dff8-df47-4af7-a6be-7f7f7f6794cc.png',
      link: '/solo-travel'
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-center mb-8 text-gray-900">START YOUR JOURNEY</h2>
        
        <div className="flex justify-center mb-12">
          <div className="flex space-x-8 text-sm">
            <button className="text-red-500 border-b-2 border-red-500 pb-2 font-medium">BY TRAVELLER</button>
            <button className="text-gray-500 hover:text-gray-700">MOST POPULAR</button>
            <button className="text-gray-500 hover:text-gray-700">BY MONTH</button>
            <button className="text-gray-500 hover:text-gray-700">IN THE SPOTLIGHT</button>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-4 mb-8">
          {travelerTypes.map((type, index) => (
            <Link 
              key={index}
              to={type.link}
              className="relative h-96 bg-cover bg-center group cursor-pointer block"
              style={{
                backgroundImage: `url('${type.image}')`
              }}
            >
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors"></div>
              <div className="absolute bottom-6 left-6 text-white">
                <h3 className="text-2xl font-bold">{type.title}</h3>
              </div>
            </Link>
          ))}
        </div>

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