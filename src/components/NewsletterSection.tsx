import React from 'react';
import { Button } from '@/components/ui/button';

export const NewsletterSection = () => {
  return (
    <section className="bg-blavity-yellow py-16">
      <div className="max-w-3xl mx-auto text-center px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
          Get the best Black Travel content
        </h2>
        <p className="text-lg text-black mb-8 max-w-2xl mx-auto">
          Join thousands of Black travelers getting weekly inspiration, travel deals, and cultural insights delivered straight to their inbox.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
          <input 
            type="email" 
            placeholder="Your email address"
            className="flex-1 px-4 py-3 rounded-lg border-0 text-black placeholder-gray-500 focus:ring-2 focus:ring-black"
          />
          <Button className="bg-black text-white hover:bg-blavity-soft-black px-8 py-3 rounded-lg font-semibold transition-colors">
            Subscribe
          </Button>
        </div>
        
        <p className="text-sm text-black/70 mt-4">
          No spam, unsubscribe anytime. We respect your inbox.
        </p>
      </div>
    </section>
  );
};