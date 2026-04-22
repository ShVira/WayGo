import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { UserType } from '../../entities/user/model/UserType';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../app/api/firebase';
import UserDao from '../../entities/user/api/UserDao';

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
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                try {
                    const firestoreUser = await UserDao.getUser(firebaseUser.uid);
                    if (firestoreUser) {
                        setUser(firestoreUser);
                    } else {
                        // Minimal fallback if Firestore document is not found (e.g., legacy users or right after registration)
                        setUser({
                            uid: firebaseUser.uid,
                            fullName: firebaseUser.displayName || 'Користувач',
                            email: firebaseUser.email || '',
                            username: '',
                            dateOfBirth: '',
                            city: '',
                            phoneNumber: '',
                            bio: ''
                        } as UserType);
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                }
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