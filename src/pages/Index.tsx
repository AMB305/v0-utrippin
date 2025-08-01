import React from 'react';
import { Link } from 'react-router-dom';
import { SEOHead } from '@/components/SEOHead';
import LuxuryNav from '@/components/LuxuryNav';
import EnhancedHeroSection from '@/components/EnhancedHeroSection';
import SwipeToTravelHero from '@/components/SwipeToTravelHero';
import SmartTravelExperts from '@/components/SmartTravelExperts';
import WhatWeDoSection from '@/components/WhatWeDoSection';
import GuideToTravel from '@/components/GuideToTravel';
import PursuitOfFeeling from '@/components/PursuitOfFeeling';
import BudgetPlannerTool from '@/components/BudgetPlannerTool';
import DealsEngine from '@/components/DealsEngine';
import AwardsSection from '@/components/AwardsSection';
import ExploreOurTrips from '@/components/ExploreOurTrips';
import StartJourney from '@/components/StartJourney';
import TestimonialsSection from '@/components/TestimonialsSection';

import Footer from '@/components/Footer';
import { ChatAssistant } from '@/components/ChatAssistant';
import { BackToTop } from '@/components/BackToTop';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Heart, MessageCircle, MapPin } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const Index = () => {
  console.log('🏠 HOMEPAGE INDEX COMPONENT IS LOADING!');
  const { user } = useAuth();

  return (
    <>
      <SEOHead 
        title="Utrippin - Your AI-Powered Travel Companion"
        description="Discover amazing destinations, book flights, find hotels, and get personalized travel recommendations with Utrippin's AI travel planner."
        canonical="/"
        keywords="travel, AI travel planner, flights, hotels, destinations, travel recommendations"
      />
      
      <LuxuryNav />
      <EnhancedHeroSection />
      <SwipeToTravelHero />
      <SmartTravelExperts />
      <WhatWeDoSection />
      <GuideToTravel />
      <PursuitOfFeeling />
      <BudgetPlannerTool />
      <DealsEngine />
      <AwardsSection />
      <ExploreOurTrips />
      <StartJourney />
      <TestimonialsSection />
      <Footer />
      <ChatAssistant />
      <BackToTop />
    </>
  );
};

export default Index;