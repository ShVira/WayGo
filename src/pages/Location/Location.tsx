import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '../../features/layout/Layout';
import { MOCK_LOCATIONS, Location } from '../../entities/location/api/MockLocations';
import { fetchLocationDetails } from '../../entities/location/api/GooglePlacesService';
import { useState, useEffect } from 'react';
import { useSaved } from '../../app/providers/SavedContext';
import { useHistory } from '../../app/providers/HistoryContext'; 
import { calculateDistance, formatDistance } from '../../shared/utils/distance';
import './ui/Location.css';

import { 
  ChevronLeft, 
  MapPin, 
  Clock, 
  Star, 
  ExternalLink, 
  Navigation, 
  Share2, 
  Bookmark,
  CheckCircle2,
  ThumbsUp,
  ThumbsDown,
  X,
  MessageSquare
} from 'lucide-react';
import SiteButton from '../../features/SiteButton/SiteButton';

const VisitModal = ({ isOpen, onClose, onSelect, currentStatus, reviewUrl }: { 
  isOpen: boolean, 
  onClose: () => void, 
  onSelect: (status: 'liked' | 'disliked') => void,
  currentStatus: 'liked' | 'disliked' | null,
  reviewUrl: string
}) => {
  if (!isOpen) return null;

  return (
    <div className="visit-modal-overlay" onClick={onClose}>
      <div className="visit-modal" onClick={e => e.stopPropagation()}>
        {/* <SiteButton className="close-modal" onClick={onClose} icon={<X size={20} />} /> */}
        <h2>Ви тут були?</h2>
        <p>Поділіться вашими враженнями від цієї локації.</p>
        
        <div className="visit-options">
          <SiteButton 
            className={`visit-opt like ${currentStatus === 'liked' ? 'active' : ''}`}
            onClick={() => onSelect('liked')}
            icon={<ThumbsUp size={32} fill={currentStatus === 'liked' ? "currentColor" : "none"} />}
            text="Подобається"
          />
          
          <SiteButton 
            className={`visit-opt dislike ${currentStatus === 'disliked' ? 'active' : ''}`}
            onClick={() => onSelect('disliked')}
            icon={<ThumbsDown size={32} fill={currentStatus === 'disliked' ? "currentColor" : "none"} />}
            text="Не подобається"
          />
        </div>

        <div className="modal-divider"></div>
        
        <SiteButton 
          href={reviewUrl} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="add-review-btn"
          icon={<MessageSquare size={18} />}
          text="Залишити відгук у Google Maps"
        />
        
        <SiteButton className="btn-primary w-full mt-4" onClick={onClose} text="Зберегти відмітку" />
      </div>
    </div>
  );
};

const LocationPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisitModalOpen, setIsVisitModalOpen] = useState(false);
  const [location, setLocation] = useState<Location | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userCoords, setUserCoords] = useState<[number, number] | null>(null);
  const [isLocating, setIsLocating] = useState(true);
  
  const { savedLocations, visitedLocations, toggleSave, toggleVisit, setMessage } = useSaved();
  const { addToHistory } = useHistory();

  // Fetch User Location
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserCoords([position.coords.latitude, position.coords.longitude]);
          setIsLocating(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setIsLocating(false);
          // Fallback to Kyiv center if denied/failed
          setUserCoords([50.4501, 30.5234]);
        }
      );
    } else {
      setIsLocating(false);
    }
  }, []);

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
        const existingVisit = visitedLocations?.find((l: any) => l.id === foundLocation?.id);
        const isSaved = savedLocations?.some((l: any) => l.id === foundLocation?.id);
        
        setLocation({ 
          ...foundLocation, 
          visitStatus: existingVisit?.visitStatus || null,
          isSaved: isSaved
        });
        
        addToHistory({
          id: foundLocation.id,
          name: foundLocation.name,
          imageUrl: foundLocation.image,
          address: foundLocation.address,
          visitStatus: existingVisit?.visitStatus || null
        });
      }
      
      setIsLoading(false);
    };

    loadLocation();
  }, [id, addToHistory, savedLocations, visitedLocations]);

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

  const isSaved = savedLocations?.some((l: any) => l.id === location.id);
  const currentVisitStatus = visitedLocations?.find((l: any) => l.id === location.id)?.visitStatus || null;
  const toggleExpand = () => setIsExpanded(!isExpanded);
  
  const handleSaveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleSave(location);
  };

  const handleVisitStatusSelect = (status: 'liked' | 'disliked') => {
    const newStatus = currentVisitStatus === status ? null : status;
    toggleVisit(location, newStatus);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: location.name,
        text: location.description,
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      setMessage({ text: 'Посилання скопійовано', type: 'info' });
    }
  };

  const getDynamicDistance = () => {
    if (isLocating) return 'Визначаємо...';
    if (!userCoords) return location.distance; // Fallback to mock distance

    const dist = calculateDistance(
      userCoords[0],
      userCoords[1],
      location.coords[0],
      location.coords[1]
    );
    return `${formatDistance(dist)} від вас`;
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

        <VisitModal 
          isOpen={isVisitModalOpen} 
          onClose={() => setIsVisitModalOpen(false)}
          onSelect={handleVisitStatusSelect}
          currentStatus={currentVisitStatus}
          reviewUrl={location.reviewUrl}
        />

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
            <button className="image-action-btn" onClick={handleShare}>
              <Share2 size={20} />
            </button>
            <button
              className={`image-action-btn visit-btn ${currentVisitStatus ? 'active' : ''}`}
              onClick={() => setIsVisitModalOpen(true)}
              title="Я тут був"
            >
              <CheckCircle2 size={20} color={currentVisitStatus ? "#4caf50" : "currentColor"} fill={currentVisitStatus ? "rgba(76, 175, 80, 0.1)" : "none"} />
            </button>
            <button
              className={`image-action-btn bookmark-btn ${isSaved ? 'is-active' : ''}`}
              onClick={handleSaveClick}
              title={isSaved ? "Видалити зі збережених" : "Зберегти"}
            >
              <Bookmark size={20} fill={isSaved ? "#4caf50" : "none"} color={isSaved ? "#4caf50" : "currentColor"} />
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
              <div className={`distance-badge ${isLocating ? 'loading' : ''}`}>
                <MapPin size={14} />
                <span>{getDynamicDistance()}</span>
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
