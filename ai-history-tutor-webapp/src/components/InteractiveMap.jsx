import React, { useState, useEffect } from 'react';

const InteractiveMap = ({ locations, title }) => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);
  
  // Validate locations data
  const validLocations = Array.isArray(locations) ? locations.filter(loc => 
    loc && typeof loc === 'object' && loc.name && 
    (loc.coordinates || (loc.latitude && loc.longitude))
  ) : [];
  
  useEffect(() => {
    // Don't attempt to load map if there are no valid locations
    if (validLocations.length === 0) {
      return;
    }
    
    // Load Google Maps script dynamically
    const loadGoogleMapsScript = () => {
      try {
        if (window.google && window.google.maps) {
          initializeMap();
          return;
        }
        
        // Create a placeholder for the map while loading
        const mapContainer = document.getElementById('map-container');
        if (mapContainer) {
          mapContainer.innerHTML = '<div class="flex items-center justify-center h-full bg-[#2A2A2A]"><div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-primary"></div></div>';
        }
        
        // Use a fallback static map since we don't have an API key
        setMapError(true);
        setMapLoaded(true);
      } catch (error) {
        console.error('Error loading Google Maps:', error);
        setMapError(true);
      }
    };
    
    // Initialize map when script is loaded
    const initializeMap = () => {
      try {
        if (!validLocations.length || !document.getElementById('map-container')) {
          return;
        }
        
        const bounds = new window.google.maps.LatLngBounds();
        const map = new window.google.maps.Map(document.getElementById('map-container'), {
          zoom: 2,
          center: { lat: 0, lng: 0 },
          mapTypeId: 'terrain',
          styles: [
            { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
            { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
            { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
            {
              featureType: 'administrative.locality',
              elementType: 'labels.text.fill',
              stylers: [{ color: '#d59563' }],
            },
            {
              featureType: 'poi',
              elementType: 'labels.text.fill',
              stylers: [{ color: '#d59563' }],
            },
            {
              featureType: 'poi.park',
              elementType: 'geometry',
              stylers: [{ color: '#263c3f' }],
            },
            {
              featureType: 'poi.park',
              elementType: 'labels.text.fill',
              stylers: [{ color: '#6b9a76' }],
            },
            {
              featureType: 'road',
              elementType: 'geometry',
              stylers: [{ color: '#38414e' }],
            },
            {
              featureType: 'road',
              elementType: 'geometry.stroke',
              stylers: [{ color: '#212a37' }],
            },
            {
              featureType: 'road',
              elementType: 'labels.text.fill',
              stylers: [{ color: '#9ca5b3' }],
            },
            {
              featureType: 'road.highway',
              elementType: 'geometry',
              stylers: [{ color: '#746855' }],
            },
            {
              featureType: 'road.highway',
              elementType: 'geometry.stroke',
              stylers: [{ color: '#1f2835' }],
            },
            {
              featureType: 'road.highway',
              elementType: 'labels.text.fill',
              stylers: [{ color: '#f3d19c' }],
            },
            {
              featureType: 'transit',
              elementType: 'geometry',
              stylers: [{ color: '#2f3948' }],
            },
            {
              featureType: 'transit.station',
              elementType: 'labels.text.fill',
              stylers: [{ color: '#d59563' }],
            },
            {
              featureType: 'water',
              elementType: 'geometry',
              stylers: [{ color: '#17263c' }],
            },
            {
              featureType: 'water',
              elementType: 'labels.text.fill',
              stylers: [{ color: '#515c6d' }],
            },
            {
              featureType: 'water',
              elementType: 'labels.text.stroke',
              stylers: [{ color: '#17263c' }],
            },
          ],
        });
        
        // Add markers for each location
        const markers = validLocations.map(location => {
          const position = location.coordinates 
            ? { lat: location.coordinates.lat, lng: location.coordinates.lng }
            : { lat: parseFloat(location.latitude), lng: parseFloat(location.longitude) };
          
          const marker = new window.google.maps.Marker({
            position,
            map,
            title: location.name,
            animation: window.google.maps.Animation.DROP,
            icon: {
              path: window.google.maps.SymbolPath.CIRCLE,
              fillColor: '#4F46E5',
              fillOpacity: 1,
              strokeColor: '#FFFFFF',
              strokeWeight: 2,
              scale: 8,
            },
          });
          
          // Add info window
          const infoWindow = new window.google.maps.InfoWindow({
            content: `
              <div style="color: #333; padding: 8px;">
                <h3 style="font-weight: bold; margin-bottom: 4px;">${location.name}</h3>
                ${location.description ? `<p style="margin: 0;">${location.description}</p>` : ''}
              </div>
            `,
          });
          
          // Add click listener
          marker.addListener('click', () => {
            // Close any open info windows
            markers.forEach(m => m.infoWindow.close());
            
            // Open this info window
            infoWindow.open(map, marker);
            
            // Update selected location
            setSelectedLocation(location);
          });
          
          // Extend bounds to include this marker
          bounds.extend(position);
          
          // Store info window with marker for easy access
          marker.infoWindow = infoWindow;
          
          return marker;
        });
        
        // Fit map to bounds
        map.fitBounds(bounds);
        
        // Set minimum zoom level
        const listener = window.google.maps.event.addListener(map, 'idle', () => {
          if (map.getZoom() > 12) {
            map.setZoom(12);
          }
          window.google.maps.event.removeListener(listener);
        });
        
        setMapLoaded(true);
      } catch (error) {
        console.error('Error initializing map:', error);
        setMapError(true);
        setMapLoaded(true);
      }
    };
    
    loadGoogleMapsScript();
  }, [validLocations]);
  
  // Don't render if no locations
  if (validLocations.length === 0) {
    return null;
  }
  
  return (
    <div className="mb-8">
      <h3 className="text-2xl font-bold text-white mb-4">Historical Locations</h3>
      
      <div className="bg-[#1E1E1E] rounded-lg overflow-hidden">
        {/* Map Container */}
        <div 
          id="map-container" 
          className="w-full h-[400px] relative"
        >
          {mapError && (
            <div className="absolute inset-0 bg-[#2A2A2A] flex flex-col items-center justify-center p-4">
              <img 
                src={`https://source.unsplash.com/random/800x400/?map,${encodeURIComponent(title || 'historical')}`} 
                alt="Map placeholder" 
                className="w-full h-full object-cover opacity-50"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 p-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-accent-primary mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                <h4 className="text-xl font-bold text-white mb-2">Interactive Map Unavailable</h4>
                <p className="text-gray-300 text-center">
                  The interactive map could not be loaded. Below is a list of important locations.
                </p>
              </div>
            </div>
          )}
        </div>
        
        {/* Locations List */}
        <div className="p-4">
          <h4 className="text-lg font-semibold text-white mb-3">Key Locations</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {validLocations.map((location, index) => (
              <div 
                key={index}
                className={`p-3 rounded-lg transition-colors cursor-pointer ${
                  selectedLocation === location
                    ? 'bg-accent-primary/20 border border-accent-primary'
                    : 'bg-[#2A2A2A] hover:bg-[#3A3A3A] border border-transparent'
                }`}
                onClick={() => setSelectedLocation(location)}
              >
                <h5 className="font-semibold text-white">{location.name}</h5>
                {location.description && (
                  <p className="text-gray-400 text-sm mt-1">{location.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveMap;
