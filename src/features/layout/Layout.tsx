

import React from 'react';
import { Header } from '../header/header';
import { NavigationBar } from '../navigation-bar/NavigationBar';
import './ui/Layout.css';
import { useSaved } from '../../app/providers/SavedContext';
import { Toast } from '../../shared/ui/Toast/Toast';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { message, setMessage } = useSaved();

  return (
    <div className="layout">
      <Header />
      <main className="layout__content">
        {children}
      </main>
      <NavigationBar />
      {message && (
        <Toast 
          message={message.text} 
          type={message.type} 
          onClose={() => setMessage(null)} 
        />
      )}
    </div>
  );
};

