import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapPin, Navigation, Info } from 'lucide-react';

// Fix for default marker icons
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

import { Layout } from '../../features/layout/Layout';
import { CategorySelector } from '../../features/category-selector/CategorySelector';
import { AiMoodSearch } from '../../components/AiMoodSearch';
import { ShuffleButton } from '../../features/shuffle/ShuffleButton';
import SiteButton from '../../features/SiteButton/SiteButton';
import { MOCK_LOCATIONS, Location } from '../../entities/location/api/MockLocations';
import { fetchNearbyLocations } from '../../entities/location/api/GooglePlacesService';
import { LocationPopup } from './ui/LocationPopup';
import './ui/Home.css';
import './ui/LocationRequestModal.css';

let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Custom icons for Radius Control
const centerIcon = L.divIcon({
  className: 'radius-center-icon',
  html: `<div style="background-color: #4caf50; width: 14px; height: 14px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3);"></div>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9]
});

const resizeIcon = L.divIcon({
  className: 'radius-resize-icon',
  html: `<div style="background-color: white; width: 20px; height: 20px; border-radius: 50%; border: 2px solid #4caf50; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 6px rgba(0,0,0,0.3);"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#4caf50" stroke-width="3"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg></div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12]
});

const UKRAINE_BOUNDS = { west: 22.14, east: 40.22, north: 52.38, south: 44.39 };
const isInsideUkraine = (lat: number, lon: number) => {
  return lat >= UKRAINE_BOUNDS.south && lat <= UKRAINE_BOUNDS.north &&
         lon >= UKRAINE_BOUNDS.west && lon <= UKRAINE_BOUNDS.east;
};

const ChangeView = ({ center }: { center: [number, number] }) => {
  const map = useMap();
  const prevCenter = useRef<string>("");
  useEffect(() => {
    const centerKey = `${center[0]},${center[1]}`;
    if (center && centerKey !== prevCenter.current) {
      map.flyTo(center, 14, { duration: 1.5 });
      prevCenter.current = centerKey;
    }
  }, [center, map]);
  return null;
};

const OnMapMove = ({ onMove }: { onMove: (bounds: L.LatLngBounds) => void }) => {
  const map = useMap();
  useEffect(() => {
    const handleMove = () => onMove(map.getBounds());
    map.on('moveend', handleMove);
    // Initial bounds
    handleMove();
    return () => {
      map.off('moveend', handleMove);
    };
  }, [map, onMove]);
  return null;
};

