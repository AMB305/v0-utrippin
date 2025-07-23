import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { AlertTriangle, Mail, Settings, Plus, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface AlertConfig {
  id: string;
  provider: string;
  endpoint: string;
  threshold_percentage: number;
  alert_email: string;
  is_active: boolean;
  last_alert_sent?: string;
}

export const AlertsManagement: React.FC = () => {
  const [alerts, setAlerts] = useState<AlertConfig[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [newAlert, setNewAlert] = useState({
    provider: '',
    endpoint: '',
    threshold_percentage: 80,
    alert_email: ''
  });

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      const { data, error } = await supabase
        .from('usage_alerts')
        .select('*')
        .order('provider', { ascending: true });

      if (error) throw error;
      setAlerts(data || []);
    } catch (error) {
      console.error('Error fetching alerts:', error);
      toast({
        title: "Error",
        description: "Failed to fetch alert configurations",
        variant: "destructive"
      });
    }
  };

  const createAlert = async () => {
    if (!newAlert.provider || !newAlert.endpoint || !newAlert.alert_email) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('usage_alerts')
        .insert([{
          ...newAlert,
          is_active: true
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Alert configuration created successfully"
      });

      setNewAlert({
        provider: '',
        endpoint: '',
        threshold_percentage: 80,
        alert_email: ''
      });
      setShowForm(false);
      fetchAlerts();
    } catch (error) {
      console.error('Error creating alert:', error);
      toast({
        title: "Error",
        description: "Failed to create alert configuration",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleAlert = async (id: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('usage_alerts')
        .update({ is_active: isActive })
        .eq('id', id);

      if (error) throw error;

      setAlerts(prev => prev.map(alert => 
        alert.id === id ? { ...alert, is_active: isActive } : alert
      ));

      toast({
        title: "Success",
        description: `Alert ${isActive ? 'enabled' : 'disabled'} successfully`
      });
    } catch (error) {
      console.error('Error updating alert:', error);
      toast({
        title: "Error",
        description: "Failed to update alert configuration",
        variant: "destructive"
      });
    }
  };

  const deleteAlert = async (id: string) => {
    if (!confirm('Are you sure you want to delete this alert?')) return;

    try {
      const { error } = await supabase
        .from('usage_alerts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setAlerts(prev => prev.filter(alert => alert.id !== id));
      
      toast({
        title: "Success",
        description: "Alert configuration deleted successfully"
      });
    } catch (error) {
      console.error('Error deleting alert:', error);
      toast({
        title: "Error",
        description: "Failed to delete alert configuration",
        variant: "destructive"
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Usage Alerts Management
            </CardTitle>
            <CardDescription>
              Configure email alerts for API usage thresholds
            </CardDescription>
          </div>
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Alert
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Alert Creation Form */}
        {showForm && (
          <Alert>
            <Settings className="h-4 w-4" />
            <AlertDescription>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <Label htmlFor="provider">Provider</Label>
                  <Input
                    id="provider"
                    placeholder="e.g., here, mapbox"
                    value={newAlert.provider}
                    onChange={(e) => setNewAlert(prev => ({...prev, provider: e.target.value}))}
                  />
                </div>
                <div>
                  <Label htmlFor="endpoint">Endpoint</Label>
                  <Input
                    id="endpoint"
                    placeholder="e.g., autocomplete, token-access"
                    value={newAlert.endpoint}
                    onChange={(e) => setNewAlert(prev => ({...prev, endpoint: e.target.value}))}
                  />
                </div>
                <div>
                  <Label htmlFor="threshold">Threshold (%)</Label>
                  <Input
                    id="threshold"
                    type="number"
                    min="1"
                    max="100"
                    value={newAlert.threshold_percentage}
                    onChange={(e) => setNewAlert(prev => ({...prev, threshold_percentage: parseInt(e.target.value)}))}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Alert Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@example.com"
                    value={newAlert.alert_email}
                    onChange={(e) => setNewAlert(prev => ({...prev, alert_email: e.target.value}))}
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button onClick={createAlert} disabled={loading}>
                  Create Alert
                </Button>
                <Button variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Alerts List */}
        <div className="space-y-4">
          {alerts.map((alert) => (
            <div key={alert.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Badge variant={alert.is_active ? "default" : "secondary"}>
                    {alert.provider}
                  </Badge>
                  <span className="text-sm text-muted-foreground">→</span>
                  <Badge variant="outline">{alert.endpoint}</Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  {alert.threshold_percentage}% threshold
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{alert.alert_email}</span>
                </div>
                
                <Switch
                  checked={alert.is_active}
                  onCheckedChange={(checked) => toggleAlert(alert.id, checked)}
                />
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => deleteAlert(alert.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          
          {alerts.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No alert configurations found. Create your first alert to get started.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};