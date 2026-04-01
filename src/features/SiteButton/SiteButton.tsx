import React from 'react';
import './ui/SiteButton.css';

interface Props {
  text: string;
  onClick?: () => void; 
  icon?: string;
  type?: "button" | "submit" | "reset"; 
  disabled?: boolean;
}

export default function SiteButton({ text, onClick, icon, type = "button", disabled }: Props) {
  const isSpinner = icon === 'spinner';
  const iconClass = isSpinner ? 'bi-arrow-repeat site-button__spinner' : `bi-${icon}`;

  return (
    <button 
      type={type} 
      className={`site-button ${disabled ? 'site-button--disabled' : ''}`} 
      onClick={onClick}
      disabled={disabled}
    >
      {icon && <i className={`bi ${iconClass}`}></i>}
      <span className="site-button__text">{text}</span>
    </button>
  );
}