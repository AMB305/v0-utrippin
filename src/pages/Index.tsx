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
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Heart, MessageCircle, MapPin } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const Index = () => {
  const { user } = useAuth();

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

      <div className="min-h-screen bg-black">
        {/* Header */}
        <header className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-red-600 to-red-500 flex items-center justify-center">
              <span className="text-white font-bold text-sm">U</span>
            </div>
            <span className="text-white font-bold text-xl">UTRIPPIN</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/travel-buddies">
              <Button variant="ghost" className="text-white hover:text-gray-300">
                Start a Trip
              </Button>
            </Link>
            <Link to="/auth">
              <Button variant="ghost" className="text-white hover:text-gray-300">
                Login
              </Button>
            </Link>
            <Link to="/auth">
              <Button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full">
                JOIN UTRIPPIN
              </Button>
            </Link>
          </div>
        </header>

        {/* Hero Section */}
        <section className="relative min-h-[70vh] flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1920')`
            }}
          />
          <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Find A Travel Buddy,<br />
              Share Costs & Experiences
            </h1>
            
            <div className="bg-white rounded-full p-2 flex items-center max-w-md mx-auto mb-8">
              <Search className="w-5 h-5 text-gray-400 ml-4" />
              <Input
                placeholder="Where are you traveling to?"
                className="border-0 bg-transparent flex-1 px-4 focus:ring-0"
              />
              <Button className="bg-red-600 hover:bg-red-700 text-white rounded-full px-8">
                Search
              </Button>
            </div>

            <p className="text-xl text-white">
              Travelers From <span className="font-bold">190+ Countries</span> Have Started{' '}
              <span className="font-bold">Over 40000 Trips</span> on UTRIPPIN
            </p>
          </div>
        </section>

        {/* Stats Cards */}
        <section className="px-6 py-16">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
            <Card className="bg-gray-800 border-gray-700 rounded-3xl overflow-hidden">
              <CardContent className="p-8 text-white">
                <h3 className="text-xl font-semibold mb-2">Travelers from</h3>
                <h2 className="text-4xl font-bold mb-2">190+ Countries</h2>
                <p className="text-gray-300 mb-6">Around the world</p>
                <Button className="bg-white text-gray-900 hover:bg-gray-100">
                  Find Trips
                </Button>
              </CardContent>
            </Card>
            
            <Card className="bg-blue-900 border-blue-800 rounded-3xl overflow-hidden">
              <CardContent className="p-8 text-white">
                <h3 className="text-xl font-semibold mb-2">Started</h3>
                <h2 className="text-4xl font-bold mb-2">40000+ Trips</h2>
                <p className="text-gray-300 mb-6">Worldwide</p>
                <Button className="bg-white text-gray-900 hover:bg-gray-100">
                  Start A Trip
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* How Utrippin Works */}
        <section className="px-6 py-16 bg-white">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-16">How UTRIPPIN Works</h2>
            
            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full border-2 border-red-600">
                  <Search className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Search Destination</h3>
                <p className="text-gray-600">Search and select a destination that you are traveling to.</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full border-2 border-red-600">
                  <Heart className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Find Travel Partners</h3>
                <p className="text-gray-600">Browse through the list of trips, locals, and nearby users in that location.</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full border-2 border-red-600">
                  <MessageCircle className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Get Connected</h3>
                <p className="text-gray-600">When you find someone that you want to meet up with, click the connect button and start chatting with them.</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full border-2 border-red-600">
                  <MapPin className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Trip Together</h3>
                <p className="text-gray-600">Plan together, meet up with your travel companion at a pre-decided public place and travel together.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="px-6 py-16 bg-gray-900 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Share Your Next Adventure?
          </h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Tired of traveling alone? Connect, plan tours, and travel together with users from over 190 countries.
          </p>
          <Link to="/auth">
            <Button className="bg-red-600 hover:bg-red-700 text-white px-10 py-3 rounded-full text-lg font-semibold">
              Join Utrippin Today
            </Button>
          </Link>
        </section>
      </div>
    </>
  );
};

export default Index;