import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { UserType } from '../../entities/user/model/UserType';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../app/api/firebase';

interface AppContextType {
    user: UserType | null;
    setUser: (user: UserType | null) => void;
    isBusy: boolean;
    setBusy: (busy: boolean) => void;
}

export const AppContext = createContext<AppContextType>({} as AppContextType);

export const AppProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<UserType | null>(null);
    const [isBusy, setBusy] = useState<boolean>(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                setUser({
                    id: firebaseUser.uid,
                    name: firebaseUser.displayName || 'Користувач',
                    email: firebaseUser.email || '',
                    imageUrl: firebaseUser.photoURL || undefined
                } as UserType);
            } else {
                setUser(null);
            }
            setBusy(false);
        });

        return () => unsubscribe();
    }, []);

    return (
        <AppContext.Provider value={{ user, setUser, isBusy, setBusy }}>
            {children}
        </AppContext.Provider>
    );
};