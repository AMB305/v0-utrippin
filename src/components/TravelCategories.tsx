import React from 'react';

// Image mapping for categories
const getImageForCategory = (name: string): string => {
  const imageMap: Record<string, string> = {
    'Beaches & islands': '/images/maldives-beach.jpg',
    'Arts & culture': '/images/kyoto-art-gallery.jpg',
    'Family friendly': '/images/orlando-disney.jpg',
    'Wellness & spa': '/images/tulum-spa.jpg',
    'Adventure': '/images/adventure-travel.jpg',
    'Budget travel': '/images/budget-accommodations.jpg',
    'Luxury & shopping': '/images/luxury-travel.jpg',
    'Nightlife & city': '/images/urban-destinations.jpg',
    'Wildlife & nature': '/images/nature-travel.jpg',
  };
  
  return imageMap[name] || '/images/tropical-beach-resort.jpg';
};

interface Category {
  name: string;
  destination: string;
  description: string;
  tags: string[];
  category: 'places' | 'travel' | 'event' | 'people';
  expediaUrl: string;
  seoTitle: string;
  seoDescription: string;
  featured?: boolean;
}

const categories: Category[] = [
  { 
    name: "Wildlife & nature", 
    destination: "Botswana Safari Okavango Delta",
    description: "African safari with elephants lions and wildlife in natural habitat", 
    tags: ['safari', 'wildlife', 'elephants', 'africa', 'nature'],
    category: 'places',
    expediaUrl: "https://www.expedia.com/Hotel-Search?destination=Okavango+Delta%2C+Botswana&rooms=1&adults=2&camref=1101l5dQSW",
    seoTitle: "Botswana Safari Lodges | Wildlife & Nature | UTrippin + Expedia",
    seoDescription: "Explore safari lodges in the Okavango Delta. Book wildlife adventures with Expedia, powered by UTrippin."
  },
  { 
    name: "Budget travel", 
    destination: "Bangkok Thailand",
    description: "backpacker traveler exploring street markets and temples on budget",
    tags: ['budget', 'backpacker', 'thailand', 'temples', 'street food'],
    category: 'travel',
    expediaUrl: "https://www.expedia.com/Hotel-Search?destination=Bangkok%2C+Thailand&rooms=1&adults=2&camref=1101l5dQSW",
    seoTitle: "Budget Hotels in Bangkok | UTrippin & Expedia Official",
    seoDescription: "Stay cheap in Bangkok with hostels & budget hotels. Secure deals via UTrippin + Expedia."
  },
  { 
    name: "Beaches & islands", 
    destination: "Maldives overwater villa",
    description: "pristine white sand beach with crystal clear turquoise water and palm trees",
    tags: ['beach', 'tropical', 'maldives', 'overwater', 'paradise'],
    category: 'places',
    expediaUrl: "https://www.expedia.com/Hotel-Search?destination=Maldives&rooms=1&adults=2&camref=1101l5dQSW",
    seoTitle: "Book Maldives Beach Resorts | Official UTrippin + Expedia",
    seoDescription: "Overwater villas & white sands await. Book Maldives getaways with UTrippin + Expedia."
  },
  { 
    name: "Inspired getaways", 
    destination: "Bali Indonesia",
    description: "lush tropical landscape with rice terraces and traditional temples",
    tags: ['bali', 'indonesia', 'rice terraces', 'temples', 'tropical'],
    category: 'places',
    expediaUrl: "https://www.expedia.com/Hotel-Search?destination=Bali%2C+Indonesia&rooms=1&adults=2&camref=1101l5dQSW",
    seoTitle: "Bali Resorts & Villas | Inspired Getaways | UTrippin & Expedia",
    seoDescription: "Discover Bali escapes — from Ubud to Seminyak. Book now with Expedia via UTrippin.",
    featured: true
  },
  { 
    name: "Solo travel", 
    destination: "Lisbon Portugal",
    description: "solo female traveler exploring colorful Portuguese architecture and cobblestone streets",
    tags: ['solo travel', 'portugal', 'architecture', 'female traveler', 'exploration'],
    category: 'people',
    expediaUrl: "https://www.expedia.com/Hotel-Search?destination=Lisbon%2C+Portugal&rooms=1&adults=1&camref=1101l5dQSW",
    seoTitle: "Lisbon Hotels for Solo Travelers | UTrippin + Expedia",
    seoDescription: "Safe, vibrant solo trips to Lisbon. Book boutique stays with Expedia + UTrippin."
  },
  { 
    name: "Arts & culture", 
    destination: "Kyoto Japan",
    description: "traditional Japanese temple with cherry blossoms and cultural architecture",
    tags: ['kyoto', 'japan', 'temples', 'culture', 'cherry blossoms'],
    category: 'travel',
    expediaUrl: "https://www.expedia.com/Hotel-Search?destination=Kyoto%2C+Japan&rooms=1&adults=2&camref=1101l5dQSW",
    seoTitle: "Kyoto Cultural Hotels & Ryokans | UTrippin x Expedia",
    seoDescription: "Explore shrines & cherry blossoms in Kyoto. Stay with Expedia, powered by UTrippin."
  },
  { 
    name: "Food & drink", 
    destination: "Rome Italy",
    description: "traditional Italian restaurant with authentic pasta and wine",
    tags: ['rome', 'italy', 'pasta', 'italian food', 'wine'],
    category: 'travel',
    expediaUrl: "https://www.expedia.com/Hotel-Search?destination=Rome%2C+Italy&rooms=1&adults=2&camref=1101l5dQSW",
    seoTitle: "Rome Hotels Near Best Eats | Food & Drink | UTrippin",
    seoDescription: "Pizza, pasta, gelato tours — stay in Rome with Expedia + UTrippin."
  },
  { 
    name: "Adventure", 
    destination: "Queenstown New Zealand",
    description: "extreme sports bungee jumping with stunning mountain lake scenery",
    tags: ['adventure', 'bungee jumping', 'new zealand', 'extreme sports', 'mountains'],
    category: 'travel',
    expediaUrl: "https://www.expedia.com/Hotel-Search?destination=Queenstown%2C+New+Zealand&rooms=1&adults=2&camref=1101l5dQSW",
    seoTitle: "Queenstown Adventure Hotels | Official UTrippin + Expedia",
    seoDescription: "Ski, bungee or jet boat. Book Queenstown thrills with Expedia via UTrippin."
  },
  { 
    name: "Festivals & events", 
    destination: "New Orleans Louisiana",
    description: "vibrant Mardi Gras festival celebration with colorful costumes and music",
    tags: ['mardi gras', 'new orleans', 'festival', 'music', 'celebration'],
    category: 'event',
    expediaUrl: "https://www.expedia.com/Hotel-Search?destination=New+Orleans%2C+Louisiana&rooms=1&adults=2&camref=1101l5dQSW",
    seoTitle: "Hotels for Mardi Gras & Jazz Fest | New Orleans | UTrippin",
    seoDescription: "Book your stay for New Orleans festivals with Expedia + UTrippin."
  },
  { 
    name: "Romantic", 
    destination: "Santorini Greece",
    description: "romantic sunset dinner overlooking blue domed churches and Aegean Sea",
    tags: ['santorini', 'greece', 'romantic', 'sunset', 'couple'],
    category: 'people',
    expediaUrl: "https://www.expedia.com/Hotel-Search?destination=Santorini%2C+Greece&rooms=1&adults=2&camref=1101l5dQSW",
    seoTitle: "Santorini Romantic Hotels | UTrippin + Expedia",
    seoDescription: "Sunsets & luxury stays. Book Santorini romance via Expedia, powered by UTrippin."
  },
  { 
    name: "Relax & retreat", 
    destination: "Costa Rica Guanacaste",
    description: "peaceful yoga retreat with tropical rainforest and meditation",
    tags: ['costa rica', 'yoga', 'retreat', 'rainforest', 'wellness'],
    category: 'travel',
    expediaUrl: "https://www.expedia.com/Hotel-Search?destination=Guanacaste%2C+Costa+Rica&rooms=1&adults=2&camref=1101l5dQSW",
    seoTitle: "Costa Rica Wellness & Retreats | Official UTrippin + Expedia",
    seoDescription: "Book spa resorts & eco-lodges in Costa Rica with Expedia & UTrippin."
  },
  { 
    name: "Family friendly", 
    destination: "Orlando Florida Disney",
    description: "happy family with children enjoying theme park rides and attractions",
    tags: ['family', 'disney', 'theme park', 'children', 'orlando'],
    category: 'people',
    expediaUrl: "https://www.expedia.com/Hotel-Search?destination=Orlando%2C+Florida&rooms=1&adults=2&children=2&camref=1101l5dQSW",
    seoTitle: "Family Hotels Near Disney Orlando | UTrippin + Expedia",
    seoDescription: "Family-friendly hotels by Disney & Universal with Expedia, powered by UTrippin."
  },
  { 
    name: "Wellness & spa", 
    destination: "Tulum Mexico spa",
    description: "luxury spa treatment with massage therapy and wellness relaxation",
    tags: ['tulum', 'spa', 'wellness', 'massage', 'luxury'],
    category: 'travel',
    expediaUrl: "https://www.expedia.com/Hotel-Search?destination=Tulum%2C+Mexico&rooms=1&adults=2&camref=1101l5dQSW",
    seoTitle: "Tulum Wellness Retreats & Spa Hotels | UTrippin + Expedia",
    seoDescription: "Rejuvenate in Tulum's best wellness resorts and spa hotels with Expedia, powered by UTrippin."
  },
  { 
    name: "Nightlife & city", 
    destination: "Berlin Germany",
    description: "vibrant nightlife scene with club dancing and city lights",
    tags: ['berlin', 'nightlife', 'club', 'city', 'party'],
    category: 'event',
    expediaUrl: "https://www.expedia.com/Hotel-Search?destination=Berlin%2C+Germany&rooms=1&adults=2&camref=1101l5dQSW",
    seoTitle: "Berlin Nightlife Hotels | Party & City Life | UTrippin + Expedia",
    seoDescription: "Stay in the heart of Berlin's vibrant nightlife scene with Expedia, powered by UTrippin."
  },
  { 
    name: "Luxury & shopping", 
    destination: "Milan Italy fashion",
    description: "luxury shopping district with high-end fashion boutiques and designer stores",
    tags: ['milan', 'luxury', 'shopping', 'fashion', 'designer'],
    category: 'travel',
    expediaUrl: "https://www.expedia.com/Hotel-Search?destination=Milan%2C+Italy&rooms=1&adults=2&camref=1101l5dQSW",
    seoTitle: "Milan Luxury Hotels & Shopping Districts | UTrippin + Expedia",
    seoDescription: "Experience Milan's fashion capital with luxury hotels near top shopping districts via Expedia + UTrippin."
  },
];

