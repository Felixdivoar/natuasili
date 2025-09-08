import React, { useEffect, useRef, useState } from 'react';
import { MapPin } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface GoogleMapProps {
  location: string;
  coordinates?: [number, number]; // [lat, lng] - note: Google Maps uses lat,lng order
  height?: string;
}

declare global {
  interface Window {
    google: any;
    initGoogleMap: () => void;
  }
}

const GoogleMap: React.FC<GoogleMapProps> = ({ 
  location, 
  coordinates = [-1.2921, 36.7378], // Default to Nairobi coordinates [lat, lng]
  height = "h-64"
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const [mapReady, setMapReady] = useState(false);
  const [error, setError] = useState<string>('');
  const [apiKey, setApiKey] = useState<string>('');

  // Fetch Google Maps API key from Supabase edge function
  useEffect(() => {
    const fetchApiKey = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('get-maps-config');
        
        if (error) {
          console.error('Error fetching maps config:', error);
          setError('Failed to load map configuration');
          return;
        }

        if (data?.apiKey) {
          setApiKey(data.apiKey);
        } else {
          setError('Google Maps API key not available');
        }
      } catch (err) {
        console.error('Error:', err);
        setError('Failed to load map');
      }
    };

    fetchApiKey();
  }, []);

  // Initialize Google Maps when API key is available
  useEffect(() => {
    if (!apiKey || !mapContainer.current) return;

    const initMap = () => {
      if (window.google && window.google.maps) {
        const [lat, lng] = coordinates;
        
        const map = new window.google.maps.Map(mapContainer.current, {
          center: { lat, lng },
          zoom: 15,
          styles: [
            {
              featureType: 'all',
              elementType: 'geometry.fill',
              stylers: [{ color: '#f8f9fa' }]
            },
            {
              featureType: 'water',
              elementType: 'geometry',
              stylers: [{ color: '#e0f2fe' }]
            }
          ],
          mapTypeControl: false,
          streetViewControl: true,
          fullscreenControl: true,
          zoomControl: true,
        });

        // Add marker
        new window.google.maps.Marker({
          position: { lat, lng },
          map: map,
          title: location,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: '#059669',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 2,
          }
        });

        // Add info window
        const infoWindow = new window.google.maps.InfoWindow({
          content: `<div style="padding: 8px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
            <strong style="color: #1f2937;">${location}</strong>
          </div>`
        });

        // Add click listener to marker
        const marker = new window.google.maps.Marker({
          position: { lat, lng },
          map: map,
          title: location,
        });

        marker.addListener('click', () => {
          infoWindow.open(map, marker);
        });

        mapInstance.current = map;
        setMapReady(true);
        setError('');
      } else {
        setError('Google Maps failed to load');
      }
    };

    // Load Google Maps script
    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = initMap;
      script.onerror = () => setError('Failed to load Google Maps');
      document.head.appendChild(script);
    } else {
      initMap();
    }

    return () => {
      // Cleanup if needed
    };
  }, [apiKey, coordinates, location]);

  if (error) {
    return (
      <div className={`${height} bg-muted rounded-lg flex items-center justify-center p-6`}>
        <div className="text-center space-y-2">
          <MapPin className="h-8 w-8 mx-auto text-red-500 mb-2" />
          <p className="text-sm text-red-600">{error}</p>
          <p className="text-xs text-muted-foreground">Please check your Google Maps API configuration</p>
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
            <p className="text-sm text-muted-foreground">Loading Google Map...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoogleMap;