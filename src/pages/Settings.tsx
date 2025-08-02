import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Settings as SettingsIcon, Shield, Bell, Globe, CreditCard, Trash2, Save } from 'lucide-react';

const Settings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [settings, setSettings] = useState({
    public_profile: true,
    email_notifications: true,
    push_notifications: true,
    match_notifications: true,
    message_notifications: true,
    marketing_emails: false,
    privacy_level: 'public'
  });

  const [travelPreferences, setTravelPreferences] = useState({
    budget_range_min: 50,
    budget_range_max: 500,
    group_size_preference: 'small',
    travel_pace: 'moderate',
  });

  useEffect(() => {
    if (user) {
      loadSettings();
      loadTravelPreferences();
    }
  }, [user]);

  const loadSettings = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('users')
        .select('public_profile')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      
      if (data) {
        setSettings(prev => ({
          ...prev,
          public_profile: data.public_profile ?? true
        }));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const loadTravelPreferences = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('travel_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        setTravelPreferences({
          budget_range_min: data.budget_range_min || 50,
          budget_range_max: data.budget_range_max || 500,
          group_size_preference: data.group_size_preference || 'small',
          travel_pace: data.travel_pace || 'moderate',
        });
      }
    } catch (error) {
      console.error('Error loading travel preferences:', error);
    }
  };

  const handleSaveSettings = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Update user settings
      const { error: userError } = await supabase
        .from('users')
        .update({
          public_profile: settings.public_profile
        })
        .eq('id', user.id);

      if (userError) throw userError;

      // Update travel preferences
      const { error: prefsError } = await supabase
        .from('travel_preferences')
        .upsert({
          user_id: user.id,
          ...travelPreferences,
        });

      if (prefsError) throw prefsError;

      toast({
        title: "Settings saved!",
        description: "Your settings have been successfully updated.",
      });
    } catch (error: any) {
      toast({
        title: "Error saving settings",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SettingsIcon className="w-5 h-5" />
                Account Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Privacy Settings */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Privacy & Visibility
                </h3>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Public Profile</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow other travelers to find and connect with you
                    </p>
                  </div>
                  <Switch
                    checked={settings.public_profile}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({ ...prev, public_profile: checked }))
                    }
                  />
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>Privacy Level</Label>
                  <Select 
                    value={settings.privacy_level} 
                    onValueChange={(value) => setSettings(prev => ({ ...prev, privacy_level: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public - Anyone can find me</SelectItem>
                      <SelectItem value="friends">Friends Only - Only connections can see details</SelectItem>
                      <SelectItem value="private">Private - Hidden from search</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              {/* Notification Settings */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Notifications
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive important updates via email
                      </p>
                    </div>
                    <Switch
                      checked={settings.email_notifications}
                      onCheckedChange={(checked) => 
                        setSettings(prev => ({ ...prev, email_notifications: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Match Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Get notified when you have new travel buddy matches
                      </p>
                    </div>
                    <Switch
                      checked={settings.match_notifications}
                      onCheckedChange={(checked) => 
                        setSettings(prev => ({ ...prev, match_notifications: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Message Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Get notified when you receive new messages
                      </p>
                    </div>
                    <Switch
                      checked={settings.message_notifications}
                      onCheckedChange={(checked) => 
                        setSettings(prev => ({ ...prev, message_notifications: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Marketing Emails</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive travel deals and promotional content
                      </p>
                    </div>
                    <Switch
                      checked={settings.marketing_emails}
                      onCheckedChange={(checked) => 
                        setSettings(prev => ({ ...prev, marketing_emails: checked }))
                      }
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Travel Preferences */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Travel Preferences
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Budget Range (per day)</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        placeholder="Min"
                        value={travelPreferences.budget_range_min}
                        onChange={(e) => setTravelPreferences(prev => ({ 
                          ...prev, 
                          budget_range_min: parseInt(e.target.value) || 0 
                        }))}
                      />
                      <span>-</span>
                      <Input
                        type="number"
                        placeholder="Max"
                        value={travelPreferences.budget_range_max}
                        onChange={(e) => setTravelPreferences(prev => ({ 
                          ...prev, 
                          budget_range_max: parseInt(e.target.value) || 0 
                        }))}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Group Size Preference</Label>
                    <Select 
                      value={travelPreferences.group_size_preference} 
                      onValueChange={(value) => setTravelPreferences(prev => ({ 
                        ...prev, 
                        group_size_preference: value 
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="solo">Solo Travel</SelectItem>
                        <SelectItem value="small">Small Group (2-4 people)</SelectItem>
                        <SelectItem value="medium">Medium Group (5-8 people)</SelectItem>
                        <SelectItem value="large">Large Group (9+ people)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Travel Pace</Label>
                    <Select 
                      value={travelPreferences.travel_pace} 
                      onValueChange={(value) => setTravelPreferences(prev => ({ 
                        ...prev, 
                        travel_pace: value 
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="slow">Slow & Relaxed</SelectItem>
                        <SelectItem value="moderate">Moderate</SelectItem>
                        <SelectItem value="fast">Fast-Paced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Account Actions */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Account
                </h3>
                
                <div className="space-y-2">
                  <Label>Email Address</Label>
                  <Input value={user?.email || ''} disabled />
                  <p className="text-sm text-muted-foreground">
                    Contact support to change your email address
                  </p>
                </div>

                <div className="pt-4">
                  <Button variant="destructive" className="flex items-center gap-2">
                    <Trash2 className="w-4 h-4" />
                    Delete Account
                  </Button>
                  <p className="text-sm text-muted-foreground mt-2">
                    This action cannot be undone. All your data will be permanently deleted.
                  </p>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end pt-6">
                <Button onClick={handleSaveSettings} disabled={loading}>
                  <Save className="w-4 h-4 mr-2" />
                  {loading ? 'Saving...' : 'Save Settings'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;
