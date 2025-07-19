import React, { useEffect, useRef, useState, useMemo } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapPin, Navigation, Layers, Loader2 } from 'lucide-react';
import { SmartImage } from './SmartImage';
import { supabase } from '@/integrations/supabase/client';
import { createPortal } from 'react-dom';

interface Destination {
  name: string;
  description: string;
  tags?: string[];
}

interface MapboxMapProps {
  destinations: Destination[];
  onDestinationClick?: (destination: Destination) => void;
  selectedTags?: string[];
}

// Coordinates for destinations
const getDestinationCoordinates = (name: string): [number, number] => {
  const coords: Record<string, [number, number]> = {
    // Greece
    'Santorini, Greece': [25.4615, 36.3932],
    'Mykonos': [25.3289, 37.4467],
    'Athens': [23.7275, 37.9755],
    
    // USA
    'Miami, Florida': [-80.1918, 25.7617],
    'Orlando': [-81.3792, 28.5383],
    'New York City': [-74.0060, 40.7128],
    'Las Vegas, Nevada': [-115.1398, 36.1699],
    'Nashville, Tennessee': [-86.7816, 36.1627],
    'Atlanta, Georgia': [-84.3880, 33.7490],
    'Washington, DC': [-77.0369, 38.9072],
    
    // Asia
    'Tokyo, Japan': [139.6917, 35.6895],
    'Bali, Indonesia': [115.0920, -8.4095],
    'Thai Islands': [98.9063, 7.8804], // Phuket center
    'Vietnam': [108.2772, 14.0583], // Central Vietnam
    'Rajasthan, India': [74.2179, 27.0238], // Jaipur
    
    // Europe  
    'Paris, France': [2.3522, 48.8566],
    'Tuscany, Italy': [11.2558, 43.7696], // Florence
    'Swiss Alps': [7.7380, 46.5197], // Interlaken
    'Scottish Highlands': [-4.4500, 57.0000], // Central Highlands
    'Prague, Czech Republic': [14.4378, 50.0755],
    'Croatian Coast': [16.4314, 43.5081], // Split
    'Northern Norway': [18.9553, 69.6492], // Tromsø
    'Iceland Ring Road': [-19.0208, 64.9631], // Reykjavik
    
    // Africa & Middle East
    'Safari Kenya': [37.9062, -0.0236], // Nairobi
    'Morocco Atlas Mountains': [-7.0926, 31.7917], // Marrakech
    'Jordan': [36.2384, 31.9539], // Amman
    
    // Americas
    'Machu Picchu, Peru': [-72.5450, -13.1631],
    'Patagonia': [-72.0968, -49.3044], // El Calafate
    'Vancouver, Canada': [-123.1207, 49.2827],
    'Chile Wine Country': [-70.7500, -34.0000], // Santiago region
    
    // Oceania
    'Australian Outback': [133.7751, -25.2744], // Alice Springs
    'Maldives': [73.2207, 3.2028],
    
    // Florida (additional)
    'Key West': [-81.7800, 24.5557],
    'Tampa': [-82.4572, 27.9506],
    'Fort Lauderdale': [-80.1373, 26.1224],
    'Naples': [-81.7964, 26.1420],
    'St. Augustine': [-81.3124, 29.9012],
    'Clearwater': [-82.8001, 27.9659],
    'Sarasota': [-82.5307, 27.3364],
    
    // Additional destinations from JSON
    'Rome, Italy': [12.4964, 41.9028],
    'Barcelona, Spain': [2.1734, 41.3851],
    'Amsterdam, Netherlands': [4.9041, 52.3676],
    'London, England': [-0.1276, 51.5074],
    'Berlin, Germany': [13.4050, 52.5200],
    'Cairo, Egypt': [31.2357, 30.0444],
    'Dubai, UAE': [55.2708, 25.2048],
    'Mumbai, India': [72.8777, 19.0760],
    'Seoul, South Korea': [126.9780, 37.5665],
    'Sydney, Australia': [151.2093, -33.8688],
    'Rio de Janeiro, Brazil': [-43.1729, -22.9068],
    'Buenos Aires, Argentina': [-58.3816, -34.6037],
    'Mexico City, Mexico': [-99.1332, 19.4326],
    'Istanbul, Turkey': [28.9784, 41.0082]
  };
  
  // Handle name variations and fallbacks
  const normalizedName = name.toLowerCase();
  for (const [key, value] of Object.entries(coords)) {
    if (key.toLowerCase().includes(normalizedName) || normalizedName.includes(key.toLowerCase())) {
      return value;
    }
  }
  
  return coords[name] || [0, 0];
};

