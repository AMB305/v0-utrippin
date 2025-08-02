import { useState, useEffect } from 'react';
import { Crown, Lock, Zap } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSubscription } from '@/hooks/useSubscription';
import { useNavigate } from 'react-router-dom';

interface PremiumFeatureGateProps {
  feature: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showUsage?: boolean;
  upgradeMessage?: string;
  requiresPro?: boolean;
}

export function PremiumFeatureGate({ 
  feature, 
  children, 
  fallback,
  showUsage = false,
  upgradeMessage,
  requiresPro = false
}: PremiumFeatureGateProps) {
  const { 
    isPremium, 
    isPro, 
    checkFeatureAccess, 
    trackFeatureUsage, 
    getFeatureUsage, 
    getFeatureLimit 
  } = useSubscription();
  const navigate = useNavigate();
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAccess = async () => {
      setLoading(true);
      const access = await checkFeatureAccess(feature);
      setHasAccess(access);
      setLoading(false);
    };

    checkAccess();
  }, [feature, checkFeatureAccess]);

  const handleFeatureUse = async () => {
    const canUse = await trackFeatureUsage(feature);
    if (!canUse) {
      setHasAccess(false);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse bg-utrippin-muted/50 rounded-lg p-4">
        <div className="h-4 bg-utrippin-orange/20 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-utrippin-orange/20 rounded w-1/2"></div>
      </div>
    );
  }

  // If user has access, render children with usage tracking
  if (hasAccess) {
    return (
      <div onClick={handleFeatureUse}>
        {children}
        {showUsage && !isPremium && (
          <UsageIndicator feature={feature} />
        )}
      </div>
    );
  }

  // If there's a custom fallback, use it
  if (fallback) {
    return <>{fallback}</>;
  }

  // Default upgrade prompt
  return (
    <Card className="bg-gradient-to-br from-utrippin-orange/10 to-utrippin-blue/10 border-utrippin-orange/30">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-utrippin-orange/20 rounded-full">
            {requiresPro ? (
              <Crown className="w-8 h-8 text-utrippin-orange" />
            ) : (
              <Lock className="w-8 h-8 text-utrippin-orange" />
            )}
          </div>
        </div>
        
        <CardTitle className="text-xl text-white flex items-center justify-center gap-2">
          {requiresPro ? (
            <>
              <Badge className="bg-utrippin-orange text-utrippin-navy">PRO</Badge>
              Pro Feature
            </>
          ) : (
            <>
              <Badge className="bg-utrippin-orange text-utrippin-navy">PREMIUM</Badge>
              Premium Feature
            </>
          )}
        </CardTitle>
        
        <CardDescription className="text-gray-300">
          {upgradeMessage || `Unlock this feature with ${requiresPro ? 'Pro' : 'Premium'}`}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="text-center space-y-4">
        {showUsage && (
          <UsageIndicator feature={feature} showUpgrade />
        )}
        
        <div className="space-y-2">
          <Button 
            onClick={() => navigate('/premium')}
            className="w-full bg-utrippin-orange hover:bg-utrippin-orange/90 text-utrippin-navy font-semibold"
          >
            <Crown className="w-4 h-4 mr-2" />
            Upgrade to {requiresPro ? 'Pro' : 'Premium'}
          </Button>
          
          <p className="text-xs text-gray-400">
            Start your free trial today • Cancel anytime
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

interface UsageIndicatorProps {
  feature: string;
  showUpgrade?: boolean;
}

function UsageIndicator({ feature, showUpgrade = false }: UsageIndicatorProps) {
  const { getFeatureUsage, getFeatureLimit } = useSubscription();
  const navigate = useNavigate();
  
  const usage = getFeatureUsage(feature);
  const limit = getFeatureLimit(feature);
  
  if (limit <= 0) return null; // Unlimited usage
  
  const percentage = (usage / limit) * 100;
  const isNearLimit = percentage >= 80;
  const isAtLimit = usage >= limit;

  return (
    <Card className={`mt-4 ${isAtLimit ? 'border-red-500/50 bg-red-500/10' : isNearLimit ? 'border-utrippin-orange/50 bg-utrippin-orange/10' : 'border-utrippin-blue/20'}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-white">
            Usage: {usage} / {limit}
          </span>
          <span className="text-xs text-gray-400">
            {Math.round(percentage)}%
          </span>
        </div>
        
        <div className="w-full bg-gray-700 rounded-full h-2 mb-3">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${
              isAtLimit ? 'bg-red-500' : isNearLimit ? 'bg-utrippin-orange' : 'bg-utrippin-blue'
            }`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
        
        {isAtLimit && showUpgrade && (
          <div className="text-center">
            <p className="text-sm text-red-400 mb-3">
              You've reached your {feature.replace('_', ' ')} limit for this month
            </p>
            <Button 
              size="sm"
              onClick={() => navigate('/premium')}
              className="bg-utrippin-orange hover:bg-utrippin-orange/90 text-utrippin-navy"
            >
              <Zap className="w-3 h-3 mr-1" />
              Upgrade Now
            </Button>
          </div>
        )}
        
        {isNearLimit && !isAtLimit && (
          <p className="text-xs text-utrippin-orange text-center">
            You're close to your limit! Consider upgrading for unlimited access.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
