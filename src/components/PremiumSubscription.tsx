import { useState } from 'react';
import { Check, Crown, Zap, Star, Shield, Users, BarChart, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useSubscription } from '@/hooks/useSubscription';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface PricingPlan {
  id: string;
  name: string;
  price: number;
  interval: 'month' | 'year';
  priceId: string;
  features: string[];
  icon: React.ComponentType<{ className?: string }>;
  popular?: boolean;
  description: string;
}

const pricingPlans: PricingPlan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    interval: 'month',
    priceId: '',
    description: 'Perfect for getting started with travel buddy matching',
    icon: Users,
    features: [
      '10 daily swipes',
      '5 monthly matches',
      '3 message threads',
      'Basic search filters',
      'Community support',
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 9.99,
    interval: 'month',
    priceId: 'price_premium_monthly',
    description: 'Unlock unlimited connections and advanced features',
    icon: Crown,
    popular: true,
    features: [
      'Unlimited daily swipes',
      'Unlimited matches',
      'Unlimited messaging',
      'Advanced search filters',
      'Priority matching algorithm',
      'Read receipts',
      'Travel insights & analytics',
      'Priority customer support',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 19.99,
    interval: 'month',
    priceId: 'price_pro_monthly',
    description: 'For power users and travel professionals',
    icon: Star,
    features: [
      'Everything in Premium',
      'Group trip planning tools',
      'White-label solutions',
      'API access for integrations',
      'Advanced analytics dashboard',
      'Dedicated account manager',
      'Custom branding options',
    ],
  },
];

