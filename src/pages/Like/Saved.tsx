import React from 'react';
import { Layout } from '../../features/layout/Layout';
import { Link, useNavigate } from 'react-router-dom';
import './ui/Saved.css';
import { useSaved } from '../../app/providers/SavedContext';
import SiteButton from '../../features/SiteButton/SiteButton'; // Import SiteButton
import { Bookmark, MapPin, ChevronRight, Trash2 } from 'lucide-react';

export const SavedPage = () => {
  const { savedLocations, toggleSave } = useSaved();
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="saved-page">
        <header className="saved-header">
          <h1 className="saved-title">Збережене</h1>
          <p className="saved-subtitle">{savedLocations.length} локацій у вашому списку</p>
        </header>
       
        <div className="saved-list">
          {savedLocations.length > 0 ? (
            savedLocations.map((loc: any) => (
              <div key={loc.id} className="saved-card">
                <Link to={`/location/${loc.id}`} className="saved-card__link">
                  <div className="saved-card__img-wrapper">
                    <img src={loc.image} alt={loc.name} className="saved-card__img" />
                    <div className="saved-card__distance">
                      <MapPin size={12} />
                      <span>{loc.distance}</span>
                    </div>
                  </div>
                  
                  <div className="saved-card__info">
                    <div className="saved-card__header">
                      <h3>{loc.name}</h3>
                      <div className="saved-card__rating">⭐ {loc.rating}</div>
                    </div>
                    
                    <div className="saved-card__tags">
                       {loc.vibes?.slice(0, 2).map((v: string) => (
                         <span key={v} className="mini-tag">{v}</span>
                       ))}
                    </div>
                    
                    <div className="saved-card__footer">
                      <span className="view-details">Детальніше</span>
                      <ChevronRight size={16} />
                    </div>
                  </div>
                </Link>
                
                {/* Remove button remains a simple icon to not clutter the card */}
                <button 
                  className="saved-card__remove-btn" 
                  onClick={() => toggleSave(loc)}
                  title="Видалити"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <div className="empty-state__icon">
                <Bookmark size={40} strokeWidth={1.5} />
              </div>
              <h2 className="empty-state__title">Список порожній</h2>
              <p className="empty-state__text">
                Зберігайте місця, які вам сподобалися, щоб вони завжди були під рукою.
              </p>
              
              {/* Use SiteButton for the main CTA */}
              <div style={{ marginTop: '24px' }}>
                <SiteButton 
                  text="Знайти цікаві місця" 
                  icon="bi-search" 
                  onClick={() => navigate('/')} 
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};