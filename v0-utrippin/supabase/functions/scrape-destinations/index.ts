import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ScrapedDestination {
  name: string;
  country: string;
  description: string;
  category: string;
  latitude?: number;
  longitude?: number;
  imageUrl?: string;
  slug: string;
}

interface CategoryConfig {
  name: string;
  wikivoyageQueries: string[];
  searchTerms: string[];
}

const categories: Record<string, CategoryConfig> = {
  'Religious': {
    name: 'Religious',
    wikivoyageQueries: ['pilgrimage', 'religious sites', 'temples', 'churches', 'mosques'],
    searchTerms: ['vatican', 'jerusalem', 'mecca', 'varanasi', 'tibet', 'mount kailash', 'santiago de compostela', 'angkor wat']
  },
  'Cultural': {
    name: 'Cultural',
    wikivoyageQueries: ['cultural heritage', 'museums', 'art galleries', 'traditional culture'],
    searchTerms: ['kyoto', 'florence', 'cairo', 'istanbul', 'cusco', 'fez', 'luang prabang', 'bhutan']
  },
  'Nature': {
    name: 'Nature',
    wikivoyageQueries: ['national parks', 'wildlife', 'nature reserves', 'biodiversity'],
    searchTerms: ['yellowstone', 'serengeti', 'amazon', 'great barrier reef', 'galápagos', 'costa rica', 'norway fjords', 'madagascar']
  },
  'Food': {
    name: 'Food',
    wikivoyageQueries: ['culinary destinations', 'food culture', 'gastronomy'],
    searchTerms: ['tokyo', 'paris', 'bangkok', 'istanbul', 'lima', 'mumbai', 'barcelona', 'hanoi']
  },
  'Festivals': {
    name: 'Festivals',
    wikivoyageQueries: ['festivals', 'celebrations', 'cultural events'],
    searchTerms: ['rio de janeiro', 'edinburgh', 'holi india', 'oktoberfest munich', 'burning man', 'day of the dead mexico', 'cherry blossom japan']
  },
  'Historical': {
    name: 'Historical',
    wikivoyageQueries: ['historical sites', 'ancient monuments', 'heritage sites'],
    searchTerms: ['rome', 'athens', 'petra', 'machu picchu', 'great wall china', 'pyramids egypt', 'stonehenge', 'angkor']
  },
  'Shopping': {
    name: 'Shopping',
    wikivoyageQueries: ['shopping districts', 'markets', 'bazaars'],
    searchTerms: ['dubai', 'hong kong', 'milan', 'istanbul grand bazaar', 'marrakech', 'singapore', 'bangkok chatuchak', 'tokyo']
  },
  'Beaches': {
    name: 'Beaches',
    wikivoyageQueries: ['beaches', 'coastal destinations', 'islands'],
    searchTerms: ['maldives', 'bora bora', 'santorini', 'bali', 'hawaii', 'seychelles', 'mauritius', 'caribbean']
  },
  'Mountains': {
    name: 'Mountains',
    wikivoyageQueries: ['mountains', 'alpine destinations', 'hiking'],
    searchTerms: ['everest', 'alps', 'andes', 'himalayas', 'rocky mountains', 'patagonia', 'kilimanjaro', 'mont blanc']
  },
  'Outdoors': {
    name: 'Outdoors',
    wikivoyageQueries: ['outdoor activities', 'adventure sports', 'trekking'],
    searchTerms: ['new zealand', 'patagonia', 'nepal', 'canada', 'norway', 'iceland', 'colorado', 'queenstown']
  },
  'Nightlife': {
    name: 'Nightlife',
    wikivoyageQueries: ['nightlife', 'entertainment', 'clubs'],
    searchTerms: ['berlin', 'ibiza', 'las vegas', 'bangkok', 'amsterdam', 'rio de janeiro', 'miami', 'tel aviv']
  },
  'Luxury': {
    name: 'Luxury',
    wikivoyageQueries: ['luxury destinations', 'high-end travel', 'premium resorts'],
    searchTerms: ['monaco', 'swiss alps', 'napa valley', 'aspen', 'dubai', 'singapore', 'maldives resorts', 'french riviera']
  },
  'Romance': {
    name: 'Romance',
    wikivoyageQueries: ['romantic destinations', 'honeymoon spots'],
    searchTerms: ['paris', 'venice', 'santorini', 'bali', 'maldives', 'tuscany', 'prague', 'kyoto']
  },
  'NightSkies': {
    name: 'NightSkies',
    wikivoyageQueries: ['stargazing', 'astronomy', 'dark sky'],
    searchTerms: ['atacama desert', 'mauna kea', 'aurora borealis', 'namibia', 'easter island', 'dark sky parks', 'northern lights']
  },
  'Sports': {
    name: 'Sports',
    wikivoyageQueries: ['sports destinations', 'sporting events', 'adventure sports'],
    searchTerms: ['olympic venues', 'world cup', 'ski resorts', 'surfing spots', 'golf destinations', 'tennis tournaments']
  },
  'Wellness': {
    name: 'Wellness',
    wikivoyageQueries: ['wellness retreats', 'spa destinations', 'health tourism'],
    searchTerms: ['bali wellness', 'india ayurveda', 'iceland blue lagoon', 'costa rica yoga', 'thailand spa', 'switzerland wellness']
  },
  'Family': {
    name: 'Family',
    wikivoyageQueries: ['family destinations', 'kid-friendly', 'theme parks'],
    searchTerms: ['disney world', 'legoland', 'universal studios', 'family resorts', 'zoos', 'aquariums', 'interactive museums']
  },
  'Solo': {
    name: 'Solo',
    wikivoyageQueries: ['solo travel', 'backpacking', 'independent travel'],
    searchTerms: ['hostels', 'solo-friendly destinations', 'safe solo travel', 'backpacker routes', 'digital nomad', 'coworking spaces']
  },
  'Offbeat': {
    name: 'Offbeat',
    wikivoyageQueries: ['hidden gems', 'off the beaten path', 'undiscovered destinations'],
    searchTerms: ['socotra island', 'faroe islands', 'bhutan', 'albania', 'georgia country', 'madagascar', 'solomon islands']
  },
  'Melanin': {
    name: 'Melanin',
    wikivoyageQueries: ['black travel', 'african diaspora', 'cultural heritage'],
    searchTerms: ['ghana', 'senegal', 'ethiopia', 'brazil salvador', 'jamaica', 'barbados', 'south africa', 'martinique']
  }
};

