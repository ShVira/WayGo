import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

import { Layout } from '../../features/layout/Layout';
import { CategorySelector } from '../../features/category-selector/CategorySelector';
import { ShuffleButton } from '../../features/shuffle/ShuffleButton';
import { MOCK_LOCATIONS } from '../../entities/location/api/MockLocations';
import { LocationPopup } from './ui/LocationPopup';
import './ui/Home.css';

let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Helper component to move the map
const ChangeView = ({ center }: { center: [number, number] }) => {
  const map = useMap();
  useEffect(() => {
    if (center) map.flyTo(center, 14, { duration: 1.5 });
  }, [center, map]);
  return null;
};

const Home: React.FC = () => {
  const [selectedVibe, setSelectedVibe] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const [mapCenter, setMapCenter] = useState<[number, number]>([50.4417, 30.5153]);
  const [searchCenter, setSearchCenter] = useState<[number, number]>([50.4417, 30.5153]);
  const [searchRadius, setSearchRadius] = useState(1000); // meters

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery + ', Kyiv')}`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const newCoords: [number, number] = [parseFloat(data[0].lat), parseFloat(data[0].lon)];
        setSearchCenter(newCoords);
        setMapCenter(newCoords);
      }
    } catch (error) {
      console.error('Geocoding error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredLocations = selectedVibe 
    ? MOCK_LOCATIONS.filter(loc => loc.vibes.includes(selectedVibe))
    : MOCK_LOCATIONS;

  return (
    <Layout>
      <div className="home-page">
        <section className="home-page__vibe-section">
          <CategorySelector selectedVibe={selectedVibe} onVibeChange={setSelectedVibe} />
        </section>

        <section className="home-page__search-section">
          <form className="search-bar" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder={isLoading ? "Пошук..." : "Введіть район (напр. Поділ)..."}
              className="search-bar__input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="search-bar__distance-wrapper">
              <select 
                className="search-bar__distance-select"
                value={searchRadius}
                onChange={(e) => setSearchRadius(Number(e.target.value))}
              >
                <option value="1000">1 км</option>
                <option value="3000">3 км</option>
                <option value="5000">5 км</option>
              </select>
            </div>
          </form>
        </section>

        <section className="home-page__map-container">
          <MapContainer center={mapCenter} zoom={14} scrollWheelZoom={true} className="home-map">
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <ChangeView center={mapCenter} />
            
            {/* The requested Green Radius Circle */}
            <Circle
              center={searchCenter}
              radius={searchRadius}
              pathOptions={{ color: '#4caf50', weight: 2, fillOpacity: 0.1 }}
            />

            {filteredLocations.map((location) => (
              <Marker key={location.id} position={location.coords as [number, number]}>
                <Popup>
                  <LocationPopup location={location} />
                </Popup>
              </Marker>
            ))}
          </MapContainer>
          <ShuffleButton onClick={() => {}} />
        </section>
      </div>
    </Layout>
  );
};

export default Home;
