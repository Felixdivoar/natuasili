import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

interface MapComponentProps {
  longitude?: number;
  latitude?: number;
  location?: string;
  className?: string;
  partnerHQLat?: number;
  partnerHQLng?: number;
  partnerName?: string;
  showDirectionsButton?: boolean;
}

const MapComponent: React.FC<MapComponentProps> = ({ 
  longitude = 36.8219, 
  latitude = -1.2921, 
  location = "Kenya",
  className = "w-full h-64 rounded-lg",
  partnerHQLat,
  partnerHQLng,
  partnerName,
  showDirectionsButton = true
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  const openDirections = () => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const url = isMobile 
      ? `maps://maps.google.com/maps?daddr=${latitude},${longitude}`
      : `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    
    window.open(url, '_blank');
  };

  useEffect(() => {
    if (!mapContainer.current) return;

    // For demo purposes, using a placeholder token
    // In production, this should be set via environment variables
    mapboxgl.accessToken = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA';
    
    // Initialize map with lazy loading
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !map.current) {
        map.current = new mapboxgl.Map({
          container: mapContainer.current!,
          style: 'mapbox://styles/mapbox/outdoors-v12',
          center: [longitude, latitude],
          zoom: 12,
          attributionControl: false
        });

        // Add navigation controls
        map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

        // Add experience location marker
        new mapboxgl.Marker({
          color: '#22c55e' // Green color for conservation theme
        })
          .setLngLat([longitude, latitude])
          .setPopup(
            new mapboxgl.Popup({ offset: 25 })
              .setHTML(`
                <div class="p-3">
                  <strong class="text-base">${location}</strong><br/>
                  <span class="text-sm text-muted-foreground">Experience Location</span>
                </div>
              `)
          )
          .addTo(map.current);

        // Add partner HQ marker if provided
        if (partnerHQLat && partnerHQLng && partnerName) {
          new mapboxgl.Marker({
            color: '#3b82f6' // Blue color for partner HQ
          })
            .setLngLat([partnerHQLng, partnerHQLat])
            .setPopup(
              new mapboxgl.Popup({ offset: 25 })
                .setHTML(`
                  <div class="p-3">
                    <strong class="text-base">${partnerName}</strong><br/>
                    <span class="text-sm text-muted-foreground">Partner Headquarters</span>
                  </div>
                `)
            )
            .addTo(map.current);

          // Fit bounds to include both markers
          const bounds = new mapboxgl.LngLatBounds()
            .extend([longitude, latitude])
            .extend([partnerHQLng, partnerHQLat]);
          
          map.current.fitBounds(bounds, { padding: 50 });
        }
      }
    });

    observer.observe(mapContainer.current);

    // Cleanup
    return () => {
      observer.disconnect();
      map.current?.remove();
    };
  }, [longitude, latitude, location, partnerHQLat, partnerHQLng, partnerName]);

  return (
    <div className={className}>
      <div ref={mapContainer} className="w-full h-full rounded-lg bg-muted" />
      <div className="flex items-center justify-between mt-3">
        <p className="text-xs text-muted-foreground">
          Interactive map • Tap markers for details
        </p>
        {showDirectionsButton && (
          <Button
            variant="outline"
            size="sm"
            onClick={openDirections}
            className="text-xs"
          >
            <ExternalLink className="h-3 w-3 mr-1" />
            Directions
          </Button>
        )}
      </div>
    </div>
  );
};

export default MapComponent;