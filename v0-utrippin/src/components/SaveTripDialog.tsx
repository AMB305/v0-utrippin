import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

interface SaveTripDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tripData: any;
  destination?: string;
}

export const SaveTripDialog: React.FC<SaveTripDialogProps> = ({
  open,
  onOpenChange,
  tripData,
  destination
}) => {
  const [tripName, setTripName] = useState('');
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSaveTrip = async () => {
    if (!tripName.trim()) {
      toast({
        title: "Trip name required",
        description: "Please enter a name for your trip",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to save your trip",
          variant: "destructive",
        });
        return;
      }

      // Extract summary from trip data
      const summary = tripData?.response || "AI-generated travel itinerary";
      
      const { data, error } = await supabase
        .from('saved_trips')
        .insert({
          user_id: user.id,
          trip_name: tripName.trim(),
          destination: destination || 'Unknown Destination',
          trip_data: tripData,
          summary: summary
        })
        .select()
        .single();

      if (error) {
        console.error('Error saving trip:', error);
        toast({
          title: "Failed to save trip",
          description: "There was an error saving your trip. Please try again.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Trip saved!",
        description: `"${tripName}" has been saved to your trip board.`,
      });

      onOpenChange(false);
      setTripName('');
      
      // Navigate to the new trip board
      navigate(`/trip-board/${data.id}`);
      
    } catch (error) {
      console.error('Error saving trip:', error);
      toast({
        title: "Failed to save trip",
        description: "There was an unexpected error. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-black border-gray-800 text-white max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="text-white text-center">Save Your Trip</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <p className="text-gray-300 text-sm mb-3">
              What should we name this trip? This will create a trip board with all of Keila's suggestions.
            </p>
            <Input
              value={tripName}
              onChange={(e) => setTripName(e.target.value)}
              placeholder="e.g., St. Thomas Getaway"
              className="bg-gray-900 border-gray-700 text-white placeholder-gray-500"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSaveTrip();
                }
              }}
            />
          </div>
          <div className="flex gap-3">
            <Button 
              onClick={() => onOpenChange(false)}
              variant="outline"
              className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSaveTrip}
              disabled={saving || !tripName.trim()}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              {saving ? "Saving..." : "Save Trip"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
