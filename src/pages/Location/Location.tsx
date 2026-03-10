import { useParams } from 'react-router-dom';
import { Badge } from '../../features/category-tags/Badge';
import { Layout } from '../../features/layout/Layout';
import { MOCK_LOCATIONS } from '../../entities/location/api/MockLocations';
import { useGooglePlacePhoto } from '../../shared/hooks/useGooglePlacePhoto';
import './ui/Location.css';

const LocationPage = () => {
  const { id } = useParams<{ id: string }>();
  const location = MOCK_LOCATIONS.find(loc => loc.id === Number(id)) || MOCK_LOCATIONS[0];
  const photoUrl = useGooglePlacePhoto(location.googlePlaceId, location.image);

  return (
    <Layout>
      <div className="location-page">
        {/* Секція зображення */}
        <div className="location-image-container">
          <img 
            src={photoUrl} 
            alt={location.name} 
            className="location-image"
          />
          <button className="close-button" onClick={() => window.history.back()}>×</button>
        </div>

        {/* Заголовок та рейтинг */}
        <div className="location-header">
          <div className="title-section">
            <h1 className="location-title">{location.name}</h1>
            <p className="location-distance">{location.distance} away</p>
          </div>
          <a 
            href={location.reviewUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="rating-card-link"
          >
            <div className="rating-card">
              <div className="rating-row">
                <span className="star">⭐</span>
                <span className="rating-value">{location.rating}</span>
              </div>
              <span className="reviews-count">Дивитися відгуки</span>
            </div>
          </a>
        </div>

        {/* Теги категорій */}
        <div className="tags-container">
          {location.vibes.map((vibe, index) => (
            <Badge key={vibe} icon={location.icon} label={vibe} />
          ))}
        </div>

        {/* Опис */}
        <p className="location-description">
          {location.description}
        </p>

        {/* Логічні блоки: Адреса та Години */}
        <div className="info-blocks">
          <div className="info-item">
            <span className="info-icon">📍</span>
            <div className="info-content">
              <span className="info-label">Адреса:</span>
              <span className="info-value">{location.address}</span>
            </div>
          </div>

          <div className="info-item">
            <span className="info-icon">🕒</span>
            <div className="info-content">
              <span className="info-label">Робочі години:</span>
              <span className="info-value">{location.hours}</span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LocationPage;