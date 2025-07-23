import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Activity, Mail, MousePointer, Clock, Users, TrendingUp } from 'lucide-react';

interface AgentInteraction {
  id: string;
  agent_email: string;
  interaction_type: string;
  interaction_data: any;
  created_at: string;
  user_agent?: string;
  ip_address?: unknown;
}

interface AgentAnalyticsProps {
  tripId: string;
}

export const AgentAnalytics: React.FC<AgentAnalyticsProps> = ({ tripId }) => {
  const [interactions, setInteractions] = useState<AgentInteraction[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchInteractions();
  }, [tripId]);

  const fetchInteractions = async () => {
    try {
      const { data, error } = await supabase
        .from('agent_interactions')
        .select('*')
        .eq('trip_id', tripId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInteractions(data || []);
    } catch (error: any) {
      console.error('Error fetching interactions:', error);
      toast({
        title: "Error",
        description: "Failed to load agent analytics",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getInteractionIcon = (type: string) => {
    switch (type) {
      case 'email_sent': return <Mail className="w-4 h-4 text-blue-400" />;
      case 'link_clicked': return <MousePointer className="w-4 h-4 text-green-400" />;
      case 'response_received': return <Activity className="w-4 h-4 text-purple-400" />;
      default: return <Activity className="w-4 h-4 text-gray-400" />;
    }
  };

  const getInteractionLabel = (type: string) => {
    switch (type) {
      case 'email_sent': return 'Email Sent';
      case 'link_clicked': return 'Link Clicked';
      case 'response_received': return 'Response Received';
      default: return type;
    }
  };

  const getInteractionColor = (type: string) => {
    switch (type) {
      case 'email_sent': return 'bg-blue-900/20 text-blue-300 border-blue-700';
      case 'link_clicked': return 'bg-green-900/20 text-green-300 border-green-700';
      case 'response_received': return 'bg-purple-900/20 text-purple-300 border-purple-700';
      default: return 'bg-gray-900/20 text-gray-300 border-gray-700';
    }
  };

  // Calculate analytics
  const uniqueAgents = new Set(interactions.map(i => i.agent_email)).size;
  const emailsSent = interactions.filter(i => i.interaction_type === 'email_sent').length;
  const linksClicked = interactions.filter(i => i.interaction_type === 'link_clicked').length;
  const responsesReceived = interactions.filter(i => i.interaction_type === 'response_received').length;
  const clickRate = emailsSent > 0 ? ((linksClicked / emailsSent) * 100).toFixed(1) : '0';

  if (loading) {
    return (
      <Card className="bg-gray-900 border-gray-800 text-white">
        <CardContent className="p-6">
          <div className="text-center">Loading agent analytics...</div>
        </CardContent>
      </Card>
    );
  }

  if (interactions.length === 0) {
    return (
      <Card className="bg-gray-900 border-gray-800 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-400">
            <TrendingUp className="w-5 h-5" />
            Agent Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400 text-center">No agent interactions yet. Share your trip with agents to see analytics.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-900 border-gray-800 text-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-orange-400">
          <TrendingUp className="w-5 h-5" />
          Agent Analytics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-800 p-3 rounded-lg text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Users className="w-4 h-4 text-orange-400" />
              <span className="text-xs text-gray-400">Agents</span>
            </div>
            <div className="text-lg font-bold text-white">{uniqueAgents}</div>
          </div>
          
          <div className="bg-gray-800 p-3 rounded-lg text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Mail className="w-4 h-4 text-blue-400" />
              <span className="text-xs text-gray-400">Emails</span>
            </div>
            <div className="text-lg font-bold text-white">{emailsSent}</div>
          </div>
          
          <div className="bg-gray-800 p-3 rounded-lg text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <MousePointer className="w-4 h-4 text-green-400" />
              <span className="text-xs text-gray-400">Clicks</span>
            </div>
            <div className="text-lg font-bold text-white">{linksClicked}</div>
          </div>
          
          <div className="bg-gray-800 p-3 rounded-lg text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <TrendingUp className="w-4 h-4 text-purple-400" />
              <span className="text-xs text-gray-400">Rate</span>
            </div>
            <div className="text-lg font-bold text-white">{clickRate}%</div>
          </div>
        </div>

        {/* Interaction Timeline */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-300">Recent Activity</h4>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {interactions.slice(0, 10).map((interaction) => (
              <div key={interaction.id} className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
                <div className="flex-shrink-0">
                  {getInteractionIcon(interaction.interaction_type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${getInteractionColor(interaction.interaction_type)}`}
                    >
                      {getInteractionLabel(interaction.interaction_type)}
                    </Badge>
                    <span className="text-sm text-gray-400 truncate">
                      {interaction.agent_email}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(interaction.created_at).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Refresh Button */}
        <Button
          onClick={fetchInteractions}
          variant="outline"
          size="sm"
          className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
        >
          <Activity className="w-4 h-4 mr-2" />
          Refresh Analytics
        </Button>
      </CardContent>
    </Card>
  );
};