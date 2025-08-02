import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DollarSign, Plane, Clock } from 'lucide-react';

// Import Earth textures
import earthDayTexture from '@/assets/earth-day.jpg';
import earthNightTexture from '@/assets/earth-night.jpg';
import earthCloudsTexture from '@/assets/earth-clouds.jpg';
import earthNormalTexture from '@/assets/earth-normal.jpg';

// Flight data interface
interface Flight {
  id: number;
  from: { lat: number; lng: number; city: string };
  to: { lat: number; lng: number; city: string };
  price: number;
  duration: string;
  airline: string;
  departure: string;
  arrival: string;
  stops: string;
}

interface EarthGlobeProps {
  flights: Flight[];
  onFlightSelect: (flight: Flight) => void;
  selectedFlight: Flight | null;
}

// Convert lat/lng to 3D coordinates
const latLngToVector3 = (lat: number, lng: number, radius: number = 2) => {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
};

// Earth component with realistic textures
const Earth: React.FC = () => {
  const earthRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);
  
  // Load textures
  const [dayTexture, nightTexture, cloudsTexture, normalTexture] = useTexture([
    earthDayTexture,
    earthNightTexture,
    earthCloudsTexture,
    earthNormalTexture
  ]);

  // Animate Earth rotation
  useFrame(() => {
    if (earthRef.current) {
      earthRef.current.rotation.y += 0.002;
    }
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += 0.0025;
    }
  });

  return (
    <>
      {/* Earth surface */}
      <mesh ref={earthRef}>
        <sphereGeometry args={[2, 64, 64]} />
        <meshPhongMaterial
          map={dayTexture}
          normalMap={normalTexture}
          shininess={1}
        />
      </mesh>
      
      {/* Clouds layer */}
      <mesh ref={cloudsRef}>
        <sphereGeometry args={[2.01, 64, 64]} />
        <meshPhongMaterial
          map={cloudsTexture}
          transparent={true}
          opacity={0.3}
        />
      </mesh>
      
      {/* Atmosphere glow */}
      <mesh>
        <sphereGeometry args={[2.1, 64, 64]} />
        <meshBasicMaterial
          color="#87CEEB"
          transparent={true}
          opacity={0.1}
          side={THREE.BackSide}
        />
      </mesh>
    </>
  );
};

// Flight route visualization
const FlightRoute: React.FC<{ 
  from: { lat: number; lng: number };
  to: { lat: number; lng: number };
  color?: string;
  animated?: boolean;
}> = ({ from, to, color = '#FF6B35', animated = true }) => {
  const lineRef = useRef<THREE.Mesh>(null);
  
  const fromPos = latLngToVector3(from.lat, from.lng);
  const toPos = latLngToVector3(to.lat, to.lng);
  
  // Create curved path
  const midPoint = fromPos.clone().add(toPos).normalize().multiplyScalar(2.5);
  const curve = new THREE.QuadraticBezierCurve3(fromPos, midPoint, toPos);
  const points = curve.getPoints(50);
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  
  useFrame(({ clock }) => {
    if (lineRef.current && animated) {
      const material = lineRef.current.material as THREE.LineBasicMaterial;
      material.opacity = 0.5 + 0.3 * Math.sin(clock.elapsedTime * 2);
    }
  });
  
  return (
    <primitive object={new THREE.Line(geometry, new THREE.LineBasicMaterial({ 
      color, 
      transparent: true, 
      opacity: 0.8 
    }))} />
  );
};

// Destination marker
const DestinationMarker: React.FC<{
  position: THREE.Vector3;
  flight: Flight;
  onClick: () => void;
  isSelected: boolean;
}> = ({ position, flight, onClick, isSelected }) => {
  const markerRef = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    if (markerRef.current) {
      markerRef.current.scale.setScalar(
        isSelected ? 1.2 + 0.2 * Math.sin(clock.elapsedTime * 4) : 1
      );
    }
  });
  
  return (
    <mesh
      ref={markerRef}
      position={position}
      onClick={onClick}
    >
      <sphereGeometry args={[0.05, 16, 16]} />
      <meshBasicMaterial color={isSelected ? '#FFD700' : '#FF6B35'} />
    </mesh>
  );
};

