import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Badge } from '../../features/category-tags/Badge';
import { Layout } from '../../features/layout/Layout';
import { MOCK_LOCATIONS } from '../../entities/location/api/MockLocations';
import './ui/Location.css';

/**
 * Individual Block Component
 * Each block manages its own state for Liking and Expanding
 */
const LocationBlock = ({ location }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const toggleExpand = () => setIsExpanded(!isExpanded);
  
  const handleLikeClick = (e) => {
    e.stopPropagation(); // Prevents image from expanding when clicking bookmark
    setIsLiked(!isLiked);
  };

  return (
    <div className="location-block-wrapper">
      {/* 1. Full-screen Overlay (Lightbox) */}
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

      {/* 2. Image Section with Floating Bookmark */}
      <div className="location-image-container">
        <img 
          src={location.image} 
          alt={location.name} 
          className="location-image"
          onClick={toggleExpand}
          style={{ cursor: 'zoom-in' }}
        />
        <button 
          className={`bookmark-btn ${isLiked ? 'is-liked' : ''}`} 
          onClick={handleLikeClick}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill={isLiked ? "currentColor" : "none"} 
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

      {/* 3. Title and Rating Section */}
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

      {/* 4. Category Tags */}
      <div className="tags-container">
        {location.vibes.map((vibe) => (
          <Badge key={vibe} icon={location.icon} label={vibe} />
        ))}
      </div>

      {/* 5. Description */}
      <p className="location-description">
        {location.description}
      </p>

      {/* 6. Info Blocks: Address and Hours */}
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

      <hr className="location-separator" />
    </div>
  );
};

/**
 * Main Page Component
 */
const LocationPage = () => {
  return (
    <Layout>
      <div className="location-page">
        {MOCK_LOCATIONS.map((loc) => (
          <LocationBlock key={loc.id} location={loc} />
        ))}
      </div>
    </Layout>
  );
};

export default LocationPage;