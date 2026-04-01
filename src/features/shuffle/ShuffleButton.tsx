import React from 'react';
import { Dices } from 'lucide-react';
import './ui/ShuffleButton.css';

interface ShuffleButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  title?: string;
}

export const ShuffleButton: React.FC<ShuffleButtonProps> = ({ onClick, disabled, title }) => {
  return (
    <button 
      className={`shuffle-button ${disabled ? 'shuffle-button--disabled' : ''}`} 
      onClick={disabled ? undefined : onClick} 
      aria-label="Shuffle locations"
      disabled={disabled}
      title={title}
    >
      <span className="shuffle-button__icon">
        <Dices size={20} />
      </span>
      <span className="shuffle-button__text">Shuffle</span>
    </button>
  );
};
