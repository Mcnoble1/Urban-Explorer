import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { Location } from '../types/location';

interface Map3DProps {
  locations: Location[];
  currentIndex: number;
}

export const Map3D = forwardRef<any, Map3DProps>(({ locations, currentIndex }, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  useImperativeHandle(ref, () => mapRef.current);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const initMap = async () => {
      const mapElement = document.createElement('gmp-map-3d');
      mapElement.style.width = '100%';
      mapElement.style.height = '100%';
      
      // Set initial view to world view
      mapElement.setAttribute('center', '0,0,25000000');
      mapElement.setAttribute('tilt', '0');
      mapElement.setAttribute('heading', '0');

      containerRef.current?.appendChild(mapElement);
      mapRef.current = mapElement;

      // Create markers for all locations
      locations.forEach((location, index) => {
        const marker = document.createElement('gmp-marker-3d');
        marker.setAttribute('position', `${location.coordinates.lat},${location.coordinates.lng}`);
        marker.setAttribute('title', location.title);
        marker.setAttribute('altitude-mode', 'RELATIVE_TO_GROUND');
        
        // Add animation class based on current index
        marker.classList.add(index === currentIndex ? 'marker-active' : 'marker-inactive');
        
        mapElement.appendChild(marker);
        markersRef.current.push(marker);
      });
    };

    initMap();

    return () => {
      markersRef.current = [];
      mapRef.current = null;
    };
  }, [locations]);

  // Update marker animations when current index changes
  useEffect(() => {
    markersRef.current.forEach((marker, index) => {
      marker.classList.remove('marker-active', 'marker-inactive');
      marker.classList.add(index === currentIndex ? 'marker-active' : 'marker-inactive');
    });
  }, [currentIndex]);

  return (
    <div ref={containerRef} className="w-full h-full relative">
      <style>
        {`
          .marker-active {
            animation: bounce 1s infinite;
          }
          .marker-inactive {
            opacity: 0.6;
          }
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
        `}
      </style>
    </div>
  );
});