import React from 'react';
import { TravelSearchBar } from './TravelSearchBar';
import { TravelCategoriesGrid } from './TravelCategoriesGrid';
import { PopularDestinations } from './PopularDestinations';
import { TravelPromoBanner } from './TravelPromoBanner';
import { TravelDiscountCards } from './TravelDiscountCards';
import { TravelInspirationCards } from './TravelInspirationCards';
import { MobileTravelNavigation } from './MobileTravelNavigation';
import { KeilaChatBot } from './KeilaChatBot';

interface MobileTravelInterfaceProps {
  onSearch?: (query: string) => void;
  onCategorySelect?: (category: string) => void;
  onDestinationClick?: (destination: string) => void;
  onChatStart?: () => void;
  onSendMessage?: (message: string) => void;
  messages?: any[];
  isLoading?: boolean;
}

export const MobileTravelInterface: React.FC<MobileTravelInterfaceProps> = ({
  onSearch,
  onCategorySelect,
  onDestinationClick,
  onChatStart,
  onSendMessage,
  messages,
  isLoading
}) => {
  return (
    <div className="min-h-screen bg-mobile-dark relative">
      {/* Search Header */}
      <div className="bg-mobile-dark pt-safe-top px-4 pb-4">
        <TravelSearchBar onSearch={onSearch} />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto pb-32">
        {/* Travel Categories */}
        <TravelCategoriesGrid onCategorySelect={onCategorySelect} />
        
        {/* Popular Destinations */}
        <PopularDestinations onDestinationClick={onDestinationClick} />
        
        {/* Promo Banner */}
        <TravelPromoBanner />
        
        {/* Discount Cards */}
        <TravelDiscountCards />
        
        {/* Travel Inspiration */}
        <TravelInspirationCards />
      </div>

      {/* Bottom Navigation */}
      <MobileTravelNavigation />

      {/* Keila Chat Bot - Bottom Right */}
      <KeilaChatBot 
        onChatStart={onChatStart}
        onSendMessage={onSendMessage}
        messages={messages}
        isLoading={isLoading}
        onQuickReply={onSendMessage}
      />
    </div>
  );
};