import React, { useState } from "react";
import { X, MapPin, Clock, Users, DollarSign, Calendar, Star, Share2, Heart, BarChart3, ExternalLink } from "lucide-react";

interface TripPackage {
  destination: string;
  name: string;
  type: string;
  summary: string;
  budget: number;
  costPerPerson?: number;
  groupSize?: number;
  imageUrl?: string;
  highlights?: string[];
  duration: string;
  flightsLink: string;
  hotelsLink: string;
  carsLink: string;
  detailedItinerary?: any;
  costBreakdown?: {
    flights: number;
    hotels: number;
    food: number;
    activities: number;
    transportation: number;
  };
}

interface EnhancedItineraryModalProps {
  trip: TripPackage;
  onClose: () => void;
  onCompare?: (trip: TripPackage) => void;
  onSave?: (trip: TripPackage) => void;
}

export const EnhancedItineraryModal: React.FC<EnhancedItineraryModalProps> = ({
  trip,
  onClose,
  onCompare,
  onSave
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'itinerary' | 'costs' | 'booking'>('overview');
  const [isSaved, setIsSaved] = useState(false);

  const formatBudget = (amount: number) => {
    if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(1)}k`;
    }
    return `$${amount.toLocaleString()}`;
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    if (onSave) {
      onSave(trip);
    }
  };

  const createGoogleMapsLink = (location: string, destination: string) => {
    const query = encodeURIComponent(`${location}, ${destination}`);
    return `https://www.google.com/maps/search/?api=1&query=${query}`;
  };

  const renderLocationLink = (location: string) => {
    if (!location || location === 'Various locations' || location === 'Various Locations') {
      return <span>{location}</span>;
    }
    
    return (
      <a
        href={createGoogleMapsLink(location, trip.destination)}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-400 hover:text-blue-300 underline decoration-dotted flex items-center gap-1 transition-colors"
      >
        {location}
        <ExternalLink className="w-3 h-3" />
      </a>
    );
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: trip.name,
          text: trip.summary,
          url: window.location.href
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(`Check out this amazing trip: ${trip.name} - ${trip.summary}`);
    }
  };

  const renderItineraryDay = (day: string, details: any) => {
    // Handle different itinerary formats
    if (day === 'morning' || day === 'afternoon' || day === 'evening') {
      // Single day format
      return (
        <div key={day} className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/30">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-lg font-semibold text-white capitalize">
              {day}
            </h4>
            <span className="text-green-400 font-medium">
              {formatBudget(details.cost || 0)}
            </span>
          </div>
          <p className="text-slate-300">{details.activity || details.activities}</p>
          <div className="mt-2 flex items-center gap-4 text-sm text-slate-400">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{details.time || 'Flexible timing'}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {renderLocationLink(details.location || 'Various locations')}
            </div>
          </div>
        </div>
      );
    } else {
      // Multi-day format
      return (
        <div key={day} className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/30">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-lg font-semibold text-white capitalize">
              {day.replace('day', 'Day ')}
            </h4>
          </div>
          
          {details.morning && (
            <div className="mb-3 pb-3 border-b border-slate-600/30">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-blue-400">Morning</span>
                <span className="text-green-400 text-sm">{formatBudget(details.morning.cost || 0)}</span>
              </div>
              <p className="text-slate-300 text-sm">{details.morning.activity || details.morning.activities}</p>
              <div className="mt-1 flex items-center gap-3 text-xs text-slate-400">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{details.morning.time || '9:00 AM'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {renderLocationLink(details.morning.location || 'City center')}
                </div>
              </div>
            </div>
          )}
          
          {details.afternoon && (
            <div className="mb-3 pb-3 border-b border-slate-600/30">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-orange-400">Afternoon</span>
                <span className="text-green-400 text-sm">{formatBudget(details.afternoon.cost || 0)}</span>
              </div>
              <p className="text-slate-300 text-sm">{details.afternoon.activity || details.afternoon.activities}</p>
              <div className="mt-1 flex items-center gap-3 text-xs text-slate-400">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{details.afternoon.time || '2:00 PM'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {renderLocationLink(details.afternoon.location || 'Various locations')}
                </div>
              </div>
            </div>
          )}
          
          {details.evening && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-purple-400">Evening</span>
                <span className="text-green-400 text-sm">{formatBudget(details.evening.cost || 0)}</span>
              </div>
              <p className="text-slate-300 text-sm">{details.evening.activity || details.evening.activities}</p>
              <div className="mt-1 flex items-center gap-3 text-xs text-slate-400">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{details.evening.time || '6:00 PM'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {renderLocationLink(details.evening.location || 'Entertainment district')}
                </div>
              </div>
            </div>
          )}
          
          {!details.morning && !details.afternoon && !details.evening && (
            <div>
              <p className="text-slate-300">{details.activities || details.activity || 'Various activities planned'}</p>
              <div className="mt-2 flex items-center gap-4 text-sm text-slate-400">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>Full Day</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {renderLocationLink('Various Locations')}
                </div>
                <span className="text-green-400 font-medium">
                  {formatBudget(details.cost || 0)}
                </span>
              </div>
            </div>
          )}
        </div>
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="relative">
          {trip.imageUrl && (
            <div className="h-64 bg-cover bg-center" style={{ backgroundImage: `url(${trip.imageUrl})` }}>
              <div className="absolute inset-0 bg-black/40" />
            </div>
          )}
          
          <div className="absolute top-4 right-4 flex gap-2">
            <button
              onClick={handleShare}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white p-2 rounded-full transition-colors"
            >
              <Share2 className="w-5 h-5" />
            </button>
            <button
              onClick={handleSave}
              className={`backdrop-blur-sm p-2 rounded-full transition-colors ${
                isSaved 
                  ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' 
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              <Heart className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
            </button>
            {onCompare && (
              <button
                onClick={() => onCompare(trip)}
                className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white p-2 rounded-full transition-colors"
              >
                <BarChart3 className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={onClose}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white p-2 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="absolute bottom-4 left-4 right-4">
            <h2 className="text-3xl font-bold text-white mb-2">{trip.name}</h2>
            <div className="flex items-center gap-4 text-white/80">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{trip.destination}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{trip.duration}</span>
              </div>
              <div className="flex items-center gap-1">
                <DollarSign className="w-4 h-4" />
                <span>{formatBudget(trip.budget)} total</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-slate-600">
          <div className="flex">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'itinerary', label: 'Itinerary' },
              { id: 'costs', label: 'Costs' },
              { id: 'booking', label: 'Booking' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-4 font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-blue-400 border-b-2 border-blue-400'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[400px] overflow-y-auto">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">Trip Summary</h3>
                <p className="text-slate-300 leading-relaxed">{trip.summary}</p>
              </div>

              {trip.highlights && trip.highlights.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Highlights</h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    {trip.highlights.map((highlight, index) => (
                      <div key={index} className="flex items-start gap-3 bg-slate-700/30 rounded-lg p-4">
                        <Star className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-300">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-slate-700/30 rounded-lg p-4 text-center">
                  <Users className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                  <div className="text-white font-semibold">{trip.groupSize || 2} People</div>
                  <div className="text-slate-400 text-sm">Group Size</div>
                </div>
                <div className="bg-slate-700/30 rounded-lg p-4 text-center">
                  <Calendar className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <div className="text-white font-semibold">{trip.duration}</div>
                  <div className="text-slate-400 text-sm">Duration</div>
                </div>
                <div className="bg-slate-700/30 rounded-lg p-4 text-center">
                  <DollarSign className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                  <div className="text-white font-semibold">{formatBudget(trip.costPerPerson || 0)}</div>
                  <div className="text-slate-400 text-sm">Per Person</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'itinerary' && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white mb-4">Daily Itinerary</h3>
              
              {/* Price Disclaimer */}
              <div className="bg-amber-600/10 border border-amber-500/30 rounded-lg p-3 mb-4">
                <div className="flex items-center gap-2 text-amber-400 text-sm">
                  <span>💡</span>
                  <span className="font-medium">Price Disclaimer:</span>
                </div>
                <p className="text-amber-200/80 text-sm mt-1">
                  Prices shown are estimates and may vary based on availability, season, and current market rates. 
                  Please verify current pricing when booking.
                </p>
              </div>
              
              {trip.detailedItinerary && Object.keys(trip.detailedItinerary).length > 0 ? (
                <div className="space-y-4">
                  {Object.entries(trip.detailedItinerary).map(([day, details]) =>
                    renderItineraryDay(day, details as any)
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400">Detailed itinerary will be provided upon booking</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'costs' && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-white mb-4">Cost Breakdown</h3>
              
              {trip.costBreakdown && (
                <div className="space-y-4">
                  {/* Price Disclaimer for Costs Tab */}
                  <div className="bg-amber-600/10 border border-amber-500/30 rounded-lg p-3 mb-4">
                    <div className="flex items-center gap-2 text-amber-400 text-sm">
                      <span>💡</span>
                      <span className="font-medium">Price Disclaimer:</span>
                    </div>
                    <p className="text-amber-200/80 text-sm mt-1">
                      All prices are estimates based on current market data and may fluctuate due to availability, 
                      seasonality, and booking timing. Please confirm actual prices when making reservations.
                    </p>
                  </div>
                  
                  {[
                    { key: 'flights', label: 'Flights', icon: '✈️', color: 'text-blue-400' },
                    { key: 'hotels', label: 'Hotels', icon: '🏨', color: 'text-green-400' },
                    { key: 'food', label: 'Food & Dining', icon: '🍽️', color: 'text-orange-400' },
                    { key: 'activities', label: 'Activities', icon: '🎯', color: 'text-purple-400' },
                    { key: 'transportation', label: 'Transportation', icon: '🚗', color: 'text-teal-400' }
                  ].map(({ key, label, icon, color }) => {
                    const amount = trip.costBreakdown?.[key as keyof typeof trip.costBreakdown] || 0;
                    const percentage = Math.round((amount / trip.budget) * 100);
                    
                    return (
                      <div key={key} className="bg-slate-700/30 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{icon}</span>
                            <span className="text-white font-medium">{label}</span>
                          </div>
                          <div className="text-right">
                            <div className={`text-lg font-semibold ${color}`}>
                              {formatBudget(amount)}
                            </div>
                            <div className="text-slate-400 text-sm">{percentage}%</div>
                          </div>
                        </div>
                        <div className="w-full bg-slate-600 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${color.replace('text-', 'bg-')}`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-white">Total Cost</span>
                  <span className="text-2xl font-bold text-blue-400">{formatBudget(trip.budget)}</span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-slate-400">Cost per person</span>
                  <span className="text-lg font-semibold text-white">
                    {formatBudget(trip.costPerPerson || Math.round(trip.budget / (trip.groupSize || 2)))}
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'booking' && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-white mb-4">Book Your Trip</h3>
              
              <div className="grid gap-4">
                <a
                  href={trip.flightsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 hover:bg-blue-500 text-white p-6 rounded-lg flex items-center justify-between transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-3xl">✈️</div>
                    <div>
                      <div className="text-lg font-semibold">Book Flights</div>
                      <div className="text-blue-200">Find the best flight deals</div>
                    </div>
                  </div>
                  <div className="text-blue-200 group-hover:text-white transition-colors">→</div>
                </a>

                <a
                  href={trip.hotelsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-600 hover:bg-green-500 text-white p-6 rounded-lg flex items-center justify-between transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-3xl">🏨</div>
                    <div>
                      <div className="text-lg font-semibold">Book Hotels</div>
                      <div className="text-green-200">Reserve your accommodation</div>
                    </div>
                  </div>
                  <div className="text-green-200 group-hover:text-white transition-colors">→</div>
                </a>

                <a
                  href={trip.carsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-purple-600 hover:bg-purple-500 text-white p-6 rounded-lg flex items-center justify-between transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-3xl">🚗</div>
                    <div>
                      <div className="text-lg font-semibold">Rent a Car</div>
                      <div className="text-purple-200">Get around with ease</div>
                    </div>
                  </div>
                  <div className="text-purple-200 group-hover:text-white transition-colors">→</div>
                </a>
              </div>

              <div className="bg-slate-700/30 border border-slate-600/30 rounded-lg p-4">
                <h4 className="text-white font-semibold mb-2">💡 Booking Tips</h4>
                <ul className="text-slate-300 text-sm space-y-1">
                  <li>• Book flights 6-8 weeks in advance for best prices</li>
                  <li>• Consider flexible dates to save money</li>
                  <li>• Read hotel reviews and check cancellation policies</li>
                  <li>• Compare car rental prices across different providers</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
