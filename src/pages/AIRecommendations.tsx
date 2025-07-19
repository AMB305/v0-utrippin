import React from 'react';
import { AITripRecommendations } from '@/components/AITripRecommendations';
import Header from '@/components/Header';
import { BackToTop } from '@/components/BackToTop';

const AIRecommendations = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/10">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <AITripRecommendations />
      </main>
      <BackToTop />
    </div>
  );
};

export default AIRecommendations;