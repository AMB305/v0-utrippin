// Utility for generating Mapbox Static API URLs
export interface StaticMapOptions {
  latitude: number;
  longitude: number;
  zoom?: number;
  width?: number;
  height?: number;
  style?: string;
  marker?: boolean;
  markerColor?: string;
  markerSize?: 'small' | 'large';
  retina?: boolean;
}

export const generateStaticMapUrl = (options: StaticMapOptions): string => {
  const {
    latitude,
    longitude,
    zoom = 12,
    width = 400,
    height = 300,
    style = 'mapbox/streets-v12',
    marker = true,
    markerColor = 'blue',
    markerSize = 'large',
    retina = true
  } = options;

  const baseUrl = 'https://api.mapbox.com/styles/v1';
  const retinaParam = retina ? '@2x' : '';
  const markerParam = marker ? `/pin-${markerSize}-${markerColor}(${longitude},${latitude})` : '';
  
  // Note: Mapbox access token will be injected at runtime
  return `${baseUrl}/${style}/static${markerParam}/${longitude},${latitude},${zoom}/${width}x${height}${retinaParam}?access_token={{MAPBOX_TOKEN}}`;
};

// Generate static map URLs for destination cards
export const getDestinationStaticMap = (
  name: string, 
  coordinates: [number, number],
  size: 'small' | 'medium' | 'large' = 'medium'
): string => {
  const sizeMap = {
    small: { width: 200, height: 150 },
    medium: { width: 400, height: 300 },
    large: { width: 800, height: 600 }
  };

  const dimensions = sizeMap[size];
  
  return generateStaticMapUrl({
    latitude: coordinates[1],
    longitude: coordinates[0],
    zoom: 10,
    width: dimensions.width,
    height: dimensions.height,
    style: 'mapbox/satellite-streets-v12',
    marker: true,
    markerColor: 'red',
    markerSize: 'large',
    retina: true
  });
};

// Coordinate database for destinations - [longitude, latitude] format for Mapbox
export const destinationCoordinates: { [key: string]: [number, number] } = {
  "Santorini, Greece": [25.4615, 36.3932],
  "Miami, Florida": [-80.1918, 25.7617],
  "Tokyo, Japan": [139.6917, 35.6895],
  "Paris, France": [2.3522, 48.8566],
  "Bali, Indonesia": [115.0920, -8.4095],
  "New York City": [-74.0060, 40.7128],
  "Iceland Ring Road": [-21.8174, 64.1466],
  "Machu Picchu, Peru": [-72.5450, -13.1631],
  "Thai Islands": [98.3923, 7.8804],
  "Tuscany, Italy": [11.2558, 43.7696],
  "Safari Kenya": [37.9062, -0.0236],
  "Swiss Alps": [8.2275, 46.8182],
  "Australian Outback": [133.7751, -25.2744],
  "Northern Norway": [23.6753, 68.8778],
  "Morocco Atlas Mountains": [-7.9811, 31.6295],
  "Patagonia": [-73.2654, -49.2854],
  "Rajasthan, India": [73.4321, 27.0238],
  "Vancouver, Canada": [-123.1207, 49.2827],
  "Scottish Highlands": [-4.2026, 57.4778],
  "Maldives": [73.2207, 3.2028],
  "Vietnam": [108.2772, 14.0583],
  "Prague, Czech Republic": [14.4378, 50.0755],
  "Jordan": [36.2384, 30.5852],
  "Croatian Coast": [15.2000, 45.1000],
  "Chile Wine Country": [-70.6693, -34.6037],
  "Myanmar": [95.9560, 21.9162],
  "Azores, Portugal": [-25.7213, 37.7412],
  "Uzbekistan": [64.5853, 41.3775],
  "Faroe Islands": [-6.9118, 61.8926],
  "Madagascar": [46.8691, -18.7669],
  "Slovenia": [14.9955, 46.1512],
  "Socotra Island, Yemen": [53.9063, 12.4634],
  "Bhutan": [90.4336, 27.5142],
  "Easter Island, Chile": [-109.3497, -27.1127],
  "Palawan, Philippines": [118.7384, 9.8349],
  "Tasmania, Australia": [146.3160, -41.4545],
  "Georgian Wine Country": [45.1611, 41.8955],
  "Kamchatka, Russia": [158.6500, 53.1424],
  "Rwanda": [29.8739, -1.9403],
  "Lapland, Finland": [25.7284, 67.9222],
  "Oman": [55.9754, 21.4735],
  "Albania": [20.1683, 41.1533],
  "Sark, Channel Islands": [-2.3560, 49.4336],
  "Lord Howe Island, Australia": [159.0748, -31.5532],
  "Vanuatu": [166.9592, -15.3767],
  "Pitcairn Islands": [-128.3242, -25.0662]
};

// Get coordinates for a destination
export const getDestinationCoordinates = (name: string): [number, number] => {
  return destinationCoordinates[name] || [0, 0];
};

// Batch generate static maps for missing destination images
export const generateMissingDestinationMaps = async (destinations: any[]): Promise<string[]> => {
  const missingImages: string[] = [];
  
  destinations.forEach(destination => {
    const coords = getDestinationCoordinates(destination.name);
    if (coords[0] === 0 && coords[1] === 0) {
      console.warn(`No coordinates found for ${destination.name}`);
      return;
    }
    
    // Check if image exists or is a placeholder
    if (!destination.image || destination.image.includes('placeholder') || destination.image.includes('/src/assets/')) {
      const staticMapUrl = getDestinationStaticMap(destination.name, coords, 'medium');
      missingImages.push(`${destination.name}: ${staticMapUrl}`);
    }
  });
  
  return missingImages;
};
