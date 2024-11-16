import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { useLocationStore } from '../store/useLocationStore';
import { MapControls } from './MapControls';
import { LocationOverlay } from './LocationOverlay';
import { GemOverlay } from './GemOverlay';

interface MapProps {
  center: { lat: number; lng: number };
}

export const Map: React.FC<MapProps> = ({ center }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const map3DElementRef = useRef<any>(null);
  const loaderRef = useRef<Loader>();
  const [showGem, setShowGem] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [autoOrbit, setAutoOrbit] = useState(false);
  const [showFunFact, setShowFunFact] = useState(false);
  const { visitLocation } = useLocationStore();
  const markerRef = useRef<any>(null);
  const polygonRef = useRef<any>(null);
  const orbitIntervalRef = useRef<number>();
  const [gemPosition, setGemPosition] = useState({ x: 0, y: 0 });

  const getFunFact = () => {
    const facts = [
      "This location is known for its unique architectural style that blends modern and traditional elements.",
      "Local legends say this spot was once a gathering place for artists and musicians in the early 20th century.",
      "The surrounding area features some of the city's oldest trees, planted over 100 years ago.",
      "This location offers one of the best viewpoints for watching the sunset in the city.",
    ];
    return facts[Math.floor(Math.random() * facts.length)];
  };

  const updateMapView = (mapContainer: any, newCenter: { lat: number; lng: number }) => {
    mapContainer.setAttribute('center', `${newCenter.lat},${newCenter.lng},300`);
    mapContainer.setAttribute('tilt', '45');
    mapContainer.setAttribute('heading', '0');
    mapContainer.setAttribute('range', '500');
  };

  const createPolygon = async (mapContainer: any, center: { lat: number; lng: number }) => {
    const polygon = document.createElement('gmp-polygon-3d');
    polygon.setAttribute('altitude-mode', 'clamp-to-ground');
    polygon.setAttribute('fill-color', 'rgba(99, 102, 241, 0.2)');
    polygon.setAttribute('stroke-color', 'rgb(99, 102, 241)');
    polygon.setAttribute('stroke-width', '4');
    polygon.setAttribute('draws-occluded-segments', '');

    await customElements.whenDefined(polygon.localName);
    
    const radius = 0.0005;
    const points = [];
    for (let i = 0; i <= 360; i += 45) {
      const angle = (i * Math.PI) / 180;
      points.push({
        lat: center.lat + radius * Math.cos(angle),
        lng: center.lng + radius * Math.sin(angle),
      });
    }
    points.push(points[0]);
    
    polygon.outerCoordinates = points;
    mapContainer.appendChild(polygon);
    return polygon;
  };

  useEffect(() => {
    let isMounted = true;

    const initMap = async () => {
      try {
        if (!loaderRef.current) {
          loaderRef.current = new Loader({
            apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
            version: 'alpha',
            libraries: ['maps3d', 'elevation', 'places'],
          });
        }

        await loaderRef.current.load();

        if (!mapRef.current || !isMounted) return;

        let mapContainer = map3DElementRef.current;
        
        if (!mapContainer) {
          mapContainer = document.createElement('gmp-map-3d');
          mapContainer.style.width = '100%';
          mapContainer.style.height = '100%';
          mapContainer.style.position = 'absolute';
          mapContainer.style.inset = '0';
          if (!showLabels) {
            mapContainer.setAttribute('default-labels-disabled', '');
          }
          
          if (mapRef.current.firstChild) {
            mapRef.current.removeChild(mapRef.current.firstChild);
          }
          mapRef.current.appendChild(mapContainer);
          map3DElementRef.current = mapContainer;
        }

        updateMapView(mapContainer, center);

        if (markerRef.current) {
          mapContainer.removeChild(markerRef.current);
        }
        if (polygonRef.current) {
          mapContainer.removeChild(polygonRef.current);
        }

        polygonRef.current = await createPolygon(mapContainer, center);

        const marker = document.createElement('gmp-marker-3d');
        marker.setAttribute('position', `${center.lat},${center.lng},50`);
        marker.setAttribute('title', 'Selected Location');
        marker.setAttribute('altitude-mode', 'RELATIVE_TO_GROUND');
        marker.setAttribute('extruded', 'true');
        mapContainer.appendChild(marker);
        markerRef.current = marker;

        const mapRect = mapRef.current.getBoundingClientRect();
        setGemPosition({
          x: mapRect.width * 0.75,
          y: mapRect.height * 0.25,
        });

        marker.addEventListener('click', () => {
          setShowFunFact(true);
        });

      } catch (error) {
        console.error('Error initializing map:', error);
      }
    };

    initMap();

    return () => {
      isMounted = false;
      if (orbitIntervalRef.current) {
        clearInterval(orbitIntervalRef.current);
      }
    };
  }, [center, showLabels]);

  useEffect(() => {
    if (autoOrbit && map3DElementRef.current) {
      orbitIntervalRef.current = window.setInterval(() => {
        const currentHeading = parseFloat(map3DElementRef.current.getAttribute('heading')) || 0;
        map3DElementRef.current.setAttribute('heading', ((currentHeading + 1) % 360).toString());
      }, 100);
    } else if (orbitIntervalRef.current) {
      clearInterval(orbitIntervalRef.current);
    }

    return () => {
      if (orbitIntervalRef.current) {
        clearInterval(orbitIntervalRef.current);
      }
    };
  }, [autoOrbit]);

  const handleToggleLabels = () => {
    setShowLabels(!showLabels);
    if (map3DElementRef.current) {
      if (showLabels) {
        map3DElementRef.current.setAttribute('default-labels-disabled', '');
      } else {
        map3DElementRef.current.removeAttribute('default-labels-disabled');
      }
    }
  };

  const handleGemClick = () => {
    setShowGem(false);
    visitLocation('current-location');
  };

  return (
    <div ref={mapRef} className="w-full h-full relative">
      <div className="absolute inset-0 bg-gray-100 animate-pulse" />
      
      <div className="absolute inset-0 pointer-events-none">
        <div className="relative w-full h-full">
          {showFunFact && (
            <LocationOverlay
              title="Location Fun Fact"
              funFact={getFunFact()}
              onClose={() => setShowFunFact(false)}
            />
          )}

          {showGem && (
            <GemOverlay
              position={gemPosition}
              onClick={handleGemClick}
            />
          )}

          <div className="pointer-events-auto">
            <MapControls
              showLabels={showLabels}
              onToggleLabels={handleToggleLabels}
              autoOrbit={autoOrbit}
              onToggleOrbit={() => setAutoOrbit(!autoOrbit)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};