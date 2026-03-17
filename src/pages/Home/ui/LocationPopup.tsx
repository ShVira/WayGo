import React from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Import useNavigate
import { Location } from '../../../entities/location/api/MockLocations';
import './Home.css';

interface LocationPopupProps {
  location: Location;
}

export const LocationPopup: React.FC<LocationPopupProps> = ({ location }) => {
  const photoUrl = location.image;
  const navigate = useNavigate(); // 2. Initialize navigate

  const handleDetailsClick = () => {
    // 3. This matches your LocationPage route: /location/:id
    navigate(`/location/${location.id}`);
  };

  return (
    <div className="map-popup" onClick={handleDetailsClick} style={{ cursor: 'pointer' }}>
      <img src={photoUrl} alt={location.name} className="map-popup__image" />
      <h3>{location.name}</h3>
      <p>
        <a 
          href={location.reviewUrl} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="map-popup__rating"
          title="Дивитися відгуки"
          onClick={(e) => e.stopPropagation()} // Prevents navigation when just clicking the review link
        >
          ⭐ {location.rating}
        </a> 
        • {location.distance}
      </p>
      <div className="map-popup__vibes">
        {location.vibes.slice(0, 2).map(vibe => ( // Slice to keep popup clean
          <span key={vibe} className="vibe-tag">{vibe}</span>
        ))}
      </div>
   
    </div>
  );
};