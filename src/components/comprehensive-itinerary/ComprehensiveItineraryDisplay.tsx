// src/components/comprehensive-itinerary/ComprehensiveItineraryDisplay.tsx

import React, { useState } from 'react';
import { Download, Share2, Bookmark, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ComprehensiveItinerary } from '@/lib/schemas';
import { ItineraryHeader } from './ItineraryHeader';
import { BookingModule } from './BookingModule';
import { DailyPlan } from './DailyPlan';
import { CultureAdapter } from './CultureAdapter';
import { CategoryRecommendations } from './CategoryRecommendations';

interface ComprehensiveItineraryDisplayProps {
  itinerary: ComprehensiveItinerary;
  onBack?: () => void;
  onQuickReply?: (reply: string) => void;
}

export const ComprehensiveItineraryDisplay: React.FC<ComprehensiveItineraryDisplayProps> = ({ 
  itinerary, 
  onBack,
  onQuickReply
}) => {
  const [isSaved, setIsSaved] = useState(false);

  const handleDownloadPDF = () => {
    if (itinerary.utility.downloadPdfLink) {
      window.open(itinerary.utility.downloadPdfLink, '_blank');
    } else {
      // Implement PDF generation
      console.log('Generating PDF for itinerary:', itinerary.itineraryId);
    }
  };

  const handleShare = async () => {
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
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    // TODO: Implement save to user's saved trips
    console.log('Saving itinerary:', itinerary.itineraryId);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Action Bar */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {onBack && (
                <Button variant="outline" size="sm" onClick={onBack}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              )}
              <h1 className="font-semibold text-lg truncate max-w-md">
                {itinerary.tripTitle}
              </h1>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSave}
                className={isSaved ? 'bg-primary text-primary-foreground' : ''}
              >
                <Bookmark className={`h-4 w-4 mr-2 ${isSaved ? 'fill-current' : ''}`} />
                {isSaved ? 'Saved' : 'Save'}
              </Button>
              
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              
              <Button variant="outline" size="sm" onClick={handleDownloadPDF}>
                <Download className="h-4 w-4 mr-2" />
                PDF
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Header Section */}
        <ItineraryHeader itinerary={itinerary} />

        {/* Booking Modules */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <BookingModule 
            module={itinerary.bookingModules.flights} 
            type="flights" 
          />
          <BookingModule 
            module={itinerary.bookingModules.accommodations} 
            type="accommodations" 
          />
        </div>

        {/* Daily Itinerary */}
        <div className="mb-8">
          <DailyPlan days={itinerary.dailyPlan} />
        </div>

        {/* Culture Tips */}
        {itinerary.additionalInfo.cultureAdapter.length > 0 && (
          <div className="mb-8">
            <CultureAdapter tips={itinerary.additionalInfo.cultureAdapter} />
          </div>
        )}

        {/* Additional Recommendations */}
        {itinerary.additionalInfo.categoryBasedRecommendations.length > 0 && (
          <div className="mb-8">
            <CategoryRecommendations 
              recommendations={itinerary.additionalInfo.categoryBasedRecommendations} 
            />
          </div>
        )}

        {/* Customization Call-to-Action */}
        {itinerary.customizationCallToAction && (
          <div className="mb-8">
            <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-lg p-6 border">
              <h3 className="text-xl font-semibold mb-3 text-center">
                {itinerary.customizationCallToAction.title}
              </h3>
              <div className="text-center mb-4 whitespace-pre-line">
                {itinerary.customizationCallToAction.message}
              </div>
              <div className="flex flex-wrap gap-2 justify-center">
                {itinerary.customizationCallToAction.quickReplies.map((reply, index) => (
                  <Button 
                    key={index} 
                    variant="outline" 
                    size="sm"
                    className="hover:bg-primary hover:text-primary-foreground transition-colors"
                    onClick={() => {
                      if (onQuickReply) {
                        onQuickReply(reply);
                      }
                    }}
                  >
                    {reply}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Sources */}
        {itinerary.utility.sources.length > 0 && (
          <div className="mt-12 pt-8 border-t">
            <h3 className="text-lg font-semibold mb-4">Sources & References</h3>
            <div className="text-sm text-muted-foreground space-y-1">
              {itinerary.utility.sources.map((source, index) => (
                <div key={index}>• {source}</div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};