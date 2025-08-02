import React from 'react';
import { Bed, Ticket, Train, Percent } from 'lucide-react';

const discountCards = [
  {
    icon: Bed,
    title: 'Hotels',
    discount: '10% off',
    description: 'Book hotels worldwide',
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-500/10',
    textColor: 'text-blue-400'
  },
  {
    icon: Ticket,
    title: 'Tours & Tickets',
    discount: '5% off',
    description: 'Attractions & activities',
    color: 'from-green-500 to-green-600',
    bgColor: 'bg-green-500/10',
    textColor: 'text-green-400'
  },
  {
    icon: Train,
    title: 'China Trains',
    discount: '3% off',
    description: 'High-speed rail tickets',
    color: 'from-orange-500 to-orange-600',
    bgColor: 'bg-orange-500/10',
    textColor: 'text-orange-400'
  },
];

export const TravelDiscountCards: React.FC = () => {
  return (
    <div className="px-4 py-6">
      <h2 className="text-lg font-semibold text-mobile-text-primary mb-4">Special Offers</h2>
      
      <div className="space-y-3">
        {discountCards.map((card) => (
          <div
            key={card.title}
            className="bg-mobile-card-bg border border-mobile-border-color rounded-xl p-4 hover:border-mobile-primary-teal/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 ${card.bgColor} rounded-xl flex items-center justify-center`}>
                <card.icon className={`w-5 h-5 ${card.textColor}`} />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-mobile-text-primary text-sm">{card.title}</h3>
                  <div className="flex items-center gap-1 bg-mobile-primary-teal/20 px-2 py-1 rounded-full">
                    <Percent className="w-3 h-3 text-mobile-primary-teal" />
                    <span className="text-mobile-primary-teal text-xs font-medium">{card.discount}</span>
                  </div>
                </div>
                <p className="text-mobile-text-secondary text-xs">{card.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
