import React from 'react';
import { SEOHead } from '@/components/SEOHead';
import Header from '@/components/Header';
import EnhancedHeroSection from '@/components/EnhancedHeroSection';
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
import ExpediaWidget from '@/components/ExpediaWidget';
import FloatingFlightButton from '@/components/FloatingFlightButton';

const Index = () => {
  return (
    <>
      <SEOHead 
        title="Put the World in Your Hands | Utrippin.ai"
        description="Find extraordinary deals for every budget. Travel more, spend less, experience everything with AI-powered travel planning."
        canonical="https://utrippin.ai"
        keywords="budget travel, cheap flights, hotel deals, travel packages, AI travel planner"
      />

      {/* Navigation - Outside BlackTomato styling */}
      <Header />
      
      <div className="min-h-screen bg-white blacktomato-homepage">
        {/* Hero Section */}
        <EnhancedHeroSection />

        {/* Flight Search Widget */}
        <section className="flight-widget-section py-12 px-4 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Book Your Next Adventure
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Search millions of flights, hotels, and packages. Find the best deals for your perfect trip.
              </p>
            </div>
            
            <div className="flex justify-center">
              <ExpediaWidget />
            </div>
          </div>
        </section>

        {/* Testimonials */}
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
        <FloatingFlightButton position="bottom" />
      </div>
    </>
  );
};

export default Index;
