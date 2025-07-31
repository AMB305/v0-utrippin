// src/pages/ItineraryView.tsx

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Share2, 
  Download, 
  Bookmark, 
  BookmarkCheck,
  Plane,
  Hotel,
  Mail,
  MapPin,
  Calendar,
  Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SEOHead } from '@/components/SEOHead';
import { ComprehensiveItinerary } from '@/lib/schemas';
import { DailyPlan } from '@/components/comprehensive-itinerary/DailyPlan';
import { CultureAdapter } from '@/components/comprehensive-itinerary/CultureAdapter';
import { CategoryRecommendations } from '@/components/comprehensive-itinerary/CategoryRecommendations';
import { getItinerary } from '@/utils/itineraryStorage';

export default function ItineraryView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [itinerary, setItinerary] = useState<ComprehensiveItinerary | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const savedItinerary = getItinerary(id);
      setItinerary(savedItinerary);
    }
    setLoading(false);
  }, [id]);

  const handleShare = async () => {
    if (!itinerary) return;
    
    const shareData = {
      title: itinerary.tripTitle,
      text: `Check out this amazing ${itinerary.travelStyle} trip to ${itinerary.destinationCity}!`,
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    // TODO: Implement save to database
  };

  const handleDownloadPDF = () => {
    // TODO: Implement PDF generation
    console.log('Generating PDF...');
  };

  const handleEmailToAgent = () => {
    if (!itinerary) return;
    
    const subject = `Travel Inquiry: ${itinerary.tripTitle}`;
    const body = `Hi! I'm interested in booking this trip to ${itinerary.destinationCity} from ${itinerary.startDate} to ${itinerary.endDate}. Please help me with the arrangements.`;
    
    window.location.href = `mailto:agent@utrippin.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your itinerary...</p>
        </div>
      </div>
    );
  }

  if (!itinerary) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Itinerary Not Found</h1>
          <p className="text-muted-foreground mb-6">The itinerary you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate('/ai-travel')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to AI Travel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEOHead 
        title={`${itinerary.tripTitle} - Travel Itinerary`}
        description={itinerary.introductoryMessage}
      />

      {/* Hero Header */}
      <header className="relative h-64 md:h-80 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20" />
        {itinerary.imageCollageUrls[0] && (
          <img
            src={itinerary.imageCollageUrls[0]}
            alt={itinerary.destinationCity}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black/40" />
        
        {/* Hero Content */}
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-6xl mx-auto px-4 w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-white"
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                {itinerary.tripTitle}
              </h1>
              <div className="flex flex-wrap items-center gap-6 text-lg">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  {itinerary.destinationCity}, {itinerary.destinationCountry}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  {itinerary.startDate} - {itinerary.endDate}
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  {itinerary.numberOfTravelers} {itinerary.numberOfTravelers === 1 ? 'Traveler' : 'Travelers'}
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="absolute top-4 right-4 flex gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate('/ai-travel')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
      </header>

      {/* Prominent Action Buttons */}
      <div className="bg-white border-b shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button onClick={handleShare} variant="outline" className="flex-1 max-w-[200px]">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            
            <Button onClick={handleEmailToAgent} variant="outline" className="flex-1 max-w-[200px]">
              <Mail className="h-4 w-4 mr-2" />
              Email to Agent
            </Button>
            
            <Button 
              onClick={() => navigate('/flights')} 
              className="flex-1 max-w-[200px] bg-blue-600 hover:bg-blue-700"
            >
              <Plane className="h-4 w-4 mr-2" />
              Book a Flight
            </Button>
            
            <Button 
              onClick={() => navigate('/hotels')} 
              className="flex-1 max-w-[200px] bg-green-600 hover:bg-green-700"
            >
              <Hotel className="h-4 w-4 mr-2" />
              Book a Hotel
            </Button>
            
            <Button onClick={handleSave} variant="outline" size="sm">
              {isSaved ? <BookmarkCheck className="h-4 w-4 mr-2" /> : <Bookmark className="h-4 w-4 mr-2" />}
              {isSaved ? 'Saved' : 'Save'}
            </Button>
            
            <Button onClick={handleDownloadPDF} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              PDF
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column: Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Trip Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card rounded-lg p-6 border shadow-sm"
            >
              <h2 className="text-2xl font-bold mb-4">Trip Overview</h2>
              <p className="text-muted-foreground leading-relaxed">
                {itinerary.introductoryMessage}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                  {itinerary.travelStyle}
                </span>
              </div>
            </motion.div>

            {/* Daily Itinerary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <DailyPlan days={itinerary.dailyPlan} />
            </motion.div>

            {/* Culture Tips */}
            {itinerary.additionalInfo.cultureAdapter.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <CultureAdapter tips={itinerary.additionalInfo.cultureAdapter} />
              </motion.div>
            )}

            {/* Additional Recommendations */}
            {itinerary.additionalInfo.categoryBasedRecommendations.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <CategoryRecommendations 
                  recommendations={itinerary.additionalInfo.categoryBasedRecommendations} 
                />
              </motion.div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Booking Modules */}
            {Object.entries(itinerary.bookingModules).map(([type, module]) => (
              <motion.div
                key={type}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-card rounded-lg p-6 border shadow-sm"
              >
                <h3 className="text-lg font-semibold mb-4 capitalize">{module.title}</h3>
                <div className="space-y-3">
                  {module.items.slice(0, 2).map((item, index) => (
                    <div key={index} className="border rounded-lg p-3">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-sm">{item.name}</h4>
                        <span className="text-primary font-semibold text-sm">{item.price}</span>
                      </div>
                      {item.rating && (
                        <div className="text-xs text-muted-foreground mb-2">
                          ⭐ {item.rating}/5
                        </div>
                      )}
                      {item.description && (
                        <p className="text-xs text-muted-foreground mb-3">{item.description}</p>
                      )}
                      <Button 
                        size="sm" 
                        className="w-full"
                        onClick={() => window.open(item.bookingLink, '_blank')}
                      >
                        Book Now
                      </Button>
                    </div>
                  ))}
                </div>
                {module.defaultUrl && (
                  <Button 
                    variant="outline" 
                    className="w-full mt-3"
                    onClick={() => window.open(module.defaultUrl, '_blank')}
                  >
                    View All Options
                  </Button>
                )}
              </motion.div>
            ))}

            {/* Image Collage */}
            {itinerary.imageCollageUrls.length > 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-card rounded-lg p-6 border shadow-sm"
              >
                <h3 className="text-lg font-semibold mb-4">Destination Gallery</h3>
                <div className="grid grid-cols-2 gap-2">
                  {itinerary.imageCollageUrls.slice(1, 5).map((url, index) => (
                    <img
                      key={index}
                      src={url}
                      alt={`${itinerary.destinationCity} ${index + 1}`}
                      className="w-full h-20 object-cover rounded-lg"
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Sources */}
        {itinerary.utility.sources.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-12 pt-8 border-t"
          >
            <h3 className="text-lg font-semibold mb-4">Sources & References</h3>
            <div className="text-sm text-muted-foreground space-y-1">
              {itinerary.utility.sources.map((source, index) => (
                <div key={index}>• {source}</div>
              ))}
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}