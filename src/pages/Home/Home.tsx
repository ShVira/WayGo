import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Layout } from '../../features/layout/Layout';
import { CategorySelector } from '../../features/category-selector/CategorySelector';
import { ShuffleButton } from '../../features/shuffle/ShuffleButton';
import { MOCK_LOCATIONS } from '../../entities/location/api/MockLocations';
import { LocationPopup } from './ui/LocationPopup';
import './ui/Home.css';

// Fix for default marker icons in Leaflet with React
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const Home: React.FC = () => {
  const center: [number, number] = [50.4417, 30.5153]; // Centered around Squat 17b for better initial view

  return (
    <Layout>
      <div className="home-page">
        {/* Vibe selection moved above */}
        <section className="home-page__vibe-section">
          <CategorySelector />
        </section>

        {/* Search section moved below vibe selection, directly above map */}
        <section className="home-page__search-section">
          <div className="search-bar">
            <input type="text" placeholder="Вкажіть місцерозташування..." className="search-bar__input" />
            <div className="search-bar__distance-wrapper">
              <select className="search-bar__distance-select">
                <option value="1">1 км</option>
                <option value="5">5 км</option>
                <option value="10">10 км</option>
                <option value="50">50 км</option>
              </select>
            </div>
          </div>
        </section>

        <section className="home-page__map-container">
          <MapContainer center={center} zoom={14} scrollWheelZoom={true} className="home-map">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {MOCK_LOCATIONS.map((location) => (
              <Marker key={location.id} position={location.coords as [number, number]}>
                <Popup>
                  <LocationPopup location={location} />
                </Popup>
              </Marker>
            ))}
          </MapContainer>
          <ShuffleButton onClick={() => console.log('Shuffle clicked!')} />
        </section>
      </div>
    </Layout>
  );
};

export default Home;
