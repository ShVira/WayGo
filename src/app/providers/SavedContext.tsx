import React, { createContext, useContext, useState, useEffect } from 'react';
import { Location } from '../../entities/location/api/MockLocations';

const SavedContext = createContext<any>(null);

export const SavedProvider = ({ children }: { children: React.ReactNode }) => {
 // Inside SavedContext.tsx
const [savedLocations, setSavedLocations] = useState<Location[]>(() => {
  const saved = localStorage.getItem('waygo_saved');
  return saved ? JSON.parse(saved) : [];
});

useEffect(() => {
  localStorage.setItem('waygo_saved', JSON.stringify(savedLocations));
}, [savedLocations]);
  const toggleSave = (location: Location) => {
    setSavedLocations(prev => 
      prev.find(l => l.id === location.id) 
        ? prev.filter(l => l.id !== location.id) 
        : [...prev, location]
    );
  };

  return (
    <SavedContext.Provider value={{ savedLocations, toggleSave }}>
      {children}
    </SavedContext.Provider>
  );
};

export const useSaved = () => useContext(SavedContext);