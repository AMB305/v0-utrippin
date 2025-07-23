import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapPin, Route, Clock, DollarSign, Loader2, Navigation, Layers } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface TravelLocation {
  id: string;
  name: string;
  coordinates: [number, number];
  description?: string;
  estimatedCost?: number;
  duration?: string;
  type?: 'destination' | 'waypoint' | 'hotel' | 'attraction';
}

interface EnhancedMapComponentProps {
  locations: TravelLocation[];
  showRoute?: boolean;
  travelMode?: 'driving' | 'walking' | 'cycling' | 'transit';
  className?: string;
  onLocationClick?: (location: TravelLocation) => void;
}

export const EnhancedMapComponent: React.FC<EnhancedMapComponentProps> = ({
  locations,
  showRoute = false,
  travelMode = 'driving',
  className = '',
  onLocationClick
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  // Fetch Mapbox token
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('get-mapbox-token');
        if (error) throw error;
        setMapboxToken(data.token);
      } catch (err) {
        console.error('Error fetching Mapbox token:', err);
        setError('Failed to load map');
      }
    };
    fetchToken();
  }, []);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: locations.length > 0 ? locations[0].coordinates : [-74.006, 40.7128],
      zoom: locations.length > 1 ? 6 : 12,
      projection: { name: 'mercator' },
    });

    // Add navigation controls
    map.current.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: true,
      }),
      'top-right'
    );

    // Add scale control
    map.current.addControl(new mapboxgl.ScaleControl(), 'bottom-left');

    map.current.on('load', () => {
      setLoading(false);
      addLocationMarkers();
      if (showRoute && locations.length > 1) {
        addRoute();
      }
      fitMapToLocations();
    });

    map.current.on('error', (e) => {
      console.error('Mapbox error:', e);
      setError('Map failed to load');
    });

    return () => {
      markersRef.current.forEach(marker => marker.remove());
      map.current?.remove();
    };
  }, [mapboxToken, locations]);

  // Add markers for locations
  const addLocationMarkers = () => {
    if (!map.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    locations.forEach((location, index) => {
      const markerElement = document.createElement('div');
      markerElement.className = 'enhanced-marker';
      
      // Create custom marker based on location type
      const markerColor = getMarkerColor(location.type);
      const markerIcon = getMarkerIcon(location.type);
      
      markerElement.innerHTML = `
        <div class="relative">
          <div class="w-10 h-10 ${markerColor} rounded-full flex items-center justify-center shadow-lg border-2 border-white transform transition-transform hover:scale-110">
            <span class="text-white text-sm">${markerIcon}</span>
          </div>
          ${index === 0 ? '<div class="absolute -top-2 -right-2 w-4 h-4 bg-green-500 rounded-full border border-white"></div>' : ''}
          ${index === locations.length - 1 && locations.length > 1 ? '<div class="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full border border-white"></div>' : ''}
        </div>
      `;

      const marker = new mapboxgl.Marker(markerElement)
        .setLngLat(location.coordinates)
        .addTo(map.current!);

      // Add popup with location info
      const popup = new mapboxgl.Popup({
        offset: 25,
        closeButton: true,
        closeOnClick: false
      }).setHTML(`
        <div class="p-3 max-w-xs">
          <h3 class="font-semibold text-gray-900 mb-2">${location.name}</h3>
          ${location.description ? `<p class="text-sm text-gray-600 mb-2">${location.description}</p>` : ''}
          <div class="flex items-center gap-4 text-xs text-gray-500">
            ${location.estimatedCost ? `
              <div class="flex items-center gap-1">
                <span class="text-green-600">💰</span>
                $${location.estimatedCost}
              </div>
            ` : ''}
            ${location.duration ? `
              <div class="flex items-center gap-1">
                <span class="text-blue-600">⏱️</span>
                ${location.duration}
              </div>
            ` : ''}
          </div>
          <button class="mt-2 text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 transition-colors" onclick="window.dispatchEvent(new CustomEvent('location-clicked', { detail: ${JSON.stringify(location).replace(/"/g, '&quot;')} }))">
            View Details
          </button>
        </div>
      `);

      marker.setPopup(popup);
      markersRef.current.push(marker);

      // Handle location click
      markerElement.addEventListener('click', () => {
        onLocationClick?.(location);
      });
    });
  };

  // Add route between locations
  const addRoute = async () => {
    if (!map.current || locations.length < 2) return;

    try {
      const coordinates = locations.map(loc => loc.coordinates.join(',')).join(';');
      const profile = travelMode === 'driving' ? 'driving' : travelMode === 'walking' ? 'walking' : 'cycling';
      
      const routeUrl = `https://api.mapbox.com/directions/v5/mapbox/${profile}/${coordinates}?geometries=geojson&access_token=${mapboxToken}`;
      
      const response = await fetch(routeUrl);
      const data = await response.json();

      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0];

        // Add route line
        map.current.addSource('route', {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: route.geometry
          }
        });

        map.current.addLayer({
          id: 'route',
          type: 'line',
          source: 'route',
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': travelMode === 'driving' ? '#3B82F6' : travelMode === 'walking' ? '#10B981' : '#F59E0B',
            'line-width': 4,
            'line-opacity': 0.8
          }
        });

        // Add route animation
        map.current.addLayer({
          id: 'route-animation',
          type: 'line',
          source: 'route',
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#FFFFFF',
            'line-width': 2,
            'line-opacity': 0.8,
            'line-dasharray': [0, 4, 3]
          }
        });
      }
    } catch (error) {
      console.error('Error fetching route:', error);
    }
  };

  // Fit map to show all locations
  const fitMapToLocations = () => {
    if (!map.current || locations.length === 0) return;

    if (locations.length === 1) {
      map.current.setCenter(locations[0].coordinates);
      map.current.setZoom(12);
    } else {
      const bounds = new mapboxgl.LngLatBounds();
      locations.forEach(location => bounds.extend(location.coordinates));
      map.current.fitBounds(bounds, { padding: 50 });
    }
  };

  // Get marker color based on location type
  const getMarkerColor = (type?: string) => {
    switch (type) {
      case 'hotel': return 'bg-blue-600';
      case 'attraction': return 'bg-purple-600';
      case 'waypoint': return 'bg-orange-600';
      default: return 'bg-red-600';
    }
  };

  // Get marker icon based on location type  
  const getMarkerIcon = (type?: string) => {
    switch (type) {
      case 'hotel': return '🏨';
      case 'attraction': return '🎯';
      case 'waypoint': return '📍';
      default: return '📍';
    }
  };

  // Listen for location clicks from popup
  useEffect(() => {
    const handleLocationClick = (e: any) => {
      const location = e.detail;
      onLocationClick?.(location);
    };

    window.addEventListener('location-clicked', handleLocationClick);
    return () => window.removeEventListener('location-clicked', handleLocationClick);
  }, [onLocationClick]);

  if (error) {
    return (
      <div className={`h-64 w-full rounded-xl bg-gray-100 flex items-center justify-center ${className}`}>
        <div className="text-center text-gray-500">
          <MapPin className="h-8 w-8 mx-auto mb-2" />
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative h-64 w-full rounded-xl overflow-hidden shadow-lg ${className}`}>
      {loading && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-10">
          <div className="text-center">
            <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-blue-600" />
            <p className="text-sm text-gray-600">Loading enhanced map...</p>
          </div>
        </div>
      )}
      
      <div ref={mapContainer} className="w-full h-full" />
      
      {/* Travel mode indicator */}
      {showRoute && (
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1 shadow-md">
          <div className="flex items-center gap-2 text-sm">
            {travelMode === 'driving' && <span className="text-blue-600">🚗</span>}
            {travelMode === 'walking' && <span className="text-green-600">🚶</span>}
            {travelMode === 'cycling' && <span className="text-orange-600">🚴</span>}
            {travelMode === 'transit' && <span className="text-purple-600">🚌</span>}
            <span className="text-gray-700 capitalize">{travelMode}</span>
          </div>
        </div>
      )}

      {/* Location count */}
      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1 shadow-md">
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <MapPin className="h-4 w-4" />
          <span>{locations.length} locations</span>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
          .enhanced-marker {
            cursor: pointer;
            transition: transform 0.2s ease;
          }
          .enhanced-marker:hover {
            transform: scale(1.1);
          }
        `
      }} />
    </div>
  );
};