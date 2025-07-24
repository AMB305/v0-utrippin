import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface TravelBuddyMapboxProps {
  buddies: Array<{
    id: string;
    name: string;
    avatarUrl: string;
    coords: { lat: number; lng: number };
    isOnline: boolean;
  }>;
  onPinClick: (buddyId: string) => void;
}

const TravelBuddyMapbox: React.FC<TravelBuddyMapboxProps> = ({ buddies, onPinClick }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string>('');
  const [showTokenInput, setShowTokenInput] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const initializeMap = async () => {
      try {
        // First try to get token from Supabase secrets
        const { data, error } = await supabase.functions.invoke('get-mapbox-token');
        
        let token = '';
        if (data?.token) {
          token = data.token;
        } else {
          // Show token input if not found in secrets
          setShowTokenInput(true);
          setIsLoading(false);
          return;
        }

        if (!mapContainer.current || map.current) return;

        mapboxgl.accessToken = token;
        
        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/light-v11',
          center: [-64.8963, 18.3358], // US Virgin Islands
          zoom: 9,
          pitch: 45,
        });

        // Add navigation controls
        map.current.addControl(
          new mapboxgl.NavigationControl({
            visualizePitch: true,
          }),
          'top-right'
        );

        // Add travel buddy markers
        buddies.forEach((buddy) => {
          if (!map.current) return;

          // Create a custom marker element
          const markerElement = document.createElement('div');
          markerElement.className = 'custom-marker';
          markerElement.innerHTML = `
            <div class="relative cursor-pointer group">
              <div class="w-12 h-12 rounded-full border-3 ${buddy.isOnline ? 'border-green-400' : 'border-gray-400'} overflow-hidden bg-white shadow-lg hover:scale-110 transition-transform">
                <img src="${buddy.avatarUrl}" alt="${buddy.name}" class="w-full h-full object-cover" />
              </div>
              ${buddy.isOnline ? '<div class="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>' : ''}
            </div>
          `;

          markerElement.addEventListener('click', () => onPinClick(buddy.id));

          // Create popup
          const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
            <div class="p-2">
              <h3 class="font-semibold">${buddy.name}</h3>
              <button class="mt-2 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm">
                Connect
              </button>
            </div>
          `);

          // Add marker to map
          new mapboxgl.Marker(markerElement)
            .setLngLat([buddy.coords.lng, buddy.coords.lat])
            .setPopup(popup)
            .addTo(map.current);
        });

        setIsLoading(false);

      } catch (error) {
        console.error('Error initializing map:', error);
        setShowTokenInput(true);
        setIsLoading(false);
      }
    };

    initializeMap();

    return () => {
      map.current?.remove();
    };
  }, [buddies, onPinClick]);

  const handleTokenSubmit = () => {
    if (!mapboxToken.trim()) {
      toast({
        title: "Token Required",
        description: "Please enter your Mapbox public token",
        variant: "destructive",
      });
      return;
    }

    try {
      if (!mapContainer.current) return;

      mapboxgl.accessToken = mapboxToken;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [-64.8963, 18.3358], // US Virgin Islands
        zoom: 9,
        pitch: 45,
      });

      // Add navigation controls
      map.current.addControl(
        new mapboxgl.NavigationControl({
          visualizePitch: true,
        }),
        'top-right'
      );

      // Add travel buddy markers
      buddies.forEach((buddy) => {
        if (!map.current) return;

        // Create a custom marker element
        const markerElement = document.createElement('div');
        markerElement.innerHTML = `
          <div class="relative cursor-pointer group">
            <div class="w-12 h-12 rounded-full border-3 ${buddy.isOnline ? 'border-green-400' : 'border-gray-400'} overflow-hidden bg-white shadow-lg hover:scale-110 transition-transform">
              <img src="${buddy.avatarUrl}" alt="${buddy.name}" class="w-full h-full object-cover" />
            </div>
            ${buddy.isOnline ? '<div class="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>' : ''}
          </div>
        `;

        markerElement.addEventListener('click', () => onPinClick(buddy.id));

        // Create popup
        const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
          <div class="p-2">
            <h3 class="font-semibold">${buddy.name}</h3>
            <button class="mt-2 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm">
              Connect
            </button>
          </div>
        `);

        // Add marker to map
        new mapboxgl.Marker(markerElement)
          .setLngLat([buddy.coords.lng, buddy.coords.lat])
          .setPopup(popup)
          .addTo(map.current);
      });

      setShowTokenInput(false);
      toast({
        title: "Map Loaded",
        description: "Mapbox map initialized successfully!",
      });

    } catch (error) {
      console.error('Error with token:', error);
      toast({
        title: "Invalid Token",
        description: "Please check your Mapbox public token and try again",
        variant: "destructive",
      });
    }
  };

  if (showTokenInput) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 bg-gray-50">
        <div className="max-w-md w-full space-y-4">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">Mapbox Token Required</h3>
            <p className="text-sm text-gray-600 mb-4">
              Please enter your Mapbox public token to display the interactive map.
            </p>
            <p className="text-xs text-gray-500 mb-4">
              Get your token from <a href="https://mapbox.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">mapbox.com</a>
            </p>
          </div>
          <Input
            type="text"
            placeholder="pk.eyJ1Ijoi..."
            value={mapboxToken}
            onChange={(e) => setMapboxToken(e.target.value)}
            className="w-full"
          />
          <Button onClick={handleTokenSubmit} className="w-full">
            Load Map
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2"></div>
          <p className="text-sm text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full relative">
      <div ref={mapContainer} className="w-full h-full rounded-lg" />
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg text-sm font-medium text-gray-700 shadow-lg">
        {buddies.length} Travel Buddies Nearby
      </div>
    </div>
  );
};

export default TravelBuddyMapbox;