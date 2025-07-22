import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Copy, Check, Share2, Globe } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ShareTripDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tripId: string;
  tripName: string;
}

export const ShareTripDialog: React.FC<ShareTripDialogProps> = ({
  open,
  onOpenChange,
  tripId,
  tripName
}) => {
  const [shareUrl, setShareUrl] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      fetchShareStatus();
    }
  }, [open, tripId]);

  const fetchShareStatus = async () => {
    try {
      const { data, error } = await supabase
        .from('saved_trips')
        .select('share_id, is_public')
        .eq('id', tripId)
        .single();

      if (error) throw error;

      if (data) {
        setIsPublic(data.is_public);
        setShareUrl(`${window.location.origin}/trip/${data.share_id}`);
      }
    } catch (error) {
      console.error('Error fetching share status:', error);
    }
  };

  const toggleSharing = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('saved_trips')
        .update({ is_public: !isPublic })
        .eq('id', tripId);

      if (error) throw error;

      setIsPublic(!isPublic);
      
      toast({
        title: isPublic ? "Trip made private" : "Trip is now shareable!",
        description: isPublic 
          ? "Your trip link has been deactivated" 
          : "Anyone with the link can now view your trip",
      });
    } catch (error) {
      console.error('Error toggling share:', error);
      toast({
        title: "Error",
        description: "Failed to update sharing settings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast({
        title: "Link copied!",
        description: "Share URL has been copied to your clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Please copy the link manually",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-black border-gray-800 text-white max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="text-white text-center flex items-center gap-2">
            <Share2 className="w-5 h-5" />
            Share Your Trip
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="font-semibold text-lg mb-2">{tripName}</h3>
            <p className="text-gray-400 text-sm">
              {isPublic ? "Your trip is public and shareable" : "Make your trip public to share it"}
            </p>
          </div>

          {isPublic && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-green-400" />
                <span className="text-sm text-green-400">Public link active</span>
              </div>
              
              <div className="flex gap-2">
                <Input
                  value={shareUrl}
                  readOnly
                  className="bg-gray-900 border-gray-700 text-white text-sm"
                />
                <Button
                  onClick={copyToClipboard}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 flex-shrink-0"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <Button
              onClick={toggleSharing}
              disabled={loading}
              className={`flex-1 ${
                isPublic 
                  ? 'bg-red-600 hover:bg-red-700' 
                  : 'bg-green-600 hover:bg-green-700'
              } text-white`}
            >
              {loading ? "Updating..." : isPublic ? "Make Private" : "Make Public"}
            </Button>
            
            <Button
              onClick={() => onOpenChange(false)}
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};