import React from 'react';
import { useGooglePlacePhoto } from '../../../shared/hooks/useGooglePlacePhoto';
import { Location } from '../../../entities/location/api/MockLocations';
import './Home.css';

interface LocationPopupProps {
  location: Location;
}

export const LocationPopup: React.FC<LocationPopupProps> = ({ location }) => {
  const photoUrl = useGooglePlacePhoto(location.googlePlaceId, location.image);

  return (
    <div className="map-popup">
      <img src={photoUrl} alt={location.name} className="map-popup__image" />
      <h3>{location.name}</h3>
      <p>
        <a 
          href={location.reviewUrl} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="map-popup__rating"
          title="Дивитися відгуки"
        >
          ⭐ {location.rating}
        </a> 
        • {location.distance}
      </p>
      <div className="map-popup__vibes">
        {location.vibes.map(vibe => <span key={vibe} className="vibe-tag">{vibe}</span>)}
      </div>
    </div>
  );
};
