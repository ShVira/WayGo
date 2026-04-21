import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../app/providers/ThemeContext';
import './ui/ThemeToggle.css';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button 
      className="theme-toggle" 
      onClick={toggleTheme} 
      aria-label={theme === 'light' ? 'Увімкнути темну тему' : 'Увімкнути світлу тему'}
    >
      {theme === 'light' ? (
        <Moon size={24} strokeWidth={2.5} />
      ) : (
        <Sun size={24} strokeWidth={2.5} />
      )}
    </button>
  );
};
