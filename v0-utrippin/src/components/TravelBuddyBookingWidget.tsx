import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, Plane, Hotel, Car, UserPlus, Bell } from "lucide-react";
import { BudgetSlider } from "@/components/BudgetSlider";
import { buildFlightUrl, buildHotelUrl, buildCarUrl } from "@/utils/buildAffiliateUrl";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface TravelBuddyBookingWidgetProps {
  destination?: string;
  eventId?: string;
  onLookingForBuddies?: (isLooking: boolean) => void;
}

export const TravelBuddyBookingWidget: React.FC<TravelBuddyBookingWidgetProps> = ({
  destination = "",
  eventId,
  onLookingForBuddies
}) => {
  const { user } = useAuth();
  const [budget, setBudget] = useState(2000);
  const [travelers, setTravelers] = useState(2);
  const [lookingForBuddies, setLookingForBuddies] = useState(false);
  const [tripDetails, setTripDetails] = useState({
    destination: destination,
    startDate: "",
    endDate: "",
    tripType: "vacation"
  });

  const handleCreateTripAlert = async () => {
    if (!user) {
      toast.error("Please sign in to create trip alerts");
      return;
    }

    try {
      const response = await supabase.functions.invoke('travel-buddy-integration', {
        body: {
          action: 'create_trip_alert',
          data: {
            userId: user.id,
            tripData: {
              destination: tripDetails.destination,
              start_date: tripDetails.startDate,
              end_date: tripDetails.endDate,
              budget,
              trip_type: tripDetails.tripType,
              title: `Trip to ${tripDetails.destination}`,
              duration_days: tripDetails.startDate && tripDetails.endDate 
                ? Math.ceil((new Date(tripDetails.endDate).getTime() - new Date(tripDetails.startDate).getTime()) / (1000 * 60 * 60 * 24))
                : null
            },
            lookingForBuddies
          }
        }
      });

      if (response.error) throw response.error;

      const { potential_matches } = response.data;
      
      if (lookingForBuddies && potential_matches > 0) {
        toast.success(`🎉 Trip created! ${potential_matches} potential travel buddies were notified!`);
      } else {
        toast.success("✅ Trip saved to your profile!");
      }

      onLookingForBuddies?.(lookingForBuddies);
    } catch (error) {
      console.error('Error creating trip alert:', error);
      toast.error("Failed to create trip alert");
    }
  };

  const handleJoinEvent = async () => {
    if (!user || !eventId) return;

    try {
      const response = await supabase.functions.invoke('travel-buddy-integration', {
        body: {
          action: 'join_event',
          data: {
            userId: user.id,
            eventId,
            lookingForBuddies
          }
        }
      });

      if (response.error) throw response.error;

      if (lookingForBuddies) {
        toast.success("🎉 Joined event and looking for travel buddies!");
      } else {
        toast.success("✅ Successfully joined the event!");
      }
    } catch (error) {
      console.error('Error joining event:', error);
      toast.error("Failed to join event");
    }
  };

  return (
    <Card className="bg-utrippin-muted border-utrippin-orange/20">
      <CardHeader>
        <CardTitle className="text-utrippin-orange flex items-center gap-2">
          <Plane className="w-5 h-5" />
          {eventId ? "Book Trip to Event" : "Plan Your Adventure"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Destination and Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-utrippin-orange mb-2 block flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              Destination
            </label>
            <Input
              value={tripDetails.destination}
              onChange={(e) => setTripDetails(prev => ({ ...prev, destination: e.target.value }))}
              placeholder="Where to?"
              className="bg-utrippin-navy border-utrippin-orange/30 text-white"
            />
          </div>
          <div>
            <label className="text-sm text-utrippin-orange mb-2 block">Trip Type</label>
            <Select 
              value={tripDetails.tripType} 
              onValueChange={(value) => setTripDetails(prev => ({ ...prev, tripType: value }))}
            >
              <SelectTrigger className="bg-utrippin-navy border-utrippin-orange/30">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-utrippin-muted border-utrippin-orange/30">
                <SelectItem value="vacation">🏖️ Vacation</SelectItem>
                <SelectItem value="business">💼 Business</SelectItem>
                <SelectItem value="adventure">🏔️ Adventure</SelectItem>
                <SelectItem value="festival">🎵 Festival/Event</SelectItem>
                <SelectItem value="wedding">💒 Wedding</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Travel Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-utrippin-orange mb-2 block flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              Start Date
            </label>
            <Input
              type="date"
              value={tripDetails.startDate}
              onChange={(e) => setTripDetails(prev => ({ ...prev, startDate: e.target.value }))}
              className="bg-utrippin-navy border-utrippin-orange/30 text-white"
            />
          </div>
          <div>
            <label className="text-sm text-utrippin-orange mb-2 block">End Date</label>
            <Input
              type="date"
              value={tripDetails.endDate}
              onChange={(e) => setTripDetails(prev => ({ ...prev, endDate: e.target.value }))}
              className="bg-utrippin-navy border-utrippin-orange/30 text-white"
            />
          </div>
        </div>

        {/* Budget Slider */}
        <div>
          <BudgetSlider
            budget={budget}
            onBudgetChange={setBudget}
            min={100}
            max={20000}
          />
        </div>

        {/* Travelers */}
        <div>
          <label className="text-sm text-utrippin-orange mb-2 block flex items-center gap-2">
            <Users className="w-4 h-4 flex-shrink-0" />
            <span>Number of Travelers</span>
          </label>
          <Select value={travelers.toString()} onValueChange={(value) => setTravelers(Number(value))}>
            <SelectTrigger className="bg-utrippin-navy border-utrippin-orange/30">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-utrippin-muted border-utrippin-orange/30">
              {[1,2,3,4,5,6,7,8].map(n => (
                <SelectItem key={n} value={n.toString()}>{n} {n === 1 ? 'traveler' : 'travelers'}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Looking for Travel Buddies Toggle */}
        <div className="flex items-center justify-between p-4 bg-utrippin-navy rounded-lg border border-utrippin-blue/30">
          <div className="flex items-center gap-3">
            <UserPlus className="w-5 h-5 text-utrippin-blue" />
            <div>
              <p className="text-white font-medium">Looking for Travel Buddies?</p>
              <p className="text-sm text-gray-400">Get matched with like-minded travelers</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={lookingForBuddies}
              onChange={(e) => setLookingForBuddies(e.target.checked)}
              className="w-5 h-5 text-utrippin-orange bg-utrippin-navy border-utrippin-orange/30 rounded focus:ring-utrippin-orange"
            />
          </div>
        </div>

        {lookingForBuddies && (
          <div className="p-3 bg-utrippin-blue/10 rounded-lg border border-utrippin-blue/30">
            <div className="flex items-center gap-2 text-utrippin-blue text-sm">
              <Bell className="w-4 h-4" />
              <span>You'll get notified when potential travel buddies are found!</span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          {eventId && (
            <Button
              onClick={handleJoinEvent}
              className="w-full bg-utrippin-blue hover:bg-utrippin-blue/90 text-white"
              disabled={!user}
            >
              {lookingForBuddies ? "Join Event & Find Buddies" : "Join Event"}
            </Button>
          )}
          
          <Button
            onClick={handleCreateTripAlert}
            className="w-full bg-utrippin-orange hover:bg-utrippin-orange/90 text-utrippin-navy font-semibold"
            disabled={!user || !tripDetails.destination}
          >
            {lookingForBuddies ? "🚨 Create Trip Alert & Find Buddies" : "📝 Save Trip to Profile"}
          </Button>

          {/* Booking Links */}
          {tripDetails.destination && (
            <div className="grid grid-cols-3 gap-2 pt-4 border-t border-utrippin-orange/20">
              <a
                href={buildFlightUrl({
                  origin: "Your City",
                  destination: tripDetails.destination,
                  departDate: tripDetails.startDate,
                  returnDate: tripDetails.endDate,
                  adults: travelers
                })}
                target="_blank"
                rel="noopener noreferrer"
                className="text-center"
              >
                <Button size="sm" variant="outline" className="w-full border-utrippin-blue text-utrippin-blue hover:bg-utrippin-blue hover:text-white">
                  <Plane className="w-4 h-4 mr-1" />
                  Flights
                </Button>
              </a>
              <a
                href={buildHotelUrl({
                  destination: tripDetails.destination,
                  startDate: tripDetails.startDate,
                  endDate: tripDetails.endDate,
                  adults: travelers
                })}
                target="_blank"
                rel="noopener noreferrer"
                className="text-center"
              >
                <Button size="sm" variant="outline" className="w-full border-utrippin-blue text-utrippin-blue hover:bg-utrippin-blue hover:text-white">
                  <Hotel className="w-4 h-4 mr-1" />
                  Hotels
                </Button>
              </a>
              <a
                href={buildCarUrl({
                  location: tripDetails.destination,
                  pickupDate: tripDetails.startDate,
                  dropoffDate: tripDetails.endDate
                })}
                target="_blank"
                rel="noopener noreferrer"
                className="text-center"
              >
                <Button size="sm" variant="outline" className="w-full border-utrippin-blue text-utrippin-blue hover:bg-utrippin-blue hover:text-white">
                  <Car className="w-4 h-4 mr-1" />
                  Cars
                </Button>
              </a>
            </div>
          )}
        </div>

        {!user && (
          <div className="text-center p-3 bg-utrippin-navy/50 rounded border border-utrippin-orange/30">
            <p className="text-sm text-gray-300">
              <a href="/auth" className="text-utrippin-orange hover:underline">Sign in</a> to save trips and find travel buddies
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
