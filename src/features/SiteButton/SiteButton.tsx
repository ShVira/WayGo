import React from 'react';
import './ui/SiteButton.css';

interface Props {
  text: string;
  onClick: () => void;
  icon?: string; // Optional: pass a Bootstrap icon class like "bi-person"
}

export default function SiteButton({ text, onClick, icon }: Props) {
  return (
    <button className="site-button" onClick={onClick}>
      {icon && <i className={`bi ${icon}`}></i>}
      <span className="site-button__text">{text}</span>
    </button>
  );
}