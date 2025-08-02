import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info, AlertTriangle } from "lucide-react";

interface RateComment {
  id: string;
  type: "info" | "warning" | "mandatory";
  content: string;
}

interface HotelRateCommentsProps {
  rateCommentsId?: string;
  rateComments?: RateComment[];
  className?: string;
}

const HotelRateComments = ({ rateCommentsId, rateComments, className }: HotelRateCommentsProps) => {
  const [comments, setComments] = useState<RateComment[]>([]);
  const [loading, setLoading] = useState(false);

  // Mock rate comments for demo purposes
  const mockRateComments: RateComment[] = [
    {
      id: "102",
      type: "warning",
      content: "Hotel insurance has a cost, and must be paid voluntarily in the hotel."
    },
    {
      id: "166598",
      type: "info", 
      content: "City tax not included in the rate and must be paid directly at the hotel."
    },
    {
      id: "0",
      type: "mandatory",
      content: "Check-in time is strictly after 3:00 PM. Early check-in subject to availability and additional charges."
    }
  ];

  useEffect(() => {
    if (rateComments) {
      setComments(rateComments);
    } else if (rateCommentsId) {
      setLoading(true);
      
      // Try live Content API first, fallback to mock
      const fetchRateComments = async () => {
        try {
          const response = await fetch('/api/supabase/functions/hotelbeds-content-api', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              type: 'ratecomments',
              codes: rateCommentsId.split("|"),
              language: 'ENG'
            })
          });
          
          if (response.ok) {
            const data = await response.json();
            const liveComments = data.data?.ratecomments?.map((comment: any) => ({
              id: comment.code,
              type: comment.type?.toLowerCase() || 'info',
              content: comment.description
            })) || [];
            
            if (liveComments.length > 0) {
              setComments(liveComments);
              setLoading(false);
              return;
            }
          }
        } catch (error) {
          console.warn('Failed to fetch live rate comments, using mock data:', error);
        }
        
        // Fallback to mock data
        const commentIds = rateCommentsId.split("|");
        const filteredComments = mockRateComments.filter(comment => 
          commentIds.includes(comment.id)
        );
        setComments(filteredComments);
        setLoading(false);
      };
      
      fetchRateComments();
    }
  }, [rateCommentsId, rateComments]);

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="p-4">
          <div className="animate-pulse">
            <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (comments.length === 0) {
    return null;
  }

  return (
    <Card className={className}>
      <CardContent className="p-4 space-y-3">
        <h4 className="font-medium text-sm text-muted-foreground mb-3">
          Important Information
        </h4>
        {comments.map((comment) => (
          <Alert 
            key={comment.id} 
            variant={comment.type === "warning" || comment.type === "mandatory" ? "destructive" : "default"}
            className="py-2"
          >
            {comment.type === "warning" || comment.type === "mandatory" ? (
              <AlertTriangle className="h-4 w-4" />
            ) : (
              <Info className="h-4 w-4" />
            )}
            <AlertDescription className="text-sm">
              {comment.content}
            </AlertDescription>
          </Alert>
        ))}
      </CardContent>
    </Card>
  );
};

export default HotelRateComments;
