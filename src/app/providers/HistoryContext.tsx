import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface HistoryLocation {
    id: string | number;
    name: string;
    imageUrl: string;
    address: string;
    visitStatus?: 'liked' | 'disliked' | null;
}

interface HistoryContextType {
    history: HistoryLocation[];
    addToHistory: (location: HistoryLocation) => void;
    clearHistory: () => void;
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

export const HistoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [history, setHistory] = useState<HistoryLocation[]>([]);

    // Load initial state
    useEffect(() => {
        const saved = localStorage.getItem('waygo-history');
        if (saved) {
            try {
                setHistory(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse history", e);
            }
        }
    }, []);

    // Persist state changes
    useEffect(() => {
        if (history.length > 0) {
            localStorage.setItem('waygo-history', JSON.stringify(history));
        }
    }, [history]);

    const addToHistory = useCallback((location: HistoryLocation) => {
        setHistory(prev => {
            // Remove duplicates and keep the most recent at the top
            const filtered = prev.filter(item => item.id !== location.id);
            const updated = [location, ...filtered].slice(0, 20); // Keep last 20
            return updated;
        });
    }, []);

    const clearHistory = useCallback(() => {
        setHistory([]);
        localStorage.removeItem('waygo-history');
    }, []);

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
