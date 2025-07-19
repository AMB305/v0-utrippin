import React from "react";
import { MapPin, DollarSign, Calendar, Users, Plane, Hotel, Eye } from "lucide-react";

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
  costBreakdown?: {
    flights: number;
    hotels: number;
    food: number;
    activities: number;
    transportation: number;
  };
}

interface TripPackageCardProps {
  tripPackage: TripPackage;
  onViewDetails: (trip: TripPackage) => void;
}

export const TripPackageCard: React.FC<TripPackageCardProps> = ({
  tripPackage,
  onViewDetails
}) => {
  const formatBudget = (amount: number) => {
    if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(1)}k`;
    }
    return `$${amount.toLocaleString()}`;
  };

  const costPerPerson = tripPackage.costPerPerson || (tripPackage.budget / (tripPackage.groupSize || 1));

  return (
    <div className="bg-slate-800/50 border border-slate-600/50 rounded-2xl overflow-hidden hover:border-blue-500/50 transition-all duration-300 hover:scale-[1.02] group">
      {/* Image */}
      <div className="relative h-48 bg-gradient-to-br from-blue-600 to-purple-600 overflow-hidden">
        {tripPackage.imageUrl ? (
          <img
            src={tripPackage.imageUrl}
            alt={tripPackage.destination}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <MapPin className="w-16 h-16 text-white/60" />
          </div>
        )}
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-xl font-bold text-white mb-1">{tripPackage.destination}</h3>
          <p className="text-white/80 text-sm">{tripPackage.type}</p>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h4 className="text-lg font-semibold text-white mb-2">{tripPackage.name}</h4>
        <p className="text-slate-300 text-sm mb-4 line-clamp-2">{tripPackage.summary}</p>

        {/* Trip Details */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-3 text-sm">
            <DollarSign className="w-4 h-4 text-green-400" />
            <span className="text-white font-semibold">{formatBudget(tripPackage.budget)} total</span>
            <span className="text-slate-400">({formatBudget(costPerPerson)} per person)</span>
          </div>
          
          <div className="flex items-center gap-3 text-sm">
            <Calendar className="w-4 h-4 text-blue-400" />
            <span className="text-slate-300">{tripPackage.duration}</span>
          </div>

          {tripPackage.groupSize && (
            <div className="flex items-center gap-3 text-sm">
              <Users className="w-4 h-4 text-purple-400" />
              <span className="text-slate-300">{tripPackage.groupSize} people</span>
            </div>
          )}
        </div>

        {/* Cost Breakdown Preview */}
        {tripPackage.costBreakdown && (
          <div className="mb-6">
            <h5 className="text-sm font-medium text-white mb-2">Cost Breakdown:</h5>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>✈️ Flights:</span>
                <span>{formatBudget(tripPackage.costBreakdown.flights)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>🏨 Hotels:</span>
                <span>{formatBudget(tripPackage.costBreakdown.hotels)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>🍽️ Food:</span>
                <span>{formatBudget(tripPackage.costBreakdown.food)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>🎯 Activities:</span>
                <span>{formatBudget(tripPackage.costBreakdown.activities)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Quick Preview */}
        {tripPackage.highlights && tripPackage.highlights.length > 0 && (
          <div className="mb-6">
            <h5 className="text-sm font-medium text-white mb-2">Highlights:</h5>
            <div className="space-y-1">
              {tripPackage.highlights.slice(0, 2).map((highlight, index) => (
                <div key={index} className="text-xs text-slate-400 flex items-start gap-2">
                  <span className="text-blue-400 mt-1">•</span>
                  <span>{highlight}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => onViewDetails(tripPackage)}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white py-3 rounded-lg font-medium transition-all transform hover:scale-[1.02]"
          >
            <Eye className="w-4 h-4" />
            View Full Itinerary
          </button>
          
          <div className="grid grid-cols-2 gap-2">
            <a
              href={tripPackage.flightsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg text-sm font-medium transition-colors"
            >
              <Plane className="w-4 h-4" />
              Flights
            </a>
            <a
              href={tripPackage.hotelsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg text-sm font-medium transition-colors"
            >
              <Hotel className="w-4 h-4" />
              Hotels
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};