const PopupContent: React.FC<{ destination: Destination; onClose: () => void; onClick: () => void }> = ({ 
  destination, 
  onClose, 
  onClick 
}) => (
  <div className="bg-background border border-border rounded-lg shadow-lg max-w-xs overflow-hidden">
    <div className="relative h-32 w-full">
      <SmartImage
        destination={destination.name}
        description={destination.description}
        tags={destination.tags}
        className="w-full h-full object-cover"
        alt={destination.name}
      />
    </div>
    <div className="p-3">
      <h3 className="font-semibold text-sm text-foreground mb-1">{destination.name}</h3>
      <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{destination.description}</p>
      {destination.tags && destination.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {destination.tags.slice(0, 2).map((tag, index) => (
            <span key={index} className="text-xs bg-secondary text-secondary-foreground px-1.5 py-0.5 rounded">
              {tag}
            </span>
          ))}
        </div>
      )}
      <button
        onClick={onClick}
        className="w-full bg-primary text-primary-foreground text-xs py-1.5 px-2 rounded hover:bg-primary/90 transition-colors"
      >
        View Details
      </button>
    </div>
  </div>
);

export const MapboxMap: React.FC<MapboxMapProps> = ({ 
  destinations, 
  onDestinationClick, 
  selectedTags = [] 
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string>('');
  const [mapStyle, setMapStyle] = useState('mapbox://styles/mapbox/light-v11');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const popupRef = useRef<mapboxgl.Popup | null>(null);

  // Fetch Mapbox token
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('get-mapbox-token');
        if (error) throw error;
        if (data?.token) {
          setMapboxToken(data.token);
        } else {
          throw new Error('No Mapbox token received');
        }
      } catch (err) {
        console.error('Error fetching Mapbox token:', err);
        setError('Failed to load map. Please check your Mapbox configuration.');
        setIsLoading(false);
      }
    };

    fetchToken();
  }, []);

  // Memoize filtered destinations
  const filteredDestinations = useMemo(() => {
    return destinations
      .map(dest => ({
        ...dest,
        coordinates: getDestinationCoordinates(dest.name)
      }))
      .filter(dest => {
        if (selectedTags.length === 0) return true;
        return selectedTags.some(tag => dest.tags?.includes(tag));
      })
      .filter(dest => dest.coordinates[0] !== 0 || dest.coordinates[1] !== 0);
  }, [destinations, selectedTags]);

  // Map styles
  const mapStyles = [
    { id: 'light', name: 'Light', style: 'mapbox://styles/mapbox/light-v11' },
    { id: 'streets', name: 'Streets', style: 'mapbox://styles/mapbox/streets-v12' },
    { id: 'satellite', name: 'Satellite', style: 'mapbox://styles/mapbox/satellite-v9' },
    { id: 'outdoors', name: 'Outdoors', style: 'mapbox://styles/mapbox/outdoors-v12' },
  ];

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;

    try {
      mapboxgl.accessToken = mapboxToken;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: mapStyle,
        center: [23.7275, 37.9755], // Athens
        zoom: 4,
        pitch: 45,
        bearing: 0,
        antialias: true
      });

      // Add navigation controls
      map.current.addControl(
        new mapboxgl.NavigationControl({
          visualizePitch: true,
          showZoom: true,
          showCompass: true
        }),
        'top-right'
      );

      // Add scale control
      map.current.addControl(new mapboxgl.ScaleControl(), 'bottom-left');

      // Set loading to false when map loads
      map.current.on('load', () => {
        setIsLoading(false);
        setError('');
      });

      map.current.on('error', (e) => {
        console.error('Mapbox error:', e);
        setError('Map failed to load. Please try again.');
        setIsLoading(false);
      });

    } catch (err) {
      console.error('Error initializing map:', err);
      setError('Failed to initialize map. Please check your configuration.');
      setIsLoading(false);
    }

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [mapboxToken, mapStyle]);

  // Add markers
  useEffect(() => {
    if (!map.current || isLoading) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Clear existing popup
    if (popupRef.current) {
      popupRef.current.remove();
      popupRef.current = null;
    }

    // Add new markers
    filteredDestinations.forEach((destination) => {
      const [lng, lat] = destination.coordinates;

      // Create marker element
      const markerElement = document.createElement('div');
      markerElement.className = 'custom-marker';
      markerElement.style.cssText = `
        width: 30px;
        height: 30px;
        background: hsl(var(--primary));
        border: 2px solid hsl(var(--background));
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        transition: all 0.2s ease;
      `;

      const icon = document.createElement('div');
      icon.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--primary-foreground))" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`;
      markerElement.appendChild(icon);

      // Add hover effects
      markerElement.addEventListener('mouseenter', () => {
        markerElement.style.transform = 'scale(1.1)';
        markerElement.style.zIndex = '1000';
      });
      
      markerElement.addEventListener('mouseleave', () => {
        markerElement.style.transform = 'scale(1)';
        markerElement.style.zIndex = 'auto';
      });

      // Create marker
      const marker = new mapboxgl.Marker(markerElement)
        .setLngLat([lng, lat])
        .addTo(map.current!);

      // Add click handler
      markerElement.addEventListener('click', () => {
        // Close existing popup
        if (popupRef.current) {
          popupRef.current.remove();
        }

        // Create popup container
        const popupContainer = document.createElement('div');
        
        // Create popup
        const popup = new mapboxgl.Popup({
          closeButton: true,
          closeOnClick: false,
          maxWidth: '300px',
          className: 'custom-popup'
        })
        .setLngLat([lng, lat])
        .setDOMContent(popupContainer)
        .addTo(map.current!);

        // Render React component in popup
        const root = createPortal(
          <PopupContent
            destination={destination}
            onClose={() => popup.remove()}
            onClick={() => {
              popup.remove();
              onDestinationClick?.(destination);
            }}
          />,
          popupContainer
        );

        popupRef.current = popup;

        // Zoom to destination
        map.current?.flyTo({
          center: [lng, lat],
          zoom: Math.max(map.current.getZoom(), 8),
          duration: 1000
        });
      });

      markersRef.current.push(marker);
    });

    // Fit map to show all markers if we have destinations
    if (filteredDestinations.length > 0 && map.current.isStyleLoaded()) {
      const bounds = new mapboxgl.LngLatBounds();
      filteredDestinations.forEach(dest => {
        bounds.extend(dest.coordinates);
      });
      
      map.current.fitBounds(bounds, {
        padding: { top: 50, bottom: 50, left: 50, right: 50 },
        maxZoom: 10,
        duration: 1000
      });
    }
  }, [filteredDestinations, isLoading, onDestinationClick]);

  // Handle style changes
  const handleStyleChange = (newStyle: string) => {
    if (map.current) {
      setMapStyle(newStyle);
      map.current.setStyle(newStyle);
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-96 bg-muted rounded-lg">
        <div className="text-center">
          <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-96 bg-muted rounded-lg overflow-hidden">
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Loading map...</span>
          </div>
        </div>
      )}

      {/* Map container */}
      <div ref={mapContainer} className="absolute inset-0" />

      {/* Style selector */}
      <div className="absolute top-4 left-4 z-10">
        <div className="bg-background/90 backdrop-blur-sm rounded-lg border border-border p-2">
          <div className="flex items-center gap-2 mb-2">
            <Layers className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Style</span>
          </div>
          <div className="grid grid-cols-2 gap-1">
            {mapStyles.map((style) => (
              <button
                key={style.id}
                onClick={() => handleStyleChange(style.style)}
                className={`text-xs px-2 py-1 rounded transition-colors ${
                  mapStyle === style.style
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }`}
              >
                {style.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-10">
        <div className="bg-background/90 backdrop-blur-sm rounded-lg border border-border p-3">
          <div className="flex items-center gap-2 mb-2">
            <Navigation className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Legend</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="w-3 h-3 bg-primary rounded-full border border-background"></div>
            <span>Destinations ({filteredDestinations.length})</span>
          </div>
        </div>
      </div>

      {/* Custom popup styles */}
      <style>{`
        .mapboxgl-popup-content {
          padding: 0 !important;
          border-radius: 8px !important;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05) !important;
        }
        .mapboxgl-popup-close-button {
          color: hsl(var(--muted-foreground)) !important;
          font-size: 18px !important;
          padding: 4px !important;
        }
        .mapboxgl-popup-close-button:hover {
          color: hsl(var(--foreground)) !important;
        }
        .mapboxgl-popup-anchor-bottom .mapboxgl-popup-tip {
          border-top-color: hsl(var(--border)) !important;
        }
        .mapboxgl-popup-anchor-top .mapboxgl-popup-tip {
          border-bottom-color: hsl(var(--border)) !important;
        }
        .mapboxgl-popup-anchor-left .mapboxgl-popup-tip {
          border-right-color: hsl(var(--border)) !important;
        }
        .mapboxgl-popup-anchor-right .mapboxgl-popup-tip {
          border-left-color: hsl(var(--border)) !important;
        }
      `}</style>
    </div>
  );
};