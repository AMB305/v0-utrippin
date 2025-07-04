import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  DollarSign, 
  Info, 
  Download, 
  Share2,
  Star,
  Utensils,
  Camera,
  Building
} from 'lucide-react';

export default function ItineraryDisplay({ itinerary }) {
  if (!itinerary) return null;

  const getActivityIcon = (activity) => {
    const activityLower = activity.toLowerCase();
    if (activityLower.includes('restaurant') || activityLower.includes('dinner') || activityLower.includes('food')) {
      return Utensils;
    } else if (activityLower.includes('museum') || activityLower.includes('temple') || activityLower.includes('palace')) {
      return Building;
    } else if (activityLower.includes('tower') || activityLower.includes('view') || activityLower.includes('cruise')) {
      return Camera;
    }
    return MapPin;
  };

  const getDayColor = (dayNum) => {
    const colors = [
      'from-blue-500 to-blue-600',
      'from-green-500 to-green-600', 
      'from-purple-500 to-purple-600'
    ];
    return colors[(dayNum - 1) % colors.length];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-[#0068EF] to-[#0055A5] text-white border-0">
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-bold mb-2">{itinerary.destination}</h2>
              <p className="text-blue-100 mb-4">{itinerary.summary}</p>
            </div>
            <Badge className="bg-white/20 text-white">
              <Star className="h-4 w-4 mr-1" />
              AI Optimized
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              <div>
                <div className="font-semibold">Best Time</div>
                <div className="text-blue-100">{itinerary.bestTimeToVisit}</div>
              </div>
            </div>
            <div className="flex items-center">
              <DollarSign className="h-4 w-4 mr-2" />
              <div>
                <div className="font-semibold">Daily Budget</div>
                <div className="text-blue-100">{itinerary.estimatedBudget}</div>
              </div>
            </div>
            <div className="flex items-center">
              <Info className="h-4 w-4 mr-2" />
              <div>
                <div className="font-semibold">Currency</div>
                <div className="text-blue-100">{itinerary.currency}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Travel Tips */}
      <Card className="border-2 border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center text-[#003C8A]">
            <Info className="h-5 w-5 mr-2" />
            💡 Travel Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {itinerary.travelTips.map((tip, idx) => (
              <li key={idx} className="flex items-start">
                <span className="w-2 h-2 bg-[#0068EF] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span className="text-sm text-gray-700">{tip}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Daily Itinerary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {itinerary.days.map((day) => {
          const dayColor = getDayColor(day.day);
          return (
            <Card key={day.day} className="border-2 border-gray-200 hover:border-[#0068EF] transition-all shadow-lg">
              <CardHeader className={`bg-gradient-to-r ${dayColor} text-white`}>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Day {day.day}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-4">
                  {['morning', 'afternoon', 'evening'].map((timeOfDay) => {
                    const activity = day[timeOfDay];
                    const ActivityIcon = getActivityIcon(activity.activity);
                    
                    return (
                      <div key={timeOfDay} className="border-l-4 border-gray-200 pl-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center">
                            <ActivityIcon className="h-4 w-4 mr-2 text-gray-500" />
                            <span className="font-semibold text-sm capitalize text-[#003C8A]">
                              {timeOfDay}
                            </span>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {activity.cost}
                          </Badge>
                        </div>
                        <h4 className="font-semibold text-sm mb-1">{activity.activity}</h4>
                        <p className="text-xs text-gray-600 mb-2">{activity.description}</p>
                        <div className="flex items-center text-xs text-gray-500">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>{activity.duration}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Total Cost & Actions */}
      <Card className="border-2 border-green-200 bg-green-50">
        <CardContent className="p-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold text-[#003C8A] mb-1">Total Estimated Cost</h3>
              <p className="text-2xl font-bold text-green-600">{itinerary.totalEstimatedCost}</p>
              <p className="text-sm text-gray-600">For 3 days per person</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="border-[#0068EF] text-[#0068EF] hover:bg-blue-50">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button className="bg-[#0068EF] hover:bg-[#0055A5]">
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}