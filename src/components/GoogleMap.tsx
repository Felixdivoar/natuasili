import React, { useEffect, useRef, useState } from 'react';
import { MapPin, ExternalLink } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';

interface GoogleMapProps {
  location: string;
  coordinates?: [number, number]; // [lat, lng] - note: Google Maps uses lat,lng order
  height?: string;
  googleMapsUrl?: string;
}

declare global {
  interface Window {
    google: any;
    initGoogleMap: () => void;
    initGoogleMapCallback: () => void;
  }
}

const GoogleMap: React.FC<GoogleMapProps> = ({ 
  location, 
  coordinates = [-1.2921, 36.7378], // Default to Nairobi coordinates [lat, lng]
  height = "h-64",
  googleMapsUrl
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const [mapReady, setMapReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [apiKey, setApiKey] = useState<string>('');

  // Open directions to the location
  const openDirections = () => {
    const [lat, lng] = coordinates;
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    // Always use directions URL to get route from current location to destination
    const url = isMobile 
      ? `maps://maps.google.com/maps?daddr=${lat},${lng}&dirflg=d`
      : `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`;
    
    window.open(url, '_blank');
  };

  // Fetch Google Maps API key from Supabase edge function
  useEffect(() => {
    const fetchApiKey = async () => {
      try {
        console.log('Fetching Google Maps API key...');
        const { data, error } = await supabase.functions.invoke('get-maps-config');
        
        if (error) {
          console.error('Error fetching maps config:', error);
          setError('Failed to load map configuration');
          setIsLoading(false);
          return;
        }

        if (data?.apiKey) {
          console.log('Google Maps API key received successfully');
          setApiKey(data.apiKey);
        } else {
          console.log('No API key received from edge function');
          setError('Google Maps API key not available');
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Error fetching API key:', err);
        setError('Failed to load map');
        setIsLoading(false);
      }
    };

    fetchApiKey();
  }, []);

  // Initialize Google Maps when API key is available
  useEffect(() => {
    if (!apiKey || !mapContainer.current) return;

    const initMap = () => {
      try {
        console.log('Initializing Google Maps...');
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

          // Add info window
          const infoWindow = new window.google.maps.InfoWindow({
            content: `<div style="padding: 12px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 200px;">
              <strong style="color: #1f2937; font-size: 14px;">${location}</strong><br/>
              <span style="color: #6b7280; font-size: 12px;">Conservation Experience Location</span>
            </div>`
          });

          // Add single marker with click listener
          const marker = new window.google.maps.Marker({
            position: { lat, lng },
            map: map,
            title: location,
            icon: {
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 10,
              fillColor: '#059669',
              fillOpacity: 1,
              strokeColor: '#ffffff',
              strokeWeight: 3,
            }
          });

          marker.addListener('click', () => {
            infoWindow.open(map, marker);
          });

          mapInstance.current = map;
          setMapReady(true);
          setIsLoading(false);
          setError('');
          console.log('Google Maps initialized successfully');
        } else {
          console.error('Google Maps API not available on window object');
          setError('Google Maps failed to load');
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Error initializing map:', err);
        setError('Failed to initialize map');
        setIsLoading(false);
      }
    };

    // Load Google Maps script
    if (!window.google) {
      console.log('Loading Google Maps script...');
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initGoogleMapCallback`;
      script.async = true;
      script.defer = true;
      
      // Set up global callback
      window.initGoogleMapCallback = initMap;
      
      script.onload = () => {
        console.log('Google Maps script loaded');
      };
      
      script.onerror = (err) => {
        console.error('Failed to load Google Maps script:', err);
        setError('Failed to load Google Maps');
        setIsLoading(false);
      };
      
      document.head.appendChild(script);
    } else {
      console.log('Google Maps already loaded, initializing...');
      initMap();
    }

    return () => {
      // Cleanup callback
      if (window.initGoogleMapCallback) {
        delete window.initGoogleMapCallback;
      }
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
      {(isLoading || !mapReady) && (
        <div className="absolute inset-0 bg-muted/80 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-sm text-muted-foreground">Loading Google Map...</p>
          </div>
        </div>
      )}
      {mapReady && (
        <div className="absolute bottom-4 right-4">
          <Button
            variant="outline"
            size="sm"
            onClick={openDirections}
            className="bg-background/90 backdrop-blur-sm shadow-lg hover:bg-background"
          >
            <ExternalLink className="h-3 w-3 mr-1" />
            Directions
          </Button>
        </div>
      )}
    </div>
  );
};

export default GoogleMap;