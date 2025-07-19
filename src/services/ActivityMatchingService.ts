import { experiencesData } from '@/data/utrippin_experiences';

export interface Activity {
  title: string;
  location: string;
  price: string;
  image: string;
  description: string;
  bookingUrl: string;
}

export class ActivityMatchingService {
  private static getLocationKeywords(destination: string): string[] {
    const dest = destination.toLowerCase();
    const keywords: string[] = [];
    
    // Parse destination to extract city and country/state
    const parts = dest.split(',').map(p => p.trim());
    const city = parts[0];
    const countryOrState = parts[1];
    
    // Enhanced international destination support
    if (city.includes('cancun')) {
      keywords.push('cancun', 'riviera maya', 'yucatan', 'playa del carmen', 'tulum', 'cozumel');
    } else if (city.includes('rome')) {
      keywords.push('rome', 'vatican', 'colosseum', 'trevi fountain', 'spanish steps');
    } else if (city.includes('paris')) {
      keywords.push('paris', 'eiffel tower', 'louvre', 'champs elysees', 'notre dame');
    } else if (city.includes('london')) {
      keywords.push('london', 'big ben', 'tower bridge', 'buckingham palace');
    } else if (city.includes('tokyo')) {
      keywords.push('tokyo', 'shibuya', 'shinjuku', 'harajuku', 'tsukiji');
    } else if (city.includes('washington')) {
      if (countryOrState?.includes('dc') || dest.includes('dc') || dest.includes('d.c.')) {
        // Washington D.C. - the capital
        keywords.push('washington dc', 'dc', 'd.c.', 'capitol', 'potomac', 'smithsonian');
      } else if (countryOrState?.includes('washington') || (!countryOrState && !dest.includes('dc'))) {
        // Washington State - prioritize Seattle
        keywords.push('seattle', 'washington state', 'pacific northwest', 'puget sound');
      }
    } else {
      // Add primary city keyword first for highest priority
      keywords.push(city);
      
      // Add specific city variations for US cities
      if (city.includes('new york')) {
        keywords.push('nyc', 'manhattan', 'brooklyn', 'times square');
      } else if (city.includes('los angeles')) {
        keywords.push('la', 'hollywood', 'beverly hills', 'santa monica');
      } else if (city.includes('san francisco')) {
        keywords.push('sf', 'bay area', 'golden gate');
      } else if (city.includes('las vegas')) {
        keywords.push('vegas', 'nevada', 'strip');
      } else if (city.includes('miami')) {
        keywords.push('south beach', 'florida');
      } else if (city.includes('chicago')) {
        keywords.push('illinois', 'windy city');
      } else if (city.includes('seattle')) {
        keywords.push('washington', 'pacific northwest', 'pike place');
      }
    }
    
    // Add country/state context for international filtering
    if (countryOrState) {
      keywords.push(countryOrState);
    }
    
    return [...new Set(keywords)];
  }

  static findActivitiesForDestination(destination: string, maxResults: number = 6): Activity[] {
    const keywords = this.getLocationKeywords(destination);
    const dest = destination.toLowerCase();
    const matchedActivities: { activity: Activity; score: number }[] = [];

    experiencesData.forEach(experience => {
      let score = 0;
      const activityLocation = experience.location.toLowerCase();
      const activityTitle = experience.title.toLowerCase();
      const activityText = `${activityTitle} ${activityLocation} ${experience.description}`.toLowerCase();

      // High priority: Exact city match (primary keyword)
      const primaryKeyword = keywords[0];
      if (primaryKeyword && activityText.includes(primaryKeyword)) {
        score += 100;
      }

      // Medium priority: Other specific keywords
      keywords.slice(1).forEach((keyword, index) => {
        if (activityText.includes(keyword)) {
          score += 50 - (index * 5); // Decreasing score for later keywords
        }
      });

      // Geographic filtering with enhanced negative scoring
      if (dest.includes('cancun') || dest.includes('mexico')) {
        // For Mexico destinations, heavily penalize non-Mexico activities
        if (activityText.includes('oregon') || activityText.includes('denver') || 
            activityText.includes('utah') || activityText.includes('seattle') ||
            activityText.includes('washington') || activityText.includes('california') ||
            activityText.includes('florida') || activityText.includes('temple square') ||
            activityText.includes('lighthouse')) {
          score -= 300;
        }
      } else if (dest.includes('washington') && (dest.includes('dc') || dest.includes('d.c.'))) {
        // For DC queries, heavily penalize Seattle/Washington state activities
        if (activityText.includes('seattle') || activityText.includes('pike place') || 
            (activityText.includes('washington') && !activityText.includes('dc')) ||
            activityText.includes('cannabis') || activityText.includes('lighthouse')) {
          score -= 300;
        }
      } else if (dest.includes('seattle') || (dest.includes('washington') && !dest.includes('dc'))) {
        // For Seattle queries, penalize DC and other city activities
        if (activityText.includes('capitol') || activityText.includes('smithsonian') || 
            activityText.includes('dc') || activityText.includes('d.c.') ||
            activityText.includes('denver') || activityText.includes('utah') ||
            activityText.includes('cancun') || activityText.includes('mexico')) {
          score -= 300;
        }
      }

      if (score > 0) {
        matchedActivities.push({
          activity: experience,
          score
        });
      }
    });

    // Sort by score and return top results, only include positive scores
    const filteredActivities = matchedActivities
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, maxResults)
      .map(item => item.activity);

