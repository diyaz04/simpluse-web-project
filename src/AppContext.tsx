import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from './firebase';

interface Content {
  hero: { title: string; subtitle: string };
  about: { title: string; description: string };
  portfolio: any[];
  services: any[];
}

interface AppContextType {
  user: User | null;
  loading: boolean;
  content: Content | null;
}

const AppContext = createContext<AppContextType>({ user: null, loading: true, content: null });

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState<Content | null>(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    // Safety timeout: if auth doesn't respond in 5 seconds, stop loading
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 5000);

    const unsubscribeContent = onSnapshot(
      doc(db, 'content', 'landing'),
      (snapshot) => {
        if (snapshot.exists()) {
          setContent(snapshot.data() as Content);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'content/landing');
      }
    );

    return () => {
      unsubscribeAuth();
      unsubscribeContent();
      clearTimeout(timeout);
    };
  }, []);

  return (
    <AppContext.Provider value={{ user, loading, content }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
