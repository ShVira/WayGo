import React from 'react';
import { useNavigate } from 'react-router-dom';
import SiteButton from '../../features/SiteButton/SiteButton';
import './ui/ErrorPages.css';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="error-page">
      <div className="error-page__emoji">🗺️</div>
      <h1 className="error-page__title">404 - Сторінку не знайдено</h1>
      <p className="error-page__description">
        Цей вайб ще не знайдено. Можливо, він десь поруч, але не за цією адресою.
      </p>
      <SiteButton 
        text="Повернутися на головну" 
        onClick={() => navigate('/')} 
        className="error-page__button"
      />
    </div>
  );
};

export default NotFoundPage;