    return filteredActivities;
  }

  static generateDayByDayItinerary(destination: string, duration: string, activities: Activity[]): any[] {
    const durationMatch = duration.match(/(\d+)/);
    const days = durationMatch ? parseInt(durationMatch[1]) : 5;
    
    const itinerary = [];
    
    for (let day = 1; day <= Math.min(days, 7); day++) {
      const dayActivities = activities.slice((day - 1) * 2, day * 2);
      
      if (day === 1) {
        itinerary.push({
          day,
          title: `Day ${day}: Arrival & Welcome`,
          morning: {
            time: '9:00 AM',
            activity: 'Hotel check-in & city orientation',
            description: 'Settle into your accommodation and get oriented with the city'
          },
          afternoon: {
            time: '2:00 PM',
            activity: dayActivities[0]?.title || 'Local exploration',
            description: dayActivities[0]?.description || 'Explore the local neighborhood and get a feel for the city',
            price: dayActivities[0]?.price || 'Free',
            bookingUrl: dayActivities[0]?.bookingUrl
          },
          evening: {
            time: '7:00 PM',
            activity: 'Welcome dinner',
            description: 'Enjoy local cuisine at a recommended restaurant',
            price: '$40-80 per person'
          }
        });
      } else if (day === days) {
        itinerary.push({
          day,
          title: `Day ${day}: Final Day & Departure`,
          morning: {
            time: '10:00 AM',
            activity: dayActivities[0]?.title || 'Last-minute shopping',
            description: dayActivities[0]?.description || 'Pick up souvenirs and local specialties',
            price: dayActivities[0]?.price || '$20-50',
            bookingUrl: dayActivities[0]?.bookingUrl
          },
          afternoon: {
            time: '2:00 PM',
            activity: 'Hotel checkout & departure preparation',
            description: 'Pack up and prepare for your journey home'
          },
          evening: {
            time: '6:00 PM',
            activity: 'Departure',
            description: 'Head to airport or train station for your journey home'
          }
        });
      } else {
        itinerary.push({
          day,
          title: `Day ${day}: Adventure & Discovery`,
          morning: {
            time: '9:00 AM',
            activity: dayActivities[0]?.title || 'Morning exploration',
            description: dayActivities[0]?.description || 'Start your day with exciting activities',
            price: dayActivities[0]?.price || '$30-60',
            bookingUrl: dayActivities[0]?.bookingUrl
          },
          afternoon: {
            time: '2:00 PM',
            activity: dayActivities[1]?.title || 'Afternoon adventure',
            description: dayActivities[1]?.description || 'Continue exploring with afternoon activities',
            price: dayActivities[1]?.price || '$40-80',
            bookingUrl: dayActivities[1]?.bookingUrl
          },
          evening: {
            time: '7:00 PM',
            activity: 'Local dining experience',
            description: 'Discover local flavors and nightlife',
            price: '$35-70 per person'
          }
        });
      }
    }

    return itinerary;
  }

  static getRestaurantRecommendations(destination: string, budgetLevel: 'Budget' | 'Standard' | 'Premium') {
    const priceRanges = {
      Budget: '$-$$',
      Standard: '$$-$$$',
      Premium: '$$$-$$$$'
    };

    return {
      priceRange: priceRanges[budgetLevel],
      recommendations: [
        'Check local food apps for highly-rated restaurants',
        'Ask hotel concierge for authentic local recommendations',
        'Explore food markets and street food scenes',
        'Make reservations in advance for popular spots'
      ]
    };
  }
}