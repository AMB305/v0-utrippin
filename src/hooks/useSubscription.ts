import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';

interface Subscription {
  id: string;
  user_id: string;
  stripe_subscription_id: string;
  stripe_customer_id: string;
  status: string;
  plan_type: string;
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
}

interface FeatureUsage {
  feature_name: string;
  usage_count: number;
  reset_date: string;
}

export function useSubscription() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [featureUsage, setFeatureUsage] = useState<FeatureUsage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchSubscription();
      fetchFeatureUsage();
    } else {
      setSubscription(null);
      setFeatureUsage([]);
      setLoading(false);
    }
  }, [user]);

  const fetchSubscription = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching subscription:', error);
        return;
      }

      setSubscription(data);
    } catch (error) {
      console.error('Error fetching subscription:', error);
    }
  };

  const fetchFeatureUsage = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_feature_usage')
        .select('feature_name, usage_count, reset_date')
        .eq('user_id', user.id)
        .gte('reset_date', new Date().toISOString());

      if (error) {
        console.error('Error fetching feature usage:', error);
        return;
      }

      setFeatureUsage(data || []);
    } catch (error) {
      console.error('Error fetching feature usage:', error);
    } finally {
      setLoading(false);
    }
  };

  const createSubscription = async (priceId: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to subscribe to premium features.",
        variant: "destructive",
      });
      return null;
    }

    try {
      setLoading(true);
      
      const response = await supabase.functions.invoke('subscription-management', {
        body: { 
          action: 'create-subscription',
          priceId,
          userId: user.id 
        },
      });

      if (response.error) {
        throw response.error;
      }

      return response.data;
    } catch (error) {
      console.error('Error creating subscription:', error);
      toast({
        title: "Subscription Error",
        description: "Failed to create subscription. Please try again.",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const cancelSubscription = async () => {
    if (!user || !subscription) return;

    try {
      setLoading(true);
      
      const response = await supabase.functions.invoke('subscription-management', {
        body: { 
          action: 'cancel-subscription',
          subscriptionId: subscription.stripe_subscription_id,
          userId: user.id 
        },
      });

      if (response.error) {
        throw response.error;
      }

      toast({
        title: "Subscription Cancelled",
        description: "Your subscription will remain active until the end of the current billing period.",
      });

      await fetchSubscription();
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      toast({
        title: "Cancellation Error",
        description: "Failed to cancel subscription. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const checkFeatureAccess = async (featureName: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const { data, error } = await supabase.rpc('has_premium_access', {
        user_id: user.id,
        feature_name: featureName,
      });

      if (error) {
        console.error('Error checking feature access:', error);
        return false;
      }

      return data || false;
    } catch (error) {
      console.error('Error checking feature access:', error);
      return false;
    }
  };

  const trackFeatureUsage = async (featureName: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const { data, error } = await supabase.rpc('track_feature_usage', {
        user_id: user.id,
        feature_name: featureName,
      });

      if (error) {
        console.error('Error tracking feature usage:', error);
        return false;
      }

      // Refresh feature usage data
      await fetchFeatureUsage();

      return data || false;
    } catch (error) {
      console.error('Error tracking feature usage:', error);
      return false;
    }
  };

  const getFeatureUsage = (featureName: string): number => {
    const usage = featureUsage.find(f => f.feature_name === featureName);
    return usage?.usage_count || 0;
  };

  const getFeatureLimit = (featureName: string): number => {
    if (subscription?.plan_type === 'premium' || subscription?.plan_type === 'pro') {
      return -1; // Unlimited
    }

    // Free tier limits
    const limits: Record<string, number> = {
      daily_swipes: 10,
      monthly_matches: 5,
      message_threads: 3,
    };

    return limits[featureName] || 0;
  };

  const isPremium = subscription?.plan_type === 'premium' || subscription?.plan_type === 'pro';
  const isPro = subscription?.plan_type === 'pro';
  const isActive = subscription?.status === 'active';

  return {
    subscription,
    loading,
    isPremium,
    isPro,
    isActive,
    featureUsage,
    createSubscription,
    cancelSubscription,
    checkFeatureAccess,
    trackFeatureUsage,
    getFeatureUsage,
    getFeatureLimit,
    refetch: () => {
      fetchSubscription();
      fetchFeatureUsage();
    },
  };
}
