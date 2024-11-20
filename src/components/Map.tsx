import React, { useEffect, useRef, useState } from 'react';
import { useLocationStore } from '../store/useLocationStore';
import { MapControls } from './MapControls';
import { LocationOverlay } from './LocationOverlay';
import { GemOverlay } from './GemOverlay';
import { generateFunFact } from '../services/aiService';

interface MapProps {
  center?: { lat: number; lng: number };
  locationName?: string;
  onMapLoad?: (map: any) => void;
}

export const Map: React.FC<MapProps> = ({ center, locationName, onMapLoad }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const map3DElementRef = useRef<any>(null);
  const [showGem, setShowGem] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [autoOrbit, setAutoOrbit] = useState(false);
  const [showFunFact, setShowFunFact] = useState(false);
  const [funFact, setFunFact] = useState<string>('');
  const { visitLocation } = useLocationStore();
  const markerRef = useRef<any>(null);
  const polygonRef = useRef<any>(null);
  const orbitIntervalRef = useRef<number>();
  const [gemPosition, setGemPosition] = useState({ x: 0, y: 0 });

  const defaultView = {
    lat: 0,
    lng: 0,
    altitude: 25000000 // High altitude for world view
  };

  const updateMapView = async (mapContainer: any, newCenter?: { lat: number; lng: number }) => {
    if (!window.google?.maps) return;

    const elevatorService = new window.google.maps.ElevationService();
    
    try {
      if (newCenter) {
        const response = await elevatorService.getElevationForLocations({
          locations: [newCenter],
        });
        
        const elevation = response.results?.[0]?.elevation || 300;
        
        mapContainer.setAttribute('center', `${newCenter.lat},${newCenter.lng},${elevation}`);
        mapContainer.setAttribute('tilt', '45');
        mapContainer.setAttribute('heading', '0');
        mapContainer.setAttribute('range', '500');
      } else {
        // Set default world view
        mapContainer.setAttribute('center', `${defaultView.lat},${defaultView.lng},${defaultView.altitude}`);
        mapContainer.setAttribute('tilt', '0');
        mapContainer.setAttribute('heading', '0');
      }

      if (locationName) {
        const fact = await generateFunFact(locationName);
        setFunFact(fact);
        setShowFunFact(true);
      }
    } catch (error) {
      console.error('Error updating map view:', error);
    }
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
        if (!mapRef.current || !isMounted || !window.google?.maps) return;

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

          if (onMapLoad) {
            onMapLoad(mapContainer);
          }
        }

        await updateMapView(mapContainer, center);

        if (center) {
          if (markerRef.current) {
            mapContainer.removeChild(markerRef.current);
          }
          if (polygonRef.current) {
            mapContainer.removeChild(polygonRef.current);
          }

          polygonRef.current = await createPolygon(mapContainer, center);

          const marker = document.createElement('gmp-marker-3d');
          marker.setAttribute('position', `${center.lat},${center.lng},50`);
          marker.setAttribute('title', locationName || 'Selected Location');
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
        }

      } catch (error) {
        console.error('Error initializing map:', error);
      }
    };

    // Wait for Google Maps API to load
    const checkGoogleMapsLoaded = setInterval(() => {
      if (window.google?.maps) {
        clearInterval(checkGoogleMapsLoaded);
        initMap();
      }
    }, 100);

    return () => {
      isMounted = false;
      clearInterval(checkGoogleMapsLoaded);
      if (orbitIntervalRef.current) {
        clearInterval(orbitIntervalRef.current);
      }
    };
  }, [center, showLabels, onMapLoad, locationName]);

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
              funFact={funFact}
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