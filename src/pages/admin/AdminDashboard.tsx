import React, { useState, useEffect } from 'react';
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, Activity, TrendingUp, RefreshCw, Settings, Upload, DollarSign, Clock, Target, BarChart3 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { UsageProjectionCard } from "@/components/UsageProjectionCard";
import { AlertsManagement } from "@/components/AlertsManagement";

interface UsageMetric {
  provider: string;
  endpoint: string;
  current_usage: number;
  monthly_limit: number;
  usage_percentage: number;
  remaining_calls: number;
  total_cost: number;
}

export default function AdminDashboard() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [usageData, setUsageData] = useState<UsageMetric[]>([]);
  const [recentCalls, setRecentCalls] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [error, setError] = useState("");

  // Loading state
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              Access Denied
            </CardTitle>
            <CardDescription>
              Please log in to access this page.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/auth')} className="w-full">
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Not admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              Insufficient Permissions
            </CardTitle>
            <CardDescription>
              You need admin privileges to access this page.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/')} className="w-full">
              Return Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const fetchUsageData = async () => {
    setLoading(true);
    setError("");
    try {
      // Use the enhanced get-usage-summary function
      const { data, error } = await supabase.functions.invoke('get-usage-summary');
      
      if (error) throw error;
      
      setUsageData(data.usage_data || []);
      setRecentCalls(data.recent_calls || []);
      setLastUpdated(new Date());
    } catch (err: any) {
      setError(`Failed to fetch usage data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsageData();
  }, []);

  const getUsageColor = (percentage: number): string => {
    if (percentage >= 90) return "bg-destructive";
    if (percentage >= 80) return "bg-orange-500";
    if (percentage >= 60) return "bg-yellow-500";
    return "bg-primary";
  };

  const getStatusBadge = (percentage: number) => {
    if (percentage >= 90) return <Badge variant="destructive">Critical</Badge>;
    if (percentage >= 80) return <Badge className="bg-orange-500 hover:bg-orange-600">Warning</Badge>;
    if (percentage >= 60) return <Badge className="bg-yellow-500 hover:bg-yellow-600">Moderate</Badge>;
    return <Badge variant="default">Good</Badge>;
  };

  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat().format(num);
  };

  const getTotalCost = (): number => {
    return usageData.reduce((sum, metric) => sum + Number(metric.total_cost), 0);
  };

  // Prepare chart data
  const prepareChartData = () => {
    const usageChartData = usageData.map(metric => ({
      name: `${metric.provider}/${metric.endpoint}`,
      value: metric.usage_percentage
    }));

    const costChartData = usageData.map(metric => ({
      name: metric.provider,
      value: metric.total_cost
    }));

    const recentActivity = recentCalls.slice(0, 10).map(call => ({
      name: new Date(call.created_at).toLocaleDateString(),
      value: call.usage_count
    }));

    return { usageChartData, costChartData, recentActivity };
  };

  const { usageChartData, costChartData, recentActivity } = prepareChartData();

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
            <p className="text-muted-foreground">Monitor API usage and system metrics</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate('/admin/upload-trips')}>
              <Upload className="h-4 w-4 mr-2" />
              Upload Trips
            </Button>
            <Button onClick={fetchUsageData} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {error && (
          <Alert className="border-destructive/50 text-destructive dark:border-destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${getTotalCost().toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active APIs</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{usageData.length}</div>
              <p className="text-xs text-muted-foreground">Monitored endpoints</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">High Usage</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {usageData.filter(m => m.usage_percentage >= 80).length}
              </div>
              <p className="text-xs text-muted-foreground">≥80% usage</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Last Updated</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-sm font-medium">
                {lastUpdated ? lastUpdated.toLocaleTimeString() : 'Never'}
              </div>
              <p className="text-xs text-muted-foreground">
                {lastUpdated ? lastUpdated.toLocaleDateString() : 'No data'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Analytics Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>API Usage Monitoring</CardTitle>
                <CardDescription>
                  Real-time monitoring of API usage across all providers
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {usageData.length === 0 && !loading ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No usage data available
                  </div>
                ) : (
                  usageData.map((metric, index) => (
                    <div key={index} className="space-y-3">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className="font-medium capitalize">
                            {metric.provider} - {metric.endpoint}
                          </div>
                          {getStatusBadge(metric.usage_percentage)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {formatNumber(metric.current_usage)} / {formatNumber(metric.monthly_limit)}
                          {metric.total_cost > 0 && (
                            <span className="ml-2 font-medium">${metric.total_cost.toFixed(2)}</span>
                          )}
                        </div>
                      </div>
                      
                      <Progress 
                        value={metric.usage_percentage} 
                        className="h-2"
                        style={{
                          '--progress-background': getUsageColor(metric.usage_percentage)
                        } as React.CSSProperties}
                      />
                      
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{metric.usage_percentage.toFixed(1)}% used</span>
                        <span>{formatNumber(metric.remaining_calls)} calls remaining</span>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <UsageProjectionCard usageData={usageData} />
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Cost Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {usageData.map((metric, index) => (
                      <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                          <span className="font-medium">{metric.provider}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">${metric.total_cost.toFixed(2)}</div>
                          <div className="text-sm text-muted-foreground">{metric.current_usage.toLocaleString()} calls</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Usage Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <DollarSign className="h-8 w-8 mx-auto mb-2 text-green-600" />
                    <div className="text-2xl font-bold">${getTotalCost().toFixed(2)}</div>
                    <div className="text-sm text-muted-foreground">Monthly Cost</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <BarChart3 className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                    <div className="text-2xl font-bold">
                      {usageData.reduce((sum, m) => sum + m.current_usage, 0).toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">Total Calls</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <Clock className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                    <div className="text-2xl font-bold">
                      {Math.round(usageData.reduce((sum, m) => sum + m.usage_percentage, 0) / usageData.length) || 0}%
                    </div>
                    <div className="text-sm text-muted-foreground">Avg Usage</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-4">            
            <Card>
              <CardHeader>
                <CardTitle>Recent API Activity</CardTitle>
                <CardDescription>
                  Visual overview of recent API usage patterns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {recentActivity.slice(0, 8).map((activity, index) => (
                    <div key={index} className="text-center p-3 border rounded-lg">
                      <div className="text-lg font-bold text-blue-600">{activity.value}</div>
                      <div className="text-xs text-muted-foreground">{activity.name}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Recent API Calls</CardTitle>
                <CardDescription>
                  Latest API usage activity across all providers
                </CardDescription>
              </CardHeader>
              <CardContent>
                {recentCalls.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No recent activity data available
                  </div>
                ) : (
                  <div className="space-y-2">
                    {recentCalls.slice(0, 20).map((call, index) => (
                      <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline">{call.provider}</Badge>
                          <span className="text-sm">{call.endpoint}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <span>{call.usage_count} calls</span>
                          <span>${call.total_cost?.toFixed(4) || '0.0000'}</span>
                          <span>{new Date(call.created_at).toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Alerts Tab */}
          <TabsContent value="alerts" className="space-y-4">
            <AlertsManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
