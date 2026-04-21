import React from 'react';
import { useNavigate } from 'react-router-dom';
import SiteButton from '../../features/SiteButton/SiteButton';
import './ui/ErrorPages.css';

export const ServerErrorPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="error-page">
      <div className="error-page__emoji">🔌</div>
      <h1 className="error-page__title">500 - Помилка сервера</h1>
      <p className="error-page__description">
        Наш сервер втратив вайб, але ми вже його шукаємо та лагодимо. Спробуйте пізніше.
      </p>
      <SiteButton 
        text="Повернутися на головну" 
        onClick={() => navigate('/')} 
        className="error-page__button"
      />
    </div>
  );
};

export default ServerErrorPage;