const TravelCategories = () => {
  return (
    <div className="bg-travel-light">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-[200px]">
          {categories.map((category, index) => {
            const isLarge = category.featured || index === 3;
            return (
              <a
                key={category.name}
                href={category.expediaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`relative group cursor-pointer overflow-hidden rounded-xl transition-all duration-500 hover:scale-105 hover:shadow-large animate-fade-in block ${
                  isLarge ? 'md:col-span-1 md:row-span-2 h-[416px]' : 'h-[200px]'
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
                title={category.seoTitle}
              >
                <img
                  src={getImageForCategory(category.name)}
                  alt={category.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <div className="absolute inset-0 bg-gradient-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-gray-700">
                    Book Hotels
                  </div>
                </div>
                
                <div className="absolute bottom-6 left-6 text-white">
                  <h3 className="text-xl font-bold mb-2 text-white drop-shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    {category.name}
                  </h3>
                  <p className="text-white/80 text-sm mb-2 opacity-75 group-hover:opacity-100 transition-opacity duration-300">
                    {category.destination.replace(/\s+(spa|fashion|Disney|overwater villa).*$/i, '')}
                  </p>
                  {isLarge && (
                    <div className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-100">
                      <p className="text-white/90 text-sm mb-3">
                        Discover amazing {category.name.toLowerCase()} experiences in {category.destination.replace(/\s+(spa|fashion|Disney|overwater villa).*$/i, '')}
                      </p>
                      <div className="text-primary font-medium text-sm cursor-pointer hover:underline">
                        Book now →
                      </div>
                    </div>
                  )}
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TravelCategories;
