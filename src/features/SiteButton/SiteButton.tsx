import React from 'react';
import './ui/SiteButton.css';

interface Props {
  text?: string;
  onClick?: () => void; 
  icon?: string | React.ReactNode;
  type?: "button" | "submit" | "reset"; 
  disabled?: boolean;
  className?: string;
  href?: string;
  target?: string;
  rel?: string;
  title?: string;
}

export default function SiteButton({ 
  text, 
  onClick, 
  icon, 
  type = "button", 
  disabled, 
  className = "", 
  href, 
  target, 
  rel,
  title
}: Props) {
  const isSpinner = icon === 'spinner';
  const iconContent = typeof icon === 'string' 
    ? <i className={`bi ${isSpinner ? 'bi-arrow-repeat site-button__spinner' : `bi-${icon}`}`}></i>
    : icon;

  const combinedClassName = `site-button ${disabled ? 'site-button--disabled' : ''} ${className}`.trim();

  if (href) {
    return (
      <a 
        href={href} 
        className={combinedClassName} 
        target={target} 
        rel={rel}
        title={title}
        onClick={disabled ? (e) => e.preventDefault() : onClick}
      >
        {iconContent}
        {text && <span className="site-button__text">{text}</span>}
      </a>
    );
  }

  return (
    <button 
      type={type} 
      className={combinedClassName} 
      onClick={onClick}
      disabled={disabled}
      title={title}
    >
      {iconContent}
      {text && <span className="site-button__text">{text}</span>}
    </button>
  );
}