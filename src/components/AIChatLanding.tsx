import React from 'react';
import { Button } from '@/components/ui/button';

interface AIChatLandingProps {
  onSignIn: () => void;
}

export default function AIChatLanding({ onSignIn }: AIChatLandingProps) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center px-4 py-10">
      {/* Greeting Header */}
      <div className="text-center mb-10 animate-fade-in">
        <div className="text-sm text-primary font-semibold">Hi there! I'm Keila 👋</div>
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mt-2">
          Ready to explore the world?
        </h1>
        <p className="text-muted-foreground mt-2">Let's plan your dream trip with AI ✨</p>
      </div>

      {/* Prompt Example */}
      <div className="bg-card rounded-xl p-4 max-w-lg text-center mb-6 shadow-md border">
        <p className="text-sm text-muted-foreground italic">
          Plan a 6-day adventure trip to Barcelona for 3 friends in October. Include hiking in Montserrat, a bike tour of the city, and a day for exploring Gothic Quarter. Budget-friendly options preferred.
        </p>
      </div>

      {/* Trip Style Buttons */}
      <div className="flex flex-wrap gap-2 justify-center mb-6">
        {['Create a new trip', 'Get inspired', 'Inspire me where to go', 'Solo trip', 'Partner', 'Family'].map((label, i) => (
          <Button key={i} variant="outline" className="text-sm">
            {label}
          </Button>
        ))}
      </div>

      {/* CTA Button */}
      <Button className="bg-primary hover:bg-primary/90 px-6 py-2 text-primary-foreground rounded-full text-lg shadow-lg mb-10">
        Let's Go ➝
      </Button>

      {/* Locked Input Placeholder */}
      <div className="bg-card p-6 rounded-xl max-w-xl w-full text-center border">
        <p className="text-muted-foreground text-sm">🔒 Please sign in to plan your dream trip with Keila</p>
        <Button onClick={onSignIn} className="mt-4 bg-secondary hover:bg-secondary/90 text-secondary-foreground px-4 py-2 rounded-full">
          Sign In
        </Button>
      </div>

      {/* Sample preview card */}
      <div className="mt-12 text-center text-sm text-muted-foreground">
        Want to see what Keila can do? Check out a sample 5-day trip to Cancun 👉 <a href="#" className="text-primary underline hover:text-primary/80">View Example</a>
      </div>
    </div>
  );
}