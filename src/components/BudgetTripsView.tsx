import React, { useState } from "react";
import { Plane, Home, MapPin, Loader2 } from "lucide-react";
import { BudgetSlider } from "./BudgetSlider";
import { GroupSelector } from "./GroupSelector";
import { TripPackageCard } from "./TripPackageCard";
import { EnhancedItineraryModal } from "./EnhancedItineraryModal";
import { useBudgetTripPlanner } from "@/hooks/useBudgetTripPlanner";
import { useDebounce } from "@/hooks/useDebounce";

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

export const BudgetTripsView: React.FC = () => {
  const [budget, setBudget] = useState(100);
  const [groupSize, setGroupSize] = useState(1);
  const [tripType, setTripType] = useState<'staycation' | 'vacation'>('staycation');
  const [zipCode, setZipCode] = useState('');
  const [selectedTrip, setSelectedTrip] = useState<TripPackage | null>(null);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [comparisonTrips, setComparisonTrips] = useState<TripPackage[]>([]);
  const [savedTrips, setSavedTrips] = useState<TripPackage[]>([]);

  const { generateBudgetTrips, loading, error, trips, loadingStage } = useBudgetTripPlanner();
  const debouncedBudget = useDebounce(budget, 500);

  // Smart trip type selection based on budget
  const isVacationEnabled = budget >= 200;
  
  // Auto-select staycation for budgets under $200
  React.useEffect(() => {
    if (budget < 200 && tripType === 'vacation') {
      setTripType('staycation');
    }
  }, [budget, tripType]);

  const handleGenerateTrips = async () => {
    setHasGenerated(true);
    await generateBudgetTrips(budget, groupSize, tripType, tripType === 'staycation' ? zipCode : undefined);
  };

  const handleTripTypeChange = (type: 'staycation' | 'vacation') => {
    setTripType(type);
    if (hasGenerated) {
      // Auto-regenerate when trip type changes
      setTimeout(() => {
        generateBudgetTrips(budget, groupSize, type, type === 'staycation' ? zipCode : undefined);
      }, 100);
    }
  };

  const handleCompareTrip = (trip: TripPackage) => {
    if (comparisonTrips.find(t => t.destination === trip.destination)) {
      setComparisonTrips(comparisonTrips.filter(t => t.destination !== trip.destination));
    } else if (comparisonTrips.length < 3) {
      setComparisonTrips([...comparisonTrips, trip]);
    }
  };

  const handleSaveTrip = (trip: TripPackage) => {
    if (savedTrips.find(t => t.destination === trip.destination)) {
      setSavedTrips(savedTrips.filter(t => t.destination !== trip.destination));
    } else {
      setSavedTrips([...savedTrips, trip]);
    }
  };

  // Convert trip package to destination format for compatibility
  const convertToDestination = (trip: TripPackage) => ({
    name: trip.destination,
    summary: trip.summary,
    description: trip.summary,
    image: trip.imageUrl || '',
    tags: [trip.type],
    cuisine: [],
    highlights: trip.highlights || [],
    tips: []
  });

  return (
    <div className="space-y-8">
      {/* Budget Controls */}
      <div className="bg-slate-800/30 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-6">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-white mb-2">Plan Your Perfect Staycation or Vacation</h2>
          <p className="text-slate-400">Set your budget and group size to discover amazing destinations</p>
        </div>

        {/* Trip Type Buttons */}
        <div className="flex gap-4 justify-center mb-8">
          <button
            onClick={() => handleTripTypeChange('staycation')}
            className={`flex items-center justify-center rounded-xl border px-6 py-3 text-sm font-semibold transition-colors duration-200 gap-3 ${
              tripType === 'staycation'
                ? 'bg-blue-600 text-white font-semibold shadow-lg'
                : 'text-gray-800 bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-50 hover:to-blue-100'
            }`}
          >
            <Home className="w-5 h-5" />
            Staycation
          </button>
          <button
            onClick={() => handleTripTypeChange('vacation')}
            disabled={!isVacationEnabled}
            className={`flex items-center justify-center rounded-xl border px-6 py-3 text-sm font-semibold transition-colors duration-200 gap-3 relative ${
              tripType === 'vacation'
                ? 'bg-blue-600 text-white font-semibold shadow-lg'
                : isVacationEnabled
                ? 'text-gray-800 bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-50 hover:to-blue-100'
                : 'bg-slate-800/50 text-slate-500 cursor-not-allowed hover:bg-slate-800/50'
            }`}
            title={!isVacationEnabled ? 'Increase budget to $200+ to unlock vacation mode' : ''}
          >
            <Plane className="w-5 h-5" />
            Vacation
            {!isVacationEnabled && (
              <span className="absolute -top-1 -right-1 bg-amber-500 text-xs px-1 py-0.5 rounded-full text-black font-bold">
                $200+
              </span>
            )}
          </button>
        </div>

        {/* Budget and Group Controls */}
        <div className="grid md:grid-cols-2 gap-8 items-end">
          <div>
            <BudgetSlider
              budget={budget}
              onBudgetChange={setBudget}
              isDebouncing={budget !== debouncedBudget}
            />
          </div>
          
          <div className="flex flex-col items-center gap-4">
            <GroupSelector
              groupSize={groupSize}
              onGroupSizeChange={setGroupSize}
            />

            {tripType === 'staycation' && (
              <div className="w-full">
                <input
                  type="text"
                  placeholder="Enter Zip Code (for staycations)"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            )}
          </div>
        </div>

        {/* Generate Button */}
        <div className="text-center mt-8">
          <button
            onClick={handleGenerateTrips}
            disabled={loading}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:opacity-50 text-white px-8 py-4 rounded-xl font-medium transition-all transform hover:scale-105 disabled:hover:scale-100"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                {loadingStage || 'Generating Trips...'}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                {hasGenerated ? 'Update' : 'Find'} My Trips
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 text-center">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {/* Results */}
      {trips.length > 0 && (
        <div>
        {/* Comparison Bar */}
        {comparisonTrips.length > 0 && (
          <div className="bg-blue-600/20 border border-blue-500/30 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-white font-medium">
                  Comparing {comparisonTrips.length} trip{comparisonTrips.length > 1 ? 's' : ''}
                </span>
                <button
                  onClick={() => setComparisonTrips([])}
                  className="text-blue-400 hover:text-blue-300 text-sm underline"
                >
                  Clear all
                </button>
              </div>
              <div className="flex gap-2">
                {comparisonTrips.map((trip, index) => (
                  <div key={index} className="bg-blue-600/30 px-3 py-1 rounded-full text-sm text-white">
                    {trip.destination}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="mb-6">
          <h3 className="text-2xl font-bold text-white mb-2">
            {trips.length} Trip Packages for ${budget.toLocaleString()}
          </h3>
          <p className="text-slate-400">
            Perfect {tripType}s for {groupSize} {groupSize === 1 ? 'person' : 'people'} 
            • ${Math.round(budget / groupSize).toLocaleString()} per person
          </p>
        </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map((trip, index) => (
              <div
                key={index}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <TripPackageCard
                  tripPackage={trip}
                  onViewDetails={setSelectedTrip}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Results */}
      {hasGenerated && !loading && trips.length === 0 && (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">✈️</div>
          <h3 className="text-2xl font-bold mb-2 text-white">No trips found</h3>
          <p className="text-slate-400 mb-6">Try adjusting your budget or group size</p>
          <button
            onClick={handleGenerateTrips}
            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-medium transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Enhanced Itinerary Modal */}
      {selectedTrip && (
        <EnhancedItineraryModal
          trip={selectedTrip}
          onClose={() => setSelectedTrip(null)}
          onCompare={handleCompareTrip}
          onSave={handleSaveTrip}
        />
      )}
    </div>
  );
};