async function getCoordinates(location: string): Promise<{ lat?: number; lon?: number }> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json&limit=1`,
      {
        headers: {
          'User-Agent': 'TravelApp/1.0'
        }
      }
    );
    
    const data = await response.json();
    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lon: parseFloat(data[0].lon)
      };
    }
  } catch (error) {
    console.error(`Error getting coordinates for ${location}:`, error);
  }
  return {};
}

async function generateDestinationsForCategory(category: CategoryConfig): Promise<ScrapedDestination[]> {
  const destinations: ScrapedDestination[] = [];
  
  // Use search terms to generate destination data
  for (const searchTerm of category.searchTerms) {
    try {
      const coords = await getCoordinates(searchTerm);
      
      // Extract country and destination name
      const parts = searchTerm.split(' ');
      let name = searchTerm;
      let country = 'Unknown';
      
      // Try to identify country patterns
      if (searchTerm.includes('japan')) {
        country = 'Japan';
        name = searchTerm.replace(' japan', '');
      } else if (searchTerm.includes('india')) {
        country = 'India';
        name = searchTerm.replace(' india', '');
      } else if (searchTerm.includes('china')) {
        country = 'China';
        name = searchTerm.replace(' china', '');
      } else if (searchTerm.includes('egypt')) {
        country = 'Egypt';
        name = searchTerm.replace(' egypt', '');
      } else if (searchTerm.includes('nepal')) {
        country = 'Nepal';
        name = searchTerm.replace(' nepal', '');
      } else if (searchTerm.includes('peru')) {
        country = 'Peru';
        name = searchTerm.replace(' peru', '');
      } else if (searchTerm.includes('iceland')) {
        country = 'Iceland';
        name = searchTerm.replace(' iceland', '');
      } else if (searchTerm.includes('norway')) {
        country = 'Norway';
        name = searchTerm.replace(' norway', '');
      } else {
        // For single-word destinations, try to determine country from coords
        name = searchTerm.charAt(0).toUpperCase() + searchTerm.slice(1);
        if (coords.lat && coords.lon) {
          // Simple country mapping based on coordinates
          if (coords.lat > 35 && coords.lat < 45 && coords.lon > 100 && coords.lon < 140) country = 'Japan';
          else if (coords.lat > 20 && coords.lat < 35 && coords.lon > 70 && coords.lon < 90) country = 'India';
          else if (coords.lat > 40 && coords.lat < 50 && coords.lon > -10 && coords.lon < 10) country = 'France';
          else if (coords.lat > 40 && coords.lat < 45 && coords.lon > 10 && coords.lon < 15) country = 'Italy';
          // Add more mappings as needed
        }
      }
      
      const slug = name.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();

      destinations.push({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        country,
        description: `Discover the ${category.name.toLowerCase()} experiences that ${name} has to offer. A perfect destination for travelers seeking authentic ${category.name.toLowerCase()} adventures.`,
        category: category.name,
        latitude: coords.lat,
        longitude: coords.lon,
        imageUrl: `https://images.unsplash.com/photo-1549144511-f099e773c147?w=800&h=600&fit=crop&auto=format&q=80`,
        slug
      });
      
      // Add a small delay to be respectful to the API
      await new Promise(resolve => setTimeout(resolve, 100));
      
    } catch (error) {
      console.error(`Error processing ${searchTerm}:`, error);
    }
  }
  
  return destinations;
}

