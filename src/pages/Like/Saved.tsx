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
       
        {savedLocations.length > 0 ? (
          <div className="saved-list">
            {savedLocations.map((loc: any) => (
              <div key={loc.id} className="saved-card" onClick={() => navigate(`/location/${loc.id}`)}>
                <img src={loc.image} alt={loc.name} className="saved-card-img" />
                
                <div className="saved-card-info">
                  <div className="saved-card-header">
                    <h3>{loc.name}</h3>
                    <div className="saved-card-rating">⭐ {loc.rating}</div>
                  </div>
                  
                  <div className="saved-card-details">
                    <p><MapPin size={13} /> {loc.distance}</p>
                    <div className="saved-card-tags">
                       {loc.vibes?.slice(0, 2).map((v: string) => (
                         <span key={v} className="mini-tag">{v}</span>
                       ))}
                    </div>
                  </div>
                </div>

                <div className="saved-card-actions">
                  <button 
                    className="saved-card__remove-btn" 
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSave(loc);
                    }}
                    title="Видалити"
                  >
                    <Trash2 size={18} />
                  </button>
                  <ChevronRight size={18} className="saved-chevron" strokeWidth={2.5} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state__icon">
              <Bookmark size={40} strokeWidth={1.5} />
            </div>
            <h2 className="empty-state__title">Список порожній</h2>
            <p className="empty-state__text">
              Зберігайте місця, які вам сподобалися, щоб вони завжди були під рукою.
            </p>
            
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
    </Layout>
  );
};