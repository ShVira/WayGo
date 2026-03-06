import React from 'react';
import { MapPin } from 'lucide-react';
import './ui/header.css';

export const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="header__container">
        <div className="header__logo-section">
          <div className="header__title-row">
            <MapPin className="header__logo-icon" size={24} />
            <h1 className="header__title">WayGo</h1>
          </div>
          <p className="header__slogan">Знайди свій вайб поруч</p>
        </div>
      </div>
    </header>
  );
};
