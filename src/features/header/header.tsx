import React, { useContext } from 'react';
import { MapPin } from 'lucide-react';
import './ui/header.css';
import { AppContext } from '../app-context/AppContext';
import { ThemeToggle } from '../theme-toggle/ThemeToggle';

export const Header: React.FC = () => {
  const { user } = useContext(AppContext);

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

        <div className="header__actions-section">
          <ThemeToggle />
          {user && (
            <div className="header__user-section">
              <span className="header__user-name" title={user.name}>
                {user.name}
              </span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
