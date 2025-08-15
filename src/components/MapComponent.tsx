import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface MapComponentProps {
  longitude?: number;
  latitude?: number;
  location?: string;
  className?: string;
}

const MapComponent: React.FC<MapComponentProps> = ({ 
  longitude = 36.8219, 
  latitude = -1.2921, 
  location = "Kenya",
  className = "w-full h-64 rounded-lg"
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    // For demo purposes, using a placeholder token
    // In production, this should be set via environment variables
    mapboxgl.accessToken = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA';
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [longitude, latitude],
      zoom: 12,
    });

    // Add a marker
    new mapboxgl.Marker({
      color: '#16a34a' // Green color for conservation theme
    })
      .setLngLat([longitude, latitude])
      .addTo(map.current);

    // Add popup with location info
    new mapboxgl.Popup()
      .setLngLat([longitude, latitude])
      .setHTML(`<div class="p-2"><strong>${location}</strong><br/>Experience Location</div>`)
      .addTo(map.current);

    // Cleanup
    return () => {
      map.current?.remove();
    };
  }, [longitude, latitude, location]);

  return (
    <div className={className}>
      <div ref={mapContainer} className="w-full h-full rounded-lg" />
      <p className="text-xs text-muted-foreground mt-2 text-center">
        Interactive map showing experience location
      </p>
    </div>
  );
};

export default MapComponent;