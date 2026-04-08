import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Location } from '../../entities/location/api/MockLocations';
import { doc, setDoc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../api/firebase';
import { AppContext } from '../../features/app-context/AppContext';

const SavedContext = createContext<any>(null);

export const SavedProvider = ({ children }: { children: React.ReactNode }) => {
  const [savedLocations, setSavedLocations] = useState<Location[]>([]);
  const [visitedLocations, setVisitedLocations] = useState<Location[]>([]);
  const { user } = useContext(AppContext);

  // Load from Firestore when user changes
  useEffect(() => {
    if (!user) {
      setSavedLocations([]);
      setVisitedLocations([]);
      return;
    }

    const docRef = doc(db, 'users', user.id);
    
    // Use onSnapshot for real-time updates
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setSavedLocations(data.savedLocations || []);
        setVisitedLocations(data.visitedLocations || []);
      } else {
        setSavedLocations([]);
        setVisitedLocations([]);
      }
    });

    return () => unsubscribe();
  }, [user]);

  const toggleSave = useCallback(async (location: Location) => {
    if (!user) {
      alert("Будь ласка, увійдіть, щоб зберігати місця.");
      return;
    }

    const isAlreadySaved = savedLocations.find(l => l.id === location.id);
    const newSaved = isAlreadySaved
      ? savedLocations.filter(l => l.id !== location.id)
      : [...savedLocations, { ...location, isSaved: true }];

    try {
      const docRef = doc(db, 'users', user.id);
      await setDoc(docRef, { savedLocations: newSaved }, { merge: true });
    } catch (error) {
      console.error("Error saving to Firestore:", error);
    }
  }, [user, savedLocations]);

  const toggleVisit = useCallback(async (location: Location, status: 'liked' | 'disliked' | null) => {
    if (!user) {
      alert("Будь ласка, увійдіть, щоб оцінювати місця.");
      return;
    }

    let newVisited;
    const existingIndex = visitedLocations.findIndex(l => l.id === location.id);

    if (status === null) {
      newVisited = visitedLocations.filter(l => l.id !== location.id);
    } else {
      const updatedLocation = { ...location, visitStatus: status };
      if (existingIndex > -1) {
        newVisited = [...visitedLocations];
        newVisited[existingIndex] = updatedLocation;
      } else {
        newVisited = [...visitedLocations, updatedLocation];
      }
    }

    try {
      const docRef = doc(db, 'users', user.id);
      await setDoc(docRef, { visitedLocations: newVisited }, { merge: true });
    } catch (error) {
      console.error("Error updating visited status in Firestore:", error);
    }
  }, [user, visitedLocations]);

  return (
    <SavedContext.Provider value={{ savedLocations, visitedLocations, toggleSave, toggleVisit }}>
      {children}
    </SavedContext.Provider>
  );
};

export const useSaved = () => useContext(SavedContext);
