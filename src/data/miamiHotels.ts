export interface Hotel {
  id: string;
  name: string;
  description: string;
  image: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  expediaLink: string;
  rating?: number;
  priceRange?: string;
  neighborhood?: string;
}

export const miamiHotels: Hotel[] = [
  {
    id: "fontainebleau",
    name: "Fontainebleau Miami Beach",
    description: "Iconic oceanfront resort with luxury pools, spa, and nightlife. Famous for its LIV nightclub and stunning Art Deco architecture.",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop",
    coordinates: { lat: 25.8195, lng: -80.1228 },
    expediaLink: "https://www.expedia.com/Hotel-Search?destination=Fontainebleau+Miami+Beach",
    rating: 4.2,
    priceRange: "$300-500",
    neighborhood: "Mid-Beach"
  },
  {
    id: "eden-roc",
    name: "Eden Roc Miami Beach",
    description: "Stylish resort with stunning ocean views and beachfront pools. Features multiple restaurants and a full-service spa.",
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&h=400&fit=crop",
    coordinates: { lat: 25.8146, lng: -80.1222 },
    expediaLink: "https://www.expedia.com/Hotel-Search?destination=Eden+Roc+Miami+Beach",
    rating: 4.1,
    priceRange: "$250-400",
    neighborhood: "Mid-Beach"
  },
  {
    id: "loews-miami",
    name: "Loews Miami Beach",
    description: "Family-friendly luxury hotel with direct beach access and large pool. Perfect for families with its kids' club and activities.",
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&h=400&fit=crop",
    coordinates: { lat: 25.7806, lng: -80.1303 },
    expediaLink: "https://www.expedia.com/Hotel-Search?destination=Loews+Miami+Beach",
    rating: 4.3,
    priceRange: "$200-350",
    neighborhood: "South Beach"
  },
  {
    id: "the-betsy",
    name: "The Betsy South Beach",
    description: "Boutique hotel on Ocean Drive with artsy vibe & rooftop pool. Known for its cultural programming and refined atmosphere.",
    image: "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=600&h=400&fit=crop",
    coordinates: { lat: 25.7870, lng: -80.1300 },
    expediaLink: "https://www.expedia.com/Hotel-Search?destination=The+Betsy+South+Beach",
    rating: 4.4,
    priceRange: "$280-450",
    neighborhood: "South Beach"
  },
  {
    id: "w-south-beach",
    name: "W South Beach",
    description: "Upscale suites with ocean views, vibrant nightlife & pool scene. Features BLISS spa and multiple dining options.",
    image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&h=400&fit=crop",
    coordinates: { lat: 25.7975, lng: -80.1283 },
    expediaLink: "https://www.expedia.com/Hotel-Search?destination=W+South+Beach",
    rating: 4.0,
    priceRange: "$350-550",
    neighborhood: "South Beach"
  },
  {
    id: "1-hotel-south-beach",
    name: "1 Hotel South Beach",
    description: "Eco-luxury hotel with rooftop pool, beach club & organic dining. Sustainable luxury with stunning ocean views.",
    image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&h=400&fit=crop",
    coordinates: { lat: 25.7966, lng: -80.1280 },
    expediaLink: "https://www.expedia.com/Hotel-Search?destination=1+Hotel+South+Beach",
    rating: 4.5,
    priceRange: "$400-650",
    neighborhood: "South Beach"
  },
  {
    id: "the-setai",
    name: "The Setai Miami Beach",
    description: "Five-star resort blending Asian luxury with Miami glam. Features three infinity pools and world-class dining.",
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=400&fit=crop",
    coordinates: { lat: 25.7948, lng: -80.1285 },
    expediaLink: "https://www.expedia.com/Hotel-Search?destination=The+Setai+Miami+Beach",
    rating: 4.6,
    priceRange: "$500-800",
    neighborhood: "South Beach"
  },
  {
    id: "surfcomber",
    name: "Kimpton Surfcomber",
    description: "Trendy boutique hotel with lively pool scene & beachfront access. Known for its vibrant social atmosphere.",
    image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=600&h=400&fit=crop",
    coordinates: { lat: 25.7916, lng: -80.1292 },
    expediaLink: "https://www.expedia.com/Hotel-Search?destination=Kimpton+Surfcomber",
    rating: 4.2,
    priceRange: "$220-380",
    neighborhood: "South Beach"
  },
  {
    id: "mondrian-south-beach",
    name: "Mondrian South Beach",
    description: "Stylish bayfront hotel with infinity pool & stunning sunset views. Features the iconic Sunset Lounge.",
    image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600&h=400&fit=crop",
    coordinates: { lat: 25.7829, lng: -80.1410 },
    expediaLink: "https://www.expedia.com/Hotel-Search?destination=Mondrian+South+Beach",
    rating: 4.1,
    priceRange: "$250-420",
    neighborhood: "South Beach"
  },
  {
    id: "ritz-carlton",
    name: "The Ritz-Carlton, South Beach",
    description: "Beachfront luxury with spa, pool & acclaimed dining. Offers impeccable service and elegant accommodations.",
    image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600&h=400&fit=crop",
    coordinates: { lat: 25.7904, lng: -80.1299 },
    expediaLink: "https://www.expedia.com/Hotel-Search?destination=The+Ritz-Carlton+South+Beach",
    rating: 4.5,
    priceRange: "$450-700",
    neighborhood: "South Beach"
  },
  {
    id: "nobu-hotel",
    name: "Nobu Hotel Miami Beach",
    description: "Sophisticated Japanese-inspired hotel with renowned Nobu restaurant. Minimalist luxury at its finest.",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop",
    coordinates: { lat: 25.7892, lng: -80.1301 },
    expediaLink: "https://www.expedia.com/Hotel-Search?destination=Nobu+Hotel+Miami+Beach",
    rating: 4.4,
    priceRange: "$350-550",
    neighborhood: "South Beach"
  },
  {
    id: "shore-club",
    name: "Shore Club South Beach",
    description: "Iconic beachfront hotel with sophisticated pool scene. Features multiple bars and the famous Skybar.",
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&h=400&fit=crop",
    coordinates: { lat: 25.7921, lng: -80.1295 },
    expediaLink: "https://www.expedia.com/Hotel-Search?destination=Shore+Club+South+Beach",
    rating: 4.0,
    priceRange: "$280-450",
    neighborhood: "South Beach"
  },
  {
    id: "faena-hotel",
    name: "Faena Hotel Miami Beach",
    description: "Ultra-luxurious theatrical hotel with gold-leaf details. Features a private beach club and world-class spa.",
    image: "https://images.unsplash.com/photo-1561501900-3701fa6a0864?w=600&h=400&fit=crop",
    coordinates: { lat: 25.8023, lng: -80.1267 },
    expediaLink: "https://www.expedia.com/Hotel-Search?destination=Faena+Hotel+Miami+Beach",
    rating: 4.7,
    priceRange: "$600-1000",
    neighborhood: "Mid-Beach"
  },
  {
    id: "st-regis-bal-harbour",
    name: "The St. Regis Bal Harbour Resort",
    description: "Elegant oceanfront resort with butler service and luxury shopping nearby. Perfect for sophisticated travelers.",
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&h=400&fit=crop",
    coordinates: { lat: 25.8916, lng: -80.1195 },
    expediaLink: "https://www.expedia.com/Hotel-Search?destination=The+St+Regis+Bal+Harbour+Resort",
    rating: 4.6,
    priceRange: "$500-800",
    neighborhood: "Bal Harbour"
  },
  {
    id: "four-seasons-surfside",
    name: "Four Seasons Hotel at The Surf Club",
    description: "Historic surf club transformed into luxury resort. Features beautiful pools and exceptional dining.",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop",
    coordinates: { lat: 25.8776, lng: -80.1203 },
    expediaLink: "https://www.expedia.com/Hotel-Search?destination=Four+Seasons+Hotel+at+The+Surf+Club",
    rating: 4.8,
    priceRange: "$700-1200",
    neighborhood: "Surfside"
  },
  {
    id: "edition-miami-beach",
    name: "EDITION Miami Beach",
    description: "Modern luxury with multiple pools and vibrant nightlife. Features the famous Market restaurant.",
    image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600&h=400&fit=crop",
    coordinates: { lat: 25.8034, lng: -80.1264 },
    expediaLink: "https://www.expedia.com/Hotel-Search?destination=EDITION+Miami+Beach",
    rating: 4.3,
    priceRange: "$350-600",
    neighborhood: "Mid-Beach"
  },
  {
    id: "grand-beach-hotel",
    name: "Grand Beach Hotel Surfside",
    description: "Beachfront hotel with pool and easy beach access. Family-friendly with spacious rooms and great location.",
    image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=600&h=400&fit=crop",
    coordinates: { lat: 25.8732, lng: -80.1206 },
    expediaLink: "https://www.expedia.com/Hotel-Search?destination=Grand+Beach+Hotel+Surfside",
    rating: 4.0,
    priceRange: "$180-320",
    neighborhood: "Surfside"
  },
  {
    id: "acqualina-resort",
    name: "Acqualina Resort & Residences",
    description: "Ultra-luxury oceanfront resort with private beach and world-class spa. Features three pools and fine dining.",
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=400&fit=crop",
    coordinates: { lat: 25.9234, lng: -80.1168 },
    expediaLink: "https://www.expedia.com/Hotel-Search?destination=Acqualina+Resort+Residences",
    rating: 4.7,
    priceRange: "$600-1000",
    neighborhood: "Sunny Isles Beach"
  },
  {
    id: "trump-international",
    name: "Trump International Beach Resort",
    description: "Luxury beachfront resort with full-service spa and multiple dining options. All suites with ocean views.",
    image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600&h=400&fit=crop",
    coordinates: { lat: 25.9402, lng: -80.1154 },
    expediaLink: "https://www.expedia.com/Hotel-Search?destination=Trump+International+Beach+Resort",
    rating: 4.2,
    priceRange: "$300-500",
    neighborhood: "Sunny Isles Beach"
  },
  {
    id: "sagamore-hotel",
    name: "Sagamore, The Art Hotel",
    description: "Boutique art hotel with contemporary design and beachfront location. Features rotating art exhibitions.",
    image: "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=600&h=400&fit=crop",
    coordinates: { lat: 25.7904, lng: -80.1299 },
    expediaLink: "https://www.expedia.com/Hotel-Search?destination=Sagamore+The+Art+Hotel",
    rating: 4.1,
    priceRange: "$200-350",
    neighborhood: "South Beach"
  },
  {
    id: "diplomat-beach-resort",
    name: "Diplomat Beach Resort Hollywood",
    description: "Sprawling beachfront resort with multiple pools and dining options. Perfect for families and groups.",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop",
    coordinates: { lat: 25.9928, lng: -80.1075 },
    expediaLink: "https://www.expedia.com/Hotel-Search?destination=Diplomat+Beach+Resort+Hollywood",
    rating: 4.0,
    priceRange: "$220-380",
    neighborhood: "Hollywood"
  },
  {
    id: "carillon-wellness",
    name: "Carillon Miami Wellness Resort",
    description: "All-suite wellness resort with spa and healthy dining. Focus on wellness and relaxation programs.",
    image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&h=400&fit=crop",
    coordinates: { lat: 25.8087, lng: -80.1259 },
    expediaLink: "https://www.expedia.com/Hotel-Search?destination=Carillon+Miami+Wellness+Resort",
    rating: 4.2,
    priceRange: "$300-500",
    neighborhood: "Mid-Beach"
  },
  {
    id: "thompson-miami-beach",
    name: "Thompson Miami Beach",
    description: "Rooftop pool with panoramic views and stylish accommodations. Modern luxury in the heart of South Beach.",
    image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&h=400&fit=crop",
    coordinates: { lat: 25.7892, lng: -80.1301 },
    expediaLink: "https://www.expedia.com/Hotel-Search?destination=Thompson+Miami+Beach",
    rating: 4.3,
    priceRange: "$280-450",
    neighborhood: "South Beach"
  },
  {
    id: "royal-palm",
    name: "Royal Palm South Beach",
    description: "Art Deco landmark hotel with oceanfront location. Classic Miami Beach style with modern amenities.",
    image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=600&h=400&fit=crop",
    coordinates: { lat: 25.7821, lng: -80.1315 },
    expediaLink: "https://www.expedia.com/Hotel-Search?destination=Royal+Palm+South+Beach",
    rating: 4.0,
    priceRange: "$200-350",
    neighborhood: "South Beach"
  },
  {
    id: "redbury-south-beach",
    name: "Redbury South Beach",
    description: "Boutique hotel with rock-and-roll vibe and rooftop pool. Unique design and personalized service.",
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&h=400&fit=crop",
    coordinates: { lat: 25.7851, lng: -80.1307 },
    expediaLink: "https://www.expedia.com/Hotel-Search?destination=Redbury+South+Beach",
    rating: 4.1,
    priceRange: "$180-320",
    neighborhood: "South Beach"
  },
  {
    id: "marriott-miami-airport",
    name: "Marriott Miami Airport",
    description: "Business-friendly hotel near the airport with outdoor pool and dining options. Perfect for travelers with early flights.",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop",
    coordinates: { lat: 25.7938, lng: -80.2749 },
    expediaLink: "https://www.expedia.com/Hotel-Search?destination=Marriott+Miami+Airport",
    rating: 4.2,
    priceRange: "$150-280",
    neighborhood: "Airport"
  },
  {
    id: "hampton-inn-downtown",
    name: "Hampton Inn & Suites Miami Downtown",
    description: "Budget-friendly stay in Brickell close to dining and nightlife. Great value for exploring downtown Miami.",
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&h=400&fit=crop",
    coordinates: { lat: 25.7684, lng: -80.1937 },
    expediaLink: "https://www.expedia.com/Hotel-Search?destination=Hampton+Inn+%26+Suites+Miami+Downtown",
    rating: 4.0,
    priceRange: "$120-220",
    neighborhood: "Downtown/Brickell"
  },
  {
    id: "kimpton-epic",
    name: "Kimpton EPIC Hotel",
    description: "Luxury high-rise with rooftop pools and spectacular views of Biscayne Bay. Modern amenities in the heart of downtown.",
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=400&fit=crop",
    coordinates: { lat: 25.7704, lng: -80.1885 },
    expediaLink: "https://www.expedia.com/Hotel-Search?destination=Kimpton+EPIC+Hotel",
    rating: 4.4,
    priceRange: "$320-520",
    neighborhood: "Downtown/Brickell"
  }
];

// Create structured data for Miami hotels
export const createMiamiHotelsSchema = () => ({
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "Top Hotels in Miami",
  "description": "Best hotels in Miami Beach and surrounding areas with direct booking links",
  "numberOfItems": miamiHotels.length,
  "itemListElement": miamiHotels.map((hotel, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "item": {
      "@type": "Hotel",
      "name": hotel.name,
      "description": hotel.description,
      "image": hotel.image,
      "url": hotel.expediaLink,
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": hotel.coordinates.lat,
        "longitude": hotel.coordinates.lng
      },
      "priceRange": hotel.priceRange,
      "aggregateRating": hotel.rating ? {
        "@type": "AggregateRating",
        "ratingValue": hotel.rating,
        "bestRating": 5,
        "worstRating": 1
      } : undefined
    }
  }))
});