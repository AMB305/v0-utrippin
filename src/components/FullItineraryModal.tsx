import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, DollarSign, MapPin, ExternalLink, X } from 'lucide-react';
import { ActivityMatchingService, Activity } from '@/services/ActivityMatchingService';

interface FullItineraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  destination: string;
  duration: string;
  planType?: 'Budget' | 'Standard' | 'Premium';
  activities: Activity[];
}

export const FullItineraryModal: React.FC<FullItineraryModalProps> = ({
  isOpen,
  onClose,
  destination,
  duration,
  planType = 'Standard',
  activities
}) => {
  const itinerary = ActivityMatchingService.generateDayByDayItinerary(destination, duration, activities);
  const restaurants = ActivityMatchingService.getRestaurantRecommendations(destination, planType);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-900 border-slate-700">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <DialogTitle className="text-2xl font-bold text-white">
              Complete {duration} Itinerary for {destination}
            </DialogTitle>
            <p className="text-slate-400 mt-1">
              Your detailed day-by-day travel guide with bookable activities
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </Button>
        </DialogHeader>

        <div className="space-y-6">
          {/* Itinerary Overview */}
          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-400" />
              Trip Overview
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-green-400" />
                <span className="text-slate-300">Destination: {destination}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-400" />
                <span className="text-slate-300">Duration: {duration}</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-yellow-400" />
                <span className="text-slate-300">Plan Type: {planType}</span>
              </div>
            </div>
          </div>

          {/* Day-by-Day Itinerary */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white">Daily Itinerary</h3>
            {itinerary.map((day, index) => (
              <div key={index} className="bg-slate-800/30 rounded-xl p-6 border border-slate-700">
                <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {day.day}
                  </div>
                  {day.title}
                </h4>

                <div className="space-y-4">
                  {/* Morning */}
                  <div className="bg-slate-700/30 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-orange-400" />
                        <span className="font-medium text-white">{day.morning.time} - Morning</span>
                      </div>
                      {day.morning.price && (
                        <span className="text-green-400 text-sm font-medium">{day.morning.price}</span>
                      )}
                    </div>
                    <h5 className="font-semibold text-white mb-1">{day.morning.activity}</h5>
                    <p className="text-slate-300 text-sm mb-2">{day.morning.description}</p>
                    {day.morning.bookingUrl && (
                      <Button
                        asChild
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-500"
                      >
                        <a href={day.morning.bookingUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-3 h-3 mr-1" />
                          Book Now
                        </a>
                      </Button>
                    )}
                  </div>

                  {/* Afternoon */}
                  {day.afternoon && (
                    <div className="bg-slate-700/30 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-blue-400" />
                          <span className="font-medium text-white">{day.afternoon.time} - Afternoon</span>
                        </div>
                        {day.afternoon.price && (
                          <span className="text-green-400 text-sm font-medium">{day.afternoon.price}</span>
                        )}
                      </div>
                      <h5 className="font-semibold text-white mb-1">{day.afternoon.activity}</h5>
                      <p className="text-slate-300 text-sm mb-2">{day.afternoon.description}</p>
                      {day.afternoon.bookingUrl && (
                        <Button
                          asChild
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-500"
                        >
                          <a href={day.afternoon.bookingUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-3 h-3 mr-1" />
                            Book Now
                          </a>
                        </Button>
                      )}
                    </div>
                  )}

                  {/* Evening */}
                  {day.evening && (
                    <div className="bg-slate-700/30 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-purple-400" />
                          <span className="font-medium text-white">{day.evening.time} - Evening</span>
                        </div>
                        {day.evening.price && (
                          <span className="text-green-400 text-sm font-medium">{day.evening.price}</span>
                        )}
                      </div>
                      <h5 className="font-semibold text-white mb-1">{day.evening.activity}</h5>
                      <p className="text-slate-300 text-sm">{day.evening.description}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Restaurant Recommendations */}
          <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              🍽️ Dining Recommendations ({restaurants.priceRange})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {restaurants.recommendations.map((rec, index) => (
                <div key={index} className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">•</span>
                  <span className="text-slate-300 text-sm">{rec}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Travel Tips */}
          <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-4">✈️ Travel Tips</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-300">
              <div>
                <h4 className="font-medium text-white mb-2">Transportation</h4>
                <ul className="space-y-1">
                  <li>• Book rideshares or taxis in advance</li>
                  <li>• Consider public transportation passes</li>
                  <li>• Download local transport apps</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-white mb-2">Packing</h4>
                <ul className="space-y-1">
                  <li>• Check weather forecasts before departure</li>
                  <li>• Pack comfortable walking shoes</li>
                  <li>• Bring portable chargers and adapters</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Expedia Booking Buttons */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-6 border-t border-slate-700">
          <Button
            asChild
            className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-medium"
            size="sm"
          >
            <a
              href={`https://www.expedia.com/Hotel-Search?destination=${encodeURIComponent(destination)}&camref=1101l5dQSW`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              🏨 Hotels
              <ExternalLink className="w-3 h-3" />
            </a>
          </Button>
          
          <Button
            asChild
            className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white font-medium"
            size="sm"
          >
            <a
              href={`https://www.expedia.com/Flights-Search?flight-type=on&trip=roundtrip&leg1=from:,to:${encodeURIComponent(destination)}&camref=1101l5dQSW`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              ✈️ Flights
              <ExternalLink className="w-3 h-3" />
            </a>
          </Button>
          
          <Button
            asChild
            className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white font-medium"
            size="sm"
          >
            <a
              href={`https://www.expedia.com/Cars?destination=${encodeURIComponent(destination)}&camref=1101l5dQSW`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              🚗 Cars
              <ExternalLink className="w-3 h-3" />
            </a>
          </Button>
          
          <Button
            asChild
            className="bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white font-medium"
            size="sm"
          >
            <a
              href="/travel-buddies"
              className="flex items-center gap-2"
            >
              📦 Meet Locals
            </a>
          </Button>
        </div>

        <div className="flex justify-end pt-4">
          <Button onClick={onClose} className="bg-blue-600 hover:bg-blue-500">
            Close Itinerary
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FullItineraryModal;