// Main EarthGlobe component
const EarthGlobe: React.FC<EarthGlobeProps> = ({ flights, onFlightSelect, selectedFlight }) => {
  const [autoRotate, setAutoRotate] = useState(true);
  
  return (
    <div className="relative w-full h-full bg-gradient-to-b from-slate-900 to-black">
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
        {/* Lighting */}
        <ambientLight intensity={0.2} />
        <directionalLight
          position={[5, 5, 5]}
          intensity={1}
          castShadow
        />
        <pointLight position={[-5, -5, -5]} intensity={0.5} color="#4169E1" />
        
        {/* Earth */}
        <Earth />
        
        {/* Flight routes */}
        {flights.map((flight) => (
          <FlightRoute
            key={flight.id}
            from={flight.from}
            to={flight.to}
            animated={selectedFlight?.id === flight.id}
          />
        ))}
        
        {/* Destination markers */}
        {flights.map((flight) => {
          const position = latLngToVector3(flight.to.lat, flight.to.lng);
          return (
            <DestinationMarker
              key={flight.id}
              position={position}
              flight={flight}
              onClick={() => onFlightSelect(flight)}
              isSelected={selectedFlight?.id === flight.id}
            />
          );
        })}
        
        {/* Origin marker (New York) */}
        <mesh position={latLngToVector3(40.7128, -74.006)}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshBasicMaterial color="#DC2626" />
        </mesh>
        
        {/* Controls */}
        <OrbitControls
          autoRotate={autoRotate}
          autoRotateSpeed={0.5}
          enablePan={false}
          minDistance={3}
          maxDistance={10}
          onStart={() => setAutoRotate(false)}
          onEnd={() => setTimeout(() => setAutoRotate(true), 5000)}
        />
      </Canvas>
      
      {/* Flight details overlay */}
      {selectedFlight && (
        <div className="absolute bottom-4 left-4 right-4 z-10">
          <Card className="p-4 bg-background/95 backdrop-blur-sm border-primary">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Plane className="w-5 h-5 text-primary" />
                <span className="font-semibold text-lg">
                  {selectedFlight.from.city} → {selectedFlight.to.city}
                </span>
              </div>
              <button 
                onClick={() => onFlightSelect(null as any)}
                className="text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-green-600" />
                <div>
                  <div className="text-sm text-muted-foreground">Price</div>
                  <div className="font-bold text-lg">${selectedFlight.price}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600" />
                <div>
                  <div className="text-sm text-muted-foreground">Duration</div>
                  <div className="font-semibold">{selectedFlight.duration}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Plane className="w-4 h-4 text-purple-600" />
                <div>
                  <div className="text-sm text-muted-foreground">Airline</div>
                  <div className="font-semibold">{selectedFlight.airline}</div>
                </div>
              </div>
              
              <div>
                <div className="text-sm text-muted-foreground">Schedule</div>
                <div className="font-semibold text-sm">
                  {selectedFlight.departure} - {selectedFlight.arrival}
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button className="flex-1">
                Book This Flight - ${selectedFlight.price}
              </Button>
              <Button variant="outline" onClick={() => onFlightSelect(null as any)}>
                Compare Others
              </Button>
            </div>
          </Card>
        </div>
      )}
      
      {/* Controls legend */}
      <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm rounded-lg p-3 text-sm">
        <div className="text-foreground font-medium mb-1">Controls</div>
        <div className="text-muted-foreground space-y-1">
          <div>• Drag to rotate</div>
          <div>• Scroll to zoom</div>
          <div>• Click markers for details</div>
        </div>
      </div>
    </div>
  );
};

export default EarthGlobe;
