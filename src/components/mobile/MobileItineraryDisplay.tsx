import React from 'react';
import { MapPin, Calendar, Users, Clock } from 'lucide-react';
import { ComprehensiveItinerary } from '@/lib/schemas';

interface MobileItineraryDisplayProps {
  itinerary: ComprehensiveItinerary;
  onQuickReply?: (reply: string) => void;
}

export const MobileItineraryDisplay: React.FC<MobileItineraryDisplayProps> = ({ 
  itinerary, 
  onQuickReply 
}) => {
  const formatDateRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const duration = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    
    return {
      range: `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
      duration: `${duration} days`
    };
  };

  const dateInfo = formatDateRange(itinerary.startDate, itinerary.endDate);

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm">
      {/* Trip Summary Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-sm opacity-90">
            <MapPin className="w-4 h-4" />
            <span>{itinerary.destinationCity}, {itinerary.destinationCountry}</span>
          </div>
          <div className="flex items-center gap-2 text-sm opacity-90">
            <Users className="w-4 h-4" />
            <span>{itinerary.numberOfTravelers} traveler{itinerary.numberOfTravelers > 1 ? 's' : ''}</span>
          </div>
        </div>
        <h2 className="text-lg font-semibold mb-1">{itinerary.tripTitle}</h2>
        <div className="flex items-center gap-4 text-sm opacity-90">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{dateInfo.range}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{dateInfo.duration}</span>
          </div>
        </div>
      </div>

      {/* Introductory Message */}
      <div className="p-4 bg-gray-50 border-b">
        <p className="text-sm text-gray-700 leading-relaxed">
          {itinerary.introductoryMessage}
        </p>
      </div>

      {/* Daily Itinerary */}
      <div className="divide-y divide-gray-100">
        {itinerary.dailyPlan.map((day, dayIndex) => (
          <div key={day.day} className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-sm font-semibold">
                {dayIndex + 1}
              </div>
              <h3 className="font-semibold text-gray-900">Day {dayIndex + 1}:</h3>
            </div>
            
            <div className="space-y-3 ml-10">
              {day.events.map((event, eventIndex) => (
                <div key={eventIndex} className="flex gap-3">
                  <div className="w-1 h-4 bg-blue-200 rounded-full flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <span className="text-gray-900 font-medium">
                          {event.title.includes('Visit') || event.title.includes('Explore') ? (
                            <>
                              {event.title.split(' ')[0]} {' '}
                              <span className="text-blue-600 font-semibold underline decoration-1 underline-offset-2">
                                {event.title.split(' ').slice(1).join(' ')}
                              </span>
                            </>
                          ) : (
                            event.title
                          )}
                        </span>
                        {event.description && (
                          <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                            {event.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Day Images */}
            {day.events.some(event => event.imageUrl) && (
              <div className="mt-4 ml-10">
                <div className="grid grid-cols-2 gap-2">
                  {day.events.filter(event => event.imageUrl).slice(0, 2).map((event, imageIndex) => (
                    <div key={imageIndex} className="relative">
                      <img 
                        src={event.imageUrl!} 
                        alt={event.title}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      {/* Image label overlay */}
                      <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-2 rounded-b-lg">
                        {event.title.split(' ').slice(-3).join(' ')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Travel Tips Section */}
      {itinerary.additionalInfo?.cultureAdapter && itinerary.additionalInfo.cultureAdapter.length > 0 && (
        <div className="p-4 bg-gray-50">
          <h3 className="font-semibold text-gray-900 mb-3">Here are some travel tips:</h3>
          
          <div className="space-y-3">
            <div>
              <h4 className="font-medium text-gray-800 text-sm">Currency:</h4>
              <p className="text-sm text-gray-600">
                {itinerary.destinationCity} uses the local currency. Check current exchange rates before traveling.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-800 text-sm">Weather:</h4>
              <p className="text-sm text-gray-600">
                Check the weather forecast for your travel dates and pack accordingly.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-800 text-sm">Culture:</h4>
              <p className="text-sm text-gray-600">
                {itinerary.additionalInfo.cultureAdapter[0]?.content || 'Respect local customs and traditions during your visit.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Additional Recommendations */}
      {itinerary.additionalInfo?.categoryBasedRecommendations && itinerary.additionalInfo.categoryBasedRecommendations.length > 0 && (
        <div className="p-4 border-t">
          <h3 className="font-semibold text-gray-900 mb-3">Here are some other Attraction recommendations:</h3>
          <div className="space-y-2">
            {itinerary.additionalInfo.categoryBasedRecommendations.slice(0, 3).map((rec, index) => 
              rec.items.slice(0, 1).map((item, itemIndex) => (
                <div key={`${index}-${itemIndex}`} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                  <span className="text-blue-600 text-sm font-medium underline decoration-1 underline-offset-2">
                    {item.name}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Map Section Placeholder */}
      <div className="p-4 bg-gray-50 border-t">
        <p className="text-sm text-gray-700 mb-3">Here's the map for this itinerary</p>
        <div className="w-full h-32 bg-gray-200 rounded-lg flex items-center justify-center">
          <div className="text-center text-gray-500">
            <MapPin className="w-6 h-6 mx-auto mb-1" />
            <p className="text-xs">Map coming soon</p>
          </div>
        </div>
      </div>

      {/* Quick Replies */}
      {itinerary.customizationCallToAction?.quickReplies && (
        <div className="p-4 bg-white border-t">
          <h3 className="font-medium text-gray-800 mb-3">You may also ask</h3>
          <div className="space-y-2">
            {itinerary.customizationCallToAction.quickReplies.slice(0, 3).map((reply, index) => (
              <button
                key={index}
                onClick={() => onQuickReply?.(reply)}
                className="w-full text-left p-3 bg-gray-50 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors flex items-center justify-between"
              >
                <span>{reply}</span>
                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                  <div className="w-0 h-0 border-l-2 border-r-2 border-b-3 border-l-transparent border-r-transparent border-b-blue-600 transform rotate-90" />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};