import { Badge } from '../../features/category-tags/Badge';
import './ui/Location.css';

const LocationPage = () => {
  return (
    <div className="location-page">
      {/* Секція зображення */}
      <div className="location-image-container">
        <img 
          src="https://images.unsplash.com/photo-1554118811-1e0d58224f24" 
          alt="Coffee and City" 
          className="location-image"
        />
        <button className="close-button">×</button>
      </div>

      {/* Заголовок та рейтинг */}
      <div className="location-header">
        <div className="title-section">
          <h1 className="location-title">Coffee and City</h1>
          <p className="location-distance">1.3 km away</p>
        </div>
        <div className="rating-card">
          <div className="rating-row">
            <span className="star">⭐</span>
            <span className="rating-value">4.7</span>
          </div>
          <span className="reviews-count">4 відгуки</span>
        </div>
      </div>

      {/* Теги категорій */}
      <div className="tags-container">
        <Badge icon="☕" label="Coffee" />
        <Badge icon="🌿" label="Cozy" />
        <Badge icon="⏱️" label="Quick visit" />
      </div>

      {/* Опис */}
      <p className="location-description">
        Сучасна кав’ярня спеціалізованої кави з теплою, затишною атмосферою. 
        Ідеально підходить для швидкої перерви на каву або тихої роботи. 
        Пропонує фірмові напої та свіжу випічку.
      </p>

      {/* Логічні блоки: Адреса та Години */}
      <div className="info-blocks">
        <div className="info-item">
          <span className="info-icon">📍</span>
          <div className="info-content">
            <span className="info-label">Адреса:</span>
            <span className="info-value">Київ, вул. Володимирська 42</span>
          </div>
        </div>

        <div className="info-item">
          <span className="info-icon">🕒</span>
          <div className="info-content">
            <span className="info-label">Робочі години:</span>
            <span className="info-value">08:00 — 22:00 (щодня)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationPage;