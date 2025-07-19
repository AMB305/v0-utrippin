
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Clock, DollarSign, Utensils, Camera, Info, ChevronDown, ChevronUp } from 'lucide-react';
import '@/styles/trip-planner.css';

interface TripPlanCardsProps {
  htmlContent: string;
}

const TripPlanCards: React.FC<TripPlanCardsProps> = ({ htmlContent }) => {
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  // Function to clean HTML and extract plain text
  function cleanHtmlToText(html: string): string {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    return doc.body.textContent || doc.body.innerText || '';
  }

  // Function to truncate text to first 150 words
  function truncateText(text: string, wordLimit: number = 150): { truncated: string; hasMore: boolean } {
    const words = text.split(' ');
    if (words.length <= wordLimit) {
      return { truncated: text, hasMore: false };
    }
    return {
      truncated: words.slice(0, wordLimit).join(' ') + '...',
      hasMore: true
    };
  }

  // Check if the HTML contains structured trip sections
  function hasStructuredContent(html: string): boolean {
    return html.includes('trip-header') || html.includes('trip-overview') || html.includes('trip-day-card');
  }

  // Enhanced parsing function to extract comprehensive day information from structured HTML
  function parseDayContent(html: string) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    const days: Array<{
      day: string;
      title: string;
      activities: string[];
      meals: string[];
      dailyCost: string;
      perPersonCost: string;
    }> = [];

    const dayCards = doc.querySelectorAll('.trip-day-card');
    
    dayCards.forEach((dayCard, index) => {
      const titleElement = dayCard.querySelector('.trip-day-title');
      const title = titleElement?.textContent?.trim() || `Day ${index + 1}`;
      
      const activitiesSection = dayCard.querySelector('.trip-activities ul');
      const activities: string[] = [];
      if (activitiesSection) {
        const activityItems = activitiesSection.querySelectorAll('li');
        activityItems.forEach(item => {
          const text = item.textContent?.trim();
          if (text) activities.push(text);
        });
      }

      const mealsSection = dayCard.querySelector('.trip-dining ul');
      const meals: string[] = [];
      if (mealsSection) {
        const mealItems = mealsSection.querySelectorAll('li');
        mealItems.forEach(item => {
          const text = item.textContent?.trim();
          if (text) meals.push(text);
        });
      }

      const dailyCost = calculateDailyCost(activities, meals);
      const perPersonCost = calculatePerPersonCost(dailyCost);

      days.push({
        day: `Day ${index + 1}`,
        title,
        activities,
        meals,
        dailyCost,
        perPersonCost
      });
    });

    if (days.length === 0) {
      return extractDaysFromCostBreakdown(doc);
    }

    return days;
  }

  function calculateDailyCost(activities: string[], meals: string[]): string {
    let totalCost = 0;
    
    activities.forEach(activity => {
      const lowerActivity = activity.toLowerCase();
      if (lowerActivity.includes('museum') || lowerActivity.includes('cathedral')) {
        totalCost += 200;
      } else if (lowerActivity.includes('safari') || lowerActivity.includes('northern lights')) {
        totalCost += 800;
      } else if (lowerActivity.includes('sauna') || lowerActivity.includes('visit')) {
        totalCost += 300;
      } else {
        totalCost += 150;
      }
    });

    meals.forEach(meal => {
      const lowerMeal = meal.toLowerCase();
      if (lowerMeal.includes('dinner') && lowerMeal.includes('restaurant')) {
        totalCost += 400;
      } else if (lowerMeal.includes('lunch')) {
        totalCost += 250;
      } else if (lowerMeal.includes('breakfast')) {
        totalCost += 150;
      }
    });

    return `$${totalCost}`;
  }

  function calculatePerPersonCost(dailyCost: string): string {
    // Extract cost and convert any currency symbol to USD
    const costStr = dailyCost.replace(/[€£¥]/g, '$').replace(/[^\d$]/g, '');
    const cost = parseInt(costStr.replace('$', '')) || 250;
    // Assuming 2 people per trip for per-person calculation
    const perPerson = Math.round(cost / 2);
    return `$${perPerson}`;
  }

  function extractDaysFromCostBreakdown(doc: Document) {
    const cleanText = doc.body.textContent || '';
    const days: Array<{
      day: string;
      title: string;
      activities: string[];
      meals: string[];
      dailyCost: string;
      perPersonCost: string;
    }> = [];

    const sentences = cleanText.split(/[.!?]+/).filter(s => s.trim().length > 20);
    const numDays = Math.min(Math.max(3, Math.floor(sentences.length / 10)), 5);
    
    for (let i = 0; i < numDays; i++) {
      const startIdx = Math.floor((sentences.length / numDays) * i);
      const endIdx = Math.floor((sentences.length / numDays) * (i + 1));
      const daySentences = sentences.slice(startIdx, endIdx);
      
      const activities = daySentences
        .filter(s => s.toLowerCase().includes('visit') || s.toLowerCase().includes('explore') || s.toLowerCase().includes('tour'))
        .slice(0, 4);
      
      const meals = [
        'Breakfast: Local restaurant',
        'Lunch: Traditional cuisine',
        'Dinner: Recommended restaurant'
      ];

      const dailyCost = `$${250 + i * 50}`;
      const perPersonCost = `$${25 + i * 5}`;

      days.push({
        day: `Day ${i + 1}`,
        title: `Day ${i + 1} - ${getDayTheme(i)}`,
        activities: activities.length > 0 ? activities : [`Explore local attractions`, `Cultural activities`, `Evening entertainment`],
        meals,
        dailyCost,
        perPersonCost
      });
    }
    
    return days;
  }

  function getDayTheme(dayIndex: number): string {
    const themes = ['Historic Center', 'Cultural Immersion', 'Adventure Activities', 'Local Markets', 'Final Exploration'];
    return themes[dayIndex] || 'Explore & Discover';
  }

  // Extract sections from HTML for structured display
  function extractTripSections(html: string) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    return {
      header: doc.querySelector('.trip-header')?.outerHTML || '',
      overview: doc.querySelector('.trip-overview')?.outerHTML || '',
      transport: doc.querySelector('.trip-transport')?.outerHTML || '',
      accommodation: doc.querySelector('.trip-accommodation')?.outerHTML || '',
      costBreakdown: doc.querySelector('.trip-cost-breakdown')?.outerHTML || '',
      tips: doc.querySelector('.trip-tips')?.outerHTML || '',
      bookingLinks: doc.querySelector('.trip-booking-links')?.outerHTML || ''
    };
  }

  // Enhanced overview rendering with expandable description
  function renderTripOverview(overviewHtml: string) {
    if (!overviewHtml) return null;

    const parser = new DOMParser();
    const doc = parser.parseFromString(overviewHtml, 'text/html');
    const overviewElement = doc.querySelector('.trip-overview');
    
    if (!overviewElement) return null;

    // Extract the description paragraph
    const descriptionParagraph = overviewElement.querySelector('p');
    const description = descriptionParagraph?.textContent?.trim() || '';
    
    if (!description) return <div dangerouslySetInnerHTML={{ __html: overviewHtml }} />;

    const { truncated, hasMore } = truncateText(description);

    return (
      <div className="trip-overview">
        <h2 className="trip-section-title">Trip Overview</h2>
        <div className="font-display text-lg leading-relaxed text-gray-800 mb-6">
          {isDescriptionExpanded ? description : truncated}
          {hasMore && (
            <button
              onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
              className="ml-2 inline-flex items-center gap-1 text-travel-blue hover:text-travel-blue-dark transition-colors font-medium"
            >
              {isDescriptionExpanded ? (
                <>
                  Show Less <ChevronUp className="w-4 h-4" />
                </>
              ) : (
                <>
                  Show More <ChevronDown className="w-4 h-4" />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    );
  }

  // If the content has structured sections, render them with day cards
  if (hasStructuredContent(htmlContent)) {
    const sections = extractTripSections(htmlContent);
    const days = parseDayContent(htmlContent);
    
    return (
      <div className="trip-container">
        {/* Trip Header */}
        {sections.header && <div dangerouslySetInnerHTML={{ __html: sections.header }} />}
        
        {/* Combined Trip Info Section */}
        <div className="trip-info-section">
          {/* Enhanced Trip Overview with expandable description */}
          {sections.overview && renderTripOverview(sections.overview)}
          
          {/* Transport */}
          {sections.transport && <div dangerouslySetInnerHTML={{ __html: sections.transport }} />}
          
          {/* Accommodation */}
          {sections.accommodation && <div dangerouslySetInnerHTML={{ __html: sections.accommodation }} />}
          
          {/* Booking Links */}
          {sections.bookingLinks && <div dangerouslySetInnerHTML={{ __html: sections.bookingLinks }} />}
        </div>
        
        {/* Cost Breakdown */}
        {sections.costBreakdown && <div dangerouslySetInnerHTML={{ __html: sections.costBreakdown }} />}
        
        {/* Day Cards - Fixed 3-column grid */}
        <div className="grid grid-cols-3 gap-6 mt-8">
          {days.map((day, index) => (
            <Card key={index} className="bg-white/95 backdrop-blur-sm shadow-2xl border border-white/20 overflow-hidden flex flex-col">
              <CardHeader className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white h-20 flex items-center justify-center">
                <CardTitle className="flex items-center gap-2 text-xl w-full">
                  <Clock className="w-5 h-5 text-amber-300 flex-shrink-0" />
                  <span className="line-clamp-2 text-center flex-1 leading-tight">
                    {day.title}
                  </span>
                </CardTitle>
              </CardHeader>
              
              <CardContent className="p-6 space-y-6 flex-1 flex flex-col">
                {/* Activities Section */}
                <div className="flex-1">
                  <h4 className="font-semibold text-travel-navy mb-3 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Timeline
                  </h4>
                  <div className="space-y-2">
                    {day.activities.map((activity, actIndex) => (
                      <div key={actIndex} className="border-l-2 border-emerald-500 pl-4">
                        <p className="text-sm text-gray-700">{activity}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Meals Section */}
                <div className="flex-1">
                  <h4 className="font-semibold text-travel-navy mb-3 flex items-center gap-2">
                    <Utensils className="w-4 h-4" />
                    Dining Experiences
                  </h4>
                  <div className="space-y-2">
                    {day.meals.map((meal, mealIndex) => (
                      <div key={mealIndex} className="bg-gray-50 rounded-lg p-3">
                        <p className="text-sm text-gray-700">{meal}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Cost Section - Fixed at Bottom */}
                <div className="pt-4 border-t border-gray-200 mt-auto">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-travel-navy flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      Estimated Daily Cost
                    </span>
                    <span className="text-lg font-bold text-emerald-600">{day.dailyCost}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Per Person</span>
                    <span className="text-lg font-bold text-amber-600">{day.perPersonCost}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Tips - Moved after day cards */}
        {sections.tips && <div dangerouslySetInnerHTML={{ __html: sections.tips }} />}
      </div>
    );
  }

  // Fallback to original day card rendering
  const days = parseDayContent(htmlContent);

  if (days.length === 0) {
    // If no structured data found, display clean text content with expandable description
    const cleanText = cleanHtmlToText(htmlContent);
    const { truncated, hasMore } = truncateText(cleanText);
    
    return (
      <div className="rounded-2xl shadow-2xl border border-white/20 overflow-hidden bg-white/95 backdrop-blur-sm">
        <div className="p-6 sm:p-8">
          <div className="font-display text-lg leading-relaxed text-gray-800 whitespace-pre-line">
            {isDescriptionExpanded ? cleanText : truncated}
            {hasMore && (
              <button
                onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                className="ml-2 inline-flex items-center gap-1 text-travel-blue hover:text-travel-blue-dark transition-colors font-medium mt-2"
              >
                {isDescriptionExpanded ? (
                  <>
                    Show Less <ChevronUp className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    Show More <ChevronDown className="w-4 h-4" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-6">
      {days.map((day, index) => (
        <Card key={index} className="bg-white/95 backdrop-blur-sm shadow-2xl border border-white/20 overflow-hidden flex flex-col">
          <CardHeader className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white h-20 flex items-center justify-center">
            <CardTitle className="flex items-center gap-2 text-xl w-full">
              <Clock className="w-5 h-5 text-amber-300 flex-shrink-0" />
              <span className="line-clamp-2 text-center flex-1 leading-tight">
                {day.title}
              </span>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-6 space-y-6 flex-1 flex flex-col">
            {/* Activities Section */}
            <div className="flex-1">
              <h4 className="font-semibold text-travel-navy mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Timeline
              </h4>
              <div className="space-y-2">
                {day.activities.map((activity, actIndex) => (
                  <div key={actIndex} className="border-l-2 border-emerald-500 pl-4">
                    <p className="text-sm text-gray-700">{activity}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Meals Section */}
            <div className="flex-1">
              <h4 className="font-semibold text-travel-navy mb-3 flex items-center gap-2">
                <Utensils className="w-4 h-4" />
                Dining Experiences
              </h4>
              <div className="space-y-2">
                {day.meals.map((meal, mealIndex) => (
                  <div key={mealIndex} className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm text-gray-700">{meal}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Cost Section - Fixed at Bottom */}
            <div className="pt-4 border-t border-gray-200 mt-auto">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-travel-navy flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Estimated Daily Cost
                </span>
                <span className="text-lg font-bold text-emerald-600">{day.dailyCost}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Per Person</span>
                <span className="text-lg font-bold text-amber-600">{day.perPersonCost}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default TripPlanCards;
