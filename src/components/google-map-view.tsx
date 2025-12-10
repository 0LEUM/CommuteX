'use client';

import { useState, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, DirectionsService, DirectionsRenderer, MarkerF } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '100%',
  minHeight: '250px',
  borderRadius: '0.5rem',
};

// Default center to a location in India
const center = {
  lat: 20.5937,
  lng: 78.9629, 
};

interface GoogleMapViewProps {
  startLocation: string;
  endLocation: string;
}

export default function GoogleMapView({ startLocation, endLocation }: GoogleMapViewProps) {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
  });

  const [directionsResponse, setDirectionsResponse] = useState<google.maps.DirectionsResult | null>(null);
  const [directionsError, setDirectionsError] = useState<string | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);

  useEffect(() => {
    // Reset state when locations change
    setDirectionsResponse(null);
    setDirectionsError(null);
  }, [startLocation, endLocation]);

  useEffect(() => {
    if (map && directionsResponse?.routes?.[0]?.bounds) {
        map.fitBounds(directionsResponse.routes[0].bounds);
    }
  }, [map, directionsResponse]);

  const directionsCallback = (
    response: google.maps.DirectionsResult | null,
    status: google.maps.DirectionsStatus
  ) => {
    if (status === 'OK' && response) {
      setDirectionsResponse(response);
      setDirectionsError(null);
    } else {
      console.error(`Directions request failed due to ${status}`);
      if (status === 'ZERO_RESULTS') {
        setDirectionsError('Could not find a route for the given locations. Please try different addresses.');
      } else {
        setDirectionsError('An error occurred while fetching the route.');
      }
    }
  };

  if (loadError) {
    return (
      <div className="flex h-full min-h-[200px] items-center justify-center text-center text-destructive">
        Error loading maps. Please check your API key and configuration.
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex h-full min-h-[200px] items-center justify-center">
        <p className="text-center text-muted-foreground">Loading Map...</p>
      </div>
    );
  }
  
  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={5} // Zoom out to see more of India initially
      onLoad={setMap}
      options={{
        disableDefaultUI: true,
        zoomControl: true,
      }}
    >
      {directionsError && (
        <div className="p-4 text-center text-sm text-destructive">{directionsError}</div>
      )}

      {startLocation && endLocation && !directionsResponse && (
        <DirectionsService
          options={{
            destination: endLocation,
            origin: startLocation,
            travelMode: google.maps.TravelMode.DRIVING,
          }}
          callback={directionsCallback}
        />
      )}

      {directionsResponse && (
        <>
            <DirectionsRenderer
                options={{
                    directions: directionsResponse,
                    suppressMarkers: true, // Suppress default markers
                    polylineOptions: {
                        strokeColor: 'hsl(var(--primary))',
                        strokeWeight: 5,
                        strokeOpacity: 0.8,
                    }
                }}
            />
            {/* Custom Start Marker */}
            {directionsResponse.routes[0]?.legs[0]?.start_location && (
                <MarkerF position={directionsResponse.routes[0].legs[0].start_location} label="A" />
            )}
             {/* Custom End Marker */}
            {directionsResponse.routes[0]?.legs[0]?.end_location && (
                <MarkerF position={directionsResponse.routes[0].legs[0].end_location} label="B" />
            )}
        </>
      )}
    </GoogleMap>
  );
}
