import React, { createContext, useContext, useState, useEffect } from 'react';
import { Location } from '../../entities/location/api/MockLocations';
import { doc, setDoc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../api/firebase';
import { AppContext } from '../../features/app-context/AppContext';

const SavedContext = createContext<any>(null);

export const SavedProvider = ({ children }: { children: React.ReactNode }) => {
  const [savedLocations, setSavedLocations] = useState<Location[]>([]);
  const { user } = useContext(AppContext);

  // Load from Firestore when user changes
  useEffect(() => {
    if (!user) {
      setSavedLocations([]);
      return;
    }

    const docRef = doc(db, 'users', user.id);
    
    // Use onSnapshot for real-time updates
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setSavedLocations(docSnap.data().savedLocations || []);
      } else {
        setSavedLocations([]);
      }
    });

    return () => unsubscribe();
  }, [user]);

  const toggleSave = async (location: Location) => {
    if (!user) {
      alert("Будь ласка, увійдіть, щоб зберігати місця.");
      return;
    }

    const isAlreadySaved = savedLocations.find(l => l.id === location.id);
    const newSaved = isAlreadySaved
      ? savedLocations.filter(l => l.id !== location.id)
      : [...savedLocations, location];

    try {
      const docRef = doc(db, 'users', user.id);
      await setDoc(docRef, { savedLocations: newSaved }, { merge: true });
    } catch (error) {
      console.error("Error saving to Firestore:", error);
    }
  };

  return (
    <SavedContext.Provider value={{ savedLocations, toggleSave }}>
      {children}
    </SavedContext.Provider>
  );
};

export const useSaved = () => useContext(SavedContext);
