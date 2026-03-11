import React from 'react';
import { Layout } from '../../features/layout/Layout';
import { Link, useNavigate } from 'react-router-dom';
import './ui/Saved.css';
import { useSaved } from '../../app/providers/SavedContext';

export const SavedPage = () => {
  const { savedLocations, toggleSave } = useSaved();
const navigate = useNavigate(); // 2. Initialize navigat
  return (
    <Layout>
      <div className="saved-page">
       
        <div className="saved-list">
          {savedLocations.length > 0 ? (
            savedLocations.map((loc: any) => (
              <div key={loc.id} className="saved-card">
                <Link to={`/location/${loc.id}`} className="saved-card__link">
                  <img src={loc.image} alt={loc.name} className="saved-card__img" />
                  <div className="saved-card__info">
                    <h3>{loc.name}</h3>
                    <p>{loc.distance} away</p>
                    <div className="saved-card__tags">
                       {loc.vibes.slice(0, 2).map((v: string) => (
                         <span key={v} className="mini-tag">{v}</span>
                       ))}
                    </div>
                  </div>
                </Link>
                <button 
                  className="saved-card__remove" 
                  onClick={() => toggleSave(loc)}
                >
                 <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="currentColor" /* Solid fill for the 'saved' state */
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
            ))
          ) : (
            <div className="empty-state">
            <h2 className="empty-state__title">
              У вас ще немає збережених місць.
            </h2>
            <p className="empty-state__text">
              Додавайте улюблені локації та<br />
              повертайтеся до них легко!
            </p>
            {/* 5. Functional Button to go back to Home (Map) */}
            <button 
              className="empty-state__btn" 
              onClick={() => navigate('/')}
            >
              Перейти до мапи
            </button>
          </div>
          )}
        </div>
      </div>
    </Layout>
  );
};