async function saveDestinationsToSupabase(destinations: ScrapedDestination[], supabase: any) {
  console.log(`Saving ${destinations.length} destinations to database...`);
  
  for (const dest of destinations) {
    try {
      // Insert destination
      const { data: destData, error: destError } = await supabase
        .from('destinations')
        .insert({
          name: dest.name,
          country: dest.country,
          description: dest.description,
          category: dest.category,
          latitude: dest.latitude,
          longitude: dest.longitude,
          img: dest.imageUrl,
          slug: dest.slug,
          featured: true,
          average_cost_per_day: Math.floor(Math.random() * 200) + 50 // Random cost between 50-250
        })
        .select()
        .single();

      if (destError) {
        console.error(`Error inserting destination ${dest.name}:`, destError);
        continue;
      }

      const destinationId = destData.id;

      // Add some sample activities
      const activities = [
        {
          destination_id: destinationId,
          title: `Explore ${dest.name}`,
          description: `Experience the best of ${dest.name} with guided tours and local insights.`,
          category: dest.category,
          duration: '2-4 hours',
          cost_range: '$20-50'
        },
        {
          destination_id: destinationId,
          title: `${dest.category} Experience`,
          description: `Immerse yourself in the local ${dest.category.toLowerCase()} scene.`,
          category: dest.category,
          duration: 'Full day',
          cost_range: '$50-100'
        }
      ];

      await supabase.from('destination_activities').insert(activities);

      // Add sample weather info
      const weatherData = [
        {
          destination_id: destinationId,
          month: 'Spring',
          temperature: '15-25°C',
          aqi: Math.floor(Math.random() * 100) + 20,
          notes: 'Pleasant weather for outdoor activities'
        },
        {
          destination_id: destinationId,
          month: 'Summer',
          temperature: '20-30°C',
          aqi: Math.floor(Math.random() * 100) + 20,
          notes: 'Warm and ideal for sightseeing'
        }
      ];

      await supabase.from('destination_weather').insert(weatherData);

      // Add visit info
      await supabase.from('destination_visit_info').insert({
        destination_id: destinationId,
        best_time: 'March to November',
        notes: `Best visited during moderate weather seasons for optimal ${dest.category.toLowerCase()} experiences.`
      });

      console.log(`✅ Saved ${dest.name} to database`);
      
    } catch (error) {
      console.error(`Error saving destination ${dest.name}:`, error);
    }
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { category, all = false } = await req.json();

    if (all) {
      console.log('🚀 Starting to scrape ALL categories...');
      let totalDestinations = 0;
      
      for (const [categoryKey, categoryConfig] of Object.entries(categories)) {
        console.log(`📍 Processing category: ${categoryConfig.name}`);
        
        const destinations = await generateDestinationsForCategory(categoryConfig);
        await saveDestinationsToSupabase(destinations, supabase);
        
        totalDestinations += destinations.length;
        console.log(`✅ Completed ${categoryConfig.name}: ${destinations.length} destinations`);
        
        // Small delay between categories
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      return new Response(JSON.stringify({
        success: true,
        message: `Successfully scraped and saved ${totalDestinations} destinations across ${Object.keys(categories).length} categories`,
        totalDestinations,
        categoriesProcessed: Object.keys(categories).length
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
      
    } else if (category && categories[category]) {
      console.log(`🚀 Starting to scrape category: ${category}`);
      
      const destinations = await generateDestinationsForCategory(categories[category]);
      await saveDestinationsToSupabase(destinations, supabase);
      
      return new Response(JSON.stringify({
        success: true,
        message: `Successfully scraped and saved ${destinations.length} destinations for ${category}`,
        destinationsCount: destinations.length,
        category
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
      
    } else {
      return new Response(JSON.stringify({
        error: 'Please provide a valid category or set all=true',
        availableCategories: Object.keys(categories)
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

  } catch (error) {
    console.error('Error in scrape-destinations function:', error);
    return new Response(JSON.stringify({
      error: error.message,
      stack: error.stack
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
