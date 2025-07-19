import React, { useState } from "react";
import { MapPin, DollarSign, Calendar, Users, Plane, Hotel, Car, Calendar1, Eye, BookOpen } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { affiliateConfig } from "@/config/affiliateConfig";
import { ActivityMatchingService, Activity } from "@/services/ActivityMatchingService";
import FullItineraryModal from "@/components/FullItineraryModal";

interface AITripPlan {
  destination: string;
  duration: string;
  budget: {
    total: number | { min: number; max: number };
    breakdown: {
      flights: number | { min: number; max: number };
      hotels: number | { min: number; max: number };
      food: number | { min: number; max: number };
      activities: number | { min: number; max: number };
      transportation: number | { min: number; max: number };
    };
  };
  highlights: string[];
  overview: string;
  bestTimeToVisit?: string;
  groupSize?: number;
  planType?: 'Budget' | 'Standard' | 'Premium';
  isEstimated?: boolean;
}

interface AITripPlanCardProps {
  tripPlan: AITripPlan;
  isLoading?: boolean;
}

const CAMREF_CODE = affiliateConfig.expedia.camref;

export const AITripPlanCard: React.FC<AITripPlanCardProps> = ({
  tripPlan,
  isLoading = false
}) => {
  const [isItineraryOpen, setIsItineraryOpen] = useState(false);
  
  // Get real activities for this destination
  const activities = ActivityMatchingService.findActivitiesForDestination(tripPlan.destination, 6).slice(0, 3);
  const formatBudget = (amount: number | { min: number; max: number }) => {
    if (typeof amount === 'object') {
      const minFormatted = amount.min >= 1000 ? `$${(amount.min / 1000).toFixed(1)}k` : `$${amount.min.toLocaleString()}`;
      const maxFormatted = amount.max >= 1000 ? `$${(amount.max / 1000).toFixed(1)}k` : `$${amount.max.toLocaleString()}`;
      return `${minFormatted} – ${maxFormatted}`;
    }
    if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(1)}k`;
    }
    return `$${amount.toLocaleString()}`;
  };

  const getTotalBudget = () => {
    if (typeof tripPlan.budget.total === 'object') {
      return tripPlan.budget.total.max;
    }
    return tripPlan.budget.total;
  };

  const costPerPerson = getTotalBudget() / (tripPlan.groupSize || 1);

  const bookingUrls = {
    flights: `https://www.utrippin.ai/flights?CAMREF=${CAMREF_CODE}&destination=${encodeURIComponent(tripPlan.destination)}`,
    hotels: `https://www.utrippin.ai/hotels?CAMREF=${CAMREF_CODE}&destination=${encodeURIComponent(tripPlan.destination)}`,
    cars: `https://www.utrippin.ai/cars?CAMREF=${CAMREF_CODE}&destination=${encodeURIComponent(tripPlan.destination)}`,
    package: `https://www.utrippin.ai/hotels?CAMREF=${CAMREF_CODE}&destination=${encodeURIComponent(tripPlan.destination)}`
  };

  if (isLoading) {
    return (
      <div className="bg-slate-800/50 border border-slate-600/50 rounded-2xl overflow-hidden">
        <div className="relative h-48 bg-gradient-to-br from-blue-600/20 to-purple-600/20">
          <Skeleton className="w-full h-full" />
        </div>
        <div className="p-6 space-y-4">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-1/3" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Skeleton className="h-8" />
            <Skeleton className="h-8" />
          </div>
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/50 border border-slate-600/50 rounded-2xl overflow-hidden hover:border-blue-500/50 transition-all duration-300 hover:scale-[1.02] group">
      {/* Header Image */}
      <div className="relative h-48 bg-gradient-to-br from-blue-600 to-purple-600 overflow-hidden">
        <div className="w-full h-full flex items-center justify-center">
          <MapPin className="w-16 h-16 text-white/60" />
        </div>
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-xl font-bold text-white mb-1">{tripPlan.destination}</h3>
          <div className="flex items-center justify-between">
            <p className="text-white/80 text-sm">Utrippin Itinerary</p>
            {tripPlan.planType && (
              <span className="text-xs bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full text-white font-medium">
                {tripPlan.planType}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Overview */}
        <div className="mb-6">
          <p className="text-slate-300 text-sm leading-relaxed">{tripPlan.overview}</p>
        </div>

        {/* Trip Details */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-3 text-sm">
            <DollarSign className="w-4 h-4 text-green-400" />
            <span className="text-white font-semibold">{formatBudget(tripPlan.budget.total)} total</span>
            <span className="text-slate-400">({formatBudget(costPerPerson)} per person)</span>
          </div>
          
          <div className="flex items-center gap-3 text-sm">
            <Calendar className="w-4 h-4 text-blue-400" />
            <span className="text-slate-300">{tripPlan.duration}</span>
          </div>

          {tripPlan.groupSize && (
            <div className="flex items-center gap-3 text-sm">
              <Users className="w-4 h-4 text-purple-400" />
              <span className="text-slate-300">{tripPlan.groupSize} people</span>
            </div>
          )}

          {tripPlan.bestTimeToVisit && (
            <div className="flex items-center gap-3 text-sm">
              <Calendar1 className="w-4 h-4 text-orange-400" />
              <span className="text-slate-300">Best time: {tripPlan.bestTimeToVisit}</span>
            </div>
          )}
        </div>

        {/* Cost Breakdown */}
        <div className="mb-6">
          <h5 className="text-sm font-medium text-white mb-3">💰 Cost Breakdown:</h5>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>✈️ Flights:</span>
              <span>{formatBudget(tripPlan.budget.breakdown.flights)}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>🏨 Hotels:</span>
              <span>{formatBudget(tripPlan.budget.breakdown.hotels)}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>🍽️ Food:</span>
              <span>{formatBudget(tripPlan.budget.breakdown.food)}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>🎯 Activities:</span>
              <span>{formatBudget(tripPlan.budget.breakdown.activities)}</span>
            </div>
          </div>
          {tripPlan.isEstimated && (
            <p className="text-xs text-slate-500 mt-3 italic">
              *Actual prices depend on your departure city and travel dates. Click below to view real-time options.
            </p>
          )}
        </div>

        {/* Featured Activities */}
        <div className="mb-6">
          <h5 className="text-sm font-medium text-white mb-3">🎯 Featured Activities:</h5>
          {activities && activities.length > 0 ? (
            <div className="space-y-2">
              {activities.map((activity, index) => (
                <div key={index} className="bg-slate-700/30 rounded-lg p-3">
                  <div className="flex justify-between items-start mb-1">
                    <h6 className="text-xs font-medium text-white">{activity.title}</h6>
                    <span className="text-green-400 text-xs font-medium">{activity.price}</span>
                  </div>
                  <p className="text-xs text-slate-400 mb-2">{activity.description.slice(0, 80)}...</p>
                  <a
                    href={activity.bookingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 text-xs underline"
                  >
                    Book Now →
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-slate-700/20 rounded-lg p-3 text-center">
              <p className="text-xs text-slate-400 mb-2">
                No local tours found for {tripPlan.destination} at this time. Check back soon!
              </p>
              <p className="text-xs text-slate-500">
                🌟 Explore the destination highlights below for inspiration
              </p>
            </div>
          )}
        </div>

        {/* Fallback Highlights if no activities found */}
        {(!activities || activities.length === 0) && tripPlan.highlights && tripPlan.highlights.length > 0 && (
          <div className="mb-6">
            <h5 className="text-sm font-medium text-white mb-3">🌟 Highlights:</h5>
            <div className="space-y-1">
              {tripPlan.highlights.slice(0, 3).map((highlight, index) => (
                <div key={index} className="text-xs text-slate-400 flex items-start gap-2">
                  <span className="text-blue-400 mt-1">•</span>
                  <span>{highlight}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Booking Action Buttons */}
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-2">
            <a
              href={bookingUrls.flights}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1 bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-lg text-xs font-medium transition-colors min-h-[44px]"
            >
              <Plane className="w-3 h-3" />
              Flights
            </a>
            <a
              href={bookingUrls.hotels}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1 bg-green-600 hover:bg-green-500 text-white py-2.5 rounded-lg text-xs font-medium transition-colors min-h-[44px]"
            >
              <Hotel className="w-3 h-3" />
              Hotels
            </a>
            <a
              href={bookingUrls.cars}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1 bg-purple-600 hover:bg-purple-500 text-white py-2.5 rounded-lg text-xs font-medium transition-colors min-h-[44px]"
            >
              <Car className="w-3 h-3" />
              Cars
            </a>
          </div>
          
          <button
            onClick={() => setIsItineraryOpen(true)}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white py-3 rounded-lg font-medium transition-all transform hover:scale-[1.02] mb-2 min-h-[48px]"
          >
            <BookOpen className="w-4 h-4" />
            📋 Open to see full itinerary
          </button>
          
          <a
            href={bookingUrls.package}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white py-3 rounded-lg font-medium transition-all transform hover:scale-[1.02] min-h-[48px]"
          >
            <Eye className="w-4 h-4" />
            👁️ View Hotels & Packages
          </a>
        </div>

        {/* Full Itinerary Modal */}
        <FullItineraryModal
          isOpen={isItineraryOpen}
          onClose={() => setIsItineraryOpen(false)}
          destination={tripPlan.destination}
          duration={tripPlan.duration}
          planType={tripPlan.planType}
          activities={activities}
        />
      </div>
    </div>
  );
};

export default AITripPlanCard;