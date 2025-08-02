export interface VirtualDestination {
  id: string;
  name: string;
  location: string;
  earthLink: string;
  searchQuery: string;
  featured: boolean;
}

export const virtualDestinations: VirtualDestination[] = [
  // Featured destinations (shown on homepage)
  {
    id: "times-square",
    name: "Times Square",
    location: "NYC, USA",
    earthLink: "https://earth.google.com/web/@40.75694402,-73.98916699,18.0a,60y,303h,81t,0r",
    searchQuery: "Times Square New York City",
    featured: true
  },
  {
    id: "grand-canyon",
    name: "Grand Canyon",
    location: "South Rim, AZ",
    earthLink: "https://earth.google.com/web/@36.06525323,-112.16963873,2056.2a,60y,310h,73t,0r",
    searchQuery: "Grand Canyon Arizona landscape",
    featured: true
  },
  {
    id: "golden-gate-bridge",
    name: "Golden Gate Bridge",
    location: "San Francisco, CA",
    earthLink: "https://earth.google.com/web/@37.83253748,-122.49100252,166.1a,60y,163h,92t,0r",
    searchQuery: "Golden Gate Bridge San Francisco",
    featured: true
  },
  {
    id: "las-vegas-strip",
    name: "Las Vegas Strip",
    location: "Las Vegas, NV",
    earthLink: "https://earth.google.com/web/@36.12166423,-115.17271537,652.9a,60y,236h,79t,0r",
    searchQuery: "Las Vegas Strip night lights",
    featured: true
  },
  {
    id: "miami-beach",
    name: "Miami Beach",
    location: "South Beach, FL",
    earthLink: "https://earth.google.com/web/@25.77737685,-80.13131404,4.2a,60y,20h,85t,0r",
    searchQuery: "Miami Beach South Beach Florida",
    featured: true
  },
  {
    id: "yellowstone",
    name: "Yellowstone",
    location: "WY, USA",
    earthLink: "https://earth.google.com/web/@44.46208524,-110.64244108,2560.8a,60y,257h,79t,0r",
    searchQuery: "Yellowstone National Park geysers",
    featured: true
  },
  // Additional destinations (shown on virtual tour page)
  {
    id: "statue-of-liberty",
    name: "Statue of Liberty",
    location: "NYC, USA",
    earthLink: "https://earth.google.com/web/@40.68925,-74.04455,3a,60y,103.31h,88.09t,0r",
    searchQuery: "Statue of Liberty New York",
    featured: false
  },
  {
    id: "niagara-falls",
    name: "Niagara Falls",
    location: "NY, USA",
    earthLink: "https://earth.google.com/web/@43.08317,-79.07414,184a,35y,270h,60t,0r",
    searchQuery: "Niagara Falls waterfall",
    featured: false
  },
  {
    id: "mount-rushmore",
    name: "Mount Rushmore",
    location: "SD, USA",
    earthLink: "https://earth.google.com/web/@43.87905,-103.45909,1533a,35y,270h,60t,0r",
    searchQuery: "Mount Rushmore South Dakota",
    featured: false
  },
  {
    id: "hollywood-sign",
    name: "Hollywood Sign",
    location: "Los Angeles, CA",
    earthLink: "https://earth.google.com/web/@34.13414,-118.32154,491a,35y,270h,60t,0r",
    searchQuery: "Hollywood Sign Los Angeles",
    featured: false
  },
  {
    id: "space-needle",
    name: "Space Needle",
    location: "Seattle, WA",
    earthLink: "https://earth.google.com/web/@47.62048,-122.34930,184a,35y,270h,60t,0r",
    searchQuery: "Space Needle Seattle Washington",
    featured: false
  },
  {
    id: "french-quarter",
    name: "French Quarter",
    location: "New Orleans, LA",
    earthLink: "https://earth.google.com/web/@29.95465,-90.06418,8a,35y,270h,60t,0r",
    searchQuery: "French Quarter New Orleans Louisiana",
    featured: false
  }
];

export const getFeaturedDestinations = () => 
  virtualDestinations.filter(dest => dest.featured);

export const getAllDestinations = () => virtualDestinations;
