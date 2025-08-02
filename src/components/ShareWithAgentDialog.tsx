import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Send, User, Mail, MessageSquare, Plus, X, Users } from 'lucide-react';
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
  const [agentEmails, setAgentEmails] = useState<string[]>(['']);
  const [currentEmail, setCurrentEmail] = useState('');
  const [personalMessage, setPersonalMessage] = useState('');
  const [templateType, setTemplateType] = useState('standard');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const addAgentEmail = () => {
    if (currentEmail.trim() && validateEmail(currentEmail.trim())) {
      if (!agentEmails.includes(currentEmail.trim())) {
        setAgentEmails([...agentEmails.filter(email => email !== ''), currentEmail.trim()]);
        setCurrentEmail('');
      } else {
        toast({
          title: "Email Already Added",
          description: "This email is already in the list",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
    }
  };

  const removeAgentEmail = (emailToRemove: string) => {
    setAgentEmails(agentEmails.filter(email => email !== emailToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addAgentEmail();
    }
  };

  const handleShare = async () => {
    const validEmails = agentEmails.filter(email => email.trim() && validateEmail(email.trim()));
    
    if (validEmails.length === 0) {
      toast({
        title: "No Valid Emails",
        description: "Please add at least one valid travel agent email address",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('share-trip-with-agent', {
        body: {
          trip_id: tripId,
          agent_emails: validEmails,
          user_note: personalMessage.trim() || null,
          template_type: templateType
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
        description: `Your trip has been sent to ${validEmails.length} travel agent${validEmails.length > 1 ? 's' : ''}. You'll receive confirmation copies.`,
      });

      // Reset form and close dialog
      setAgentEmails(['']);
      setCurrentEmail('');
      setPersonalMessage('');
      setTemplateType('standard');
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
              Send your complete itinerary to multiple travel agents for professional booking assistance
            </p>
          </div>

          <div className="space-y-4">
            {/* Template Type Selection */}
            <div className="space-y-2">
              <Label htmlFor="template-type" className="text-gray-300 flex items-center gap-2">
                <User className="w-4 h-4" />
                Email Template Type
              </Label>
              <Select value={templateType} onValueChange={setTemplateType}>
                <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                  <SelectValue placeholder="Select template type" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700">
                  <SelectItem value="standard">Standard Professional</SelectItem>
                  <SelectItem value="luxury">Luxury Travel Specialist</SelectItem>
                  <SelectItem value="budget">Budget Travel Expert</SelectItem>
                  <SelectItem value="corporate">Corporate Travel Manager</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Agent Emails Management */}
            <div className="space-y-2">
              <Label htmlFor="agent-emails" className="text-gray-300 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Travel Agent Emails ({agentEmails.filter(email => email.trim()).length} added)
              </Label>
              
              {/* Display Added Emails */}
              {agentEmails.filter(email => email.trim()).length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {agentEmails.filter(email => email.trim()).map((email, index) => (
                    <Badge key={index} variant="secondary" className="bg-orange-900/20 text-orange-300 border-orange-700">
                      {email}
                      <button
                        onClick={() => removeAgentEmail(email)}
                        className="ml-2 hover:text-orange-100"
                        disabled={loading}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}

              {/* Add New Email */}
              <div className="flex gap-2">
                <Input
                  id="agent-emails"
                  type="email"
                  placeholder="agent@travelagency.com"
                  value={currentEmail}
                  onChange={(e) => setCurrentEmail(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="bg-gray-900 border-gray-700 text-white focus:border-orange-500 flex-1"
                  disabled={loading}
                />
                <Button
                  onClick={addAgentEmail}
                  disabled={loading || !currentEmail.trim()}
                  variant="outline"
                  size="sm"
                  className="border-orange-600 text-orange-400 hover:bg-orange-600 hover:text-white"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-gray-500">
                Press Enter or click + to add multiple agent emails
              </p>
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
              <li>• Your personal message to the agent(s)</li>
              <li>• Tracking data for response analytics</li>
            </ul>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={handleShare}
              disabled={loading || agentEmails.filter(email => email.trim()).length === 0}
              className="flex-1 bg-orange-600 hover:bg-orange-700 text-white"
            >
              {loading ? (
                "Sending..."
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send to {agentEmails.filter(email => email.trim()).length || 0} Agent{agentEmails.filter(email => email.trim()).length !== 1 ? 's' : ''}
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
