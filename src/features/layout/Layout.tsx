

import React from 'react';
import { Header } from '../header/header';
import { NavigationBar } from '../navigation-bar/NavigationBar';
import './ui/Layout.css';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="layout">
      <Header />
      <main className="layout__content">
        {children}
      </main>
      <NavigationBar />
    </div>
  );
};

