import React, { useEffect, useRef } from 'react';

interface MapComponentProps {
  location?: string;
  className?: string;
}

export const MapComponent: React.FC<MapComponentProps> = ({ 
  location = "Manila, Philippines", 
  className = "" 
}) => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Simulate map loading with a placeholder
    // In a real implementation, you'd integrate with Mapbox or Google Maps
    if (mapRef.current) {
      mapRef.current.innerHTML = `
        <div class="w-full h-full bg-slate-800 rounded-xl flex items-center justify-center relative overflow-hidden">
          <div class="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-slate-900/60"></div>
          <div class="relative z-10 text-center text-white">
            <div class="w-6 h-6 bg-blue-500 rounded-full mx-auto mb-2 animate-pulse"></div>
            <p class="text-sm font-medium">${location}</p>
            <p class="text-xs text-slate-300 mt-1">Interactive Map</p>
          </div>
          <div class="absolute top-2 right-2">
            <div class="bg-black/40 backdrop-blur-sm rounded-lg px-2 py-1">
              <span class="text-xs text-white">📍</span>
            </div>
          </div>
        </div>
      `;
    }
  }, [location]);

  return (
    <div className={`h-48 w-full rounded-xl shadow-lg overflow-hidden ${className}`}>
      <div ref={mapRef} className="w-full h-full"></div>
    </div>
  );
};
