import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from "lucide-react";

interface UsageProjectionCardProps {
  usageData: any[];
  className?: string;
}

export const UsageProjectionCard: React.FC<UsageProjectionCardProps> = ({ 
  usageData, 
  className = '' 
}) => {
  // Calculate projections based on current usage
  const calculateProjections = () => {
    const daysInMonth = 30;
    const currentDay = new Date().getDate();
    const projectedUsage = usageData.map(metric => {
      const dailyRate = metric.current_usage / currentDay;
      const projectedMonthlyUsage = dailyRate * daysInMonth;
      const projectedPercentage = (projectedMonthlyUsage / metric.monthly_limit) * 100;
      
      return {
        ...metric,
        projected_usage: Math.round(projectedMonthlyUsage),
        projected_percentage: Math.min(projectedPercentage, 100),
        trend: projectedPercentage > 100 ? 'critical' : projectedPercentage > 80 ? 'warning' : 'good'
      };
    });
    
    return projectedUsage;
  };

  const projections = calculateProjections();
  const criticalCount = projections.filter(p => p.trend === 'critical').length;
  const warningCount = projections.filter(p => p.trend === 'warning').length;
  const goodCount = projections.filter(p => p.trend === 'good').length;

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'critical':
        return <TrendingUp className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      default:
        return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
  };

  const getTrendBadge = (trend: string) => {
    switch (trend) {
      case 'critical':
        return <Badge variant="destructive">Overuse Risk</Badge>;
      case 'warning':
        return <Badge className="bg-orange-500 hover:bg-orange-600">Monitor</Badge>;
      default:
        return <Badge variant="default">On Track</Badge>;
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Monthly Usage Projection
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 border rounded-lg">
            <div className="text-2xl font-bold text-green-600">{goodCount}</div>
            <div className="text-xs text-muted-foreground">On Track</div>
          </div>
          <div className="text-center p-3 border rounded-lg">
            <div className="text-2xl font-bold text-orange-500">{warningCount}</div>
            <div className="text-xs text-muted-foreground">Monitor</div>
          </div>
          <div className="text-center p-3 border rounded-lg">
            <div className="text-2xl font-bold text-red-500">{criticalCount}</div>
            <div className="text-xs text-muted-foreground">At Risk</div>
          </div>
        </div>

        {/* Detailed Projections */}
        <div className="space-y-4">
          <h4 className="font-medium text-sm text-muted-foreground">Projected End-of-Month Usage</h4>
          {projections.map((projection, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  {getTrendIcon(projection.trend)}
                  <span className="font-medium text-sm">
                    {projection.provider}/{projection.endpoint}
                  </span>
                  {getTrendBadge(projection.trend)}
                </div>
                <div className="text-sm text-muted-foreground">
                  {projection.projected_usage.toLocaleString()} / {projection.monthly_limit.toLocaleString()}
                </div>
              </div>
              
              <Progress 
                value={projection.projected_percentage} 
                className="h-2"
              />
              
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Projected: {projection.projected_percentage.toFixed(1)}%</span>
                <span>Current: {projection.usage_percentage.toFixed(1)}%</span>
              </div>
            </div>
          ))}
        </div>

        {/* Recommendations */}
        {criticalCount > 0 && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <span className="font-medium text-red-800">Action Required</span>
            </div>
            <p className="text-sm text-red-700">
              {criticalCount} API{criticalCount > 1 ? 's are' : ' is'} projected to exceed monthly limits. 
              Consider increasing limits or optimizing usage.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};