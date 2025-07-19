import React, { useState } from 'react';
import { Plus, MapPin, Calendar, Users, DollarSign, Plane, Car, Hotel, Camera } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TripPlannerStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  icon: React.ReactNode;
}

interface TripPlan {
  id: string;
  name: string;
  destination: string;
  startDate: string;
  endDate: string;
  budget: number;
  travelers: number;
  status: 'planning' | 'confirmed' | 'completed';
}

export const AdvancedTripPlanner = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [tripPlans, setTripPlans] = useState<TripPlan[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  const planningSteps: TripPlannerStep[] = [
    {
      id: 'destination',
      title: 'Choose Destination',
      description: 'Select where you want to go',
      completed: false,
      icon: <MapPin className="w-5 h-5" />
    },
    {
      id: 'dates',
      title: 'Select Dates',
      description: 'Pick your travel dates',
      completed: false,
      icon: <Calendar className="w-5 h-5" />
    },
    {
      id: 'travelers',
      title: 'Add Travelers',
      description: 'How many people are going?',
      completed: false,
      icon: <Users className="w-5 h-5" />
    },
    {
      id: 'budget',
      title: 'Set Budget',
      description: 'Define your spending limit',
      completed: false,
      icon: <DollarSign className="w-5 h-5" />
    },
    {
      id: 'bookings',
      title: 'Book Services',
      description: 'Reserve flights, hotels, and activities',
      completed: false,
      icon: <Plane className="w-5 h-5" />
    }
  ];

  const [newTrip, setNewTrip] = useState({
    name: '',
    destination: '',
    startDate: '',
    endDate: '',
    budget: 0,
    travelers: 1
  });

  const handleCreateTrip = () => {
    if (!newTrip.name || !newTrip.destination) {
      toast({
        title: "Missing Information",
        description: "Please fill in trip name and destination.",
        variant: "destructive"
      });
      return;
    }

    const trip: TripPlan = {
      id: Date.now().toString(),
      ...newTrip,
      status: 'planning'
    };

    setTripPlans([...tripPlans, trip]);
    setNewTrip({
      name: '',
      destination: '',
      startDate: '',
      endDate: '',
      budget: 0,
      travelers: 1
    });
    setIsCreating(false);
    setCurrentStep(0);

    toast({
      title: "Trip Created!",
      description: `${newTrip.name} has been added to your trip planner.`,
    });
  };

  const tripCategories = [
    { name: 'Flights', icon: <Plane className="w-5 h-5" />, color: 'bg-blue-500' },
    { name: 'Hotels', icon: <Hotel className="w-5 h-5" />, color: 'bg-green-500' },
    { name: 'Cars', icon: <Car className="w-5 h-5" />, color: 'bg-purple-500' },
    { name: 'Activities', icon: <Camera className="w-5 h-5" />, color: 'bg-orange-500' }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Trip Planner</h2>
          <p className="text-slate-400">Plan and organize your perfect trip</p>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          New Trip
        </button>
      </div>

      {/* Create Trip Modal */}
      {isCreating && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-3xl p-8 max-w-2xl w-full border border-blue-500/20">
            <h3 className="text-2xl font-bold text-white mb-6">Create New Trip</h3>
            
            {/* Progress Steps */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                {planningSteps.map((step, index) => (
                  <div key={step.id} className="flex items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      index <= currentStep 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-slate-700 text-slate-400'
                    }`}>
                      {step.icon}
                    </div>
                    {index < planningSteps.length - 1 && (
                      <div className={`w-12 h-1 ${
                        index < currentStep ? 'bg-blue-600' : 'bg-slate-700'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
              <p className="text-slate-300 text-center">
                Step {currentStep + 1} of {planningSteps.length}: {planningSteps[currentStep]?.title}
              </p>
            </div>

            {/* Step Content */}
            <div className="space-y-6">
              {currentStep === 0 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-white font-medium mb-2">Trip Name</label>
                    <input
                      type="text"
                      value={newTrip.name}
                      onChange={(e) => setNewTrip({...newTrip, name: e.target.value})}
                      className="w-full bg-slate-800 border border-slate-600 rounded-xl px-4 py-3 text-white"
                      placeholder="e.g., Summer Europe Adventure"
                    />
                  </div>
                  <div>
                    <label className="block text-white font-medium mb-2">Destination</label>
                    <input
                      type="text"
                      value={newTrip.destination}
                      onChange={(e) => setNewTrip({...newTrip, destination: e.target.value})}
                      className="w-full bg-slate-800 border border-slate-600 rounded-xl px-4 py-3 text-white"
                      placeholder="e.g., Paris, France"
                    />
                  </div>
                </div>
              )}

              {currentStep === 1 && (
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white font-medium mb-2">Start Date</label>
                    <input
                      type="date"
                      value={newTrip.startDate}
                      onChange={(e) => setNewTrip({...newTrip, startDate: e.target.value})}
                      className="w-full bg-slate-800 border border-slate-600 rounded-xl px-4 py-3 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-white font-medium mb-2">End Date</label>
                    <input
                      type="date"
                      value={newTrip.endDate}
                      onChange={(e) => setNewTrip({...newTrip, endDate: e.target.value})}
                      className="w-full bg-slate-800 border border-slate-600 rounded-xl px-4 py-3 text-white"
                    />
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div>
                  <label className="block text-white font-medium mb-2">Number of Travelers</label>
                  <select
                    value={newTrip.travelers}
                    onChange={(e) => setNewTrip({...newTrip, travelers: parseInt(e.target.value)})}
                    className="w-full bg-slate-800 border border-slate-600 rounded-xl px-4 py-3 text-white"
                  >
                    {[1,2,3,4,5,6,7,8].map(num => (
                      <option key={num} value={num}>{num} {num === 1 ? 'Person' : 'People'}</option>
                    ))}
                  </select>
                </div>
              )}

              {currentStep === 3 && (
                <div>
                  <label className="block text-white font-medium mb-2">Budget (USD)</label>
                  <input
                    type="number"
                    value={newTrip.budget}
                    onChange={(e) => setNewTrip({...newTrip, budget: parseInt(e.target.value)})}
                    className="w-full bg-slate-800 border border-slate-600 rounded-xl px-4 py-3 text-white"
                    placeholder="e.g., 3000"
                  />
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-4">
                  <p className="text-white">Ready to book your trip essentials?</p>
                  <div className="grid grid-cols-2 gap-4">
                    {tripCategories.map((category) => (
                      <button
                        key={category.name}
                        className={`${category.color} hover:opacity-80 text-white p-4 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2`}
                      >
                        {category.icon}
                        Book {category.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="flex justify-between mt-8">
              <button
                onClick={() => setIsCreating(false)}
                className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-xl font-medium transition-colors"
              >
                Cancel
              </button>
              <div className="flex gap-3">
                {currentStep > 0 && (
                  <button
                    onClick={() => setCurrentStep(currentStep - 1)}
                    className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-xl font-medium transition-colors"
                  >
                    Previous
                  </button>
                )}
                {currentStep < planningSteps.length - 1 ? (
                  <button
                    onClick={() => setCurrentStep(currentStep + 1)}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-medium transition-colors"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    onClick={handleCreateTrip}
                    className="bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-xl font-medium transition-colors"
                  >
                    Create Trip
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Trip Plans Grid */}
      {tripPlans.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tripPlans.map((trip) => (
            <div key={trip.id} className="bg-slate-800/50 border border-blue-500/20 rounded-2xl p-6 hover:bg-slate-800/70 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">{trip.name}</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  trip.status === 'planning' ? 'bg-yellow-500/20 text-yellow-400' :
                  trip.status === 'confirmed' ? 'bg-green-500/20 text-green-400' :
                  'bg-blue-500/20 text-blue-400'
                }`}>
                  {trip.status}
                </span>
              </div>
              
              <div className="space-y-2 text-slate-300 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {trip.destination}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {trip.startDate} - {trip.endDate}
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  {trip.travelers} {trip.travelers === 1 ? 'traveler' : 'travelers'}
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  ${trip.budget.toLocaleString()} budget
                </div>
              </div>

              <button className="w-full mt-4 bg-blue-600 hover:bg-blue-500 text-white py-2 px-4 rounded-xl font-medium transition-colors">
                Continue Planning
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">✈️</div>
          <h3 className="text-2xl font-bold text-white mb-2">No trips planned yet</h3>
          <p className="text-slate-400 mb-6">Start planning your next adventure!</p>
          <button
            onClick={() => setIsCreating(true)}
            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-medium transition-colors"
          >
            Create Your First Trip
          </button>
        </div>
      )}
    </div>
  );
};