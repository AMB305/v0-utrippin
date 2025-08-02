import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ComprehensiveItineraryDisplay } from '@/components/comprehensive-itinerary/ComprehensiveItineraryDisplay';

const ComprehensiveItineraryPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [itinerary, setItinerary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get itinerary from localStorage
    const storedItinerary = localStorage.getItem(`itinerary_${id}`);
    if (storedItinerary) {
      setItinerary(JSON.parse(storedItinerary));
    } else {
      // If no itinerary found, redirect back to AI travel
      navigate('/ai-travel');
    }
    setLoading(false);
  }, [id, navigate]);

  const handleBack = () => {
    navigate('/ai-travel');
  };

  const handleQuickReply = (message: string) => {
    // Store the message for the chat and navigate back
    localStorage.setItem('pendingMessage', message);
    navigate('/ai-travel');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!itinerary) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Itinerary not found</h1>
          <p className="text-gray-600 mb-4">The itinerary you're looking for doesn't exist.</p>
          <button 
            onClick={handleBack}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            Back to AI Travel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ComprehensiveItineraryDisplay
        itinerary={itinerary}
        onBack={handleBack}
        onQuickReply={handleQuickReply}
      />
    </div>
  );
};

export default ComprehensiveItineraryPage;
