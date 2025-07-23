import React from 'react';
import { SEOHead } from '@/components/SEOHead';
import LuxuryNav from '@/components/LuxuryNav';
import EnhancedHeroSection from '@/components/EnhancedHeroSection';
import SwipeToTravelHero from '@/components/SwipeToTravelHero';
import FlightSearchHero from '@/components/FlightSearchHero';
import WhatWeDoSection from '@/components/WhatWeDoSection';
import GuideToTravel from '@/components/GuideToTravel';
import PursuitOfFeeling from '@/components/PursuitOfFeeling';
import HowWeWork from '@/components/HowWeWork';
import DealsEngine from '@/components/DealsEngine';
import AwardsSection from '@/components/AwardsSection';
import ExploreOurTrips from '@/components/ExploreOurTrips';
import StartJourney from '@/components/StartJourney';
import TestimonialsSection from '@/components/TestimonialsSection';
import ReadyToStart from '@/components/ReadyToStart';
import Footer from '@/components/Footer';
import { ChatAssistant } from '@/components/ChatAssistant';
import { BackToTop } from '@/components/BackToTop';

const Index = () => {
  return (
    <>
      <SEOHead 
        title="Put the World in Your Hands | Utrippin.ai"
        description="Find extraordinary deals for every budget. Travel more, spend less, experience everything with AI-powered travel planning."
        canonical="https://utrippin.ai"
        keywords="budget travel, cheap flights, hotel deals, travel packages, AI travel planner"
      />

      <div className="min-h-screen bg-white">
        {/* Navigation */}
        <LuxuryNav />

        {/* Hero Sections - Mobile vs Desktop */}
        <SwipeToTravelHero />
        <EnhancedHeroSection />

        {/* Testimonials - The Smart Travel Deal Experts */}
        <TestimonialsSection />

        {/* Start Journey */}
        <StartJourney />

        {/* Explore Our Trips */}
        <ExploreOurTrips />

        {/* Awards Section */}
        <AwardsSection />

        {/* Main Content */}
        <div className="">
          {/* Deals Engine */}
          <DealsEngine />

          {/* Alternating Checkerboard Layout Sections */}
          {/* Guide to Travel - Text LEFT, Image RIGHT */}
          <GuideToTravel />

          {/* The Melanin Compass - Image LEFT, Text RIGHT */}
          <PursuitOfFeeling />

          {/* What We Do Section - Text LEFT, Image RIGHT */}
          <WhatWeDoSection />

          {/* How We Work */}
          <HowWeWork />

          {/* Ready to Start */}
          <ReadyToStart />
        </div>

        {/* Footer */}
        <Footer />

        {/* Floating Components */}
        <ChatAssistant />
        <BackToTop />
      </div>
    </>
  );
};

export default Index;