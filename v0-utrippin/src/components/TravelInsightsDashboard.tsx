import React from 'react';
import { TrendingUp, Users, Clock, MapPin, Star, Calendar } from 'lucide-react';

interface TravelInsight {
  title: string;
  value: string;
  trend: string;
  icon: React.ReactNode;
  color: string;
}

interface TravelInsightsDashboardProps {
  destinations: any[];
  userActivity?: {
    favoriteCount: number;
    viewedCount: number;
    ratedCount: number;
  };
}

export const TravelInsightsDashboard = ({ destinations, userActivity }: TravelInsightsDashboardProps) => {
  const insights: TravelInsight[] = [
    {
      title: 'Most Popular Destinations',
      value: 'Beach & Island',
      trend: '+23% this month',
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'text-blue-400'
    },
    {
      title: 'Average Trip Duration',
      value: '7.2 days',
      trend: '+1.5 days vs last year',
      icon: <Clock className="w-6 h-6" />,
      color: 'text-green-400'
    },
    {
      title: 'Peak Travel Season',
      value: 'March - May',
      trend: 'Best weather & deals',
      icon: <Calendar className="w-6 h-6" />,
      color: 'text-purple-400'
    },
    {
      title: 'User Engagement',
      value: `${userActivity?.favoriteCount || 0} Favorites`,
      trend: `${userActivity?.viewedCount || 0} destinations viewed`,
      icon: <Star className="w-6 h-6" />,
      color: 'text-yellow-400'
    },
    {
      title: 'Top Destination Type',
      value: 'Cultural Cities',
      trend: '42% of all bookings',
      icon: <MapPin className="w-6 h-6" />,
      color: 'text-red-400'
    },
    {
      title: 'Community Size',
      value: '50K+ Travelers',
      trend: '+12% growth this quarter',
      icon: <Users className="w-6 h-6" />,
      color: 'text-cyan-400'
    }
  ];

  const topDestinations = [
    { name: 'Santorini, Greece', popularity: 95, bookings: 1240 },
    { name: 'Bali, Indonesia', popularity: 92, bookings: 1180 },
    { name: 'Paris, France', popularity: 89, bookings: 1050 },
    { name: 'Tokyo, Japan', popularity: 87, bookings: 980 },
    { name: 'Dubai, UAE', popularity: 84, bookings: 920 }
  ];

  const travelTrends = [
    { category: 'Solo Travel', percentage: 34, change: '+8%' },
    { category: 'Sustainable Tourism', percentage: 28, change: '+15%' },
    { category: 'Digital Nomad', percentage: 22, change: '+25%' },
    { category: 'Adventure Travel', percentage: 19, change: '+5%' },
    { category: 'Wellness Retreats', percentage: 16, change: '+12%' }
  ];

  return (
    <div className="space-y-8">
      {/* Main Insights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {insights.map((insight, index) => (
          <div
            key={index}
            className="bg-slate-800/50 border border-blue-500/20 rounded-2xl p-6 hover:bg-slate-800/70 transition-colors"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`${insight.color}`}>
                {insight.icon}
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-white">{insight.value}</p>
                <p className="text-xs text-green-400">{insight.trend}</p>
              </div>
            </div>
            <h3 className="text-slate-300 font-medium">{insight.title}</h3>
          </div>
        ))}
      </div>

      {/* Detailed Analytics */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Top Destinations */}
        <div className="bg-slate-800/30 border border-purple-500/20 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-400" />
            Top Destinations This Month
          </h3>
          <div className="space-y-4">
            {topDestinations.map((dest, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-white font-medium">{dest.name}</p>
                    <p className="text-xs text-slate-400">{dest.bookings} bookings</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-purple-400 font-bold">{dest.popularity}%</p>
                  <div className="w-16 bg-slate-700 rounded-full h-2 mt-1">
                    <div
                      className="bg-purple-400 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${dest.popularity}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Travel Trends */}
        <div className="bg-slate-800/30 border border-green-500/20 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Users className="w-5 h-5 text-green-400" />
            Emerging Travel Trends
          </h3>
          <div className="space-y-4">
            {travelTrends.map((trend, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-white font-medium">{trend.category}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-green-400 text-sm font-bold">{trend.change}</span>
                    <span className="text-slate-300">{trend.percentage}%</span>
                  </div>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div
                    className="bg-green-400 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${trend.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Stats Bar */}
      <div className="bg-gradient-to-r from-slate-800/50 to-blue-900/30 border border-blue-500/20 rounded-2xl p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <p className="text-3xl font-bold text-blue-400">{destinations.length}+</p>
            <p className="text-slate-400 text-sm">Destinations</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-green-400">4.8★</p>
            <p className="text-slate-400 text-sm">Avg Rating</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-purple-400">2.5M+</p>
            <p className="text-slate-400 text-sm">Happy Travelers</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-yellow-400">24/7</p>
            <p className="text-slate-400 text-sm">AI Support</p>
          </div>
        </div>
      </div>
    </div>
  );
};
