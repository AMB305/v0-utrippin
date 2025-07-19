import { useState, useEffect } from "react";

interface UserPreferences {
  name?: string;
  preferredDestinations?: string[];
  lastVisit?: string;
  viewedTrips?: string[];
  savedConversations?: Array<{
    id: string;
    title: string;
    lastMessage: string;
    timestamp: string;
  }>;
}

export const usePersonalization = () => {
  const [preferences, setPreferences] = useState<UserPreferences>({});
  const [welcomeMessage, setWelcomeMessage] = useState("");

  useEffect(() => {
    // Load preferences from localStorage
    const stored = localStorage.getItem('utrippin_user_preferences');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setPreferences(parsed);
        
        if (parsed.name) {
          const hourOfDay = new Date().getHours();
          const greeting = hourOfDay < 12 ? "Good morning" : hourOfDay < 18 ? "Good afternoon" : "Good evening";
          setWelcomeMessage(`Welcome back, ${parsed.name}`);
        } else {
          setWelcomeMessage("Welcome to Utrippin AI");
        }
      } catch (error) {
        console.error('Error parsing user preferences:', error);
        setWelcomeMessage("Welcome to Utrippin AI Travel Planner");
      }
    } else {
      setWelcomeMessage("Welcome to Utrippin AI");
    }

    // Update last visit
    const now = new Date().toISOString();
    setPreferences(prev => ({ ...prev, lastVisit: now }));
  }, []);

  const updatePreferences = (updates: Partial<UserPreferences>) => {
    const newPreferences = { ...preferences, ...updates };
    setPreferences(newPreferences);
    localStorage.setItem('utrippin_user_preferences', JSON.stringify(newPreferences));
  };

  const addViewedTrip = (tripId: string) => {
    const viewedTrips = preferences.viewedTrips || [];
    if (!viewedTrips.includes(tripId)) {
      const updated = [...viewedTrips, tripId].slice(-10); // Keep last 10
      updatePreferences({ viewedTrips: updated });
    }
  };

  const saveConversation = (title: string) => {
    const conversation = {
      id: Date.now().toString(),
      title: title.slice(0, 50),
      lastMessage: title,
      timestamp: new Date().toISOString()
    };
    
    const savedConversations = preferences.savedConversations || [];
    const updated = [conversation, ...savedConversations].slice(0, 10); // Keep last 10
    updatePreferences({ savedConversations: updated });
  };

  const getPersonalizedWelcome = () => {
    return welcomeMessage;
  };

  return {
    preferences,
    welcomeMessage: getPersonalizedWelcome(),
    updatePreferences,
    addViewedTrip,
    saveConversation
  };
};