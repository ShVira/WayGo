import React, { useContext, useEffect, useState } from 'react';
import { MapPin, Sun, Moon } from 'lucide-react';
import './ui/header.css';
import { AppContext } from '../app-context/AppContext';

export const Header: React.FC = () => {
  const { user } = useContext(AppContext);
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

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

        <div className="header__user-section">
          <button 
            onClick={toggleTheme}
            style={{ 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer', 
              padding: '8px',
              marginRight: '8px',
              display: 'flex',
              alignItems: 'center',
              color: 'var(--text-primary)'
            }}
            aria-label="Toggle Theme"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          {user && (
            <span className="header__user-name" title={user.name}>
              {user.name}
            </span>
          )}
        </div>
      </div>
    </header>
  );
};
