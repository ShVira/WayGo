import React from 'react';
import './ui/SiteButton.css';

interface Props {
  text: string;
  onClick?: () => void; // Made optional for "submit" types
  icon?: string;
  type?: "button" | "submit" | "reset"; // Correctly defined
}

export default function SiteButton({ text, onClick, icon, type = "button" }: Props) {
  return (
    <button 
      type={type} 
      className="site-button" 
      onClick={onClick}
    >
      {icon && <i className={`bi ${icon}`}></i>}
      <span className="site-button__text">{text}</span>
    </button>
  );
}