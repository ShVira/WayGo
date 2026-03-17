import { useParams } from 'react-router-dom';
import { Badge } from '../../features/category-tags/Badge';
import { Layout } from '../../features/layout/Layout';
import { MOCK_LOCATIONS, Location } from '../../entities/location/api/MockLocations';
import { fetchLocationDetails } from '../../entities/location/api/GooglePlacesService';
import './ui/Location.css';
import { useState, useEffect } from 'react';
import { useSaved } from '../../app/providers/SavedContext';

const LocationPage = () => {
  const { id } = useParams<{ id: string }>();
  const [isExpanded, setIsExpanded] = useState(false);
  const [location, setLocation] = useState<Location | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const { savedLocations, toggleSave } = useSaved();

  useEffect(() => {
    const loadLocation = async () => {
      setIsLoading(true);
      // Try MOCK_LOCATIONS first
      const mock = MOCK_LOCATIONS.find(loc => loc.id.toString() === id);
      if (mock) {
        setLocation(mock);
      } else if (id) {
        // Try Google Places
        const real = await fetchLocationDetails(id);
        setLocation(real);
      }
      setIsLoading(false);
    };
    loadLocation();
  }, [id]);

  if (isLoading) {
    return (
      <Layout>
        <div className="location-page">
          <p>Завантаження...</p>
        </div>
      </Layout>
    );
  }

  if (!location) {
    return (
      <Layout>
        <div className="location-page">
          <p>Локацію не знайдено.</p>
        </div>
      </Layout>
    );
  }

  const isLiked = savedLocations?.some((l: any) => l.id === location.id) || false;

  const toggleExpand = () => setIsExpanded(!isExpanded);

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleSave(location);
  };

  return (
    <Layout>
      <div className="location-page">
        {isExpanded && (
          <div className="image-overlay" onClick={toggleExpand}>
            <div className="overlay-content">
              <button className="close-lightbox" onClick={toggleExpand}>×</button>
              <img
                src={location.image}
                alt={location.name}
                className="expanded-image"
              />
            </div>
          </div>
        )}

        <div className="location-image-container">
          <img
            src={location.image}
            alt={location.name}
            className="location-image"
            onClick={toggleExpand}
            style={{ cursor: 'zoom-in' }}
          />
          <button
            className={`close-button bookmark-btn ${isLiked ? 'is-liked' : ''}`}
            onClick={handleLikeClick}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill={isLiked ? "white" : "none"}
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-bookmark"
              aria-hidden="true"
            >
              <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>
            </svg>
          </button>
        </div>

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

        <div className="tags-container">
          {location.vibes.map((vibe) => (
            <Badge key={vibe} icon={location.icon} label={vibe} />
          ))}
        </div>

        <p className="location-description">
          {location.description}
        </p>

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