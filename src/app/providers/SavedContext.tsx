import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Location } from '../../entities/location/api/MockLocations';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../api/firebase';
import { AppContext } from '../../features/app-context/AppContext';

const SavedContext = createContext<any>(null);

export const SavedProvider = ({ children }: { children: React.ReactNode }) => {
  const [savedLocations, setSavedLocations] = useState<Location[]>([]);
  const [visitedLocations, setVisitedLocations] = useState<Location[]>([]);
  const { user } = useContext(AppContext);

  const [message, setMessage] = useState<{ text: string, type: 'info' | 'success' | 'error' } | null>(null);

  useEffect(() => {
    if (!user?.uid) {
      setSavedLocations([]);
      setVisitedLocations([]);
      return;
    }

    const docRef = doc(db, 'users', user.uid);

    const unsubscribe = onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setSavedLocations(data.savedLocations || []);
          setVisitedLocations(data.visitedLocations || []);
        } else {
          setSavedLocations([]);
          setVisitedLocations([]);
        }
      },
      (error) => {
        console.error('Firestore onSnapshot error:', error);
      }
    );

    return () => unsubscribe();
  }, [user?.uid]);

  const toggleSave = useCallback(
    async (location: Location) => {
      if (!user?.uid) {
        setMessage({ text: 'Будь ласка, увійдіть, щоб зберігати місця.', type: 'info' });
        return;
      }

      const isAlreadySaved = savedLocations.find((l) => l.id === location.id);
      const newSaved = isAlreadySaved
        ? savedLocations.filter((l) => l.id !== location.id)
        : [...savedLocations, { ...location, isSaved: true }];

      try {
        const docRef = doc(db, 'users', user.uid);
        await setDoc(docRef, { savedLocations: newSaved }, { merge: true });
        setMessage({ text: isAlreadySaved ? 'Видалено зі збережених' : 'Збережено!', type: 'success' });
      } catch (error) {
        console.error('Error saving to Firestore:', error);
        setMessage({ text: 'Помилка збереження', type: 'error' });
      }
    },
    [user?.uid, savedLocations]
  );

  const toggleVisit = useCallback(
    async (location: Location, status: 'liked' | 'disliked' | null) => {
      if (!user?.uid) {
        setMessage({ text: 'Будь ласка, увійдіть, щоб оцінювати місця.', type: 'info' });
        return;
      }

      let newVisited: Location[];
      const existingIndex = visitedLocations.findIndex((l) => l.id === location.id);

      if (status === null) {
        newVisited = visitedLocations.filter((l) => l.id !== location.id);
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
        const docRef = doc(db, 'users', user.uid);
        await setDoc(docRef, { visitedLocations: newVisited }, { merge: true });
        setMessage({ text: status ? 'Відмітку збережено' : 'Відмітку видалено', type: 'success' });
      } catch (error) {
        console.error('Error updating visited status in Firestore:', error);
        setMessage({ text: 'Помилка оновлення статусу', type: 'error' });
      }
    },
    [user?.uid, visitedLocations]
  );

  return (
    <SavedContext.Provider
      value={{ savedLocations, visitedLocations, toggleSave, toggleVisit, message, setMessage }}
    >
      {children}
    </SavedContext.Provider>
  );
};

export const useSaved = () => useContext(SavedContext);