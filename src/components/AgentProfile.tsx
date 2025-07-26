// src/components/AgentProfile.tsx

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { personalizationService, UserPersonalizationData } from '@/services/PersonalizationService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Crown, DollarSign, Settings, Save } from 'lucide-react';

const AgentProfile: React.FC = () => {
  const { user } = useAuth();
  const [personalizationData, setPersonalizationData] = useState<UserPersonalizationData | null>(null);
  const [affiliateIds, setAffiliateIds] = useState({
    expedia_affiliate_id: '',
    booking_affiliate_id: '',
    agoda_affiliate_id: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      loadPersonalizationData();
    }
  }, [user?.id]);

  const loadPersonalizationData = async () => {
    try {
      const data = await personalizationService.getUserPersonalizationData(user!.id);
      if (data) {
        setPersonalizationData(data);
        if (data.profile) {
          setAffiliateIds({
            expedia_affiliate_id: data.profile.expedia_affiliate_id || '',
            booking_affiliate_id: data.profile.booking_affiliate_id || '',
            agoda_affiliate_id: data.profile.agoda_affiliate_id || ''
          });
        }
      }
    } catch (error) {
      console.error('Error loading personalization data:', error);
      toast.error('Failed to load profile data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveAffiliateIds = async () => {
    if (!user?.id) return;

    setIsSaving(true);
    try {
      await personalizationService.updateUserProfile(user.id, affiliateIds);
      toast.success('Affiliate IDs updated successfully!');
      await loadPersonalizationData(); // Reload to update agent status
    } catch (error) {
      console.error('Error updating affiliate IDs:', error);
      toast.error('Failed to update affiliate IDs');
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setAffiliateIds(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">Please log in to access your agent profile.</p>
        </CardContent>
      </Card>
    );
  }

  const isAgent = personalizationData?.isAgent || false;
  const hasAnyAffiliateId = affiliateIds.expedia_affiliate_id || affiliateIds.booking_affiliate_id || affiliateIds.agoda_affiliate_id;

  return (
    <div className="space-y-6">
      {/* Agent Status Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Crown className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="flex items-center gap-2">
                  Agent Status
                  {isAgent && <Badge variant="secondary" className="bg-green-100 text-green-800">Active Agent</Badge>}
                </CardTitle>
                <CardDescription>
                  {isAgent 
                    ? "You're set up as a travel agent with commission tracking capabilities"
                    : "Configure your affiliate IDs to become a travel agent"
                  }
                </CardDescription>
              </div>
            </div>
            {isAgent && (
              <div className="flex items-center gap-2 text-green-600">
                <DollarSign className="h-4 w-4" />
                <span className="text-sm font-medium">Commission Enabled</span>
              </div>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Affiliate Configuration */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            <CardTitle>Affiliate Partner Configuration</CardTitle>
          </div>
          <CardDescription>
            Configure your affiliate IDs to earn commissions on bookings generated through your recommendations.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Expedia Configuration */}
          <div className="space-y-2">
            <Label htmlFor="expedia-id" className="text-sm font-medium">
              Expedia Affiliate ID
            </Label>
            <Input
              id="expedia-id"
              placeholder="Enter your Expedia affiliate ID (e.g., 1101l5dQSW)"
              value={affiliateIds.expedia_affiliate_id}
              onChange={(e) => handleInputChange('expedia_affiliate_id', e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Your Expedia partner ID for flight and hotel bookings through Commission Junction.
            </p>
          </div>

          <Separator />

          {/* Booking.com Configuration */}
          <div className="space-y-2">
            <Label htmlFor="booking-id" className="text-sm font-medium">
              Booking.com Affiliate ID
            </Label>
            <Input
              id="booking-id"
              placeholder="Enter your Booking.com affiliate ID"
              value={affiliateIds.booking_affiliate_id}
              onChange={(e) => handleInputChange('booking_affiliate_id', e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Your Booking.com partner ID for accommodation bookings.
            </p>
          </div>

          <Separator />

          {/* Agoda Configuration */}
          <div className="space-y-2">
            <Label htmlFor="agoda-id" className="text-sm font-medium">
              Agoda Partner ID
            </Label>
            <Input
              id="agoda-id"
              placeholder="Enter your Agoda partner ID"
              value={affiliateIds.agoda_affiliate_id}
              onChange={(e) => handleInputChange('agoda_affiliate_id', e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Your Agoda partner ID for hotel bookings in Asia and beyond.
            </p>
          </div>

          <div className="pt-4">
            <Button 
              onClick={handleSaveAffiliateIds}
              disabled={isSaving}
              className="w-full"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save Affiliate Configuration'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Agent Benefits */}
      {isAgent && (
        <Card>
          <CardHeader>
            <CardTitle>Agent Benefits Active</CardTitle>
            <CardDescription>
              You're enjoying these enhanced features as a verified travel agent.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg border bg-green-50">
                <h4 className="font-medium text-green-800 mb-2">Commission Tracking</h4>
                <p className="text-sm text-green-600">
                  All booking links use your affiliate IDs for commission tracking.
                </p>
              </div>
              <div className="p-4 rounded-lg border bg-blue-50">
                <h4 className="font-medium text-blue-800 mb-2">Premium Suggestions</h4>
                <p className="text-sm text-blue-600">
                  AI prioritizes higher-commission options in recommendations.
                </p>
              </div>
              <div className="p-4 rounded-lg border bg-purple-50">
                <h4 className="font-medium text-purple-800 mb-2">Professional Branding</h4>
                <p className="text-sm text-purple-600">
                  Itineraries include professional touches for client sharing.
                </p>
              </div>
              <div className="p-4 rounded-lg border bg-orange-50">
                <h4 className="font-medium text-orange-800 mb-2">Analytics Access</h4>
                <p className="text-sm text-orange-600">
                  Track click-through rates and booking performance.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Getting Started Guide */}
      {!isAgent && !hasAnyAffiliateId && (
        <Card>
          <CardHeader>
            <CardTitle>Become a Travel Agent</CardTitle>
            <CardDescription>
              Start earning commissions on travel bookings by setting up your affiliate partnerships.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg border bg-muted/50">
              <h4 className="font-medium mb-2">Getting Started:</h4>
              <ol className="text-sm space-y-1 list-decimal list-inside text-muted-foreground">
                <li>Sign up for affiliate programs with Expedia, Booking.com, and/or Agoda</li>
                <li>Obtain your affiliate/partner IDs from each platform</li>
                <li>Enter your IDs in the configuration above</li>
                <li>Start generating personalized itineraries with commission tracking</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AgentProfile;