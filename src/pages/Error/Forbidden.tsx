import React from 'react';
import { useNavigate } from 'react-router-dom';
import SiteButton from '../../features/SiteButton/SiteButton';
import './ui/ErrorPages.css';

export const ForbiddenPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="error-page">
      <div className="error-page__emoji">🚧</div>
      <h1 className="error-page__title">403 - Доступ обмежено</h1>
      <p className="error-page__description">
        Доступ до цієї локації закрито. Можливо, потрібен спеціальний дозвіл або логін.
      </p>
      <SiteButton 
        text="Повернутися на головну" 
        onClick={() => navigate('/')} 
        className="error-page__button"
      />
    </div>
  );
};

export default ForbiddenPage;
