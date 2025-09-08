import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';
import 'mapbox-gl/dist/mapbox-gl.css';

interface InteractiveMapProps {
  location: string;
  coordinates?: [number, number]; // [lng, lat]
  height?: string;
  showTokenInput?: boolean;
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({ 
  location, 
  coordinates = [36.7378, -1.2921], // Default to Nairobi coordinates
  height = "h-64",
  showTokenInput = true 
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string>('');
  const [mapReady, setMapReady] = useState(false);
  const [tokenError, setTokenError] = useState(false);

  // Try to get token from environment or localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('mapbox_token');
    if (storedToken) {
      setMapboxToken(storedToken);
    }
  }, []);

  const initializeMap = (token: string) => {
    if (!mapContainer.current || !token) return;

    try {
      mapboxgl.accessToken = token;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: coordinates,
        zoom: 15,
        pitch: 45,
      });

      // Add navigation controls
      map.current.addControl(
        new mapboxgl.NavigationControl({
          visualizePitch: true,
        }),
        'top-right'
      );

      // Add marker for the location
      new mapboxgl.Marker({
        color: '#059669', // Tailwind green-600
        scale: 1.2
      })
        .setLngLat(coordinates)
        .setPopup(
          new mapboxgl.Popup({ offset: 25 })
            .setHTML(`<div class="p-2"><strong>${location}</strong></div>`)
        )
        .addTo(map.current);

      map.current.on('load', () => {
        setMapReady(true);
        setTokenError(false);
        // Save working token
        localStorage.setItem('mapbox_token', token);
      });

      map.current.on('error', () => {
        setTokenError(true);
        setMapReady(false);
      });

    } catch (error) {
      console.error('Error initializing map:', error);
      setTokenError(true);
      setMapReady(false);
    }
  };

  const handleTokenSubmit = () => {
    if (mapboxToken.trim()) {
      initializeMap(mapboxToken.trim());
    }
  };

  // Initialize map when token is available
  useEffect(() => {
    if (mapboxToken && !map.current) {
      initializeMap(mapboxToken);
    }
  }, [mapboxToken, coordinates]);

  // Cleanup
  useEffect(() => {
    return () => {
      map.current?.remove();
    };
  }, []);

  // If no token and showing input
  if (!mapboxToken && showTokenInput) {
    return (
      <div className={`${height} bg-muted rounded-lg flex items-center justify-center p-6`}>
        <div className="text-center max-w-md space-y-4">
          <MapPin className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
          <h3 className="font-semibold text-foreground">Interactive Map Setup</h3>
          <p className="text-sm text-muted-foreground">
            To display an interactive map, please enter your Mapbox public token.
            Get one free at <a href="https://mapbox.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">mapbox.com</a>
          </p>
          <div className="flex gap-2">
            <Input
              placeholder="pk.eyJ1IjoiY..."
              value={mapboxToken}
              onChange={(e) => setMapboxToken(e.target.value)}
              className="text-xs"
            />
            <Button onClick={handleTokenSubmit} size="sm">
              Load Map
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // If token error
  if (tokenError) {
    return (
      <div className={`${height} bg-muted rounded-lg flex items-center justify-center p-6`}>
        <div className="text-center space-y-2">
          <MapPin className="h-8 w-8 mx-auto text-red-500 mb-2" />
          <p className="text-sm text-red-600">Invalid Mapbox token. Please check your token and try again.</p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => {
              setMapboxToken('');
              localStorage.removeItem('mapbox_token');
            }}
          >
            Enter New Token
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`${height} rounded-lg overflow-hidden border relative`}>
      <div ref={mapContainer} className="w-full h-full" />
      {!mapReady && (
        <div className="absolute inset-0 bg-muted/80 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-sm text-muted-foreground">Loading map...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default InteractiveMap;