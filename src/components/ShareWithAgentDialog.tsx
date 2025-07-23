import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Send, User, Mail, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ShareWithAgentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tripId: string;
  tripName: string;
  destination: string;
}

export const ShareWithAgentDialog: React.FC<ShareWithAgentDialogProps> = ({
  open,
  onOpenChange,
  tripId,
  tripName,
  destination
}) => {
  const [agentEmail, setAgentEmail] = useState('');
  const [personalMessage, setPersonalMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleShare = async () => {
    if (!agentEmail.trim()) {
      toast({
        title: "Email Required",
        description: "Please enter the travel agent's email address",
        variant: "destructive",
      });
      return;
    }

    if (!validateEmail(agentEmail)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('share-trip-with-agent', {
        body: {
          trip_id: tripId,
          agent_email: agentEmail.trim(),
          user_note: personalMessage.trim() || null
        }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(error.message || 'Failed to share trip');
      }

      if (!data?.success) {
        throw new Error(data?.error || 'Unknown error occurred');
      }

      toast({
        title: "Trip Shared Successfully!",
        description: `Your trip has been sent to ${agentEmail}. You'll receive a confirmation copy.`,
      });

      // Reset form and close dialog
      setAgentEmail('');
      setPersonalMessage('');
      onOpenChange(false);
      
      // Refresh the page to show updated sharing status
      window.location.reload();
      
    } catch (error: any) {
      console.error('Error sharing trip:', error);
      toast({
        title: "Sharing Failed",
        description: error.message || "Failed to share trip with agent. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-black border-gray-800 text-white max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="text-white text-center flex items-center gap-2">
            <User className="w-5 h-5 text-orange-400" />
            Share with Travel Agent
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="font-semibold text-lg mb-2">{tripName}</h3>
            <p className="text-gray-400 text-sm">
              Send your complete itinerary to a travel agent for professional booking assistance
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="agent-email" className="text-gray-300 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Travel Agent's Email
              </Label>
              <Input
                id="agent-email"
                type="email"
                placeholder="agent@travelagency.com"
                value={agentEmail}
                onChange={(e) => setAgentEmail(e.target.value)}
                className="bg-gray-900 border-gray-700 text-white focus:border-orange-500"
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="personal-message" className="text-gray-300 flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Personal Message (Optional)
              </Label>
              <Textarea
                id="personal-message"
                placeholder="Hi! I'd like to book this trip. Please help me with the arrangements..."
                value={personalMessage}
                onChange={(e) => setPersonalMessage(e.target.value)}
                className="bg-gray-900 border-gray-700 text-white focus:border-orange-500 min-h-[80px] resize-none"
                disabled={loading}
                maxLength={500}
              />
              <p className="text-xs text-gray-500">
                {personalMessage.length}/500 characters
              </p>
            </div>
          </div>

          <div className="bg-gray-900 p-4 rounded-lg border border-gray-800">
            <h4 className="text-sm font-medium text-orange-400 mb-2">What will be shared:</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Complete trip itinerary and recommendations</li>
              <li>• Your contact information for follow-up</li>
              <li>• Public link to view full trip details</li>
              <li>• Your personal message to the agent</li>
            </ul>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={handleShare}
              disabled={loading}
              className="flex-1 bg-orange-600 hover:bg-orange-700 text-white"
            >
              {loading ? (
                "Sending..."
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send to Agent
                </>
              )}
            </Button>
            
            <Button
              onClick={() => onOpenChange(false)}
              variant="outline"
              disabled={loading}
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};