import React from 'react';
import { Dices } from 'lucide-react';
import './ui/ShuffleButton.css';

interface ShuffleButtonProps {
  onClick?: () => void;
}

export const ShuffleButton: React.FC<ShuffleButtonProps> = ({ onClick }) => {
  return (
    <button className="shuffle-button" onClick={onClick} aria-label="Shuffle locations">
      <span className="shuffle-button__icon">
        <Dices size={20} />
      </span>
      <span className="shuffle-button__text">Shuffle</span>
    </button>
  );
};
