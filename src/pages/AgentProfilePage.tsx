// src/pages/AgentProfilePage.tsx

import React from 'react';
import { Helmet } from 'react-helmet-async';
import AgentProfile from '@/components/AgentProfile';

const AgentProfilePage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Agent Profile - Configure Your Travel Agent Settings | Keila AI</title>
        <meta name="description" content="Configure your travel agent profile, set up affiliate IDs, and start earning commissions on travel bookings through Keila AI." />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Agent Profile</h1>
              <p className="text-slate-600">
                Configure your travel agent settings and affiliate partnerships to start earning commissions.
              </p>
            </div>
            
            <AgentProfile />
          </div>
        </div>
      </div>
    </>
  );
};

export default AgentProfilePage;