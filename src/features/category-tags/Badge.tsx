import React from 'react';
import './ui/Badge.css'; 

interface BadgeProps {
  icon?: string;
  label: string;
}

export const Badge = ({ icon, label }: BadgeProps) => {
  return (
    <div className="category-badge">
      {icon && <span className="category-badge__icon">{icon}</span>}
      <span className="category-badge__label">{label}</span>
    </div>
  );
};