import React, { createContext, useContext, useState, useEffect } from 'react';

interface HistoryLocation {
    id: string | number;
    name: string;
    imageUrl: string;
    address: string;
}

interface HistoryContextType {
    history: HistoryLocation[];
    addToHistory: (location: HistoryLocation) => void;
    clearHistory: () => void;
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

export const HistoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [history, setHistory] = useState<HistoryLocation[]>([]);

    useEffect(() => {
        const saved = localStorage.getItem('waygo-history');
        if (saved) setHistory(JSON.parse(saved));
    }, []);

    const addToHistory = (location: HistoryLocation) => {
        setHistory(prev => {
            // Remove duplicates and keep the most recent at the top
            const filtered = prev.filter(item => item.id !== location.id);
            const updated = [location, ...filtered].slice(0, 20); // Keep last 20
            localStorage.setItem('waygo-history', JSON.stringify(updated));
            return updated;
        });
    };

    const clearHistory = () => {
        setHistory([]);
        localStorage.removeItem('waygo-history');
    };

    return (
        <HistoryContext.Provider value={{ history, addToHistory, clearHistory }}>
            {children}
        </HistoryContext.Provider>
    );
};

export const useHistory = () => {
    const context = useContext(HistoryContext);
    if (!context) throw new Error("useHistory must be used within HistoryProvider");
    return context;
};