export function PremiumSubscription() {
  const { user } = useAuth();
  const { subscription, isPremium, isPro, getFeatureUsage, getFeatureLimit, createSubscription } = useSubscription();
  const { toast } = useToast();
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async (plan: PricingPlan) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to subscribe to premium features.",
        variant: "destructive",
      });
      return;
    }

    setLoading(plan.id);
    try {
      const result = await createSubscription(plan.priceId);
      if (result?.clientSecret) {
        // In a real app, you would redirect to Stripe Checkout or use Stripe Elements
        toast({
          title: "Subscription Created",
          description: `Successfully subscribed to ${plan.name}!`,
        });
      }
    } catch (error) {
      console.error('Subscription error:', error);
    } finally {
      setLoading(null);
    }
  };

  const getCurrentPlan = () => {
    if (!subscription || subscription.status !== 'active') return 'free';
    return subscription.plan_type;
  };

  const renderFeatureUsage = () => {
    if (isPremium) return null;

    const features = [
      { name: 'Daily Swipes', key: 'daily_swipes', icon: Zap },
      { name: 'Monthly Matches', key: 'monthly_matches', icon: Users },
      { name: 'Message Threads', key: 'message_threads', icon: BarChart },
    ];

    return (
      <Card className="mb-8 bg-gradient-to-r from-utrippin-orange/10 to-utrippin-blue/10 border-utrippin-orange/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-utrippin-orange">
            <Clock className="w-5 h-5" />
            Your Usage This Month
          </CardTitle>
          <CardDescription>
            Track your feature usage and see what's available with premium plans
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {features.map(feature => {
            const usage = getFeatureUsage(feature.key);
            const limit = getFeatureLimit(feature.key);
            const percentage = limit > 0 ? (usage / limit) * 100 : 0;
            const Icon = feature.icon;

            return (
              <div key={feature.key} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-utrippin-orange" />
                    <span className="font-medium text-white">{feature.name}</span>
                  </div>
                  <span className="text-sm text-gray-400">
                    {usage} / {limit > 0 ? limit : '∞'}
                  </span>
                </div>
                <Progress 
                  value={percentage} 
                  className="h-2"
                />
                {percentage >= 80 && (
                  <p className="text-xs text-utrippin-orange">
                    You're close to your limit! Upgrade to get unlimited access.
                  </p>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">
          Unlock Premium Travel Connections
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          Get unlimited access to find your perfect travel buddies and plan amazing adventures together
        </p>
      </div>

      {/* Current Usage */}
      {renderFeatureUsage()}

      {/* Pricing Plans */}
      <div className="grid md:grid-cols-3 gap-8 mb-12">
        {pricingPlans.map((plan) => {
          const Icon = plan.icon;
          const isCurrentPlan = getCurrentPlan() === plan.id;
          const isPopular = plan.popular;

          return (
            <Card 
              key={plan.id} 
              className={`relative bg-utrippin-muted border transition-all duration-300 hover:scale-105 ${
                isPopular 
                  ? 'border-utrippin-orange shadow-lg shadow-utrippin-orange/20' 
                  : 'border-utrippin-orange/20'
              } ${
                isCurrentPlan 
                  ? 'ring-2 ring-utrippin-orange' 
                  : ''
              }`}
            >
              {isPopular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-utrippin-orange text-utrippin-navy">
                  Most Popular
                </Badge>
              )}
              
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                  <div className={`p-3 rounded-full ${
                    isPopular ? 'bg-utrippin-orange/20' : 'bg-utrippin-blue/20'
                  }`}>
                    <Icon className={`w-8 h-8 ${
                      isPopular ? 'text-utrippin-orange' : 'text-utrippin-blue'
                    }`} />
                  </div>
                </div>
                
                <CardTitle className="text-2xl text-white">{plan.name}</CardTitle>
                <CardDescription className="text-gray-400">
                  {plan.description}
                </CardDescription>
                
                <div className="mt-4">
                  <span className="text-4xl font-bold text-white">
                    ${plan.price}
                  </span>
                  {plan.price > 0 && (
                    <span className="text-gray-400">/{plan.interval}</span>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-utrippin-orange flex-shrink-0" />
                    <span className="text-gray-300">{feature}</span>
                  </div>
                ))}
              </CardContent>

              <CardFooter>
                {isCurrentPlan ? (
                  <Button 
                    className="w-full" 
                    variant="outline"
                    disabled
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Current Plan
                  </Button>
                ) : (
                  <Button
                    className={`w-full ${
                      isPopular 
                        ? 'bg-utrippin-orange hover:bg-utrippin-orange/90 text-utrippin-navy' 
                        : 'bg-utrippin-blue hover:bg-utrippin-blue/90'
                    }`}
                    onClick={() => handleSubscribe(plan)}
                    disabled={loading === plan.id || plan.price === 0}
                  >
                    {loading === plan.id ? (
                      'Processing...'
                    ) : plan.price === 0 ? (
                      'Free Forever'
                    ) : (
                      `Upgrade to ${plan.name}`
                    )}
                  </Button>
                )}
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {/* Feature Comparison */}
      <Card className="bg-utrippin-muted border-utrippin-orange/20">
        <CardHeader>
          <CardTitle className="text-center text-white">Why Choose Premium?</CardTitle>
          <CardDescription className="text-center">
            Unlock the full potential of UTrippIN with premium features
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            <div className="space-y-2">
              <div className="p-3 bg-utrippin-orange/20 rounded-full w-fit mx-auto">
                <Zap className="w-6 h-6 text-utrippin-orange" />
              </div>
              <h3 className="font-semibold text-white">Unlimited Swipes</h3>
              <p className="text-sm text-gray-400">
                Never run out of potential travel buddies to connect with
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="p-3 bg-utrippin-orange/20 rounded-full w-fit mx-auto">
                <Users className="w-6 h-6 text-utrippin-orange" />
              </div>
              <h3 className="font-semibold text-white">Priority Matching</h3>
              <p className="text-sm text-gray-400">
                Get matched with compatible travelers faster
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="p-3 bg-utrippin-orange/20 rounded-full w-fit mx-auto">
                <BarChart className="w-6 h-6 text-utrippin-orange" />
              </div>
              <h3 className="font-semibold text-white">Travel Insights</h3>
              <p className="text-sm text-gray-400">
                Get analytics on your travel preferences and matches
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="p-3 bg-utrippin-orange/20 rounded-full w-fit mx-auto">
                <Shield className="w-6 h-6 text-utrippin-orange" />
              </div>
              <h3 className="font-semibold text-white">Priority Support</h3>
              <p className="text-sm text-gray-400">
                Get help when you need it with 24/7 premium support
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
