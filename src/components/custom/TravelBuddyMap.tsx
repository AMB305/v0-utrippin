import React, { useEffect, useRef } from 'react';

interface TravelBuddyMapProps {
  buddies: Array<{
    id: string;
    name: string;
    avatarUrl: string;
    coords: { lat: number; lng: number };
    isOnline: boolean;
  }>;
  onPinClick: (buddyId: string) => void;
}

const TravelBuddyMap: React.FC<TravelBuddyMapProps> = ({ buddies, onPinClick }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Simple map placeholder - in production would use Google Maps or Mapbox
    // For now, creating a visual representation
    const mapElement = mapContainer.current;
    mapElement.innerHTML = `
      <div class="w-full h-full bg-gradient-to-br from-blue-100 to-green-100 rounded-xl relative overflow-hidden">
        <div class="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.1"%3E%3Cpath d="m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
        <div class="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg text-sm font-medium text-gray-700">
          ${buddies.length} Travel Buddies Nearby
        </div>
      </div>
    `;

    // Add buddy pins
    buddies.forEach((buddy, index) => {
      const pin = document.createElement('div');
      pin.className = `absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 hover:scale-110 transition-transform`;
      pin.style.left = `${20 + (index * 15) % 60}%`;
      pin.style.top = `${30 + (index * 20) % 40}%`;
      pin.innerHTML = `
        <div class="relative group">
          <div class="w-12 h-12 rounded-full border-3 ${buddy.isOnline ? 'border-green-400' : 'border-gray-400'} overflow-hidden bg-white shadow-lg">
            <img src="${buddy.avatarUrl}" alt="${buddy.name}" class="w-full h-full object-cover" />
          </div>
          ${buddy.isOnline ? '<div class="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>' : ''}
          <div class="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-black/80 text-white px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
            ${buddy.name}
            <button class="ml-2 bg-red-600 hover:bg-red-700 text-white px-2 py-0.5 rounded text-xs">Connect</button>
          </div>
        </div>
      `;
      pin.onclick = () => onPinClick(buddy.id);
      mapElement.firstElementChild?.appendChild(pin);
    });

  }, [buddies, onPinClick]);

  return (
    <div className="h-full">
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
};

export default TravelBuddyMap;
