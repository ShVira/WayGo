import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Location } from '../../../entities/location/api/MockLocations';
import './Home.css';

interface LocationPopupProps {
  location: Location;
}

export const LocationPopup: React.FC<LocationPopupProps> = ({ location }) => {
  const navigate = useNavigate();

  const handleDetailsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/location/${location.id}`);
  };

  return (
    <div className="map-popup">
      <img src={location.image} alt={location.name} className="map-popup__image" />
      <h3>{location.name}</h3>
      <p>
        <span className="map-popup__rating">⭐ {location.rating}</span> 
      </p>
      <div className="map-popup__vibes">
        {location.vibes.slice(0, 2).map(vibe => (
          <span key={vibe} className="vibe-tag">{vibe}</span>
        ))}
      </div>
      <div style={{ padding: '0 12px 12px 12px' }}>
        <button 
          onClick={handleDetailsClick}
          className="btn-details"
          style={{ 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%', 
            padding: '10px', 
            borderRadius: '12px', 
            background: 'var(--primary)', 
            color: 'white', 
            border: 'none',
            fontSize: '13px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          Детальніше
        </button>
      </div>
    </div>
  );
};