const Home: React.FC = () => {
  const savedState = JSON.parse(sessionStorage.getItem('waygo-home-state') || '{}');

  const [selectedVibe, setSelectedVibe] = useState<string | null>(savedState.vibe || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [locations, setLocations] = useState<Location[]>(savedState.locations || []);
  
  const [searchCenter, setSearchCenter] = useState<[number, number]>(savedState.center || [50.4417, 30.5153]);
  const [searchRadius, setSearchRadius] = useState(savedState.radius || 1000); 
  
  const [visualCenter, setVisualCenter] = useState<[number, number]>(searchCenter);
  const [visualRadius, setVisualRadius] = useState(searchRadius);

  const [mapCenter, setMapCenter] = useState<[number, number]>(searchCenter);
  const [mapBounds, setMapBounds] = useState<L.LatLngBounds | null>(null);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showOutsideUkraineModal, setShowOutsideUkraineModal] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  useEffect(() => {
    setVisualCenter(searchCenter);
    setVisualRadius(searchRadius);
  }, [searchCenter, searchRadius]);

  useEffect(() => {
    sessionStorage.setItem('waygo-home-state', JSON.stringify({
      center: searchCenter,
      radius: searchRadius,
      vibe: selectedVibe,
      locations: locations
    }));
  }, [searchCenter, searchRadius, selectedVibe, locations]);

  useEffect(() => {
    const hasAsked = sessionStorage.getItem('waygo-location-asked');
    if (!hasAsked && !savedState.center) {
      setShowLocationModal(true);
    }
  }, [savedState.center]);

  const loadLocations = useCallback(async (isShuffle = false) => {
    // If shuffling, we want to use the CURRENT visual center/radius (where user is looking)
    // otherwise use the search center/radius (last confirmed search)
    const activeCenter = isShuffle ? visualCenter : searchCenter;
    const activeRadius = isShuffle ? visualRadius : searchRadius;

    if (!isInsideUkraine(activeCenter[0], activeCenter[1])) {
      setLocations([]);
      return;
    }
    setIsLoading(true);
    
    // Determine limit based on radius (<= 2500m is "small")
    const limit = activeRadius <= 2500 ? 5 : 10;
    
    try {
      const allRealLocations = await fetchNearbyLocations(activeCenter, activeRadius, selectedVibe);
      
      let finalSet: Location[] = [];
      
      if (allRealLocations.length > 0) {
        // Take up to 'limit' random real locations
        finalSet = [...allRealLocations].sort(() => 0.5 - Math.random()).slice(0, limit);
        
        // If we have fewer than 5 real locations, supplement with mocks to reach at least 5
        if (finalSet.length < 5) {
          const filteredMocks = selectedVibe 
            ? MOCK_LOCATIONS.filter(loc => loc.vibes.includes(selectedVibe))
            : MOCK_LOCATIONS;
            
          const needed = 5 - finalSet.length;
          const additionalMocks = filteredMocks
            .filter(mock => !finalSet.some(f => f.id === mock.id || (f.googlePlaceId && f.googlePlaceId === mock.googlePlaceId)))
            .sort(() => 0.5 - Math.random())
            .slice(0, needed);
            
          finalSet = [...finalSet, ...additionalMocks];
        }
      } else {
        // No real locations found, use only mocks (up to limit)
        const filteredMocks = selectedVibe 
          ? MOCK_LOCATIONS.filter(loc => loc.vibes.includes(selectedVibe))
          : MOCK_LOCATIONS;
        
        finalSet = [...filteredMocks].sort(() => 0.5 - Math.random()).slice(0, limit);
      }

      setLocations(finalSet);
      if (isShuffle) {
        // When shuffling, we "confirm" the current visual center as the new search center
        setSearchCenter(activeCenter);
        setSearchRadius(activeRadius);
        if (finalSet.length > 0) {
          setMapCenter(finalSet[0].coords);
        }
      }
    } catch (error) {
      console.error('Error loading locations:', error);
    } finally {
      setIsLoading(false);
    }
  }, [searchCenter, searchRadius, visualCenter, visualRadius, selectedVibe]);

  useEffect(() => {
    if (locations.length === 0) {
      loadLocations();
    }
  }, [loadLocations, locations.length]);

  const filteredLocations = useMemo(() => {
    const center = L.latLng(visualCenter[0], visualCenter[1]);
    return locations.filter(loc => {
      const locPos = L.latLng(loc.coords[0], loc.coords[1]);
      return center.distanceTo(locPos) <= visualRadius + 100; 
    });
  }, [locations, visualCenter, visualRadius]);

  const requestCurrentLocation = useCallback(() => {
    if (navigator.geolocation) {
      setIsLoading(true);
      setSearchError(null);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const newCoords: [number, number] = [latitude, longitude];
          setVisualCenter(newCoords);
          setSearchCenter(newCoords);
          setMapCenter(newCoords);
          setLocations([]); // Trigger reload for new location
          if (!isInsideUkraine(latitude, longitude)) {
            setShowOutsideUkraineModal(true);
          }
          setIsLoading(false);
        },
        (error) => {
          console.error('Geolocation error:', error);
          setSearchError('Не вдалося отримати ваше місцезнаходження.');
          setIsLoading(false);
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    }
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsLoading(true);
    setSearchError(null);
    try {
      let url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&countrycodes=ua`;
      
      // Add location bias if map bounds are available
      if (mapBounds) {
        const sw = mapBounds.getSouthWest();
        const ne = mapBounds.getNorthEast();
        // Nominatim viewbox is left,top,right,bottom (lon,lat,lon,lat)
        url += `&viewbox=${sw.lng},${ne.lat},${ne.lng},${sw.lat}&bounded=0`; // bounded=0 means bias, bounded=1 means strict
      }

      const response = await fetch(url);
      const data = await response.json();
      if (data && data.length > 0) {
        const newCoords: [number, number] = [parseFloat(data[0].lat), parseFloat(data[0].lon)];
        setVisualCenter(newCoords);
        setSearchCenter(newCoords);
        setMapCenter(newCoords);
        setLocations([]); // Trigger reload for new location
        setSearchQuery('');
      } else {
        setSearchError('Місце не знайдено в Україні.');
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      setSearchError('Помилка пошуку. Спробуйте пізніше.');
    } finally {
      setIsLoading(false);
    }
  };

  const resizeHandlePos = useMemo(() => {
    const lat = visualCenter[0];
    const lon = visualCenter[1];
    const metersPerDegreeLon = 111320 * Math.cos(lat * Math.PI / 180);
    const lonOffset = visualRadius / metersPerDegreeLon;
    return [lat, lon + lonOffset] as [number, number];
  }, [visualCenter, visualRadius]);

  const isMapInUkraine = isInsideUkraine(visualCenter[0], visualCenter[1]);

  const handleAiTagsFound = (tags: string[]) => {
    if (tags.length > 0) {
      setSelectedVibe(tags[0]);
      setLocations([]);
    }
  };

  return (
    <Layout>
      <div className="home-page">
        {showLocationModal && (
          <div className="location-modal-overlay">
            <div className="location-modal">
              <div className="location-modal__icon"><MapPin size={32} /></div>
              <h2>Дозволити геолокацію?</h2>
              <p>Ми покажемо цікаві місця поруч із вашим поточним місцезнаходженням.</p>
              <div className="location-modal__actions">
                <SiteButton text="ДОЗВОЛИТИ" onClick={() => { sessionStorage.setItem('waygo-location-asked', 'true'); setShowLocationModal(false); requestCurrentLocation(); }} />
                <SiteButton text="ПІЗНІШЕ" onClick={() => { sessionStorage.setItem('waygo-location-asked', 'true'); setShowLocationModal(false); }} className="btn-deny" />
              </div>
            </div>
          </div>
        )}

        {showOutsideUkraineModal && (
          <div className="location-modal-overlay">
            <div className="location-modal">
              <div className="location-modal__icon" style={{ backgroundColor: '#fff3e0', color: '#ff9800' }}><Info size={32} /></div>
              <h2>Ви за межами України</h2>
              <p>Пошук локацій за вашим місцезнаходженням ще в розробці. Спробуйте обрати щось в Україні.</p>
              <div className="location-modal__actions">
                <SiteButton text="ЗРОЗУМІЛО" onClick={() => setShowOutsideUkraineModal(false)} />
              </div>
            </div>
          </div>
        )}

        <section className="home-page__vibe-section">
          <AiMoodSearch onTagsFound={handleAiTagsFound} />
          <CategorySelector selectedVibe={selectedVibe} onVibeChange={(v) => { setSelectedVibe(v); setLocations([]); }} />
        </section>

        <section className="home-page__search-section">
          <form className="search-bar" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder={isLoading ? "Пошук..." : "Введіть район або місто в Україні..."}
              className="search-bar__input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="search-bar__distance-badge">
              {Math.round(visualRadius / 100) / 10} км
            </div>
          </form>
          
          {searchError && (
            <div className="geo-error-notice">
              <Info size={16} />
              <span>{searchError}</span>
              <SiteButton onClick={() => setSearchError(null)} text="&times;" className="error-close-btn" />
            </div>
          )}
        </section>

        <section className="home-page__map-container">
          <MapContainer center={mapCenter} zoom={14} scrollWheelZoom={true} className="home-map">
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <ChangeView center={mapCenter} />
            <OnMapMove onMove={setMapBounds} />
            
            {isMapInUkraine && (
              <>
                <Circle
                  center={visualCenter}
                  radius={visualRadius}
                  pathOptions={{ color: '#4caf50', weight: 2, fillOpacity: 0.1 }}
                />

                <Marker 
                  position={visualCenter} 
                  icon={centerIcon} 
                  draggable={true}
                  eventHandlers={{ drag: (e) => setVisualCenter([e.target.getLatLng().lat, e.target.getLatLng().lng]), dragend: (e) => { setSearchCenter([e.target.getLatLng().lat, e.target.getLatLng().lng]); setLocations([]); } }}
                />

                <Marker 
                  position={resizeHandlePos} 
                  icon={resizeIcon} 
                  draggable={true}
                  eventHandlers={{ 
                    drag: (e) => {
                      const dist = L.latLng(visualCenter[0], visualCenter[1]).distanceTo(e.target.getLatLng());
                      setVisualRadius(Math.max(500, Math.min(10000, Math.round(dist))));
                    }, 
                    dragend: () => { setSearchRadius(visualRadius); setLocations([]); }
                  }}
                />

                {filteredLocations.map((location) => (
                  <Marker key={location.id} position={location.coords as [number, number]}>
                    <Popup>
                      <LocationPopup location={location} />
                    </Popup>
                  </Marker>
                ))}
              </>
            )}
          </MapContainer>
          
          <SiteButton 
            className="locate-me-btn" 
            onClick={requestCurrentLocation} 
            title="Знайти мене"
            icon={<Navigation size={20} fill="currentColor" />}
          />
          
          <div className="shuffle-container">
            {!isMapInUkraine && (
              <div className="shuffle-disabled-info">
                Shuffle доступний тільки в Україні
              </div>
            )}
            <ShuffleButton 
              onClick={() => loadLocations(true)} 
              disabled={!isMapInUkraine}
            />
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Home;
