import React, { useEffect, useRef, useState, useMemo } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { MapPin, Navigation, Layers } from 'lucide-react';
import { getDestinationCoordinates } from '@/utils/staticMapGenerator';

interface Destination {
  name: string;
  summary: string;
  description: string;
  image: string;
  tags: string[];
  cuisine: string[];
  highlights: string[];
  tips: string[];
  coordinates?: [number, number];
}

interface MapLibreMapProps {
  destinations: Destination[];
  onDestinationClick: (destination: Destination) => void;
  selectedTags: string[];
}

export const MapLibreMap = ({ destinations, onDestinationClick, selectedTags }: MapLibreMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [mapStyle, setMapStyle] = useState('https://tiles.openfreemap.org/styles/liberty');
  const [isLoading, setIsLoading] = useState(true);

  // Memoize destinations with coordinates to prevent infinite re-renders
  const destinationsWithCoords = useMemo(() => {
    return destinations.map(dest => ({
      ...dest,
      coordinates: getDestinationCoordinates(dest.name)
    }));
  }, [destinations]);

  useEffect(() => {
    if (!mapContainer.current) return;

    setIsLoading(true);
    
    // Clean up existing map
    try {
      if (map.current && map.current.getCanvas()) {
        map.current.remove();
        map.current = null;
      }
    } catch (error) {
      console.warn('Error cleaning up existing map:', error);
    }
    
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: mapStyle,
      zoom: 1.5,
      center: [30, 15],
      pitch: 0
    });

    // Add navigation controls
    map.current.addControl(
      new maplibregl.NavigationControl({
        visualizePitch: true,
      }),
      'top-right'
    );

    map.current.on('load', () => {
      setIsLoading(false);
      addDestinationMarkers();
    });

    const addDestinationMarkers = () => {
      destinationsWithCoords.forEach((destination) => {
        if (!destination.coordinates || destination.coordinates[0] === 0) return;

        // Filter by selected tags
        if (selectedTags.length > 0 && !destination.tags.some(tag => selectedTags.includes(tag))) {
          return;
        }

        // Create custom marker element
        const markerElement = document.createElement('div');
        markerElement.className = 'destination-marker';
        markerElement.innerHTML = `
          <div class="marker-pin bg-blue-600 hover:bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg border-2 border-white transition-all duration-300 hover:scale-110 cursor-pointer">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path>
            </svg>
          </div>
        `;

        // Create popup
        const popup = new maplibregl.Popup({ 
          offset: 25,
          className: 'destination-popup'
        }).setHTML(`
          <div class="p-4 max-w-xs">
            <div class="w-full h-32 bg-slate-200 rounded-lg mb-3 flex items-center justify-center">
              <svg class="w-8 h-8 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path>
              </svg>
            </div>
            <h3 class="font-bold text-lg mb-2 text-gray-800">${destination.name}</h3>
            <p class="text-sm text-gray-600 mb-3">${destination.summary.substring(0, 100)}...</p>
            <div class="flex flex-wrap gap-1 mb-3">
              ${destination.tags.slice(0, 3).map(tag => `<span class="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">${tag}</span>`).join('')}
            </div>
            <button class="w-full bg-blue-600 hover:bg-blue-500 text-white py-2 px-4 rounded-lg font-medium transition-colors" onclick="window.selectDestination('${destination.name}')">
              Explore Details
            </button>
          </div>
        `);

        // Add marker to map
        const marker = new maplibregl.Marker(markerElement)
          .setLngLat(destination.coordinates)
          .setPopup(popup)
          .addTo(map.current!);

        // Add click handler
        markerElement.addEventListener('click', () => {
          onDestinationClick(destination);
        });
      });
    };

    // Global function for popup buttons
    (window as any).selectDestination = (name: string) => {
      const destination = destinationsWithCoords.find(d => d.name === name);
      if (destination) {
        onDestinationClick(destination);
      }
    };

    // Rotation animation for globe effect
    let userInteracting = false;
    const spinGlobe = () => {
      if (!map.current || userInteracting) return;
      
      const zoom = map.current.getZoom();
      if (zoom < 3) {
        const center = map.current.getCenter();
        center.lng -= 0.2;
        map.current.easeTo({ center, duration: 1000, easing: (n) => n });
      }
    };

    // Event listeners for interaction
    map.current.on('mousedown', () => { userInteracting = true; });
    map.current.on('dragstart', () => { userInteracting = true; });
    map.current.on('mouseup', () => { userInteracting = false; spinGlobe(); });
    map.current.on('touchend', () => { userInteracting = false; spinGlobe(); });
    map.current.on('moveend', spinGlobe);

    spinGlobe();

    return () => {
      try {
        if (map.current && map.current.getCanvas()) {
          map.current.remove();
          map.current = null;
        }
      } catch (error) {
        console.warn('Error cleaning up map:', error);
      }
    };
  }, [mapStyle, destinationsWithCoords, selectedTags]);

  const mapStyles = [
    { id: 'https://tiles.openfreemap.org/styles/liberty', name: 'Liberty', icon: '🗺️' },
    { id: 'https://tiles.openfreemap.org/styles/bright', name: 'Bright', icon: '☀️' },
    { id: 'https://tiles.openfreemap.org/styles/positron', name: 'Light', icon: '⚪' },
    { id: 'https://tiles.openfreemap.org/styles/dark-matter', name: 'Dark', icon: '🌙' },
  ];

  return (
    <div className="relative w-full h-[600px] rounded-2xl overflow-hidden border border-blue-500/20 shadow-2xl">
      {isLoading && (
        <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
            <p className="text-white">Loading Interactive Map...</p>
          </div>
        </div>
      )}
      
      <div ref={mapContainer} className="absolute inset-0" />
      
      {/* Map Style Selector */}
      <div className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur-sm rounded-xl p-3 space-y-2">
        <div className="flex items-center gap-2 text-white text-sm font-medium mb-2">
          <Layers className="w-4 h-4" />
          Map Style
        </div>
        <div className="space-y-1">
          {mapStyles.map((style) => (
            <button
              key={style.id}
              onClick={() => setMapStyle(style.id)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                mapStyle === style.id
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:bg-slate-700'
              }`}
            >
              <span className="mr-2">{style.icon}</span>
              {style.name}
            </button>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-slate-900/90 backdrop-blur-sm rounded-xl p-4">
        <div className="flex items-center gap-3 text-white">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-400" />
            <span className="text-sm">Destinations</span>
          </div>
          <div className="flex items-center gap-2">
            <Navigation className="w-5 h-5 text-green-400" />
            <span className="text-sm">Navigate</span>
          </div>
        </div>
        <p className="text-xs text-slate-400 mt-2">
          Click markers to explore • Drag to navigate • Scroll to zoom
        </p>
        <p className="text-xs text-slate-500 mt-1">
          Powered by MapLibre GL JS & OpenFreeMap
        </p>
      </div>

      <style>{`
        .destination-marker {
          cursor: pointer;
        }
        .maplibregl-popup-content {
          background: white;
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.15);
          border: none;
          padding: 0;
          max-width: 300px;
        }
        .maplibregl-popup-close-button {
          background: #dc2626;
          color: white;
          border-radius: 50%;
          width: 24px;
          height: 24px;
          font-size: 14px;
          right: 8px;
          top: 8px;
        }
        .maplibregl-popup-anchor-bottom .maplibregl-popup-tip,
        .maplibregl-popup-anchor-top .maplibregl-popup-tip {
          border-top-color: white;
          border-bottom-color: white;
        }
      `}</style>
    </div>
  );
};