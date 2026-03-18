import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { UserType } from '../../entities/user/model/UserType';

interface AppContextType {
    user: UserType | null;
    setUser: (user: UserType | null) => void;
    isBusy: boolean;
    setBusy: (busy: boolean) => void;
}

export const AppContext = createContext<AppContextType>({} as AppContextType);

export const AppProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<UserType | null>(null);
    const [isBusy, setBusy] = useState<boolean>(false);

    // Initial Load: Check if a user is already saved in LocalStorage
    useEffect(() => {
        const savedUser = window.localStorage.getItem("user-231");
        if (savedUser) {
            try {
                setUser(JSON.parse(savedUser));
            } catch (e) {
                console.error("Failed to parse saved user", e);
            }
        }
    }, []);

    return (
        <AppContext.Provider value={{ user, setUser, isBusy, setBusy }}>
            {children}
        </AppContext.Provider>
    );
};