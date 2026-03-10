import React from 'react';
import { Coffee, Compass, Zap, Activity, Users, Leaf, Sparkles } from 'lucide-react';
import './ui/CategorySelector.css';

const VIBES = [
  { id: 'togo', label: 'ToGo', icon: <Zap size={24} color="#fbc02d" /> },
  { id: 'explore', label: 'Explore', icon: <Compass size={24} color="#0288d1" /> },
  { id: 'cozy', label: 'Cozy', icon: <Coffee size={24} color="#795548" /> },
  { id: 'active', label: 'Active', icon: <Activity size={24} color="#d32f2f" /> },
  { id: 'social', label: 'Social', icon: <Users size={24} color="#7b1fa2" /> },
  { id: 'nature', label: 'Nature', icon: <Leaf size={24} color="#388e3c" /> },
  { id: 'special', label: 'Special', icon: <Sparkles size={24} color="#f57c00" /> },
];

export const CategorySelector: React.FC = () => {
  return (
    <div className="category-selector">
      <div className="category-selector__header">
        <h2 className="category-selector__title">Обери свій вайб</h2>
      </div>
      <div className="category-selector__grid">
        {VIBES.map((vibe) => (
          <button key={vibe.id} className="category-selector__item">
            <span className="category-selector__icon">{vibe.icon}</span>
            <span className="category-selector__label">{vibe.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
