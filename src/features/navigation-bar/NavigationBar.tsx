import React from 'react';
import { NavLink } from 'react-router-dom';
import { Map, Bookmark, Clock, User } from 'lucide-react';
import './ui/NavigationBar.css';
import { useSaved } from '../../app/providers/SavedContext';

export const NavigationBar: React.FC = () => {
  const { savedLocations } = useSaved(); // Access saved items count

  return (
    <nav className="navigation-bar">
      <ul className="navigation-bar__list">
        {/* Home / Map */}
        <li className="navigation-bar__item">
          <NavLink to="/" className={({ isActive }) => `navigation-bar__link ${isActive ? 'active' : ''}`}>
            <span className="navigation-bar__icon"><Map size={24} /></span>
            <span className="navigation-bar__label">Головна</span>
          </NavLink>
        </li>

        {/* Saved / Favorites */}
        <li className="navigation-bar__item">
          <NavLink to="/saved" className={({ isActive }) => `navigation-bar__link ${isActive ? 'active' : ''}`}>
            <span className="navigation-bar__icon">
              <Bookmark size={24} />
              {/* Optional: Badge showing count of saved items */}
              {savedLocations.length > 0 && (
                <span className="nav-badge">{savedLocations.length}</span>
              )}
            </span>
            <span className="navigation-bar__label">Обране</span>
          </NavLink>
        </li>

        {/* History */}
        <li className="navigation-bar__item">
          <NavLink to="/history" className={({ isActive }) => `navigation-bar__link ${isActive ? 'active' : ''}`}>
            <span className="navigation-bar__icon"><Clock size={24} /></span>
            <span className="navigation-bar__label">Історія</span>
          </NavLink>
        </li>

        {/* Profile */}
        <li className="navigation-bar__item">
          <NavLink to="/profile" className={({ isActive }) => `navigation-bar__link ${isActive ? 'active' : ''}`}>
            <span className="navigation-bar__icon"><User size={24} /></span>
            <span className="navigation-bar__label">Профіль</span>
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};