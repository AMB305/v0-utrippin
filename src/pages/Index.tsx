import React from 'react';
import { SEOHead } from '@/components/SEOHead';
import LuxuryNav from '@/components/LuxuryNav';
import EnhancedHeroSection from '@/components/EnhancedHeroSection';
import SwipeToTravelHero from '@/components/SwipeToTravelHero';
import FlightSearchHero from '@/components/FlightSearchHero';
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

const Index = () => {
  return (
    <>
      <SEOHead 
        title="#1 AI Trip Planner for Flights, Hotels, Cars & More – Utrippin.ai"
        description="Utrippin.ai is the #1 AI trip planner for booking flights, hotels, cars, and curating cultural experiences with The Melanin Compass. Plan your perfect vacation with our AI Traveler and connect with like-minded Travel Buddies."
        canonical="https://utrippin.ai"
        keywords="AI trip planner, flights, hotels, cars, melanin compass, AI traveler, travel buddies, black-owned businesses, cultural travel"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "Utrippin.ai",
          "url": "https://utrippin.ai",
          "description": "Utrippin.ai is the #1 AI travel planner to book flights, hotels, and cars, discover culturally rich destinations with The Melanin Compass, plan smarter with our AI Traveler, and connect with Travel Buddies.",
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://utrippin.ai/search?q={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        }}
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

          {/* Budget Planner Tool */}
          <BudgetPlannerTool />

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