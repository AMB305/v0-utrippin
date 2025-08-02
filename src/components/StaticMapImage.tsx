import React, { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import { generateStaticMapUrl, getDestinationCoordinates } from '@/utils/staticMapGenerator';
import { supabase } from '@/integrations/supabase/client';

interface StaticMapImageProps {
  destinationName: string;
  className?: string;
  size?: 'small' | 'medium' | 'large';
  style?: 'streets' | 'satellite' | 'outdoors' | 'light' | 'dark';
  showFallback?: boolean;
  zoom?: number;
}

export const StaticMapImage = ({ 
  destinationName, 
  className = "", 
  size = 'medium',
  style = 'satellite',
  showFallback = true,
  zoom = 10
}: StaticMapImageProps) => {
  const [mapImageUrl, setMapImageUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string>('');

  useEffect(() => {
    const fetchMapboxToken = async () => {
      try {
        console.log('🗺️ Fetching Mapbox token...');
        const { data, error } = await supabase.functions.invoke('get-mapbox-token');
        console.log('🗺️ Token response:', { data: !!data, error });
        if (error) throw error;
        if (!data?.token) throw new Error('No token received');
        console.log('🗺️ Token set successfully');
        setMapboxToken(data.token);
      } catch (error) {
        console.error('❌ Error fetching Mapbox token:', error);
        setError('Failed to load map token');
      }
    };

    fetchMapboxToken();
  }, []);

  useEffect(() => {
    const coordinates = getDestinationCoordinates(destinationName);
    console.log(`🗺️ Coordinates for ${destinationName}:`, coordinates);
    
    if (coordinates[0] === 0 && coordinates[1] === 0) {
      console.log(`❌ No coordinates found for ${destinationName}`);
      setError('No coordinates found for destination');
      setIsLoading(false);
      return;
    }

    const sizeMap = {
      small: { width: 200, height: 150 },
      medium: { width: 400, height: 300 },
      large: { width: 800, height: 600 }
    };

    const dimensions = sizeMap[size];

    // Using OpenStreetMap static map service (no API key required)
    const osmUrl = `https://staticmap.openstreetmap.de/staticmap.php?center=${coordinates[1]},${coordinates[0]}&zoom=${zoom}&size=${dimensions.width}x${dimensions.height}&maptype=mapnik&markers=${coordinates[1]},${coordinates[0]},red-pushpin`;
    
    console.log(`🗺️ Generated OSM URL for ${destinationName}:`, osmUrl);
    setMapImageUrl(osmUrl);
    setIsLoading(false);
  }, [destinationName, size, style, zoom]);

  if (isLoading) {
    return (
      <div className={`bg-slate-800 animate-pulse flex items-center justify-center ${className}`}>
        <div className="text-slate-400">
          <MapPin className="w-8 h-8 animate-pulse" />
        </div>
      </div>
    );
  }

  if (error && showFallback) {
    return (
      <div className={`bg-gradient-to-br from-slate-800 to-slate-700 flex items-center justify-center ${className}`}>
        <div className="text-center text-slate-400">
          <MapPin className="w-8 h-8 mx-auto mb-2" />
          <p className="text-xs">{destinationName}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return null;
  }

  return (
    <>
      <img
        src={mapImageUrl}
        alt={`Map of ${destinationName}`}
        className={`object-cover ${className}`}
        onError={(e) => {
          console.error(`❌ Failed to load static map for ${destinationName}:`, mapImageUrl);
          setError('Failed to load map image');
        }}
        onLoad={() => {
          console.log(`✅ Successfully loaded static map for ${destinationName}`);
        }}
      />
      {error && showFallback && (
        <div className={`bg-gradient-to-br from-slate-800 to-slate-700 flex items-center justify-center ${className}`} style={{ display: 'none' }}>
          <div className="text-center text-slate-400">
            <MapPin className="w-8 h-8 mx-auto mb-2" />
            <p className="text-xs">{destinationName}</p>
          </div>
        </div>
      )}
    </>
  );
};
