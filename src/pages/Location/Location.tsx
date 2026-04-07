import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '../../features/layout/Layout';
import { MOCK_LOCATIONS, Location } from '../../entities/location/api/MockLocations';
import { fetchLocationDetails } from '../../entities/location/api/GooglePlacesService';
import './ui/Location.css';
import { useState, useEffect } from 'react';
import { useSaved } from '../../app/providers/SavedContext';
import { useHistory } from '../../app/providers/HistoryContext'; 
import { 
  ChevronLeft, 
  MapPin, 
  Clock, 
  Star, 
  ExternalLink, 
  Navigation, 
  Share2, 
  Bookmark 
} from 'lucide-react';

const LocationPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [isExpanded, setIsExpanded] = useState(false);
  const [location, setLocation] = useState<Location | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const { savedLocations, toggleSave } = useSaved();
  const { addToHistory } = useHistory();

  useEffect(() => {
    const loadLocation = async () => {
      setIsLoading(true);
      let foundLocation: Location | null = null;

      const mock = MOCK_LOCATIONS.find(loc => loc.id.toString() === id);
      
      if (mock) {
        foundLocation = mock;
      } else if (id) {
        foundLocation = await fetchLocationDetails(id);
      }

      if (foundLocation) {
        setLocation(foundLocation);
        
        addToHistory({
          id: foundLocation.id,
          name: foundLocation.name,
          imageUrl: foundLocation.image,
          address: foundLocation.address
        });
      }
      
      setIsLoading(false);
    };

    loadLocation();
  }, [id, addToHistory]);

  if (isLoading) {
    return (
      <Layout>
        <div className="location-page skeleton">
          <div className="skeleton-image"></div>
          <div className="location-content-wrapper">
            <div className="skeleton-title"></div>
            <div className="skeleton-text"></div>
            <div className="skeleton-info"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!location) {
    return (
      <Layout>
        <div className="location-page">
          <p>Локацію не знайдено.</p>
          <button className="btn-secondary mt-3" onClick={() => navigate(-1)}>Повернутися</button>
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
              <img src={location.image} alt={location.name} className="expanded-image" />
            </div>
          </div>
        )}

        <div className="location-image-container">
          <button className="back-button-circle" onClick={() => navigate(-1)}>
            <ChevronLeft size={24} />
          </button>
          
          <img
            src={location.image}
            alt={location.name}
            className="location-image"
            onClick={toggleExpand}
            style={{ cursor: 'zoom-in' }}
          />
          
          <div className="image-actions">
            <button className="image-action-btn" onClick={() => alert('Поділитися локацією')}>
              <Share2 size={20} />
            </button>
            <button
              className={`image-action-btn bookmark-btn-alt ${isLiked ? 'is-liked' : ''}`}
              onClick={handleLikeClick}
            >
              <Bookmark size={20} fill={isLiked ? "currentColor" : "none"} />
            </button>
          </div>
        </div>

        <div className="location-content-wrapper">
          <header className="location-header">
            <div className="title-section">
              <div className="location-vibes-mini">
                {location.vibes.map(v => (
                  <span key={v} className="vibe-dot">{v}</span>
                ))}
              </div>
              <h1 className="location-title">{location.name}</h1>
              <div className="distance-badge">
                <MapPin size={14} />
                <span>{location.distance} від вас</span>
              </div>
            </div>
            
            <div className="rating-card-new">
              <div className="rating-score">
                <Star size={18} fill="#fbc02d" color="#fbc02d" />
                <span>{location.rating}</span>
              </div>
              <a href={location.reviewUrl} target="_blank" rel="noopener noreferrer" className="reviews-link">
                {location.userRatingsTotal || 0} відгуків
              </a>
            </div>
          </header>

          <div className="section-divider"></div>

          <div className="description-section">
            <h3 className="section-title">Опис</h3>
            <p className="location-description">{location.description}</p>
          </div>

          <div className="info-grid">
            <div className="info-card">
              <div className="info-card__icon">
                <MapPin size={20} />
              </div>
              <div className="info-card__content">
                <span className="info-card__label">Адреса</span>
                <span className="info-card__value">{location.address}</span>
              </div>
            </div>

            <div className="info-card">
              <div className="info-card__icon">
                <Clock size={20} />
              </div>
              <div className="info-card__content">
                <span className="info-card__label">Робочі години</span>
                <span className={`info-card__value ${
                  location.hours === 'Відчинено' ? 'status-open' : 
                  location.hours === 'Зачинено' ? 'status-closed' : ''
                }`}>
                  {location.hours}
                </span>
              </div>
            </div>
          </div>

          <div className="location-actions">
            <a 
              href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(location.address)}&destination_place_id=${location.googlePlaceId || ''}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn-primary"
            >
              <Navigation size={20} />
              Побудувати маршрут
            </a>
            <a 
              href={location.reviewUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn-secondary"
            >
              <ExternalLink size={20} />
              Сайт
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LocationPage;
