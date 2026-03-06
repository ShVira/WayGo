import React from 'react';
import { Map, Bookmark, Clock, User } from 'lucide-react';
import './ui/NavigationBar.css';

export const NavigationBar: React.FC = () => {
  return (
    <nav className="navigation-bar">
      <ul className="navigation-bar__list">
        <li className="navigation-bar__item active">
          <button className="navigation-bar__btn">
            <span className="navigation-bar__icon"><Map size={24} /></span>
            <span className="navigation-bar__label">Головна</span>
          </button>
        </li>
        <li className="navigation-bar__item">
          <button className="navigation-bar__btn">
            <span className="navigation-bar__icon"><Bookmark size={24} /></span>
            <span className="navigation-bar__label">Обране</span>
          </button>
        </li>
        <li className="navigation-bar__item">
          <button className="navigation-bar__btn">
            <span className="navigation-bar__icon"><Clock size={24} /></span>
            <span className="navigation-bar__label">Історія</span>
          </button>
        </li>
        <li className="navigation-bar__item">
          <button className="navigation-bar__btn">
            <span className="navigation-bar__icon"><User size={24} /></span>
            <span className="navigation-bar__label">Профіль</span>
          </button>
        </li>
      </ul>
    </nav>
  );
};
