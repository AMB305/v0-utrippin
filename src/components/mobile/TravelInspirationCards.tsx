import React from 'react';
import { ArrowRight, Star } from 'lucide-react';

const inspirationCards = [
  {
    title: 'Explore North America',
    subtitle: 'Discover vibrant cities',
    price: 'From $299',
    rating: '4.8',
    image: '/lovable-uploads/north-america-placeholder.jpg',
    gradient: 'from-blue-600 to-purple-600'
  },
  {
    title: 'Asian Adventures',
    subtitle: 'Experience rich cultures',
    price: 'From $199',
    rating: '4.9',
    image: '/lovable-uploads/asia-placeholder.jpg',
    gradient: 'from-green-600 to-teal-600'
  },
  {
    title: 'European Getaways',
    subtitle: 'Historic charm awaits',
    price: 'From $399',
    rating: '4.7',
    image: '/lovable-uploads/europe-placeholder.jpg',
    gradient: 'from-orange-600 to-red-600'
  }
];

export const TravelInspirationCards: React.FC = () => {
  return (
    <div className="px-4 py-6">
      <h2 className="text-lg font-semibold text-mobile-text-primary mb-4">Travel Inspiration</h2>
      
      <div className="space-y-4">
        {inspirationCards.map((card, index) => (
          <div
            key={card.title}
            className="relative rounded-xl overflow-hidden bg-mobile-card-bg border border-mobile-border-color group hover:border-mobile-primary-teal/50 transition-colors"
          >
            {/* Background Gradient (placeholder for image) */}
            <div className={`aspect-[16/9] bg-gradient-to-br ${card.gradient} relative`}>
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/40" />
              
              {/* Content */}
              <div className="absolute inset-0 p-4 flex flex-col justify-between text-white">
                {/* Rating */}
                <div className="flex items-center gap-1 bg-black/30 backdrop-blur-sm rounded-full px-2 py-1 self-start">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs font-medium">{card.rating}</span>
                </div>
                
                {/* Bottom Content */}
                <div>
                  <h3 className="font-bold text-lg mb-1">{card.title}</h3>
                  <p className="text-white/80 text-sm mb-2">{card.subtitle}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">{card.price}</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};