import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, Eye, Search, MousePointer, Clock, ExternalLink } from "lucide-react";

interface SEOMetric {
  name: string;
  value: string | number;
  change: number;
  trend: 'up' | 'down' | 'neutral';
  description: string;
}

interface RankingData {
  keyword: string;
  position: number;
  previousPosition: number;
  searchVolume: number;
  difficulty: string;
}

export const SEODashboard = () => {
  const [metrics, setMetrics] = useState<SEOMetric[]>([]);
  const [rankings, setRankings] = useState<RankingData[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock SEO data - in production, this would come from APIs
  useEffect(() => {
    const mockMetrics: SEOMetric[] = [
      {
        name: "Organic Traffic",
        value: "24,567",
        change: 15.3,
        trend: 'up',
        description: "Monthly organic sessions"
      },
      {
        name: "Average Position",
        value: "8.2",
        change: -2.1,
        trend: 'up',
        description: "Average ranking position"
      },
      {
        name: "Click-Through Rate",
        value: "3.8%",
        change: 0.7,
        trend: 'up',
        description: "Organic search CTR"
      },
      {
        name: "Conversion Rate",
        value: "2.4%",
        change: 0.3,
        trend: 'up',
        description: "Organic traffic conversions"
      },
      {
        name: "Core Web Vitals",
        value: "Good",
        change: 0,
        trend: 'neutral',
        description: "LCP, FID, CLS scores"
      },
      {
        name: "Indexed Pages",
        value: "847",
        change: 12,
        trend: 'up',
        description: "Pages in Google index"
      }
    ];

    const mockRankings: RankingData[] = [
      { keyword: "cheap flights", position: 4, previousPosition: 7, searchVolume: 165000, difficulty: "High" },
      { keyword: "AI travel booking", position: 2, previousPosition: 3, searchVolume: 8100, difficulty: "Medium" },
      { keyword: "hotel deals", position: 12, previousPosition: 15, searchVolume: 74000, difficulty: "High" },
      { keyword: "flight booking", position: 8, previousPosition: 12, searchVolume: 135000, difficulty: "High" },
      { keyword: "vacation packages", position: 6, previousPosition: 8, searchVolume: 49500, difficulty: "Medium" },
      { keyword: "car rental deals", position: 15, previousPosition: 18, searchVolume: 22200, difficulty: "Medium" },
      { keyword: "travel planner AI", position: 3, previousPosition: 4, searchVolume: 5400, difficulty: "Low" },
      { keyword: "find travel buddies", position: 5, previousPosition: 6, searchVolume: 3600, difficulty: "Low" }
    ];

    setTimeout(() => {
      setMetrics(mockMetrics);
      setRankings(mockRankings);
      setLoading(false);
    }, 1000);
  }, []);

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (trend === 'down') return <TrendingDown className="w-4 h-4 text-red-500" />;
    return <div className="w-4 h-4" />;
  };

  const getPositionChange = (current: number, previous: number) => {
    const change = previous - current; // Positive means improvement (lower position number)
    if (change > 0) return { icon: <TrendingUp className="w-3 h-3 text-green-500" />, color: "text-green-500" };
    if (change < 0) return { icon: <TrendingDown className="w-3 h-3 text-red-500" />, color: "text-red-500" };
    return { icon: null, color: "text-muted-foreground" };
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Low': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'High': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">SEO Performance Dashboard</h1>
          <p className="text-muted-foreground">Monitor your search engine optimization metrics and rankings</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <ExternalLink className="w-4 h-4 mr-2" />
            Google Search Console
          </Button>
          <Button variant="outline" size="sm">
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Key Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {metrics.map((metric, index) => (
            <Card key={index}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">{metric.name}</CardTitle>
                  {getTrendIcon(metric.trend)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                <div className="flex items-center text-sm">
                  <span className={`${metric.change > 0 ? 'text-green-500' : metric.change < 0 ? 'text-red-500' : 'text-muted-foreground'}`}>
                    {metric.change > 0 ? '+' : ''}{metric.change}%
                  </span>
                  <span className="text-muted-foreground ml-1">vs last month</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">{metric.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Keyword Rankings */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Keyword Rankings</h2>
        <Card>
          <CardHeader>
            <CardTitle>Top Keywords Performance</CardTitle>
            <CardDescription>Current search engine rankings for target keywords</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left">
                    <th className="pb-2 font-medium">Keyword</th>
                    <th className="pb-2 font-medium">Position</th>
                    <th className="pb-2 font-medium">Change</th>
                    <th className="pb-2 font-medium">Search Volume</th>
                    <th className="pb-2 font-medium">Difficulty</th>
                  </tr>
                </thead>
                <tbody>
                  {rankings.map((rank, index) => {
                    const change = getPositionChange(rank.position, rank.previousPosition);
                    return (
                      <tr key={index} className="border-b">
                        <td className="py-3 font-medium">{rank.keyword}</td>
                        <td className="py-3">
                          <Badge variant="outline">#{rank.position}</Badge>
                        </td>
                        <td className="py-3">
                          <div className="flex items-center gap-1">
                            {change.icon}
                            <span className={change.color}>
                              {rank.previousPosition - rank.position > 0 ? '+' : ''}
                              {rank.previousPosition - rank.position}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 text-muted-foreground">
                          {rank.searchVolume.toLocaleString()}/mo
                        </td>
                        <td className="py-3">
                          <Badge className={getDifficultyColor(rank.difficulty)}>
                            {rank.difficulty}
                          </Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <Search className="w-8 h-8 mx-auto mb-2 text-primary" />
              <h3 className="font-medium">Search Console</h3>
              <p className="text-sm text-muted-foreground">View search performance</p>
            </CardContent>
          </Card>
          
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <Eye className="w-8 h-8 mx-auto mb-2 text-primary" />
              <h3 className="font-medium">Core Web Vitals</h3>
              <p className="text-sm text-muted-foreground">Check page speed</p>
            </CardContent>
          </Card>
          
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <MousePointer className="w-8 h-8 mx-auto mb-2 text-primary" />
              <h3 className="font-medium">Click Data</h3>
              <p className="text-sm text-muted-foreground">Analyze click patterns</p>
            </CardContent>
          </Card>
          
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <Clock className="w-8 h-8 mx-auto mb-2 text-primary" />
              <h3 className="font-medium">Schedule Report</h3>
              <p className="text-sm text-muted-foreground">Automated reporting</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
