import React from 'react';
import { Link } from 'react-router-dom';
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
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

const Index = () => {
  const { user } = useAuth();

  // If user is logged in, show existing dashboard
  if (user) {
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
  }

  // Public home page for non-logged in users (as requested)
  return (
    <>
      <SEOHead 
        title="Find Your Next Travel Buddy – Utrippin"
        description="Join Utrippin's global community and explore together! Find verified travel buddies in 100+ countries."
        canonical="https://utrippin.ai"
        keywords="travel buddies, travel community, find travel partner, travel together"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "Utrippin",
          "url": "https://utrippin.ai",
          "description": "Join Utrippin's global community and explore together! Find verified travel buddies in 100+ countries."
        }}
      />

      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-red-600 relative">
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
              Find Your Next Travel Buddy
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-2xl">
              Join Utrippin's global community and explore together!
            </p>
            <Link to="/auth">
              <Button className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white text-lg rounded-full font-semibold">
                Get Started
              </Button>
            </Link>
          </div>
        </section>

        {/* Feature Highlights */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center px-6">
            {[
              { 
                icon: '🌎', 
                title: 'Global Community', 
                desc: 'Meet travelers in 100+ countries.' 
              },
              { 
                icon: '🔒', 
                title: 'Verified Profiles', 
                desc: 'Trust through email & social logins.' 
              },
              { 
                icon: '💬', 
                title: 'Instant Chat', 
                desc: 'Plan your trip together in real time.' 
              },
            ].map((feature, index) => (
              <div key={feature.title} className="p-6 bg-white rounded-2xl shadow-soft hover-lift">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-2xl font-semibold mb-2 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Call-to-Action Footer */}
        <footer className="py-16 bg-white text-center">
          <h2 className="text-3xl font-bold mb-4 text-gray-900">
            Ready to Share Your Next Adventure?
          </h2>
          <Link to="/auth">
            <Button className="px-10 py-3 bg-red-600 hover:bg-red-700 text-white rounded-full text-lg font-semibold">
              Join Utrippin Today
            </Button>
          </Link>
        </footer>
      </div>
    </>
  );
};

export default Index;