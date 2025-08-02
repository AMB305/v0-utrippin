import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  MapPin, 
  Star, 
  ExternalLink,
  Waves,
  Camera,
  TreePalm,
  Building2,
  Rocket,
  Fish,
  Mountain
} from 'lucide-react';

// Import attraction images
import floridaBeachHero from '@/assets/florida-beach-hero.jpg';
import disneyWorld from '@/assets/disney-world.jpg';
import universalStudios from '@/assets/universal-studios.jpg';
import kennedySpaceCenter from '@/assets/kennedy-space-center.jpg';
import clearwaterBeach from '@/assets/clearwater-beach.jpg';
import southBeach from '@/assets/south-beach.jpg';
import everglades from '@/assets/everglades.jpg';
import dryTortugas from '@/assets/dry-tortugas.jpg';
import venetianPool from '@/assets/venetian-pool.jpg';
import manateesprings from '@/assets/manatee-springs.jpg';
import daliMuseum from '@/assets/dali-museum.jpg';
import bokTowerGardens from '@/assets/bok-tower-gardens.jpg';
import wynwoodWalls from '@/assets/wynwood-walls.jpg';

const Florida = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const featuredAttractions = [
    {
      name: "Walt Disney World",
      location: "Orlando",
      category: "Theme Parks",
      description: "The most magical place on earth with four theme parks, countless attractions, and endless entertainment.",
      link: "https://www.disneyworld.com",
      icon: <Building2 className="h-6 w-6" />,
      rating: 4.8,
      image: disneyWorld
    },
    {
      name: "Universal Studios",
      location: "Orlando",
      category: "Theme Parks", 
      description: "Experience movie magic come to life with thrilling rides and immersive attractions.",
      link: "https://www.universalorlando.com",
      icon: <Camera className="h-6 w-6" />,
      rating: 4.7,
      image: universalStudios
    },
    {
      name: "Kennedy Space Center",
      location: "Cape Canaveral",
      category: "Science & Space",
      description: "Discover the wonders of space exploration at America's spaceport.",
      link: "https://www.kennedyspacecenter.com",
      icon: <Rocket className="h-6 w-6" />,
      rating: 4.8,
      image: kennedySpaceCenter
    },
    {
      name: "Clearwater Beach",
      location: "Clearwater",
      category: "Beaches",
      description: "Crystal clear waters and sugar-white sand beaches perfect for relaxation.",
      link: "https://www.visitclearwaterbeach.com",
      icon: <Waves className="h-6 w-6" />,
      rating: 4.9,
      image: clearwaterBeach
    },
    {
      name: "South Beach",
      location: "Miami",
      category: "Beaches",
      description: "Iconic Art Deco architecture meets vibrant nightlife and pristine beaches.",
      link: "https://www.miamiandbeaches.com",
      icon: <Waves className="h-6 w-6" />,
      rating: 4.6,
      image: southBeach
    },
    {
      name: "Everglades National Park",
      location: "Homestead",
      category: "Nature",
      description: "Explore America's unique 'River of Grass' ecosystem and spot alligators, manatees, and exotic birds.",
      link: "https://www.nps.gov/ever",
      icon: <TreePalm className="h-6 w-6" />,
      rating: 4.5,
      image: everglades
    }
  ];

  const hiddenGems = [
    {
      name: "Dry Tortugas",
      location: "Key West",
      description: "Remote Florida islands with a history of sea turtles and sunken treasures, featuring one of the world's largest coastal brick fortresses.",
      link: "https://www.nps.gov/drto",
      category: "Historical",
      image: dryTortugas,
      rating: 4.7
    },
    {
      name: "Venetian Pool",
      location: "Coral Gables", 
      description: "The only swimming pool listed on the National Register of Historic Places, emptied and refilled daily with naturally filtered water.",
      link: "https://www.coralgables.com/venetianpool",
      category: "Unique Pools",
      image: venetianPool,
      rating: 4.6
    },
    {
      name: "Manatee Springs",
      location: "Chiefland",
      description: "Balmy Florida springs where manatees vacation like snowbirds in crystal-clear waters.",
      link: "https://www.floridastateparks.org/parks-and-trails/manatee-springs-state-park",
      category: "Natural Springs",
      image: manateesprings,
      rating: 4.8
    },
    {
      name: "Salvador Dalí Museum",
      location: "St. Petersburg",
      description: "Florida at its most surreal in this museum devoted to the famed Spanish artist's masterpieces.",
      link: "https://thedali.org",
      category: "Art & Culture",
      image: daliMuseum,
      rating: 4.7
    },
    {
      name: "Bok Tower Gardens",
      location: "Lake Wales",
      description: "Possibly the most beautiful carillon in the world, set atop Iron Mountain in stunning gardens.",
      link: "https://boktowergardens.org",
      category: "Gardens",
      image: bokTowerGardens,
      rating: 4.6
    },
    {
      name: "Wynwood Walls",
      location: "Miami",
      description: "An outdoor museum showcasing large-scale works by some of the world's most renowned street artists.",
      link: "https://www.wynwoodwalls.com",
      category: "Street Art",
      image: wynwoodWalls,
      rating: 4.5
    }
  ];

  const moreAttractions = [
    {
      name: "Art Deco Historic District",
      location: "Miami Beach",
      category: "Architecture",
      description: "The world's largest collection of Art Deco architecture with over 800 historic buildings.",
      rating: 4.4
    },
    {
      name: "Coral Castle",
      location: "Homestead",
      category: "Mystery",
      description: "A mysterious stone structure built single-handedly by one man over 28 years.",
      rating: 4.3
    },
    {
      name: "Rainbow Springs",
      location: "Dunnellon",
      category: "Natural Springs",
      description: "Crystal-clear springs perfect for swimming, tubing, and wildlife viewing.",
      rating: 4.7
    },
    {
      name: "Edison and Ford Winter Estates",
      location: "Fort Myers",
      category: "Historical",
      description: "Historic homes and laboratories of Thomas Edison and Henry Ford.",
      rating: 4.5
    },
    {
      name: "Weeki Wachee Springs",
      location: "Spring Hill",
      category: "Entertainment",
      description: "Home of the famous mermaid shows and crystal-clear spring waters.",
      rating: 4.4
    },
    {
      name: "Castillo de San Marcos",
      location: "St. Augustine",
      category: "Historical",
      description: "America's oldest masonry fort, built by the Spanish in the 17th century.",
      rating: 4.6
    }
  ];

  const categories = [
    { name: "Theme Parks", icon: <Building2 className="h-4 w-4" />, count: 85 },
    { name: "Beaches", icon: <Waves className="h-4 w-4" />, count: 120 },
    { name: "Nature", icon: <TreePalm className="h-4 w-4" />, count: 95 },
    { name: "Art & Culture", icon: <Camera className="h-4 w-4" />, count: 75 },
    { name: "Historical", icon: <Mountain className="h-4 w-4" />, count: 60 },
    { name: "Food & Dining", icon: <Fish className="h-4 w-4" />, count: 110 }
  ];

  const filteredHiddenGems = hiddenGems.filter(place =>
    place.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    place.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    place.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredMoreAttractions = moreAttractions.filter(place =>
    place.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    place.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    place.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/80">
      <Helmet>
        <title>Florida: 500+ Amazing Things to Do | Utrippin.ai</title>
        <meta name="description" content="Discover over 500 incredible attractions in Florida - from Disney World and Universal Studios to hidden gems and natural wonders. Your ultimate Florida adventure guide." />
      </Helmet>

      {/* Hero Section */}
      <div className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/10 to-secondary/20"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60"
          style={{
            backgroundImage: `url('${floridaBeachHero}')`
          }}
        ></div>
        
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
            Florida
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            Discover the Sunshine State's endless wonders - from world-famous theme parks and pristine beaches 
            to hidden natural springs and vibrant street art scenes. Your ultimate Florida adventure awaits.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Badge variant="secondary" className="px-4 py-2 text-lg">
              <Star className="h-4 w-4 mr-2" />
              500+ Attractions
            </Badge>
            <Badge variant="outline" className="px-4 py-2 text-lg">
              <MapPin className="h-4 w-4 mr-2" />
              All Regions Covered
            </Badge>
          </div>
        </div>
      </div>

      {/* Search & Categories */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto mb-12">
          <div className="relative mb-8">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              placeholder="Search attractions, cities, or categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 py-6 text-lg rounded-2xl border-2 focus:border-primary"
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {categories.map((category, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300 cursor-pointer group">
                <CardContent className="p-4 text-center">
                  <div className="flex flex-col items-center space-y-2">
                    <div className="p-3 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 group-hover:from-primary/30 group-hover:to-accent/30 transition-all">
                      {category.icon}
                    </div>
                    <span className="font-medium text-sm">{category.name}</span>
                    <span className="text-xs text-muted-foreground">{category.count} places</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Featured Attractions */}
        <div className="mb-16">
          <h2 className="text-4xl font-bold text-center mb-4">Must-Visit Destinations</h2>
          <p className="text-muted-foreground text-center mb-12 text-lg max-w-3xl mx-auto">
            From magical theme parks to stunning natural landscapes, Florida offers unforgettable experiences for every traveler.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredAttractions.map((attraction, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 bg-gradient-to-br from-card via-card to-card/90 overflow-hidden">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={attraction.image} 
                    alt={attraction.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 flex items-center space-x-1 bg-black/60 rounded-full px-2 py-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-white text-xs font-medium">{attraction.rating}</span>
                  </div>
                </div>
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="p-3 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 group-hover:from-primary/30 group-hover:to-accent/30 transition-all">
                      {attraction.icon}
                    </div>
                  </div>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">
                    {attraction.name}
                  </CardTitle>
                  <CardDescription className="flex items-center space-x-1 text-sm">
                    <MapPin className="h-3 w-3" />
                    <span>{attraction.location}</span>
                    <Badge variant="outline" className="ml-2 text-xs">
                      {attraction.category}
                    </Badge>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                    {attraction.description}
                  </p>
                  <Button 
                    variant="outline" 
                    className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all"
                    onClick={() => window.open(attraction.link, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Visit Website
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Hidden Gems Section */}
        <div className="mb-16">
          <h2 className="text-4xl font-bold text-center mb-4">Hidden Gems & Unique Experiences</h2>
          <p className="text-muted-foreground text-center mb-12 text-lg max-w-3xl mx-auto">
            Discover Florida's best-kept secrets and extraordinary places that most tourists never find.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {filteredHiddenGems.map((place, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 hover:border-primary/50 overflow-hidden">
                <div className="relative h-40 overflow-hidden">
                  <img 
                    src={place.image} 
                    alt={place.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4 flex items-center space-x-1 bg-black/60 rounded-full px-2 py-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-white text-xs font-medium">{place.rating}</span>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-semibold group-hover:text-primary transition-colors mb-1">
                        {place.name}
                      </h3>
                      <div className="flex items-center space-x-2 mb-3">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{place.location}</span>
                        <Badge variant="secondary" className="text-xs">
                          {place.category}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                    {place.description}
                  </p>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="group-hover:bg-primary/10 transition-all"
                    onClick={() => window.open(place.link, '_blank')}
                  >
                    <ExternalLink className="h-3 w-3 mr-2" />
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* More Attractions Grid */}
          <h3 className="text-2xl font-bold text-center mb-8">More Amazing Attractions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMoreAttractions.map((place, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 hover:border-primary/50">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-semibold group-hover:text-primary transition-colors mb-1">
                        {place.name}
                      </h3>
                      <div className="flex items-center space-x-2 mb-3">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{place.location}</span>
                        <Badge variant="secondary" className="text-xs">
                          {place.category}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium text-sm">{place.rating}</span>
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {place.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center py-16 px-4 bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10 rounded-3xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Explore Florida?
          </h2>
          <p className="text-muted-foreground mb-8 text-lg max-w-2xl mx-auto">
            With over 500 incredible attractions, Florida offers endless adventures. 
            Start planning your perfect Sunshine State getaway today!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="px-8 py-6 text-lg rounded-xl"
              onClick={() => window.location.href = '/flights'}
            >
              Book Your Florida Trip
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="px-8 py-6 text-lg rounded-xl"
              onClick={() => window.location.href = '/hotels'}
            >
              Find Hotels in Florida
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Florida;
